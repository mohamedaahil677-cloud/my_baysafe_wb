from flask import Blueprint, request, jsonify
from ..models import User, City, SafeCamp, VolunteerTask, WeatherDataRecord, Helpline, HazardSpot, VolunteerProfile
from .. import db
import jwt
import os
from datetime import datetime

admin_bp = Blueprint('admin_api', __name__)

def get_admin_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(" ")[1]
    try:
        data = jwt.decode(token, os.environ.get('SECRET_KEY', 'dev-secret-key'), algorithms=['HS256'])
        user = User.query.get(data['user_id'])
        if user and user.role == 'admin':
            return user
    except:
        pass
    return None

@admin_bp.before_request
def check_admin():
    if request.method == 'OPTIONS':
        return
    if not get_admin_user():
        return jsonify({'message': 'Admin access denied. Insufficient permissions.'}), 403

# ─── CITIES ──────────────────────────────────────────────────────────────────
@admin_bp.route('/cities', methods=['GET'])
def get_cities():
    cities = City.query.all()
    return jsonify([{
        'id': c.id, 'name': c.name, 'state': c.state,
        'lat': c.latitude, 'lon': c.longitude, 'risk_level': c.risk_level,
        'description': c.description, 'created_at': c.created_at.isoformat()
    } for c in cities])

@admin_bp.route('/cities', methods=['POST'])
def add_city():
    data = request.get_json()
    new_c = City(
        name=data.get('name'), state=data.get('state'),
        latitude=data.get('lat'), longitude=data.get('lon'),
        risk_level=data.get('risk_level', 'Low'),
        description=data.get('description')
    )
    db.session.add(new_c)
    db.session.commit()
    return jsonify({'message': 'City added successfully', 'id': new_c.id}), 201

@admin_bp.route('/cities/<int:id>', methods=['PUT'])
def update_city(id):
    city = City.query.get_or_404(id)
    data = request.get_json()
    city.name = data.get('name', city.name)
    city.state = data.get('state', city.state)
    city.latitude = data.get('lat', city.latitude)
    city.longitude = data.get('lon', city.longitude)
    city.risk_level = data.get('risk_level', city.risk_level)
    city.description = data.get('description', city.description)
    db.session.commit()
    return jsonify({'message': 'City updated successfully'})

@admin_bp.route('/cities/<int:id>', methods=['DELETE'])
def delete_city(id):
    city = City.query.get_or_404(id)
    db.session.delete(city)
    db.session.commit()
    return jsonify({'message': 'City deleted successfully'})

# ─── USERS ───────────────────────────────────────────────────────────────────
@admin_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': u.id, 'username': u.username, 'role': u.role,
        'city': u.city, 'is_verified': u.is_verified,
        'created_at': u.created_at.isoformat()
    } for u in users])

@admin_bp.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    user.role = data.get('role', user.role)
    user.is_verified = data.get('is_verified', user.is_verified)
    user.city = data.get('city', user.city)
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

@admin_bp.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

# ─── VOLUNTEERS ──────────────────────────────────────────────────────────────
@admin_bp.route('/volunteers', methods=['GET'])
def get_volunteers():
    profiles = VolunteerProfile.query.all()
    return jsonify([{
        'id': p.id, 'user_id': p.user_id, 'full_name': p.full_name,
        'city': p.city, 'role_type': p.role_type, 'is_available': p.is_available
    } for p in profiles])

# ─── WEATHER RECORDS ─────────────────────────────────────────────────────────
@admin_bp.route('/weather-records', methods=['GET'])
def get_weather_records():
    records = WeatherDataRecord.query.all()
    return jsonify([{
        'id': r.id, 'city_id': r.city_id, 'city_name': r.city.name,
        'temp': r.temp, 'humidity': r.humidity, 'rainfall': r.rainfall,
        'condition': r.condition, 'timestamp': r.timestamp.isoformat()
    } for r in records])

@admin_bp.route('/weather-records', methods=['POST'])
def add_weather_record():
    data = request.get_json()
    new_r = WeatherDataRecord(
        city_id=data.get('city_id'),
        temp=data.get('temp'),
        humidity=data.get('humidity'),
        wind_speed=data.get('wind_speed'),
        rainfall=data.get('rainfall'),
        condition=data.get('condition'),
        analysis=data.get('analysis')
    )
    db.session.add(new_r)
    db.session.commit()
    return jsonify({'message': 'Weather record added successfully'}), 201

# ─── TASKS / SOS ─────────────────────────────────────────────────────────────
@admin_bp.route('/tasks', methods=['GET'])
def get_tasks_admin():
    tasks = VolunteerTask.query.all()
    return jsonify([{
        'id': t.id, 'title': t.title, 'city': t.city,
        'status': t.status, 'urgency': t.urgency,
        'posted_by': t.requester_name, 'created_at': t.created_at.isoformat()
    } for t in tasks])

@admin_bp.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = VolunteerTask.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'})

# ─── HELP LINES ──────────────────────────────────────────────────────────────
@admin_bp.route('/helplines/<int:id>', methods=['PUT'])
def update_helpline(id):
    h = Helpline.query.get_or_404(id)
    data = request.get_json()
    h.name = data.get('name', h.name)
    h.number = data.get('number', h.number)
    h.category = data.get('category', h.category)
    db.session.commit()
    return jsonify({'message': 'Helpline updated successfully'})

@admin_bp.route('/helplines/<int:id>', methods=['DELETE'])
def delete_helpline(id):
    h = Helpline.query.get_or_404(id)
    db.session.delete(h)
    db.session.commit()
    return jsonify({'message': 'Helpline deleted successfully'})
