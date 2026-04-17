import React from 'react';
import { TrendingUp, TrendingDown, MoreHorizontal, Edit, Trash2, ExternalLink } from 'lucide-react';

const Sparkline = ({ data, color }) => {
    const max = Math.max(...data, 1);
    const width = 60;
    const height = 20;
    const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d / max) * height}`).join(' ');

    return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const VisualDataTable = ({ title, columns, data, isTamil }) => {
    return (
        <div className="glass-panel" style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--electric-blue)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {title}
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '4px 8px', background: 'rgba(0,210,255,0.1)', border: '1px solid var(--electric-blue)', borderRadius: '4px', color: 'var(--electric-blue)', fontSize: '0.7rem', cursor: 'pointer' }}>EXPORT CSV</button>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                            {columns.map((col, i) => (
                                <th key={i} style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {isTamil ? col.labelT : col.label}
                                </th>
                            ))}
                            <th style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,210,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                {columns.map((col, j) => {
                                    const val = row[col.key];

                                    // Power BI Concept: Conditional Formatting
                                    if (col.type === 'status') {
                                        let bg = 'rgba(255,255,255,0.05)', fg = '#fff';
                                        if (val === 'ACTIVE' || val === 'CLOSED' || val === 'ONLINE') { bg = 'rgba(0,255,128,0.1)'; fg = '#00ff80'; }
                                        else if (val === 'PENDING' || val === 'ONGOING') { bg = 'rgba(255,204,0,0.1)'; fg = '#ffcc00'; }
                                        else if (val === 'URGENT' || val === 'OFFLINE') { bg = 'rgba(255,60,60,0.1)'; fg = '#ff4d4d'; }

                                        return (
                                            <td key={j} style={{ padding: '14px 16px' }}>
                                                <span style={{ padding: '4px 10px', borderRadius: '4px', background: bg, color: fg, fontWeight: 'bold', fontSize: '0.7rem' }}>
                                                    {val}
                                                </span>
                                            </td>
                                        );
                                    }

                                    // Power BI Concept: Mini Sparklines
                                    if (col.type === 'trend') {
                                        return (
                                            <td key={j} style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Sparkline data={val} color={row.trendDir === 'up' ? '#00ff80' : '#ff4d4d'} />
                                                    {row.trendDir === 'up' ? <TrendingUp size={12} color="#00ff80" /> : <TrendingDown size={12} color="#ff4d4d" />}
                                                </div>
                                            </td>
                                        );
                                    }

                                    return (
                                        <td key={j} style={{ padding: '14px 16px', color: '#fff' }}>
                                            {typeof val === 'string' && val.length > 30 ? val.substring(0, 30) + '...' : val}
                                        </td>
                                    );
                                })}
                                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button title="Edit" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}><Edit size={14} /></button>
                                        <button title="Delete" style={{ background: 'none', border: 'none', color: 'rgba(255,60,60,0.6)', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                                        <button title="View Detail" style={{ background: 'none', border: 'none', color: 'var(--electric-blue)', cursor: 'pointer', padding: '4px' }}><ExternalLink size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VisualDataTable;
