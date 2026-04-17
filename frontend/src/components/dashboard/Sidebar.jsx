import React from 'react';
import { 
    LayoutDashboard, Map as MapIcon, Users, 
    ClipboardList, PhoneCall, Bot, ShieldAlert,
    ChevronLeft, LogOut, Settings, Award, 
    Activity, Wind, Info, Bell, ShieldCheck,
    Navigation, Briefcase, BookOpen, UserCircle, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import baysafeLogo from '../../assets/baysafe_logo.png';

const Sidebar = ({ isOpen, onClose, activeModule, setActiveModule, activeMapLayer, onMapLayerChange, lang }) => {
    const navigate = useNavigate();
    const isTamil = lang === 'TA';

    // Re-evaluating roles for dynamic access
    const userRole = localStorage.getItem('baysafe_role') || 'user';
    const isVolunteer = userRole === 'volunteer' || userRole === 'admin';
    const isAdmin = userRole === 'admin';

    // Universal Menu Items
    const menuItems = [
        { id: 'social-feed', icon: <Globe size={20} />, label: 'Social Feed', ta: 'சமூக ஊட்டம்' },
        { id: 'weather', icon: <Wind size={20} />, label: 'Weather Data Analysis', ta: 'வானிலை தரவு பகுப்பாய்வு' },
        { id: 'disaster-info', icon: <ShieldAlert size={20} />, label: 'Disaster Info Module', ta: 'பேரிடர் தகவல் மையம்' },
        { id: 'safecamp', icon: <MapIcon size={20} />, label: 'SafeCamp Locator', ta: 'முகாம் கண்டறிதல்' },
        { id: 'helpline', icon: <PhoneCall size={20} />, label: 'Helpline Module', ta: 'உதவி எண் மையம்' },
        { id: 'chatbot', icon: <Bot size={20} />, label: 'BaySafe Chatbot', ta: 'பேசேஃப் சாட்பாட்' },
    ];

    // Conditional Attachments
    if (isVolunteer) {
        menuItems.push({ id: 'volunteer', icon: <Users size={20} />, label: 'Volunteer Hub', ta: 'தன்னார்வலர் மையம்' });
    }
    if (isAdmin) {
        menuItems.push({ id: 'admin', icon: <ShieldCheck size={20} />, label: 'Control Room', ta: 'கட்டுப்பாட்டு அறை' });
    }


    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <aside style={{
            position: 'fixed', left: 0, top: 0, bottom: 0,
            width: isOpen ? '280px' : '0',
            background: 'rgba(10, 25, 47, 0.95)',
            borderRight: '1px solid rgba(0, 210, 255, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1000, overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}>
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        width: '42px', height: '42px', borderRadius: '12px', overflow: 'hidden', 
                        border: '1px solid var(--electric-blue)', boxShadow: '0 0 15px rgba(0, 210, 255, 0.3)' 
                    }}>
                        <img src={baysafeLogo} alt="BaySafe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '800', letterSpacing: '1px', color: '#fff', textShadow: '0 0 20px rgba(0, 210, 255, 0.4)' }}>BAYSAFE</h2>
                </div>
            </div>

            <nav className="sidebar-scroll" style={{ flex: 1, padding: '20px 15px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveModule(item.id)}
                        className={`sidebar-btn ${activeModule === item.id ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{isTamil ? item.ta : item.label}</span>
                    </button>
                ))}
                
                <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button
                        onClick={() => setActiveModule('profile')}
                        className={`sidebar-btn ${activeModule === 'profile' ? 'active' : ''}`}
                        style={{ marginBottom: '8px' }}
                    >
                        <UserCircle size={20} />
                        <span>{isTamil ? 'சுயவிவரம்' : 'My Identity Hub'}</span>
                    </button>
                    <button className="sidebar-btn logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>{isTamil ? 'வெளியேறு' : 'Logout System'}</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
