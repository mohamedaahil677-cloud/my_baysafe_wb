import React, { useState } from 'react';
import { 
    Shield, Target, Users, Layout, Activity, Monitor, 
    Navigation, RefreshCw, BarChart2, Zap, Heart, 
    Globe, PhoneCall, Anchor, Compass, Satellite, Languages
} from 'lucide-react';

const AboutUsModule = () => {
    const [lang, setLang] = useState('TA'); // 'TA' | 'EN'
    const isTamil = lang === 'TA';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            
            {/* HER0 / MISSION */}
            <div style={{ 
                padding: '80px 40px', background: 'linear-gradient(135deg, rgba(0,210,255,0.05) 0%, rgba(0,0,0,0.4) 50%, rgba(0,90,255,0.05) 100%)',
                borderRadius: '30px', border: '1px solid rgba(0,210,255,0.1)', textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--electric-blue)', opacity: 0.05, borderRadius: '50%', filter: 'blur(50px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: '#ff4d4d', opacity: 0.05, borderRadius: '50%', filter: 'blur(50px)' }}></div>
                
                <div style={{ position: 'absolute', top: '30px', right: '30px' }}>
                     <button 
                        onClick={() => setLang(l => l === 'TA' ? 'EN' : 'TA')}
                        className="btn-shimmer"
                        style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px', fontSize: '0.8rem' }}
                    >
                        <Languages size={18} />
                        {isTamil ? 'English Mode' : 'தமிழ் மற்றும் ஆங்கிலம்'}
                    </button>
                </div>

                <h2 className="thunder-text" style={{ fontSize: '3.5rem', margin: 0, fontWeight: '950', letterSpacing: '2px' }}>
                    BAYSAFE
                </h2>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--electric-blue)', fontWeight: '800', margin: '15px 0 0', textTransform: 'uppercase', letterSpacing: '4px' }}>
                    {isTamil ? 'ஒருங்கிணைந்த பேரிடர் மேலாண்மை - தமிழ்நாடு' : 'Unified Disaster Intelligence - Tamil Nadu'}
                </h3>
                <p style={{ maxWidth: '850px', margin: '30px auto 0', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.9' }}>
                    {isTamil 
                        ? 'தமிழகத்தின் பேரிடர் மேலாண்மை மற்றும் நிவாரணப் பணிகளுக்காக உருவாக்கப்பட்ட பிரத்யேக தளம். இது அரசு அதிகாரிகள், தேசிய மீட்புப் படையினர் (NDRF) மற்றும் பொதுமக்களுக்கிடையே ஒரு பாலமாகச் செயல்படுகிறது. சரியான நேரத்தில் சரியான தகவல்களைத் தருவதே எமது நோக்கம்.'
                        : 'BaySafe is the state\'s premier digital infrastructure for real-time disaster management and humanitarian coordination. Serving as a critical bridge between civic authorities, national rescue agencies (NDRF), and the general public.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
                    <div className="glass-panel" style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
                        <Anchor size={24} color="var(--electric-blue)" />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '900', fontSize: '0.9rem', color: '#fff' }}>24/7 RADAR SYNC</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Live IMD & Windy Feeds</div>
                        </div>
                    </div>
                     <div className="glass-panel" style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.02)' }}>
                        <Shield size={24} color="#00ff80" />
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '900', fontSize: '0.9rem', color: '#fff' }}>NDRF READY</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Official Agency Sync</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CORE FUNCTIONS GRID */}
            <div>
                <h4 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', margin: '0 0 30px 0', borderLeft: '5px solid var(--electric-blue)', paddingLeft: '20px' }}>
                    {isTamil ? 'அமைப்பு செயல்பாடுகள் / System Functions' : 'Core Operating Architectures'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                    {[
                        { 
                            icon: <Satellite size={32} color="#00d2ff" />, 
                            titleEn: 'Real-time Telemetry Synthesis', 
                            titleTa: 'நிகழ்நேர தரவு தொகுப்பு',
                            descEn: 'We integrate complex satellite data and atmospheric reports from the Bay of Bengal into a simple, actionable dashboard for coastal districts.',
                            descTa: 'வங்கக்கடல் மற்றும் விண்வெளி தரவுகளை கடலோர மாவட்டங்களுக்கான எளிய வரைபடங்களாக மாற்றுகிறோம்.'
                        },
                        { 
                            icon: <Users size={32} color="#00ff80" />, 
                            titleEn: 'Emergency Mobilization', 
                            titleTa: 'அவசரகால ஒருங்கிணைப்பு',
                            descEn: 'Connecting verified volunteers with local NDRF teams in real-time. Our system facilitates rescue reports and community needs.',
                            descTa: 'தன்னார்வலர்களை மீட்புப் படைகளுடன் இணைத்து, உதவிகள் சரியான இடத்திற்கு சென்றடைவதை உறுதி செய்கிறோம்.'
                        },
                        { 
                            icon: <BarChart2 size={32} color="#a855f7" />, 
                            titleEn: 'AI Threat Analysis', 
                            titleTa: 'AI அச்சுறுத்தல் பகுப்பாய்வு',
                            descEn: 'Predictive risk vectors developed for cyclone progression and urban flood saturation based on multi-district data monitoring.',
                            descTa: 'மாவட்ட வாரியான மழை மற்றும் காற்றின் போக்கை பகுப்பாய்வு செய்து 12 மணிநேர முன்னெச்சரிக்கை வழங்குகிறோம்.'
                        },
                        { 
                            icon: <Heart size={32} color="#ff4d4d" />, 
                            titleEn: 'Rescue Coordination', 
                            titleTa: 'மீட்புப் பணி மற்றும் உதவி',
                            descEn: 'Managing safe-camps and helplines. Prioritizing communication between affected public and the nearest rescue squads.',
                            descTa: 'முகாம்கள் மற்றும் உதவி எண்களை நிர்வகித்து, பாதிக்கப்பட்ட மக்கள் மீட்புப் படைகளுடன் தொடர்புகொள்ள வழி செய்கிறோம்.'
                        }
                    ].map((f, i) => (
                        <div key={i} className="glass-panel anti-gravity-hover" style={{ padding: '40px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ marginBottom: '25px' }}>{f.icon}</div>
                            <h5 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff', margin: '0 0 15px 0' }}>{isTamil ? f.titleTa : f.titleEn}</h5>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.95rem', margin: 0 }}>{isTamil ? f.descTa : f.descEn}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* NDRF & AGENCY COLLABORATION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'center' }}>
                <div className="glass-panel" style={{ padding: '50px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,128,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                        <Zap size={30} color="#00ff80" />
                        <h4 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: '#fff' }}>{isTamil ? 'அதிகாரப்பூர்வ ஒருங்கிணைப்பு (NDRF)' : 'Official Agency Sync'}</h4>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem' }}>
                        {isTamil 
                            ? 'BaySafe தேசிய மீட்புப் படை (NDRF) மற்றும் மாநிலப் பேரிடர் மேலாண்மை வாரியத்துடன் (SDMA) இணைந்து செயல்படுகிறது. எமது இணையதளம் மீட்புப் பணிகளை துரிதப்படுத்தவும், பொதுமக்களின் தகவல்களை முன்னுரிமைப்படுத்தவும் வழிவகை செய்கிறது.'
                            : 'BaySafe operates in synergy with official state (SDMA) and national (NDRF) rescue agencies. Our platform provides the granular connectivity used to identify and help populations in micro-regions.'}
                    </p>
                    <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
                        {[
                            isTamil ? 'தமிழக மாவட்ட கட்டுப்பாட்டு அறைகளுடன் நேரடித் தொடர்பு.' : 'Direct sync with Tamil Nadu district control rooms.',
                            isTamil ? 'NDRF மீட்பு வழிகாட்டுதல்கள் மற்றும் நெறிமுறைகள்.' : 'Pre-defined rescue checklists for NDRF operations.',
                            isTamil ? 'தன்னார்வலர்களின் அபாயத் தகவல்கள் உடனடிப் பகிர்வு.' : 'Automated sharing of volunteer hazard reports.',
                            isTamil ? 'மாநில அளவிலான உதவி எண்களுடன் (1070) பணி ஒருங்கிணைப்பு.' : 'Unified helpline synchronization with state hubs.'
                        ].map((li, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#fff', fontSize: '0.95rem', fontWeight: '800' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff80' }}></div>
                                {li}
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
                         <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--electric-blue)', marginBottom: '10px' }}>38 DISTRICTS</div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>FULL COVERAGE</div>
                    </div>
                    <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,60,60,0.05)', border: '1px solid rgba(255,60,60,0.2)' }}>
                         <div style={{ fontSize: '1rem', fontWeight: '950', color: '#ff4d4d' }}>OPERATIONAL COOPERATION</div>
                         <div style={{ fontSize: '0.75rem', color: '#ff4d4d', marginTop: '5px' }}>CITIZENS + AUTHORITIES + NDRF</div>
                    </div>
                </div>
            </div>

            {/* COPYRIGHT FOOTER */}
            <div style={{ textAlign: 'center', padding: '60px 0 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                    {[...Array(3)].map((_, i) => <Shield key={i} size={18} color="var(--electric-blue)" />)}
                </div>
                <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '950', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
                    BAYSAFE TAMILNADU LIMITED
                </p>
                <p style={{ color: 'var(--electric-blue)', fontSize: '0.85rem', fontWeight: '800', margin: '8px 0', letterSpacing: '1px' }}>
                    Copyright © {new Date().getFullYear()} BaySafe Tamilnadu Limited.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                    Owned and Managed by <span style={{ color: '#fff', borderBottom: '1px solid #fff' }}>Mohamed Aahil.F</span>
                </p>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    {[...Array(3)].map((_, i) => <Heart key={i} size={14} color="#ff4d4d" fill="#ff4d4d" />)}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AboutUsModule;
