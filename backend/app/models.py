from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    mobile_number = db.Column(db.String(20), unique=True, nullable=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user')  # 'user', 'volunteer', 'admin'
    address = db.Column(db.String(255))
    city = db.Column(db.String(100), nullable=True)   # HOME city for location filtering
    dp_url = db.Column(db.String(255), nullable=True)
    expertise = db.Column(db.String(100), nullable=True)
    equipment = db.Column(db.Text, nullable=True)
    identity_type = db.Column(db.String(50), nullable=True)
    identity_id = db.Column(db.String(50), nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    is_online = db.Column(db.Boolean, default=False)
    current_lat = db.Column(db.Float, nullable=True)
    current_lon = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class VolunteerProfile(db.Model):
    """Rich volunteer registration profile (filled after login as volunteer)."""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    full_name = db.Column(db.String(120))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    qualification = db.Column(db.String(200))
    area_of_operation = db.Column(db.String(200))
    role_type = db.Column(db.String(100))          # Rescue / Relief / Medical / Logistics
    department = db.Column(db.String(100), nullable=True)
    has_med_kit = db.Column(db.Boolean, default=False)
    needed_items = db.Column(db.Text, nullable=True)   # comma-separated
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='volunteer_profile', uselist=False)

class DirectMessage(db.Model):
    """User → Volunteer direct message."""
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)

class Disaster(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50))
    location = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    severity = db.Column(db.String(20))
    description = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class SafeCamp(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    city = db.Column(db.String(100))
    district = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    capacity = db.Column(db.Integer)
    current_occupancy = db.Column(db.Integer, default=0)
    facilities = db.Column(db.Text)
    nodal_officer = db.Column(db.String(100))
    contact = db.Column(db.String(20))

class HazardSpot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50))
    name = db.Column(db.String(255))
    city = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    road = db.Column(db.String(255), nullable=True)
    contact = db.Column(db.String(50), nullable=True)
    is_official = db.Column(db.Boolean, default=False)
    details = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class VolunteerTask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    situation = db.Column(db.Text, nullable=True)        # NEW: situation description
    needed_things = db.Column(db.Text, nullable=True)    # NEW: food/items needed
    rescue_type = db.Column(db.String(100), nullable=True)  # NEW: type of rescue
    requester_name = db.Column(db.String(120), nullable=True)  # NEW
    requester_phone = db.Column(db.String(20), nullable=True)  # NEW
    location_name = db.Column(db.String(255))
    city = db.Column(db.String(100), nullable=True)      # NEW: for location filtering
    category = db.Column(db.String(50))
    urgency = db.Column(db.String(20), default='Medium')
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    requester_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    volunteer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    status = db.Column(db.String(20), default='PENDING')  # PENDING, ONGOING, CLOSED
    report_desc = db.Column(db.Text, nullable=True)
    report_img = db.Column(db.String(255), nullable=True)
    closed_comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Helpline(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50))
    state = db.Column(db.String(100), nullable=True)
    district = db.Column(db.String(100), nullable=True)
    zone = db.Column(db.String(100), nullable=True)
    name = db.Column(db.String(255))
    number = db.Column(db.String(50))
    icon = db.Column(db.String(50), nullable=True)
    website = db.Column(db.String(255), nullable=True)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    author_name = db.Column(db.String(80))
    author_role = db.Column(db.String(20))
    content = db.Column(db.Text)
    image_url = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)       # NEW: for location filtering
    task_id = db.Column(db.Integer, db.ForeignKey('volunteer_task.id'), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    recipient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    state = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    risk_level = db.Column(db.String(20), default='Low')  # Low, Medium, High
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class WeatherDataRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'), nullable=False)
    temp = db.Column(db.Float)
    humidity = db.Column(db.Float)
    wind_speed = db.Column(db.Float)
    rainfall = db.Column(db.Float)
    condition = db.Column(db.String(50))
    analysis = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    city = db.relationship('City', backref='weather_records')
