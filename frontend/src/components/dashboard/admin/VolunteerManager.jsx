import React, { useState } from 'react';
import { Users, FileText, Send } from 'lucide-react';
import VisualDataTable from './VisualDataTable';
import { adminService } from '../../../services/api';

const VolunteerManager = ({ volunteers, onUpdateVols, isTamil }) => {
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportText, setReportText] = useState('');

    const handlePublishReport = () => {
        alert('Report Published for All Volunteers: ' + reportText);
        setShowReportModal(false);
        setReportText('');
    };

    const columns = [
        { key: 'id', label: 'ID', labelT: 'ID' },
        { key: 'full_name', label: 'Volunteer Name', labelT: 'தன்னார்வலர் பெயர்' },
        { key: 'city', label: 'Base City', labelT: 'தளம் நகரம்' },
        { key: 'role_type', label: 'Expertise', labelT: 'நிபுணத்துவம்' },
        { key: 'is_available', label: 'Status', labelT: 'நிலை', type: 'status' },
    ];

    const mappedData = volunteers.map(v => ({
        ...v,
        is_available: v.is_available ? 'ONLINE' : 'OFFLINE'
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button onClick={() => setShowReportModal(true)} className="btn-shimmer" style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} /> {isTamil ? 'அறிக்கை வெளியிடு' : 'Publish Availability Report'}
                </button>
            </div>

            {/* Visual Table */}
            <VisualDataTable 
                title={isTamil ? "தன்னார்வலர் மேலாண்மை" : "Global Volunteer Directory"}
                columns={columns}
                data={mappedData}
                isTamil={isTamil}
            />

            {/* Report Modal */}
            {showReportModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ padding: '30px', maxWidth: '500px', width: '90%', border: '1px solid var(--electric-blue)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: 'var(--electric-blue)' }}>
                            {isTamil ? 'தன்னார்வலர் இருப்பு அறிக்கை வெளியிடு' : 'Publish Volunteer Availability Report'}
                        </h3>
                        <textarea
                            className="form-input"
                            value={reportText}
                            onChange={e => setReportText(e.target.value)}
                            placeholder={isTamil ? 'அறிக்கையினை இங்கே உள்ளிடவும்...' : 'Type your report description here...'}
                            style={{ width: '100%', minHeight: '120px', background: 'rgba(0,0,0,0.3)', marginBottom: '20px' }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handlePublishReport} className="btn-shimmer" style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Send size={18} /> {isTamil ? 'வெளியிடு' : 'Publish Now'}
                            </button>
                            <button onClick={() => setShowReportModal(false)} className="btn-shimmer" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                                {isTamil ? 'ரத்து' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerManager;
