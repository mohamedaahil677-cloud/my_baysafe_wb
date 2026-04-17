import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const API = 'http://localhost:5000/api/auth';

const Login = () => {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'user'; // 'user' | 'volunteer'
    const isVolunteer = role === 'volunteer';

    const accentColor = isVolunteer ? 'var(--volunteer-green)' : 'var(--user-blue)';
    const borderColor = isVolunteer ? 'rgba(0,255,128,0.45)' : 'rgba(0,210,255,0.45)';
    const bgColor = isVolunteer ? 'rgba(0,255,128,0.06)' : 'rgba(0,210,255,0.06)';

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed. Check credentials.');
                setLoading(false);
                return;
            }

            // Save token
            localStorage.setItem('baysafe_token', data.token);
            localStorage.setItem('baysafe_role', data.role || role);
            localStorage.setItem('baysafe_city', data.city || '');
            localStorage.setItem('baysafe_user_id', data.user_id || '');
            localStorage.setItem('baysafe_username', data.username || '');

            // Dashboard entry animation
            if (containerRef.current) {
                containerRef.current.classList.add('dashboard-entry');
            }
            setTimeout(() => navigate('/dashboard'), 700);
        } catch (err) {
            setError('Cannot reach server. Make sure backend is running.');
            setLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex-column flex-center"
            style={{ minHeight: '100vh', padding: '24px' }}
        >
            <div
                className="glass-panel"
                style={{
                    padding: '42px 40px',
                    width: '100%',
                    maxWidth: '420px',
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '2.8rem', marginBottom: '10px' }}>
                        {isVolunteer ? '🤝' : '👤'}
                    </div>
                    <h2
                        style={{
                            fontSize: '1.6rem',
                            fontWeight: '700',
                            color: accentColor,
                            marginBottom: '6px',
                        }}
                    >
                        {isVolunteer ? 'Volunteer Login' : 'User Login'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        BaySafe Disaster Management System
                    </p>
                </div>

                {/* Error */}
                {error && <div className="msg-error" style={{ marginBottom: '18px' }}>{error}</div>}

                <form onSubmit={handleLogin} className="flex-column" style={{ gap: '18px' }}>

                    {/* Identifier */}
                    <div className="flex-column">
                        <label className="form-label">Email / Username / Mobile (+91)</label>
                        <input
                            type="text"
                            className={`form-input ${isVolunteer ? 'form-input-green' : ''}`}
                            required
                            placeholder="you@gmail.com  |  username  |  +91XXXXXXXXXX"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex-column">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                className={`form-input ${isVolunteer ? 'form-input-green' : ''}`}
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                style={{ paddingRight: '46px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute', right: '12px', top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none', border: 'none',
                                    cursor: 'pointer', color: 'var(--text-secondary)',
                                    fontSize: '1rem',
                                }}
                                aria-label="Toggle password visibility"
                            >
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`btn-shimmer ${isVolunteer ? 'btn-shimmer-green' : ''}`}
                        style={{ marginTop: '8px', padding: '14px', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading
                            ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <span className="spinner" /> Logging in...
                            </span>
                            : `Login as ${isVolunteer ? 'Volunteer' : 'User'}`}
                    </button>
                </form>

                {/* Links */}
                <div style={{ textAlign: 'center', marginTop: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link
                            to={`/register?role=${role}`}
                            style={{ color: accentColor, fontWeight: '600', textDecoration: 'none' }}
                        >
                            Register →
                        </Link>
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                            ← Back to Entrance
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
