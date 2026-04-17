import React, { useState } from 'react';
import { 
    ShieldAlert, PlayCircle, BookOpen, AlertTriangle, 
    ChevronRight, CheckCircle2, Info, Video, Zap, 
    Droplets, Flame, Mountain, Activity, Wind, Languages
} from 'lucide-react';

const AWARENESS_DATA = [
    {
        id: 'cyclone',
        icon: <Wind size={32} color="#00d2ff" />,
        color: '#00d2ff',
        titleEn: 'Cyclone & Storm Protocol',
        titleTa: 'புயல் மற்றும் சூறாவளி நெறிமுறை',
        category: 'NATURAL',
        descriptionEn: 'Essential steps during high-velocity wind events and cyclonic storms in coastal regions.',
        descriptionTa: 'கடலோரப் பகுதிகளில் பலத்த காற்று மற்றும் சூறாவளிப் புயல்களின் போது மேற்கொள்ள வேண்டிய அத்தியாவசிய நடவடிக்கைகள்.',
        videos: [
            { title: 'Cyclone Safety Guide', url: 'https://www.youtube.com/watch?v=3449L_CiB4s' },
            { title: 'NDRF Cyclone Response', url: 'https://www.youtube.com/watch?v=D0dXYBKECOk' }
        ],
        tips: [
            { t: 'புயல் எச்சரிக்கை வந்தவுடன் பாதுகாப்பான கட்டிடங்களுக்கு செல்லவும்.', e: 'Move to sturdy buildings immediately upon cyclone warning.' },
            { t: 'ஜன்னல்கள் மற்றும் கதவுகளை மூடி பலப்படுத்தவும்.', e: 'Secure all windows and doors, board them if possible.' },
            { t: 'மின்கம்பங்கள், மரங்கள் அருகே செல்ல வேண்டாம்.', e: 'Stay away from electric poles, trees, and metal structures.' }
        ]
    },
    {
        id: 'flood',
        icon: <Droplets size={32} color="#38bdf8" />,
        color: '#38bdf8',
        titleEn: 'Flood & Water Safety',
        titleTa: 'வெள்ளம் மற்றும் நீர் பாதுகாப்பு',
        category: 'NATURAL',
        descriptionEn: 'Flash flood response and water-borne disease prevention strategies.',
        descriptionTa: 'திடீர் வெள்ளப்பெருக்கு மற்றும் நீரினால் பரவும் நோய் தடுப்பு முறைகள்.',
        videos: [
            { title: 'Flood Survival Tips', url: 'https://www.youtube.com/watch?v=IY2cCO7gFKo' },
            { title: 'Rescue Operations Demo', url: 'https://www.youtube.com/watch?v=MO6Zn-9cLNc' }
        ],
        tips: [
            { t: 'ஆழமான நீர் பகுதியில் நடக்க வேண்டாம்; 15 செ.மீ ஆழ நீர் கூட ஆபத்தானது.', e: 'Never walk through floodwater; even 15cm depth can be dangerous.' },
            { t: 'வீட்டில் மின்சாரம் இருந்தால் Main Switch OFF செய்யவும்.', e: 'Turn off the main electricity switch immediately when water enters.' },
            { t: 'குடிநீரை காய்ச்சி அல்லது Chlorine tablet பயன்படுத்தவும்.', e: 'Boil drinking water or use Chlorine tablets to purify.' }
        ]
    },
    {
        id: 'fire',
        icon: <Flame size={32} color="#ff6b6b" />,
        color: '#ff6b6b',
        titleEn: 'Fire & Industrial Safety',
        titleTa: 'தீ மற்றும் தொழில்முறை பாதுகாப்பு',
        category: 'HUMAN_MADE',
        descriptionEn: 'Emergency evacuation and fire suppression techniques for home and industry.',
        descriptionTa: 'வீடு மற்றும் தொழிற்சாலைகளுக்கான அவசரகால வெளியேற்றம் மற்றும் தீயணைப்பு நுட்பங்கள்.',
        videos: [
            { title: 'Fire Safety Basics', url: 'https://www.youtube.com/watch?v=oI8aSdN6URI' },
            { title: 'Industrial Fire Drills', url: 'https://www.youtube.com/watch?v=6YtG89uX-0k' }
        ],
        tips: [
            { t: 'தீ விபத்து ஏற்பட்டால் உடனடியாக 101 அழைக்கவும்.', e: 'Call 101 (Fire Service) immediately upon fire outbreak.' },
            { t: 'புகையில் சிக்கினால் தரையில் ஊர்ந்து செல்லவும்; புகை மேலே செல்லும்.', e: 'Crawl low in smoke — smoke rises, breathable air stays below.' },
            { t: 'மின்சார தீக்கு நீர் ஊற்ற வேண்டாம்; CO2 அணைப்பானை பயன்படுத்தவும்.', e: 'Never use water on electrical fires; use CO2 extinguishers.' }
        ]
    },
    {
        id: 'medical',
        icon: <Activity size={32} color="#00ff80" />,
        color: '#00ff80',
        titleEn: 'Emergency First Aid & CPR',
        titleTa: 'அவசர முதலுதவி மற்றும் சிபிஆர்',
        category: 'GENERAL',
        descriptionEn: 'Critical life-saving protocols before professional medical help arrives.',
        descriptionTa: 'மருத்துவ உதவி வருவதற்கு முன் உயிரைக் காக்கும் முக்கியமான வழிமுறைகள்.',
        videos: [
            { title: 'CPR Instruction Tamil', url: 'https://www.youtube.com/watch?v=0aV3_--TWWU' },
            { title: 'Snake Bite First Aid', url: 'https://www.youtube.com/watch?v=s4b7Nvnhlqc' }
        ],
        tips: [
            { t: 'ORS பொடி, Paracetamol, Dettol எப்போதும் வைத்திருங்கள்.', e: 'Keep ORS, Paracetamol, and antiseptic ready at home.' },
            { t: 'பாம்பு கடித்தால்: கட்டி போட வேண்டாம், உடனே 108 அழைக்கவும்.', e: 'Snake bite: Do NOT tie a tourniquet. Call 108 immediately.' },
            { t: 'CPR: 30 நெஞ்சு அமுக்கம் + 2 மூச்சு ஊதல் = 1 சுழற்சி.', e: 'CPR: 30 chest compressions + 2 rescue breaths = 1 cycle.' }
        ]
    }
];

