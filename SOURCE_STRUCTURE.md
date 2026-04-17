# BaySafe DMS Mini — Source Code Structure

*A concise overview of the essential files and directories in the project.*

---

## 1. Project Root Directory

The project is split into two main directories: `frontend` (React) and `backend` (Flask), along with a unified launcher script.

```text
BaySafe DMS Mini/
├── frontend/               # React SPA (User Interface)
├── backend/                # Flask REST API (Server & Database)
└── run_app.bat             # One-click launcher to start both servers
```

---

## 2. Frontend Application (`frontend/`)

This directory contains the React application code.

### 2.1. Critical Configuration Files

```text
frontend/
├── package.json            # Lists npm dependencies and scripts
└── vite.config.js          # Configuration for the Vite build tool
```

### 2.2. Source Code (`frontend/src/`)

This is where the actual UI code lives.

```text
frontend/src/
├── main.jsx                # Application entry point (renders React to the DOM)
├── App.jsx                 # Defines the main routes (/, /login, /register, /dashboard)
├── index.css               # Global styles
│
├── services/
│   └── api.js              # Centralized configuration for all API requests
│
├── pages/                  # Top-level page components
│   ├── Entrance.jsx        # Landing page
│   ├── Login.jsx           # Authentication page
│   ├── Register.jsx        # Account creation page
│   └── Dashboard.jsx       # Main application layout (contains modules)
│
└── components/             # Reusable UI parts
    ├── Sidebar.jsx         # Navigation menu
    └── dashboard/          # Feature-specific modules displayed on the dashboard
        ├── NewsTicker.jsx          # Live weather/seismic alerts
        ├── SafeCampLocator.jsx     # Interactive GIS map
        ├── TaskFeedModule.jsx      # SOS/Rescue task feed
        ├── PublicChatbot.jsx       # AI Assistant
        ├── admin/                  # Admin-only interfaces
        └── volunteer/              # Volunteer-only interfaces
```

---

## 3. Backend API (`backend/`)

This directory contains the robust Flask server, API routes, and database models.

### 3.1. Critical Server Files

```text
backend/
├── run.py                  # Starts the Flask backend server
├── seed.py                 # Script to populate the database with initial data
├── requirements.txt        # Lists Python dependencies
└── .env                    # (Create from .env.example) Stores secret keys & API credentials
```

### 3.2. Database Directory (`backend/instance/`)

```text
backend/instance/
└── baysafe_database.sqlite # The auto-generated SQLite database file
```

### 3.3. Application Logic (`backend/app/`)

This directory contains the core implementation of the REST API.

```text
backend/app/
├── __init__.py             # Initializes the Flask app, database connection, and registers API routes
├── models.py               # Defines the database schema (Tables: Users, Cities, Tasks, etc.)
│
└── routes/                 # Contains the logic for different API endpoints
    ├── auth.py             # Handles /api/auth (Login, Registration, Tokens)
    ├── dms.py              # Handles /api/dms (Core data: Maps, Tasks, Weather)
    ├── admin.py            # Handles /api/admin (Specialized admin operations)
    └── advanced.py         # Handles /api/advanced (Chatbots, external service proxies)
```
