import React, { useState } from 'react';
import { Phone, Building, Search, ChevronDown, ChevronUp, AlertOctagon, HeartPulse, Building2, MapPin, Anchor, Mountain } from 'lucide-react';

// ─── 1. NATIONAL & NDRF ───────────────────────────────────────────────────────────
const NATIONAL = [
    { name: 'National Emergency Number', nameT: 'தேசிய அவசர எண்', num: '112', icon: '🚨', color: '#ff4d4d' },
    { name: 'NDMA Control Room', nameT: 'NDMA கட்டுப்பாட்டு அறை', num: '011-26701700', icon: '🏛️', color: '#a855f7' },
    { name: 'NDRF HQ, New Delhi', nameT: 'NDRF தலைமையகம்', num: '011-24363260', icon: '🛡️', color: '#00d2ff' },
    { name: 'National Disaster Helpline', nameT: 'தேசிய பேரிடர் உதவி', num: '1078', icon: '📡', color: '#ff6b6b' },
    { name: 'IMD Weather Forecasting', nameT: 'இந்திய வானிலை ஆய்வு', num: '011-24631913', icon: '🌦️', color: '#ffcc00' },
    { name: 'Central Police Control', nameT: 'காவல் கட்டுப்பாட்டு அறை', num: '100', icon: '🚔', color: '#ff8c00' },
    { name: 'Fire Service / Rescue', nameT: 'தீயணைப்பு / மீட்பு', num: '101', icon: '🚒', color: '#ff3333' },
];

// ─── 2. TAMIL NADU STATE & CHENNAI ────────────────────────────────────────────────
const TN_STATE_HQ = [
    { name: 'State Emergency Operation Centre (SEOC)', nameT: 'மாநில அவசர செயல்பாட்டு மையம்', num: '1070', icon: '🏢' },
    { name: 'Greater Chennai Corporation (GCC)', nameT: 'பெருநகர சென்னை மாநகராட்சி', num: '1913', icon: '🏙️' },
    { name: 'Chennai Police Commissionerate', nameT: 'சென்னை காவல் ஆணையம்', num: '044-23452390', icon: '🚓' },
    { name: 'Health Department Helpline', nameT: 'சுகாதாரத் துறை', num: '104', icon: '⚕️' },
    { name: 'State Ambulance Services', nameT: 'அவசர ஊர்தி', num: '108', icon: '🚑' },
    { name: 'Fisheries Dept (Coastal)', nameT: 'மீன்வளத் துறை (கடலோரம்)', num: '044-24336311', icon: '⚓' },
];

