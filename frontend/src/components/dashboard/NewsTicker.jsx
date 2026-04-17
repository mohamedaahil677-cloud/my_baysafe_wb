import React, { useState, useEffect } from 'react';
import { advancedService } from '../../services/api';

const TN_REGIONS = [
    { en: 'Chennai', ta: 'சென்னை', type: 'TN' },
    { en: 'Coimbatore', ta: 'கோயம்புத்தூர்', type: 'TN' },
    { en: 'Madurai', ta: 'மதுரை', type: 'TN' },
    { en: 'Trichy', ta: 'திருச்சிராப்பள்ளி', type: 'TN' },
    { en: 'Salem', ta: 'சேலம்', type: 'TN' },
    { en: 'Tirunelveli', ta: 'திருநெல்வேலி', type: 'TN' },
    { en: 'Tiruppur', ta: 'திருப்பூர்', type: 'TN' },
    { en: 'Vellore', ta: 'வேலூர்', type: 'TN' },
    { en: 'Erode', ta: 'ஈரோடு', type: 'TN' },
    { en: 'Thanjavur', ta: 'தஞ்சாவூர்', type: 'TN' },
    { en: 'Thoothukudi', ta: 'தூத்துக்குடி', type: 'TN' },
    { en: 'Dindigul', ta: 'திண்டுக்கல்', type: 'TN' },
    { en: 'Nagercoil', ta: 'நாகர்கோவில்', type: 'TN' },
    { en: 'Kanchipuram', ta: 'காஞ்சிபுரம்', type: 'TN' },
    { en: 'Cuddalore', ta: 'கடலூர்', type: 'TN' },
    { en: 'Tiruvannamalai', ta: 'திருவண்ணாமலை', type: 'TN' },
    { en: 'Krishnagiri', ta: 'கிருஷ்ணகிரி', type: 'TN' },
    { en: 'Dharmapuri', ta: 'தர்மபுரி', type: 'TN' },
    { en: 'Pudukkottai', ta: 'புதுக்கோட்டை', type: 'TN' },
    { en: 'Nagapattinam', ta: 'நாகப்பட்டினம்', type: 'TN' },
    { en: 'Tiruvarur', ta: 'திருவாரூர்', type: 'TN' },
    { en: 'Namakkal', ta: 'நாமக்கல்', type: 'TN' },
    { en: 'Sivaganga', ta: 'சிவகாங்கை', type: 'TN' },
    { en: 'Virudhunagar', ta: 'விருதுநகர்', type: 'TN' },
    { en: 'Ramanathapuram', ta: 'ராமநாதபுரம்', type: 'TN' },
    { en: 'Theni', ta: 'தேனி', type: 'TN' },
    { en: 'Karur', ta: 'கரூர்', type: 'TN' },
    { en: 'Ariyalur', ta: 'அரியலூர்', type: 'TN' },
    { en: 'Perambalur', ta: 'பெரம்பலூர்', type: 'TN' },
    { en: 'Tiruvallur', ta: 'திருவள்ளூர்', type: 'TN' },
    { en: 'Viluppuram', ta: 'விழுப்புரம்', type: 'TN' },
    { en: 'Tenkasi', ta: 'தென்காசி', type: 'TN' },
    { en: 'Tirupathur', ta: 'திருப்பத்தூர்', type: 'TN' },
    { en: 'Ranipet', ta: 'ராணிப்பேட்டை', type: 'TN' },
    { en: 'Kallakurichi', ta: 'கள்ளக்குறிச்சி', type: 'TN' },
    { en: 'Chengalpattu', ta: 'செங்கல்பட்டு', type: 'TN' },
    { en: 'Mayiladuthurai', ta: 'மயிலாடுதுறை', type: 'TN' },
    { en: 'Ooty', ta: 'ஊட்டி', type: 'TN_HILL' },
    
    // NEIGHBORS
    { en: 'Bengaluru', ta: 'பெங்களூரு', type: 'NEIGHBOR' },
    { en: 'Kochi', ta: 'கொச்சி', type: 'NEIGHBOR' },
    { en: 'Trivandrum', ta: 'திருவனந்தபுரம்', type: 'NEIGHBOR' },
    { en: 'Tirupati', ta: 'திருப்பதி', type: 'NEIGHBOR' },
    { en: 'Puducherry', ta: 'புதுச்சேரி', type: 'NEIGHBOR' },
    { en: 'Nellore', ta: 'நெல்லூர்', type: 'NEIGHBOR' }
];

