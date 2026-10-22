import React from 'react';
import { ShoppingCart, User, Search, Heart, MapPin } from 'lucide-react';

function Header({ cartCount, onCartClick, currentUser, onUserClick, searchQuery, setSearchQuery, wishlistCount, onWishlistClick }) {
    return (
        <header style={styles.header}>
            {/* Top Bar Location */}
            <div style={styles.locationBar}>
                <div style={styles.locationText}>
                    <MapPin size={12} color="var(--brand-primary)" />
                    <span>Kirim ke: <strong>Jabodetabek & Seluruh Indonesia</strong></span>
                </div>
                <span style={styles.guaranteeText}>✓ Garansi Ikan Hidup (D.O.A)</span>
            </div>

            {/* Main Header Row */}
            <div style={styles.topRow}>
                <div style={styles.logo}>
                    <span style={styles.logoFish}>🐠</span>
                    <span style={styles.logoText}>Fishit</span>
                </div>
                
                <div style={styles.actions}>
                    {/* Wishlist Button */}
                    <button 
                        onClick={onWishlistClick} 
                        style={styles.iconBtn} 
                        className="btn-outline"
                        title="Ikan Favorit Saya"
                        aria-label="Favorit"
                    >
                        <Heart size={18} color="var(--text-secondary)" />
                        {wishlistCount > 0 && <span style={styles.wishlistBadge}>{wishlistCount}</span>}
                    </button>

                    {/* Cart Button */}
                    <button 
                        onClick={onCartClick} 
                        style={styles.iconBtn} 
                        className="btn-outline"
                        title="Keranjang Belanja"
                        aria-label="Keranjang"
                    >
                        <ShoppingCart size={18} color="var(--brand-primary)" />
                        {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
                    </button>

                    {/* Profile Button */}
                    <button onClick={onUserClick} style={styles.profileBtn} className="btn-outline">
                        <User size={16} color="var(--text-secondary)" />
                        <span style={styles.profileText}>
                            {currentUser ? currentUser.name : 'Masuk'}
                        </span>
                    </button>
                </div>
            </div>
            
            {/* Search Input */}
            <div style={styles.searchBar}>
                <Search size={16} style={styles.searchIcon} />
                <input 
                    type="text" 
                    placeholder="Cari ikan cupang, guppy, discus, koi..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                />
            </div>
        </header>
    );
}

const styles = {
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 500,
        padding: '12px 18px 14px 18px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.04)',
    },
    locationBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.72rem',
        color: 'var(--text-secondary)',
        paddingBottom: '2px',
        borderBottom: '1px dashed #f1f5f9',
    },
    locationText: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    guaranteeText: {
        color: 'var(--brand-primary)',
        fontWeight: '600',
    },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    logoFish: {
        fontSize: '1.6rem',
        filter: 'drop-shadow(0 2px 4px rgba(13, 148, 136, 0.2))',
    },
    logoText: {
        fontSize: '1.4rem',
        fontWeight: '800',
        color: 'var(--brand-primary)',
        letterSpacing: '-0.03em',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    iconBtn: {
        position: 'relative',
        width: '38px',
        height: '38px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        transition: 'var(--transition-smooth)',
    },
    badge: {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        background: 'var(--brand-secondary)',
        color: 'white',
        fontSize: '0.65rem',
        fontWeight: 'bold',
        minWidth: '18px',
        height: '18px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
    },
    wishlistBadge: {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        background: 'var(--danger)',
        color: 'white',
        fontSize: '0.65rem',
        fontWeight: 'bold',
        minWidth: '18px',
        height: '18px',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
    },
    profileBtn: {
        height: '38px',
        padding: '0 12px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        fontSize: '0.82rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        maxWidth: '120px',
    },
    profileText: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    searchBar: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    searchIcon: {
        position: 'absolute',
        left: '12px',
        color: '#94a3b8',
        pointerEvents: 'none',
    },
    searchInput: {
        width: '100%',
        padding: '9px 14px 9px 36px',
        backgroundColor: '#f1f5f9',
        border: '1px solid transparent',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: '0.86rem',
        fontFamily: 'var(--font-body)',
        transition: 'var(--transition-smooth)',
        outline: 'none',
    },
};

export default Header;
