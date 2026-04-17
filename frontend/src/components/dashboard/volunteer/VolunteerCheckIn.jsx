import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, User, Camera, FileText, Wrench, ShieldCheck, Power, Settings } from 'lucide-react';
import { dmsService } from '../../../services/api';

const VolunteerCheckIn = () => {
    const isTamil = localStorage.getItem('lang') === 'TA';
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form States
    const [locationInput, setLocationInput] = useState('');
    const [address, setAddress] = useState('');
    const [expertise, setExpertise] = useState('General Relief');
    const [idType, setIdType] = useState('Aadhar');
    const [equipments, setEquipments] = useState('');
    const [rescueType, setRescueType] = useState('Emergency Rescue');

    useEffect(() => {
        // Here we would ideally fetch the current volunteer's status from backend
        // For now, let's assume we can sync on check-in
        setLoading(false);
    }, []);

    const handleLocateMe = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocationInput(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
                (err) => alert("Could not fetch location.")
            );
        }
    };

    const handleCheckIn = async (e) => {
        e.preventDefault();
        try {
            const [lat, lon] = locationInput.includes(',') ? locationInput.split(',').map(s => parseFloat(s.trim())) : [13.0, 80.0];
            await dmsService.checkIn({
                is_online: true,
                lat: lat || 13.0,
                lon: lon || 80.0,
                expertise,
                equipment: equipments
            });
            setIsCheckedIn(true);
        } catch (err) {
            alert("Check-in failed. Please check your credentials.");
        }
    };

    const handleCheckOut = async () => {
        try {
            await dmsService.checkIn({ is_online: false });
            setIsCheckedIn(false);
        } catch (err) {
            alert("Check-out failed.");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, color: 'var(--volunteer-green)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Power size={20} /> {isTamil ? 'நிலை கட்டுப்பாடு' : 'Deployment Status Control'}
            </h3>

            {isCheckedIn ? (
                <div className="glass-panel" style={{
                    border: '1px solid #00ff80', background: 'rgba(0, 255, 128, 0.05)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', gap: '20px'
                }}>
                    <div className="pin-pulse" style={{ width: '80px', height: '80px', background: 'rgba(0, 255, 128, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ShieldCheck size={40} color="#00ff80" />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#00ff80', margin: '0 0 10px 0' }}>{isTamil ? 'செயலில் உள்ளது' : 'ACTIVE DUTY STATUS'}</h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: '1.6' }}>
                            {isTamil
                                ? `உங்கள் தரவுகள் பூட்டப்பட்டுள்ளன. நீங்கள் இப்போது மீட்புப் பட்டியலில் தெரிகிறீர்கள். ${locationInput || 'உங்கள்'} இருப்பிடத்திற்கு அருகிலுள்ள பணிகள் உங்களுக்கு அனுப்பப்படும்.`
                                : `Your parameters are locked. You are now visible on the Global Rescue Roster. Emergency tasks mapped near ${locationInput || 'your location'} will be routed to your feed.`}
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', background: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '600px' }}>
                        <div><strong style={{ color: '#888' }}>{isTamil ? 'திறமை' : 'Expertise'}:</strong> <span style={{ color: '#fff' }}>{expertise}</span></div>
                        <div><strong style={{ color: '#888' }}>{isTamil ? 'உபகரணங்கள்' : 'Equipments'}:</strong> <span style={{ color: '#fff' }}>{equipments || 'None Listed'}</span></div>
                        <div><strong style={{ color: '#888' }}>{isTamil ? 'மீட்பு வகை' : 'Rescue Type'}:</strong> <span style={{ color: '#fff' }}>{rescueType}</span></div>
                        <div><strong style={{ color: '#888' }}>{isTamil ? 'முகவரி' : 'Base Addr'}:</strong> <span style={{ color: '#fff' }}>{address}</span></div>
                    </div>
                    <button
                        onClick={handleCheckOut}
                        className="btn-shimmer"
                        style={{ padding: '12px 30px', background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', marginTop: '10px' }}
                    >
                        {isTamil ? 'பணியிலிருந்து விலகு' : 'STAND DOWN (CHECK-OUT)'}
                    </button>
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(0,255,128,0.3)' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
                        {isTamil
                            ? 'செயலில் இருப்பதற்கும் SOS பணிகளைப் பெறுவதற்கும் உங்கள் தற்போதைய தகவல்களை உள்ளிடவும்.'
                            : 'Enter your current tactical parameters to initiate Active Duty mode and receive localized SOS tasks.'}
                    </p>

                    <form onSubmit={handleCheckIn} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                        {/* 1. Location Block */}
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}><Navigation size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'செயல்பாட்டு இருப்பிடம் *' : 'Operational Coordinates *'}</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    className="form-input-green"
                                    style={{ flex: 1 }}
                                    placeholder={isTamil ? "இருப்பிடத்தைத் தட்டச்சு செய்யவும் (எ.கா: வேளச்சேரி, சென்னை)" : "Enter Mock Location (e.g. Velachery, Chennai)"}
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={handleLocateMe} className="btn-shimmer-green flex-center" style={{ width: '48px', padding: 0, borderRadius: '8px' }}>
                                    <MapPin size={20} />
                                </button>
                            </div>
                        </div>

                        {/* 2. Address */}
                        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}><User size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'செயல்பாட்டு முகவரி *' : 'Operating Base Address *'}</label>
                            <textarea
                                className="form-input-green"
                                style={{ resize: 'vertical', minHeight: '80px' }}
                                placeholder={isTamil ? "முழு முகவரி / அடையாளச்சின்னம்..." : "Full Street Address/Landmark..."}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        {/* 3. Expertise */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}><Settings size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'முதன்மை பணி அனுபவம்' : 'Primary Task Expertise'}</label>
                            <select
                                className="form-input-green"
                                value={expertise}
                                onChange={(e) => setExpertise(e.target.value)}
                            >
                                <option>{isTamil ? 'பொது மற்றும் தளவாடங்கள்' : 'General Relief & Logistics'}</option>
                                <option>{isTamil ? 'முதலுதவி அளிப்பவர்' : 'Medical First Responder'}</option>
                                <option>{isTamil ? 'நீர் மீட்பு / படகு ஓட்டுதல்' : 'Water Rescue / Boat Opr.'}</option>
                                <option>{isTamil ? 'இடிபாடுகளை அகற்றுதல்' : 'Debris Clearing'}</option>
                                <option>{isTamil ? 'விலங்கு மீட்பு' : 'Animal Rescue'}</option>
                            </select>
                        </div>

                        {/* 3b. Rescue Type */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}><Settings size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'மீட்பு வகை' : 'Type of Rescue Form'}</label>
                            <select
                                className="form-input-green"
                                value={rescueType}
                                onChange={(e) => setRescueType(e.target.value)}
                            >
                                <option>🚨 {isTamil ? 'அவசர மீட்பு' : 'Emergency Rescue'}</option>
                                <option>🍚 {isTamil ? 'உணவு தேவை' : 'Food Need'}</option>
                                <option>🏠 {isTamil ? 'தங்குமிடம் தேவை' : 'Shelter Need'}</option>
                                <option>👕 {isTamil ? 'ஆடை தேவை' : 'Clothing Need'}</option>
                                <option>🚚 {isTamil ? 'இடமாற்றம்' : 'Shifting Need'}</option>
                                <option>🚤 {isTamil ? 'படகு தேவை' : 'Boat Need'}</option>
                                <option>🩺 {isTamil ? 'மருத்துவ உதவி' : 'Medical Aid'}</option>
                                <option>🧹 {isTamil ? 'இடிபாடு நீக்கம்' : 'Debris Clearing'}</option>
                            </select>
                        </div>

                        {/* 4. Equipment */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}><Wrench size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'கிடைக்கக்கூடிய உபகரணங்கள்' : 'Available Equipment'}</label>
                            <input
                                className="form-input-green"
                                placeholder={isTamil ? "எ.கா: படகு, கயிறு, உணவுகள்" : "e.g. Inflatable Boat, Rope, Rations"}
                                value={equipments}
                                onChange={(e) => setEquipments(e.target.value)}
                            />
                        </div>

                        {/* 5. Professional ID Type */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}><FileText size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'அடையாள அட்டை வகை' : 'Professional ID Type'}</label>
                            <select
                                className="form-input-green"
                                value={idType}
                                onChange={(e) => setIdType(e.target.value)}
                            >
                                <option value="Aadhar">{isTamil ? 'ஆதார் அட்டை' : 'Aadhar Card'}</option>
                                <option value="Voter ID">{isTamil ? 'வாக்காளர் அடையாள அட்டை' : 'Voter ID'}</option>
                                <option value="Driving License">{isTamil ? 'ஓட்டுநர் உரிமம்' : 'Driving License'}</option>
                                <option value="Govt ID">{isTamil ? 'அரசு அடையாள அட்டை' : 'Govt ID'}</option>
                            </select>
                        </div>

                        {/* 6. Professional ID Upload & DP Image mapped together */}
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}><FileText size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'அடையாள அட்டை பதிவேற்றம்' : 'Professional ID Upload'}</label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '60px', background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(0,255,128,0.3)', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>
                                    <input type="file" accept="image/*,.pdf" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', width: '100%' }} />
                                </div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}><Camera size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'தன்னார்வலர் சுயவிவரப் படம்' : 'Volunteer DP Image'}</label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '60px', background: 'rgba(0,0,0,0.3)', border: '1px dashed rgba(0,255,128,0.3)', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>
                                    <input type="file" accept="image/*" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', width: '100%' }} />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                            <button type="submit" className="btn-shimmer-green" style={{ width: '100%', padding: '15px', fontSize: '1.05rem', fontWeight: 'bold' }}>
                                {isTamil ? 'பணியைத் தொடங்கு' : 'INITIATE ACTIVE DEPLOYMENT'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default VolunteerCheckIn;
