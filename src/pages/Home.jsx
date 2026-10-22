import React from 'react';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, ShieldAlert, Award, PackageOpen, Truck, Heart, Sparkles } from 'lucide-react';

function Home({ products, searchQuery, onAddToCart, onOpenReviews, onChatClick, wishlist = [], onToggleWishlist, selectedCategory = 'all', setSelectedCategory }) {
    const categories = [
        { id: 'all', label: 'Semua Ikan' },
        { id: 'wishlist', label: `❤️ Favorit (${wishlist.length})` },
        { id: 'cupang', label: '👑 Betta / Cupang' },
        { id: 'guppy', label: '🧬 Guppy' },
        { id: 'discus', label: '💎 Discus' },
        { id: 'koi', label: '🎏 Koi' },
        { id: 'tetra', label: '⚡ Neon Tetra' },
        { id: 'udang', label: '🦐 Udang Hias' },
        { id: 'oscar', label: '🐯 Oscar' },
        { id: 'molly', label: '🎈 Molly' },
        { id: 'arowana', label: '🐉 Arowana' }
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.seller.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesCategory = true;
        if (selectedCategory === 'wishlist') {
            matchesCategory = wishlist.includes(product.id);
        } else if (selectedCategory !== 'all') {
            matchesCategory = product.category === selectedCategory;
        }

        return matchesSearch && matchesCategory;
    });

    return (
        <div style={styles.container}>
            {/* Promo / Hero Banner (Clean Botanical Aquatic) */}
            <section style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.heroBadge}>
                        <Sparkles size={13} color="var(--brand-primary)" />
                        <span>Pasar Ikan Hias Terpercaya #1</span>
                    </div>
                    <h2 style={styles.heroTitle}>Beli Ikan Hias Segar & Bergaransi D.O.A</h2>
                    <p style={styles.heroSubtitle}>
                        Dikirim langsung dari peternak terverifikasi se-Indonesia. Packing plastik ganda + oksigen murni 48 jam & garansi 100% uang kembali jika mati di jalan.
                    </p>
                    <div style={styles.heroChips}>
                        <span style={styles.chip}>✓ Oksigen Murni 48 Jam</span>
                        <span style={styles.chip}>✓ Karantina Bebas Parasit</span>
                        <span style={styles.chip}>✓ Garansi D.O.A 100%</span>
                    </div>
                </div>
            </section>

            {/* Product Section */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>
                        {selectedCategory === 'wishlist' ? '❤️ Ikan Favorit Saya' : 'Katalog Ikan Pilihan'}
                    </h2>
                    <span style={styles.productCount}>{filteredProducts.length} Spesies</span>
                </div>

                {/* Category Pills */}
                <div className="category-pills">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`pill ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                
                {filteredProducts.length === 0 ? (
                    <div style={styles.noResults}>
                        {selectedCategory === 'wishlist' ? (
                            <>
                                <Heart size={40} color="#cbd5e1" style={{ marginBottom: '8px' }} />
                                <h3>Belum Ada Ikan Favorit</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                                    Klik ikon hati pada foto ikan untuk menyimpannya ke daftar favorit Anda.
                                </p>
                                <button 
                                    onClick={() => setSelectedCategory('all')} 
                                    className="btn btn-outline" 
                                    style={{ marginTop: '12px' }}
                                >
                                    Jelajahi Semua Ikan
                                </button>
                            </>
                        ) : (
                            <>
                                <ShieldAlert size={40} color="var(--brand-secondary)" style={{ marginBottom: '8px' }} />
                                <h3>Ikan Tidak Ditemukan</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                                    Coba masukkan kata kunci lain atau pilih kategori yang berbeda.
                                </p>
                            </>
                        )}
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                onAddToCart={onAddToCart}
                                onOpenReviews={onOpenReviews}
                                onChatClick={onChatClick}
                                isWishlisted={wishlist.includes(product.id)}
                                onToggleWishlist={onToggleWishlist}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* SOP & Trust Information Card */}
            <section style={styles.trustSection}>
                <h3 style={styles.trustTitle}>
                    🛡️ Jaminan Keamanan Transaksi di Fishit
                </h3>
                <div style={styles.featureGrid}>
                    <div style={styles.featureItem}>
                        <div style={styles.featureIconWrap}>
                            <ShieldCheck size={20} color="var(--brand-primary)" />
                        </div>
                        <div>
                            <h4 style={styles.featureHeading}>Rekening Bersama (Escrow)</h4>
                            <p style={styles.featureDesc}>
                                Pembayaran ditahan aman oleh sistem dan baru diteruskan ke peternak setelah ikan sampai dengan sehat.
                            </p>
                        </div>
                    </div>

                    <div style={styles.featureItem}>
                        <div style={styles.featureIconWrap}>
                            <PackageOpen size={20} color="var(--brand-primary)" />
                        </div>
                        <div>
                            <h4 style={styles.featureHeading}>Standar Packing Khusus</h4>
                            <p style={styles.featureDesc}>
                                Plastik tebal rangkap tiga dengan injeksi oksigen murni & boks styrofoam padat anti-benturan.
                            </p>
                        </div>
                    </div>

                    <div style={styles.featureItem}>
                        <div style={styles.featureIconWrap}>
                            <Award size={20} color="var(--brand-primary)" />
                        </div>
                        <div>
                            <h4 style={styles.featureHeading}>Garansi D.O.A (Dead On Arrival)</h4>
                            <p style={styles.featureDesc}>
                                Sertakan video unboxing tanpa cut. Jika ikan mati di jalan, dana langsung diganti utuh 100%.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

const styles = {
    container: {
        padding: '16px 16px 24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    hero: {
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%)',
        border: '1px solid #ccfbf1',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 18px',
        boxShadow: '0 2px 10px -2px rgba(13, 148, 136, 0.08)',
    },
    heroContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    heroBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: '#ffffff',
        border: '1px solid #ccfbf1',
        borderRadius: 'var(--radius-full)',
        padding: '4px 10px',
        fontSize: '0.72rem',
        fontWeight: '700',
        color: 'var(--brand-primary)',
        width: 'fit-content',
    },
    heroTitle: {
        fontSize: '1.25rem',
        fontWeight: '800',
        color: 'var(--text-primary)',
        lineHeight: '1.3',
        letterSpacing: '-0.02em',
    },
    heroSubtitle: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
    },
    heroChips: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginTop: '6px',
    },
    chip: {
        fontSize: '0.7rem',
        fontWeight: '600',
        color: 'var(--brand-primary)',
        background: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #ccfbf1',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: '1.05rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    productCount: {
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        fontWeight: '500',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
    },
    noResults: {
        padding: '40px 20px',
        textAlign: 'center',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    trustSection: {
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'var(--card-shadow)',
    },
    trustTitle: {
        fontSize: '0.95rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    featureGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    featureItem: {
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
    },
    featureIconWrap: {
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-md)',
        background: '#f0fdfa',
        border: '1px solid #ccfbf1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    featureHeading: {
        fontSize: '0.84rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '2px',
    },
    featureDesc: {
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.45',
    }
};

export default Home;
