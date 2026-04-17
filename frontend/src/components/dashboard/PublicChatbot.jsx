import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Zap } from 'lucide-react';

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────
const KB = [
    {
        keys: ['shelter', 'camp', 'safe camp', 'உறைவிடம்', 'முகாம்', 'பாதுகாப்பு', 'தங்குமிடம்'],
        reply: `🏠 **பாதுகாப்பு முகாம்கள் / Safe Camps:**
• சென்னை: நந்தனம் உள்விளையாட்டரங்கம், ஸ்தலபதி விஜய் செய்தி மண்டபம்
• தாம்பரம்: தாம்பரம் வணிக அரங்கம்
• புதுச்சேரி: இந்திரா காந்தி விளையாட்டரங்கம்
• கடலூர்: மாவட்ட ஆட்சியர் வளாகம்
📞 **முகாம் தகவல்:** 1070 / 1077`
    },
    {
        keys: ['flood', 'வெள்ளம்', 'நீர் அபாயம்', 'மழை', 'rain', 'நிலத்தடி', 'water'],
        reply: `🌊 **வெள்ள பாதுகாப்பு / Flood Safety:**
• ஆழமான நீரில் நடக்க வேண்டாம் / Never walk through floodwater
• மின் சாதனங்களை OFF செய்யவும் / Turn off electricity at main switch
• மேல் தளம் அல்லது கூரையில் ஏறவும் / Go to upper floors or rooftop
• 🚨 அவசர எண்: **108** (Ambulance), **1070** (TNSDMA)
• படகு மீட்பு: NDRF **011-24363260**`
    },
    {
        keys: ['cyclone', 'storm', 'புயல்', 'சூறாவளி', 'hurricane', 'wind'],
        reply: `🌀 **புயல் நேர நெறிமுறை / Cyclone Protocol:**
• உறுதியான கட்டிடத்தில் தங்கவும் / Stay in a sturdy building
• ஜன்னல்கள், கதவுகள் மூடவும் / Secure all windows and doors
• மரங்கள், மின்கம்பங்கள் அருகே செல்ல வேண்டாம்
• IMD எச்சரிக்கைகளை கண்காணிக்கவும் / Monitor IMD alerts
• 📻 All India Radio: 100.1 FM`
    },
    {
        keys: ['food', 'உணவு', 'ration', 'ரேஷன்', 'hungry', 'பசி', 'eat'],
        reply: `🍚 **உணவு நிவாரணம் / Food Relief:**
• அருகிலுள்ள பாதுகாப்பு முகாமில் உணவு கிடைக்கும்
• CM Relief: **044-25671010**
• Red Cross: **011-23716441**
• NSS மற்றும் NGO உதவி: மாவட்ட கட்டுப்பாட்டு அறை — **1077**
• உலர் உணவு: ORS, Biscuits, Rice இருக்கும்`
    },
    {
        keys: ['medicine', 'মেডিসিন', 'மருத்துவம்', 'hospital', 'மருத்துவமனை', 'ambulance', 'first aid', 'முதலுதவி'],
        reply: `🩺 **மருத்துவ உதவி / Medical Aid:**
• 📞 Ambulance: **108**
• உங்கள் மாவட்ட அரசு மருத்துவமனையை அழைக்கவும்
• CPR: 30 நெஞ்சு அமுக்கம் + 2 மூச்சு ஊதல்
• ORS கலவை: 1L தண்ணீர் + 6 தேக்கரண்டி சர்க்கரை + 1/2 தேக்கரண்டி உப்பு
• பாம்பு கடி: கட்டி போட வேண்டாம், உடனே **108** அழைக்கவும்`
    },
    {
        keys: ['volunteer', 'தன்னார்வலர்', 'help', 'உதவி', 'ndrf', 'nss', 'rescue'],
        reply: `🤝 **தன்னார்வலர் மற்றும் மீட்பு / Volunteer & Rescue:**
• NDRF: **011-24363260**
• NSS: ndrf.gov.in
• உங்கள் தன்னார்வலர் தகவல்: Volunteer Module → Check In
• உடனடி மீட்பு: **1078** (National Disaster Helpline)
• State TNSDMA: **1070**`
    },
    {
        keys: ['police', 'காவல்', 'crime', 'குற்றம்', 'theft', 'attack'],
        reply: `🚔 **காவல் உதவி / Police:**
• Emergency: **100**
• Chennai Commissioner: **044-23452390**
• Women Helpline: **181**
• Child Helpline: **1098**
• Coast Guard: **1554**`
    },
    {
        keys: ['fire', 'தீ', 'burn', 'எரிகிறது', 'smoke', 'புகை'],
        reply: `🔥 **தீ அணைப்பு / Fire Emergency:**
• 📞 Fire Service: **101**
• மின்சார தீக்கு நீர் ஊற்ற வேண்டாம்
• புகையில் தரையில் ஊர்ந்து செல்லவும்
• CO2 Extinguisher அல்லது மணல் பயன்படுத்தவும்
• வெளியேறும்போது கதவுகளை மூடவும்`
    },
    {
        keys: ['landslide', 'நிலச்சரிவு', 'mud', 'hill', 'மலை', 'wayanad'],
        reply: `🏔️ **நிலச்சரிவு பாதுகாப்பு / Landslide Safety:**
• மலைப்பகுதிகளில் கனமழையில் வெளியேறவும்
• சரிவுக்கு எதிர் திசையில் ஓடவும்
• அதிர்வு / சத்தம் கேட்டால் உடனே ஓடவும்
• **NDRF: 011-24363260**
• District Control: **1077**`
    },
    {
        keys: ['helpline', 'உதவி எண்', 'number', 'contact', 'தொடர்பு', 'call'],
        reply: `📞 **முக்கிய உதவி எண்கள் / Key Helplines:**
| தேசிய / National | எண் |
|---|---|
| 🚨 Disaster | 1078 |
| 🚑 Ambulance | 108 |
| 🚔 Police | 100 |
| 🚒 Fire | 101 |
| 👩 Women | 181 |
| ⚓ Coast Guard | 1554 |
| 🏛️ TNSDMA | 1070 |`
    },
    {
        keys: ['weather', 'temperature', 'rain', 'forecast', 'வானிலை'],
        reply: `🌦️ **வானிலை தகவல் / Weather Info:**
• IMD: imd.gov.in / **044-28276147**
• Cyclone Warning Centre Vizag: **0891-2552592**
• Live Radar: நமது Disaster Info Module → Weather Radar தாவல் திறக்கவும்
• ரேடியோ: All India Radio 100.1 FM`
    },
    {
        keys: ['baysafe', 'website', 'how to use', 'பயன்படுத்துவது', 'app', 'portal', 'தளம்'],
        reply: `🌐 **BaySafe தளம் பற்றி / About BaySafe:**
BaySafe என்பது ஒருங்கிணைந்த பேரிடர் மேலாண்மை தளம்.
• **Social Feed:** மீட்பு கோரிக்கைகள் மற்றும் தன்னார்வலர்களின் நேரடி நிலை.
• **Weather Analysis:** நேரடி கடல் மற்றும் கடலோர அச்சுறுத்தல் கண்காணிப்பு.
• **Disaster Info:** நடப்பு புயல் / வெள்ள அபாய அறிவிப்புகள்.
• **SafeCamp Locator:** அருகிலுள்ள நிவாரண முகாம்கள்.
• **Helpline & Chatbot:** அவசர தொடர்பு எண்கள் மற்றும் AI உதவி.`
    },
    {
        keys: ['rescue request', 'sos', 'உதவி கேட்பது', 'மீட்பு கோரிக்கை', 'help me', 'stuck', 'மாட்டிக்கொண்டேன்'],
        reply: `🆘 **மீட்பு கோரிக்கை பதிவு செய்தல் / Requesting Rescue:**
1. Social Feed அல்லது முகப்பு பக்கத்தில் **Request Rescue / அவசர உதவி** கிளிக் செய்யவும்.
2. உங்கள் இடம் (Location), நிலைமை (Situation), தேவையான பொருட்கள் (Needs) ஆகியவற்றை நிரப்பவும்.
3. Submit செய்தால், அருகிலுள்ள *Verified Volunteers* உங்கள் கோரிக்கையை ஏற்பார்கள்.
4. Social Feed-ல் உங்கள் கோரிக்கை 'PENDING' இலிருந்து 'ONGOING' என மாறும்.`
    },
    {
        keys: ['volunteer portal', 'join rescue', 'how to volunteer', 'தன்னார்வலராக', 'check in', 'தன்னார்வலர் பதிவு'],
        reply: `🤝 **தன்னார்வலராக இணைதல் / Volunteer Protocols:**
1. **Volunteer Hub**-ல் பதிவு செய்யவும் (Passcode: volunteer123).
2. திறன்கள், மருத்துவ உபகரணங்கள் (Med Kit) விவரங்களை நிரப்பவும்.
3. **Check-In** செய்வதன் மூலம் நீங்கள் மீட்பு பணியில் உள்ளதாக Social Feed-ல் '🟢 Available' என தோன்றும்.
4. பொதுமக்கள் பதிவிடும் SOS கோரிக்கைகளை Accept செய்து மீட்பு பணியை தொடங்கலாம்.`
    },
    {
        keys: ['dms protocol', 'management', 'நெறிமுறைகள்', 'வழிமுறைகள்', 'rescue workflow', 'protocol', 'dms'],
        reply: `📋 **DMS மீட்பு நெறிமுறைகள் / Rescue Protocols:**
• **Phase 1 (Alert):** வானிலை ரேடார் (Threat Matrix) மூலம் அபாயம் முன்கூட்டியே கணிக்கப்படுகிறது.
• **Phase 2 (Evacuation):** மக்கள் SafeCamp-க்கு மாற்றப்படுவார்கள்.
• **Phase 3 (SOS Dispatch):** SOS கோரிக்கை வந்ததும், அந்த பகுதியின் தன்னார்வலருக்கு Task ஒதுக்கப்படும்.
• **Phase 4 (Resolution):** நபர் மீட்கப்பட்டவுடன் Task 'CLOSED' மற்றும் 'RESOLVED' செய்யப்படும்.`
    },
    {
        keys: ['weather radar', 'radar', 'threat matrix', 'climate'],
        reply: `📡 **வானிலை தளம் & Threat Matrix:**
• BaySafe ஆனது தென்னிந்திய கடலோர (Coromandel, Malabar, Gulf of Mannar) தரவுகளை 2 நிமிடத்திற்கு ஒருமுறை ஒத்திசைக்கிறது.
• **AI Threat Matrix** ஆட்டோமேட்டிக்காக காற்றின் வேகம், மழைப்பொழிவு ஆகியவற்றை ஆராய்ந்து அபாய எச்சரிக்கைகளை (CRITICAL/HIGH/LOW) வழங்கும்.`
    }
];

