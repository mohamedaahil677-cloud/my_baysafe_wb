import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
    Crosshair, PlusCircle, Share2, Navigation, Search, Map as MapIcon, 
    X, Filter, Navigation2, Phone, MapPin, Activity, Shield, 
    Info, CheckCircle2, AlertTriangle, Truck, Home, School, 
    Building2, Flame, UserCheck, Zap, Droplets, Utensils
} from 'lucide-react';

// ─── EXTENDED CITY CONFIGURATION ───
const CITY_COORDS = {
    'Chennai': { lat: 13.0827, lon: 80.2707, ta: 'சென்னை', bounds: { minLat: 13.02, maxLat: 13.12, minLon: 80.18, maxLon: 80.25 } }, // Stricter West
    'Puducherry': { lat: 11.9416, lon: 79.8083, ta: 'புதுச்சேரி', bounds: { minLat: 11.92, maxLat: 11.97, minLon: 79.78, maxLon: 79.82 } },
    'Cuddalore': { lat: 11.7480, lon: 79.7714, ta: 'கடலூர்', bounds: { minLat: 11.73, maxLat: 11.77, minLon: 79.75, maxLon: 79.77 } },
    'Karaikal': { lat: 10.9254, lon: 79.8380, ta: 'காரைக்கால்', bounds: { minLat: 10.91, maxLat: 10.94, minLon: 79.81, maxLon: 79.83 } },
    'Nagapattinam': { lat: 10.7672, lon: 79.8430, ta: 'நாகப்பட்டினம்', bounds: { minLat: 10.75, maxLat: 10.79, minLon: 79.81, maxLon: 79.83 } },
    'Thiruvallur': { lat: 13.1430, lon: 79.9129, ta: 'திருவள்ளூர்', bounds: { minLat: 13.13, maxLat: 13.16, minLon: 79.89, maxLon: 79.92 } },
    'Nilgiris': { lat: 11.4102, lon: 76.6950, ta: 'நீலகிரி', bounds: { minLat: 11.39, maxLat: 11.44, minLon: 76.67, maxLon: 76.73 } },
    'Kanyakumari': { lat: 8.0883, lon: 77.5385, ta: 'கன்னியாகுமரி', bounds: { minLat: 8.08, maxLat: 8.12, minLon: 77.52, maxLon: 77.54 } },
    'Rameshwaram': { lat: 9.2881, lon: 79.3129, ta: 'ராமேஸ்வரம்', bounds: { minLat: 9.27, maxLat: 9.31, minLon: 79.29, maxLon: 79.31 } }, // Stick to main town
    'Kochi': { lat: 9.9312, lon: 76.2673, ta: 'கொச்சி', bounds: { minLat: 9.90, maxLat: 10.02, minLon: 76.24, maxLon: 76.32 } }, // Avoid West shore
    'Bangalore': { lat: 12.9716, lon: 77.5946, ta: 'பெங்களூரு', bounds: { minLat: 12.92, maxLat: 13.03, minLon: 77.52, maxLon: 77.68 } },
    'Nellore': { lat: 14.4426, lon: 79.9865, ta: 'நெல்லூர்', bounds: { minLat: 14.41, maxLat: 14.47, minLon: 79.96, maxLon: 80.00 } },
    'Tuticorin': { lat: 8.7139, lon: 78.1348, ta: 'தூத்துக்குடி', bounds: { minLat: 8.70, maxLat: 8.74, minLon: 78.11, maxLon: 78.14 } },
    'Chengalpattu': { lat: 12.6841, lon: 79.9836, ta: 'செங்கல்பட்டு', bounds: { minLat: 12.66, maxLat: 12.71, minLon: 79.96, maxLon: 80.00 } }
};

