import React from 'react';
import { ShoppingCart, User, Search } from 'lucide-react';

function Header({ cartCount, onCartClick, currentUser, onUserClick, searchQuery, setSearchQuery }) {
    return (
        <header style={styles.header} className="glass-panel">
            <div style={styles.topRow}>
                <div style={styles.logo}>
                    <span style={styles.logoFish}>🐠</span>
                    <span style={styles.logoText}>Fishit</span>
                </div>
                <div style={styles.actions}>
                    <button onClick={onCartClick} style={styles.iconBtn} className="btn-outline glow-cyan">
                        <ShoppingCart size={18} color="var(--accent-cyan)" />
                        {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
                    </button>
                    <button onClick={onUserClick} style={styles.profileBtn} className="btn-outline">
                        <User size={18} />
                        <span style={styles.profileText}>
                            {currentUser ? currentUser.name : 'Masuk'}
                        </span>
                    </button>
                </div>
            </div>
            
            <div style={styles.searchBar}>
                <Search size={18} style={styles.searchIcon} />
                <input 
                    type="text" 
                    placeholder="Cari ikan hias favorit Anda..." 
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
        padding: '16px 20px',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottomLeftRadius: 'var(--radius-md)',
        borderBottomRightRadius: 'var(--radius-md)',
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
        fontSize: '1.8rem',
        animation: 'float 3s ease-in-out infinite',
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #00bcff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.03em',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    iconBtn: {
        position: 'relative',
        width: '40px',
        height: '40px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '1px solid var(--glass-border)',
        background: 'rgba(255, 255, 255, 0.03)',
        transition: 'var(--transition-smooth)',
    },
    badge: {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        background: 'var(--accent-coral)',
        color: 'white',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 10px rgba(255, 83, 118, 0.5)',
    },
    profileBtn: {
        height: '40px',
        padding: '0 12px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        border: '1px solid var(--glass-border)',
        background: 'rgba(255, 255, 255, 0.03)',
        transition: 'var(--transition-smooth)',
        fontSize: '0.85rem',
        fontWeight: '500',
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
        color: 'var(--text-secondary)',
        pointerEvents: 'none',
    },
    searchInput: {
        width: '100%',
        padding: '10px 16px 10px 40px',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        transition: 'var(--transition-smooth)',
        outline: 'none',
    },
};

export default Header;
