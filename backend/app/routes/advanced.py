from flask import Blueprint, jsonify, request
import requests
import datetime

advanced_bp = Blueprint('advanced', __name__)

# SOUTH INDIAN REGIONS & MARITIME SECTORS TELEMETRY MAP
REGIONS = [
    # TN - 38 DISTRICTS + SUBURBAN
    {"id": "chennai", "name": "Chennai", "lat": 13.0827, "lon": 80.2707, "type": "TN"},
    {"id": "coimbatore", "name": "Coimbatore", "lat": 11.0168, "lon": 76.9558, "type": "TN"},
    {"id": "madurai", "name": "Madurai", "lat": 9.9252, "lon": 78.1198, "type": "TN"},
    {"id": "trichy", "name": "Trichy", "lat": 10.7905, "lon": 78.7047, "type": "TN"},
    {"id": "salem", "name": "Salem", "lat": 11.6643, "lon": 78.1460, "type": "TN"},
    {"id": "tirunelveli", "name": "Tirunelveli", "lat": 8.7139, "lon": 77.7567, "type": "TN"},
    {"id": "tiruppur", "name": "Tiruppur", "lat": 11.1085, "lon": 77.3411, "type": "TN"},
    {"id": "vellore", "name": "Vellore", "lat": 12.9165, "lon": 79.1325, "type": "TN"},
    {"id": "erode", "name": "Erode", "lat": 11.3410, "lon": 77.7172, "type": "TN"},
    {"id": "thanjavur", "name": "Thanjavur", "lat": 10.7870, "lon": 79.1378, "type": "TN"},
    {"id": "thoothukudi", "name": "Thoothukudi", "lat": 8.8053, "lon": 78.1460, "type": "TN"},
    {"id": "dindigul", "name": "Dindigul", "lat": 10.3673, "lon": 77.9803, "type": "TN"},
    {"id": "nagercoil", "name": "Nagercoil", "lat": 8.1833, "lon": 77.4119, "type": "TN"},
    {"id": "kanchipuram", "name": "Kanchipuram", "lat": 12.8342, "lon": 79.7036, "type": "TN"},
    {"id": "cuddalore", "name": "Cuddalore", "lat": 11.7480, "lon": 79.7714, "type": "TN"},
    {"id": "tiruvannamalai", "name": "Tiruvannamalai", "lat": 12.2253, "lon": 79.0747, "type": "TN"},
    {"id": "krishnagiri", "name": "Krishnagiri", "lat": 12.5186, "lon": 78.2137, "type": "TN"},
    {"id": "dharmapuri", "name": "Dharmapuri", "lat": 12.1211, "lon": 78.1582, "type": "TN"},
    {"id": "pudukkottai", "name": "Pudukkottai", "lat": 10.3797, "lon": 78.8208, "type": "TN"},
    {"id": "nagapattinam", "name": "Nagapattinam", "lat": 10.7672, "lon": 79.8449, "type": "TN"},
    {"id": "tiruvarur", "name": "Tiruvarur", "lat": 10.7725, "lon": 79.6361, "type": "TN"},
    {"id": "namakkal", "name": "Namakkal", "lat": 11.2189, "lon": 78.1672, "type": "TN"},
    {"id": "sivaganga", "name": "Sivaganga", "lat": 9.8433, "lon": 78.4833, "type": "TN"},
    {"id": "virudhunagar", "name": "Virudhunagar", "lat": 9.5872, "lon": 77.9491, "type": "TN"},
    {"id": "ramanathapuram", "name": "Ramanathapuram", "lat": 9.3639, "lon": 78.8395, "type": "TN"},
    {"id": "theni", "name": "Theni", "lat": 10.0104, "lon": 77.4768, "type": "TN"},
    {"id": "karur", "name": "Karur", "lat": 10.9504, "lon": 78.0844, "type": "TN"},
    {"id": "ariyalur", "name": "Ariyalur", "lat": 11.1360, "lon": 79.0780, "type": "TN"},
    {"id": "perambalur", "name": "Perambalur", "lat": 11.2342, "lon": 78.8820, "type": "TN"},
    {"id": "tiruvallur", "name": "Tiruvallur", "lat": 13.1437, "lon": 79.9079, "type": "TN"},
    {"id": "viluppuram", "name": "Viluppuram", "lat": 11.9391, "lon": 79.4851, "type": "TN"},
    {"id": "tenkasi", "name": "Tenkasi", "lat": 8.9591, "lon": 77.3150, "type": "TN"},
    {"id": "tirupathur", "name": "Tirupathur", "lat": 12.4930, "lon": 78.5680, "type": "TN"},
    {"id": "ranipet", "name": "Ranipet", "lat": 12.9272, "lon": 79.3333, "type": "TN"},
    {"id": "kallakurichi", "name": "Kallakurichi", "lat": 11.7410, "lon": 78.9620, "type": "TN"},
    {"id": "chengalpattu", "name": "Chengalpattu", "lat": 12.6934, "lon": 79.9774, "type": "TN"},
    {"id": "mayiladuthurai", "name": "Mayiladuthurai", "lat": 11.1042, "lon": 79.6548, "type": "TN"},
    {"id": "nilgiris", "name": "Ooty", "lat": 11.4102, "lon": 76.6950, "type": "TN_HILL"},
    
    # NEIGHBORS (Kerala, Andhra, Karnataka, Puducherry)
    {"id": "bengaluru", "name": "Bengaluru", "lat": 12.9716, "lon": 77.5946, "type": "NEIGHBOR"},
    {"id": "kochi", "name": "Kochi", "lat": 9.9312, "lon": 76.2673, "type": "NEIGHBOR"},
    {"id": "trivandrum", "name": "Trivandrum", "lat": 8.5241, "lon": 76.9366, "type": "NEIGHBOR"},
    {"id": "tirupati", "name": "Tirupati", "lat": 13.6288, "lon": 79.4192, "type": "NEIGHBOR"},
    {"id": "puducherry", "name": "Puducherry", "lat": 11.9416, "lon": 79.8083, "type": "NEIGHBOR"},
    {"id": "nellore", "name": "Nellore", "lat": 14.4426, "lon": 79.9865, "type": "NEIGHBOR"},

    # MARITIME ZONES (Coastal Analysis)
    {"id": "coromandel", "name": "Coromandel Coast", "lat": 11.75, "lon": 80.5, "type": "MARITIME"},
    {"id": "malabar", "name": "Malabar Coast", "lat": 10.5, "lon": 75.5, "type": "MARITIME"},
    {"id": "mannar", "name": "Gulf of Mannar", "lat": 8.5, "lon": 78.5, "type": "MARITIME"},
    {"id": "andaman", "name": "Andaman Sea", "lat": 11.5, "lon": 92.5, "type": "MARITIME"},
    {"id": "lakshadweep", "name": "Lakshawadeep Sea", "lat": 9.5, "lon": 73.5, "type": "MARITIME"},
    {"id": "indian_ocean", "name": "South Indian Ocean", "lat": 5.0, "lon": 80.0, "type": "MARITIME"},
]

