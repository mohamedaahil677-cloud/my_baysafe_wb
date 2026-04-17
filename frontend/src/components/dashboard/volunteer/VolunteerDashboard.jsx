import React, { useState } from 'react';
import VolunteerAuth from './VolunteerAuth';
// Placeholders for the actual modules
import VolunteerCheckIn from './VolunteerCheckIn';
import TaskAccepter from './TaskAccepter';
import RescueReport from './RescueReport';
import VolunteerChatbot from './VolunteerChatbot';

import { CheckSquare, List, Camera, MessageSquare, LogOut } from 'lucide-react';

const VolunteerDashboard = () => {
    // Stores the verified volunteer name. If null, show Auth gate.
    const [verifiedVolunteer, setVerifiedVolunteer] = useState(null);
    const [activeTab, setActiveTab] = useState('checkin');

    if (!verifiedVolunteer) {
        return <VolunteerAuth onVerify={setVerifiedVolunteer} />;
    }

    const tabStyle = (tabId) => ({
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: activeTab === tabId ? '#000' : 'var(--volunteer-green)',
        background: activeTab === tabId ? 'var(--volunteer-green)' : 'rgba(0, 255, 128, 0.1)',
        border: `1px solid ${activeTab === tabId ? 'var(--volunteer-green)' : 'rgba(0, 255, 128, 0.3)'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 160px)' }}>

            {/* Header & Internal Volunteer Nav */}
            <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(0, 255, 128, 0.3)', background: 'rgba(0, 50, 20, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--volunteer-green)', fontSize: '1.5rem' }}>
                            பேரிடர் கால தன்னார்வலர் முகமை : VOLUNTEER CONTROL CENTER
                        </h2>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            செயல்பாட்டாளர் / Operator: <strong style={{ color: '#fff' }}>{verifiedVolunteer}</strong> (அனுமதி உறுதி / Clearance Validated)
                        </p>
                    </div>
                    <button
                        onClick={() => setVerifiedVolunteer(null)}
                        style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <LogOut size={16} /> Disconnect
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                    <button style={tabStyle('checkin')} onClick={() => setActiveTab('checkin')}>
                        <CheckSquare size={18} /> Availablity & Check-In
                    </button>
                    <button style={tabStyle('tasks')} onClick={() => setActiveTab('tasks')}>
                        <List size={18} /> Task Dispatch
                    </button>
                    <button style={tabStyle('report')} onClick={() => setActiveTab('report')}>
                        <Camera size={18} /> File Report
                    </button>
                    <button style={tabStyle('chatbot')} onClick={() => setActiveTab('chatbot')}>
                        <MessageSquare size={18} /> NDRF AI Comms
                    </button>
                </div>
            </div>

            {/* Dynamic Module Content View */}
            <div className="glass-panel sidebar-scroll" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                {activeTab === 'checkin' && <VolunteerCheckIn />}
                {activeTab === 'tasks' && <TaskAccepter />}
                {activeTab === 'report' && <RescueReport />}
                {activeTab === 'chatbot' && <VolunteerChatbot />}
            </div>

        </div>
    );
};

export default VolunteerDashboard;
