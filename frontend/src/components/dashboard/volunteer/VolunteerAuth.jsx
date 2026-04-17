import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Lock, User } from 'lucide-react';

const VolunteerAuth = ({ onVerify }) => {
    const role = localStorage.getItem('baysafe_role');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Initial Gate Check: Is the user logged in as a Volunteer?
    if (role !== 'volunteer') {
        return (
            <div className="flex-center" style={{ minHeight: '600px', flexDirection: 'column', gap: '20px' }}>
                <ShieldAlert size={80} color="#ff4d4d" />
                <h2 style={{ color: '#ff4d4d', fontSize: '2rem', margin: 0 }}>ACCESS DENIED</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', textAlign: 'center', lineHeight: '1.6' }}>
                    This module is strictly restricted to Verified Volunteers. Your current session role ({role || 'Guest'}) does not have the necessary clearance.
                </p>
                <button
                    style={{
                        padding: '10px 24px', background: 'rgba(255, 60, 60, 0.1)',
                        border: '1px solid #ff4d4d', color: '#ff4d4d', borderRadius: '8px', cursor: 'not-allowed'
                    }}
                    disabled
                >
                    Clearance Revoked
                </button>
            </div>
        );
    }

    // Secondary Verification Form for Volunteers
    const handleVerify = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulated secondary auth check (hashed password check on backend in production)
        setTimeout(() => {
            if (name.trim().length > 2 && password === 'volunteer123') {
                onVerify(name);
            } else {
                setError('Invalid Volunteer Name or Password.');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="flex-center" style={{ minHeight: '600px', flexDirection: 'column' }}>
            <div className="glass-panel" style={{
                maxWidth: '450px', width: '100%', padding: '40px',
                border: '1px solid var(--volunteer-green)',
                boxShadow: '0 0 30px rgba(0, 255, 128, 0.05)'
            }}>
                <div className="flex-center" style={{ flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                    <div className="pin-pulse" style={{ width: '60px', height: '60px', background: 'rgba(0, 255, 128, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ShieldCheck size={32} color="var(--volunteer-green)" />
                    </div>
                    <h2 style={{ color: 'var(--volunteer-green)', margin: 0, textAlign: 'center' }}>
                        {localStorage.getItem('lang') === 'TA' ? 'தன்னார்வலர் கட்டுப்பாட்டு மையம்' : 'Volunteer Control Center'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>
                        {localStorage.getItem('lang') === 'TA'
                            ? 'அணுகலுக்கான இரண்டாம் நிலை சரிபார்ப்பு தேவை.'
                            : 'Secondary verification required for deployment access.'}
                    </p>
                </div>

                <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{ background: 'rgba(255, 60, 60, 0.1)', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <label style={{ color: 'var(--volunteer-green)', fontSize: '0.75rem', marginBottom: '5px', display: 'block' }}>
                            {localStorage.getItem('lang') === 'TA' ? 'பதிவுசெய்யப்பட்ட தன்னார்வலர் பெயர்' : 'Registered Volunteer Name'}
                        </label>
                        <User size={18} color="var(--volunteer-green)" style={{ position: 'absolute', left: '15px', bottom: '13px' }} />
                        <input
                            type="text"
                            className="form-input-green"
                            style={{ width: '100%', paddingLeft: '45px' }}
                            placeholder={localStorage.getItem('lang') === 'TA' ? 'பெயரை உள்ளிடவும்' : 'Enter your name'}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <label style={{ color: 'var(--volunteer-green)', fontSize: '0.75rem', marginBottom: '5px', display: 'block' }}>
                            {localStorage.getItem('lang') === 'TA' ? 'குறியாக்க கடவுச்சொல்' : 'Encrypted Passcode'}
                        </label>
                        <Lock size={18} color="var(--volunteer-green)" style={{ position: 'absolute', left: '15px', bottom: '13px' }} />
                        <input
                            type="password"
                            className="form-input-green"
                            style={{ width: '100%', paddingLeft: '45px' }}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span style={{ fontSize: '0.65rem', color: '#666', marginTop: '4px', display: 'block' }}>
                            Demo Key: <code style={{ color: 'var(--volunteer-green)' }}>volunteer123</code>
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="btn-shimmer-green flex-center"
                        style={{ height: '50px', fontSize: '1.05rem', fontWeight: 'bold', marginTop: '10px' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: '20px', height: '20px', borderColor: '#fff', borderTopColor: 'transparent' }}></div>
                        ) : (
                            localStorage.getItem('lang') === 'TA' ? 'உறுதிப்படுத்து' : 'A U T H E N T I C A T E'
                        )}
                    </button>
                    <p style={{ fontSize: '0.7rem', color: '#888', textAlign: 'center', margin: 0 }}>
                        {localStorage.getItem('lang') === 'TA'
                            ? 'தவறான முயற்சி பாதுகாப்பு நெறிமுறைகளைத் தூண்டும்.'
                            : 'Invalid attempts will trigger security protocols.'}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default VolunteerAuth;