@advanced_bp.route('/weather/live/all', methods=['GET'])
def get_all_live_weather():
    """Fetches real-time weather for ALL South Indian hubs in one batch request (Open-Meteo)."""
    try:
        # Construct multiple lat/lon params for batch request
        lats = ",".join([str(r["lat"]) for r in REGIONS])
        lons = ",".join([str(r["lon"]) for r in REGIONS])
        
        # Use the correct Open-Meteo current fields (not deprecated current_weather)
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lats}&longitude={lons}"
            f"&current=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m,surface_pressure"
            f"&timezone=auto&forecast_days=1"
        )
        
        response = requests.get(url, timeout=15)
        data = response.json()
        
        # Open-Meteo returns a list if multiple coords are provided
        if not isinstance(data, list):
            data = [data]
            
        results = []
        for i, entry in enumerate(data):
            if i >= len(REGIONS):
                break
            # New API puts everything under 'current'
            current = entry.get("current", {})
            
            results.append({
                "region_id": REGIONS[i]["id"],
                "region_name": REGIONS[i]["name"],
                "type": REGIONS[i]["type"],
                "temperature_2m": current.get("temperature_2m", 0),
                "wind_speed_10m": current.get("wind_speed_10m", 0),
                "wind_gusts_10m": current.get("wind_gusts_10m", 0),
                "precipitation": current.get("precipitation", 0),
                "pressure_msl": current.get("surface_pressure", 1013),
                "condition": "Live",
                "timestamp": datetime.datetime.now().isoformat()
            })
            
        return jsonify(results)
    except Exception as e:
        # Fallback to realistic mock data if external API is down
        import random
        fallback = []
        for r in REGIONS:
            fallback.append({
                "region_id": r["id"],
                "region_name": r["name"],
                "type": r["type"],
                "temperature_2m": round(26 + random.uniform(-3, 6), 1),
                "wind_speed_10m": round(8 + random.uniform(0, 20), 1),
                "wind_gusts_10m": round(12 + random.uniform(0, 25), 1),
                "precipitation": round(random.uniform(0, 5), 1),
                "pressure_msl": round(1008 + random.uniform(-5, 8), 1),
                "condition": "Fallback"
            })
        return jsonify(fallback), 200

@advanced_bp.route('/weather/live', methods=['GET'])
def get_single_live_weather():
    region_id = request.args.get('region', 'chennai').lower()
    reg = next((r for r in REGIONS if r["id"] == region_id), REGIONS[0])
    
    url = f"https://api.open-meteo.com/v1/forecast?latitude={reg['lat']}&longitude={reg['lon']}&current_weather=true&hourly=precipitation,surface_pressure&timezone=auto"
    res = requests.get(url).json()
    current = res.get("current_weather", {})
    hourly = res.get("hourly", {})
    
    return jsonify({
        "temperature_2m": current.get("temperature"),
        "wind_speed_10m": current.get("windspeed"),
        "precipitation": hourly.get("precipitation", [0])[0],
        "pressure_msl": hourly.get("surface_pressure", [1013])[0]
    })
