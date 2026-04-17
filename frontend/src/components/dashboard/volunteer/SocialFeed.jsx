import React, { useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:5000/api';
const token = () => localStorage.getItem('baysafe_token');
const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

const URGENCY_COLOR = { High: '#ff4d4d', Medium: '#ffb800', Low: '#00d2ff' };
const STATUS_COLOR  = { PENDING: '#ffb800', ONGOING: '#00d2ff', CLOSED: '#00ff80', AWAITING_APPROVAL: '#a855f7' };

/* ─────────────── TASK SUBMISSION FORM (Users only) ─────────────────── */
function TaskForm({ onClose, onSuccess }) {
    const [form, setForm] = useState({
        requester_name: localStorage.getItem('baysafe_username') || '',
        requester_phone: '',
        situation: '',
        needed_things: '',
        rescue_type: 'Rescue',
        location: '',
        city: localStorage.getItem('baysafe_city') || '',
        urgency: 'High',
        category: 'Rescue',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImg = (e) => {
        const f = e.target.files[0];
        if (f) { setImageFile(f); setImgPreview(URL.createObjectURL(f)); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            let report_img = null;
            if (imageFile) {
                const fd = new FormData();
                fd.append('file', imageFile);
                const r = await fetch(`${API}/dms/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token()}` }, body: fd });
                const d = await r.json();
                report_img = d.url;
            }
            const res = await fetch(`${API}/dms/tasks`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ ...form, report_img }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlay}>
            <div style={{ ...modal, maxWidth: '580px' }}>
                <div style={modalHeader}>
                    <span style={{ fontSize: '1.5rem' }}>🚨</span>
                    <h2 style={{ margin: 0, color: '#ff4d4d', fontSize: '1.3rem', fontWeight: 800 }}>Submit Rescue Request</h2>
                    <button onClick={onClose} style={closeBtn}>✕</button>
                </div>
                {error && <div style={errorBox}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={row2}>
                        <label style={lbl}>Your Name *</label>
                        <input style={inp} required value={form.requester_name}
                            onChange={e => setForm(f => ({ ...f, requester_name: e.target.value }))} placeholder="Full name" />
                    </div>
                    <div style={row2}>
                        <label style={lbl}>Phone Number *</label>
                        <input style={inp} required value={form.requester_phone}
                            onChange={e => setForm(f => ({ ...f, requester_phone: e.target.value }))} placeholder="+91XXXXXXXXXX" />
                    </div>
                    <div>
                        <label style={lbl}>Describe Your Situation *</label>
                        <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' }} required value={form.situation}
                            onChange={e => setForm(f => ({ ...f, situation: e.target.value }))}
                            placeholder="Describe what happened, how many people affected..." />
                    </div>
                    <div>
                        <label style={lbl}>What Do You Need? (Food / Medicine / Shelter...)</label>
                        <textarea style={{ ...inp, minHeight: '60px', resize: 'vertical' }} value={form.needed_things}
                            onChange={e => setForm(f => ({ ...f, needed_things: e.target.value }))}
                            placeholder="List items needed: food, water, medicine, blankets..." />
                    </div>
                    <div style={row2}>
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>Type of Rescue</label>
                            <select style={inp} value={form.rescue_type} onChange={e => setForm(f => ({ ...f, rescue_type: e.target.value }))}>
                                {['Rescue', 'Medical Aid', 'Food & Water', 'Shelter', 'Evacuation', 'Search & Rescue', 'Other'].map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>Urgency</label>
                            <select style={inp} value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}>
                                {['High', 'Medium', 'Low'].map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                    <div style={row2}>
                        <div style={{ flex: 2 }}>
                            <label style={lbl}>Full Address *</label>
                            <input style={inp} required value={form.location}
                                onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Street, landmark, area..." />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>City *</label>
                            <input style={inp} required value={form.city}
                                onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Chennai" />
                        </div>
                    </div>
                    <div>
                        <label style={lbl}>Photo (optional)</label>
                        <input type="file" accept="image/*" onChange={handleImg} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }} />
                        {imgPreview && <img src={imgPreview} alt="preview" style={{ width: '100%', borderRadius: '10px', marginTop: '8px', maxHeight: '160px', objectFit: 'cover' }} />}
                    </div>
                    <button type="submit" disabled={loading} style={submitBtn('#ff4d4d')}>
                        {loading ? '⏳ Submitting...' : '🚨 Send Rescue Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ─────────────── VOLUNTEER REGISTRATION FORM ────────────────────────── */
function VolunteerProfileForm({ onClose, onSuccess, existing }) {
    const [form, setForm] = useState({
        full_name: existing?.full_name || localStorage.getItem('baysafe_username') || '',
        address: existing?.address || '',
        city: existing?.city || localStorage.getItem('baysafe_city') || '',
        qualification: existing?.qualification || '',
        area_of_operation: existing?.area_of_operation || '',
        role_type: existing?.role_type || 'Rescue',
        department: existing?.department || '',
        has_med_kit: existing?.has_med_kit || false,
        needed_items: existing?.needed_items || '',
        is_available: existing?.is_available !== false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await fetch(`${API}/dms/volunteer/profile`, {
                method: 'POST', headers: authHeaders(), body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally { setLoading(false); }
    };

    return (
        <div style={overlay}>
            <div style={{ ...modal, maxWidth: '580px' }}>
                <div style={modalHeader}>
                    <span style={{ fontSize: '1.5rem' }}>🤝</span>
                    <h2 style={{ margin: 0, color: '#00ff80', fontSize: '1.3rem', fontWeight: 800 }}>Volunteer Profile</h2>
                    <button onClick={onClose} style={closeBtn}>✕</button>
                </div>
                {error && <div style={errorBox}>{error}</div>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={row2}>
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>Full Name *</label>
                            <input style={inp} required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>City *</label>
                            <input style={inp} required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Chennai" />
                        </div>
                    </div>
                    <div>
                        <label style={lbl}>Full Address *</label>
                        <input style={inp} required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street, area..." />
                    </div>
                    <div>
                        <label style={lbl}>Qualification</label>
                        <input style={inp} value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} placeholder="e.g. MBBS, Civil Engineer, First Aid Certified" />
                    </div>
                    <div>
                        <label style={lbl}>Area of Operation</label>
                        <input style={inp} value={form.area_of_operation} onChange={e => setForm(f => ({ ...f, area_of_operation: e.target.value }))} placeholder="e.g. North Chennai, Coastal zones" />
                    </div>
                    <div style={row2}>
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>Role Type</label>
                            <select style={inp} value={form.role_type} onChange={e => setForm(f => ({ ...f, role_type: e.target.value }))}>
                                {['Rescue', 'Medical', 'Relief', 'Logistics', 'Communication', 'Search', 'Other'].map(v => <option key={v}>{v}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>Department / Organisation</label>
                            <input style={inp} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="NDRF, Red Cross, NGO..." />
                        </div>
                    </div>
                    <div>
                        <label style={lbl}>Needed Items / Supplies</label>
                        <input style={inp} value={form.needed_items} onChange={e => setForm(f => ({ ...f, needed_items: e.target.value }))} placeholder="e.g. oxygen cylinder, rope, torch..." />
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '4px' }}>
                        <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <input type="checkbox" checked={form.has_med_kit} onChange={e => setForm(f => ({ ...f, has_med_kit: e.target.checked }))} />
                            <span>I have a medical kit</span>
                        </label>
                        <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <input type="checkbox" checked={form.is_available} onChange={e => setForm(f => ({ ...f, is_available: e.target.checked }))} />
                            <span>Currently Available</span>
                        </label>
                    </div>
                    <button type="submit" disabled={loading} style={submitBtn('#00ff80')}>
                        {loading ? '⏳ Saving...' : '✅ Save Volunteer Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ─────────────── DM CHAT PANEL ──────────────────────────────────────── */
function DMPanel({ volunteer, onClose }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const myId = parseInt(localStorage.getItem('baysafe_user_id'));

    const load = async () => {
        const r = await fetch(`${API}/dms/messages/${volunteer.id}`, { headers: authHeaders() });
        if (r.ok) setMessages(await r.json());
    };

    useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, [volunteer.id]);

    const send = async () => {
        if (!text.trim()) return;
        await fetch(`${API}/dms/messages/send`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ receiver_id: volunteer.id, content: text }) });
        setText(''); load();
    };

    return (
        <div style={overlay}>
            <div style={{ ...modal, maxWidth: '420px' }}>
                <div style={modalHeader}>
                    <span>💬</span>
                    <h2 style={{ margin: 0, color: '#00d2ff', fontSize: '1.1rem', fontWeight: 800 }}>Message — {volunteer.full_name}</h2>
                    <button onClick={onClose} style={closeBtn}>✕</button>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                    {messages.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No messages yet. Start the conversation!</p>}
                    {messages.map(m => (
                        <div key={m.id} style={{ textAlign: m.sender_id === myId ? 'right' : 'left' }}>
                            <span style={{
                                display: 'inline-block', padding: '8px 14px', borderRadius: '16px', maxWidth: '80%',
                                background: m.sender_id === myId ? 'rgba(0,210,255,0.2)' : 'rgba(255,255,255,0.08)',
                                color: '#fff', fontSize: '0.9rem'
                            }}>{m.content}</span>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {new Date(m.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input style={{ ...inp, flex: 1 }} value={text} onChange={e => setText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." />
                    <button onClick={send} style={submitBtn('#00d2ff')} disabled={!text.trim()}>Send</button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────── TASK CARD ──────────────────────────────────────────── */
function TaskCard({ task, role, onAccept, onComplete }) {
    const [expanded, setExpanded] = useState(false);
    const img = task.report_img ? `http://localhost:5000${task.report_img}` : null;

    return (
        <div style={{
            background: 'rgba(0,15,35,0.6)', border: `1px solid ${URGENCY_COLOR[task.urgency] || '#333'}44`,
            borderRadius: '16px', overflow: 'hidden', transition: 'box-shadow 0.2s',
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px ${URGENCY_COLOR[task.urgency] || '#00d2ff'}33`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
            {img && <img src={img} alt="task" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }} />}
            <div style={{ padding: '16px' }}>
                {/* Author row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,77,77,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '1px solid rgba(255,77,77,0.4)' }}>👤</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{task.requester_name || task.requester_username || 'Anonymous'}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>📞 {task.requester_phone || 'N/A'}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ ...badge, background: `${URGENCY_COLOR[task.urgency]}22`, color: URGENCY_COLOR[task.urgency], border: `1px solid ${URGENCY_COLOR[task.urgency]}44` }}>{task.urgency}</span>
                        <span style={{ ...badge, background: `${STATUS_COLOR[task.status]}22`, color: STATUS_COLOR[task.status], border: `1px solid ${STATUS_COLOR[task.status]}44` }}>{task.status}</span>
                    </div>
                </div>

                {/* Situation */}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6', margin: '0 0 10px' }}>
                    {expanded ? task.situation : (task.situation?.slice(0, 120) + (task.situation?.length > 120 ? '...' : ''))}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {task.rescue_type && <span style={{ ...pill, background: 'rgba(0,210,255,0.1)', color: '#00d2ff' }}>⛑️ {task.rescue_type}</span>}
                    {task.needed_things && <span style={{ ...pill, background: 'rgba(255,184,0,0.1)', color: '#ffb800' }}>📦 {task.needed_things.slice(0, 40)}</span>}
                    {task.city && <span style={{ ...pill, background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>📍 {task.city}</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    🏠 {task.location} &nbsp;|&nbsp; {new Date(task.created_at).toLocaleString()}
                </div>
                {task.volunteer_name && <div style={{ fontSize: '0.8rem', color: '#00ff80', marginBottom: '8px' }}>🤝 Assigned to: {task.volunteer_name}</div>}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => setExpanded(!expanded)} style={ghostBtn}>
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                    {role === 'volunteer' && task.status === 'PENDING' && (
                        <button onClick={() => onAccept(task.id)} style={{ ...ghostBtn, color: '#00ff80', borderColor: '#00ff8044' }}>
                            ✅ Accept Task
                        </button>
                    )}
                    {role === 'volunteer' && task.status === 'ONGOING' && task.volunteer_id === parseInt(localStorage.getItem('baysafe_user_id')) && (
                        <button onClick={() => onComplete(task.id)} style={{ ...ghostBtn, color: '#a855f7', borderColor: '#a855f744' }}>
                            🏁 Mark Complete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─────────────── VOLUNTEER CARD ─────────────────────────────────────── */
function VolunteerCard({ vol, myRole, onMessage }) {
    return (
        <div style={{
            background: 'rgba(0,15,35,0.6)', border: '1px solid rgba(0,255,128,0.2)',
            borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,255,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px solid rgba(0,255,128,0.4)' }}>🤝</div>
                    <div>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{vol.full_name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#00ff80' }}>{vol.role_type} &nbsp;|&nbsp; {vol.department || 'Independent'}</div>
                    </div>
                </div>
                <span style={{ ...badge, background: vol.is_available ? 'rgba(0,255,128,0.1)' : 'rgba(255,100,100,0.1)', color: vol.is_available ? '#00ff80' : '#ff6464', border: `1px solid ${vol.is_available ? '#00ff8044' : '#ff646444'}` }}>
                    {vol.is_available ? '🟢 Available' : '🔴 Busy'}
                </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {vol.qualification && <span style={{ ...pill, background: 'rgba(0,210,255,0.1)', color: '#00d2ff' }}>🎓 {vol.qualification}</span>}
                {vol.city && <span style={{ ...pill, background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>📍 {vol.city}</span>}
                {vol.area_of_operation && <span style={{ ...pill, background: 'rgba(255,184,0,0.1)', color: '#ffb800' }}>🗺️ {vol.area_of_operation}</span>}
                {vol.has_med_kit && <span style={{ ...pill, background: 'rgba(255,77,77,0.1)', color: '#ff4d4d' }}>🏥 Med Kit</span>}
            </div>
            {vol.needed_items && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📦 Needs: {vol.needed_items}</div>}
            <div style={{ marginTop: '4px' }}>
                <button onClick={() => onMessage(vol)} style={{ ...ghostBtn, color: '#00d2ff', borderColor: '#00d2ff44' }}>
                    💬 Send Message
                </button>
            </div>
        </div>
    );
}

/* ─────────────── MAIN SOCIAL FEED ──────────────────────────────────── */
const TABS = [
    { id: 'rescue', label: '🚨 Rescue Requests', desc: 'PENDING' },
    { id: 'volunteers', label: '🤝 Volunteer Portal' },
    { id: 'ongoing', label: '⚡ Ongoing Tasks', desc: 'ONGOING' },
    { id: 'completed', label: '✅ Completed', desc: 'CLOSED' },
];

export default function SocialFeed({ lang }) {
    const [activeTab, setActiveTab] = useState('rescue');
    const [tasks, setTasks] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showVolProfile, setShowVolProfile] = useState(false);
    const [volProfile, setVolProfile] = useState(null);
    const [dmVolunteer, setDmVolunteer] = useState(null);
    const [cityFilter, setCityFilter] = useState(localStorage.getItem('baysafe_city') || '');
    const [loading, setLoading] = useState(false);

    const role = localStorage.getItem('baysafe_role') || 'user';
    const isVolunteer = role === 'volunteer';
    const isUser = role === 'user';

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const cityParam = cityFilter ? `?city=${encodeURIComponent(cityFilter)}` : '';
            const [tRes, vRes] = await Promise.all([
                fetch(`${API}/dms/tasks${cityParam}`, { headers: authHeaders() }),
                fetch(`${API}/dms/volunteers/list${cityParam}`, { headers: authHeaders() }),
            ]);
            if (tRes.ok) setTasks(await tRes.json());
            if (vRes.ok) setVolunteers(await vRes.json());
        } finally { setLoading(false); }
    }, [cityFilter]);

    const fetchVolProfile = useCallback(async () => {
        if (!isVolunteer) return;
        const r = await fetch(`${API}/dms/volunteer/profile`, { headers: authHeaders() });
        if (r.ok) { const d = await r.json(); setVolProfile(d); }
    }, [isVolunteer]);

    useEffect(() => { fetchAll(); fetchVolProfile(); }, [fetchAll, fetchVolProfile]);
    useEffect(() => { const t = setInterval(fetchAll, 15000); return () => clearInterval(t); }, [fetchAll]);

    const handleAccept = async (taskId) => {
        await fetch(`${API}/dms/tasks/${taskId}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ action: 'accept' }) });
        fetchAll();
    };

    const handleComplete = async (taskId) => {
        const comment = prompt('Add completion note (optional):') || 'Task completed.';
        await fetch(`${API}/dms/tasks/${taskId}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ action: 'complete', comment }) });
        fetchAll();
    };

    const filteredTasks = (status) => tasks.filter(t => t.status === status);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Header bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#00d2ff', fontWeight: 800, fontSize: '1.4rem' }}>
                        🌐 Community Social Feed
                    </h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Live rescue requests and volunteer activity — location filtered
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,210,255,0.08)', border: '1px solid rgba(0,210,255,0.2)', borderRadius: '10px', padding: '6px 12px' }}>
                        <span style={{ fontSize: '0.85rem' }}>📍</span>
                        <input
                            value={cityFilter}
                            onChange={e => setCityFilter(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && fetchAll()}
                            style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.88rem', width: '120px' }}
                            placeholder="Filter by city..."
                        />
                        <button onClick={fetchAll} style={{ background: 'rgba(0,210,255,0.15)', border: 'none', color: '#00d2ff', borderRadius: '6px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.8rem' }}>Go</button>
                    </div>
                    {isUser && (
                        <button onClick={() => setShowTaskForm(true)} style={{
                            padding: '10px 18px', background: 'rgba(255,77,77,0.15)', border: '1px solid rgba(255,77,77,0.4)',
                            borderRadius: '10px', color: '#ff4d4d', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                        }}>
                            🚨 Submit Rescue Request
                        </button>
                    )}
                    {isVolunteer && (
                        <button onClick={() => setShowVolProfile(true)} style={{
                            padding: '10px 18px', background: 'rgba(0,255,128,0.12)', border: '1px solid rgba(0,255,128,0.35)',
                            borderRadius: '10px', color: '#00ff80', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem'
                        }}>
                            🤝 {volProfile ? 'Update Profile' : 'Register as Volunteer'}
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid rgba(0,210,255,0.15)', paddingBottom: '2px' }}>
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                        padding: '10px 18px', borderRadius: '10px 10px 0 0', border: 'none', cursor: 'pointer', fontWeight: 700,
                        fontSize: '0.88rem', transition: 'all 0.2s',
                        background: activeTab === tab.id ? 'rgba(0,210,255,0.15)' : 'transparent',
                        color: activeTab === tab.id ? '#00d2ff' : 'var(--text-secondary)',
                        borderBottom: activeTab === tab.id ? '2px solid #00d2ff' : '2px solid transparent',
                    }}>
                        {tab.label}
                        {tab.desc && (
                            <span style={{ marginLeft: '6px', background: 'rgba(0,210,255,0.15)', borderRadius: '20px', padding: '1px 7px', fontSize: '0.75rem' }}>
                                {tasks.filter(t => t.status === tab.desc).length}
                            </span>
                        )}
                        {tab.id === 'volunteers' && (
                            <span style={{ marginLeft: '6px', background: 'rgba(0,255,128,0.15)', borderRadius: '20px', padding: '1px 7px', fontSize: '0.75rem', color: '#00ff80' }}>
                                {volunteers.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ minHeight: '400px' }}>
                {loading && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>⏳ Loading...</div>}

                {/* Rescue Requests */}
                {activeTab === 'rescue' && !loading && (
                    <div style={grid}>
                        {filteredTasks('PENDING').length === 0
                            ? <EmptyState icon="🚨" text="No rescue requests in this area." sub="Try another city or submit the first request." />
                            : filteredTasks('PENDING').map(t => <TaskCard key={t.id} task={t} role={role} onAccept={handleAccept} onComplete={handleComplete} />)
                        }
                    </div>
                )}

                {/* Volunteer Portal */}
                {activeTab === 'volunteers' && !loading && (
                    <div style={grid}>
                        {volunteers.length === 0
                            ? <EmptyState icon="🤝" text="No volunteers found in this area." sub="Volunteers: register your profile to appear here." />
                            : volunteers.map(v => <VolunteerCard key={v.id} vol={v} myRole={role} onMessage={(vol) => setDmVolunteer(vol)} />)
                        }
                    </div>
                )}

                {/* Ongoing Tasks */}
                {activeTab === 'ongoing' && !loading && (
                    <div style={grid}>
                        {filteredTasks('ONGOING').length === 0
                            ? <EmptyState icon="⚡" text="No tasks being handled right now." sub="Volunteers: accept a rescue request to start." />
                            : filteredTasks('ONGOING').map(t => <TaskCard key={t.id} task={t} role={role} onAccept={handleAccept} onComplete={handleComplete} />)
                        }
                    </div>
                )}

                {/* Completed Tasks */}
                {activeTab === 'completed' && !loading && (
                    <div style={grid}>
                        {filteredTasks('CLOSED').length === 0
                            ? <EmptyState icon="✅" text="No completed tasks yet." />
                            : filteredTasks('CLOSED').map(t => <TaskCard key={t.id} task={t} role={role} onAccept={handleAccept} onComplete={handleComplete} />)
                        }
                    </div>
                )}
            </div>

            {/* Modals */}
            {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} onSuccess={fetchAll} />}
            {showVolProfile && <VolunteerProfileForm onClose={() => setShowVolProfile(false)} onSuccess={() => { fetchAll(); fetchVolProfile(); }} existing={volProfile} />}
            {dmVolunteer && <DMPanel volunteer={dmVolunteer} onClose={() => setDmVolunteer(null)} />}
        </div>
    );
}

function EmptyState({ icon, text, sub }) {
    return (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{icon}</div>
            <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', margin: '0 0 6px' }}>{text}</p>
            {sub && <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>{sub}</p>}
        </div>
    );
}

/* ─── shared micro-styles ─── */
const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const modal = { width: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'rgba(5,18,45,0.98)', border: '1px solid rgba(0,210,255,0.25)', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' };
const modalHeader = { display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' };
const closeBtn = { marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer' };
const errorBox = { background: 'rgba(255,77,77,0.15)', border: '1px solid rgba(255,77,77,0.4)', borderRadius: '8px', padding: '10px 14px', color: '#ff6464', fontSize: '0.88rem' };
const lbl = { display: 'block', marginBottom: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inp = { width: '100%', padding: '10px 14px', background: 'rgba(0,210,255,0.05)', border: '1px solid rgba(0,210,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' };
const row2 = { display: 'flex', gap: '12px' };
const submitBtn = (c) => ({ padding: '13px', background: `${c}22`, border: `1px solid ${c}55`, borderRadius: '10px', color: c, fontWeight: 700, cursor: 'pointer', fontSize: '1rem', marginTop: '4px' });
const badge = { padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' };
const pill = { padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 };
const ghostBtn = { padding: '6px 14px', background: 'transparent', border: '1px solid rgba(0,210,255,0.3)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 };
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' };
