import React, { useState, useRef, useEffect } from 'react';
import {
    MapPin, AlertCircle, List, ClipboardCheck, Clock, CheckCircle, Camera, ThumbsUp,
    Send, Plus, Users, User, MessageSquare, Lock, ChevronDown, Newspaper, X
} from 'lucide-react';
import { dmsService } from '../../services/api';

// ─── LOCATION CONFIGURATION ──────────────────────────────────────────────────
const CITY_CONFIG = {
    Chennai: { label: 'சென்னை / Chennai', ta: 'சென்னை' },
    Tambaram: { label: 'தாம்பரம் / Tambaram', ta: 'தாம்பரம்' },
    Puducherry: { label: 'புதுச்சேரி / Puducherry', ta: 'புதுச்சேரி' },
    Cuddalore: { label: 'கடலூர் / Cuddalore', ta: 'கடலூர்' },
    Tuticorin: { label: 'தூத்துக்குடி / Tuticorin', ta: 'தூத்துக்குடி' },
};



const CHAT_MESSAGES = [
    { id: 1, from: 'Arjun Selvam', msg: 'Velachery rescue op complete. Moving to Pallikaranai.', time: '10:35' },
    { id: 2, from: 'Meena S.', msg: 'வேலச்சேரியில் நீர் நிலை குறைந்துள்ளது. நன்றி!', time: '10:38' },
    { id: 3, from: 'Priya Anand', msg: 'Medical team on the way to Tambaram camp.', time: '10:42' },
];

const STATUS_CONFIG = {
    PENDING: { color: '#ff8c00', label: 'நிலுவை / PENDING', bg: 'rgba(255,140,0,0.1)' },
    ONGOING: { color: '#00d2ff', label: 'செயல்பாட்டில் / EN ROUTE', bg: 'rgba(0,210,255,0.1)' },
    AWAITING_APPROVAL: { color: '#a855f7', label: 'ஒப்புதல் தேவை / AWAITING', bg: 'rgba(168,85,247,0.1)' },
    CLOSED: { color: '#00ff80', label: 'நிறைவு / CLOSED ✔', bg: 'rgba(0,255,128,0.1)' },
};

