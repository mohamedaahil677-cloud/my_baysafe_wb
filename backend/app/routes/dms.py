from flask import Blueprint, request, jsonify
from ..models import User, VolunteerTask, SafeCamp, Helpline, Post, HazardSpot, VolunteerProfile, DirectMessage
from .. import db
import jwt
import os
import datetime
from werkzeug.utils import secure_filename

dms_bp = Blueprint('dms', __name__)

def get_user_from_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(" ")[1]
    try:
        data = jwt.decode(token, os.environ.get('SECRET_KEY', 'dev-secret-key'), algorithms=['HS256'])
        user = User.query.get(data['user_id'])
        return user
    except Exception:
        return None

# ── HELPLINES ──────────────────────────────────────────────────────────────
@dms_bp.route('/helplines', methods=['GET'])
def get_helplines():
    helplines = Helpline.query.all()
    return jsonify([{
        'id': h.id, 'category': h.category, 'state': h.state, 'district': h.district,
        'zone': h.zone, 'name': h.name, 'number': h.number, 'icon': h.icon, 'website': h.website
    } for h in helplines])

@dms_bp.route('/helplines', methods=['POST'])
def add_helpline():
    user = get_user_from_token()
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    data = request.get_json()
    new_h = Helpline(
        category=data.get('category'), state=data.get('state'),
        district=data.get('district'), zone=data.get('zone'),
        name=data.get('name'), number=data.get('number'),
        icon=data.get('icon'), website=data.get('website')
    )
    db.session.add(new_h)
    db.session.commit()
    return jsonify({'message': 'Helpline added successfully'}), 201

# ── SAFECAMPS ──────────────────────────────────────────────────────────────
@dms_bp.route('/safecamps', methods=['GET'])
def get_safecamps():
    camps = SafeCamp.query.all()
    return jsonify([{
        'id': c.id, 'name': c.name, 'city': c.city, 'district': c.district,
        'lat': c.latitude, 'lon': c.longitude, 'capacity': c.capacity,
        'occupancy': c.current_occupancy, 'facilities': c.facilities,
        'nodal_officer': c.nodal_officer, 'contact': c.contact
    } for c in camps])

@dms_bp.route('/safecamps', methods=['POST'])
def add_safecamp():
    user = get_user_from_token()
    if not user or user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403
    data = request.get_json()
    new_c = SafeCamp(
        name=data.get('name'), city=data.get('city'), district=data.get('district'),
        latitude=data.get('lat'), longitude=data.get('lon'), capacity=data.get('capacity'),
        current_occupancy=data.get('occupancy', 0), facilities=data.get('facilities'),
        nodal_officer=data.get('nodal_officer'), contact=data.get('contact')
    )
    db.session.add(new_c)
    db.session.commit()
    return jsonify({'message': 'SafeCamp added successfully'}), 201

# ── HAZARD SPOTS ────────────────────────────────────────────────────────────
@dms_bp.route('/hazards', methods=['GET'])
def get_hazards():
    city = request.args.get('city')
    query = HazardSpot.query
    if city:
        query = query.filter_by(city=city)
    hazards = query.all()
    return jsonify([{
        'id': h.id, 'category': h.category, 'name': h.name, 'city': h.city,
        'lat': h.latitude, 'lon': h.longitude, 'road': h.road,
        'contact': h.contact, 'is_official': h.is_official, 'details': h.details
    } for h in hazards])

@dms_bp.route('/hazards', methods=['POST'])
def add_hazard():
    user = get_user_from_token()
    if not user:
        return jsonify({'message': 'Authentication required'}), 401
    data = request.get_json()
    new_h = HazardSpot(
        category=data.get('category'), name=data.get('name'), city=data.get('city'),
        latitude=data.get('lat'), longitude=data.get('lon'), road=data.get('road'),
        contact=data.get('contact'), is_official=user.role == 'admin', details=data.get('details')
    )
    db.session.add(new_h)
    db.session.commit()
    return jsonify({'message': 'Hazard reported successfully', 'id': new_h.id}), 201

