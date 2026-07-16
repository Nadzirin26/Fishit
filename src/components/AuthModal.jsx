import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';

function AuthModal({ onClose, onLogin, showToast }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            if (showToast) showToast('Email dan kata sandi harus diisi.', 'danger');
            return;
        }
        if (!email.includes('@')) {
            if (showToast) showToast('Format email tidak valid.', 'danger');
            return;
        }

        onLogin(email);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isSignUp ? 'Daftar Akun Baru' : 'Selamat Datang Kembali'}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <p style={styles.subtitle}>
                    {isSignUp 
                        ? 'Buat akun Fishit sekarang untuk membeli ikan hias premium dan melacak pesanan.' 
                        : 'Masuk log menggunakan email demo Anda untuk melanjutkan transaksi belanja.'
                    }
                </p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div className="form-group" style={styles.inputGroup}>
                        <label>Alamat Email</label>
                        <div style={styles.inputWrapper}>
                            <Mail size={16} style={styles.inputIcon} />
                            <input 
                                type="email" 
                                className="form-control" 
                                style={styles.inputField}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Masukkan email Anda (contoh: budi@demo.com)"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={styles.inputGroup}>
                        <label>Kata Sandi</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={16} style={styles.inputIcon} />
                            <input 
                                type="password" 
                                className="form-control" 
                                style={styles.inputField}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan kata sandi Anda"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                        {isSignUp ? 'Daftar Sekarang' : 'Masuk ke Aplikasi'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span style={styles.footerText}>
                        {isSignUp ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'}
                    </span>
                    <button 
                        onClick={() => setIsSignUp(!isSignUp)} 
                        style={styles.toggleBtn}
                    >
                        {isSignUp ? 'Masuk di sini' : 'Daftar sekarang'}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    subtitle: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputGroup: {
        marginBottom: '0px',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: '14px',
        color: 'var(--text-secondary)',
    },
    inputField: {
        paddingLeft: '40px',
    },
    submitBtn: {
        width: '100%',
        padding: '14px',
        fontSize: '1rem',
        marginTop: '8px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
        marginTop: '20px',
        fontSize: '0.85rem',
    },
    footerText: {
        color: 'var(--text-secondary)',
    },
    toggleBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--accent-cyan)',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'underline',
    }
};

export default AuthModal;
