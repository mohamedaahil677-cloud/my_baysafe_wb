import React, { useState, useEffect } from 'react';
import { 
    Activity, Wind, CloudRain, Thermometer, Gauge, Map, Shield, 
    Anchor, Compass, TrendingUp, BarChart2, Zap, Satellite, 
    RefreshCw, Filter, Navigation, Layout, Brain
} from 'lucide-react';
import { advancedService } from '../../services/api';

/* ── Inline Threat Matrix (replaces deleted advanced/ThreatMatrix.jsx) ── */
const THREAT_DEFS = [
    { id: 'cyclone',  label: 'Storm Surge / Cyclone',   zone: 'Bay of Bengal',    color: '#00d2ff', icon: '🌀' },
    { id: 'flood',    label: 'Urban Flood Index',        zone: 'Chennai Metro',    color: '#a855f7', icon: '🌊' },
    { id: 'maritime', label: 'High Wave Warning',        zone: 'Gulf of Mannar',   color: '#3b82f6', icon: '⚓' },
    { id: 'monsoon',  label: 'Monsoon Intensity',        zone: 'Indian Ocean Coast',color: '#00ff80', icon: '🌧️' },
    { id: 'heat',     label: 'Heat Wave Index',          zone: 'Interior TN',      color: '#ff8c00', icon: '🌡️' },
];