# ── VOLUNTEER SYNC ─────────────────────────────────────────────────────────
@dms_bp.route('/volunteers/active', methods=['GET'])
def get_active_volunteers():
    city = request.args.get('city', '')
    query = User.query.filter_by(role='volunteer', is_online=True)
    if city:
        query = query.filter(User.city.ilike(f'%{city}%'))
    volunteers = query.all()
    result = []
    for v in volunteers:
        vp = VolunteerProfile.query.filter_by(user_id=v.id).first()
        result.append({
            'id': v.id, 'username': v.username, 'expertise': v.expertise,
            'lat': v.current_lat, 'lon': v.current_lon, 'address': v.address,
            'city': v.city,
            'full_name': vp.full_name if vp else v.username,
            'role_type': vp.role_type if vp else '',
            'department': vp.department if vp else '',
            'qualification': vp.qualification if vp else '',
            'area_of_operation': vp.area_of_operation if vp else '',
            'has_med_kit': vp.has_med_kit if vp else False,
            'is_available': vp.is_available if vp else True,
        })
    return jsonify(result)

@dms_bp.route('/volunteer/checkin', methods=['POST'])
def volunteer_checkin():
    user = get_user_from_token()
    if not user or user.role != 'volunteer':
        return jsonify({'message': 'Volunteer access required'}), 403
    data = request.get_json()
    user.is_online = data.get('is_online', True)
    user.current_lat = data.get('lat')
    user.current_lon = data.get('lon')
    user.address = data.get('address')
    user.expertise = data.get('expertise')
    user.equipment = data.get('equipment')
    user.identity_type = data.get('id_type')
    user.identity_id = data.get('id_val')
    user.dp_url = data.get('dp_url')
    db.session.commit()
    return jsonify({'message': 'Status updated successfully', 'is_online': user.is_online})

# ── VOLUNTEER PROFILE ─────────────────────────────────────────────────────
@dms_bp.route('/volunteer/profile', methods=['GET'])
def get_volunteer_profile():
    user = get_user_from_token()
    if not user or user.role not in ('volunteer', 'admin'):
        return jsonify({'message': 'Volunteer access required'}), 403
    vp = VolunteerProfile.query.filter_by(user_id=user.id).first()
    if not vp:
        return jsonify(None), 200
    return jsonify({
        'id': vp.id, 'full_name': vp.full_name, 'address': vp.address, 'city': vp.city,
        'qualification': vp.qualification, 'area_of_operation': vp.area_of_operation,
        'role_type': vp.role_type, 'department': vp.department,
        'has_med_kit': vp.has_med_kit, 'needed_items': vp.needed_items,
        'is_available': vp.is_available
    })

@dms_bp.route('/volunteer/profile', methods=['POST'])
def save_volunteer_profile():
    user = get_user_from_token()
    if not user or user.role not in ('volunteer', 'admin'):
        return jsonify({'message': 'Volunteer access required'}), 403
    data = request.get_json()
    vp = VolunteerProfile.query.filter_by(user_id=user.id).first()
    if not vp:
        vp = VolunteerProfile(user_id=user.id)
        db.session.add(vp)
    vp.full_name = data.get('full_name', user.username)
    vp.address = data.get('address', '')
    vp.city = data.get('city', '')
    vp.qualification = data.get('qualification', '')
    vp.area_of_operation = data.get('area_of_operation', '')
    vp.role_type = data.get('role_type', '')
    vp.department = data.get('department', '')
    vp.has_med_kit = data.get('has_med_kit', False)
    vp.needed_items = data.get('needed_items', '')
    vp.is_available = data.get('is_available', True)
    # Sync city to User for filtering
    user.city = vp.city
    user.is_online = True
    db.session.commit()
    return jsonify({'message': 'Volunteer profile saved'}), 200

@dms_bp.route('/volunteers/list', methods=['GET'])
def list_volunteers():
    """Public list of volunteers with their profile, filtered by city."""
    city = request.args.get('city', '')
    query = VolunteerProfile.query
    if city:
        query = query.filter(VolunteerProfile.city.ilike(f'%{city}%'))
    profiles = query.all()
    result = []
    for vp in profiles:
        user = User.query.get(vp.user_id)
        result.append({
            'id': vp.user_id,
            'full_name': vp.full_name,
            'city': vp.city,
            'address': vp.address,
            'qualification': vp.qualification,
            'area_of_operation': vp.area_of_operation,
            'role_type': vp.role_type,
            'department': vp.department,
            'has_med_kit': vp.has_med_kit,
            'needed_items': vp.needed_items,
            'is_available': user.is_online if user else vp.is_available,
        })
    return jsonify(result)

