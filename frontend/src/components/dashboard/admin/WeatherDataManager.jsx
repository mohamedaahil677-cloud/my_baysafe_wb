import React, { useState } from 'react';
import { Wind, Plus, CloudRain, Thermometer } from 'lucide-react';
import VisualDataTable from './VisualDataTable';
import { adminService } from '../../../services/api';

const WeatherDataManager = ({ weatherRecords = [], cities = [], onUpdate, isTamil }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRecord, setNewRecord] = useState({ city_id: '', temp: 30, humidity: 60, wind_speed: 10, rainfall: 0, condition: 'Clear', analysis: '' });

    const handleAdd = async () => {
        if (!newRecord.city_id) {
            alert("Please select a city");
            return;
        }
        try {
            await adminService.createWeatherRecord(newRecord);
            onUpdate();
            setShowAddModal(false);
            setNewRecord({ city_id: '', temp: 30, humidity: 60, wind_speed: 10, rainfall: 0, condition: 'Clear', analysis: '' });
        } catch (error) {
            alert("Failed to save weather record");
        }
    };

    const columns = [
        { key: 'timestamp', label: 'Time', labelT: 'நேரம்' },
        { key: 'city_name', label: 'City', labelT: 'நகரம்' },
        { key: 'temp', label: 'Temp °C', labelT: 'வெப்பம்' },
        { key: 'condition', label: 'Condition', labelT: 'நிலை' },
        { key: 'rainfall', label: 'Rain (mm)', labelT: 'மழை' },
    ];

    // Format timestamp for more readability
    const formattedData = weatherRecords.map(r => ({
        ...r,
        timestamp: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowAddModal(true)} className="btn-shimmer" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <Wind size={16} /> {isTamil ? 'வானிலை பதிவு' : 'Record Manual Analysis'}
                </button>
            </div>

            <VisualDataTable 
                title={isTamil ? "வானிலை தரவு பதிவுகள்" : "Global Weather Intelligence Repository"}
                columns={columns}
                data={formattedData}
                isTamil={isTamil}
            />

            {showAddModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ padding: '30px', maxWidth: '600px', width: '90%', border: '1px solid var(--electric-blue)' }}>
                         <h3 style={{ color: 'var(--electric-blue)', margin: 0 }}>{isTamil ? 'வானிலை பகுப்பாய்வு பதிவு' : 'Manual Intelligence Input'}</h3>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Target City</label>
                                <select className="form-input" value={newRecord.city_id} onChange={e => setNewRecord({...newRecord, city_id: e.target.value})}>
                                    <option value="">Select monitored city...</option>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Climate Condition</label>
                                <select className="form-input" value={newRecord.condition} onChange={e => setNewRecord({...newRecord, condition: e.target.value})}>
                                    <option value="Clear">Clear Skies</option>
                                    <option value="Cloudy">Slightly Cloudy</option>
                                    <option value="Rainy">Heavy Rainfall</option>
                                    <option value="Stormy">Thunderstorm Alert</option>
                                    <option value="Cyclone">Cyclone Warning</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Temperature (°C)</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="number" className="form-input" value={newRecord.temp} onChange={e => setNewRecord({...newRecord, temp: parseFloat(e.target.value)})} style={{ paddingLeft: '35px' }} />
                                    <Thermometer size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--electric-blue)' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Rainfall (mm/hr)</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="number" className="form-input" value={newRecord.rainfall} onChange={e => setNewRecord({...newRecord, rainfall: parseFloat(e.target.value)})} style={{ paddingLeft: '35px' }} />
                                    <CloudRain size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--electric-blue)' }} />
                                </div>
                            </div>
                         </div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px' }}>
                            <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Situational Analysis / Advisory</label>
                            <textarea className="form-input" placeholder="Enter expert advisory or threat analysis summary..." value={newRecord.analysis} onChange={e => setNewRecord({...newRecord, analysis: e.target.value})} style={{ width: '100%', minHeight: '80px' }} />
                         </div>
                         <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <button onClick={handleAdd} className="btn-shimmer" style={{ flex: 1, padding: '12px' }}>{isTamil ? 'தரவைப் பதிவு செய்' : 'Archive Analysis'}</button>
                            <button onClick={() => setShowAddModal(false)} className="btn-shimmer" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherDataManager;
