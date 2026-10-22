import React from 'react';
import { Home, Truck, User, Heart } from 'lucide-react';

function BottomNav({ activePage, setActivePage, currentUser, onUserClick, wishlistCount, orderCount }) {
    return (
        <nav style={styles.bottomNav}>
            <button 
                onClick={() => setActivePage('home')} 
                style={{
                    ...styles.navItem,
                    color: activePage === 'home' ? 'var(--brand-primary)' : 'var(--text-secondary)'
                }}
            >
                <Home size={20} strokeWidth={activePage === 'home' ? 2.5 : 1.8} />
                <span style={activePage === 'home' ? styles.activeText : {}}>Beranda</span>
            </button>

            <button 
                onClick={() => setActivePage('wishlist')} 
                style={{
                    ...styles.navItem,
                    color: activePage === 'wishlist' ? 'var(--brand-primary)' : 'var(--text-secondary)'
                }}
            >
                <div style={{ position: 'relative' }}>
                    <Heart size={20} strokeWidth={activePage === 'wishlist' ? 2.5 : 1.8} />
                    {wishlistCount > 0 && <span style={styles.badge}>{wishlistCount}</span>}
                </div>
                <span style={activePage === 'wishlist' ? styles.activeText : {}}>Favorit</span>
            </button>

            <button 
                onClick={() => setActivePage('tracking')} 
                style={{
                    ...styles.navItem,
                    color: activePage === 'tracking' ? 'var(--brand-primary)' : 'var(--text-secondary)'
                }}
            >
                <div style={{ position: 'relative' }}>
                    <Truck size={20} strokeWidth={activePage === 'tracking' ? 2.5 : 1.8} />
                    {orderCount > 0 && <span style={styles.badgeTeal}>{orderCount}</span>}
                </div>
                <span style={activePage === 'tracking' ? styles.activeText : {}}>Pesanan</span>
            </button>

            <button 
                onClick={onUserClick} 
                style={styles.navItem}
            >
                <User size={20} strokeWidth={1.8} />
                <span>{currentUser ? 'Akun' : 'Masuk'}</span>
            </button>
        </nav>
    );
}

const styles = {
    bottomNav: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid #e2e8f0',
        zIndex: 600,
        boxShadow: '0 -4px 16px -2px rgba(15, 23, 42, 0.05)',
    },
    navItem: {
        background: 'none',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
        color: 'var(--text-secondary)',
        fontSize: '0.72rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-md)',
    },
    activeText: {
        color: 'var(--brand-primary)',
        fontWeight: '700',
    },
    badge: {
        position: 'absolute',
        top: '-4px',
        right: '-8px',
        background: 'var(--danger)',
        color: 'white',
        fontSize: '0.62rem',
        fontWeight: 'bold',
        minWidth: '16px',
        height: '16px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 3px',
    },
    badgeTeal: {
        position: 'absolute',
        top: '-4px',
        right: '-8px',
        background: 'var(--brand-primary)',
        color: 'white',
        fontSize: '0.62rem',
        fontWeight: 'bold',
        minWidth: '16px',
        height: '16px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 3px',
    }
};

export default BottomNav;
