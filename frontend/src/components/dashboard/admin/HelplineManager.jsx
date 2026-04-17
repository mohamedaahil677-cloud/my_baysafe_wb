import React, { useState } from 'react';
import { Phone, Plus, Trash2, Edit2, ShieldAlert, Globe } from 'lucide-react';

const MOCK_HELPLINES = [
    { id: 1, name: 'State Control Room', nameT: 'மாநில கட்டுப்பாட்டு அறை', cat: 'State', phone: '1070' },
    { id: 2, name: 'District Helpline', nameT: 'மாவட்ட உதவி எண்', cat: 'District', phone: '1077' },
    { id: 3, name: 'Police Commissionarate', nameT: 'காவல் ஆணையரகம்', cat: 'Police', phone: '100' },
    { id: 4, name: 'Ambulance Service', nameT: 'ஆம்புலன்ஸ் சேவை', cat: 'Medical', phone: '108' },
];

const HelplineManager = ({ isTamil }) => {
    const [helplines, setHelplines] = useState(MOCK_HELPLINES);
    const [newEntry, setNewEntry] = useState({ name: '', nameT: '', cat: 'State', phone: '' });

    const addHelpline = (e) => {
        e.preventDefault();
        setHelplines([...helplines, { ...newEntry, id: Date.now() }]);
        setNewEntry({ name: '', nameT: '', cat: 'State', phone: '' });
    };

    const removeHelpline = (id) => {
        setHelplines(helplines.filter(h => h.id !== id));
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {/* List */}
            <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', color: 'var(--electric-blue)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldAlert size={20} /> {isTamil ? 'உதவி எண்கள் மேலாண்மை' : 'Helpline Database'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {helplines.map(h => (
                        <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{isTamil ? h.nameT : h.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{h.cat} · <span style={{ color: '#00ff80' }}>{h.phone}</span></div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{ padding: '6px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><Edit2 size={14} /></button>
                                <button onClick={() => removeHelpline(h.id)} style={{ padding: '6px', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Entry */}
            <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#00ff80', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Plus size={20} /> {isTamil ? 'புதிய எண் சேர்க்க' : 'Add New Helpline'}
                </h3>
                <form onSubmit={addHelpline} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>NAME (ENGLISH)</label>
                        <input className="form-input" style={{ width: '100%' }} value={newEntry.name} onChange={e => setNewEntry({ ...newEntry, name: e.target.value })} placeholder="e.g. Fire Station" required />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>பெயர் (தமிழ்)</label>
                        <input className="form-input" style={{ width: '100%' }} value={newEntry.nameT} onChange={e => setNewEntry({ ...newEntry, nameT: e.target.value })} placeholder="உதாரணம்: தீயணைப்பு நிலையம்" required />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PHONE NUMBER</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Phone size={16} color="var(--electric-blue)" />
                            <input className="form-input" style={{ flex: 1 }} value={newEntry.phone} onChange={e => setNewEntry({ ...newEntry, phone: e.target.value })} placeholder="101 / 108 / Mobile" required />
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CATEGORY</label>
                        <select className="form-input" style={{ width: '100%', background: 'rgba(0,0,0,0.3)' }} value={newEntry.cat} onChange={e => setNewEntry({ ...newEntry, cat: e.target.value })}>
                            <option>State</option>
                            <option>District</option>
                            <option>Police</option>
                            <option>Medical</option>
                            <option>Control Room</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-shimmer" style={{ marginTop: '10px', padding: '12px' }}>
                        DATABASE-ல் சேமி / SAVE TO HELPLINE DB
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HelplineManager;