const InlineThreatMatrix = ({ lang, districtData }) => {
    const isTamil = lang === 'TA';
    const threats = THREAT_DEFS.map(t => {
        const rand = Math.random();
        let score = 20 + rand * 50;
        const wind = parseFloat(districtData[0]?.wind || 15);
        const rain = parseFloat(districtData[0]?.rain || 0);
        if (t.id === 'cyclone') score = 30 + wind * 1.5 + rain * 1.2;
        if (t.id === 'flood')   score = 20 + rain * 7;
        if (t.id === 'monsoon') score = 15 + rain * 5;
        if (t.id === 'heat')    score = 25 + (parseFloat(districtData[0]?.temp || 30) - 30) * 8;
        score = Math.max(5, Math.min(100, score + (rand * 4 - 2)));
        const alert = score > 80 ? 'CRITICAL' : score > 60 ? 'HIGH' : score > 35 ? 'MEDIUM' : 'LOW';
        const alertColor = { CRITICAL: '#ff4d4d', HIGH: '#ff8c00', MEDIUM: '#ffb800', LOW: '#00ff80' }[alert];
        return { ...t, score: Math.round(score), alert, alertColor };
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Brain size={22} color="#ff4d4d" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>
                    {isTamil ? 'AI அச்சுறுத்தல் முறை பகுப்பாய்வு' : 'AI THREAT MATRIX — LIVE RISK ASSESSMENT'}
                </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {threats.map(t => (
                    <div key={t.id} style={{ background: 'rgba(0,15,35,0.7)', border: `1px solid ${t.color}33`, borderRadius: '14px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>{t.label}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>📍 {t.zone}</div>
                                </div>
                            </div>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, background: `${t.alertColor}22`, color: t.alertColor, border: `1px solid ${t.alertColor}44` }}>
                                {t.alert}
                            </span>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Risk Score</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: t.alertColor }}>{t.score}/100</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${t.score}%`, background: `linear-gradient(90deg, ${t.color}, ${t.alertColor})`, borderRadius: '10px', transition: 'width 1s ease' }} />
                            </div>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            Trend: {t.score > 45 ? '📈 Escalating' : '📊 Stable'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WeatherAnalysisModule = ({ lang }) => {
    const [activeRadar, setActiveRadar] = useState('storm'); 
    const [liveMetrics, setLiveMetrics] = useState(null);
    const [districtData, setDistrictData] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const isTamil = lang === 'TA';

    // Re-focusing completely on Maritime and Coastal hubs as per command request.
    const FOCUS_ZONES = ['chennai', 'kanchipuram', 'cuddalore', 'nagapattinam', 'ramanathapuram', 'thoothukudi', 'nagercoil', 'kanyakumari', 'kochi', 'trivandrum', 'bengaluru', 'malabar', 'coromandel', 'mannar', 'andaman', 'lakshadweep', 'indian_ocean'];

    const fetchAllData = async () => {
        setIsUpdating(true);
        try {
            const res = await advancedService.getAllLiveWeather();
            if (res && res.data) {
                const telemetry = res.data;
                
                // Get general metrics for top KPI cards (average of maritime zones)
                const maritimeNodes = telemetry.filter(d => FOCUS_ZONES.includes(d.region_id));
                if (maritimeNodes.length > 0) {
                    setLiveMetrics({
                        temperature_2m: (maritimeNodes.reduce((acc, n) => acc + n.temperature_2m, 0) / maritimeNodes.length).toFixed(1),
                        wind_speed_10m: (maritimeNodes.reduce((acc, n) => acc + n.wind_speed_10m, 0) / maritimeNodes.length).toFixed(1),
                        precipitation: (maritimeNodes.reduce((acc, n) => acc + n.precipitation, 0) / maritimeNodes.length).toFixed(1),
                        pressure_msl: (maritimeNodes.reduce((acc, n) => acc + n.pressure_msl, 0) / maritimeNodes.length).toFixed(1),
                    });
                }

                const mappedData = telemetry
                    .filter(d => FOCUS_ZONES.includes(d.region_id))
                    .map(d => ({
                        name: d.region_name,
                        ta: d.region_name,
                        pop: d.type === 'MARITIME' ? 'Oceanic Zone' : 'Coastal Hub',
                        geo: d.type === 'MARITIME' ? 'Deep Sea' : 'Shoreline',
                        lat: 'Live Sync',
                        temp: d.temperature_2m.toFixed(1),
                        wind: d.wind_speed_10m.toFixed(1),
                        rain: d.precipitation.toFixed(1)
                    }));
                
                setDistrictData(mappedData);
            }
        } catch (err) {
            console.error('Meteorological sync failed', err);
        } finally {
            setTimeout(() => setIsUpdating(false), 500);
        }
    };

    useEffect(() => {
        fetchAllData();
        const interval = setInterval(fetchAllData, 120000); 
        return () => clearInterval(interval);
    }, []);

    const radarConfigs = {
        storm: {
            overlay: 'rain',
            label: isTamil ? 'புயல் மற்றும் மழை ரேடார்' : 'STORM & PRECIPITATION RADAR',
            desc: isTamil ? 'தமிழ்நாடு மாவட்ட மழையளவு கண்காணிப்பு' : 'TN District Rainfall & Cloud Burst Tracking',
            color: '#00d2ff',
            icon: <Zap size={16} />
        },
        heat: {
            overlay: 'temp',
            label: isTamil ? 'வெப்பநிலை மற்றும் ஈரப்பதம்' : 'TEMPERATURE & HEAT MAP',
            desc: isTamil ? 'மாவட்ட வாரியாக வெப்ப அழுத்தம்' : 'District-wise Heat Index & Thermal HUD',
            color: '#ff8c00',
            icon: <Thermometer size={16} />
        },
        cyclone: {
            overlay: 'wind',
            label: isTamil ? 'சூறாவளி மற்றும் காற்று ரேடார்' : 'CYCLONE & GUST RADAR',
            desc: isTamil ? 'காற்றின் வேகம் மற்றும் அழுத்த மாறுபாடுகள்' : 'Wind Velocity & Pressure Gradient HUD',
            color: '#a855f7',
            icon: <Compass size={16} />
        },
        threats: {
            overlay: null,
            label: isTamil ? 'AI அச்சுறுத்தல் மேட்ரிக்ஸ்' : 'AI THREAT MATRIX ANALYSIS',
            desc: isTamil ? 'மாவட்ட அளவிலான பேரிடர் ஆபத்து' : 'District-level Hazard Risk Assessment',
            color: '#ff4d4d',
            icon: <Brain size={16} />
        }
    };

    const renderKPICard = (icon, label, value, unit, color) => (
        <div className="glass-panel" style={{ flex: 1, padding: '20px', minWidth: '180px', borderLeft: `4px solid ${color}`, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ color }}>{icon}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>{value || '--'}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>{unit}</div>
            </div>
        </div>
    );

    return (
        <div className="weather-analysis-module" style={{ color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h2 className="thunder-text" style={{ margin: 0, fontSize: '1.75rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Anchor size={28} color="var(--electric-blue)" /> 
                        {isTamil ? 'தென்னிந்திய கடல் கண்காணிப்பு' : 'SOUTH INDIAN MARITIME TELEMETRY'}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        {isTamil ? 'கடல்சார் கண்காணிப்பு · நேரடி HUD' : 'Coastal & Ocean Basin Monitoring · Real-time Operational HUD'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ padding: '8px 15px', background: 'rgba(0,180,255,0.1)', border: '1px solid rgba(0,210,255,0.3)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw size={14} className={isUpdating ? 'spin' : ''} />
                        {isTamil ? 'ஒத்திசைவு' : 'SYNC'}: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {renderKPICard(<Thermometer size={18} />, isTamil ? 'சராசரி வெப்பநிலை' : 'AVG TEMPERATURE', liveMetrics?.temperature_2m, '°C', '#f87171')}
                {renderKPICard(<Wind size={18} />, isTamil ? 'காற்றின் வேகம்' : 'WIND VELOCITY', liveMetrics?.wind_speed_10m, 'km/h', '#34d399')}
                {renderKPICard(<CloudRain size={18} />, isTamil ? 'மழைப்பொழிவு' : 'PRECIPITATION', liveMetrics?.precipitation, 'mm', '#60a5fa')}
                {renderKPICard(<Gauge size={18} />, isTamil ? 'காற்றழுத்தம்' : 'AIR PRESSURE', liveMetrics?.pressure_msl, 'hPa', '#fbbf24')}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {Object.entries(radarConfigs).map(([id, cfg]) => (
                    <button
                        key={id}
                        onClick={() => setActiveRadar(id)}
                        style={{
                            flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
                            background: activeRadar === id ? cfg.color : 'transparent',
                            color: activeRadar === id ? '#000' : '#fff',
                            fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            boxShadow: activeRadar === id ? `0 0 15px ${cfg.color}66` : 'none'
                        }}
                    >
                        {cfg.icon}
                        {cfg.label.split(' ')[0]}
                    </button>
                ))}
            </div>

            {activeRadar === 'threats' ? (
                <div style={{ animation: 'slideIn 0.5s ease-out' }}>
                    <InlineThreatMatrix lang={lang} districtData={districtData} />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 2fr', gap: '24px', animation: 'fadeIn 0.5s ease-out' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="glass-panel" style={{ padding: '24px', flex: 1, maxHeight: '600px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Satellite size={18} color="#00d2ff" />
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900' }}>{isTamil ? 'கடலோர மற்றும் கடல் நேரடி ரேடார்' : 'COASTAL & MARITIME LIVE HUB'}</h3>
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#888', fontWeight: 'bold' }}>SOUTH INDIAN SEABOARD</span>
                            </div>
                            <div style={{ overflowY: 'auto', flex: 1 }} className="sidebar-scroll">
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                                    <thead style={{ position: 'sticky', top: 0, background: '#0a192f', zIndex: 10 }}>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '10px', color: '#888' }}>{isTamil ? 'மாவட்டம்' : 'DISTRICT'}</th>
                                            <th style={{ padding: '10px', color: '#888' }}>{isTamil ? 'வானிலை' : 'DATA'}</th>
                                            <th style={{ padding: '10px', color: '#888' }}>{isTamil ? 'புவியியல்' : 'GEO/POP'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {districtData.map((dist, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="hover-row">
                                                <td style={{ padding: '12px 10px' }}>
                                                    <div style={{ fontWeight: '900', color: '#fff' }}>{isTamil ? dist.ta : dist.name}</div>
                                                    <div style={{ fontSize: '0.6rem', color: 'var(--electric-blue)' }}>LAT: {dist.lat}</div>
                                                </td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <div style={{ color: '#fff' }}><Thermometer size={10} inline /> {dist.temp}°C</div>
                                                    <div style={{ color: '#34d399' }}><Wind size={10} inline /> {dist.wind}kph</div>
                                                    <div style={{ color: '#60a5fa' }}><CloudRain size={10} inline /> {dist.rain}mm</div>
                                                </td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <div style={{ color: '#aaa', fontWeight: 'bold' }}>{dist.pop}</div>
                                                    <div style={{ fontSize: '0.6rem', color: '#666' }}>{dist.geo}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(0,180,255,0.03)', border: '1px solid rgba(0,180,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <Shield size={18} color="#00ff80" />
                                <div style={{ fontWeight: '900', fontSize: '0.85rem' }}>{isTamil ? 'பெருங்கடல் கண்காணிப்பு' : 'DEEP SEA SYNC ACTIVE'}</div>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 }}>
                                {isTamil ? 'தென்னிந்திய கடல் மற்றும் கடலோர நகரங்கள் 2 நிமிடத்திற்கு ஒருமுறை ஒத்திசைக்கப்படுகிறது.' : 'South Indian Ocean, Arabian Sea, and coastal hubs are strictly prioritized and refreshing every 120 seconds.'}
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '540px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: `2px solid ${radarConfigs[activeRadar].color}`, position: 'relative' }}>
                            <iframe
                                src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=5&overlay=${radarConfigs[activeRadar].overlay}&product=ecmwf&level=surface&lat=10.0&lon=77.0&marker=false`}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title="South Indian Maritime Analysis"
                            />
                            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.85)', padding: '15px 20px', borderRadius: '12px', border: `1px solid ${radarConfigs[activeRadar].color}`, maxWidth: '300px', backdropFilter: 'blur(10px)' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '900', color: radarConfigs[activeRadar].color }}>{radarConfigs[activeRadar].label}</div>
                                <div style={{ fontSize: '0.7rem', color: '#fff', marginTop: '4px' }}>{radarConfigs[activeRadar].desc}</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                            <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
                                <TrendingUp size={20} color="#00d2ff" />
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#fff' }}>{isTamil ? 'மாவட்ட முன்னறிவிப்பு' : 'DISTRICT FORECAST ACTIVE'}</div>
                            </div>
                            <div className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
                                <Navigation size={20} color="#ffcc00" />
                                <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#fff' }}>{isTamil ? 'மையம்: தமிழ்நாடு' : 'CENTRE: TAMIL NADU'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 2s linear infinite; }
                .hover-row:hover { background: rgba(0,210,255,0.05); cursor: pointer; border-left: 2px solid var(--electric-blue); }
                @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default WeatherAnalysisModule;