// ─── AUTHENTIC LANDMARK DATABASE ───
const LANDMARK_NAMES = {
    FREE_CAMP: ['Corporation Middle School', 'Govt Higher Sec School', 'Community Relief Hall', 'IAS Academy Building', 'Vigilance Dept Wedding Hall'],
    FREE_FOOD: ['Amma Unavagam', 'Rotary Community Kitchen', 'Sai Baba Temple Kitchen', 'Lions Club Distribution', 'NGO Relief Van'],
    SHELTER: ['Primary Health Center', 'Indira Nagar Community Hall', 'Sports Stadium Complex', 'District Library Hall', 'Municipal Admin Building'],
    GOVT_HOSPITAL: ['Govt General Hospital', 'Stanley Medical College', 'Kilpauk Medical College', 'ESIC Hospital', 'Railway Hospital'],
    GOV_AID_HOSPITAL: ['Apollo Specialty Hospital', 'MIOT International', 'Fortis Malar', 'Child Trust Hospital', 'Sundaram Medical Foundation'],
    FIRE: ['Teynampet Fire and Rescue', 'Madhavaram Fire Station', 'Tambaram Central Fire', 'Guindy Industrial Fire Dept', 'Egmore Fire Control'],
    PHARMACY: ['Apollo Pharmacy', 'MedPlus Wellness', 'Thulasi Medicals', 'Wellness Forever', 'Local 24/7 Medicals'],
    ROAD_BLOCK: ['Waterlogged Underpass', 'Fallen Banyan Tree', 'Road Cavity (Sewer)', 'Construction Barricade', 'Mudslide Debris'],
    FLOODED: ['Knee-deep Waterlogging', 'Chest-deep Flood', 'Surging Open Drain', 'Riverside Breach', 'Coastal Backwater Influx'],
    DEPTH_RISKY: ['Warning: 5ft Depth', 'Caution: Low Lying Area', 'Risky Slope', 'Flash Flood Zone', 'Overflowing Canal Edge']
};

const STREETS = ['Anna Salai', 'MG Road', 'Gandhi Street', 'Nehru View', '1st Main Cross', 'Station Road', 'Coastal Highway', 'Old Town Lane', 'West Mada Street'];

// ─── SPECIALIZED OPERATIONAL CATEGORIES ───
const SPOT_CATEGORIES = [
    { id: 'FREE_CAMP', color: '#00ff80', icon: <Home size={18} />, label: 'Free Rescue Camp', ta: 'இலவச மீட்பு முகாம்', emoji: '⛺' },
    { id: 'FREE_FOOD', color: '#ffd700', icon: <Utensils size={18} />, label: 'Free Food Point', ta: 'இலவச உணவு புள்ளி', emoji: '🍲' },
    { id: 'SHELTER', color: '#00d2ff', icon: <Building2 size={18} />, label: 'Emergency Shelter', ta: 'அவசர தங்குமிடம்', emoji: '🏠' },
    { id: 'GOVT_HOSPITAL', color: '#ff1a75', icon: <Activity size={18} />, label: 'Govt Hospital', ta: 'அரசு மருத்துவமனை', emoji: '🏥' },
    { id: 'GOV_AID_HOSPITAL', color: '#ff66b2', icon: <Shield size={18} />, label: 'Govt Aided Hospital', ta: 'அரசு உதவி மருத்துவமனை', emoji: '🏨' },
    { id: 'FIRE', color: '#ff3333', icon: <Flame size={18} />, label: 'Fire Station', ta: 'தீயணைப்பு நிலையம்', emoji: '🚒' },
    { id: 'PHARMACY', color: '#a855f7', icon: <Zap size={18} />, label: '24/7 Pharmacy', ta: 'மருந்தகம்', emoji: '💊' },
    { id: 'ROAD_BLOCK', color: '#ff8c00', icon: <AlertTriangle size={18} />, label: 'Road Blocked', ta: 'சாலை மறியல்', emoji: '🚧' },
    { id: 'FLOODED', color: '#4da6ff', icon: <Droplets size={18} />, label: 'Flooded Area', ta: 'வெள்ளம் சூழ்ந்த பகுதி', emoji: '🌊' },
    { id: 'DEPTH_RISKY', color: '#ff4d4d', icon: <Activity size={18} />, label: 'Risky Depth Area', ta: 'ஆபத்தான ஆழம்', emoji: '⚠️' },
];

