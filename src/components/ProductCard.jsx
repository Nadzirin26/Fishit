import React, { useState } from 'react';
import { Star, ShoppingCart, MessageCircle, Heart, ShieldCheck, MapPin } from 'lucide-react';

function ProductCard({ product, onAddToCart, onOpenReviews, onChatClick, isWishlisted, onToggleWishlist }) {
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        onAddToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        if (onToggleWishlist) {
            onToggleWishlist(product.id);
        }
    };

    const handleChatClick = (e) => {
        e.stopPropagation();
        if (onChatClick) {
            onChatClick(product);
        } else {
            const message = `Halo ${product.seller}, saya tertarik dengan *${product.name}* di Fishit. Apakah stoknya ready?`;
            const waLink = `https://wa.me/${product.sellerPhone}?text=${encodeURIComponent(message)}`;
            window.open(waLink, '_blank');
        }
    };

    return (
        <div style={styles.card} className="product-card" onClick={() => onOpenReviews(product.id)}>
            {/* Top Badges & Wishlist Heart */}
            <div style={styles.topBar}>
                {product.tag ? (
                    <span className={product.tag === 'Rare' ? 'badge badge-coral' : 'badge badge-cyan'}>
                        {product.tag}
                    </span>
                ) : (
                    <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <ShieldCheck size={12} /> D.O.A
                    </span>
                )}

                <button 
                    onClick={handleWishlistClick}
                    style={{
                        ...styles.wishlistBtn,
                        backgroundColor: isWishlisted ? '#fef2f2' : 'rgba(255, 255, 255, 0.9)',
                        borderColor: isWishlisted ? '#fecaca' : '#e2e8f0',
                    }}
                    title={isWishlisted ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                    aria-label="Wishlist"
                >
                    <Heart 
                        size={16} 
                        fill={isWishlisted ? '#ef4444' : 'transparent'} 
                        color={isWishlisted ? '#ef4444' : '#64748b'} 
                    />
                </button>
            </div>
            
            {/* Fish Image */}
            <div style={styles.imageContainer}>
                <img src={product.image} alt={product.name} style={styles.image} loading="lazy" />
            </div>

            {/* Content Info */}
            <div style={styles.content}>
                <div style={styles.sellerRow}>
                    <MapPin size={12} color="var(--text-muted)" />
                    <span style={styles.sellerName}>{product.seller}</span>
                </div>

                <h3 style={styles.title} title={product.name}>{product.name}</h3>
                
                {/* Rating & Sold count */}
                <div style={styles.ratingRow}>
                    <Star size={13} fill="var(--accent-gold)" color="var(--accent-gold)" />
                    <span style={styles.ratingText}>{product.rating}</span>
                    <span style={styles.bullet}>•</span>
                    <span style={styles.salesText}>{product.reviews * 2}+ terjual</span>
                </div>

                {/* Price */}
                <div style={styles.priceRow}>
                    <span style={styles.price}>
                        Rp {product.price.toLocaleString('id-ID')}
                    </span>
                </div>

                {/* Action Buttons */}
                <div style={styles.actions}>
                    <button 
                        onClick={handleAddToCart} 
                        style={{
                            ...styles.buyBtn,
                            backgroundColor: isAdded ? 'var(--success)' : 'var(--brand-primary)'
                        }} 
                        className="btn btn-primary"
                        disabled={isAdded}
                    >
                        <ShoppingCart size={15} />
                        <span>{isAdded ? 'Dimasukkan!' : '+ Keranjang'}</span>
                    </button>
                    
                    <button 
                        onClick={handleChatClick} 
                        style={styles.chatBtn} 
                        className="btn btn-outline"
                        title="Tanya Penjual"
                    >
                        <MessageCircle size={16} color="var(--brand-primary)" />
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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    topBar: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wishlistBtn: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '1px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    },
    imageContainer: {
        width: '100%',
        height: '180px',
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.4s ease',
    },
    content: {
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flexGrow: 1,
    },
    sellerRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
    },
    sellerName: {
        color: 'var(--text-secondary)',
        fontWeight: '500',
    },
    title: {
        fontSize: '0.96rem',
        color: 'var(--text-primary)',
        fontWeight: '600',
        lineHeight: '1.35',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: '2.6em',
    },
    ratingRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '0.76rem',
        marginTop: '2px',
    },
    ratingText: {
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    bullet: {
        color: 'var(--text-muted)',
    },
    salesText: {
        color: 'var(--text-secondary)',
    },
    priceRow: {
        margin: '4px 0 6px 0',
    },
    price: {
        fontSize: '1.15rem',
        fontWeight: '800',
        color: 'var(--brand-secondary)',
        letterSpacing: '-0.01em',
    },
    actions: {
        display: 'flex',
        gap: '6px',
        marginTop: 'auto',
    },
    buyBtn: {
        flexGrow: 1,
        padding: '8px 12px',
        fontSize: '0.82rem',
        borderRadius: 'var(--radius-md)',
    },
    chatBtn: {
        width: '36px',
        height: '36px',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #cbd5e1',
        background: '#ffffff',
    }
};

export default ProductCard;
