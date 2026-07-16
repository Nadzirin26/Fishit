import React from 'react';
import { X, Mail, Phone, ShieldCheck, LogOut, Package, ExternalLink } from 'lucide-react';

function ProfileModal({ currentUser, orders, onClose, onLogout }) {
    // Determine membership badge
    const getMembershipBadge = (orderCount) => {
        if (orderCount >= 5) return { label: 'Gold Member', class: 'badge-cyan', style: { color: '#ffd700', border: '1px solid #ffd700', background: 'rgba(255,215,0,0.1)' } };
        if (orderCount >= 2) return { label: 'Silver Member', class: 'badge-cyan', style: { color: '#c0c0c0', border: '1px solid #c0c0c0', background: 'rgba(192,192,192,0.1)' } };
        return { label: 'Bronze Member', class: 'badge-cyan', style: { color: '#cd7f32', border: '1px solid #cd7f32', background: 'rgba(205,127,50,0.1)' } };
    };

    const badge = getMembershipBadge(orders.length);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-sheet" style={styles.sheet} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Profil Pengguna</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <div style={styles.profileHeader} className="glass-panel">
                    <div style={styles.avatar}>
                        {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.headerInfo}>
                        <h3 style={styles.name}>{currentUser.name}</h3>
                        <span className="badge" style={badge.style}>
                            {badge.label}
                        </span>
                    </div>
                </div>

                <div style={styles.detailsList} className="glass-panel">
                    <div style={styles.detailItem}>
                        <Mail size={16} color="var(--accent-cyan)" />
                        <div style={styles.detailText}>
                            <small>Email</small>
                            <p>{currentUser.email}</p>
                        </div>
                    </div>

                    <div style={styles.detailItem}>
                        <Phone size={16} color="var(--accent-cyan)" />
                        <div style={styles.detailText}>
                            <small>Nomor Telepon</small>
                            <p>{currentUser.phone}</p>
                        </div>
                    </div>

                    <div style={styles.detailItem}>
                        <ShieldCheck size={16} color="var(--accent-cyan)" />
                        <div style={styles.detailText}>
                            <small>Status Akun</small>
                            <p style={{ color: 'var(--success)', fontWeight: '600' }}>Terverifikasi (SSL)</p>
                        </div>
                    </div>
                </div>

                {/* Riwayat Pesanan */}
                <div style={styles.historySection}>
                    <h4 style={styles.sectionTitle}>
                        <Package size={16} style={{ marginRight: '6px' }} />
                        Riwayat Transaksi ({orders.length})
                    </h4>
                    
                    {orders.length === 0 ? (
                        <p style={styles.emptyHistory}>Belum ada riwayat transaksi belanja.</p>
                    ) : (
                        <div style={styles.ordersList}>
                            {orders.map((order) => (
                                <div key={order.id} style={styles.orderCard} className="glass-panel">
                                    <div style={styles.orderHeader}>
                                        <span style={styles.orderId}>{order.id}</span>
                                        <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div style={styles.orderBody}>
                                        <p style={styles.orderItemsCount}>
                                            {order.items.reduce((s, i) => s + i.quantity, 0)} Item ikan hias
                                        </p>
                                        <p style={styles.orderPrice}>
                                            Total: Rp {order.total.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <div style={styles.orderFooter}>
                                        <small style={{ color: 'var(--text-muted)' }}>
                                            {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={onLogout} className="btn btn-secondary" style={styles.logoutBtn}>
                    <LogOut size={16} />
                    <span>Keluar dari Akun</span>
                </button>
            </div>
        </div>
    );
}

const styles = {
    sheet: {
        maxHeight: '90vh',
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        marginBottom: '16px',
    },
    avatar: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0099ff 100%)',
        color: '#020617',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
    },
    headerInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    name: {
        fontSize: '1.25rem',
        color: 'var(--text-primary)',
        fontWeight: '700',
    },
    detailsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        marginBottom: '20px',
    },
    detailItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
    },
    detailText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
    },
    detailTextsmall: {
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
    },
    detailTextp: {
        fontSize: '0.9rem',
        fontWeight: '500',
        color: 'var(--text-primary)',
    },
    historySection: {
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '0.95rem',
        color: 'var(--text-primary)',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
    },
    emptyHistory: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        padding: '16px 0',
    },
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '160px',
        overflowY: 'auto',
        paddingRight: '2px',
    },
    orderCard: {
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
    },
    orderId: {
        fontSize: '0.8rem',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: 'var(--accent-cyan)',
    },
    orderBody: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        marginBottom: '4px',
    },
    orderPrice: {
        fontWeight: '600',
        color: 'var(--accent-coral)',
    },
    orderFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    logoutBtn: {
        width: '100%',
        padding: '12px',
        fontSize: '0.95rem',
    }
};

export default ProfileModal;
