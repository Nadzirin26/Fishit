import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, AlertCircle } from 'lucide-react';

const SUGGESTIONS = [
    { text: "Apakah ikannya ready?", response: "Halo Kak! Ikan hias ini ready, kondisinya sangat aktif dan sehat lincah. Siap diproses masuk karantina." },
    { text: "Apakah aman kirim keluar kota?", response: "Sangat aman Kak! Kami kemas menggunakan plastik ganda, oksigen murni, dan boks styrofoam tebal. Ikan dijamin garansi D.O.A (Dead On Arrival) 100%." },
    { text: "Bisa kirim hari ini?", response: "Untuk ikan hidup, kami wajib melakukan karantina (puasa) minimal 12-24 jam sebelum kirim agar air tidak beracun di jalan. Order hari ini akan dikirim besok ya Kak." },
    { text: "Berapa lama karantinanya?", response: "Proses karantina biasanya butuh waktu 1 hari saja Kak. Ini demi memastikan metabolisme ikan aman selama ekspedisi." }
];

function LiveChatModal({ product, onClose }) {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'partner', text: `Halo! Terima kasih telah menghubungi *${product.seller}*. Ada yang bisa kami bantu mengenai *${product.name}*?`, time: 'Baru saja' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (text) => {
        if (!text.trim()) return;

        // Add user message
        const newMsg = {
            id: Date.now(),
            sender: 'user',
            text: text,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        // Find automatic response
        const match = SUGGESTIONS.find(s => s.text.toLowerCase() === text.toLowerCase());
        const responseText = match 
            ? match.response 
            : `Terima kasih atas pertanyaannya Kak. Admin kami di *${product.seller}* akan segera membalas detail mengenai *${product.name}* secara personal. Untuk respons kilat, Anda juga bisa langsung chat WA kami!`;

        // Simulate typing
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: 'partner',
                    text: responseText,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }, 1200);
    };

    const handleWhatsAppRedirect = () => {
        const textMessage = `Halo ${product.seller}, saya tertarik dengan *${product.name}* di Fishit.`;
        window.open(`https://wa.me/${product.sellerPhone}?text=${encodeURIComponent(textMessage)}`, '_blank');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-sheet" style={styles.chatSheet} onClick={(e) => e.stopPropagation()}>
                {/* Chat Header */}
                <div style={styles.header} className="glass-panel">
                    <div style={styles.sellerInfo}>
                        <div style={styles.avatar}>
                            {product.seller.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 style={styles.sellerName}>{product.seller}</h3>
                            <div style={styles.statusRow}>
                                <span style={styles.statusDot}></span>
                                <small style={styles.statusText}>Aktif (Simulasi Chatbot)</small>
                            </div>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                {/* Info Bar */}
                <div style={styles.infoBar}>
                    <AlertCircle size={14} color="var(--accent-cyan)" />
                    <span>Menanyakan tentang: <strong>{product.name}</strong></span>
                </div>

                {/* Message Display Area */}
                <div className="chat-window" style={{ flexGrow: 1 }}>
                    <div className="chat-messages" style={styles.messagesContainer}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                                <p style={{ margin: 0 }}>{msg.text}</p>
                                <span style={styles.msgTime}>{msg.time}</span>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="chat-bubble partner" style={{ width: 'fit-content' }}>
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Quick suggestions pills */}
                <div style={styles.suggestionsContainer}>
                    {SUGGESTIONS.map((sug, idx) => (
                        <button
                            key={idx}
                            style={styles.sugPill}
                            onClick={() => handleSendMessage(sug.text)}
                            disabled={isTyping}
                        >
                            {sug.text}
                        </button>
                    ))}
                </div>

                {/* Message Input Bar */}
                <div style={styles.inputArea}>
                    <input 
                        type="text" 
                        className="form-control"
                        style={styles.chatInput}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                        placeholder="Tulis pesan..."
                        disabled={isTyping}
                    />
                    <button 
                        onClick={() => handleSendMessage(inputText)} 
                        className="btn btn-primary btn-icon glow-cyan"
                        style={styles.sendBtn}
                        disabled={isTyping}
                    >
                        <Send size={16} />
                    </button>
                    <button 
                        onClick={handleWhatsAppRedirect} 
                        className="btn btn-outline btn-icon"
                        style={styles.waBtn}
                        title="Alihkan ke WhatsApp Resmi"
                    >
                        <MessageCircle size={18} color="var(--whatsapp)" />
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    chatSheet: {
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '0px',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid var(--glass-border)',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderTopLeftRadius: 'var(--radius-lg)',
        borderTopRightRadius: 'var(--radius-lg)',
    },
    sellerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0099ff 100%)',
        color: '#020617',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sellerName: {
        fontSize: '0.95rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    statusRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '2px',
    },
    statusDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: 'var(--success)',
        boxShadow: '0 0 8px var(--success)',
    },
    statusText: {
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
    },
    infoBar: {
        background: 'rgba(0, 240, 255, 0.04)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
    },
    messagesContainer: {
        padding: '16px 20px',
        overflowY: 'auto',
    },
    msgTime: {
        fontSize: '0.65rem',
        color: 'var(--text-secondary)',
        display: 'block',
        textAlign: 'right',
        marginTop: '4px',
    },
    suggestionsContainer: {
        display: 'flex',
        gap: '6px',
        padding: '10px 20px',
        overflowX: 'auto',
        borderTop: '1px solid var(--glass-border)',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
    },
    sugPill: {
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--glass-border)',
        background: 'rgba(255, 255, 255, 0.02)',
        color: 'var(--text-secondary)',
        fontSize: '0.75rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
    },
    inputArea: {
        padding: '16px 20px 24px 20px',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
    },
    chatInput: {
        flexGrow: 1,
        borderRadius: 'var(--radius-md)',
    },
    sendBtn: {
        borderRadius: 'var(--radius-md)',
    },
    waBtn: {
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(37, 211, 102, 0.05)',
        border: '1px solid var(--glass-border)',
    }
};

export default LiveChatModal;
