import React, { useState, useEffect } from 'react';
import { Camera, MapPin, AlignLeft, Phone, UploadCloud, CheckCircle } from 'lucide-react';
import { dmsService } from '../../../services/api';

const RescueReport = () => {
    const isTamil = localStorage.getItem('lang') === 'TA';
    const [tasks, setTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form fields
    const [location, setLocation] = useState('');
    const [desc, setDesc] = useState('');
    const [contact, setContact] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            const response = await dmsService.getTasks();
            // Filter tasks assigned to current user (assuming volunteer role)
            // Filter status ONGOING
            const ongoing = response.data.filter(t => t.status === 'ONGOING');
            setTasks(ongoing);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUploading(true);
            if (!selectedTaskId) {
                alert("Please select a task.");
                return;
            }

            let report_img = '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                const uploadRes = await dmsService.uploadFile(formData);
                report_img = uploadRes.data.url;
            }

            await dmsService.updateTask(selectedTaskId, 'report', {
                report_desc: desc,
                location: location,
                report_img: report_img
            });
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000); // Reset after 5s
            setLocation(''); setDesc(''); setContact('');
            setImageFile(null); setImagePreview(null);
        } catch (err) {
            alert("Report submission failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ margin: 0, color: 'var(--volunteer-green)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Camera size={20} /> {isTamil ? 'மீட்பு அறிக்கை சமர்ப்பித்தல்' : 'Post-Rescue Report Submission'}
            </h3>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {isTamil
                    ? 'பணி முடிவடைந்ததற்கான ஆதாரத்தைச் சமர்ப்பிக்கவும். இந்த அறிக்கை குறியாக்கம் செய்யப்பட்டு பயனர் ஒப்புதலுக்காக அனுப்பப்படும்.'
                    : 'Submit proof of task completion. This report will be heavily encrypted and sent directly to the original requester for final approval.'}
            </p>

            {submitted ? (
                <div className="glass-panel" style={{
                    border: '1px solid #00d2ff', background: 'rgba(0, 210, 255, 0.1)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', gap: '15px'
                }}>
                    <CheckCircle size={50} color="#00d2ff" />
                    <h3 style={{ margin: 0, color: '#00d2ff' }}>{isTamil ? 'அறிக்கை அனுப்பப்பட்டது' : 'Report Transmitted'}</h3>
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px' }}>
                        {isTamil
                            ? 'உங்கள் அறிக்கை பாதுகாப்பாக பதிவேற்றப்பட்டது. பயனர் ஒப்புதலுக்காக காத்திருக்கிறது.'
                            : 'Your tactical report has been securely uploaded. Awaiting User Approval.'}
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '32px', border: '1px solid rgba(0,255,128,0.3)' }}>

                    {/* Task Selection */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📋 {isTamil ? 'பணியைத் தேர்ந்தெடுக்கவும்' : 'Select Assigned Task *'}</label>
                        <select
                            className="form-input-green"
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            required
                        >
                            <option value="">{isTamil ? '-- ஒரு பணியைத் தேர்ந்தெடு --' : '-- Select a Task --'}</option>
                            {tasks.map(t => (
                                <option key={t.id} value={t.id}>#{t.id} - {t.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            <MapPin size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'மீட்பு இருப்பிடம்' : 'Rescue Location *'}
                        </label>
                        <input
                            className="form-input-green"
                            placeholder={isTamil ? "எ.கா: மெரினா தெரு, சென்னை" : "e.g. Marina Beach, Sector 4"}
                            value={location} onChange={(e) => setLocation(e.target.value)} required
                        />
                    </div>

                    {/* Contact Number */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            <Phone size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'தன்னார்வலர் தொடர்பு எண்' : 'Volunteer Contact *'}
                        </label>
                        <div style={{ display: 'flex' }}>
                            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px 15px', border: '1px solid rgba(0, 255, 128, 0.3)', borderRight: 'none', borderRadius: '8px 0 0 8px', color: '#fff', display: 'flex', alignItems: 'center' }}>
                                🇮🇳 +91
                            </div>
                            <input
                                className="form-input-green"
                                style={{ borderRadius: '0 8px 8px 0', width: '100%' }}
                                placeholder={isTamil ? "10-இலக்க எண்" : "10-digit number"}
                                pattern="\d{10}"
                                value={contact} onChange={(e) => setContact(e.target.value)} required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            <AlignLeft size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'விரிவான விளக்கம்' : 'Detailed Description *'}
                        </label>
                        <textarea
                            className="form-input-green"
                            placeholder={isTamil ? "பாதிக்கப்பட்டவர்களின் நிலை, எடுக்கப்பட்ட நடவடிக்கைகள்..." : "Describe the condition of victims, actions taken, and final status..."}
                            style={{ minHeight: '80px', resize: 'vertical' }}
                            value={desc} onChange={(e) => setDesc(e.target.value)} required
                        />
                    </div>

                    {/* Visual Proof */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            <Camera size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> {isTamil ? 'மீட்பு பணிக்கான ஆதாரப் படம்' : 'Tactical Image Proof'}
                        </label>
                        <div style={{
                            border: '1px dashed rgba(0,255,128,0.4)', borderRadius: '8px', padding: '12px',
                            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', position: 'relative', overflow: 'hidden', height: '100px'
                        }} onClick={() => document.getElementById('proof-upload').click()}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <UploadCloud size={20} color="var(--volunteer-green)" /> {isTamil ? 'புகைப்படத்தை பதிவேற்ற இங்கே கிளிக் செய்யவும்' : 'Click to upload Action Photo'}
                                </div>
                            )}
                            <input type="file" accept="image/*" style={{ display: 'none' }} id="proof-upload" onChange={handleImageChange} />
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', marginTop: '10px' }}>
                        <button 
                            type="submit" 
                            className="btn-shimmer-green" 
                            disabled={uploading}
                            style={{ flex: 1, padding: '15px', fontSize: '1.05rem', fontWeight: 'bold', opacity: uploading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            {uploading ? <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'var(--volunteer-green)' }} /> : <CheckCircle size={18} />}
                            {uploading 
                               ? (isTamil ? 'பதியப்படுகிறது...' : 'UPLOADING...') 
                               : (isTamil ? 'ஒப்புதலுக்கான அறிக்கையை சமர்ப்பிக்கவும்' : 'SUBMIT REPORT FOR APPROVAL')}
                        </button>
                    </div>

                </form>
            )}
        </div>
    );
};

export default RescueReport;
