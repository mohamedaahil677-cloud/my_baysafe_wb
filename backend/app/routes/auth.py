from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import random
import os
from ..models import User
from .. import db

auth_bp = Blueprint('auth', __name__)

# ── In-memory OTP store (keyed by normalized mobile number) ──
# Format: { "+91XXXXXXXXXX": {"otp": "123456", "expires_at": datetime} }
_otp_store = {}
OTP_EXPIRY_MINUTES = 10


def _get_twilio_client():
    """Returns Twilio client if credentials are configured, else None."""
    sid   = os.environ.get('TWILIO_ACCOUNT_SID', '')
    token = os.environ.get('TWILIO_AUTH_TOKEN', '')
    if sid and token and sid != 'your_account_sid':
        try:
            from twilio.rest import Client
            return Client(sid, token)
        except ImportError:
            return None
    return None


# ── POST /api/auth/send-otp ──────────────────────────────────
@auth_bp.route('/send-otp', methods=['POST'])
def send_otp():
    data   = request.get_json()
    mobile = (data or {}).get('mobile', '').strip()

    if not mobile:
        return jsonify({'message': 'Mobile number is required.'}), 400

    # Normalize to +91XXXXXXXXXX
    if not mobile.startswith('+'):
        mobile = '+91' + mobile.lstrip('0')

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=OTP_EXPIRY_MINUTES)
    _otp_store[mobile] = {'otp': otp, 'expires_at': expires_at}

    client = _get_twilio_client()
    if client:
        # Real Twilio SMS
        try:
            client.messages.create(
                body=f"Your BaySafe DMS OTP is: {otp}. Valid for {OTP_EXPIRY_MINUTES} minutes. Do not share.",
                from_=os.environ.get('TWILIO_PHONE_NUMBER'),
                to=mobile
            )
            return jsonify({'message': f'OTP sent to {mobile} via SMS.'}), 200
        except Exception as e:
            print(f"[TWILIO ERROR] {str(e)} -> Falling back to Dev Mode")
            print(f"[DEV MODE] OTP for {mobile}: {otp}")
            return jsonify({
                'message': f'[Fallback] Twilio error. OTP generated offline.',
                'mock_otp': otp
            }), 200
    else:
        # Dev/mock mode – return OTP in response for testing
        print(f"[DEV MODE] OTP for {mobile}: {otp}")
        return jsonify({
            'message': f'[Dev mode] Twilio not configured. OTP generated.',
            'mock_otp': otp
        }), 200


# ── POST /api/auth/verify-otp ────────────────────────────────
@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data   = request.get_json()
    mobile = (data or {}).get('mobile', '').strip()
    otp    = (data or {}).get('otp', '').strip()

    if not mobile or not otp:
        return jsonify({'verified': False, 'message': 'Mobile and OTP are required.'}), 400

    if not mobile.startswith('+'):
        mobile = '+91' + mobile.lstrip('0')

    record = _otp_store.get(mobile)
    if not record:
        return jsonify({'verified': False, 'message': 'No OTP found for this number. Please request a new one.'}), 400

    if datetime.datetime.utcnow() > record['expires_at']:
        del _otp_store[mobile]
        return jsonify({'verified': False, 'message': 'OTP has expired. Please request a new one.'}), 400

    if record['otp'] != otp:
        return jsonify({'verified': False, 'message': 'Incorrect OTP.'}), 400

    # Clear OTP after successful verification
    del _otp_store[mobile]
    return jsonify({'verified': True, 'message': 'OTP verified successfully.'}), 200


# ── POST /api/auth/register ──────────────────────────────────
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data:
        return jsonify({'message': 'No data provided.'}), 400

    # Check for duplicate username / mobile
    username = data.get('username', '').strip()
    mobile   = data.get('mobile_number', '').strip()

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already taken. Choose a different one.'}), 409

    if mobile and User.query.filter_by(mobile_number=mobile).first():
        return jsonify({'message': 'Mobile number already registered.'}), 409

    hashed_pw = generate_password_hash(data['password'], method='pbkdf2:sha256')

    new_user = User(
        username=username,
        email=data.get('email', None),
        mobile_number=mobile or None,
        password_hash=hashed_pw,
        role=data.get('role', 'user'),
        address=data.get('address', ''),
        city=data.get('city', ''),
        is_verified=True,   # OTP already verified before reaching here
    )

    db.session.add(new_user)
    db.session.commit()

    # Issue JWT on successful registration
    token = jwt.encode(
        {
            'user_id': new_user.id,
            'role': new_user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        },
        os.environ.get('SECRET_KEY', 'dev-secret-key'),
        algorithm='HS256',
    )

    return jsonify({
        'message': 'User registered successfully.',
        'token': token,
        'role': new_user.role,
    }), 201


# ── POST /api/auth/login ─────────────────────────────────────
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided.'}), 400

    identifier = data.get('identifier', '').strip()
    password   = data.get('password', '')

    user = User.query.filter(
        (User.username == identifier) |
        (User.email == identifier) |
        (User.mobile_number == identifier)
    ).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials. Check your email/username/mobile and password.'}), 401

    token = jwt.encode(
        {
            'user_id': user.id,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
        },
        os.environ.get('SECRET_KEY', 'dev-secret-key'),
        algorithm='HS256',
    )

    return jsonify({
        'token': token,
        'role': user.role,
        'username': user.username,
        'city': user.city or '',
        'user_id': user.id,
    }), 200