// ─── 3. TAMIL NADU ALL 38 DISTRICTS (Direct HQ Contacts) ──────────────────────────
const TN_DISTRICTS = [
    { name: 'Chennai Collectorate Control Room', nameT: 'சென்னை ஆட்சியரகக் கட்டுப்பாட்டு அறை', num: '044-25268320' },
    { name: 'Chengalpattu Control Room', nameT: 'செங்கல்பட்டு கட்டுப்பாட்டு அறை', num: '044-27427412' },
    { name: 'Kancheepuram Control Room', nameT: 'காஞ்சிபுரம் கட்டுப்பாட்டு அறை', num: '044-27237433' },
    { name: 'Tiruvallur Control Room', nameT: 'திருவள்ளூர் கட்டுப்பாட்டு அறை', num: '044-27661600' },
    { name: 'Vellore Collectorate Board', nameT: 'வேலூர் ஆட்சியரக வாரியம்', num: '0416-2252345' },
    { name: 'Ranipet Collectorate', nameT: 'இராணிப்பேட்டை ஆட்சியரகம்', num: '04172-271500' },
    { name: 'Tirupathur Collectorate', nameT: 'திருப்பத்தூர் ஆட்சியரகம்', num: '04179-220000' },
    { name: 'Tiruvannamalai Control Room', nameT: 'திருவண்ணாமலை கட்டுப்பாட்டு அறை', num: '04175-232260' },
    { name: 'Viluppuram Control Room', nameT: 'விழுப்புரம் கட்டுப்பாட்டு அறை', num: '04146-223265' },
    { name: 'Kallakurichi Collectorate', nameT: 'கள்ளக்குறிச்சி ஆட்சியரகம்', num: '04151-228800' },
    { name: 'Cuddalore Control Room', nameT: 'கடலூர் கட்டுப்பாட்டு அறை', num: '04142-230999' },
    { name: 'Dharmapuri Collectorate Board', nameT: 'தருமபுரி ஆட்சியரக வாரியம்', num: '04342-230561' },
    { name: 'Krishnagiri Collectorate', nameT: 'கிருஷ்ணகிரி ஆட்சியரகம்', num: '04343-239301' },
    { name: 'Salem Collectorate Board', nameT: 'சேலம் ஆட்சியரக வாரியம்', num: '0427-2450301' },
    { name: 'Namakkal Collectorate', nameT: 'நாமக்கல் ஆட்சியரகம்', num: '04286-281100' },
    { name: 'Erode Collectorate Board', nameT: 'ஈரோடு ஆட்சியரக வாரியம்', num: '0424-2260207' },
    { name: 'Tiruppur Control Room', nameT: 'திருப்பூர் கட்டுப்பாட்டு அறை', num: '0421-2971199' },
    { name: 'Nilgiris (Ooty) Control Room', nameT: 'நீலகிரி (ஊட்டி) கட்டுப்பாட்டு அறை', num: '0423-2442222' },
    { name: 'Coimbatore Collectorate', nameT: 'கோயம்புத்தூர் ஆட்சியரகம்', num: '0422-2301114' },
    { name: 'Tiruchirappalli Control Room', nameT: 'திருச்சிராப்பள்ளி கட்டுப்பாட்டு அறை', num: '0431-2418995' },
    { name: 'Karur Control Room', nameT: 'கரூர் கட்டுப்பாட்டு அறை', num: '04324-256306' },
    { name: 'Perambalur Collectorate', nameT: 'பெரம்பலூர் ஆட்சியரகம்', num: '04328-225700' },
    { name: 'Ariyalur Collectorate', nameT: 'அரியலூர் ஆட்சியரகம்', num: '04329-228337' },
    { name: 'Nagapattinam Collectorate', nameT: 'நாகப்பட்டினம் ஆட்சியரகம்', num: '04365-253000' },
    { name: 'Mayiladuthurai Control Room', nameT: 'மயிலாடுதுறை கட்டுப்பாட்டு அறை', num: '04364-222588' },
    { name: 'Tiruvarur Control Room', nameT: 'திருவாரூர் கட்டுப்பாட்டு அறை', num: '04366-223344' },
    { name: 'Thanjavur Control Room', nameT: 'தஞ்சாவூர் கட்டுப்பாட்டு அறை', num: '04362-230102' },
    { name: 'Pudukkottai Control Room', nameT: 'புதுக்கோட்டை கட்டுப்பாட்டு அறை', num: '04322-222207' },
    { name: 'Sivaganga Control Room', nameT: 'சிவகங்கை கட்டுப்பாட்டு அறை', num: '04575-246233' },
    { name: 'Madurai Control Room', nameT: 'மதுரை கட்டுப்பாட்டு அறை', num: '0452-2546160' },
    { name: 'Theni Control Room', nameT: 'தேனி கட்டுப்பாட்டு அறை', num: '04546-261093' },
    { name: 'Dindigul (DM Tahsildar)', nameT: 'திண்டுக்கல் (பேரிடர் தாசில்தார்)', num: '0451-2460320' },
    { name: 'Ramanathapuram Control Room', nameT: 'இராமநாதபுரம் கட்டுப்பாட்டு அறை', num: '04567-230056' },
    { name: 'Virudhunagar Control Room', nameT: 'விருதுநகர் கட்டுப்பாட்டு அறை', num: '04562-252600' },
    { name: 'Thoothukudi Control Room', nameT: 'தூத்துக்குடி கட்டுப்பாட்டு அறை', num: '0461-2340101' },
    { name: 'Tirunelveli Control Room', nameT: 'திருநெல்வேலி கட்டுப்பாட்டு அறை', num: '0462-2501032' },
    { name: 'Tenkasi Control Room', nameT: 'தென்காசி கட்டுப்பாட்டு அறை', num: '04633-290548' },
    { name: 'Kanyakumari Control Room', nameT: 'கன்னியாகுமரி கட்டுப்பாட்டு அறை', num: '04652-279090' },
];

// ─── 4. HILL STATIONS (Western Ghats Rescue) ──────────────────────────────────────
const HILL_STATIONS = [
    { name: 'Ooty (Nilgiris) Police Control', nameT: 'ஊட்டி காவல் கட்டுப்பாடு', num: '0423-2442222', icon: '⛰️' },
    { name: 'Ooty District Hospital', nameT: 'ஊட்டி அரசு மருத்துவமனை', num: '0423-2442212', icon: '🏥' },
    { name: 'Kodaikanal Town Police', nameT: 'கொடைக்கானல் காவல்', num: '04542-241280', icon: '⛰️' },
    { name: 'Kodaikanal Fire Station', nameT: 'கொடைக்கானல் தீயணைப்பு', num: '04542-241101', icon: '🚒' },
    { name: 'Valparai Rescue / Police', nameT: 'வால்பாறை காவல்', num: '04253-222222', icon: '⛰️' },
    { name: 'Munnar (Kerala) Control Room', nameT: 'மூணாறு கட்டுப்பாட்டு அறை', num: '04865-230350', icon: '🌲' },
    { name: 'Wayanad (Kerala) Disaster Cell', nameT: 'வயநாடு பேரிடர் மையம்', num: '04936-204151', icon: '🌲' },
];