// ─── REAL WORLD LANDMARKS DATA ───
// ─── DYNAMIC MOCK DATA ENGINE ───
const generateMockSpots = (cityName) => {
    const city = CITY_COORDS[cityName];
    if (!city || !city.bounds) return [];
    
    const spots = [];
    const categories = SPOT_CATEGORIES;
    const { minLat, maxLat, minLon, maxLon } = city.bounds;
    
    for (let i = 0; i < 25; i++) {
        const cat = categories[i % categories.length];
        const nameList = LANDMARK_NAMES[cat.id] || ['Rescue Point'];
        const randomName = nameList[Math.floor(Math.random() * nameList.length)];
        const street = STREETS[Math.floor(Math.random() * STREETS.length)];
        
        // Strictly within Urban Bounds
        const lat = minLat + (Math.random() * (maxLat - minLat));
        const lon = minLon + (Math.random() * (maxLon - minLon));
        
        spots.push({
            id: `${cityName.slice(0,3)}-${i}`,
            category: cat.id,
            name: `${randomName} #${i + 1}`,
            lat: lat,
            lon: lon,
            road: `${Math.floor(Math.random() * 200) + 1}, ${street}, ${cityName}`,
            contact: `+91 ${Math.floor(8000000000 + Math.random() * 1999999999)}`,
            verified: Math.random() > 0.3
        });
    }
    return spots;
};

const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, zoom, { duration: 1.5 });
    }, [center, zoom, map]);
    return null;
};

