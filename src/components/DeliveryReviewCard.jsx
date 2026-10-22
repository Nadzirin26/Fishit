import React, { useState } from 'react';
import { Star, CheckCircle, AlertTriangle, MessageSquare, Send, Edit3, MessageCircle } from 'lucide-react';

const QUICK_TAGS = [
    '⚡ Pengiriman Kilat',
    '📦 Boks Rapi & Anti Bocor',
    '🛵 Kurir Hati-hati & Sopan',
    '💧 Air Tetap Dingin & Bersih',
    '🫁 Oksigen Masih Penuh'
];

function DeliveryReviewCard({ order, onSaveReview, showToast }) {
    const existing = order.deliveryReview;
    const [isEditing, setIsEditing] = useState(!existing);
    
    // Form state
    const [fishCondition, setFishCondition] = useState(existing?.fishCondition || 'safe'); // 'safe' | 'damaged'
    const [courierRating, setCourierRating] = useState(existing?.courierRating || 5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState(existing?.courierReview || '');
    const [selectedTags, setSelectedTags] = useState(existing?.quickTags || []);

    const getRatingLabel = (score) => {
        if (score === 5) return 'Sangat Puas & Kurir Hati-hati';
        if (score === 4) return 'Puas, Pengiriman Baik';
        if (score === 3) return 'Cukup Baik';
        if (score === 2) return 'Kurang Memuaskan';
        return 'Sangat Lambat / Kurang Hati-hati';
    };

    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const reviewData = {
            courierRating,
            fishCondition,
            courierReview: reviewText.trim() || 'Pelayanan pengiriman baik.',
            quickTags: selectedTags,
            reviewedAt: new Date().toISOString()
        };

        onSaveReview(order.id, reviewData);
        setIsEditing(false);

        if (fishCondition === 'damaged') {
            if (showToast) showToast('Laporan kendala diterima. Admin akan menghubungi Anda untuk klaim garansi D.O.A.', 'info');
        } else {
            if (showToast) showToast('Terima kasih atas ulasan pengiriman dan kondisi ikan Anda!', 'success');
        }
    };

    const handleContactDOA = () => {
        const text = `Halo Admin Fishit, saya ingin mengklaim Garansi D.O.A untuk pesanan #${order.id}. Kondisi ikan tiba ada yang lemas/mati. Berikut saya lampirkan video unboxing.`;
        window.open(`https://wa.me/628123456789?text=${encodeURIComponent(text)}`, '_blank');
    };

    // If review already submitted and not in edit mode, show completed view
    if (existing && !isEditing) {
        return (
            <div style={styles.reviewedContainer}>
                <div style={styles.reviewedHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={18} color="var(--success)" />
                        <h4 style={styles.reviewedTitle}>Penilaian Pengiriman & Kondisi Ikan</h4>
                    </div>
                    <button 
                        onClick={() => setIsEditing(true)} 
                        style={styles.editBtn}
                        className="btn btn-outline"
                    >
                        <Edit3 size={13} />
                        <span>Ubah</span>
                    </button>
                </div>

                {/* Condition Result Badge */}
                <div style={{
                    ...styles.conditionBadgeBox,
                    background: existing.fishCondition === 'safe' ? '#f0fdf4' : '#fff7ed',
                    borderColor: existing.fishCondition === 'safe' ? '#bbf7d0' : '#fed7aa',
                }}>
                    {existing.fishCondition === 'safe' ? (
                        <>
                            <span style={{ fontSize: '1.2rem' }}>🐠</span>
                            <div>
                                <strong style={{ color: '#16a34a', fontSize: '0.86rem', display: 'block' }}>
                                    100% Ikan Tiba dengan Selamat & Sehat
                                </strong>
                                <small style={{ color: '#475569', fontSize: '0.74rem' }}>
                                    Semua ikan aktif berenang dan siap diaklimatisasi ke akuarium.
                                </small>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertTriangle size={20} color="#ea580c" style={{ flexShrink: 0 }} />
                            <div style={{ flexGrow: 1 }}>
                                <strong style={{ color: '#ea580c', fontSize: '0.86rem', display: 'block' }}>
                                    Kendala D.O.A (Ada Ikan Mati / Lemas)
                                </strong>
                                <small style={{ color: '#475569', fontSize: '0.74rem' }}>
                                    Garansi D.O.A berlaku. Kirim video unboxing ke tim CS kami.
                                </small>
                                <button 
                                    onClick={handleContactDOA} 
                                    className="btn btn-secondary"
                                    style={styles.csBtn}
                                >
                                    <MessageCircle size={14} />
                                    <span>Klaim Garansi D.O.A via WA</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Rating & Review details */}
                <div style={styles.reviewDetails}>
                    <div style={styles.starsRow}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    size={16} 
                                    fill={star <= existing.courierRating ? "var(--accent-gold)" : "transparent"} 
                                    color={star <= existing.courierRating ? "var(--accent-gold)" : "#cbd5e1"} 
                                />
                            ))}
                        </div>
                        <span style={styles.ratingNumber}>({existing.courierRating}/5)</span>
                        <span style={styles.ratingDesc}>• {getRatingLabel(existing.courierRating)}</span>
                    </div>

                    {existing.quickTags && existing.quickTags.length > 0 && (
                        <div style={styles.tagChipsList}>
                            {existing.quickTags.map((t, idx) => (
                                <span key={idx} style={styles.tagChipActive}>{t}</span>
                            ))}
                        </div>
                    )}

                    {existing.courierReview && (
                        <p style={styles.commentText}>
                            "{existing.courierReview}"
                        </p>
                    )}

                    <small style={styles.timestamp}>
                        Dinilai pada {new Date(existing.reviewedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                    </small>
                </div>
            </div>
        );
    }

    // Interactive Form View
    return (
        <div style={styles.formCard}>
            <div style={styles.formHeader}>
                <h4 style={styles.headerTitle}>
                    ⭐ Penilaian Pengiriman & Kondisi Ikan
                </h4>
                <p style={styles.headerSubtitle}>
                    Bantu kami menjaga kualitas mitra kurir dan pastikan ikan Anda sampai dalam keadaan sehat.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* 1. Kondisi Ikan Saat Tiba */}
                <div style={styles.fieldSection}>
                    <label style={styles.fieldLabel}>
                        1. Bagaimana Kondisi Ikan Saat Paket Dibuka? <span style={{ color: 'var(--brand-secondary)' }}>*</span>
                    </label>
                    <div style={styles.conditionOptions}>
                        <div 
                            onClick={() => setFishCondition('safe')}
                            style={{
                                ...styles.conditionCard,
                                borderColor: fishCondition === 'safe' ? '#16a34a' : '#e2e8f0',
                                backgroundColor: fishCondition === 'safe' ? '#f0fdf4' : '#ffffff',
                            }}
                        >
                            <span style={{ fontSize: '1.4rem' }}>🐠</span>
                            <div>
                                <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: fishCondition === 'safe' ? '#16a34a' : 'var(--text-primary)' }}>
                                    Ikan Selamat & Sehat
                                </h5>
                                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    Semua ikan lincah, air bersih, kantong utuh tidak bocor.
                                </p>
                            </div>
                        </div>

                        <div 
                            onClick={() => setFishCondition('damaged')}
                            style={{
                                ...styles.conditionCard,
                                borderColor: fishCondition === 'damaged' ? '#ea580c' : '#e2e8f0',
                                backgroundColor: fishCondition === 'damaged' ? '#fff7ed' : '#ffffff',
                            }}
                        >
                            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
                            <div>
                                <h5 style={{ fontSize: '0.85rem', fontWeight: '700', color: fishCondition === 'damaged' ? '#ea580c' : 'var(--text-primary)' }}>
                                    Ada Kendala / Ikan Mati
                                </h5>
                                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    Ikan mati/lemas atau kantong rusak. (Klaim Garansi D.O.A)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Rating Bintang Kurir */}
                <div style={styles.fieldSection}>
                    <label style={styles.fieldLabel}>
                        2. Nilai Pelayanan Kurir Ekspedisi <span style={{ color: 'var(--brand-secondary)' }}>*</span>
                    </label>
                    <div style={styles.starPicker}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isFilled = (hoverRating || courierRating) >= star;
                                return (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setCourierRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        style={styles.starBtn}
                                    >
                                        <Star 
                                            size={26} 
                                            fill={isFilled ? "var(--accent-gold)" : "transparent"} 
                                            color={isFilled ? "var(--accent-gold)" : "#cbd5e1"} 
                                        />
                                    </button>
                                );
                            })}
                        </div>
                        <span style={styles.starFeedback}>
                            {getRatingLabel(hoverRating || courierRating)}
                        </span>
                    </div>
                </div>

                {/* 3. Quick Tag Chips */}
                <div style={styles.fieldSection}>
                    <label style={{ ...styles.fieldLabel, marginBottom: '6px' }}>
                        Pilihan Cepat (Opsional)
                    </label>
                    <div style={styles.tagChipsGrid}>
                        {QUICK_TAGS.map((tag, idx) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <button
                                    type="button"
                                    key={idx}
                                    onClick={() => handleTagToggle(tag)}
                                    style={{
                                        ...styles.chipBtn,
                                        backgroundColor: isSelected ? 'var(--brand-primary-light)' : '#f8fafc',
                                        borderColor: isSelected ? 'var(--brand-primary)' : '#e2e8f0',
                                        color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                                        fontWeight: isSelected ? '700' : '500',
                                    }}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 4. Textarea Ulasan */}
                <div style={styles.fieldSection}>
                    <label style={styles.fieldLabel}>
                        3. Ulasan Tertulis untuk Jasa Pengiriman
                    </label>
                    <textarea 
                        className="form-control"
                        rows="2"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Contoh: Kurir mengantar dengan sangat hati-hati, paket berstiker hewan hidup dijaga baik..."
                        style={{ fontSize: '0.84rem' }}
                    />
                </div>

                {/* Action Buttons */}
                <div style={styles.actionRow}>
                    {existing && (
                        <button 
                            type="button" 
                            onClick={() => setIsEditing(false)} 
                            className="btn btn-outline"
                            style={{ padding: '9px 14px', fontSize: '0.82rem' }}
                        >
                            Batal
                        </button>
                    )}
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        style={{ flexGrow: 1, padding: '10px 18px', fontSize: '0.86rem' }}
                    >
                        <Send size={15} />
                        <span>Kirim Penilaian Pengiriman</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    formCard: {
        background: '#ffffff',
        border: '1px solid #ccfbf1',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 16px',
        marginTop: '16px',
        boxShadow: '0 4px 14px rgba(13, 148, 136, 0.08)',
    },
    formHeader: {
        marginBottom: '16px',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '10px',
    },
    headerTitle: {
        fontSize: '0.96rem',
        fontWeight: '800',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    headerSubtitle: {
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        marginTop: '3px',
        lineHeight: '1.4',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    fieldSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    fieldLabel: {
        fontSize: '0.82rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    conditionOptions: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
    },
    conditionCard: {
        border: '1.5px solid #e2e8f0',
        borderRadius: 'var(--radius-md)',
        padding: '12px 10px',
        cursor: 'pointer',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        transition: 'var(--transition-smooth)',
    },
    starPicker: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
    },
    starBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px',
        transition: 'transform 0.15s ease',
    },
    starFeedback: {
        fontSize: '0.8rem',
        fontWeight: '600',
        color: 'var(--brand-primary)',
    },
    tagChipsGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
    },
    chipBtn: {
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-full)',
        padding: '5px 10px',
        fontSize: '0.74rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    actionRow: {
        display: 'flex',
        gap: '10px',
        marginTop: '4px',
    },
    reviewedContainer: {
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginTop: '16px',
        boxShadow: 'var(--card-shadow)',
    },
    reviewedHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '8px',
    },
    reviewedTitle: {
        fontSize: '0.88rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    editBtn: {
        padding: '4px 10px',
        fontSize: '0.74rem',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: 'var(--radius-sm)',
    },
    conditionBadgeBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid',
        marginBottom: '12px',
    },
    csBtn: {
        marginTop: '8px',
        padding: '6px 12px',
        fontSize: '0.74rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: 'var(--radius-sm)',
    },
    reviewDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    starsRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    ratingNumber: {
        fontWeight: '700',
        fontSize: '0.84rem',
        color: 'var(--text-primary)',
    },
    ratingDesc: {
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
    },
    tagChipsList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
    },
    tagChipActive: {
        background: 'var(--brand-primary-light)',
        border: '1px solid var(--brand-primary-border)',
        color: 'var(--brand-primary)',
        fontSize: '0.7rem',
        fontWeight: '600',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
    },
    commentText: {
        fontSize: '0.82rem',
        color: 'var(--text-primary)',
        fontStyle: 'italic',
        lineHeight: '1.45',
        background: '#f8fafc',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid #f1f5f9',
    },
    timestamp: {
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
    }
};

export default DeliveryReviewCard;
