import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, Info } from 'lucide-react';

// Hardcoded NDRF Bot Responses
const KNOWLEDGE_BASE_EN = {
    "hello": "Greetings Volunteer. I am the BaySafe Tactical NDRF Bot. How can I assist your deployment today?",
    "hi": "Greetings Volunteer. I am the BaySafe Tactical NDRF Bot. How can I assist your deployment today?",
    "protocol": "NDRF Protocol 4A: Always secure yourself before attempting a water rescue. Use standard issue life jackets. Group evacuations must be tethered. Do you need specific medical protocol?",
    "chennai": "Chennai Status: 4 major zones inundated. Velachery (Severe), Pallikaranai (Severe), Mudichur (Critical). 12 Active SafeCamps. Water levels rising at 2cm/hr. Proceed with extreme caution.",
    "puducherry": "Puducherry Status: Coastal warnings in effect. Storm surge expected. Evacuate all assets within 500m of the shoreline immediately.",
    "tuticorin": "Tuticorin Status: Heavy rains subsiding. Focus on debris clearing and supplying dry rations to the northern sectors.",
    "cpr": "CPR Protocol: Verify scene safety. Check responsiveness. Call for medical backup. Begin chest compressions at 100-120 per min, 2 inches deep. 30 compressions to 2 breaths.",
    "boat": "Evacuation Boats are currently stationed at: 1. Velachery Main Rd, 2. Tambaram ORR. Present your Volunteer ID at the checkpoint for asset release.",
    "default": "Command not recognized in tactical database. Please ask about 'chennai', 'puducherry', 'tuticorin', 'protocol', 'cpr', or 'boat' locations."
};

const KNOWLEDGE_BASE_TA = {
    "hello": "வணக்கம் தன்னார்வலரே. நான் பே சேஃப் தந்திரோபாய NDRF போட். இன்று உங்கள் பணிக்கு நான் எவ்வாறு உதவ முடியும்?",
    "hi": "வணக்கம் தன்னார்வலரே. நான் பே சேஃப் தந்திரோபாய NDRF போட். இன்று உங்கள் பணிக்கு நான் எவ்வாறு உதவ முடியும்?",
    "protocol": "NDRF நெறிமுறை 4A: நீர் மீட்புக்கு முன் எப்போதும் உங்களைப் பாதுகாத்துக் கொள்ளுங்கள். தரமான லைஃப் ஜாக்கெட் பயன்படுத்தவும். குழு வெளியேற்றம் இணைக்கப்பட வேண்டும். உங்களுக்கு மருத்துவ நெறிமுறை தேவையா?",
    "chennai": "சென்னை நிலை: 4 முக்கிய மண்டலங்கள் வெள்ளத்தில் மூழ்கியுள்ளன. வேளச்சேரி (தீவிரம்), பள்ளிக்கரணை (தீவிரம்), முடிச்சூர் (மிகவும் முக்கியம்). 12 பாதுகாப்பான முகாம்கள் உள்ளன. நீரின் மட்டம் மணிக்கு 2 செ.மீ உயர்கிறது. மிகுந்த எச்சரிக்கையுடன் செயல்படவும்.",
    "puducherry": "புதுச்சேரி நிலை: கடலோர எச்சரிக்கைகள் நடைமுறையில் உள்ளன. அலைச்சீற்றம் எதிர்பார்க்கப்படுகிறது. கடற்கரையிலிருந்து 500மீ தூரத்திற்குள் உள்ள அனைத்து சொத்துகளையும் உடனடியாக வெளியேற்றவும்.",
    "tuticorin": "தூத்துக்குடி நிலை: பலத்த மழை குறைகிறது. வடக்கு மண்டலங்களுக்கு உலர் ரேஷன் பொருட்களை வழங்குதல் மற்றும் இடிபாடுகளை அகற்றுவதில் கவனம் செலுத்துங்கள்.",
    "cpr": "CPR நெறிமுறை: பாதுகாப்பை சரிபார்க்கவும். பதிலைச் சரிபார்க்கவும். மருத்துவ உதவிக்கு அழைக்கவும். நிமிடத்திற்கு 100-120 முறை, 2 அங்குல ஆழத்தில் மார்பு நெருக்குதல் செய்யவும். 30 நெருக்குதல்களுக்கு 2 சுவாசங்கள்.",
    "boat": "வெளியேற்ற படகுகள் தற்போது நிறுத்தப்பட்டுள்ள இடங்கள்: 1. வேளச்சேரி மெயின் ரோடு, 2. தாம்பரம் ORR. செக்பாயிண்டில் உங்கள் தன்னார்வலர் அடையாள அட்டையை சமர்ப்பிக்கவும்.",
    "default": "கட்டளை அங்கீகரிக்கப்படவில்லை. 'சென்னை', 'புதுச்சேரி', 'தூத்துக்குடி', 'நெறிமுறை', 'CPR' அல்லது 'படகு' பற்றி கேட்கவும்."
};