// ─── 5. SOUTH INDIAN COASTAL & NEIGHBORING STATES ─────────────────────────────────
const COASTAL_AND_NEIGHBORS = [
    { name: 'Kerala State Disaster Authority', nameT: 'கேரள பேரிடர் ஆணையம்', num: '1077', icon: '🌴' },
    { name: 'Trivandrum City Police HQ', nameT: 'திருவனந்தபுரம் காவல்', num: '0471-2320668', icon: '🚔' },
    { name: 'Kochi Coastal Police', nameT: 'கொச்சி கடலோரக் காவல்', num: '0484-2666061', icon: '⚓' },
    { name: 'AP State Disaster Authority (South)', nameT: 'ஆந்திர பேரிடர் ஆணையம்', num: '1070', icon: '🌊' },
    { name: 'Nellore Coastal Control', nameT: 'நெல்லூர் கட்டுப்பாட்டு', num: '0861-2322300', icon: '⚓' },
    { name: 'Puducherry EOC', nameT: 'புதுச்சேரி EOC', num: '1077', icon: '🏖️' },
];

// ─── 6. HEALTH & HOSPITALS ────────────────────────────────────────────────────────
const HEALTH_HOSPITALS = [
    { name: 'TN Health Ministry Helpline', nameT: 'சுகாதார அமைச்சகம்', num: '104', icon: '🛡️' },
    { name: 'Rajiv Gandhi Govt Hospital (Chennai)', nameT: 'ராஜீவ் காந்தி மருத்துவமனை', num: '044-25301111', icon: '🏥' },
    { name: 'Coimbatore Medical College Hospital', nameT: 'கோயம்புத்தூர் மருத்துவமனை', num: '0422-2301393', icon: '🏥' },
    { name: 'Madurai Rajaji Govt Hospital', nameT: 'மதுரை ராஜாஜி மருத்துவமனை', num: '0452-2532535', icon: '🏥' },
    { name: 'Poison Control Centre', nameT: 'நச்சு கட்டுப்பாடு மையம்', num: '1066', icon: '⚠️' },
    { name: 'Women Helpline / Domestic', nameT: 'பெண்கள் உதவி', num: '1091', icon: '👩' },
];


const CollapsibleSection = ({ title, titleT, icon, iconColor, children, defaultOpen, isTamil }) => {
    const [open, setOpen] = useState(defaultOpen || false);
    return (
        <div className="glass-panel" style={{ border: `1px solid ${iconColor}22`, overflow: 'hidden' }}>
            <button onClick={() => setOpen(!open)} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px',
                background: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer', color: '#fff'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${iconColor}15`, border: `1px solid ${iconColor}44`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>{icon}</div>
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{isTamil ? titleT : title}</p>
                    </div>
                </div>
                {open ? <ChevronUp size={20} color={iconColor} /> : <ChevronDown size={20} color={iconColor} />}
            </button>
            {open && <div style={{ padding: '16px 20px', borderTop: `1px solid ${iconColor}22`, background: 'rgba(0,0,0,0.1)' }}>{children}</div>}
        </div>
    );
};

