import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

function CartModal({ cartItems, onClose, onUpdateQty, onRemove, onCheckout }) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 15000;
    const total = subtotal + shippingCost;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🛒 Keranjang Belanja</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                        <p style={styles.emptyText}>Keranjang belanja Anda kosong.</p>
                        <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '16px' }}>
                            Mulai Belanja
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={styles.itemList}>
                            {cartItems.map((item) => (
                                <div key={item.id} style={styles.cartItem} className="glass-panel">
                                    <img src={item.image} alt={item.name} style={styles.itemImage} />
                                    <div style={styles.itemInfo}>
                                        <h4 style={styles.itemName}>{item.name}</h4>
                                        <p style={styles.itemSeller}>Toko: {item.seller}</p>
                                        <p style={styles.itemPrice}>Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div style={styles.controls}>
                                        <div style={styles.quantityWidget}>
                                            <button 
                                                onClick={() => onUpdateQty(item.id, -1)} 
                                                style={styles.widgetBtn}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span style={styles.quantityVal}>{item.quantity}</span>
                                            <button 
                                                onClick={() => onUpdateQty(item.id, 1)} 
                                                style={styles.widgetBtn}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => onRemove(item.id)} 
                                            style={styles.deleteBtn}
                                            title="Hapus item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={styles.summary} className="glass-panel">
                            <div style={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span>Ongkos Kirim (SOP Hewan Hidup)</span>
                                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                            </div>
                            <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                                <span>Total Bayar</span>
                                <span>Rp {total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <button 
                            className="btn btn-primary" 
                            style={styles.checkoutBtn}
                            onClick={onCheckout}
                        >
                            Lanjut ke Checkout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    emptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
    },
    emptyText: {
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
    },
    itemList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '350px',
        overflowY: 'auto',
        paddingRight: '4px',
        marginBottom: '20px',
    },
    cartItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        gap: '12px',
    },
    itemImage: {
        width: '54px',
        height: '54px',
        objectFit: 'cover',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--glass-border)',
    },
    itemInfo: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    itemName: {
        fontSize: '0.9rem',
        color: 'var(--text-primary)',
        fontWeight: '600',
    },
    itemSeller: {
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
    },
    itemPrice: {
        fontSize: '0.85rem',
        color: 'var(--accent-cyan)',
        fontWeight: '700',
    },
    controls: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
    },
    quantityWidget: {
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--glass-border)',
        padding: '2px',
    },
    widgetBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        transition: 'var(--transition-smooth)',
    },
    quantityVal: {
        fontSize: '0.85rem',
        fontWeight: '600',
        padding: '0 8px',
        color: 'var(--text-primary)',
        minWidth: '20px',
        textAlign: 'center',
    },
    deleteBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--danger)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        borderRadius: '4px',
        transition: 'var(--transition-smooth)',
    },
    summary: {
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '20px',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
    },
    totalRow: {
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '8px',
        marginTop: '4px',
        fontSize: '1.05rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    checkoutBtn: {
        width: '100%',
        padding: '14px',
        fontSize: '1rem',
    }
};

export default CartModal;
