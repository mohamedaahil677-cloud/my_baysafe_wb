import React, { useState } from 'react';
import { 
    AlignLeft, Info, LogOut, ShieldAlert, X, 
    PlayCircle, Camera, Edit3, MapPin, User, 
    BookOpen, Briefcase, Award, ArrowLeft, Shield, Globe
} from 'lucide-react';

const Header = ({ onToggleSidebar, setActiveModule, lang, onToggleLang }) => {
    // Header only needs DP and simple greeting state, full edit/view moves to ProfileModule
    const [userProfile] = useState({
        name: 'Mohamed Aahil.F',
        dp: null
    });

    const isTamil = lang === 'TA';

    return (
        <header className="dashboard-header" style={{
            height: '80px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '0 35px',
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(0, 10, 25, 0.9)',
            borderBottom: '1px solid rgba(0, 210, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            width: '100%'
        }}>
            {/* LEFT SECTION: BRANDING */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                <button 
                    onClick={onToggleSidebar} 
                    className="hover-electrify"
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center' }}
                >
                    <AlignLeft size={30} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 className="thunder-text" style={{ fontSize: isTamil ? '1.5rem' : '1.35rem', margin: 0, fontWeight: '800' }}>
                        BAYSAFE : DISASTER MANAGEMENT SYSTEM
                    </h1>
                    <span style={{ fontSize: '0.8rem', color: 'var(--electric-blue)', fontWeight: '900', letterSpacing: '1px' }}>
                        பேரிடர் மேலாண்மை மையம்
                    </span>
                </div>
            </div>

            {/* RIGHT SECTION: OPERATIONAL TOOLS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', flexShrink: 0 }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '800' }}>{userProfile.name.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.7rem', color: '#00ff80', fontWeight: '900' }}>SYSTEMS ACTIVE</span>
                </div>

                {/* BILINGUAL TOGGLE */}
                <button className="btn-oceanic" onClick={onToggleLang} style={{ padding: '10px 22px', fontSize: '0.8rem', height: '42px', minWidth: '150px' }}>
                    <Globe size={18} />
                    {isTamil ? 'English Mode' : 'தமிழ் பதிப்பு'}
                </button>

                {/* ACTION ICONS GRID */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        className="awareness-btn hover-electrify" 
                        onClick={() => setActiveModule('awareness')}
                        title="Awareness Center"
                        style={{ borderRadius: '12px', width: '45px', height: '45px', cursor: 'pointer', border: '1px solid rgba(255,60,60,0.4)', background: 'rgba(255,60,60,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <ShieldAlert size={22} />
                        <span style={{ position: 'absolute', top: '-1px', right: '-1px', width: '12px', height: '12px', background: '#ff4d4d', borderRadius: '50%', border: '2px solid #000', animation: 'blink 1.5s infinite' }}></span>
                    </button>

                    <button 
                        className="hover-electrify"
                        onClick={() => setActiveModule('about')} 
                        title="About System"
                        style={{
                            background: 'rgba(0,210,255,0.1)', border: '1px solid rgba(0,210,255,0.3)',
                            color: 'var(--electric-blue)', borderRadius: '12px', width: '45px', height: '45px',
                            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                        <Info size={22} />
                    </button>
                </div>

                {/* PROFILE ORB */}
                <div style={{ paddingLeft: '20px', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
                    <button
                        onClick={() => setActiveModule('profile')}
                        className="hover-electrify"
                        style={{
                            width: '52px', height: '52px', borderRadius: '15px', overflow: 'hidden',
                            border: '2px solid var(--electric-blue)', cursor: 'pointer', padding: 0,
                            background: '#000', position: 'relative', boxShadow: '0 0 20px rgba(0,210,255,0.5)'
                        }}
                    >
                        <img
                            src={userProfile.dp || 'https://via.placeholder.com/150/00d2ff/ffffff?text=User'}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: '3px', right: '3px', width: '12px', height: '12px', background: '#00ff80', border: '2px solid #000', borderRadius: '50%' }}></div>
                    </button>
                </div>
            </div>
            
            <style>{`
                @keyframes blink { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
            `}</style>
        </header>
    );
};

export default Header;