const VolunteerChatbot = () => {
    const isTamil = localStorage.getItem('lang') === 'TA';
    const KB = isTamil ? KNOWLEDGE_BASE_TA : KNOWLEDGE_BASE_EN;

    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: isTamil
                ? 'பாதுகாப்பான இணைப்பு ஏற்படுத்தப்பட்டது. பே சேஃப் தந்திரோபாய போட் ஆன்லைனில் உள்ளது. NDRF நெறிமுறைகள், CPR அல்லது மண்டல நிலைகள் (சென்னை/புதுச்சேரி/தூத்துக்குடி) பற்றி என்னிடம் கேட்கவும்.'
                : 'Secure line established. BaySafe Tactical Bot online. Ask me about NDRF protocols, CPR, or operational zone statuses (Chennai/Puducherry/Tuticorin).'
        }
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');

        // Simple Bot Logic
        setTimeout(() => {
            const lowerMsg = userMsg.toLowerCase();
            let reply = KB["default"];

            // Search knowledge base for keywords
            for (const key in KB) {
                if (key !== 'default' && lowerMsg.includes(key)) {
                    reply = KB[key];
                    break;
                }
            }

            setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
        }, 800);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '600px', border: '1px solid rgba(0, 255, 128, 0.3)', borderRadius: '12px', overflow: 'hidden' }}>

            {/* Bot Header */}
            <div style={{ background: 'rgba(0, 50, 20, 0.8)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 255, 128, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="pin-pulse" style={{ width: '35px', height: '35px', background: 'rgba(0, 255, 128, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%' }}>
                        <Bot size={20} color="#00ff80" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, color: 'var(--volunteer-green)' }}>{isTamil ? 'NDRF தந்திரோபாய AI' : 'NDRF Tactical AI'}</h3>
                        <p style={{ margin: 0, color: '#00ff80', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '8px', height: '8px', background: '#00ff80', borderRadius: '50%', display: 'inline-block' }}></span> {isTamil ? 'பாதுகாப்பான இணைப்பு' : 'Active Secure Link'}
                        </p>
                    </div>
                </div>
                <button title="Bot Info" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <ShieldAlert size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="sidebar-scroll" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', background: 'rgba(0,0,0,0.3)', overflowY: 'auto' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start', gap: '10px'
                    }}>
                        {/* Avatar */}
                        {msg.sender === 'bot' ? (
                            <div style={{ background: 'rgba(0, 255, 128, 0.1)', border: '1px solid var(--volunteer-green)', padding: '8px', borderRadius: '50%' }}>
                                <Bot size={16} color="var(--volunteer-green)" />
                            </div>
                        ) : (
                            <div style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #fff', padding: '8px', borderRadius: '50%' }}>
                                <User size={16} color="#fff" />
                            </div>
                        )}

                        {/* Bubble */}
                        <div style={{
                            background: msg.sender === 'user' ? 'rgba(0, 210, 255, 0.15)' : 'rgba(0, 255, 128, 0.1)',
                            border: `1px solid ${msg.sender === 'user' ? 'rgba(0, 210, 255, 0.3)' : 'rgba(0, 255, 128, 0.3)'}`,
                            color: '#fff', padding: '12px 16px', borderRadius: '12px',
                            borderTopLeftRadius: msg.sender === 'bot' ? 0 : '12px',
                            borderTopRightRadius: msg.sender === 'user' ? 0 : '12px',
                            maxWidth: '75%', fontSize: '0.95rem', lineHeight: '1.5'
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ display: 'flex', padding: '15px', background: 'rgba(0,0,0,0.6)', borderTop: '1px solid rgba(0, 255, 128, 0.3)' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isTamil ? "தரவுத்தளத்தில் தேடுக (எ.கா: சென்னை நிலை, CPR)..." : "Query NDRF Database (e.g., Chennai status, CPR protocol)..."}
                    style={{
                        flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', padding: '12px 15px', borderRadius: '8px 0 0 8px', outline: 'none'
                    }}
                />
                <button type="submit" className="btn-shimmer-green flex-center" style={{ padding: '0 20px', borderRadius: '0 8px 8px 0' }}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default VolunteerChatbot;
