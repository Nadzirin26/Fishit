import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

function PaymentSuccess({ onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={styles.overlay}>
            <div style={styles.content} className="glass-panel glow-cyan">
                <div style={styles.circle}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" style={styles.checkmark} />
                    </svg>
                </div>
                <h2 style={styles.title}>Pembayaran Berhasil!</h2>
                <p style={styles.subtitle}>Terima kasih atas pesanan Anda. Sistem kami sedang meneruskan detail pesanan ke penjual.</p>
                <div style={styles.loadingBarContainer}>
                    <div style={styles.loadingBar}></div>
                </div>
                <p style={styles.redirectText}>Mengalihkan Anda ke halaman Pelacakan...</p>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(2, 6, 23, 0.9)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.3s ease-out',
    },
    content: {
        width: '90%',
        maxWidth: '400px',
        padding: '40px 24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--glass-border)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    circle: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'var(--success-bg)',
        border: '2px solid rgba(16, 185, 129, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
    },
    checkmark: {
        strokeDasharray: 50,
        strokeDashoffset: 50,
        animation: 'checkmark 0.8s ease-in-out 0.2s forwards',
    },
    title: {
        fontSize: '1.5rem',
        color: 'var(--text-primary)',
        marginBottom: '10px',
        fontWeight: '700',
    },
    subtitle: {
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
        marginBottom: '30px',
    },
    loadingBarContainer: {
        width: '100%',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '10px',
    },
    loadingBar: {
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, var(--accent-cyan) 0%, var(--success) 100%)',
        animation: 'progress 3s linear forwards',
    },
    redirectText: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
    }
};

if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0%); }
        }
    `;
    document.head.appendChild(style);
}

export default PaymentSuccess;
