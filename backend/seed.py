from app import create_app, db
from app.models import SafeCamp, Helpline, User, HazardSpot, Post, City, WeatherDataRecord
from werkzeug.security import generate_password_hash

def seed():
    print("Initializing Flask App...")
    app = create_app()
    print("App initialized. Entering App Context...")
    with app.app_context():
        print("Clearing database...")
        db.drop_all()
        print("Creating tables...")
        db.create_all()

        print("Adding Admin User...")
        admin = User(
            username='admin',
            mobile_number='+910000000000',
            password_hash=generate_password_hash('baysafe2026'),
            role='admin',
            is_verified=True
        )
        db.session.add(admin)

        print("Adding Helplines...")
        helplines = [
            Helpline(category='National', name='National Disaster Helpline', number='1078', icon='🚨'),
            Helpline(category='State', state='Tamil Nadu', name='TNSDMA Control Room', number='1070', icon='🏛️'),
            Helpline(category='State', state='Kerala', name='KSDMA Control Room', number='1077', icon='🏛️'),
            Helpline(category='City', zone='North Chennai', name='Police Comm (North)', number='044-25391212', icon='🚔'),
        ]
        db.session.add_all(helplines)

        print("Adding Cities...")
        cities = [
            City(name='Chennai', state='Tamil Nadu', latitude=13.0827, longitude=80.2707, risk_level='High', description='Coastal city, high flood risk.'),
            City(name='Puducherry', state='Puducherry', latitude=11.9416, longitude=79.8083, risk_level='Medium', description='Coastal territory, cyclone prone.'),
            City(name='Trivandrum', state='Kerala', latitude=8.5241, longitude=76.9366, risk_level='Medium', description='Hilly terrain, landslide risk.'),
            City(name='Tirupati', state='Andhra Pradesh', latitude=13.6288, longitude=79.4192, risk_level='Low', description='Inland city, low flood risk.'),
            City(name='Kochi', state='Kerala', latitude=9.9312, longitude=76.2673, risk_level='High', description='Backwater city, major flood risk.')
        ]
        db.session.add_all(cities)
        db.session.flush()

        print("Adding Weather Analysis Records...")
        weather_records = [
            WeatherDataRecord(city_id=cities[0].id, temp=28.5, humidity=85, wind_speed=12, rainfall=45, condition='Rainy', analysis='Heavy rainfall expected in next 3 hours.'),
            WeatherDataRecord(city_id=cities[1].id, temp=30.2, humidity=70, wind_speed=15, rainfall=10, condition='Cloudy', analysis='Moderate winds, stay alert.'),
            WeatherDataRecord(city_id=cities[4].id, temp=27.0, humidity=90, wind_speed=8, rainfall=60, condition='Stormy', analysis='Flash flood warning issued.')
        ]
        db.session.add_all(weather_records)

        # ─── REAL WORLD OFFICIAL DATA ANCHORS ───
        print("Seeding Official HazardSpots (Real World Data)...")
        real_spots = [
            # Chennai
            HazardSpot(category='Gov Hospitals', name='Rajiv Gandhi Government General Hospital', city='Chennai', latitude=13.0814, longitude=80.2772, road='Poonamallee High Rd, Park Town', contact='044 2530 5000', is_official=True),
            HazardSpot(category='Gov Hospitals', name='Government Stanley Medical College and Hospital', city='Chennai', latitude=13.1070, longitude=80.2910, road='Old Jail Rd, Royapuram', contact='044 2528 1351', is_official=True),
            HazardSpot(category='Police', name='C1 Flower Bazaar Police Station', city='Chennai', latitude=13.0860, longitude=80.2840, road='NSC Bose Road, Parrys', contact='044 2345 2501', is_official=True),
            HazardSpot(category='Fire', name='Egmore Fire Station', city='Chennai', latitude=13.0800, longitude=80.2700, road='Rukmani Lakshmipathy Salai', contact='044 2855 4357', is_official=True),
            
            # Puducherry
            HazardSpot(category='Gov Hospitals', name='Indira Gandhi Medical College (IGMCRI)', city='Puducherry', latitude=11.9300, longitude=79.7900, road='Vazhudavur Road, Kathirkamam', contact='0413 227 7545', is_official=True),
            HazardSpot(category='Police', name='Grand Bazaar Police Station', city='Puducherry', latitude=11.9350, longitude=79.8310, road='JN Street, Heritage Town', contact='0413 233 4411', is_official=True),
            
            # Trivandrum
            HazardSpot(category='Gov Hospitals', name='Government Medical College, Thampanoor', city='Trivandrum', latitude=8.5240, longitude=76.9280, road='Ulloor Road, Thampanoor', contact='0471 252 8301', is_official=True),
            HazardSpot(category='Police', name='Museum Police Station', city='Trivandrum', latitude=8.5100, longitude=76.9550, road='Museum Junction Road', contact='0471 231 6351', is_official=True),
            
            # Tirupati
            HazardSpot(category='Gov Hospitals', name='Ruia Government General Hospital', city='Tirupati', latitude=13.6450, longitude=79.4060, road='Alipiri Road, Tirupati', contact='0877 228 6666', is_official=True),
            
            # Calicut
            HazardSpot(category='Gov Hospitals', name='Government Medical College, Kozhikode', city='Calicut', latitude=11.2720, longitude=75.8370, road='Medical College Road', contact='0495 235 0212', is_official=True),
            
            # Kochi
            HazardSpot(category='Gov Hospitals', name='Aster Medcity Kochi', city='Kochi', latitude=10.0520, longitude=76.2750, road='Cheranalloor', contact='0484 669 9999', is_official=True)
        ]
        db.session.add_all(real_spots)

        print("Committing changes...")
        db.session.commit()
        print("Database seeded successfully with All Real World GIS Data.")

if __name__ == '__main__':
    seed()
