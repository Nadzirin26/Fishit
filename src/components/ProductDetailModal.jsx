import React, { useState } from 'react';
import { X, Star, ShoppingCart, MessageCircle, Thermometer, Droplet, ShieldCheck, HeartPulse } from 'lucide-react';

function ProductDetailModal({ product, currentUser, onClose, onAddToCart, onAddReview, onLoginPrompt, onChatClick, showToast }) {
    const [activeTab, setActiveTab] = useState('info'); // 'info' | 'acclimate' | 'reviews'
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');

    const handleAddToCart = () => {
        onAddToCart(product);
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!currentUser) {
            onLoginPrompt();
            return;
        }
        if (reviewText.trim() === '') {
            if (showToast) showToast('Silakan tulis ulasan terlebih dahulu.', 'danger');
            return;
        }

        onAddReview(reviewRating, reviewText);
        setReviewText('');
        setReviewRating(5);
    };

    const renderStars = (ratingValue, size = 14) => {
        return (
            <div className="stars-container">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={size} 
                        fill={i < Math.round(ratingValue) ? "var(--accent-gold)" : "transparent"} 
                        color={i < Math.round(ratingValue) ? "var(--accent-gold)" : "var(--text-muted)"} 
                    />
                ))}
            </div>
        );
    };

    // Get Care Specs based on fish type
    const getSpecs = (prod) => {
        const defaultSpecs = { temp: '24°C - 28°C', ph: '6.5 - 7.5', diet: 'Pelet & Cacing Sutra', care: 'Mudah' };
        if (prod.category === 'cupang') return { temp: '24°C - 30°C', ph: '6.2 - 7.2', diet: 'Jentik Nyamuk, Kutu Air', care: 'Mudah' };
        if (prod.category === 'discus') return { temp: '28°C - 31°C', ph: '6.0 - 6.8', diet: 'Cacing Darah, Burger Jantung Sapi', care: 'Sedang (Butuh Kestabilan)' };
        if (prod.category === 'arowana') return { temp: '26°C - 30°C', ph: '6.5 - 7.0', diet: 'Jangkrik, Ulat Jerman, Kelabang', care: 'Sedang (Butuh Tank Besar)' };
        if (prod.category === 'koi') return { temp: '18°C - 25°C', ph: '7.0 - 8.0', diet: 'Pelet Premium, Sayuran', care: 'Mudah' };
        return defaultSpecs;
    };

    const specs = getSpecs(product);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-sheet" style={styles.sheet} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Detail Ikan Hias</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                {/* Hero Image & Brand Card */}
                <div style={styles.heroSection}>
                    <img src={product.image} alt={product.name} style={styles.heroImage} />
                    {product.tag && (
                        <div style={styles.tagBadge} className={product.tag === 'Rare' ? 'badge badge-coral' : 'badge badge-cyan'}>
                            {product.tag}
                        </div>
                    )}
                </div>

                <div style={styles.titleRow}>
                    <div>
                        <h3 style={styles.productName}>{product.name}</h3>
                        <p style={styles.productSeller}>Penjual: <strong>{product.seller}</strong></p>
                    </div>
                    <div style={styles.price}>{`Rp ${product.price.toLocaleString('id-ID')}`}</div>
                </div>

                {/* Tabs Selector */}
                <div className="modal-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Informasi
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'acclimate' ? 'active' : ''}`}
                        onClick={() => setActiveTab('acclimate')}
                    >
                        Panduan Adaptasi (SOP)
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Ulasan ({product.reviews})
                    </button>
                </div>

                {/* Tab Contents */}
                <div style={styles.tabContent}>
                    {activeTab === 'info' && (
                        <div style={styles.infoTab}>
                            <h4 style={styles.sectionTitle}>Deskripsi</h4>
                            <p style={styles.descriptionText}>
                                Ikan hias {product.name} kualitas pilihan dari seller {product.seller}. 
                                Dipilih dengan cermat untuk memastikan keaktifan, keserasian warna, dan kesehatan fisik sebelum masuk karantina pengiriman. 
                                Dilindungi asuransi pengiriman Dead On Arrival (D.O.A) 100%.
                            </p>

                            <h4 style={styles.sectionTitle}>Spesifikasi Pemeliharaan</h4>
                            <div style={styles.specsGrid}>
                                <div style={styles.specItem} className="glass-panel">
                                    <Thermometer size={16} color="var(--accent-cyan)" />
                                    <div>
                                        <small>Suhu Ideal</small>
                                        <p>{specs.temp}</p>
                                    </div>
                                </div>
                                <div style={styles.specItem} className="glass-panel">
                                    <Droplet size={16} color="var(--accent-cyan)" />
                                    <div>
                                        <small>Tingkat pH Air</small>
                                        <p>{specs.ph}</p>
                                    </div>
                                </div>
                                <div style={styles.specItem} className="glass-panel">
                                    <HeartPulse size={16} color="var(--accent-cyan)" />
                                    <div>
                                        <small>Tingkat Kesulitan</small>
                                        <p>{specs.care}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'acclimate' && (
                        <div style={styles.acclimateTab}>
                            <div style={styles.sopAlert}>
                                <HeartPulse size={18} color="var(--accent-coral)" style={{ flexShrink: 0 }} />
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                    <strong>PENTING:</strong> Jangan langsung memasukkan ikan ke akuarium! Ikuti SOP aklimatisasi ini agar ikan tidak mati terkejut (*pH/Osmotic Shock*).
                                </p>
                            </div>

                            <div style={styles.stepList}>
                                <div style={styles.stepItem}>
                                    <span style={styles.stepNum}>1</span>
                                    <div>
                                        <h5 style={styles.stepTitle}>Penyamaan Suhu (Temperatur)</h5>
                                        <p style={styles.stepText}>Apungkan kantong plastik berisi ikan (tanpa dibuka) di dalam akuarium selama 15 - 20 menit agar suhu air di dalam kantong sama dengan akuarium.</p>
                                    </div>
                                </div>
                                <div style={styles.stepItem}>
                                    <span style={styles.stepNum}>2</span>
                                    <div>
                                        <h5 style={styles.stepTitle}>Penyamaan pH (Kadar Air)</h5>
                                        <p style={styles.stepText}>Buka kantong plastik. Masukkan sedikit air akuarium (sekitar 10-20% volume kantong) secara berkala setiap 5 menit agar ikan bisa menyesuaikan diri dengan kondisi pH air baru.</p>
                                    </div>
                                </div>
                                <div style={styles.stepItem}>
                                    <span style={styles.stepNum}>3</span>
                                    <div>
                                        <h5 style={styles.stepTitle}>Pelepasan Ikan</h5>
                                        <p style={styles.stepText}>Gunakan saringan net untuk mengambil ikannya saja dan lepaskan ke akuarium secara perlahan. **JANGAN** memasukkan air bekas kantong pengiriman ke dalam akuarium Anda!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div style={styles.reviewsTab}>
                            {/* Summary Stars Header */}
                            <div style={styles.reviewsSummary} className="glass-panel">
                                <h3 style={styles.largeRating}>{product.rating}</h3>
                                <div>
                                    {renderStars(product.rating, 16)}
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        Berdasarkan {product.reviews} ulasan pembeli
                                    </p>
                                </div>
                            </div>

                            {/* Reviews list */}
                            <div style={styles.reviewList}>
                                {product.reviewsData.length === 0 ? (
                                    <p style={styles.noReviewText}>Belum ada ulasan untuk ikan ini. Yuk tulis ulasan pertamamu!</p>
                                ) : (
                                    product.reviewsData.map((rev, index) => (
                                        <div key={index} style={styles.reviewCard} className="glass-panel">
                                            <div style={styles.revHeader}>
                                                <span style={styles.revUser}>{rev.user}</span>
                                                {renderStars(rev.rating)}
                                            </div>
                                            <p style={styles.revText}>{rev.text}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Review Form */}
                            <div style={styles.addReviewBox} className="glass-panel">
                                <h5 style={{ marginBottom: '10px' }}>Tulis Ulasan Anda</h5>
                                {currentUser ? (
                                    <form onSubmit={handleSubmitReview} style={styles.form}>
                                        <div className="form-group" style={{ marginBottom: '8px' }}>
                                            <label style={{ fontSize: '0.75rem' }}>Beri Bintang</label>
                                            <select 
                                                className="form-control" 
                                                style={styles.ratingSelect}
                                                value={reviewRating}
                                                onChange={(e) => setReviewRating(Number(e.target.value))}
                                            >
                                                <option value="5">⭐⭐⭐⭐⭐ 5 Bintang</option>
                                                <option value="4">⭐⭐⭐⭐ 4 Bintang</option>
                                                <option value="3">⭐⭐⭐ 3 Bintang</option>
                                                <option value="2">⭐⭐ 2 Bintang</option>
                                                <option value="1">⭐ 1 Bintang</option>
                                            </select>
                                        </div>
                                        <div className="form-group" style={{ marginBottom: '12px' }}>
                                            <label style={{ fontSize: '0.75rem' }}>Ulasan Tertulis</label>
                                            <textarea 
                                                className="form-control"
                                                rows="2"
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                placeholder="Tulis ulasan mengenai kesehatan ikan..."
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>
                                            Kirim Ulasan
                                        </button>
                                    </form>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Login untuk menulis ulasan.</p>
                                        <button onClick={onLoginPrompt} className="btn btn-outline" style={{ marginTop: '8px', padding: '6px 12px', fontSize: '0.75rem' }}>
                                            Masuk Akun
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action Buttons */}
                <div style={styles.actionFooter}>
                    <button 
                        onClick={() => onChatClick(product)} 
                        style={styles.footerChatBtn} 
                        className="btn btn-outline glow-cyan"
                    >
                        <MessageCircle size={18} color="var(--accent-cyan)" />
                        <span>Tanya Penjual</span>
                    </button>
                    <button 
                        onClick={handleAddToCart} 
                        style={styles.footerBuyBtn} 
                        className="btn btn-primary"
                    >
                        <ShoppingCart size={18} />
                        <span>Tambah ke Keranjang</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    sheet: {
        maxHeight: '94vh',
    },
    heroSection: {
        width: '100%',
        height: '220px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '16px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--card-shadow)',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    tagBadge: {
        position: 'absolute',
        top: '12px',
        left: '12px',
    },
    titleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    productName: {
        fontSize: '1.25rem',
        color: 'var(--text-primary)',
        fontWeight: '700',
    },
    productSeller: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        marginTop: '2px',
    },
    price: {
        fontSize: '1.35rem',
        fontWeight: '700',
        color: 'var(--accent-coral)',
    },
    tabContent: {
        minHeight: '260px',
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '8px',
        marginTop: '16px',
    },
    descriptionText: {
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
    },
    specsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginTop: '10px',
    },
    specItem: {
        padding: '10px 8px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '6px',
    },
    specItemIcon: {
        marginBottom: '4px',
    },
    specItemp: {
        fontSize: '0.75rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    specItemhtml: {
        fontSize: '0.65rem',
        color: 'var(--text-secondary)',
    },
    sopAlert: {
        display: 'flex',
        gap: '10px',
        padding: '12px',
        background: 'rgba(255, 83, 118, 0.05)',
        border: '1px solid rgba(255, 83, 118, 0.2)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px',
        alignItems: 'center',
    },
    stepList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    stepItem: {
        display: 'flex',
        gap: '12px',
    },
    stepNum: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'var(--accent-cyan)',
        color: '#020617',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    stepTitle: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        marginBottom: '2px',
    },
    stepText: {
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
    },
    reviewsSummary: {
        padding: '14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px',
    },
    largeRating: {
        fontSize: '2.2rem',
        fontWeight: '700',
        color: 'var(--accent-cyan)',
        lineHeight: '1',
    },
    reviewList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '180px',
        overflowY: 'auto',
        marginBottom: '16px',
        paddingRight: '2px',
    },
    reviewCard: {
        padding: '10px 12px',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(255,255,255,0.01)',
    },
    revHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
    },
    revUser: {
        fontSize: '0.8rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    revText: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
    },
    noReviewText: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        padding: '20px 0',
    },
    addReviewBox: {
        padding: '14px',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)',
    },
    ratingSelect: {
        fontSize: '0.85rem',
        padding: '8px 12px',
        height: 'auto',
        background: 'var(--bg-primary)',
    },
    actionFooter: {
        display: 'flex',
        gap: '10px',
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '16px',
    },
    footerChatBtn: {
        flexGrow: 1,
        padding: '12px 14px',
        fontSize: '0.85rem',
        backgroundColor: 'transparent',
    },
    footerBuyBtn: {
        flexGrow: 2,
        padding: '12px 18px',
        fontSize: '0.85rem',
    }
};

export default ProductDetailModal;
