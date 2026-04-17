import React, { useState, useEffect } from 'react';
import { ShieldAlert, BarChart2, Anchor, Compass, ShieldCheck } from 'lucide-react';
import { advancedService } from '../../services/api';

// SPECIALIZED HAZARD TICKER (Disaster Info Module Only)
// SPECIALIZED HAZARD TICKER (Disaster Info Module Only)
const DisasterNewsTicker = ({ liveData }) => {
    const [idx, setIdx] = useState(0);
    const [status, setStatus] = useState('ENTERING'); 
    const [hazards, setHazards] = useState([]);

    useEffect(() => {
        if (!liveData || liveData.length === 0) return;
        
        const filtered = [];
        const sectors = [
            { id: 'coromandel', ta: 'சோழமண்டல கடற்கரை', en: 'Coromandel Coast' },
            { id: 'malabar', ta: 'மலபார் கடற்கரை', en: 'Malabar Coast' },
            { id: 'mannar', ta: 'மன்னார் வளைகுடா', en: 'Gulf of Mannar' },
            { id: 'andaman', ta: 'அந்தமான் கடல் பகுதி', en: 'Andaman Sea' },
            { id: 'lakshadweep', ta: 'லட்சத்தீவு கடல் பகுதி', en: 'Lakshawadeep Sea' },
            { id: 'indian_ocean', ta: 'தென் இந்தியப் பெருங்கடல்', en: 'Indian Ocean' }
        ];
        
        sectors.forEach(sec => {
            const d = liveData.find(item => item.region_id === sec.id) || 
                      liveData.find(item => item.region_name.toLowerCase().includes(sec.id));
            
            if (d) {
                let alertTa = "";
                let alertEn = "";
                const isCyclone = d.wind_speed_10m > 65 && d.pressure_msl < 1000;
                const isDepression = d.pressure_msl < 1005;
                const isDeepDepression = d.pressure_msl < 995;
                const isHeavyRain = d.precipitation > 15;
                const isGale = d.wind_speed_10m > 45;

                if (isCyclone) {
                    alertTa = `🌪️ புயல் எச்சரிக்கை (CYCLONE): ${sec.ta} - மீனவர்கள் உடனடியாக கரை திரும்பவும். காற்று: ${d.wind_speed_10m}km/h.`;
                    alertEn = `EXTREME DANGER: Cyclone detected near ${sec.en}. Gale speed ${d.wind_speed_10m}km/h.`;
                } else if (isDeepDepression) {
                    alertTa = `🚨 ஆழ்ந்த காற்றழுத்த தாழ்வு மண்டலம்: ${sec.ta} - கடல் மிகவும் சீற்றமாக காணப்படும்.`;
                    alertEn = `DEEP DEPRESSION: Extreme low pressure ${d.pressure_msl}hPa at ${sec.en}.`;
                } else if (isDepression) {
                    alertTa = `⚠️ காற்றழுத்த தாழ்வு மண்டலம் உருவானது: ${sec.ta} - மீனவர்கள் ஆழ்கடல் பகுதிக்கு செல்ல வேண்டாம்.`;
                    alertEn = `DEPRESSION ALERT: Low pressure system active in ${sec.en} sector.`;
                } else if (isGale) {
                    alertTa = `🌊 சூறாவளி காற்று: ${sec.ta} - பலத்த காற்று வீசக்கூடும் (${d.wind_speed_10m}km/h). கடலோர மக்கள் கவனமுடன் இருக்கவும்.`;
                    alertEn = `GALE WARNING: High velocity winds detected in ${sec.en} maritime zone.`;
                } else if (isHeavyRain) {
                    alertTa = `🌧️ அதி கனமழை எச்சரிக்கை: ${sec.ta} - மேகவெடிப்பு மற்றும் கடல் சீற்றம் ஏற்பட வாய்ப்பு (${d.precipitation}mm).`;
                    alertEn = `HEAVY RAIN: Significant precipitation at ${d.precipitation}mm in ${sec.en}.`;
                } else {
                    alertTa = `🛰️ ${sec.ta} தற்போதைய நிலவரம்: வானிலை சீராக உள்ளது.`;
                    alertEn = `NOMINAL: No immediate hazards detected in ${sec.en}.`;
                }
                filtered.push({ ta: alertTa, en: alertEn });
            }
        });

        if (filtered.length === 0) {
            filtered.push({ ta: 'கடலோரப் பகுதிகளில் தற்போதைய நிலவரம் இயல்பாக உள்ளது.', en: 'Coastal monitoring reports nominal stable telemetry.' });
        }
        setHazards(filtered);
    }, [liveData]);

    useEffect(() => {
        if (hazards.length === 0) return;
        let timer;
        if (status === 'ENTERING') {
            timer = setTimeout(() => setStatus('WAITING'), 800);
        } else if (status === 'WAITING') {
            timer = setTimeout(() => setStatus('EXITING'), 4000);
        } else if (status === 'EXITING') {
            timer = setTimeout(() => {
                setIdx(prev => (prev + 1) % hazards.length);
                setStatus('ENTERING');
            }, 800);
        }
        return () => clearTimeout(timer);
    }, [status, hazards.length]);

    if (hazards.length === 0) return null;
    const h = hazards[idx];

    return (
        <div className="hazard-ticker-container" style={{ 
            borderBottom: '3px solid #ff4d4d', 
            marginTop: '10px',
            background: 'linear-gradient(90deg, #0f0000 0%, #2a0000 50%, #0f0000 100%)',
            height: '80px', display: 'flex', overflow: 'hidden', position: 'relative',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)', borderRadius: '12px', border: '1px solid rgba(255,0,0,0.1)'
        }}>
            <div style={{
                background: '#cc0000', color: '#fff', padding: '0 30px', height: '100%',
                display: 'flex', alignItems: 'center', fontWeight: '950', zIndex: 10,
                fontSize: '0.8rem', letterSpacing: '2px', boxShadow: '10px 0 20px rgba(0,0,0,0.5)',
                textTransform: 'uppercase', borderRight: '1px solid rgba(255,255,255,0.1)'
            }}>
                🌊 HAZARD ALERT
            </div>
            
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: status === 'ENTERING' ? 'translateX(-120%)' : status === 'EXITING' ? 'translateX(120%)' : 'translateX(0)',
                    opacity: status === 'WAITING' ? 1 : 0,
                    width: '100%', minWidth: 0
                }}>
                    <span style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '900', letterSpacing: '-0.2px', lineHeight: '1.2', width: '100%' }}>{h.ta}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: '600', marginTop: '4px', width: '100%' }}>{h.en}</span>
                </div>
            </div>

            <style>{`
                @keyframes radar-pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
                .hazard-ticker-container { animation: radar-pulse 3s infinite; }
            `}</style>
        </div>
    );
};