# ── UPLOADS ───────────────────────────────────────────────────────────────
@dms_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        filename = f"{int(datetime.datetime.utcnow().timestamp())}_{filename}"
        upload_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), '..', '..', 'uploads')
        if not os.path.exists(upload_path):
            os.makedirs(upload_path)
        file.save(os.path.join(upload_path, filename))
        file_url = f"/uploads/{filename}"
        return jsonify({'url': file_url}), 201

# ── POSTS / SOCIAL FEED ──────────────────────────────────────────────────
@dms_bp.route('/posts', methods=['GET'])
def get_posts():
    city = request.args.get('city', '')
    query = Post.query
    if city:
        query = query.filter(Post.city.ilike(f'%{city}%'))
    posts = query.order_by(Post.timestamp.desc()).all()
    return jsonify([{
        'id': p.id, 'author_id': p.author_id, 'author_name': p.author_name,
        'author_role': p.author_role, 'content': p.content,
        'image_url': p.image_url, 'location': p.location,
        'city': p.city, 'task_id': p.task_id,
        'timestamp': p.timestamp.isoformat()
    } for p in posts])

# ── SOS / RESCUE TASKS ──────────────────────────────────────────────────
@dms_bp.route('/tasks', methods=['GET'])
def get_tasks():
    city = request.args.get('city', '')
    status = request.args.get('status', '')
    query = VolunteerTask.query
    if city:
        query = query.filter(VolunteerTask.city.ilike(f'%{city}%'))
    if status:
        query = query.filter_by(status=status.upper())
    tasks = query.order_by(VolunteerTask.created_at.desc()).all()
    return jsonify([_task_dict(t) for t in tasks])

def _task_dict(t):
    requester = User.query.get(t.requester_id) if t.requester_id else None
    volunteer = User.query.get(t.volunteer_id) if t.volunteer_id else None
    return {
        'id': t.id, 'title': t.title, 'desc': t.description,
        'situation': t.situation, 'needed_things': t.needed_things,
        'rescue_type': t.rescue_type,
        'requester_name': t.requester_name,
        'requester_phone': t.requester_phone,
        'location': t.location_name, 'city': t.city,
        'category': t.category, 'urgency': t.urgency,
        'lat': t.lat, 'lon': t.lon,
        'status': t.status,
        'requester_id': t.requester_id,
        'requester_username': requester.username if requester else None,
        'volunteer_id': t.volunteer_id,
        'volunteer_name': volunteer.username if volunteer else None,
        'report_desc': t.report_desc, 'report_img': t.report_img,
        'created_at': t.created_at.isoformat()
    }

@dms_bp.route('/tasks', methods=['POST'])
def create_task():
    user = get_user_from_token()
    # Only authenticated users can submit task forms
    if not user or user.role not in ('user', 'admin'):
        return jsonify({'message': 'User login required to submit rescue requests'}), 403

    data = request.get_json()
    try:
        city = data.get('city') or (user.city if user else '')
        new_t = VolunteerTask(
            title=data.get('title') or f"Rescue Request from {data.get('requester_name', user.username)}",
            description=data.get('desc', ''),
            situation=data.get('situation', ''),
            needed_things=data.get('needed_things', ''),
            rescue_type=data.get('rescue_type', ''),
            requester_name=data.get('requester_name', user.username if user else 'Anonymous'),
            requester_phone=data.get('requester_phone', ''),
            location_name=data.get('location', ''),
            city=city,
            category=data.get('category', 'Rescue'),
            urgency=data.get('urgency', 'High'),
            lat=data.get('lat'),
            lon=data.get('lon'),
            requester_id=user.id if user else None,
            report_img=data.get('report_img'),
            status='PENDING'
        )
        db.session.add(new_t)
        db.session.flush()

        # Auto-create a social feed Post (like an Instagram post)
        new_post = Post(
            author_id=user.id if user else None,
            author_name=data.get('requester_name', user.username if user else 'Anonymous'),
            author_role='user',
            content=(
                f"🚨 RESCUE REQUEST\n"
                f"📋 Situation: {data.get('situation', '')}\n"
                f"🍱 Needs: {data.get('needed_things', '')}\n"
                f"⛑️ Rescue Type: {data.get('rescue_type', '')}\n"
                f"📍 Location: {data.get('location', '')}"
            ),
            image_url=data.get('report_img'),
            location=data.get('location', ''),
            city=city,
            task_id=new_t.id
        )
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'message': 'Rescue request submitted!', 'task_id': new_t.id}), 201
    except Exception as e:
        db.session.rollback()
        import traceback; traceback.print_exc()
        return jsonify({'message': 'Failed to create rescue request', 'error': str(e)}), 500

