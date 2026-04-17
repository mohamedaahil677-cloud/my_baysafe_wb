import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BaysafeLogo from '../components/BaysafeLogo';

const Entrance = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const handleRoleSelect = (role) => {
        if (containerRef.current) {
            containerRef.current.classList.add('dashboard-entry');
        }
        setTimeout(() => {
            navigate(`/login?role=${role}`);
        }, 650);
    };

    return (
        <div
            ref={containerRef}
            className="flex-column flex-center"
            style={{ minHeight: '100vh', padding: '24px', gap: '40px' }}
        >
            {/* Logo */}
            <BaysafeLogo />

            {/* Welcome Banner */}
            <div
                className="glass-panel anti-gravity-hover"
                style={{
                    maxWidth: '760px',
                    width: '100%',
                    padding: '36px 40px',
                    textAlign: 'center',
                    background: 'rgba(0,210,255,0.04)',
                    border: '1px solid rgba(0,210,255,0.18)',
                }}
            >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌊⛑️🚀</div>
                <h1
                    style={{
                        fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
                        fontWeight: '700',
                        color: 'var(--electric-blue)',
                        marginBottom: '12px',
                        lineHeight: '1.4',
                    }}
                >
                    Welcome to BaySafe DMS
                </h1>
                <p
                    style={{
                        fontSize: '1rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.7',
                        maxWidth: '560px',
                        margin: '0 auto',
                    }}
                >
                    A great initiative of the <strong style={{ color: 'var(--text-primary)' }}>Disaster Rescue System</strong> for
                    a prolonged network of services — connecting communities, volunteers, and emergency responders in real time.
                </p>
            </div>

            {/* Role Selection Cards */}
            <div
                style={{
                    display: 'flex',
                    gap: '28px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    maxWidth: '760px',
                    width: '100%',
                }}
            >

                {/* ── Sign as User ── */}
                <div
                    className="role-card role-card-user"
                    onClick={() => handleRoleSelect('user')}
                >
                    <div style={{ textAlign: 'center' }}>
                        <span className="role-icon" role="img" aria-label="User">👤</span>
                        <h2
                            style={{
                                fontSize: '1.4rem',
                                fontWeight: '700',
                                color: 'var(--user-blue)',
                                marginBottom: '10px',
                            }}
                        >
                            Sign as User
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
                            Affected civilians, families, and residents seeking help, shelter, or emergency updates.
                        </p>
                        <button
                            className="btn-shimmer"
                            style={{ width: '100%', padding: '13px' }}
                            onClick={(e) => { e.stopPropagation(); handleRoleSelect('user'); }}
                        >
                            Continue as User →
                        </button>
                    </div>
                </div>

                {/* ── Sign as Volunteer ── */}
                <div
                    className="role-card role-card-volunteer"
                    onClick={() => handleRoleSelect('volunteer')}
                >
                    <div style={{ textAlign: 'center' }}>
                        <span className="role-icon" role="img" aria-label="Volunteer">🤝</span>
                        <h2
                            style={{
                                fontSize: '1.4rem',
                                fontWeight: '700',
                                color: 'var(--volunteer-green)',
                                marginBottom: '10px',
                            }}
                        >
                            Sign as Volunteer
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
                            First responders, rescue teams, and community helpers ready to assist in disaster operations.
                        </p>
                        <button
                            className="btn-shimmer btn-shimmer-green"
                            style={{ width: '100%', padding: '13px' }}
                            onClick={(e) => { e.stopPropagation(); handleRoleSelect('volunteer'); }}
                        >
                            Continue as Volunteer →
                        </button>
                    </div>
                </div>

            </div>

            {/* Footer note */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textAlign: 'center', opacity: 0.7 }}>
                🔒 Secured &nbsp;|&nbsp; Twilio SMS OTP Verified &nbsp;|&nbsp; BaySafe DMS v1.0
            </p>
        </div>
    );
};

export default Entrance;
