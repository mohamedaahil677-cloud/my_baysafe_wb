import React from 'react';
import BaysafeLogo from './BaysafeLogo';

const Sidebar = () => {
    return (
        <div className="glass-panel" style={{ width: '280px', height: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px', position: 'fixed', left: 0, top: 0, borderRight: '1px solid var(--electric-blue)', borderRadius: '0 16px 16px 0', zIndex: 100 }}>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                <BaysafeLogo />
            </div>

            <div className="flex-column" style={{ gap: '15px' }}>
                <button className="btn-shimmer anti-gravity-hover" style={{ textAlign: 'left', paddingLeft: '20px' }}>🌍 Weather Radar</button>
                <button className="btn-shimmer anti-gravity-hover" style={{ textAlign: 'left', paddingLeft: '20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>⚠️ Active Disasters</button>
                <button className="btn-shimmer anti-gravity-hover" style={{ textAlign: 'left', paddingLeft: '20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>⛺ Safe Camps</button>
                <button className="btn-shimmer anti-gravity-hover" style={{ textAlign: 'left', paddingLeft: '20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>🤝 Volunteer Tasks</button>
                <button className="btn-shimmer anti-gravity-hover" style={{ textAlign: 'left', paddingLeft: '20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)' }}>💬 Live Chat</button>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <button className="btn-shimmer" style={{ width: '100%', background: 'linear-gradient(90deg, rgba(255,50,50,0.1), rgba(255,50,50,0.6), rgba(255,50,50,0.1))', borderColor: '#ff4444' }}>Logout</button>
            </div>
        </div>
    );
}

export default Sidebar;
