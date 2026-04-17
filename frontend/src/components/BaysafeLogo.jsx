import React from 'react';
import './BaysafeLogo.css';
import baysafeLogoImg from '../assets/baysafe_logo.png';

const BaysafeLogo = () => {
    return (
        <div className="logo-container anti-gravity" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
                width: '60px', height: '60px', borderRadius: '15px', overflow: 'hidden',
                border: '2px solid var(--electric-blue)', boxShadow: '0 0 25px rgba(0, 210, 255, 0.5)',
                background: '#050a14'
            }}>
                <img src={baysafeLogoImg} alt="BaySafe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h1 className="logo-text" style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '2px', background: 'linear-gradient(90deg, #fff, var(--electric-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, textShadow: '0 0 30px rgba(0, 210, 255, 0.3)' }}>
                BAYSAFE <span className="logo-highlight" style={{ fontWeight: 300, color: 'var(--electric-blue)' }}>DMS</span>
            </h1>
        </div>
    );
}

export default BaysafeLogo;