// ─── TASK TICKER ─────────────────────────────────────────────────────────────
const TaskTicker = ({ tasks }) => {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (tasks.length === 0) return;
        const timer = setInterval(() => {
            setIdx(prev => (prev + 1) % tasks.length);
        }, 3500); // 3-4s gap
        return () => clearInterval(timer);
    }, [tasks]);

    if (tasks.length === 0) return (
        <div style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            📢 இந்த நகரில் தற்போது பணிகள் இல்லை / No active tasks in this city.
        </div>
    );

    return (
        <div style={{ background: 'rgba(0,0,0,0.4)', borderLeft: '3px solid var(--electric-blue)', padding: '10px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '14px', overflow: 'hidden' }}>
            <Newspaper size={18} color="var(--electric-blue)" style={{ flexShrink: 0, zIndex: 2 }} />
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '24px' }}>
                <div style={{
                    display: 'flex',
                    height: '100%',
                    transform: `translateX(-${idx * 100}%)`,
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    {tasks.map((t, i) => {
                        const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.PENDING;
                        return (
                            <div key={t.id || i} style={{ flex: '0 0 100%', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <span style={{ color: cfg.color, fontWeight: 'bold', marginRight: '8px', fontSize: '0.75rem', flexShrink: 0 }}>[{cfg.label}]</span>
                                <span style={{ color: '#fff', fontSize: '0.9rem', marginRight: '8px', flexShrink: 0 }}>{t.title} — </span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.titleEn} | தொடர்பு / Contact: {t.contact}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── USER PROFILE CARD ────────────────────────────────────────────────────────
const UserProfileCard = ({ city }) => {
    const [dp, setDp] = useState(null);
    const fileRef = useRef();

    const handleDpChange = (e) => {
        const file = e.target.files[0];
        if (file) setDp(URL.createObjectURL(file));
    };

    return (
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(0,210,255,0.2)' }}>
            <div onClick={() => fileRef.current.click()} style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,210,255,0.1)', border: '2px dashed var(--electric-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}>
                {dp ? <img src={dp} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={22} color="var(--electric-blue)" />}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleDpChange} />
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>பயனர் சுயவிவரம் / User Profile</p>
                <p style={{ margin: '2px 0', fontWeight: 'bold', color: '#fff' }}>{localStorage.getItem('username') || 'Guest User'}</p>
                <p style={{ margin: 0, color: '#ffcc00', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {CITY_CONFIG[city]?.ta} / {city}
                </p>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>படம் அழுத்தி சுயசிறப்பு / Click photo to upload DP</p>
        </div>
    );
};

// ─── ADVANCED TASK FORM ───────────────────────────────────────────────────────
const AdvancedSOSForm = ({ city, onPost, onClose }) => {
    const [form, setForm] = useState({
        name: '', contact: '', address: '', locationLink: '',
        desc: '', needs: { food: '', clothing: '', equipment: '' },
        volunteerType: 'Rescue Activist', rescueType: 'Emergency Rescue'
    });
    const [posted, setPosted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
    const setNeed = (k, v) => setForm(prev => ({ ...prev, needs: { ...prev.needs, [k]: v } }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            let imageUrl = null;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const uploadRes = await dmsService.uploadFile(formData);
                imageUrl = uploadRes.data.url;
            }

            await onPost({
                name: form.name,
                city, type: form.volunteerType.split(' ')[0],
                contact: form.contact, location: city,
                desc: form.desc, title: `${form.desc.slice(0, 30)}...`,
                titleEn: form.desc.slice(0, 30),
                imageUrl: imageUrl
            });
            setPosted(true);
            setTimeout(() => { setPosted(false); onClose(); }, 4000);
        } catch (err) {
            console.error("SOS Form Error:", err);
            const serverMsg = err.response?.data?.message || err.response?.data?.error;
            setError(serverMsg || "Transmission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (posted) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '40px', textAlign: 'center' }}>
            <AlertCircle size={50} color="#ff4d4d" />
            <h3 style={{ color: '#ff4d4d', margin: 0 }}>SOS அனுப்பப்பட்டது / SOS Transmitted</h3>
            <p style={{ color: 'var(--text-secondary)' }}>உங்கள் அவசர கோரிக்கை அனைத்து தன்னார்வலர்களிடமும் அனுப்பப்பட்டது. / Your emergency has been sent to all active volunteers.</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Row 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>👤 பயனர் பெயர் / Username *</label>
                <input className="form-input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📞 தொலைபேசி / Contact *</label>
                <div style={{ display: 'flex' }}>
                    <span style={{ background: 'rgba(0,0,0,0.4)', padding: '10px', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none', borderRadius: '8px 0 0 8px', color: '#fff' }}>🇮🇳 +91</span>
                    <input className="form-input" style={{ borderRadius: '0 8px 8px 0' }} placeholder="10 digits" value={form.contact} maxLength={10} onChange={e => set('contact', e.target.value)} required />
                </div>
            </div>
            {/* Row 2 */}
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>🏠 முகவரி / Address *</label>
                    <input className="form-input" placeholder="Street, Landmark, District" value={form.address} onChange={e => set('address', e.target.value)} required />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>🔗 தேச வரைபட இணைப்பு / Location Link (Maps)</label>
                    <input className="form-input" placeholder="Google Maps URL or Coords" value={form.locationLink} onChange={e => set('locationLink', e.target.value)} />
                </div>
            </div>
            {/* Row 3 */}
            <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📝 சிக்கல் விவரம் / Problem Description *</label>
                <textarea className="form-input" placeholder="Describe your emergency in detail..." style={{ minHeight: '80px', resize: 'vertical' }} value={form.desc} onChange={e => set('desc', e.target.value)} required />
            </div>
            {/* Needs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>🍱 தேவைகள் / Required Needs</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input className="form-input" placeholder="🍚 உணவு விவரம் / Food Needs Description" value={form.needs.food} onChange={e => setNeed('food', e.target.value)} />
                    <input className="form-input" placeholder="👕 ஆடை விவரம் / Clothing Needs Description" value={form.needs.clothing} onChange={e => setNeed('clothing', e.target.value)} />
                    <input className="form-input" placeholder="🔧 உபகரணங்கள் / Equipment needed" value={form.needs.equipment} onChange={e => setNeed('equipment', e.target.value)} />
                </div>
            </div>
            {/* Volunteer Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>🤝 தேவையான தன்னார்வலர் வகை / Volunteer Type</label>
                {['Rescue Activist', 'NDRF Volunteer', 'NSS Volunteer'].map(v => (
                    <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: form.volunteerType === v ? 'var(--electric-blue)' : '#fff', cursor: 'pointer' }}>
                        <input type="radio" name="volunteerType" checked={form.volunteerType === v} onChange={() => set('volunteerType', v)} /> {v}
                    </label>
                ))}
            </div>
            {/* Rescue Type */}
            <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>⚡ மீட்பு வகை / Type of Rescue Needed</label>
                <select value={form.rescueType} onChange={e => set('rescueType', e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '10px', borderRadius: '8px', outline: 'none' }}>
                    <option>🚨 அவசர மீட்பு / Emergency Rescue</option>
                    <option>🍚 உணவு தேவை / Food Need</option>
                    <option>🏠 தங்குமிடம் தேவை / Shelter Need</option>
                    <option>👕 ஆடை தேவை / Clothing Need</option>
                    <option>🚚 இடமாற்றம் / Shifting Need</option>
                    <option>🚤 படகு தேவை / Boat Need</option>
                    <option>🩺 மருத்துவ உதவி / Medical Aid</option>
                    <option>🧹 இடிபாடு நீக்கம் / Debris Clearing</option>
                </select>
            </div>
            {/* Images */}
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📷 சிக்கல் படம் / Problem Image</label>
                    <div style={{ 
                        border: '1px dashed rgba(255,255,255,0.2)', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        textAlign: 'center', 
                        cursor: 'pointer',
                        position: 'relative',
                        height: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }} onClick={() => document.getElementById('sos-image').click()}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Click to upload image</span>
                        )}
                        <input id="sos-image" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                    </div>
                </div>
            </div>
            {/* Error Message */}
            {error && <div style={{ gridColumn: '1/-1', color: '#ff4d4d', background: 'rgba(255,75,75,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,75,75,0.2)', fontSize: '0.9rem' }}>⚠️ {error}</div>}

            {/* Submit */}
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '13px', background: isSubmitting ? 'rgba(255,60,60,0.1)' : 'rgba(255,60,60,0.2)', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '8px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.6 : 1 }}>
                    {isSubmitting ? (
                        <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: '#ff4d4d' }} />
                    ) : (
                        <Send size={16} />
                    )}
                    {isSubmitting ? 'பரிமாறுகிறது... / TRANSMITTING...' : 'அவசர SOS அனுப்பு / SEND EMERGENCY SOS'}
                </button>
                <button type="button" onClick={onClose} disabled={isSubmitting} style={{ padding: '13px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer' }}>
                    <X size={18} />
                </button>
            </div>
        </form>
    );
};

// ─── COMMUNITY CHAT ───────────────────────────────────────────────────────────
const CommunityChat = ({ city }) => {
    const [messages, setMessages] = useState(CHAT_MESSAGES);
    const [input, setInput] = useState('');
    const [privateTarget, setPrivateTarget] = useState(null);
    const endRef = useRef();

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const prefix = privateTarget ? `[🔒 Private → ${privateTarget}] ` : '';
        setMessages(prev => [...prev, { id: Date.now(), from: localStorage.getItem('username') || 'You', msg: prefix + input, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
        setInput('');
        setPrivateTarget(null);
    };

    return (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', minHeight: '450px', padding: 0 }}>
            {/* Chat Header */}
            <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(0,210,255,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageSquare size={20} color="var(--electric-blue)" />
                <div>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#fff', fontSize: '1rem' }}>சமூக அரட்டை / Community Chat</p>
                    <p style={{ margin: 0, color: '#00ff80', fontSize: '0.75rem' }}>● {CITY_CONFIG[city]?.label}</p>
                </div>
                {privateTarget && (
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', padding: '4px 12px', borderRadius: '12px' }}>
                        <Lock size={12} color="#a855f7" />
                        <span style={{ color: '#a855f7', fontSize: '0.8rem', fontWeight: 'bold' }}>Private: {privateTarget}</span>
                        <button onClick={() => setPrivateTarget(null)} style={{ background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer', padding: 0 }}><X size={14} /></button>
                    </div>
                )}
            </div>
            {/* Messages */}
            <div className="sidebar-scroll" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                {messages.map(msg => (
                    <div key={msg.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--electric-blue)', fontWeight: 'bold' }}>{msg.from}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{msg.time}</span>
                        </div>
                        <div style={{ background: 'rgba(0,210,255,0.07)', border: '1px solid rgba(0,210,255,0.15)', padding: '10px 14px', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', lineHeight: '1.4' }}>
                            {msg.msg}
                        </div>
                        <button onClick={() => setPrivateTarget(msg.from)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', padding: 0 }}>
                            <Lock size={12} /> தனிச் செய்தி / Private Reply
                        </button>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
            {/* Input */}
            <form onSubmit={handleSend} style={{ display: 'flex', padding: '12px', borderTop: '1px solid rgba(0,210,255,0.2)', background: 'rgba(0,0,0,0.4)', gap: '10px' }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder={privateTarget ? `Private message to ${privateTarget}...` : 'செய்தி / Type a message...'}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }} />
                <button type="submit" style={{ padding: '0 16px', background: 'rgba(0,210,255,0.2)', border: '1px solid var(--electric-blue)', color: 'var(--electric-blue)', borderRadius: '8px', cursor: 'pointer' }}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

// ─── TASK CARD ────────────────────────────────────────────────────────────────
const TaskCard = ({ task, onApprove, onPrivateChat }) => {
    const cfg = STATUS_CONFIG[task.status];
    const [reviewOpen, setReviewOpen] = useState(false);
    const [comment, setComment] = useState('');

    return (
        <div className="glass-panel" style={{ padding: '16px', border: `1px solid ${cfg.color}33`, background: cfg.bg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}`, padding: '1px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{task.type.toUpperCase()}</span>
                        <span style={{ fontSize: '0.7rem', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}`, padding: '1px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{cfg.label}</span>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '0.95rem' }}>#{task.id} — {task.title}</h4>
                    <p style={{ margin: '0 0 2px 0', color: '#ccc', fontSize: '0.8rem', fontStyle: 'italic' }}>{task.titleEn}</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: '1.4' }}>{task.desc}</p>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap', marginTop: '8px', marginBottom: '12px' }}>
                <span><MapPin size={11} /> {task.location || task.city}</span>
                <span><Clock size={11} /> {task.time}</span>
                <span><User size={11} /> {task.postedBy}</span>
                {task.contact && <span>📞 {task.contact}</span>}
                {task.assignedTo && <span style={{ color: '#00ff80' }}><CheckCircle size={11} /> {task.assignedTo}</span>}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button onClick={() => onPrivateChat(task.postedBy)}
                    style={{ padding: '6px 12px', background: 'rgba(168,85,247,0.1)', border: '1px solid #a855f7', color: '#a855f7', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
                    <Lock size={12} /> தனிச்செய்தி / Private Chat
                </button>
                {task.status === 'AWAITING_APPROVAL' && task.report && (
                    <button onClick={() => setReviewOpen(!reviewOpen)}
                        style={{ padding: '6px 12px', background: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: '#a855f7', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
                        <Camera size={12} /> {reviewOpen ? 'மறை / Hide' : 'ரிப்போர்ட் பார் / Review'}
                    </button>
                )}
            </div>
            {task.status === 'AWAITING_APPROVAL' && task.report && reviewOpen && (
                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ margin: 0, color: '#fff', fontSize: '0.85rem' }}><strong>தன்னார்வலர்:</strong> {task.report.volunteerName} ({task.report.contact})</p>
                    <p style={{ margin: 0, color: '#fff', fontSize: '0.85rem' }}><strong>இடம்:</strong> {task.report.location}</p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{task.report.rescueDesc}</p>
                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(168,85,247,0.4)', borderRadius: '6px', padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📷 [மீட்பு படம் / Rescue Photo]</div>
                    <textarea placeholder="ஒப்புதல் கருத்து / Approval comment..."
                        value={comment} onChange={e => setComment(e.target.value)}
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: '6px', resize: 'vertical', outline: 'none', minHeight: '50px', fontSize: '0.85rem' }} />
                    <button onClick={() => onApprove(task.id, comment)}
                        style={{ padding: '10px', background: 'rgba(0,255,128,0.2)', border: '1px solid #00ff80', color: '#00ff80', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <ThumbsUp size={14} /> ஒப்புதல் & முடிவு / APPROVE & CLOSE
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── MAIN MODULE ──────────────────────────────────────────────────────────────
const TaskFeedModule = () => {
    const [selectedCity, setSelectedCity] = useState('Chennai');
    const [tasks, setTasks] = useState([]);
    const [vols, setVols] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('feed');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [showForm, setShowForm] = useState(false);
    const [chatTarget, setChatTarget] = useState(null);

    useEffect(() => {
        refreshData();
        const timer = setInterval(refreshData, 30000); // 30s auto-refresh
        return () => clearInterval(timer);
    }, []);

    const refreshData = async () => {
        try {
            const [taskRes, volRes] = await Promise.all([
                dmsService.getTasks(),
                dmsService.getActiveVolunteers()
            ]);

            // Map backend tasks to frontend expectations
            const mappedTasks = taskRes.data.map(t => ({
                id: t.id,
                city: t.location || 'Unknown',
                title: t.title,
                titleEn: t.title,
                type: t.category,
                contact: 'Stored in DB',
                status: t.status,
                time: new Date(t.created_at).toLocaleTimeString(),
                postedBy: `User #${t.requester_id}`,
                assignedTo: t.volunteer_id ? `Volunteer #${t.volunteer_id}` : null,
                desc: t.desc,
                report: t.report_desc ? {
                    volunteerName: `Volunteer #${t.volunteer_id}`,
                    rescueDesc: t.report_desc
                } : null
            }));

            setTasks(mappedTasks);
            setVols(volRes.data);
        } catch (err) {
            console.error("Sync error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async (data) => {
        try {
            await dmsService.createTask({
                name: data.name,
                title: data.title,
                desc: data.desc,
                location: data.city,
                category: data.type,
                urgency: 'Medium',
                lat: 13.0, // Mock lat/lon for now or get from geoloc
                lon: 80.0,
                report_img: data.imageUrl
            });
            refreshData();
            // We don't close immediately here anymore, the Form handles showing success
        } catch (err) {
            console.error("SOS Transmission Failed:", err);
            throw err; // Re-throw to be caught by the form's handleSubmit
        }
    };

    const handleApprove = async (taskId, comment) => {
        try {
            await dmsService.updateTask(taskId, 'approve', { comment });
            refreshData();
        } catch (err) {
            alert("Approval failed.");
        }
    };

    const tabStyle = (id) => ({
        padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '7px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', transition: 'all 0.3s',
        color: activeTab === id ? '#000' : 'var(--electric-blue)',
        background: activeTab === id ? 'var(--electric-blue)' : 'rgba(0,210,255,0.1)',
        border: `1px solid ${activeTab === id ? 'var(--electric-blue)' : 'rgba(0,210,255,0.3)'}`,
    });

    const cityTasks = tasks.filter(t => t.city === selectedCity);
    const displayTasks = filterStatus === 'ALL' ? cityTasks : cityTasks.filter(t => t.status === filterStatus);
    const cityVolunteers = vols.filter(v => v.city === selectedCity);

    if (loading) return (
        <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
            <h2 className="thunder-text">தரவு ஏற்றப்படுகிறது... / Loading Syncing...</h2>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

            {/* ─ Header ─ */}
            <div className="glass-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div>
                        <h2 className="thunder-text hover-shine" style={{ margin: 0, fontSize: '1.6rem', letterSpacing: '1px', fontWeight: '800' }}>மீட்பு பணிகள் மையம் : RESCUE TASK CENTER</h2>
                        <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            {cityTasks.filter(t => t.status === 'PENDING').length} நிலுவை பணிகள் / pending · {cityVolunteers.length} தன்னார்வலர்கள் / active volunteers
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Location Selector */}
                        <div style={{ position: 'relative' }}>
                            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                                style={{ appearance: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid var(--electric-blue)', padding: '10px 40px 10px 16px', borderRadius: '8px', outline: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
                                {Object.entries(CITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                            <ChevronDown size={14} color="var(--electric-blue)" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <button onClick={() => setShowForm(!showForm)}
                            style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,60,60,0.15)', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}>
                            <Plus size={18} /> SOS அனுப்பு / Post
                        </button>
                    </div>
                </div>
                {/* Task Ticker */}
                <TaskTicker tasks={cityTasks} />
            </div>

            {/* ─ User Profile ─ */}
            <UserProfileCard city={selectedCity} />

            {/* ─ SOS Form (Collapsible) ─ */}
            {showForm && (
                <div className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(255,60,60,0.3)' }}>
                    <h3 style={{ margin: '0 0 24px 0', color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem' }}>
                        <AlertCircle size={20} /> அவசர பணி பதிவு / Emergency Task Registration
                    </h3>
                    <AdvancedSOSForm city={selectedCity} onPost={handlePost} onClose={() => setShowForm(false)} />
                </div>
            )}

            {/* ─ Main Grid ─ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '30px', alignItems: 'start' }}>

                {/* Left: Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Tab Nav */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button style={tabStyle('feed')} onClick={() => setActiveTab('feed')}><List size={15} /> பணி பட்டியல் / Feed</button>
                        <button style={tabStyle('roster')} onClick={() => setActiveTab('roster')}><Users size={15} /> தன்னார்வலர் / Roster</button>
                        <button style={tabStyle('review')} onClick={() => setActiveTab('review')}><ClipboardCheck size={15} /> ஒப்புதல் / Review</button>
                    </div>

                    {/* Status Filters */}
                    {activeTab === 'feed' && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['ALL', 'PENDING', 'ONGOING', 'AWAITING_APPROVAL', 'CLOSED'].map(s => (
                                <button key={s} onClick={() => setFilterStatus(s)}
                                    style={{
                                        padding: '4px 12px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem',
                                        color: filterStatus === s ? '#000' : 'var(--text-secondary)',
                                        background: filterStatus === s ? 'var(--electric-blue)' : 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${filterStatus === s ? 'var(--electric-blue)' : 'rgba(255,255,255,0.1)'}`
                                    }}>
                                    {s.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    )}



                    {/* Feed Content */}
                    {activeTab === 'feed' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {displayTasks.map(t => <TaskCard key={t.id} task={t} onApprove={handleApprove} onPrivateChat={(name) => setChatTarget(name)} />)}
                            {displayTasks.length === 0 && (
                                <div className="glass-panel flex-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
                                    இங்கு பணிகள் இல்லை / No tasks found for this filter.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Roster */}
                    {activeTab === 'roster' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                            {cityVolunteers.map(v => (
                                <div key={v.id} className="glass-panel" style={{ padding: '14px', border: '1px solid rgba(0,255,128,0.2)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 'bold', color: '#fff' }}>{v.nameT}</span>
                                        <span style={{ fontSize: '0.7rem', background: 'rgba(0,255,128,0.15)', color: '#00ff80', padding: '1px 7px', borderRadius: '12px' }}>● செயல் / ACTIVE</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{v.expertiseT} / {v.expertise}</p>
                                </div>
                            ))}
                            {cityVolunteers.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>இந்த நகரில் தன்னார்வலர்கள் இல்லை / No volunteers in this city.</p>}
                        </div>
                    )}

                    {/* Review */}
                    {activeTab === 'review' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {cityTasks.filter(t => t.status === 'AWAITING_APPROVAL').map(t => (
                                <TaskCard key={t.id} task={t} onApprove={handleApprove} onPrivateChat={(name) => setChatTarget(name)} />
                            ))}
                            {cityTasks.filter(t => t.status === 'AWAITING_APPROVAL').length === 0 && (
                                <div className="glass-panel flex-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>ஒப்புதல் தேவையான பணிகள் இல்லை / No reports pending approval. ✅</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Community Chat */}
                <div>
                    {chatTarget && (
                        <div style={{ marginBottom: '10px', padding: '8px 12px', background: 'rgba(168,85,247,0.15)', border: '1px solid #a855f7', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#a855f7', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={14} /> Private mode: {chatTarget}</span>
                            <button onClick={() => setChatTarget(null)} style={{ background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer' }}><X size={14} /></button>
                        </div>
                    )}
                    <CommunityChat city={selectedCity} />
                </div>
            </div>
        </div>
    );
};

export default TaskFeedModule;
