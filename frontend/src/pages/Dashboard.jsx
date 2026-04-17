import React, { useState, useEffect } from 'react';
import Header from '../components/dashboard/Header';
import NewsTicker from '../components/dashboard/NewsTicker';
import DisasterInfoModule from '../components/dashboard/DisasterInfoModule';
import SafeCampLocator from '../components/dashboard/SafeCampLocator';
import VolunteerDashboard from '../components/dashboard/volunteer/VolunteerDashboard';
import TaskFeedModule from '../components/dashboard/TaskFeedModule';
import HelplineModule from '../components/dashboard/HelplineModule';
import PublicChatbot from '../components/dashboard/PublicChatbot';
import AdminPanel from '../components/dashboard/AdminPanel';
import WeatherAnalysisModule from '../components/dashboard/WeatherAnalysisModule';
import Footer from '../components/dashboard/Footer';

// Page Modules
import AwarenessModule from '../components/dashboard/AwarenessModule';
import AboutUsModule from '../components/dashboard/AboutUsModule';
import ProfileModule from '../components/dashboard/ProfileModule';
import SocialFeed from '../components/dashboard/volunteer/SocialFeed';

// Advanced DMS Modules
import DashboardSidebar from '../components/dashboard/Sidebar';
import { dmsService } from '../services/api';
import { Activity, Users, Shield, Zap, Target, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeModule, setActiveModule] = useState('weather');
    const [activeMapLayer, setActiveMapLayer] = useState('rain');
    
    // Global Language State for Bilingual Support
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'EN');

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    
    const toggleLang = () => {
        const newLang = lang === 'EN' ? 'TA' : 'EN';
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    const isTamil = lang === 'TA';

    const mainContentStyle = {
        marginLeft: sidebarOpen ? '280px' : '0',
        width: sidebarOpen ? 'calc(100% - 280px)' : '100%',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(0, 10, 25, 0.5) 0%, rgba(0, 5, 15, 0.8) 100%)',
    };

    // Helper to get titles
    const getModuleTitle = () => {
        if (isTamil) {
            switch(activeModule) {
                case 'weather': return 'வானிலை ராடார்';
                case 'disaster-info': return 'பேரிடர் தகவல்';
                case 'safecamp': return 'முகாம் கண்டறிதல்';
                case 'tasks': return 'மீட்பு ஊட்டங்கள்';
                case 'helpline': return 'தொடர்பு மையம்';
                case 'chatbot': return 'AI உதவி';
                case 'profile': return 'சுயவிவரம்';
                case 'awareness': return 'விழிப்புணர்வு மையம்';
                case 'about': return 'எங்களைப் பற்றி';
                case 'social-feed': return 'சமூக ஊட்டம்';
                default: return 'கட்டளை மையம்';
            }
        }
        switch(activeModule) {
            case 'weather': return 'Weather Radar';
            case 'disaster-info': return 'Disaster Intel';
            case 'safecamp': return 'SafeCamp Locator';
            case 'tasks': return 'Rescue Feed';
            case 'helpline': return 'Contact Hub';
            case 'chatbot': return 'AI Assistance';
            case 'profile': return 'My Identity Hub';
            case 'awareness': return 'Awareness Hub';
            case 'about': return 'About BaySafe';
            case 'social-feed': return 'Community Social Feed';
            default: return 'Command Center';
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', overflowX: 'hidden' }}>
            <DashboardSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeModule={activeModule}
                setActiveModule={setActiveModule}
                activeMapLayer={activeMapLayer}
                onMapLayerChange={setActiveMapLayer}
                lang={lang}
            />

            <div style={mainContentStyle}>
                <Header 
                    onToggleSidebar={toggleSidebar} 
                    setActiveModule={setActiveModule} 
                    lang={lang} 
                    onToggleLang={toggleLang} 
                />
                
                {activeModule !== 'disaster-info' && <NewsTicker lang={lang} />}

                <div style={{ flex: 1, padding: '30px 45px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Header Context without KPI Banner */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(0, 210, 255, 0.2)', paddingBottom: '25px' }}>
                        <div>
                            <h2 className="thunder-text" style={{ fontSize: '2.4rem', margin: 0, letterSpacing: '-1.2px' }}>
                                {getModuleTitle()}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600', marginTop: '5px' }}>
                                {isTamil ? 'அனைத்து செயல்பாடுகளும் தயார் நிலையில் உள்ளன.' : 'All operations are ready for deployment.'}
                            </p>
                        </div>
                        <div className="glass-panel" style={{ padding: '12px 24px', border: '1px solid rgba(0,210,255,0.3)', background: 'rgba(0,18,46,0.6)', color: '#00d2ff', fontWeight: '950', fontSize: '0.85rem', letterSpacing: '1px' }}>
                            {isTamil ? 'உறுதிப்படுத்தப்பட்ட இணைப்பு' : 'ENCRYPTED NODE'}
                        </div>
                    </div>

                    <div className="glass-panel animate-fade" style={{ flex: 1, padding: '25px', background: 'rgba(0, 15, 35, 0.4)', minHeight: '600px' }}>
                        {activeModule === 'weather' ? (
                            <WeatherAnalysisModule lang={lang} />
                        ) : activeModule === 'disaster-info' ? (
                            <DisasterInfoModule lang={lang} />
                        ) : activeModule === 'safecamp' ? (
                            <SafeCampLocator lang={lang} />
                        ) : activeModule === 'volunteer' ? (
                            <VolunteerDashboard lang={lang} />
                        ) : activeModule === 'tasks' ? (
                            <TaskFeedModule lang={lang} />
                        ) : activeModule === 'helpline' ? (
                            <HelplineModule lang={lang} />
                        ) : activeModule === 'chatbot' ? (
                            <PublicChatbot lang={lang} />
                        ) : activeModule === 'admin' ? (
                            <AdminPanel lang={lang} />
                        ) : activeModule === 'awareness' ? (
                            <AwarenessModule lang={lang} />
                        ) : activeModule === 'about' ? (
                            <AboutUsModule lang={lang} />
                        ) : activeModule === 'profile' ? (
                            <ProfileModule lang={lang} />
                        ) : activeModule === 'social-feed' ? (
                            <SocialFeed lang={lang} />
                        ) : (
                            <div className="flex-center" style={{ minHeight: '500px', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px var(--electric-blue))' }}>⚠️</div>
                                <h3 className="thunder-text">{isTamil ? 'தயார் நிலையில்' : 'STANDBY'}</h3>
                            </div>
                        )}
                    </div>

                    <Footer lang={lang} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
