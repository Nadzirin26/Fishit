import React, { useState, useRef } from 'react';
import { DollarSign, Package, PlusCircle, CheckCircle, Upload, Image as ImageIcon, X } from 'lucide-react';

function SellerDashboard({ orders, products, onUpdateOrderStatus, onAddProduct, showToast }) {
    // Form state for adding new product
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('guppy');
    const [tag, setTag] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Handle Local File Upload (FileReader Base64)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            if (showToast) showToast('File harus berupa gambar (JPG, PNG, atau WebP).', 'danger');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
            setImagePreview(reader.result);
            if (showToast) showToast('Foto ikan berhasil dipilih!', 'success');
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImage('');
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !price) {
            if (showToast) showToast('Nama dan harga produk wajib diisi.', 'danger');
            return;
        }

        const fallbackImg = 'https://images.unsplash.com/photo-1544924492-8084f17da3d2?w=500';
        const finalImage = image || fallbackImg;

        const newProd = {
            id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: name.trim(),
            seller: "Toko Air Sehat (Anda)",
            price: Number(price),
            rating: 5.0,
            reviews: 0,
            image: finalImage,
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
        handleRemoveImage();
        if (showToast) showToast(`Ikan "${newProd.name}" berhasil ditambahkan ke etalase!`, 'success');
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
            {/* Header */}
            <div>
                <h2 style={styles.pageTitle}>Seller Merchant Dashboard</h2>
                <p style={styles.subtitle}>Pusat pengelolaan toko, etalase ikan hias, dan pemrosesan pesanan pembeli.</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <small>Total Omzet</small>
                    <h3>Rp {totalRevenue.toLocaleString('id-ID')}</h3>
                </div>
                <div className="stat-card">
                    <small>Pesanan Aktif</small>
                    <h3>{activeOrders.length}</h3>
                </div>
                <div className="stat-card">
                    <small>Total Produk</small>
                    <h3>{products.length}</h3>
                </div>
            </div>

            {/* Order Pipelines */}
            <section style={styles.section}>
                <h3 style={styles.sectionTitle}>
                    <Package size={17} color="var(--brand-primary)" />
                    <span>Daftar Pesanan Masuk ({orders.length})</span>
                </h3>
                
                {orders.length === 0 ? (
                    <p style={styles.emptyText}>Belum ada pesanan dari pembeli saat ini.</p>
                ) : (
                    <div style={styles.ordersList}>
                        {orders.map((order) => {
                            const next = getNextStatus(order.status);
                            
                            return (
                                <div key={order.id} style={styles.orderCard}>
                                    <div style={styles.orderHeader}>
                                        <div>
                                            <span style={styles.orderId}>#{order.id}</span>
                                            <p style={styles.buyerName}>Penerima: <strong>{order.shippingData.nama}</strong></p>
                                        </div>
                                        <span className="badge badge-cyan">
                                            {order.status}
                                        </span>
                                    </div>
                                    
                                    <div style={styles.orderItems}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={styles.itemRow}>
                                                <small style={{ color: 'var(--text-secondary)' }}>
                                                    {item.quantity}x {item.name}
                                                </small>
                                                <small style={{ fontWeight: '600' }}>
                                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                </small>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={styles.orderFooter}>
                                        <small style={{ color: 'var(--brand-secondary)', fontWeight: '700' }}>
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
                                                <CheckCircle size={15} color="var(--success)" />
                                                <span>Pengiriman Tiba</span>
                                            </div>
                                        )}
                                    </div>

                                    {order.deliveryReview && (
                                        <div style={{ marginTop: '8px', padding: '8px 10px', background: order.deliveryReview.fishCondition === 'safe' ? '#f0fdf4' : '#fff7ed', border: `1px solid ${order.deliveryReview.fishCondition === 'safe' ? '#bbf7d0' : '#fed7aa'}`, borderRadius: 'var(--radius-sm)', fontSize: '0.74rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: '700', color: order.deliveryReview.fishCondition === 'safe' ? '#16a34a' : '#ea580c' }}>
                                                    {order.deliveryReview.fishCondition === 'safe' ? '✓ Ikan Tiba Selamat' : '⚠️ Kendala D.O.A Dilaporkan'}
                                                </span>
                                                <span style={{ color: 'var(--brand-primary)', fontWeight: '700' }}>
                                                    Kurir: {'⭐'.repeat(order.deliveryReview.courierRating)} ({order.deliveryReview.courierRating}/5)
                                                </span>
                                            </div>
                                            {order.deliveryReview.courierReview && (
                                                <p style={{ marginTop: '3px', color: '#475569', fontStyle: 'italic', fontSize: '0.72rem' }}>
                                                    "{order.deliveryReview.courierReview}"
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Add Product Form */}
            <section style={styles.section}>
                <h3 style={styles.sectionTitle}>
                    <PlusCircle size={17} color="var(--brand-primary)" />
                    <span>Daftarkan Ikan Hias Baru</span>
                </h3>

                <form onSubmit={handleFormSubmit} style={styles.form}>
                    <div className="form-group">
                        <label>Nama Spesies Ikan <span style={{ color: 'var(--brand-secondary)' }}>*</span></label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Cupang Plakat Koi Nemo Multi"
                            required
                        />
                    </div>
                    
                    <div style={styles.formRow}>
                        <div className="form-group" style={{ flexGrow: 1 }}>
                            <label>Harga Satuan (Rp) <span style={{ color: 'var(--brand-secondary)' }}>*</span></label>
                            <input 
                                type="number" 
                                className="form-control"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Contoh: 65000"
                                required
                            />
                        </div>
                        <div className="form-group" style={{ width: '140px', flexShrink: 0 }}>
                            <label>Kategori</label>
                            <select 
                                className="form-control"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={styles.select}
                            >
                                <option value="cupang">Cupang</option>
                                <option value="guppy">Guppy</option>
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
                            placeholder="Contoh: Rare, Best Seller, Grade A"
                        />
                    </div>

                    {/* Image Upload from Device/Laptop */}
                    <div className="form-group">
                        <label>Foto Ikan Hias</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />

                        {imagePreview ? (
                            <div style={styles.previewContainer}>
                                <img src={imagePreview} alt="Preview" style={styles.previewImg} />
                                <div style={styles.previewOverlay}>
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()} 
                                        className="btn btn-outline"
                                        style={{ fontSize: '0.75rem', padding: '6px 10px', background: '#ffffff' }}
                                    >
                                        Ganti Foto
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleRemoveImage} 
                                        className="btn btn-outline"
                                        style={{ fontSize: '0.75rem', padding: '6px 10px', background: '#fee2e2', borderColor: '#fca5a5', color: '#dc2626' }}
                                    >
                                        <X size={14} /> Hapus
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div 
                                style={styles.uploadDropzone}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={24} color="var(--brand-primary)" style={{ marginBottom: '6px' }} />
                                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                    Pilih Foto dari Galeri / Laptop
                                </strong>
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>
                                    Mendukung file JPG, PNG, atau WebP
                                </small>
                            </div>
                        )}

                        {/* Optional URL input toggle */}
                        <div style={{ marginTop: '8px' }}>
                            <small style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                                Atau masukkan link URL gambar:
                            </small>
                            <input 
                                type="text" 
                                className="form-control"
                                value={typeof image === 'string' && !image.startsWith('data:') ? image : ''}
                                onChange={(e) => {
                                    setImage(e.target.value);
                                    setImagePreview(e.target.value);
                                }}
                                placeholder="https://..."
                                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Deskripsi Tambahan</label>
                        <textarea 
                            className="form-control"
                            rows="2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Catatan pakan, ukuran, atau tips pemeliharaan..."
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                        <PlusCircle size={16} />
                        <span>Daftarkan Ikan ke Etalase</span>
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
        fontWeight: '800',
        marginBottom: '2px',
    },
    subtitle: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
    },
    section: {
        padding: '18px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    sectionTitle: {
        fontSize: '0.96rem',
        color: 'var(--text-primary)',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    emptyText: {
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        padding: '24px 0',
    },
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: '300px',
        overflowY: 'auto',
    },
    orderCard: {
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '8px',
        marginBottom: '8px',
    },
    orderId: {
        fontSize: '0.78rem',
        fontWeight: '700',
        color: 'var(--brand-primary)',
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
        borderTop: '1px solid #e2e8f0',
        paddingTop: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionBtn: {
        padding: '6px 12px',
        fontSize: '0.74rem',
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
        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        backgroundSize: '14px',
        paddingRight: '32px',
    },
    uploadDropzone: {
        border: '2px dashed #cbd5e1',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: '#f8fafc',
        transition: 'all 0.2s ease',
    },
    previewContainer: {
        position: 'relative',
        width: '100%',
        height: '160px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
    },
    previewImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    previewOverlay: {
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        display: 'flex',
        gap: '6px',
    },
    submitBtn: {
        width: '100%',
        padding: '12px',
        fontSize: '0.9rem',
        marginTop: '6px',
    }
};

export default SellerDashboard;
