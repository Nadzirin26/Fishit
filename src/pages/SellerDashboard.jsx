import React, { useState } from 'react';
import { DollarSign, Inbox, Percent, PlusCircle, CheckCircle, Package } from 'lucide-react';

function SellerDashboard({ orders, products, onUpdateOrderStatus, onAddProduct, showToast }) {
    // Form state for adding new product
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('guppy');
    const [tag, setTag] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('https://images.unsplash.com/photo-1544924492-8084f17da3d2?w=500'); // default guppy

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!name || !price) {
            if (showToast) showToast('Nama dan harga produk wajib diisi.', 'danger');
            return;
        }

        const newProd = {
            id: Date.now(),
            name,
            seller: "Toko Air Sehat (Anda)",
            price: Number(price),
            rating: 5.0,
            reviews: 0,
            image,
            sellerPhone: '628123456789',
            tag: tag || null,
            category,
            reviewsData: []
        };

        onAddProduct(newProd);
        
        // Reset form
        setName('');
        setPrice('');
        setTag('');
        setDescription('');
        if (showToast) showToast(`Ikan ${name} berhasil didaftarkan ke toko!`, 'success');
    };

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const activeOrders = orders.filter(order => order.status !== 'Tiba di Tujuan');
    
    // Order status workflow
    const getNextStatus = (currentStatus) => {
        if (currentStatus === 'Pesanan Diterima') return 'Karantina & Kemas';
        if (currentStatus === 'Karantina & Kemas') return 'Diserahkan ke Kurir';
        if (currentStatus === 'Diserahkan ke Kurir') return 'Dalam Perjalanan';
        if (currentStatus === 'Dalam Perjalanan') return 'Tiba di Tujuan';
        return null;
    };

    const getBtnLabel = (currentStatus) => {
        if (currentStatus === 'Pesanan Diterima') return 'Mulai Karantina';
        if (currentStatus === 'Karantina & Kemas') return 'Serahkan ke Kurir';
        if (currentStatus === 'Diserahkan ke Kurir') return 'Kirim Ikan';
        if (currentStatus === 'Dalam Perjalanan') return 'Selesaikan Pengiriman';
        return 'Selesai';
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.pageTitle}>Seller Backoffice Dashboard</h2>
            <p style={styles.subtitle}>Kelola produk Anda dan proses pengiriman ikan dari pesanan pembeli.</p>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card glass-panel glow-cyan">
                    <small>Total Pendapatan</small>
                    <h3>Rp {totalRevenue.toLocaleString('id-ID')}</h3>
                </div>
                <div className="stat-card glass-panel glow-cyan">
                    <small>Pesanan Aktif</small>
                    <h3>{activeOrders.length}</h3>
                </div>
                <div className="stat-card glass-panel glow-cyan">
                    <small>Total Produk</small>
                    <h3>{products.length}</h3>
                </div>
            </div>

            {/* Order Pipelines */}
            <section style={styles.section} className="glass-panel">
                <h3 style={styles.sectionTitle}>🛒 Pesanan Masuk ({orders.length})</h3>
                {orders.length === 0 ? (
                    <p style={styles.emptyText}>Belum ada pesanan dari pembeli saat ini.</p>
                ) : (
                    <div style={styles.ordersList}>
                        {orders.map((order) => {
                            const next = getNextStatus(order.status);
                            
                            return (
                                <div key={order.id} style={styles.orderCard} className="glass-panel">
                                    <div style={styles.orderHeader}>
                                        <div>
                                            <span style={styles.orderId}>{order.id}</span>
                                            <p style={styles.buyerName}>Penerima: {order.shippingData.nama}</p>
                                        </div>
                                        <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    
                                    <div style={styles.orderItems}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={styles.itemRow}>
                                                <small style={{ color: 'var(--text-secondary)' }}>
                                                    {item.quantity}x {item.name}
                                                </small>
                                                <small>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</small>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={styles.orderFooter}>
                                        <small style={{ color: 'var(--accent-coral)', fontWeight: '600' }}>
                                            Total: Rp {order.total.toLocaleString('id-ID')}
                                        </small>
                                        
                                        {next ? (
                                            <button 
                                                onClick={() => onUpdateOrderStatus(order.id, next)}
                                                className="btn btn-primary"
                                                style={styles.actionBtn}
                                            >
                                                {getBtnLabel(order.status)}
                                            </button>
                                        ) : (
                                            <div style={styles.completedTag}>
                                                <CheckCircle size={14} color="var(--success)" />
                                                <span>Pengiriman Tiba</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Add Product Form */}
            <section style={styles.section} className="glass-panel">
                <h3 style={styles.sectionTitle}>
                    <PlusCircle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Daftarkan Ikan Hias Baru
                </h3>
                <form onSubmit={handleFormSubmit} style={styles.form}>
                    <div className="form-group">
                        <label>Nama Ikan Hias <span style={{ color: 'var(--accent-coral)' }}>*</span></label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Ikan Cupang Plakat Gold"
                            required
                        />
                    </div>
                    
                    <div style={styles.formRow}>
                        <div className="form-group" style={{ flexGrow: 1 }}>
                            <label>Harga (Rp) <span style={{ color: 'var(--accent-coral)' }}>*</span></label>
                            <input 
                                type="number" 
                                className="form-control"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Contoh: 50000"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ width: '130px', flexShrink: 0 }}>
                            <label>Kategori</label>
                            <select 
                                className="form-control"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={styles.select}
                            >
                                <option value="guppy">Guppy</option>
                                <option value="cupang">Cupang</option>
                                <option value="discus">Discus</option>
                                <option value="koi">Koi</option>
                                <option value="tetra">Tetra</option>
                                <option value="udang">Udang</option>
                                <option value="oscar">Oscar</option>
                                <option value="molly">Molly</option>
                                <option value="arowana">Arowana</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tag Khusus (Opsional)</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            placeholder="Contoh: Rare, Best Seller, Hot Item"
                        />
                    </div>

                    <div className="form-group">
                        <label>Tautan Gambar (Opsional)</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Masukkan tautan gambar ikan..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Deskripsi Tambahan</label>
                        <textarea 
                            className="form-control"
                            rows="2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tulis instruksi pakan atau asal usul ikan..."
                        />
                    </div>

                    <button type="submit" className="btn btn-secondary" style={styles.submitBtn}>
                        Daftarkan Ikan Hias
                    </button>
                </form>
            </section>
        </div>
    );
}

const styles = {
    container: {
        padding: '16px 16px 30px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    pageTitle: {
        fontSize: '1.25rem',
        color: 'var(--text-primary)',
        fontWeight: '700',
        marginBottom: '2px',
    },
    subtitle: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
        marginBottom: '4px',
    },
    section: {
        padding: '18px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    sectionTitle: {
        fontSize: '0.98rem',
        color: 'var(--text-primary)',
        fontWeight: '600',
    },
    emptyText: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        padding: '20px 0',
    },
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: '280px',
        overflowY: 'auto',
    },
    orderCard: {
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        backgroundColor: 'rgba(255,255,255,0.01)',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '8px',
        marginBottom: '8px',
    },
    orderId: {
        fontSize: '0.8rem',
        fontFamily: 'monospace',
        fontWeight: '700',
        color: 'var(--accent-cyan)',
    },
    buyerName: {
        fontSize: '0.78rem',
        color: 'var(--text-primary)',
        marginTop: '2px',
    },
    orderItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        marginBottom: '10px',
    },
    itemRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
    },
    orderFooter: {
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionBtn: {
        padding: '6px 12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        borderRadius: 'var(--radius-sm)',
    },
    completedTag: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--success)',
        fontSize: '0.75rem',
        fontWeight: '600',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    formRow: {
        display: 'flex',
        gap: '12px',
    },
    select: {
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        backgroundSize: '14px',
        paddingRight: '32px',
    },
    submitBtn: {
        width: '100%',
        padding: '12px',
        fontSize: '0.9rem',
        marginTop: '6px',
    }
};

export default SellerDashboard;
