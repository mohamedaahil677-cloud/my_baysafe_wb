import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            marginTop: '30px',
            padding: '24px 30px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(0, 210, 255, 0.15)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            backdropFilter: 'blur(10px)'
        }}>
            {/* Live Weather & Social Links */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="https://imd.gov.in/" target="_blank" rel="noopener noreferrer" className="footer-link">
                    🌦️ IMD Live Updates
                </a>
                <a href="https://tnsdma.tn.gov.in/" target="_blank" rel="noopener noreferrer" className="footer-link">
                    🚨 TNSDMA Alerts
                </a>
                <a href="#" className="footer-link">
                    🐦 Twitter / X
                </a>
                <a href="#" className="footer-link">
                    📱 Telegram Channel
                </a>
            </div>

            {/* Credits Section strictly matching prompt requirements */}
            <div style={{
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '16px',
                width: '100%',
                maxWidth: '600px'
            }}>
                <p style={{ color: 'var(--electric-blue)', fontWeight: '600', marginBottom: '4px' }}>
                    © {new Date().getFullYear()} BAYSAFE DMS. All Rights Reserved.
                </p>
                <p>
                    Developed by <strong style={{ color: 'white' }}>F. Mohamed Aahil</strong><br />
                    Roll no: <span style={{ fontFamily: 'monospace', color: '#00ff80' }}>2313181058112</span><br />
                    B.sc Computer Science - III
                </p>
            </div>

            <style>{`
                .footer-link {
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                    padding: 6px 12px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid transparent;
                }
                .footer-link:hover {
                    color: var(--electric-blue);
                    background: rgba(0, 210, 255, 0.08);
                    border-color: rgba(0, 210, 255, 0.3);
                }
            `}</style>
        </footer>
    );
};

export default Footer;