const HelplineModule = ({ lang }) => {
    const isTamil = lang === 'TA';
    const [search, setSearch] = useState('');

    const filterMatch = (text) => {
        if (!search.trim()) return true;
        return text.toLowerCase().includes(search.toLowerCase());
    };

    // Generic Contact Card Renderer
    const renderContactCard = (c, color = "#00d2ff") => (
        <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: `1px solid ${color}22` }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${color}15`, border: `1px solid ${color}44`, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>{c.icon || <Phone size={16} color={color} />}</div>
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{isTamil ? c.nameT : c.name}</p>
                {c.type && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{c.type}</p>}
            </div>
            <a href={`tel:${c.num}`} style={{ background: `${color}15`, border: `1px solid ${color}`, padding: '7px 16px', borderRadius: '20px', color: color, textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: '0.3s' }} className="hover-electrify">
                <Phone size={14} /> {c.num}
            </a>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Search Header */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 className="thunder-text" style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>
                        {isTamil ? 'பேரிடர் அவசர உதவி எண்கள்' : 'CRITICAL HELPLINE DIRECTORY'}
                    </h2>
                    <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {isTamil ? 'தேசிய, மாநில மற்றும் மாவட்ட நிலை கட்டுப்பாட்டு அறைகள்' : 'National, State, District Control Rooms & City Headquarters'}
                    </p>
                </div>
                <div style={{ position: 'relative', width: '380px' }}>
                    <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        value={search} 
                        onChange={e => setSearch(e.target.value)}
                        placeholder={isTamil ? 'மாவட்டம், மருத்துவமனை, காவல் தேடுங்கள்...' : 'Search District, Hospital, Police, NDRF...'}
                        style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: '8px', outline: 'none', fontSize: '0.9rem' }} 
                    />
                </div>
            </div>

            {/* Content Sections */}
            
            <CollapsibleSection title="National Level & NDRF Contacts" titleT="தேசிய அளவிலான & NDRF தொடர்புகள்" icon={<AlertOctagon size={20} />} iconColor="#ff4d4d" defaultOpen={true} isTamil={isTamil}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '10px' }}>
                    {NATIONAL.filter(c => filterMatch(isTamil ? c.nameT : c.name) || filterMatch(c.num)).map(c => renderContactCard(c, c.color))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Tamil Nadu HQ & Chennai City Police" titleT="தமிழ்நாடு தலைமையகம் & சென்னை காவல்த் துறை" icon={<Building2 size={20} />} iconColor="#a855f7" defaultOpen={true} isTamil={isTamil}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '10px' }}>
                    {TN_STATE_HQ.filter(c => filterMatch(isTamil ? c.nameT : c.name)).map(c => renderContactCard(c, '#a855f7'))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="All 38 Districts of Tamil Nadu (Collectorates)" titleT="தமிழ்நாட்டின் 38 மாவட்ட ஆட்சியரகங்கள்" icon={<MapPin size={20} />} iconColor="#00d2ff" defaultOpen={search !== ''} isTamil={isTamil}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px' }}>
                    {isTamil ? '* குறிப்பு: எந்த மாவட்டத்திலிருந்தும் 1077 ஐ அழைத்தால், அந்தந்த மாவட்ட பேரிடர் கட்டுப்பாட்டு அறைக்கு இணைக்கப்படும்.' : '* Note: Dialing 1077 from any local network aligns directly to that district\'s EOC Collectorate.'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '10px' }}>
                    {TN_DISTRICTS.filter(c => filterMatch(isTamil ? c.nameT : c.name)).map((c, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(0,210,255,0.05)', borderRadius: '8px', border: '1px solid rgba(0,210,255,0.15)' }}>
                            <span style={{ color: '#fff', fontSize: '0.85rem' }}>{isTamil ? c.nameT : c.name}</span>
                            <a href={`tel:${c.num}`} className="hover-electrify" style={{ color: '#00d2ff', textDecoration: 'none', fontWeight: 'bold', padding: '4px 10px', background: 'rgba(0,210,255,0.1)', borderRadius: '12px' }}>{c.num}</a>
                        </div>
                    ))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Hospitals, Health Ministry & Ambulance" titleT="மருத்துவமனைகள் & சுகாதார அமைச்சகம்" icon={<HeartPulse size={20} />} iconColor="#00ff80" defaultOpen={search !== ''} isTamil={isTamil}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '10px' }}>
                    {HEALTH_HOSPITALS.filter(c => filterMatch(isTamil ? c.nameT : c.name)).map(c => renderContactCard(c, '#00ff80'))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Hill Stations (Ooty, Munnar, Kodaikanal)" titleT="மலை வாசஸ்தலங்கள் (ஊட்டி, கொடைக்கானல்)" icon={<Mountain size={20} />} iconColor="#facc15" defaultOpen={search !== ''} isTamil={isTamil}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '10px' }}>
                    {HILL_STATIONS.filter(c => filterMatch(isTamil ? c.nameT : c.name)).map(c => renderContactCard(c, '#facc15'))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Kerala, AP & South Coastal Divisions" titleT="கேரளா, ஆந்திரா & கடலோரப் பகுதிகள்" icon={<Anchor size={20} />} iconColor="#38bdf8" defaultOpen={search !== ''} isTamil={isTamil}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '10px' }}>
                    {COASTAL_AND_NEIGHBORS.filter(c => filterMatch(isTamil ? c.nameT : c.name)).map(c => renderContactCard(c, '#38bdf8'))}
                </div>
            </CollapsibleSection>

        </div>
    );
};

export default HelplineModule;