const DisasterInfoModule = () => {
    const [liveRadarData, setLiveRadarData] = useState([]);
    const [loading, setLoading] = useState(true);

    const pullLiveRadarData = async () => {
        try {
            const res = await advancedService.getAllLiveWeather();
            setLiveRadarData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Disaster hub sync failed", err);
        }
    };

    useEffect(() => {
        pullLiveRadarData();
        const sync = setInterval(pullLiveRadarData, 60000); 
        return () => clearInterval(sync);
    }, []);

    const tabularMapped = liveRadarData.map(item => ({
        loc: item.region_name.split(' (')[0],
        rain: item.precipitation,
        press: item.pressure_msl,
        temp: item.temperature_2m,
        wind: item.wind_speed_10m,
        status: (item.precipitation > 15 || item.wind_speed_10m > 50) ? 'SEVERE' : (item.precipitation > 5 ? 'ALERT' : 'NORMAL')
    }));

    const activeHazard = tabularMapped.find(d => d.status === 'SEVERE' || d.status === 'ALERT');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease-out' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 className="thunder-text" style={{ fontSize: '1.8rem', margin: '0 0 8px 0', fontWeight: '900', letterSpacing: '0.5px' }}>
                        தென்னிந்திய பேரிடர் தகவல் மையம் / LIVE DISASTER HUB
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>
                        <span className="pulse-dot" style={{ background: '#ff4d4d', marginRight: '8px' }}></span>
                        Exclusive Real-time Hazard Feed (Sync: 1min) · Focusing Maritime & Coastal Sectors
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                     <div style={{ background: 'rgba(255,100,0,0.1)', padding: '10px 20px', borderRadius: '14px', border: '1px solid rgba(255,100,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Compass size={20} className="spin" color="#ffcc00" />
                        <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#fff' }}>HAZARD SENSORS ACTIVE</span>
                     </div>
                </div>
            </div>

            {/* SPECIALIZED HAZARD TICKER */}
            <DisasterNewsTicker liveData={liveRadarData} />

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.3fr) 1fr', gap: '30px', alignItems: 'start' }}>

                {/* Left Radar Panel */}
                <div className="glass-panel" style={{ overflow: 'hidden', height: '620px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 60, 60, 0.2)', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Anchor size={20} color="#ff4d4d" />
                            <h3 style={{ color: '#ff4d4d', fontSize: '1.1rem', margin: 0, fontWeight: '800' }}>
                                Maritime Storm & Cyclone Radar (Windy)
                            </h3>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: '#ffcc00', fontWeight: '900', letterSpacing: '1px' }}>FOCUS: SOUTH INDIAN COASTS</span>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <iframe
                            title="Disaster Radar Focus"
                            src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=11.1271&lon=79.6569&marker=true"
                            style={{ width: '100%', height: '100%', border: 'none', position: 'absolute' }}
                        />
                    </div>
                </div>

                {/* Right Analytics Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {activeHazard ? (
                        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,0,0,0.15)', border: '1px solid #ff4d4d' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <ShieldAlert size={40} color="#ff4d4d" />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ff4d4d', fontWeight: '900' }}>⚡ அச்சுறுத்தல் எச்சரிக்கை</h3>
                                    <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#fff', lineHeight: '1.6' }}>
                                        High threat in <strong>{activeHazard.loc}</strong>. 
                                        Intensity: {activeHazard.rain}mm rain / {activeHazard.wind}km/h wind. Precautionary evacuation suggested for low-lying areas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: '24px', background: 'rgba(0,255,128,0.05)', border: '1px solid #00ff80' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <ShieldCheck size={40} color="#00ff80" />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#00ff80', fontWeight: '900' }}>நிலையான வானிலை</h3>
                                    <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#fff' }}>
                                        Radar reporting stable gradients. Typical seasonal patterns across South Indian coastal Hubs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="glass-panel" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '900', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BarChart2 size={18} color="var(--electric-blue)" /> RADAR TELEMETRY HUB
                        </h3>
                        {loading ? (
                            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <th style={{ padding: '12px 10px', color: '#888' }}>REGION</th>
                                            <th style={{ padding: '12px 10px', color: '#888' }}>RAIN</th>
                                            <th style={{ padding: '12px 10px', color: '#888' }}>WIND</th>
                                            <th style={{ padding: '12px 10px', color: '#888' }}>TEMP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tabularMapped.map((row, i) => (
                                            <tr key={i} style={{ 
                                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                                background: row.status === 'SEVERE' ? 'rgba(255,0,0,0.05)' : 'transparent'
                                            }}>
                                                <td style={{ padding: '15px 10px', fontWeight: '800', color: row.status === 'SEVERE' ? '#ff4d4d' : '#fff' }}>{row.loc}</td>
                                                <td style={{ padding: '15px 10px', color: row.rain > 10 ? '#ffcc00' : 'var(--electric-blue)', fontWeight: 'bold' }}>{row.rain}mm</td>
                                                <td style={{ padding: '15px 10px', color: row.wind > 40 ? '#ff4d4d' : '#888' }}>{row.wind}km/h</td>
                                                <td style={{ padding: '15px 10px', fontWeight: 'bold', color: row.temp > 35 ? '#ff7070' : '#00ff80' }}>{row.temp}°C</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .spin { animation: spin 4s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .pulse-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.6); opacity: 0.3; } 100% { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default DisasterInfoModule;
