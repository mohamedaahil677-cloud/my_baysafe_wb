import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const API = 'http://localhost:5000/api/auth';

const Register = () => {
    const [searchParams] = useSearchParams();
    const defaultRole = searchParams.get('role') || 'user';
    const isTamil = localStorage.getItem('lang') === 'TA';

    const [formData, setFormData] = useState({
        username: '',
        role: defaultRole,
        mobile: '',
        password: '',
        address: '',
        city: '',
        otp: '',
    });

    const [showPass, setShowPass] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const containerRef = useRef(null);
    const navigate = useNavigate();

    const isVolunteer = formData.role === 'volunteer';
    const accentColor = isVolunteer ? 'var(--volunteer-green)' : 'var(--user-blue)';
    const borderColor = isVolunteer ? 'rgba(0,255,128,0.45)' : 'rgba(0,210,255,0.45)';
    const bgColor = isVolunteer ? 'rgba(0,255,128,0.06)' : 'rgba(0,210,255,0.06)';

    const update = (field) => (e) =>
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    /* ── Send OTP via backend (Twilio) ── */
    const handleSendOtp = async () => {
        const mobile = formData.mobile.trim();
        if (!mobile) {
            setMessage({ type: 'error', text: isTamil ? 'முதலில் சரியான மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter a valid mobile number first.' });
            return;
        }
        // Allow bare 10-digit or +91XXXXXXXXXX
        const normalized = mobile.startsWith('+91') ? mobile : `+91${mobile}`;

        setLoadingOtp(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch(`${API}/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: normalized }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.message || (isTamil ? 'OTP அனுப்புவதில் பிழை.' : 'Failed to send OTP.') });
            } else {
                setOtpSent(true);
                const devNote = data.mock_otp ? ` [Dev OTP: ${data.mock_otp}]` : '';
                setMessage({ type: 'success', text: `📱 OTP sent to ${normalized}!${devNote}` });
            }
        } catch {
            setMessage({ type: 'error', text: isTamil ? 'சேவையகத்தை தொடர்பு கொள்ள முடியவில்லை.' : 'Cannot reach server. Is the backend running?' });
        } finally {
            setLoadingOtp(false);
        }
    };

    /* ── Verify OTP ── */
    const handleVerifyOtp = async () => {
        const mobile = formData.mobile.startsWith('+91') ? formData.mobile : `+91${formData.mobile}`;
        try {
            const res = await fetch(`${API}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, otp: formData.otp }),
            });
            const data = await res.json();
            return data.verified === true;
        } catch {
            return false;
        }
    };

    /* ── Register ── */
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!otpSent) {
            setMessage({ type: 'error', text: isTamil ? 'முதலில் OTP ஐ அனுப்பி சரிபார்க்கவும்.' : 'Please send and verify OTP first.' });
            return;
        }

        setLoading(true);

        // Verify OTP first
        const verified = await handleVerifyOtp();
        if (!verified) {
            setMessage({ type: 'error', text: isTamil ? '❌ தவறான OTP. தயவுசெய்து சரிபார்த்து மீண்டும் முயற்சிக்கவும்.' : '❌ Incorrect OTP. Please check and try again.' });
            setLoading(false);
            return;
        }

        const mobile = formData.mobile.startsWith('+91') ? formData.mobile : `+91${formData.mobile}`;

        try {
            const res = await fetch(`${API}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    role: formData.role,
                    mobile_number: mobile,
                    password: formData.password,
                    address: formData.address,
                    city: formData.city,
                    otp_verified: true,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.message || (isTamil ? 'பதிவு தோல்வியடைந்தது.' : 'Registration failed.') });
                setLoading(false);
                return;
            }

            setMessage({ type: 'success', text: isTamil ? '✅ பதிவு செய்யப்பட்டது! டாஷ்போர்டுக்கு செல்கிறது...' : '✅ Registered! Entering dashboard...' });
            localStorage.setItem('baysafe_token', data.token || '');
            localStorage.setItem('baysafe_role', formData.role);
            localStorage.setItem('baysafe_city', formData.city || '');
            localStorage.setItem('baysafe_username', formData.username || '');

            if (containerRef.current) {
                containerRef.current.classList.add('dashboard-entry');
            }
            setTimeout(() => navigate('/dashboard'), 750);
        } catch {
            setMessage({ type: 'error', text: isTamil ? 'சேவையகத்தை தொடர்பு கொள்ள முடியவில்லை.' : 'Cannot reach server. Is the backend running?' });
            setLoading(false);
        }
    };

    const inputStyle = `form-input ${isVolunteer ? 'form-input-green' : ''}`;

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
                    maxWidth: '480px',
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
                        {isVolunteer
                            ? (isTamil ? 'தன்னார்வலர் பதிவு' : 'Volunteer Registration')
                            : (isTamil ? 'பயனர் பதிவு' : 'User Registration')}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                        {isTamil ? 'Twilio SMS மூலம் OTP சரிபார்ப்பு' : 'OTP verification via SMS (Twilio)'}
                    </p>
                </div>

                {/* Status message */}
                {message.text && (
                    <div
                        className={message.type === 'success' ? 'msg-success' : 'msg-error'}
                        style={{ marginBottom: '18px' }}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex-column" style={{ gap: '16px' }}>

                    {/* Username */}
                    <div className="flex-column">
                        <label className="form-label">{isTamil ? 'பயனர்பெயர் (Username)' : 'Username'}</label>
                        <input
                            type="text"
                            className={inputStyle}
                            required
                            placeholder={isTamil ? 'தனித்துவமான பயனர்பெயரை தேர்வு செய்யவும்' : 'Choose a unique username'}
                            value={formData.username}
                            onChange={update('username')}
                            autoComplete="username"
                        />
                    </div>

                    {/* Role */}
                    <div className="flex-column">
                        <label className="form-label">{isTamil ? 'பங்கு (Role)' : 'Role'}</label>
                        <select
                            className={inputStyle}
                            value={formData.role}
                            onChange={update('role')}
                            style={{ background: 'rgba(0,0,0,0.5)' }}
                        >
                            <option value="user">👤  {isTamil ? 'பயனர் (பாதிக்கப்பட்டவர் / Civilian)' : 'User (Civilian / Affected)'}</option>
                            <option value="volunteer">🤝  {isTamil ? 'தன்னார்வலர் (மீட்பு / Rescue)' : 'Volunteer (Rescue / Aid)'}</option>
                        </select>
                    </div>

                    {/* Mobile */}
                    <div className="flex-column">
                        <label className="form-label">{isTamil ? 'மொபைல் எண் / Mobile Number (+91)' : 'Mobile Number (India +91)'}</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {/* Country code badge */}
                            <div
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    padding: '0 14px',
                                    borderRadius: '10px',
                                    border: `1px solid ${isVolunteer ? 'rgba(0,255,128,0.35)' : 'rgba(0,210,255,0.35)'}`,
                                    background: 'rgba(0,0,0,0.25)',
                                    color: accentColor,
                                    fontWeight: '700',
                                    fontSize: '0.95rem',
                                    whiteSpace: 'nowrap',
                                    minWidth: '62px',
                                }}
                            >
                                🇮🇳 +91
                            </div>
                            <input
                                type="tel"
                                className={inputStyle}
                                required
                                placeholder="XXXXXXXXXX"
                                value={formData.mobile}
                                onChange={update('mobile')}
                                maxLength={10}
                                pattern="[0-9]{10}"
                                title="Enter 10-digit mobile number"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="flex-column">
                        <label className="form-label">{isTamil ? 'கடவுச்சொல் / Password' : 'Password'}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                className={inputStyle}
                                required
                                placeholder={isTamil ? 'குறைந்தபட்சம் 8 எழுத்துக்கள் / Min 8 chars' : 'Min 8 characters'}
                                value={formData.password}
                                onChange={update('password')}
                                minLength={8}
                                autoComplete="new-password"
                                style={{ paddingRight: '46px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute', right: '12px', top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'var(--text-secondary)', fontSize: '1rem',
                                }}
                                aria-label="Toggle password"
                            >
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex-column">
                        <label className="form-label">{isTamil ? 'முகவரி / Address' : 'Address'}</label>
                        <textarea
                            className={inputStyle}
                            required
                            placeholder={isTamil ? 'உங்கள் முழு முகவரி (நகரம், மாவட்டம், மாநிலம்)' : 'Your full address (street, area...)'}
                            value={formData.address}
                            onChange={update('address')}
                            rows={3}
                            style={{ resize: 'vertical', minHeight: '80px', lineHeight: '1.5' }}
                        />
                    </div>

                    {/* City */}
                    <div className="flex-column">
                        <label className="form-label">{isTamil ? 'நகரம் / City' : 'City (for location-based feed)'}</label>
                        <input
                            type="text"
                            className={inputStyle}
                            required
                            placeholder={isTamil ? 'உங்கள் நகரம் (எ.கா. Chennai, Madurai)' : 'e.g. Chennai, Madurai, Coimbatore'}
                            value={formData.city}
                            onChange={update('city')}
                        />
                    </div>

                    {/* OTP Section */}
                    <div className="flex-column" style={{ gap: '10px' }}>
                        {/* Get OTP button */}
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={loadingOtp}
                            style={{
                                padding: '12px',
                                borderRadius: '10px',
                                border: `1px solid ${accentColor}`,
                                background: otpSent
                                    ? 'rgba(0,255,128,0.12)'
                                    : `rgba(${isVolunteer ? '0,255,128' : '0,210,255'},0.12)`,
                                color: otpSent ? 'var(--volunteer-green)' : accentColor,
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            {loadingOtp
                                ? <><span className="spinner" /> {isTamil ? 'அனுப்பப்படுகிறது...' : 'Sending OTP...'}</>
                                : otpSent
                                    ? (isTamil ? '🔄 மீண்டும் OTP அனுப்பு (Resend)' : '🔄 Resend OTP')
                                    : (isTamil ? '📱 SMS மூலம் OTP பெறுக' : '📱 Get OTP via SMS')}
                        </button>

                        {/* OTP Input */}
                        <div className="flex-column">
                            <label className="form-label">{isTamil ? 'OTP உள்ளிடவும் (6- இலக்க குறியீடு)' : 'Enter OTP (6-digit SMS code)'}</label>
                            <input
                                type="text"
                                className={`form-input ${otpSent ? 'otp-input' : ''}`}
                                required
                                placeholder={otpSent ? (isTamil ? 'SMS-ல் வந்த OTP-ஐ உள்ளிடவும்' : 'Enter the OTP from SMS') : (isTamil ? 'முதலில் "OTP பெறு" என்பதைக் கிளிக் செய்யவும்' : 'Click "Get OTP" first')}
                                value={formData.otp}
                                onChange={update('otp')}
                                maxLength={6}
                                pattern="[0-9]{6}"
                                disabled={!otpSent}
                                style={{ opacity: otpSent ? 1 : 0.5 }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`btn-shimmer ${isVolunteer ? 'btn-shimmer-green' : ''}`}
                        style={{ marginTop: '6px', padding: '14px', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading
                            ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <span className="spinner" /> {isTamil ? 'பதியப்படுகிறது...' : 'Registering...'}
                            </span>
                            : (isTamil ? (isVolunteer ? 'தன்னார்வலராக பதிவு செய்' : 'பயனராக பதிவு செய்') : `Register as ${isVolunteer ? 'Volunteer' : 'User'}`)}
                    </button>

                </form>

                {/* Links */}
                <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Already have an account?{' '}
                        <Link
                            to={`/login?role=${formData.role}`}
                            style={{ color: accentColor, fontWeight: '600', textDecoration: 'none' }}
                        >
                            Login →
                        </Link>
                    </p>
                    <p style={{ fontSize: '0.85rem' }}>
                        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                            ← Back to Entrance
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
