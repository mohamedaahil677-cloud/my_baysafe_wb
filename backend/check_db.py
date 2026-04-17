from app import create_app, db
app = create_app()
with app.app_context():
    try:
        from sqlalchemy import text
        db.session.execute(text('SELECT 1'))
        print("DB_OK")
    except Exception as e:
        print(f"DB_ERROR: {e}")
