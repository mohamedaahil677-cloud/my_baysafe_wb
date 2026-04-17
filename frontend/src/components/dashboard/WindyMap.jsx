import React, { useEffect, useRef } from 'react';

const WindyMap = ({ activeLayer }) => {
    const iframeRef = useRef(null);

    // Default to 'rain' if not provided
    const overlay = activeLayer || 'rain';

    // Centered for Tamil Nadu, Bay of Bengal, and Andaman Sea
    const lat = 12.0;
    const lon = 85.0;
    const zoom = 5;

    // Use Windy embedded URL format with multi-layer support
    const windyUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=${zoom}&overlay=${overlay}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&message=true`;

    return (
        <div style={{
            flex: 1,
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
            background: 'var(--deep-ocean)',
            minHeight: '650px', 
        }}>
            {/* Loading placeholder */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                color: 'var(--text-secondary)',
                zIndex: 0
            }}>
                <span className="spinner" style={{ marginRight: '10px' }} />
                Initializing Regional Radar Analysis...
            </div>

            <iframe
                ref={iframeRef}
                title="Windy Weather Radar - TN & Maritime"
                src={windyUrl}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    position: 'relative',
                    zIndex: 1
                }}
                allow="fullscreen"
            />

            {/* Maritime Coverage Label */}
            <div style={{
                position: 'absolute',
                top: '20px', left: '20px',
                background: 'rgba(10, 25, 47, 0.85)',
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #a855f7',
                backdropFilter: 'blur(12px)',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: '800',
                zIndex: 2,
                pointerEvents: 'none',
                letterSpacing: '1px',
                textTransform: 'uppercase'
            }}>
                🛰️ TN / Bay of Bengal / Indian Ocean Radar
            </div>
        </div>
    );
};

export default WindyMap;
