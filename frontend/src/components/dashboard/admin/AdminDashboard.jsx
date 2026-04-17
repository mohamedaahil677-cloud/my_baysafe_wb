import React from 'react';
import { BarChart2, Users, List, Shield, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, labelT, color }) => (
    <div className="glass-panel" style={{ padding: '20px', border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: `${color}15`, border: `1px solid ${color}33`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
            <Icon size={24} color={color} />
        </div>
        <div>
            <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800', color, lineHeight: 1 }}>{value}</p>
            <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'bold' }}>{labelT} / {label}</p>
        </div>
    </div>
);

const AdminDashboard = ({ stats, isTamil }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                <StatCard icon={Users} value={stats.totalVols} label="Total Volunteers" labelT="மொத்த தன்னார்வலர்கள்" color="#00ff80" />
                <StatCard icon={CheckCircle} value={stats.activeVols} label="Active Responders" labelT="செயல்பாட்டில் உள்ளவர்கள்" color="#00d2ff" />
                <StatCard icon={List} value={stats.totalTasks} label="Service Requests" labelT="சேவை கோரிக்கைகள்" color="#a855f7" />
                <StatCard icon={AlertTriangle} value={stats.pendingSOS} label="Urgent SOS" labelT="நிலுவை அவசர கோரிக்கைகள்" color="#ff8c00" />
            </div>

            {/* System Status & Activity Feed */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(0,255,128,0.2)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#00ff80', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Shield size={20} /> {isTamil ? 'கணினி நிலை' : 'System Operational Status'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            { n: 'Main API Server', s: 'ONLINE', c: '#00ff80' },
                            { n: 'Weather Radar Service', s: 'SYNCING', c: '#ffcc00' },
                            { n: 'Volunteer Gateway', s: 'ONLINE', c: '#00ff80' },
                            { n: 'SOS Dispatch Engine', s: 'ONLINE', c: '#00ff80' },
                            { n: 'Database Cluster', s: 'HEALTHY', c: '#00ff80' },
                        ].map((sys, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ color: '#fff', fontSize: '0.9rem' }}>{sys.n}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sys.c }}></div>
                                    <span style={{ color: sys.c, fontSize: '0.8rem', fontWeight: '800' }}>{sys.s}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(0,210,255,0.2)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: 'var(--electric-blue)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <RefreshCw size={20} /> {isTamil ? 'சமீபத்திய நடவடிக்கைகள்' : 'Recent System Activity'}
                    </h3>
                    <div className="sidebar-scroll" style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { t: 'User "Aahil" posted a new SOS in Chennai', time: '2m ago', icon: '🚨' },
                            { t: 'Volunteer "Arjun" checked in to duty', time: '15m ago', icon: '👤' },
                            { t: 'Weather Alert: Heavy Rain in Cuddalore', time: '1h ago', icon: '🌧️' },
                            { t: 'Admin published a new helpline update', time: '3h ago', icon: '📞' },
                            { t: 'Task #204 marked as CLOSED', time: '4h ago', icon: '✅' },
                        ].map((act, i) => (
                            <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.85rem' }}>
                                <span>{act.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: '#fff' }}>{act.t}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{act.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
