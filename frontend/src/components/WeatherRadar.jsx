import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Share2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icons
/*
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
*/

// Simpler marker fix mapping
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const WeatherRadar = () => {
    const southernIndiaCenter = [11.1271, 78.6569];
    const zoomLevel = 7;

    return (
        <div className="flex-column" style={{ gap: '20px' }}>
            <h3 style={{ color: 'var(--text-primary)' }}>Real-Time Weather Radar (South India Focus)</h3>

            <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', padding: '20px' }}>
                <div className="anti-gravity-hover" style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #00d2ff' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Wind Speed</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>24 km/h</div>
                </div>
                <div className="anti-gravity-hover" style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #00ff80' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Precipitation</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12 mm</div>
                </div>
                <div className="anti-gravity-hover" style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ffaa00' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Temperature</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>32°C</div>
                </div>
                <div className="anti-gravity-hover" style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ff4444' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Alert Level</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff4444' }}>Severe</div>
                </div>
            </div>

            <div className="glass-panel anti-gravity-hover" style={{ height: '550px', width: '100%', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--electric-blue)' }}>
                <MapContainer center={southernIndiaCenter} zoom={zoomLevel} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <ChangeView center={southernIndiaCenter} zoom={zoomLevel} />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <TileLayer
                        attribution='Weather data by OpenWeatherMap'
                        url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=demo"
                        opacity={0.6}
                    />

                    <Marker position={[13.0827, 80.2707]}>
                        <Popup>
                            <div style={{ minWidth: '180px', position: 'relative', paddingRight: '30px' }}>
                                <strong>Chennai</strong> <br /> Heavy Rains Expected
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText("BaySafe Weather Alert: Chennai - Heavy Rains Expected");
                                        alert("Location Alert Shared!");
                                    }}
                                    style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--electric-blue)' }}
                                >
                                    <Share2 size={14} />
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                    <Marker position={[10.7905, 78.7047]}>
                        <Popup>
                            <div style={{ minWidth: '180px', position: 'relative', paddingRight: '30px' }}>
                                <strong>Trichy</strong> <br /> Safe Zone Active
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText("BaySafe Weather Alert: Trichy - Safe Zone Active");
                                        alert("Location Alert Shared!");
                                    }}
                                    style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--electric-blue)' }}
                                >
                                    <Share2 size={14} />
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                    <Marker position={[9.9252, 78.1198]}>
                        <Popup>
                            <div style={{ minWidth: '180px', position: 'relative', paddingRight: '30px' }}>
                                <strong>Madurai</strong> <br /> Wind Alerts
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText("BaySafe Weather Alert: Madurai - Wind Alerts");
                                        alert("Location Alert Shared!");
                                    }}
                                    style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--electric-blue)' }}
                                >
                                    <Share2 size={14} />
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}

export default WeatherRadar;