@dms_bp.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = VolunteerTask.query.get_or_404(task_id)
    return jsonify(_task_dict(task))

@dms_bp.route('/tasks/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    user = get_user_from_token()
    if not user:
        return jsonify({'message': 'Authentication required'}), 401
    task = VolunteerTask.query.get_or_404(task_id)
    data = request.get_json()

    if data.get('action') == 'accept':
        if user.role != 'volunteer':
            return jsonify({'message': 'Only volunteers can accept tasks'}), 403
        task.volunteer_id = user.id
        task.status = 'ONGOING'

    elif data.get('action') == 'complete':
        if task.volunteer_id != user.id and user.role != 'admin':
            return jsonify({'message': 'Not assigned to this task'}), 403
        task.status = 'CLOSED'
        task.closed_comment = data.get('comment', 'Task completed by volunteer.')

    elif data.get('action') == 'report':
        if task.volunteer_id != user.id:
            return jsonify({'message': 'Not assigned to this task'}), 403
        task.status = 'AWAITING_APPROVAL'
        task.report_desc = data.get('report_desc')
        task.report_img = data.get('report_img')

    elif data.get('action') == 'approve':
        if task.requester_id != user.id:
            return jsonify({'message': 'Only requester can approve'}), 403
        task.status = 'CLOSED'
        task.closed_comment = data.get('comment')

    db.session.commit()
    return jsonify({'message': f'Task updated: {task.status}', 'task': _task_dict(task)})

# ── DIRECT MESSAGES (User → Volunteer) ─────────────────────────────────
@dms_bp.route('/messages/send', methods=['POST'])
def send_message():
    user = get_user_from_token()
    if not user:
        return jsonify({'message': 'Authentication required'}), 401
    data = request.get_json()
    receiver_id = data.get('receiver_id')
    content = data.get('content', '').strip()
    if not receiver_id or not content:
        return jsonify({'message': 'receiver_id and content are required'}), 400
    dm = DirectMessage(sender_id=user.id, receiver_id=receiver_id, content=content)
    db.session.add(dm)
    db.session.commit()
    return jsonify({'message': 'Message sent', 'id': dm.id}), 201

@dms_bp.route('/messages/<int:volunteer_id>', methods=['GET'])
def get_messages(volunteer_id):
    user = get_user_from_token()
    if not user:
        return jsonify({'message': 'Authentication required'}), 401
    msgs = DirectMessage.query.filter(
        ((DirectMessage.sender_id == user.id) & (DirectMessage.receiver_id == volunteer_id)) |
        ((DirectMessage.sender_id == volunteer_id) & (DirectMessage.receiver_id == user.id))
    ).order_by(DirectMessage.timestamp.asc()).all()
    return jsonify([{
        'id': m.id, 'sender_id': m.sender_id, 'receiver_id': m.receiver_id,
        'content': m.content, 'timestamp': m.timestamp.isoformat(), 'is_read': m.is_read
    } for m in msgs])

@dms_bp.route('/messages/inbox', methods=['GET'])
def get_inbox():
    """For volunteers to see all incoming messages."""
    user = get_user_from_token()
    if not user:
        return jsonify({'message': 'Authentication required'}), 401
    msgs = DirectMessage.query.filter_by(receiver_id=user.id).order_by(DirectMessage.timestamp.desc()).all()
    return jsonify([{
        'id': m.id, 'sender_id': m.sender_id, 'content': m.content,
        'timestamp': m.timestamp.isoformat(), 'is_read': m.is_read
    } for m in msgs])
