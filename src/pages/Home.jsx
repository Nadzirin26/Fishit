import React from 'react';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, ShieldAlert, Award, PackageOpen, Truck, FileCheck } from 'lucide-react';

function Home({ products, searchQuery, onAddToCart, onOpenReviews, onChatClick }) {
    const [selectedCategory, setSelectedCategory] = React.useState('all');

    const categories = [
        { id: 'all', label: '🌈 Semua Ikan' },
        { id: 'guppy', label: '🧬 Guppy' },
        { id: 'cupang', label: '👑 Betta / Cupang' },
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
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={styles.container}>
            {/* Jumbotron / Promo Area */}
            <section style={styles.hero} className="glass-panel glow-cyan">
                <div style={styles.heroTextContainer}>
                    <h2 style={styles.heroTitle}>Beli Ikan Hias Aman & Terpercaya</h2>
                    <p style={styles.heroSubtitle}>
                        Setiap pembelian dilindungi jaminan refund 100% apabila ikan mati saat pengiriman (SOP D.O.A).
                    </p>
                </div>
                <div style={styles.floatingBubbles}>🐠 🌊 ✨</div>
            </section>

            {/* Product Section */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Ikan Hias Rekomendasi</h2>

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
                    <div style={styles.noResults} className="glass-panel">
                        <ShieldAlert size={36} color="var(--accent-coral)" style={{ marginBottom: '8px' }} />
                        <h3>Ikan Tidak Ditemukan</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                            Coba masukkan kata kunci pencarian yang lain atau ubah filter kategori.
                        </p>
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
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Feature Information Card */}
            <section style={styles.section} className="glass-panel">
                <h3 style={{ ...styles.sectionTitle, color: 'var(--accent-cyan)' }}>
                    🛡️ Jaminan & Keamanan Fishit
                </h3>
                <div style={styles.featureList}>
                    <div style={styles.featureCard}>
                        <div style={styles.featureHeader}>
                            <ShieldCheck size={20} color="var(--accent-cyan)" />
                            <h4 style={styles.featureHeaderh4}>Pembayaran Aman (Escrow)</h4>
                        </div>
                        <p style={styles.featureText}>
                            Uang Anda aman bersama kami. Dana hanya akan diserahkan ke penjual setelah ikan terkonfirmasi sampai dalam kondisi hidup.
                        </p>
                    </div>

                    <div style={styles.featureCard}>
                        <div style={styles.featureHeader}>
                            <Truck size={20} color="var(--accent-cyan)" />
                            <h4 style={styles.featureHeaderh4}>Kepastian Waktu Pengiriman</h4>
                        </div>
                        <p style={styles.featureText}>
                            Sistem terhubung langsung dengan ekspedisi hewan hidup untuk memberikan pelacakan status nyata dan estimasi waktu yang tepat.
                        </p>
                    </div>

                    <div style={styles.featureCard}>
                        <div style={styles.featureHeader}>
                            <Award size={20} color="var(--accent-cyan)" />
                            <h4 style={styles.featureHeaderh4}>Standar Pelayanan Ekstra</h4>
                        </div>
                        <p style={styles.featureText}>
                            Penjual di platform kami diseleksi ketat dan diwajibkan mematuhi SOP perlindungan ikan hias selama proses karantina sebelum dikirim.
                        </p>
                    </div>
                </div>
            </section>

            {/* SOP Pengiriman */}
            <section style={styles.section} className="glass-panel">
                <h3 style={styles.sectionTitle}>📜 SOP Pengiriman (Transparansi)</h3>
                <div style={styles.sopSteps}>
                    <div style={styles.sopStepItem}>
                        <div style={styles.sopIconBox} className="glow-cyan">
                            <PackageOpen size={20} color="var(--accent-cyan)" />
                        </div>
                        <div style={styles.sopStepText}>
                            <h4 style={styles.sopStepTexth4}>1. Karantina & Kemas Aman</h4>
                            <p style={styles.sopStepTextp}>Ikan dipuasakan 24 jam agar kotoran berkurang, lalu dikemas dengan kantong plastik ganda, oksigen murni, dan kotak boks busa (styrofoam).</p>
                        </div>
                    </div>

                    <div style={styles.sopStepItem}>
                        <div style={styles.sopIconBox} className="glow-cyan">
                            <Truck size={20} color="var(--accent-cyan)" />
                        </div>
                        <div style={styles.sopStepText}>
                            <h4 style={styles.sopStepTexth4}>2. Ekspedisi Khusus Hewan Hidup</h4>
                            <p style={styles.sopStepTextp}>Pengiriman menggunakan layanan kilat dari kurir spesialis pengiriman hewan hidup (hewan air) untuk meminimalisasi durasi stres ikan.</p>
                        </div>
                    </div>

                    <div style={styles.sopStepItem}>
                        <div style={styles.sopIconBox} className="glow-cyan">
                            <FileCheck size={20} color="var(--accent-cyan)" />
                        </div>
                        <div style={styles.sopStepText}>
                            <h4 style={styles.sopStepTexth4}>3. Garansi D.O.A (Dead On Arrival)</h4>
                            <p style={styles.sopStepTextp}>Wajib rekam video saat unboxing pertama kali. Jika ikan mati saat sampai, kami memberikan garansi 100% dana kembali atau ganti ikan baru.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

const styles = {
    container: {
        padding: '16px 16px 30px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    hero: {
        padding: '24px 20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        background: 'linear-gradient(135deg, rgba(19, 34, 63, 0.9) 0%, rgba(5, 11, 20, 0.95) 100%)',
        position: 'relative',
        overflow: 'hidden',
    },
    heroTextContainer: {
        position: 'relative',
        zIndex: 2,
        maxWidth: '85%',
    },
    heroTitle: {
        fontSize: '1.35rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '8px',
        lineHeight: '1.2',
    },
    heroSubtitle: {
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
    },
    floatingBubbles: {
        position: 'absolute',
        bottom: '8px',
        right: '16px',
        fontSize: '1.8rem',
        opacity: 0.25,
        userSelect: 'none',
        pointerEvents: 'none',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '18px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--glass-border)',
    },
    sectionTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        borderLeft: '3px solid var(--accent-cyan)',
        paddingLeft: '10px',
    },
    noResults: {
        textAlign: 'center',
        padding: '30px 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: '16px',
    },
    featureList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    featureCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    featureHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    featureHeaderh4: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    featureText: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
        paddingLeft: '28px',
    },
    sopSteps: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    sopStepItem: {
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
    },
    sopIconBox: {
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(0, 240, 255, 0.06)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    sopStepText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    sopStepTexth4: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    sopStepTextp: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.45',
    }
};

export default Home;
