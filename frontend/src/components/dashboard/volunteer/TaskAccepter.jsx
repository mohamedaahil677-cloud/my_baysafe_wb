import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { dmsService } from '../../../services/api';

const TaskAccepter = () => {
    const isTamil = localStorage.getItem('lang') === 'TA';
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [proximityFilter, setProximityFilter] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await dmsService.getTasks();
            // Filter only pending tasks for the accepter feed
            const pending = response.data.filter(t => t.status === 'PENDING').map(t => ({
                id: t.id,
                title: t.title,
                status: t.status,
                location: t.location || 'Unknown',
                type: t.category,
                dist: (Math.random() * 5 + 0.5).toFixed(1), // Mock distance calculation
                desc: t.desc,
                time: "Recently"
            }));
            setTasks(pending);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const acceptTask = async (taskId) => {
        try {
            await dmsService.updateTask(taskId, 'accept');
            fetchTasks();
            alert("Task Accepted! Please proceed to the location.");
        } catch (err) {
            alert("Failed to accept task.");
        }
    };

    // If filter is on, only show tasks < 5.0 km
    const displayTasks = proximityFilter ? tasks.filter(t => parseFloat(t.dist) <= 5.0) : tasks;

    if (loading) return (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--volunteer-green)' }}>
            <h3>தரவு ஏற்றப்படுகிறது... / Loading SOS Feed...</h3>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--volunteer-green)' }}>
                    {isTamil ? 'உலகளாவிய SOS தகவல்' : 'Global SOS Feed'}
                </h3>
                <button
                    onClick={() => setProximityFilter(!proximityFilter)}
                    style={{
                        padding: '8px 16px', borderRadius: '20px',
                        background: proximityFilter ? 'var(--volunteer-green)' : 'rgba(255,255,255,0.1)',
                        color: proximityFilter ? '#000' : '#fff',
                        border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <MapPin size={16} />
                    {proximityFilter
                        ? (isTamil ? 'அருகிலுள்ளவை மட்டும் (< 5கிமீ)' : 'Showing Nearby Only (< 5km)')
                        : (isTamil ? 'தொலைவு அடிப்படையில் வடிகட்டவும்' : 'Filter by Proximity')}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {displayTasks.map(task => (
                    <div key={task.id} className="glass-panel" style={{
                        padding: '20px', border: `1px solid ${task.status === 'ONGOING' ? 'var(--electric-blue)' : 'rgba(255, 60, 60, 0.3)'}`,
                        background: task.status === 'ONGOING' ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255, 60, 60, 0.05)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.7rem', background: task.status === 'ONGOING' ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255, 140, 0, 0.1)', color: task.status === 'ONGOING' ? '#00d2ff' : '#ff8c00', border: `1px solid ${task.status === 'ONGOING' ? '#00d2ff' : '#ff8c00'}`, padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                                {task.type.toUpperCase()}
                            </span>
                            <span style={{ fontSize: '0.7rem', background: task.status === 'ONGOING' ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255, 140, 0, 0.1)', color: task.status === 'ONGOING' ? '#00d2ff' : '#ff8c00', border: `1px solid ${task.status === 'ONGOING' ? '#00d2ff' : '#ff8c00'}`, padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                {task.status === 'ONGOING' ? 'செயல்பாட்டில் / EN ROUTE' : 'நிலுவை / PENDING'}
                            </span>
                        </div>

                        <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '1rem' }}>#{task.id} — {task.title}</h4>
                        <p style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                            {task.desc}
                        </p>

                        <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap', marginBottom: '16px' }}>
                            <span><MapPin size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {task.location} ({task.dist} km)</span>
                            <span><Clock size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {task.time}</span>
                        </div>

                        {task.status === 'PENDING' ? (
                            <button
                                onClick={() => acceptTask(task.id)}
                                className="btn-shimmer-green"
                                style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                            >
                                <AlertCircle size={18} /> {isTamil ? 'பணியை ஏற்றுக்கொள்' : 'ACCEPT TASK & DEPLOY'}
                            </button>
                        ) : (
                            <button
                                disabled
                                style={{ width: '100%', padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold', background: 'rgba(0, 210, 255, 0.2)', color: 'var(--electric-blue)', border: '1px solid var(--electric-blue)', borderRadius: '8px' }}
                            >
                                <CheckCircle size={18} /> {isTamil ? 'நடவடிக்கையில் (தொடர்கிறது)' : 'EN ROUTE (ONGOING)'}
                            </button>
                        )}
                    </div>
                ))}

                {displayTasks.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                        {isTamil
                            ? 'தகவல்கள் எதுவும் இல்லை. நன்று!'
                            : 'No tasks found matching your filter criteria. Good job!'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskAccepter;