const QUICK_QUESTIONS = [
    { q: 'how to use baysafe', qt: 'தளம் பயன்பாடு' },
    { q: 'request rescue', qt: 'மீட்பு கோரிக்கை' },
    { q: 'volunteer portal', qt: 'தன்னார்வலர் பதிவு' },
    { q: 'dms rescue protocol', qt: 'மீட்பு நெறிமுறைகள்' },
    { q: 'Safe camps near me', qt: 'முகாம்கள்' },
    { q: 'cyclone protocol', qt: 'புயல் நெறிமுறை' },
    { q: 'helpline numbers', qt: 'உதவி எண்கள்' },
    { q: 'medical aid', qt: 'மருத்துவ உதவி' },
];

const WELCOME = {
    sender: 'bot',
    text: `👋 **வணக்கம்! BaySafe உதவி நிலையம் / Welcome to BaySafe Helpbot**

நான் பேரிடர் நேரத்தில் உங்களுக்கு உடனடி தகவல்கள் வழங்க இங்கே இருக்கிறேன்.
*I am here to provide you with instant disaster information.*

கீழே உள்ள கேள்வி பொத்தான்களைக் கிளிக் செய்யவும் அல்லது நேரடியாக தட்டச்சு செய்யவும்:
*Click the quick questions below or type your query:*`
};