const SafeCampLocator = ({ lang }) => {
    const isTamil = lang === 'TA';
    const [selectedCity, setSelectedCity] = useState('Chennai');
    const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]);
    const [mapZoom, setMapZoom] = useState(12);
    const [activeFilters, setActiveFilters] = useState(SPOT_CATEGORIES.map(c => c.id));
    const [userLoc, setUserLoc] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [allSpots, setAllSpots] = useState([]);
    
    // Interaction State
    const [isGridOpen, setIsGridOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showShareMsg, setShowShareMsg] = useState(false);
    const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
    
    // Process Monitoring
    const [processStatus, setProcessStatus] = useState('idle');
    const [stepData, setStepData] = useState({ time: '--', distance: '--' });
    
    // Official Geocoding State
    const [pendingSpot, setPendingSpot] = useState(null);
    const [customName, setCustomName] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const city = CITY_COORDS[selectedCity];
        if (city) {
            setMapCenter([city.lat, city.lon]);
            setMapZoom(13);
            setAllSpots(generateMockSpots(selectedCity));
        }
    }, [selectedCity]);

    // Handle Task Response (Zomato Style)
    const handleBatchMock = async (cat) => {
        const city = CITY_COORDS[selectedCity];
        if (!city || !city.bounds) return;
        const { minLat, maxLat, minLon, maxLon } = city.bounds;
        
        setIsGridOpen(false);
        setBatchProgress({ current: 0, total: 10 });
        const batch = [];
        const nameList = LANDMARK_NAMES[cat.id] || ['Official Relief Point'];
        
        for (let i = 0; i < 10; i++) {
            setBatchProgress(prev => ({ ...prev, current: i + 1 }));
            const randomName = nameList[Math.floor(Math.random() * nameList.length)];
            const lat = minLat + (Math.random() * (maxLat - minLat));
            const lon = minLon + (Math.random() * (maxLon - minLon));
            
            // Sequential Fetch to respect 1s rate limit
            const address = await fetchAddress(lat, lon);
            
            batch.push({
                id: `BATCH-${cat.id}-${Date.now()}-${i}`,
                category: cat.id,
                name: `${randomName} (Live)`,
                lat: lat,
                lon: lon,
                road: address,
                contact: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
                verified: true
            });
            
            // Small delay to be safe with Nominatim
            if (i < 9) await new Promise(r => setTimeout(r, 1000));
        }
        setAllSpots(prev => [...batch, ...prev]);
        setBatchProgress({ current: 0, total: 0 });
    };

    const handleClearMocks = () => {
        setAllSpots(prev => prev.filter(s => !s.id.startsWith('BATCH-') && !s.id.startsWith('USER-')));
    };

    const handleAcceptRescue = (spot) => {
        setActiveTask(spot);
        setProcessStatus('accepted');
        
        // Mock current location if not available
        const currentLoc = userLoc || [mapCenter[0] + 0.02, mapCenter[1] + 0.02];
        if (!userLoc) setUserLoc(currentLoc);

        fetchRoute(currentLoc, [spot.lat, spot.lon]);

        setTimeout(() => setProcessStatus('enroute'), 2000);
    };

    const fetchRoute = async (start, end) => {
        try {
            const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`);
            const data = await resp.json();
            if (data.routes && data.routes.length > 0) {
                const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                setRouteCoords(coords);
                setStepData({
                    time: Math.round(data.routes[0].duration / 60) + ' mins',
                    distance: (data.routes[0].distance / 1000).toFixed(1) + ' km'
                });
            }
        } catch (err) {
            console.error("Routing error");
        }
    };

    const fetchAddress = async (lat, lon) => {
        setIsFetching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            return data.display_name || 'Official Address Not Found';
        } catch (err) {
            return 'Offline: Address Retrieval Failed';
        } finally {
            setIsFetching(false);
        }
    };

    const handleMockMyLocation = () => {
        const city = CITY_COORDS[selectedCity];
        const { minLat, maxLat, minLon, maxLon } = city.bounds;
        const lat = minLat + (Math.random() * (maxLat - minLat));
        const lon = minLon + (Math.random() * (maxLon - minLon));
        setUserLoc([lat, lon]);
        setMapCenter([lat, lon]);
    };

    const MapEvents = () => {
        useMapEvents({
            click: async (e) => {
                if (selectedCategory) {
                    const category = selectedCategory;
                    setSelectedCategory(null); // Clear first to prevent double-click issues
                    const address = await fetchAddress(e.latlng.lat, e.latlng.lng);
                    setPendingSpot({
                        category: category.id,
                        lat: e.latlng.lat,
                        lon: e.latlng.lng,
                        road: address,
                        icon: category.emoji
                    });
                    setCustomName('');
                }
            }
        });
        return null;
    };

    const saveUserSpot = () => {
        if (!pendingSpot) return;
        const newSpot = {
            id: `USER-${Date.now()}`,
            category: pendingSpot.category,
            name: customName || `Manual ${pendingSpot.category}`,
            lat: pendingSpot.lat,
            lon: pendingSpot.lon,
            road: pendingSpot.road,
            contact: 'User Submitted',
            verified: true
        };
        setAllSpots(prev => [newSpot, ...prev]);
        setPendingSpot(null);
    };

    const handleShare = () => {
        const url = window.location.href + `?city=${selectedCity}&lat=${mapCenter[0]}&lon=${mapCenter[1]}`;
        navigator.clipboard.writeText(url);
        setShowShareMsg(true);
        setTimeout(() => setShowShareMsg(false), 3000);
    };

    const nextStep = () => {
        const steps = ['idle', 'accepted', 'enroute', 'arrived', 'active_rescue', 'completed'];
        const currentIdx = steps.indexOf(processStatus);
        if (currentIdx < steps.length - 1) setProcessStatus(steps[currentIdx + 1]);
    };

    const cancelRescue = () => {
        setActiveTask(null);
        setProcessStatus('idle');
        setRouteCoords([]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', gap: '15px' }}>
            
            {/* TOP BAR: CITY & MOCK CONTROLS */}
            <div className="glass-panel" style={{ 
                padding: '10px 25px', display: 'flex', justifyContent: 'space-between', 
                alignItems: 'center', background: 'rgba(5, 10, 20, 0.9)', 
                border: '1px solid rgba(255,255,255,0.05)', minHeight: '70px',
                zIndex: 3500, overflow: 'visible' // CRITICAL: Allow grid to show outside bar
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <select 
                            value={selectedCity} 
                            onChange={(e) => setSelectedCity(e.target.value)}
                            style={{ background: '#000', color: '#fff', border: '1px solid var(--electric-blue)', padding: '10px 40px 10px 15px', borderRadius: '8px', appearance: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}
                        >
                            {Object.keys(CITY_COORDS).map(city => <option key={city} value={city}>{isTamil ? CITY_COORDS[city].ta : city}</option>)}
                        </select>
                        <MapPin size={16} color="var(--electric-blue)" style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                    <div className="text-shimmer" style={{ fontSize: '1.2rem', fontWeight: '900' }}>
                        {isTamil ? 'அதிநவீன கள மேலாண்மை' : 'INTELLIGENT GIS COMMAND'}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {showShareMsg && <div className="animate-fade" style={{ color: '#00ff80', fontSize: '0.8rem', fontWeight: 'bold' }}>Link Copied!</div>}
                    
                    <button onClick={handleMockMyLocation} className="sidebar-btn" style={{ padding: '10px', display: 'flex', border: '1px solid #00d2ff', color: '#00d2ff' }} title="Mock My Current Position">
                        <Crosshair size={20} />
                    </button>

                    <button onClick={handleShare} className="sidebar-btn" style={{ padding: '10px', display: 'flex' }} title="Share Location">
                        <Share2 size={20} />
                    </button>
                    
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={() => { setIsGridOpen(!isGridOpen); setSelectedCategory(null); }} 
                            className="btn-shimmer" 
                            style={{ 
                                borderRadius: '8px', padding: '0 18px', height: '42px',
                                background: isGridOpen || selectedCategory ? 'var(--electric-blue)' : '',
                                color: isGridOpen || selectedCategory ? '#000' : '#fff',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <PlusCircle size={18} /> {isGridOpen || selectedCategory ? (isTamil ? 'ரத்துசெய்' : 'Cancel') : (isTamil ? 'இடத்தை சேர்' : 'Add Landmark')}
                        </button>

                        {isGridOpen && (
                            <div className="glass-panel animate-fade" style={{
                                position: 'absolute', top: '65px', right: 0, zIndex: 5000,
                                width: '350px', padding: '20px', background: 'rgba(5,15,30,0.98)',
                                border: '2px solid var(--electric-blue)', boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
                                backdropFilter: 'blur(25px)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h5 style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '1px' }}>SELECT CATEGORY TO PLACE</h5>
                                    <button onClick={handleClearMocks} style={{ fontSize: '0.65rem', background: 'rgba(255,50,50,0.1)', color: '#ff6666', border: '1px solid rgba(255,50,50,0.3)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                        RESET ALL MOCKS
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    {SPOT_CATEGORIES.map(cat => (
                                        <div 
                                            key={cat.id} 
                                            style={{
                                                position: 'relative', background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                                                padding: '12px 10px', display: 'flex', flexDirection: 'column', 
                                                alignItems: 'center', gap: '8px', transition: '0.3s'
                                            }}
                                        >
                                            <button onClick={() => { setSelectedCategory(cat); setIsGridOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
                                                {cat.emoji}
                                            </button>
                                            <span style={{ fontSize: '0.55rem', fontWeight: '900', color: '#aaa', textAlign: 'center' }}>
                                                {isTamil ? cat.ta.split(' ')[0] : cat.label.split(' ')[0]}
                                            </span>
                                            
                                            {/* BATCH MOCK SPARKLE */}
                                            <button 
                                                onClick={() => handleBatchMock(cat)}
                                                style={{ position: 'absolute', top: '5px', right: '5px', background: 'var(--electric-blue)', color: '#000', border: 'none', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 0 10px rgba(0, 210, 255, 0.5)' }}
                                                title="Mock City-Wide"
                                            >
                                                ✨
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ fontSize: '0.6rem', color: '#666', marginTop: '15px', textAlign: 'center' }}>
                                    Click icon to place 1 marker or ✨ to scatter 10+
                                </p>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '8px 15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Activity size={16} color="#00ff80" /> {isTamil ? 'நேரடி கண்காணிப்பு' : 'Live Tracking'}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '15px', flex: 1, minHeight: 0 }}>
                
                {/* LEFT SIDEBAR: CATEGORIES & LIVE TASKS */}
                <div className="glass-panel sidebar-scroll" style={{ padding: '20px', overflowY: 'auto', background: 'rgba(5,10,20,0.8)' }}>
                    <h4 style={{ color: 'var(--electric-blue)', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '20px' }}>OFFICIAL SECTOR RESOURCES</h4>
                    
                    {/* CATEGORY GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                        {SPOT_CATEGORIES.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveFilters(prev => prev.includes(cat.id) ? prev.filter(c=>c!==cat.id) : [...prev, cat.id])}
                                style={{
                                    padding: '12px', background: activeFilters.includes(cat.id) ? `${cat.color}22` : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${activeFilters.includes(cat.id) ? cat.color : 'rgba(255,255,255,0.05)'}`,
                                    borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                    color: activeFilters.includes(cat.id) ? cat.color : '#666', transition: '0.3s'
                                }}
                            >
                                {cat.icon}
                                <span style={{ fontSize: '0.65rem', fontWeight: '800', textAlign: 'center' }}>{isTamil ? cat.ta : cat.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* LIVE TRACKING CONTEXT (UBER STYLE) */}
                    {activeTask && (
                        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid var(--electric-blue)', animation: 'fadeIn 0.5s ease' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontSize: '0.6rem', color: '#888', fontWeight: '900' }}>ACTIVE MISSION</span>
                                <span style={{ fontSize: '0.6rem', background: '#00ff80', color: '#000', padding: '2px 8px', borderRadius: '10px', fontWeight: '950' }}>{processStatus.toUpperCase()}</span>
                             </div>
                             <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                 <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--electric-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                     {activeTask.category === 'NEEDY' ? <UserCheck size={24} /> : <Zap size={24} />}
                                 </div>
                                 <div style={{ flex: 1 }}>
                                     <h5 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>{activeTask.name}</h5>
                                     <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>{activeTask.road}</p>
                                 </div>
                             </div>
                             
                             <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                                     <div>
                                         <div style={{ color: 'var(--electric-blue)', fontSize: '1.1rem', fontWeight: '900' }}>{stepData.time}</div>
                                         <div style={{ color: '#555', fontSize: '0.6rem' }}>EST. TIME</div>
                                     </div>
                                     <div style={{ width: '1px', background: '#333' }}></div>
                                     <div>
                                         <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '900' }}>{stepData.distance}</div>
                                         <div style={{ color: '#555', fontSize: '0.6rem' }}>DISTANCE</div>
                                     </div>
                                 </div>
                             </div>

                             <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                 <button onClick={nextStep} style={{ flex: 1, padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: '900', fontSize: '0.8rem' }}>
                                     {processStatus === 'enroute' ? 'ARRIVED SPOTTED' : processStatus === 'arrived' ? 'START OPS' : 'COMPLETE'}
                                 </button>
                                 <button onClick={cancelRescue} style={{ padding: '12px', background: 'rgba(255,60,60,0.1)', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '8px' }}><X size={18} /></button>
                             </div>
                        </div>
                    )}
                </div>

                {/* MAIN MAP AREA WITH OVERLAYS */}
                <div style={{ 
                    position: 'relative', borderRadius: '20px', overflow: 'hidden', 
                    border: '1px solid rgba(255,255,255,0.1)', height: '100%', display: 'flex' 
                }}>
                    
                    {/* PROCESS TRACKER BAR (ZOMATO STYLE) */}
                    {activeTask && (
                        <div style={{ 
                            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, 
                            width: '400px', background: 'rgba(10,10,20,0.95)', padding: '12px 20px', borderRadius: '40px', 
                            border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', 
                            flexDirection: 'column', gap: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' 
                        }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                     <div className="pulse-dot" style={{ background: '#00ff80' }}></div>
                                     <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        {processStatus === 'accepted' ? 'Rescue Accepted' : 
                                         processStatus === 'enroute' ? 'En-route to Spot' :
                                         processStatus === 'arrived' ? 'Arrived at Location' :
                                         processStatus === 'active_rescue' ? 'Rescue in Progress...' : 'Task Completed'}
                                     </span>
                                 </div>
                                 <div style={{ color: '#00ff80', fontSize: '0.8rem', fontWeight: '900' }}>{stepData.time}</div>
                             </div>
                             
                             {/* STEPPER PROGRESS */}
                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
                                {['accepted', 'enroute', 'arrived', 'active_rescue', 'completed'].map((s, i) => (
                                    <React.Fragment key={s}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: i <= ['accepted', 'enroute', 'arrived', 'active_rescue', 'completed'].indexOf(processStatus) ? '#00ff80' : '#333' }}></div>
                                        {i < 4 && <div style={{ flex: 1, height: '2px', background: i < ['accepted', 'enroute', 'arrived', 'active_rescue', 'completed'].indexOf(processStatus) ? '#00ff80' : '#333', margin: '0 5px' }}></div>}
                                    </React.Fragment>
                                ))}
                             </div>
                        </div>
                    )}

                    <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', background: '#0a192f' }} zoomControl={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                        <MapUpdater center={mapCenter} zoom={mapZoom} />
                        <MapEvents />

                        {userLoc && (
                            <Marker position={userLoc} icon={new L.divIcon({
                                className: 'user-marker',
                                html: `<div style="background: var(--electric-blue); width: 20px; height: 20px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 15px var(--electric-blue);"></div>`
                            })} />
                        )}

                        {routeCoords.length > 0 && (
                            <Polyline positions={routeCoords} pathOptions={{ color: 'var(--electric-blue)', weight: 6, opacity: 0.9, lineCap: 'round', dashArray: '1, 12' }} />
                        )}

                        {allSpots.filter(s => activeFilters.includes(s.category)).map((spot, idx) => {
                            const cat = SPOT_CATEGORIES.find(c => c.id === spot.category);
                            const iconHtml = `<div style="background: #051024; border: 2px solid ${cat.color}; border-radius: 50%; width: 34px; height: 34px; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 15px ${cat.color}66; font-size: 18px;">
                                                 ${cat.emoji}
                                              </div>`;
                            return (
                                <Marker 
                                    key={idx} 
                                    position={[spot.lat, spot.lon]}
                                    icon={new L.divIcon({
                                        className: 'custom-spot',
                                        html: iconHtml
                                    })}
                                >
                                    <Popup className="custom-popup" closeButton={false}>
                                        <div style={{ minWidth: '260px', padding: '15px', background: '#051024', color: '#fff', borderRadius: '15px', position: 'relative' }}>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const text = `🚀 BaySafe DMS - ${spot.name}\n📍 Location: ${spot.road}\n🌐 Coords: ${spot.lat}, ${spot.lon}`;
                                                    navigator.clipboard.writeText(text);
                                                    setShowShareMsg(true);
                                                    setTimeout(() => setShowShareMsg(false), 3000);
                                                }}
                                                style={{ 
                                                    position: 'absolute', top: '15px', right: '15px', 
                                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                                                    color: '#aaa', borderRadius: '50%', width: '32px', height: '32px', 
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center', 
                                                    cursor: 'pointer', transition: '0.3s' 
                                                }}
                                                title="Share Location"
                                                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--electric-blue)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                            >
                                                <Share2 size={16} />
                                            </button>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', paddingRight: '40px' }}>
                                                <div style={{ padding: '8px', background: `${cat.color}22`, borderRadius: '10px', border: `1px solid ${cat.color}` }}>
                                                    {cat.icon}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>{spot.name}</h4>
                                                    <span style={{ fontSize: '0.65rem', color: cat.color, fontWeight: '900', textTransform: 'uppercase' }}>{isTamil ? cat.ta : cat.label}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.8rem', color: '#aaa' }}>
                                                    <MapPin size={16} /> {spot.road}
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.8rem', color: '#aaa' }}>
                                                    <Phone size={16} /> {spot.contact}
                                                </div>
                                                {spot.needyInfo && (
                                                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid #ff4444', fontSize: '0.75rem' }}>
                                                        <strong style={{ color: '#ff4444' }}>EMERGENCY:</strong> {spot.needyInfo}
                                                    </div>
                                                )}
                                            </div>

                                            {(!activeTask || activeTask.name !== spot.name) ? (
                                                <button 
                                                    onClick={() => handleAcceptRescue(spot)}
                                                    style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: '950', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                                >
                                                    <Activity size={18} /> {isTamil ? 'மீட்புப் பணியைத் தொடங்கு' : 'START RESCUE OPERATION'}
                                                </button>
                                            ) : (
                                                <div style={{ textAlign: 'center', color: '#00ff80', fontWeight: 'bold' }}>
                                                    <CheckCircle2 size={24} style={{ marginBottom: '5px' }} />
                                                    <div>Active Tracking Enabled</div>
                                                </div>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                </div>
            </div>

            <style>{`
                .user-marker { animation: pulse 2s infinite; }
                @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(0, 210, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0); } }
                .pulse-dot { width: 10px; height: 10px; border-radius: 50%; animation: blink 1s infinite; }
                @keyframes blink { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
                .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
                .leaflet-popup-tip { background: #051024 !important; }
            `}</style>
        </div>
    );
};

export default SafeCampLocator;
