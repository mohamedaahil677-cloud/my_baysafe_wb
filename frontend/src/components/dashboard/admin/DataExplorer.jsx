import React, { useState } from 'react';
import { Database, Filter, Download, Plus, Zap, Activity, Users, ShieldAlert } from 'lucide-react';
import VisualDataTable from './VisualDataTable';

const DataExplorer = ({ isTamil }) => {
    // Mock Data for the Explorer
    const taskColumns = [
        { key: 'id', label: 'ID', labelT: 'ID', type: 'text' },
        { key: 'title', label: 'Subject', labelT: 'தலைப்பு', type: 'text' },
        { key: 'status', label: 'Priority / Status', labelT: 'நிலை', type: 'status' },
        { key: 'urgencyTrend', label: 'Trend', labelT: 'போக்கு', type: 'trend' },
        { key: 'city', label: 'Location', labelT: 'இடம்', type: 'text' },
        { key: 'time', label: 'Latency', labelT: 'நேரம்', type: 'text' },
    ];

    const taskData = [
        { id: '#SOS-104', title: 'Severe Flood Rescue', status: 'URGENT', urgencyTrend: [2, 5, 8, 10, 9], trendDir: 'up', city: 'North Chennai', time: '12m' },
        { id: '#SOS-105', title: 'Medical Kit Delivery', status: 'PENDING', urgencyTrend: [1, 2, 2, 3, 3], trendDir: 'up', city: 'Madurai', time: '45m' },
        { id: '#SOS-102', title: 'Food Shortage (80ppl)', status: 'ONGOING', urgencyTrend: [8, 7, 6, 5, 4], trendDir: 'down', city: 'Tambaram', time: '1h' },
        { id: '#SOS-98', title: 'Boat Evacuation', status: 'CLOSED', urgencyTrend: [10, 8, 4, 1, 0], trendDir: 'down', city: 'Kanyakumari', time: '3h' },
    ];

    const volColumns = [
        { key: 'name', label: 'Responder', labelT: 'தன்னார்வலர்', type: 'text' },
        { key: 'status', label: 'Availability', labelT: 'நிலை', type: 'status' },
        { key: 'expertise', label: 'Skillset', labelT: 'திறமை', type: 'text' },
        { key: 'activity', label: 'Active Rate', labelT: 'செயல்பாடு', type: 'trend' },
        { key: 'rating', label: 'Trust Score', labelT: 'மதிப்பீடு', type: 'text' },
    ];

    const volData = [
        { name: 'Arjun Selvam', status: 'ONLINE', expertise: 'Water Rescue', activity: [4, 6, 8, 10, 9], trendDir: 'up', rating: '98%' },
        { name: 'Priya Anand', status: 'ONLINE', expertise: 'Medical/First-Aid', activity: [7, 7, 8, 8, 9], trendDir: 'up', rating: '95%' },
        { name: 'Rajiv Kumar', status: 'OFFLINE', expertise: 'Relief Logistics', activity: [5, 4, 3, 2, 1], trendDir: 'down', rating: '92%' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Control Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(0,180,255,0.1)', border: '1px solid var(--electric-blue)', borderRadius: '10px' }}>
                        <Database size={20} color="var(--electric-blue)" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{isTamil ? 'மெய்நிகர் தரவுத்தள மேலாளர்' : 'Virtual Database Explorer'}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Power BI Optimized Operational Intelligence</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <Filter size={14} /> {isTamil ? 'வடிகட்டி' : 'Filters'}
                    </button>
                    <button className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <Download size={14} /> {isTamil ? 'பதிவிறக்கம்' : 'Download All'}
                    </button>
                    <button className="btn-shimmer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.8rem' }}>
                        <Plus size={14} /> {isTamil ? 'புதிய பதிவு' : 'Insert Entry'}
                    </button>
                </div>
            </div>

            {/* KPI Overview (BI Style) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {[
                    { label: 'DB Latency', value: '14ms', icon: Zap, color: '#ffd700' },
                    { label: 'Active SOS', value: '42', icon: ShieldAlert, color: '#ff4d4d' },
                    { label: 'Responders', value: '128', icon: Users, color: '#00ff80' },
                    { label: 'Total Syncs', value: '1.2k', icon: Activity, color: '#00d2ff' },
                ].map((kpi, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '16px 20px', border: `1px solid ${kpi.color}22` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{kpi.label}</span>
                            <kpi.icon size={14} color={kpi.color} />
                        </div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>{kpi.value}</div>
                    </div>
                ))}
            </div>

            {/* Visual Tables Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <VisualDataTable
                    title={isTamil ? "அவசரக்கால பணிகளின் போக்கு பகுப்பாய்வு" : "Emergency Task Pipeline & Latency Trends"}
                    columns={taskColumns}
                    data={taskData}
                    isTamil={isTamil}
                />

                <VisualDataTable
                    title={isTamil ? "தன்னார்வலர் செயல்பாட்டு விபரம்" : "Active Responder Engagement Matrix"}
                    columns={volColumns}
                    data={volData}
                    isTamil={isTamil}
                />
            </div>

            <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                Data fetched from SQLite Master Node @ baysafe_database.sqlite | Virtual Schema v2.1
            </div>
        </div>
    );
};

export default DataExplorer;