const getReply = (input) => {
    const lower = input.toLowerCase();
    for (const item of KB) {
        if (item.keys.some(k => lower.includes(k.toLowerCase()))) {
            return item.reply;
        }
    }
    return `🔍 **தகவல் கிடைக்கவில்லை / Not found**

உங்கள் கேள்வியை மீண்டும் வேறு வார்த்தைகளில் கேட்கவும். / Please rephrase your query.

நீங்கள் கேட்கலாம்: baysafe, rescue request, dms protocol, volunteer, flood, cyclone, shelter, food, medicine...

அல்லது நேரடியாக அழைக்கவும்: **1078** (தேசிய பேரிடர் உதவி / National Disaster Helpline)`;
};

// Simple markdown-ish renderer for the bot
const BotText = ({ text }) => (
    <div style={{ fontSize: '0.87rem', lineHeight: '1.7', color: '#fff', whiteSpace: 'pre-wrap' }}>
        {text.split('\n').map((line, i) => {
            // Bold
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
                <p key={i} style={{ margin: '2px 0' }}>
                    {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: '#00d2ff' }}>{p}</strong> : p)}
                </p>
            );
        })}
    </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const PublicChatbot = () => {
    const [messages, setMessages] = useState([WELCOME]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const endRef = useRef();

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const pushBot = (text) => {
        setTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'bot', text }]);
            setTyping(false);
        }, 700);
    };

    const handleSend = (q) => {
        const query = q || input.trim();
        if (!query) return;
        setMessages(prev => [...prev, { sender: 'user', text: query }]);
        setInput('');
        pushBot(getReply(query));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Header */}
            <div className="glass-panel" style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="awareness-btn flex-center" style={{ width: '54px', height: '54px', borderRadius: '14px', flexShrink: 0 }}>
                    <Bot size={28} color="var(--electric-blue)" />
                </div>
                <div>
                    <h2 className="thunder-text hover-shine" style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>BaySafe பொது உதவி நிலையம் / Public Help Bot</h2>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        AI-Powered Emergency Assistance & Guidance in Tamil & English
                    </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,255,128,0.1)', border: '1px solid #00ff80', padding: '4px 14px', borderRadius: '20px' }}>
                    <span style={{ width: '7px', height: '7px', background: '#00ff80', borderRadius: '50%' }}></span>
                    <span style={{ color: '#00ff80', fontSize: '0.78rem', fontWeight: 'bold' }}>LIVE / நேரலை</span>
                </div>
            </div>

            {/* Quick Questions */}
            <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 10px 0' }}>⚡ விரைவு கேள்விகள் / Quick Questions:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {QUICK_QUESTIONS.map((q, i) => (
                        <button key={i} onClick={() => handleSend(q.q)}
                            style={{ padding: '6px 14px', background: 'rgba(0,210,255,0.1)', border: '1px solid rgba(0,210,255,0.3)', color: 'var(--electric-blue)', borderRadius: '20px', cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.25s' }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(0,210,255,0.25)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(0,210,255,0.1)'}>
                            {q.qt} / {q.q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '540px', border: '1px solid rgba(0,210,255,0.2)', overflow: 'hidden' }}>

                {/* Messages */}
                <div className="sidebar-scroll" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                            {msg.sender === 'bot' && (
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,210,255,0.15)', border: '1px solid rgba(0,210,255,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                                    <Bot size={18} color="var(--electric-blue)" />
                                </div>
                            )}
                            <div style={{
                                maxWidth: '75%', padding: '12px 16px', borderRadius: msg.sender === 'bot' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                                background: msg.sender === 'bot' ? 'rgba(0,210,255,0.08)' : 'rgba(0,0,0,0.4)',
                                border: `1px solid ${msg.sender === 'bot' ? 'rgba(0,210,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                            }}>
                                {msg.sender === 'bot' ? <BotText text={msg.text} /> : (
                                    <p style={{ margin: 0, color: '#fff', fontSize: '0.9rem' }}>{msg.text}</p>
                                )}
                            </div>
                            {msg.sender === 'user' && (
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,204,0,0.15)', border: '1px solid rgba(255,204,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                                    <User size={18} color="#ffcc00" />
                                </div>
                            )}
                        </div>
                    ))}
                    {typing && (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,210,255,0.15)', border: '1px solid rgba(0,210,255,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Bot size={18} color="var(--electric-blue)" />
                            </div>
                            <div style={{ display: 'flex', gap: '5px', padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: 'rgba(0,210,255,0.08)', border: '1px solid rgba(0,210,255,0.2)' }}>
                                {[0, 1, 2].map(j => (
                                    <span key={j} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--electric-blue)', opacity: 0.6, animation: `pulse ${0.8 + j * 0.2}s infinite` }}></span>
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                {/* Input */}
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    style={{ display: 'flex', padding: '14px', borderTop: '1px solid rgba(0,210,255,0.15)', background: 'rgba(0,0,0,0.4)', gap: '10px' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0 14px', gap: '8px' }}>
                        <Zap size={16} color="var(--electric-blue)" />
                        <input value={input} onChange={e => setInput(e.target.value)}
                            placeholder="வெள்ளம், புயல், உதவி எண்… / Ask about flood, cyclone, contacts…"
                            style={{ flex: 1, background: 'none', border: 'none', color: '#fff', padding: '12px 0', outline: 'none', fontSize: '0.9rem' }} />
                    </div>
                    <button type="submit" style={{
                        padding: '0 20px', background: 'rgba(0,210,255,0.2)', border: '1px solid var(--electric-blue)',
                        color: 'var(--electric-blue)', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold'
                    }}>
                        <Send size={18} /> அனுப்பு
                    </button>
                </form>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'center', margin: 0 }}>
                ⚠️ இந்த Bot NDRF, IMD & TNSDMA தகவல்களின் அடிப்படையில் செயல்படுகிறது. அவசர நிலையில் **108** அல்லது **1078** அழைக்கவும்.
            </p>
        </div>
    );
};

export default PublicChatbot;
