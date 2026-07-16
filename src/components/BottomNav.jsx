import React from 'react';
import { Home, Truck, User } from 'lucide-react';

function BottomNav({ activePage, setActivePage, currentUser, onUserClick }) {
    return (
        <nav style={styles.bottomNav} className="glass-panel">
            <button 
                onClick={() => setActivePage('home')} 
                style={{
                    ...styles.navItem,
                    color: activePage === 'home' ? 'var(--accent-cyan)' : 'var(--text-secondary)'
                }}
            >
                <Home size={20} style={activePage === 'home' ? styles.activeGlow : {}} />
                <span>Home</span>
            </button>

            <button 
                onClick={() => setActivePage('tracking')} 
                style={{
                    ...styles.navItem,
                    color: activePage === 'tracking' ? 'var(--accent-cyan)' : 'var(--text-secondary)'
                }}
            >
                <Truck size={20} style={activePage === 'tracking' ? styles.activeGlow : {}} />
                <span>Pengiriman</span>
            </button>

            <button 
                onClick={onUserClick} 
                style={styles.navItem}
            >
                <User size={20} />
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
        height: '68px',
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid var(--glass-border)',
        zIndex: 600,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 'var(--radius-lg)',
        borderTopRightRadius: 'var(--radius-lg)',
    },
    navItem: {
        background: 'none',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        color: 'var(--text-secondary)',
        fontSize: '0.75rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
    },
    activeGlow: {
        filter: 'drop-shadow(0 0 6px var(--accent-cyan))',
    }
};

export default BottomNav;
