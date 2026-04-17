import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

const AdminAuth = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulation of JWT logic
        if (email === 'admin@baysafe.in' && password === 'baysafe2026') {
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
            localStorage.setItem('adminToken', mockToken);
            onLogin({ user: 'System Admin', role: 'SUPER_ADMIN' });
        } else {
            setError('தவறான மின்னஞ்சல் அல்லது கடவுச்சொல் / Invalid credentials. Try: admin@baysafe.in / baysafe2026');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="glass-panel" style={{ padding: '40px', maxWidth: '420px', width: '100%', border: '1px solid rgba(255,204,0,0.3)', textAlign: 'center' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,204,0,0.1)', border: '2px solid #ffcc00', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px' }}>
                    <ShieldCheck size={36} color="#ffcc00" />
                </div>
                <h2 style={{ color: '#ffcc00', margin: '0 0 10px 0' }}>நிர்வாக நுழைவு / ADMIN LOGIN</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 30px 0', fontSize: '0.9rem' }}>
                    Secure JWT authentication for BaySafe DMS Administrators.
                </p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '4px' }}>ADMIN EMAIL</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="admin@baysafe.in"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{ width: '100%', marginTop: '4px' }}
                            required
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginLeft: '4px' }}>PASS KEY</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ width: '100%', marginTop: '4px', letterSpacing: '2px' }}
                            required
                        />
                    </div>

                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', margin: '4px 0' }}>{error}</p>}

                    <button type="submit" className="btn-shimmer"
                        style={{ padding: '14px', background: 'rgba(255,204,0,0.15)', border: '1px solid #ffcc00', color: '#ffcc00', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' }}>
                        அணுகல் உறுதிசெய் / AUTHENTICATE
                    </button>
                </form>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Protected by RSA-256 Encryption & BaySafe Firewall
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;
