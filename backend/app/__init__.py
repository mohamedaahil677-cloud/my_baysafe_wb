from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import os
from dotenv import load_dotenv

# Load .env file (if present)
load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, static_folder='../uploads', static_url_path='/uploads')
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = (
        'sqlite:///' + os.path.join(basedir, '..', 'instance', 'baysafe_database.sqlite')
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

    db.init_app(app)

    # Setup Flask-Admin
    admin = Admin(app, name='BaySafe Admin', template_mode='bootstrap4')

    with app.app_context():
        from . import models
        db.create_all()

        # Add views to Admin
        admin.add_view(ModelView(models.User, db.session))
        admin.add_view(ModelView(models.VolunteerProfile, db.session))
        admin.add_view(ModelView(models.City, db.session))
        admin.add_view(ModelView(models.SafeCamp, db.session))
        admin.add_view(ModelView(models.VolunteerTask, db.session, name="SOS Requests"))
        admin.add_view(ModelView(models.WeatherDataRecord, db.session))
        admin.add_view(ModelView(models.Helpline, db.session))
        admin.add_view(ModelView(models.HazardSpot, db.session))

        # Register blueprints
        from .routes.auth import auth_bp
        from .routes.dms import dms_bp
        from .routes.admin import admin_bp
        from .routes.advanced import advanced_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(dms_bp, url_prefix='/api/dms')
        app.register_blueprint(admin_bp, url_prefix='/api/admin')
        app.register_blueprint(advanced_bp, url_prefix='/api/advanced')

    return app
