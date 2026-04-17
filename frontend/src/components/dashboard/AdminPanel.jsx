import React, { useState } from 'react';
import { Shield, BarChart2, Users, List, Phone, User, Lock, LayoutDashboard, MapPin, Wind } from 'lucide-react';

// Sub-components
import AdminAuth from './admin/AdminAuth';
import AdminDashboard from './admin/AdminDashboard';
import VolunteerManager from './admin/VolunteerManager';
import TaskManager from './admin/TaskManager';
import UserManager from './admin/UserManager';
import HelplineManager from './admin/HelplineManager';
import DataExplorer from './admin/DataExplorer';
import CityManager from './admin/CityManager';
import WeatherDataManager from './admin/WeatherDataManager';

import { adminService } from '../../services/api';

const AdminPanel = () => {
    const [adminUser, setAdminUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [lang, setLang] = useState('TA');
    const [volunteers, setVolunteers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [cities, setCities] = useState([]);
    const [weatherRecords, setWeatherRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    const isTamil = lang === 'TA';

    const fetchData = async () => {
        setLoading(true);
        try {
            const [volRes, taskRes, userRes, cityRes, weatherRes] = await Promise.all([
                adminService.getVolunteers(),
                adminService.getTasks(),
                adminService.getUsers(),
                adminService.getCities(),
                adminService.getWeatherRecords()
            ]);
            setVolunteers(volRes.data);
            setTasks(taskRes.data);
            setUsers(userRes.data);
            setCities(cityRes.data);
            setWeatherRecords(weatherRes.data);
        } catch (error) {
            console.error("Aggregation Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (user) => {
        setAdminUser(user);
        fetchData();
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setAdminUser(null);
    };

    if (!adminUser) return <AdminAuth onLogin={handleLogin} />;

    const stats = {
        totalVols: volunteers.length,
        activeVols: volunteers.filter(v => v.is_available).length,
        totalTasks: tasks.length,
        pendingSOS: tasks.filter(t => t.status === 'PENDING').length,
        totalUsers: users.length,
        citiesMonitored: cities.length
    };

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', labelT: 'தகவல் பலகை' },
        { id: 'cities', icon: MapPin, label: 'City Hub', labelT: 'நகரம் மையம்' },
        { id: 'vols', icon: Users, label: 'Volunteers', labelT: 'தன்னார்வலர்கள்' },
        { id: 'tasks', icon: List, label: 'Emergency Tasks', labelT: 'அவசர பணிகள்' },
        { id: 'users', icon: User, label: 'User Directory', labelT: 'பயனர் பட்டியல்' },
        { id: 'helpline', icon: Phone, label: 'Helpline Control', labelT: 'உதவி எண்கள்' },
        { id: 'weather', icon: Wind, label: 'Weather Logs', labelT: 'வானிலை பதிவுகள்' },
        { id: 'explorer', icon: BarChart2, label: 'Analytics Explorer', labelT: 'தரவு பகுப்பாய்வு' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Admin Header */}
            <div className="glass-panel" style={{ padding: '20px 30px', border: '1px solid rgba(255,204,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,204,0,0.1)', border: '1px solid #ffcc00', borderRadius: '12px' }}>
                        <Shield size={28} color="#ffcc00" />
                    </div>
                    <div>
                        <h2 className="thunder-text hover-shine" style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>
                            {isTamil ? 'கட்டுப்பாட்டு அறை' : 'Command Center'}
                        </h2>
                        <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            {isTamil ? `நிர்வாகி: ${adminUser.user} | ஜூனியர் அக்சஸ்` : `Operator: ${adminUser.user} | Session Active`}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setLang(l => l === 'EN' ? 'TA' : 'EN')} className="btn-shimmer" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                        {isTamil ? 'Switch to English' : 'தமிழ் மாற்று'}
                    </button>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'rgba(255,60,60,0.1)', border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        <Lock size={14} /> {isTamil ? 'வெளியேறு' : 'Logout'}
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem',
                            background: activeTab === item.id ? 'rgba(0,210,255,0.2)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${activeTab === item.id ? 'var(--electric-blue)' : 'rgba(255,255,255,0.1)'}`,
                            color: activeTab === item.id ? 'var(--electric-blue)' : '#fff',
                            transition: 'all 0.2s'
                        }}
                    >
                        <item.icon size={16} />
                        {isTamil ? item.labelT : item.label}
                    </button>
                ))}
            </div>

            {/* Active Component Area */}
            <div style={{ flex: 1 }}>
                {activeTab === 'dashboard' && <AdminDashboard stats={stats} isTamil={isTamil} />}
                {activeTab === 'cities' && <CityManager cities={cities} onUpdate={fetchData} isTamil={isTamil} />}
                {activeTab === 'vols' && <VolunteerManager volunteers={volunteers} onUpdateVols={fetchData} isTamil={isTamil} />}
                {activeTab === 'tasks' && <TaskManager tasks={tasks} onUpdateTasks={fetchData} isTamil={isTamil} />}
                {activeTab === 'users' && <UserManager users={users} onUpdate={fetchData} isTamil={isTamil} />}
                {activeTab === 'helpline' && <HelplineManager isTamil={isTamil} />}
                {activeTab === 'weather' && <WeatherDataManager weatherRecords={weatherRecords} cities={cities} onUpdate={fetchData} isTamil={isTamil} />}
                {activeTab === 'explorer' && <DataExplorer isTamil={isTamil} />}
            </div>
        </div>
    );
};

export default AdminPanel;
