import React, { useState } from 'react';
import { Star, ShoppingCart, MessageCircle } from 'lucide-react';

function ProductCard({ product, onAddToCart, onOpenReviews, onChatClick }) {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        onAddToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    const handleWhatsAppClick = (e) => {
        e.stopPropagation();
        if (onChatClick) {
            onChatClick(product);
        } else {
            const message = `Halo ${product.seller}, saya tertarik dengan salah satu produk ikan Anda: *${product.name}* di Fishit. Apakah masih tersedia?`;
            const waLink = `https://wa.me/${product.sellerPhone}?text=${encodeURIComponent(message)}`;
            window.open(waLink, '_blank');
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const rounded = Math.round(rating * 2) / 2;
        for (let i = 1; i <= 5; i++) {
            if (i <= rounded) {
                stars.push(<Star key={i} size={14} fill="var(--accent-gold)" color="var(--accent-gold)" />);
            } else if (i - 0.5 === rounded) {
                // half star simulated by filling partially or just outline with half intensity
                stars.push(<Star key={i} size={14} fill="url(#halfStar)" color="var(--accent-gold)" />);
            } else {
                stars.push(<Star key={i} size={14} color="var(--text-muted)" />);
            }
        }
        return (
            <div className="stars-container">
                {/* SVG gradient definition for half star */}
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                        <linearGradient id="halfStar" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="50%" stopColor="var(--accent-gold)" />
                            <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                </svg>
                {stars}
            </div>
        );
    };

    return (
        <div style={styles.card} className="glass-panel">
            {product.tag && (
                <div style={styles.tagBadge} className={product.tag === 'Rare' ? 'badge badge-coral' : 'badge badge-cyan'}>
                    {product.tag}
                </div>
            )}
            
            <div style={styles.imageContainer}>
                <img src={product.image} alt={product.name} style={styles.image} />
            </div>

            <div style={styles.content}>
                <h3 style={styles.title}>{product.name}</h3>
                <p style={styles.seller}>Oleh: <strong style={styles.sellerName}>{product.seller}</strong></p>
                
                <div style={styles.ratingRow} onClick={() => onOpenReviews(product.id)} title="Klik untuk lihat ulasan">
                    {renderStars(product.rating)}
                    <span style={styles.ratingText}>{product.rating} ({product.reviews} Ulasan)</span>
                </div>

                <div style={styles.price}>
                    Rp {product.price.toLocaleString('id-ID')}
                </div>

                <div style={styles.actions}>
                    <button 
                        onClick={handleAddToCart} 
                        style={{
                            ...styles.buyBtn,
                            backgroundColor: isAdded ? 'var(--success)' : 'var(--accent-cyan)'
                        }} 
                        className="btn btn-primary"
                        disabled={isAdded}
                    >
                        <ShoppingCart size={16} />
                        {isAdded ? 'Berhasil!' : 'Beli Sekarang'}
                    </button>
                    
                    <button 
                        onClick={handleWhatsAppClick} 
                        style={styles.chatBtn} 
                        className="btn btn-outline"
                        title="Chat WhatsApp Penjual"
                    >
                        <MessageCircle size={18} color="var(--whatsapp)" />
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: {
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'var(--transition-smooth)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    tagBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    },
    imageContainer: {
        width: '100%',
        height: '190px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s ease',
    },
    content: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexGrow: 1,
    },
    title: {
        fontSize: '1.1rem',
        color: 'var(--text-primary)',
        fontWeight: '600',
        lineHeight: '1.3',
    },
    seller: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
    },
    sellerName: {
        color: 'var(--text-primary)',
        fontWeight: '500',
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '4px 0',
    },
    ratingText: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        textDecoration: 'underline',
    },
    price: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'var(--accent-coral)',
        margin: '4px 0',
    },
    actions: {
        display: 'flex',
        gap: '8px',
        marginTop: 'auto',
    },
    buyBtn: {
        flexGrow: 1,
        padding: '10px 16px',
        fontSize: '0.85rem',
        transition: 'all 0.2s ease',
    },
    chatBtn: {
        width: '42px',
        height: '42px',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        backgroundColor: 'rgba(37, 211, 102, 0.05)',
        cursor: 'pointer',
    }
};

export default ProductCard;
