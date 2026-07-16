import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';

function ReviewsModal({ product, currentUser, onClose, onAddReview, onLoginPrompt, showToast }) {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!currentUser) return;
        if (text.trim() === '') {
            if (showToast) showToast('Silakan tulis ulasan terlebih dahulu.', 'danger');
            return;
        }

        onAddReview(rating, text);
        setText('');
        setRating(5);
    };

    const renderStars = (count) => {
        return (
            <div className="stars-container">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={14} 
                        fill={i < count ? "var(--accent-gold)" : "transparent"} 
                        color={i < count ? "var(--accent-gold)" : "var(--text-muted)"} 
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Ulasan Produk</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <div style={styles.productHeader} className="glass-panel">
                    <img src={product.image} alt={product.name} style={styles.productImage} />
                    <div>
                        <h3 style={styles.productName}>{product.name}</h3>
                        <p style={styles.productSeller}>Penjual: {product.seller}</p>
                        <div style={styles.ratingInfo}>
                            {renderStars(Math.round(product.rating))}
                            <span style={styles.ratingScore}>{product.rating} / 5.0</span>
                        </div>
                    </div>
                </div>

                <div style={styles.reviewsListContainer}>
                    <h4 style={styles.sectionTitle}>💬 Ulasan Pembeli ({product.reviewsData.length})</h4>
                    {product.reviewsData.length === 0 ? (
                        <div style={styles.emptyReviews}>
                            <MessageSquare size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
                            <p>Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan!</p>
                        </div>
                    ) : (
                        <div style={styles.reviewsList}>
                            {product.reviewsData.map((rev, index) => (
                                <div key={index} style={styles.reviewItem} className="glass-panel">
                                    <div style={styles.reviewHeader}>
                                        <span style={styles.reviewUser}>{rev.user}</span>
                                        {renderStars(rev.rating)}
                                    </div>
                                    <p style={styles.reviewText}>{rev.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={styles.addReviewSection} className="glass-panel">
                    <h4 style={{ ...styles.sectionTitle, marginBottom: '12px' }}>Tulis Ulasan Anda</h4>
                    {currentUser ? (
                        <form onSubmit={handleSubmit} style={styles.reviewForm}>
                            <div className="form-group" style={{ marginBottom: '12px' }}>
                                <label>Rating Bintang</label>
                                <select 
                                    value={rating} 
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="form-control"
                                    style={styles.ratingSelect}
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ 5 Bintang (Sangat Puas)</option>
                                    <option value="4">⭐⭐⭐⭐ 4 Bintang (Puas)</option>
                                    <option value="3">⭐⭐⭐ 3 Bintang (Cukup)</option>
                                    <option value="2">⭐⭐ 2 Bintang (Kurang Puas)</option>
                                    <option value="1">⭐ 1 Bintang (Buruk)</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label>Ulasan Anda</label>
                                <textarea 
                                    className="form-control"
                                    rows="3"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Bagikan pengalaman Anda mengenai kualitas ikan, packing, atau keaktifan ikan saat dilepas..."
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Kirim Ulasan
                            </button>
                        </form>
                    ) : (
                        <div style={styles.loginPrompt}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                Anda harus masuk log terlebih dahulu untuk dapat mengirimkan ulasan.
                            </p>
                            <button 
                                onClick={onLoginPrompt}
                                className="btn btn-outline"
                                style={{ marginTop: '10px', fontSize: '0.8rem', padding: '8px 16px' }}
                            >
                                Masuk ke Akun Anda
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    productHeader: {
        display: 'flex',
        gap: '16px',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        marginBottom: '20px',
        alignItems: 'center',
    },
    productImage: {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--glass-border)',
    },
    productName: {
        fontSize: '1rem',
        color: 'var(--text-primary)',
        fontWeight: '600',
    },
    productSeller: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        marginBottom: '4px',
    },
    ratingInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    ratingScore: {
        fontSize: '0.8rem',
        color: 'var(--text-primary)',
        fontWeight: '600',
    },
    reviewsListContainer: {
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '0.95rem',
        color: 'var(--text-primary)',
        fontWeight: '600',
        marginBottom: '10px',
    },
    emptyReviews: {
        textAlign: 'center',
        padding: '24px 10px',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
    },
    reviewsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: '180px',
        overflowY: 'auto',
        paddingRight: '2px',
    },
    reviewItem: {
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        backgroundColor: 'rgba(255,255,255,0.01)',
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
    },
    reviewUser: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--accent-cyan)',
    },
    reviewText: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
    },
    addReviewSection: {
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
    },
    reviewForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    ratingSelect: {
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        backgroundSize: '16px',
        paddingRight: '40px',
    },
    loginPrompt: {
        textAlign: 'center',
        padding: '10px 0',
    }
};

export default ReviewsModal;
