import React, { useState } from 'react';
import { 
    Camera, Edit3, MapPin, User, 
    BookOpen, Award, ArrowLeft, Shield, CheckCircle2,
    Briefcase, Save, X, Globe, Mail, Phone, Link,
    RefreshCw, Navigation, Activity
} from 'lucide-react';

const ProfileModule = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState({
        name: 'Mohamed Aahil.F',
        location: 'Chennai, Tamil Nadu',
        role: 'Verified Volunteer / Rescue Ops',
        bio: 'Disaster management enthusiast specializing in maritime rescue and frontline volunteer coordination across coastal Tamil Nadu districts.',
        education: 'B.E. Disaster Management & Mitigation',
        email: 'aahil.rescue@baysafe.gov.in',
        phone: '+91 98XXX XXXXX',
        joined: 'March 2026',
        skills: ['Maritime Rescue', 'First Aid', 'Cyclone Preparedness', 'Comms Protocol'],
        dp: null
    });

    return (
        <div style={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)', padding: '10px' }}>
            
            {/* PROFILE DASHBOARD HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
                <div>
                    <h2 className="thunder-text" style={{ fontSize: '2.5rem', margin: 0, fontWeight: '950', letterSpacing: '1px' }}>
                         USER IDENTITY HUB
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0', fontSize: '1.1rem' }}>
                        Manage your professional credentials and field presence within the BaySafe network.
                    </p>
                </div>
                <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className="btn-shimmer" 
                    style={{ padding: '12px 25px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px', background: isEditing ? 'rgba(255,60,60,0.1)' : 'var(--electric-blue)', color: isEditing ? '#ff4d4d' : '#000', fontWeight: '900', border: isEditing ? '1px solid rgba(255,60,60,0.3)' : 'none' }}
                >
                    {isEditing ? <><X size={20} /> CANCEL EDIT</> : <><Edit3 size={20} /> EDIT IDENTITY</>}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) 2fr', gap: '40px', alignItems: 'start' }}>
                
                {/* LEFT: IDENTITY CARD (SILVER BLACK) */}
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#070707', position: 'sticky', top: '20px' }}>
                    <div style={{ height: '140px', background: 'linear-gradient(135deg, #e0e0e0 0%, #7f8c8d 30%, #2c3e50 60%, #000000 100%)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '5px 12px', background: 'rgba(0,255,128,0.15)', border: '1px solid rgba(0,255,128,0.3)', borderRadius: '20px', color: '#00ff80', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1px' }}>ACTIVE STATUS</div>
                    </div>
                    
                    <div style={{ padding: '0 30px 40px', marginTop: '-60px', position: 'relative', textAlign: 'center' }}>
                         <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 25px' }}>
                            <img
                                src={userProfile.dp || 'https://via.placeholder.com/150/00d2ff/ffffff?text=User'}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', border: '6px solid #070707', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', objectFit: 'cover', background: '#000' }}
                            />
                            {isEditing && (
                                <label style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#fff', color: '#000', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', border: '4px solid #070707' }}>
                                    <Camera size={18} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) setUserProfile(prev => ({ ...prev, dp: URL.createObjectURL(file) }));
                                    }} />
                                </label>
                            )}
                        </div>

                        <h3 style={{ fontSize: '1.8rem', fontWeight: '950', color: '#fff', margin: '0' }}>{userProfile.name}</h3>
                        <div style={{ color: 'var(--electric-blue)', fontWeight: '800', fontSize: '0.9rem', marginTop: '5px', letterSpacing: '1px', textTransform: 'uppercase' }}>{userProfile.role}</div>
                        
                        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <MapPin size={20} color="#666" />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{userProfile.location}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Mail size={20} color="#666" />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{userProfile.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <Phone size={20} color="#666" />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{userProfile.phone}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <RefreshCw size={20} color="#666" />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Member since {userProfile.joined}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: DATA PANELS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {isEditing ? (
                        /* EDIT MODE INTERFACE - NOW WITH EMAIL & PHONE */
                        <div className="glass-panel" style={{ padding: '40px', border: '1px solid var(--electric-blue)', background: 'rgba(0,210,255,0.02)' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '900', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <RefreshCw size={24} color="var(--electric-blue)" /> Update Identity Credentials
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Full Identification Name</label>
                                    <input className="form-input" style={{ width: '100%' }} value={userProfile.name} onChange={e => setUserProfile({...userProfile, name: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Operational Location</label>
                                    <input className="form-input" style={{ width: '100%' }} value={userProfile.location} onChange={e => setUserProfile({...userProfile, location: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Professional Role</label>
                                    <input className="form-input" style={{ width: '100%' }} value={userProfile.role} onChange={e => setUserProfile({...userProfile, role: e.target.value})} />
                                </div>

                                {/* NEW: EMAIL & PHONE EDITING OPTIONS */}
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Official Email Address</label>
                                    <input type="email" className="form-input" style={{ width: '100%' }} value={userProfile.email} onChange={e => setUserProfile({...userProfile, email: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Verified Phone Contact</label>
                                    <input type="tel" className="form-input" style={{ width: '100%' }} value={userProfile.phone} onChange={e => setUserProfile({...userProfile, phone: e.target.value})} />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Educational Credentials</label>
                                    <input className="form-input" style={{ width: '100%' }} value={userProfile.education} onChange={e => setUserProfile({...userProfile, education: e.target.value})} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Experience Bio / Skillset Overview</label>
                                    <textarea className="form-input" style={{ width: '100%', minHeight: '120px', resize: 'none' }} value={userProfile.bio} onChange={e => setUserProfile({...userProfile, bio: e.target.value})} />
                                </div>
                            </div>
                            <button onClick={() => setIsEditing(false)} className="btn-shimmer" style={{ width: '100%', padding: '16px', fontWeight: '950', marginTop: '30px', background: '#fff', color: '#000' }}>
                                <Save size={20} /> SYNCHRONIZE IDENTITY DATA
                            </button>
                        </div>
                    ) : (
                        /* VIEW MODE PANELS */
                        <>
                            {/* PANEL: ABOUT */}
                            <div className="glass-panel" style={{ padding: '40px' }}>
                                <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <User size={20} color="var(--electric-blue)" /> Professional Experience / Bio
                                </h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>
                                    {userProfile.bio}
                                </p>
                            </div>

                            {/* PANEL: EDUCATION & SKILLS */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                <div className="glass-panel" style={{ padding: '35px' }}>
                                    <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <BookOpen size={20} color="#00ff80" /> Background
                                    </h4>
                                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '1rem' }}>{userProfile.education}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '5px' }}>Specialized Disaster Management Training</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '35px' }}>
                                    <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Award size={20} color="#ffd700" /> Key Skills
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {userProfile.skills.map(skill => (
                                            <span key={skill} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', color: '#ffd700', border: '1px solid rgba(255,215,0,0.2)', fontWeight: '700' }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* PANEL: SYSTEM CREDENTIALS */}
                            <div className="glass-panel" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(0,210,255,0.05) 0%, rgba(0,0,0,0.2) 100%)' }}>
                                <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '900', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Shield size={20} color="#00ff80" /> BaySafe Operational Metrics
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                     {[ 
                                        { label: 'Incident Reports', val: '42', icon: <Navigation size={18} /> },
                                        { label: 'Total Interventions', val: '158', icon: <Activity size={18} /> },
                                        { label: 'Agency Trust Score', val: '9.8', icon: <CheckCircle2 size={18} /> }
                                     ].map((stat, i) => (
                                         <div key={i} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                             <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                 {stat.icon} {stat.label}
                                             </div>
                                             <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '950' }}>{stat.val}</div>
                                         </div>
                                     ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .thunder-text { background: linear-gradient(to right, #00d2ff, #3a7bd5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            `}</style>
        </div>
    );
};

export default ProfileModule;