const NewsTicker = () => {
    const [liveData, setLiveData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animState, setAnimState] = useState('ENTERING');

    const fetchWeatherFeed = async () => {
        try {
            const res = await advancedService.getAllLiveWeather();
            const raw = res.data;
            if (!raw || raw.length === 0) return;

            const updated = TN_REGIONS.map(reg => {
                const match = raw.find(r => r.region_name.toLowerCase().includes(reg.en.toLowerCase())) || raw[0];
                let skyTa = 'தெளிவான வானம்';
                if (match.precipitation > 5) skyTa = 'கனமழை';
                else if (match.precipitation > 0) skyTa = 'மழை';
                else if (match.temperature_2m > 35) skyTa = 'வெயில்';
                
                return {
                    ...reg,
                    temp: match.temperature_2m.toFixed(1),
                    rain: match.precipitation.toFixed(1),
                    wind: match.wind_speed_10m.toFixed(1),
                    gust: match.wind_gusts_10m ? match.wind_gusts_10m.toFixed(1) : (match.wind_speed_10m * 1.5).toFixed(1),
                    sky: skyTa
                };
            });
            setLiveData(updated);
        } catch (err) {
            console.error("News Ticker Sync Failed", err);
        }
    };

    useEffect(() => {
        fetchWeatherFeed();
        const tickerSync = setInterval(fetchWeatherFeed, 120000); // 2 min as requested
        return () => clearInterval(tickerSync);
    }, []);

    useEffect(() => {
        if (liveData.length === 0) return;
        let timer;
        if (animState === 'ENTERING') {
            timer = setTimeout(() => setAnimState('WAITING'), 800);
        } else if (animState === 'WAITING') {
            timer = setTimeout(() => setAnimState('EXITING'), 4000);
        } else if (animState === 'EXITING') {
            timer = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % liveData.length);
                setAnimState('ENTERING');
            }, 800);
        }
        return () => clearTimeout(timer);
    }, [animState, liveData.length]);

    if (liveData.length === 0) return null;
    const d = liveData[currentIndex];

    const glowStyle = { textShadow: '0 0 10px rgba(0,210,255,0.8), 0 0 20px rgba(0,210,255,0.4)' };

    return (
        <div className="news-ticker-container" style={{ 
            borderBottom: '1px solid rgba(0,210,255,0.3)', 
            marginTop: '10px',
            height: '60px', 
            background: 'linear-gradient(90deg, #021a36 0%, #003366 50%, #021a36 100%)',
            display: 'flex', overflow: 'hidden', position: 'relative',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            zIndex: 100
        }}>
            {/* STATIC LABEL */}
            <div style={{
                background: 'rgba(0,180,255,0.2)', color: '#fff', 
                padding: '0 25px', height: '100%', display: 'flex',
                alignItems: 'center', fontWeight: '950', zIndex: 200,
                borderRight: '2px solid #00d2ff',
                fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase',
                textShadow: '0 0 10px #00d2ff'
            }}>
                🌊 நேரலை / LIVE
            </div>

            {/* THE DATA TRAIN (SINGLE LINE ALIGNED) */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '30px',
                    transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                    transform: animState === 'ENTERING' ? 'translateX(-120%)' : animState === 'EXITING' ? 'translateX(120%)' : 'translateX(0)',
                    opacity: animState === 'WAITING' ? 1 : 0,
                    width: '100%', justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '950', color: '#fff', ...glowStyle }}>📍 {d.ta} <span style={{fontSize: '0.8rem', opacity: 0.7}}>({d.en})</span></span>
                    
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <span style={{ color: '#ff7070', fontWeight: '900', fontSize: '1.05rem', ...glowStyle }}>🌡️ {d.temp}°C</span>
                        <span style={{ color: '#4da6ff', fontWeight: '900', fontSize: '1.05rem', ...glowStyle }}>🌧️ {d.rain}mm</span>
                        <span style={{ color: '#00ff80', fontWeight: '900', fontSize: '1.05rem', ...glowStyle }}>💨 {d.wind}km/h</span>
                        <span style={{ color: '#ffcc00', fontWeight: '900', fontSize: '1.05rem', ...glowStyle }}>🌪️ {d.gust}km/h <span style={{fontSize: '0.7rem'}}>(காற்றின் வேகம்)</span></span>
                        <span style={{ color: '#00d2ff', fontWeight: '950', fontSize: '1.05rem', background: 'rgba(255,255,255,0.05)', padding: '2px 10px', borderRadius: '4px', ...glowStyle }}>☁️ {d.sky}</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ocean-shimmer {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .news-ticker-container {
                    background-size: 200% 200% !important;
                    animation: ocean-shimmer 8s ease infinite !important;
                }
            `}</style>
        </div>
    );
};

export default NewsTicker;
