try:
    print("Attempting to import app...")
    from app import create_app
    print("Import successful!")
    app = create_app()
    print("App creation successful!")
except Exception as e:
    import traceback
    print("Import or app creation failed:")
    traceback.print_exc()
