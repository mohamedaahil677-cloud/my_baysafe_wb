import React, { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import VisualDataTable from './VisualDataTable';
import { adminService } from '../../../services/api';

const CityManager = ({ cities = [], onUpdate, isTamil }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCity, setNewCity] = useState({ name: '', state: '', lat: 13.0, lon: 80.0, risk_level: 'Low', description: '' });

    const handleAdd = async () => {
        try {
            await adminService.createCity(newCity);
            onUpdate();
            setShowAddModal(false);
            setNewCity({ name: '', state: '', lat: 13.0, lon: 80.0, risk_level: 'Low', description: '' });
        } catch (error) {
            alert("Failed to add city");
        }
    };

    const columns = [
        { key: 'id', label: 'ID', labelT: 'ID' },
        { key: 'name', label: 'City Name', labelT: 'நகரம்' },
        { key: 'state', label: 'State', labelT: 'மாநிலம்' },
        { key: 'risk_level', label: 'Risk', labelT: 'ஆபத்து', type: 'status' },
        { key: 'lat', label: 'Lat', labelT: 'அட்ச' },
        { key: 'lon', label: 'Lon', labelT: 'தீர்க்க' },
    ];

    const mappedData = cities.map(c => ({
        ...c,
        risk_level: c.risk_level === 'High' ? 'URGENT' : (c.risk_level === 'Medium' ? 'PENDING' : 'ACTIVE')
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowAddModal(true)} className="btn-shimmer" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <Plus size={16} /> {isTamil ? 'புதிய நகரம்' : 'Add Strategic City'}
                </button>
            </div>

            <VisualDataTable 
                title={isTamil ? "கண்காணிக்கப்படும் நகரங்கள்" : "Strategic City Hub"}
                columns={columns}
                data={mappedData}
                isTamil={isTamil}
            />

            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ padding: '30px', maxWidth: '500px', width: '90%', border: '1px solid var(--electric-blue)' }}>
                         <h3 style={{ color: 'var(--electric-blue)', margin: 0 }}>{isTamil ? 'புதிய நகரத்தைச் சேர்க்கவும்' : 'Add New Strategic City'}</h3>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>City Name</label>
                                <input className="form-input" placeholder="e.g. Madurai" value={newCity.name} onChange={e => setNewCity({...newCity, name: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>State</label>
                                <input className="form-input" placeholder="e.g. Tamil Nadu" value={newCity.state} onChange={e => setNewCity({...newCity, state: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Latitude</label>
                                <input className="form-input" type="number" step="0.0001" value={newCity.lat} onChange={e => setNewCity({...newCity, lat: parseFloat(e.target.value)})} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Longitude</label>
                                <input className="form-input" type="number" step="0.0001" value={newCity.lon} onChange={e => setNewCity({...newCity, lon: parseFloat(e.target.value)})} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Risk Level Assessment</label>
                                <select className="form-input" value={newCity.risk_level} onChange={e => setNewCity({...newCity, risk_level: e.target.value})}>
                                    <option value="Low">Low (Standard Monitoring)</option>
                                    <option value="Medium">Medium (Active Surveillance)</option>
                                    <option value="High">High (Critical Threat Zone)</option>
                                </select>
                            </div>
                         </div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px' }}>
                            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Strategic Description</label>
                            <textarea className="form-input" placeholder="Notes on terrain or infrastructure..." value={newCity.description} onChange={e => setNewCity({...newCity, description: e.target.value})} style={{ width: '100%', minHeight: '80px' }} />
                         </div>
                         <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <button onClick={handleAdd} className="btn-shimmer" style={{ flex: 1, padding: '12px' }}>{isTamil ? 'சமர்ப்பி' : 'Register City'}</button>
                            <button onClick={() => setShowAddModal(false)} className="btn-shimmer" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CityManager;