const AwarenessModule = () => {
    const [selectedCat, setSelectedCat] = useState('ALL');
    const [viewDetail, setViewDetail] = useState(null);
    const [lang, setLang] = useState('TA'); // 'TA' | 'EN'

    const isTamil = lang === 'TA';
    const filtered = selectedCat === 'ALL' 
        ? AWARENESS_DATA 
        : AWARENESS_DATA.filter(d => d.category === selectedCat);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 className="thunder-text" style={{ fontSize: '2.2rem', margin: 0, fontWeight: '950', letterSpacing: '1px' }}>
                        {isTamil ? 'விழிப்புணர்வு மையம்' : 'AWARENESS HUB'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0', fontSize: '1rem', maxWidth: '700px', lineHeight: '1.6' }}>
                        {isTamil 
                            ? 'இயற்கை மற்றும் மனிதனால் உருவாகும் பேரிடர்களுக்கான பாதுகாப்பு நெறிமுறைகளைக் கற்கவும். அறிவுசார் விழிப்புணர்வே முதல் பாதுகாப்பு.' 
                            : 'Education is the first line of defense. Learn critical protocols for natural and human-originated calamities.'}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button 
                        onClick={() => setLang(l => l === 'TA' ? 'EN' : 'TA')}
                        className="btn-shimmer"
                        style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '12px', fontSize: '0.85rem' }}
                    >
                        <Languages size={18} />
                        {isTamil ? 'Switch to English' : 'தமிழ் மற்றும் ஆங்கிலம்'}
                    </button>
                    <div style={{ display: 'flex', gap: '8px', padding: '5px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {['ALL', 'NATURAL', 'HUMAN', 'GENERAL'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCat(cat)}
                                style={{
                                    padding: '8px 15px', borderRadius: '10px', border: 'none',
                                    background: selectedCat === cat ? 'var(--electric-blue)' : 'transparent',
                                    color: selectedCat === cat ? '#000' : '#fff',
                                    fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.7rem'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {filtered.map((item, idx) => (
                    <div 
                        key={item.id}
                        className="glass-panel anti-gravity-hover"
                        style={{ 
                            padding: '30px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.05)', animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`
                        }}
                        onClick={() => setViewDetail(item)}
                    >
                        <div style={{ marginBottom: '20px' }}>{item.icon}</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>{isTamil ? item.titleTa : item.titleEn}</h3>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: item.color, margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>{isTamil ? item.titleEn : item.titleTa}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 20px 0' }}>{isTamil ? item.descriptionTa : item.descriptionEn}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-secondary)' }}>
                                {item.category}
                            </div>
                            <button style={{ background: 'none', border: 'none', color: item.color, display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '1px' }}>
                                {isTamil ? 'மேலும் அறிய' : 'VIEW PROTOCOLS'} <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PROTOCOL MODAL */}
            {viewDetail && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) setViewDetail(null); }}>
                    <div className="glass-panel" style={{ 
                        width: '90%', maxWidth: '1000px', maxHeight: '85vh', overflow: 'hidden',
                        display: 'flex', border: `1px solid ${viewDetail.color}44`, boxShadow: `0 0 50px ${viewDetail.color}22`
                    }}>
                        {/* Left: Info */}
                        <div className="sidebar-scroll" style={{ flex: 1.2, padding: '40px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                                <div style={{ transform: 'scale(1.2)' }}>{viewDetail.icon}</div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '950', color: '#fff' }}>{isTamil ? viewDetail.titleTa : viewDetail.titleEn}</h2>
                                    <h3 style={{ margin: '4px 0 0', fontSize: '1rem', color: viewDetail.color, fontWeight: '800', letterSpacing: '1px' }}>{isTamil ? viewDetail.titleEn : viewDetail.titleTa}</h3>
                                </div>
                            </div>

                            <section style={{ marginBottom: '35px' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '1.1rem', marginBottom: '20px', fontWeight: '900' }}>
                                    <ShieldAlert size={20} color={viewDetail.color} /> {isTamil ? 'பாதுகாப்பு நெறிமுறைகள்' : 'Safety Protocols'}
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {viewDetail.tips.map((tip, i) => (
                                        <div key={i} style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', borderLeft: `6px solid ${viewDetail.color}` }}>
                                            <p style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: '700', lineHeight: '1.6' }}>{tip.t}</p>
                                            <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>{tip.e}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <button onClick={() => setViewDetail(null)} className="btn-shimmer" style={{ padding: '12px 30px', fontWeight: '900' }}>
                                {isTamil ? 'திரும்பச் செல்லவும்' : 'BACK TO HUB'}
                            </button>
                        </div>

                        {/* Right: Media */}
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '40px', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '1.1rem', fontWeight: '900' }}>
                                <Video size={20} color="var(--electric-blue)" /> {isTamil ? 'பயிற்சி காணொலிகள்' : 'TRAINING VIDEOS'}
                            </h4>
                            {viewDetail.videos.map((vid, i) => (
                                <a key={i} href={vid.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }} className="anti-gravity-hover">
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,100,100,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <PlayCircle size={24} color="#ff4d4d" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', color: '#fff', fontSize: '0.9rem' }}>{vid.title}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{isTamil ? 'நேரடி ஒளிபரப்பு' : 'Direct Stream'}</div>
                                    </div>
                                    <ChevronRight size={18} color="rgba(255,255,255,0.2)" style={{ marginLeft: 'auto' }} />
                                </a>
                            ))}
                            <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(0,180,255,0.05)', borderRadius: '14px', border: '1px solid rgba(0,210,255,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <Info size={16} color="var(--electric-blue)" />
                                    <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--electric-blue)' }}>{isTamil ? 'ஆலோசனை' : 'ADVISORY'}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                                    {isTamil 
                                        ? 'இந்த நெறிமுறைகள் NDRF மற்றும் NDMA தரநிலைகளைப் பின்பற்றியவை. அதிகாரிகளின் உத்தரவுகளைப் பின்பற்றவும்.'
                                        : 'These protocols mirror NDMA & NDRF standards. Always follow local authority instructions during calamities.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AwarenessModule;
