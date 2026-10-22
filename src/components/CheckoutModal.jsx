import React, { useState } from 'react';
import { X, Copy, Check, QrCode, CreditCard } from 'lucide-react';

const BANK_VA_NUMBERS = {
    bca: "8001081245678910",
    mandiri: "88012081245678910",
    bri: "80231081245678910",
    bni: "8274081245678910"
};

function CheckoutModal({ cartItems, currentUser, onClose, onPay }) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 15000;
    const total = subtotal + shippingCost;

    // Form State
    const [nama, setNama] = useState(currentUser?.name || '');
    const [telepon, setTelepon] = useState(currentUser?.phone || '');
    const [alamat, setAlamat] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('qris'); // 'qris' | 'bca' | 'mandiri' | 'bri' | 'bni'
    
    // UI states
    const [copied, setCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const isFormValid = nama.trim() !== '' && telepon.trim() !== '' && alamat.trim() !== '';

    const handleCopyVA = (vaNumber) => {
        navigator.clipboard.writeText(vaNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePayNow = (e) => {
        e.preventDefault();
        if (!isFormValid || isProcessing) return;

        setIsProcessing(true);
        // Simulate payment validation / secure checkout
        setTimeout(() => {
            setIsProcessing(false);
            onPay({ nama, telepon, alamat }, paymentMethod);
        }, 1800);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-sheet" style={styles.checkoutSheet} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Checkout Pesanan</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handlePayNow} style={styles.formContainer}>
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>📍 Data Pengiriman</h3>
                        <div className="form-group">
                            <label>Nama Penerima <span style={{ color: 'var(--accent-coral)' }}>*</span></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Nomor Telepon <span style={{ color: 'var(--accent-coral)' }}>*</span></label>
                            <input 
                                type="tel" 
                                className="form-control" 
                                value={telepon}
                                onChange={(e) => setTelepon(e.target.value)}
                                placeholder="Contoh: 0812xxxxxxxx"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Alamat Lengkap <span style={{ color: 'var(--accent-coral)' }}>*</span></label>
                            <textarea 
                                className="form-control" 
                                rows="3"
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                                placeholder="Nama jalan, RT/RW, nomor rumah, kelurahan, kecamatan, kota"
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>💳 Metode Pembayaran</h3>
                        <div style={styles.paymentTotal}>
                            <span>Total Tagihan:</span>
                            <span style={styles.totalText}>Rp {total.toLocaleString('id-ID')}</span>
                        </div>

                        {/* Payment Options */}
                        <div style={styles.optionsList}>
                            {/* QRIS */}
                            <div 
                                style={{
                                    ...styles.paymentOption,
                                    borderColor: paymentMethod === 'qris' ? 'var(--accent-cyan)' : 'var(--glass-border)',
                                    backgroundColor: paymentMethod === 'qris' ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
                                }}
                                onClick={() => setPaymentMethod('qris')}
                            >
                                <QrCode size={20} color="var(--accent-cyan)" />
                                <div style={styles.optionText}>
                                    <h4 style={styles.optionTexth4}>QRIS (Rekomendasi)</h4>
                                    <p style={styles.optionTextp}>Scan otomatis dari e-wallet dan semua bank M-Banking.</p>
                                </div>
                            </div>

                            {/* Bank Transfers */}
                            {['bca', 'mandiri', 'bri', 'bni'].map((bank) => (
                                <div 
                                    key={bank}
                                    style={{
                                        ...styles.paymentOption,
                                        borderColor: paymentMethod === bank ? 'var(--accent-cyan)' : 'var(--glass-border)',
                                        backgroundColor: paymentMethod === bank ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
                                    }}
                                    onClick={() => setPaymentMethod(bank)}
                                >
                                    <CreditCard size={20} color="var(--text-secondary)" />
                                    <div style={styles.optionText}>
                                        <h4 style={styles.optionTexth4}>Transfer Bank {bank.toUpperCase()}</h4>
                                        <p style={styles.optionTextp}>Dicek otomatis via Virtual Account.</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Dynamic Payment Details Area */}
                        <div style={styles.detailsBox} className="glass-panel">
                            {paymentMethod === 'qris' ? (
                                <div style={styles.qrisContainer}>
                                    <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }}>Pindai QRIS</h4>
                                    {/* Mockup QR Code using high-quality custom SVG */}
                                    <svg width="130" height="130" viewBox="0 0 100 100" style={styles.qrSvg}>
                                        <rect width="100" height="100" fill="white" />
                                        {/* Corners */}
                                        <rect x="5" y="5" width="20" height="20" fill="black" />
                                        <rect x="8" y="8" width="14" height="14" fill="white" />
                                        <rect x="11" y="11" width="8" height="8" fill="black" />

                                        <rect x="75" y="5" width="20" height="20" fill="black" />
                                        <rect x="78" y="8" width="14" height="14" fill="white" />
                                        <rect x="81" y="81" width="8" height="8" fill="black" />

                                        <rect x="5" y="75" width="20" height="20" fill="black" />
                                        <rect x="8" y="78" width="14" height="14" fill="white" />
                                        <rect x="11" y="81" width="8" height="8" fill="black" />
                                        
                                        <rect x="75" y="75" width="20" height="20" fill="black" />
                                        <rect x="78" y="78" width="14" height="14" fill="white" />
                                        
                                        {/* Random QR blocks to look real */}
                                        <rect x="35" y="15" width="15" height="5" fill="black" />
                                        <rect x="40" y="30" width="10" height="10" fill="black" />
                                        <rect x="15" y="45" width="20" height="5" fill="black" />
                                        <rect x="55" y="20" width="10" height="25" fill="black" />
                                        <rect x="65" y="35" width="15" height="10" fill="black" />
                                        <rect x="30" y="55" width="30" height="5" fill="black" />
                                        <rect x="15" y="65" width="10" height="10" fill="black" />
                                        <rect x="45" y="65" width="20" height="15" fill="black" />
                                        <rect x="70" y="55" width="10" height="15" fill="black" />
                                    </svg>
                                    <p style={styles.helperText}>Screenshoot & scan QR code di atas menggunakan aplikasi dompet digital Anda.</p>
                                </div>
                            ) : (
                                <div style={styles.vaContainer}>
                                    <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                                        Virtual Account {paymentMethod.toUpperCase()}
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                        Lakukan transfer sebelum 2 jam ke nomor VA berikut:
                                    </p>
                                    <div style={styles.vaCard}>
                                        <span style={styles.vaNumber}>{BANK_VA_NUMBERS[paymentMethod]}</span>
                                        <button 
                                            type="button"
                                            onClick={() => handleCopyVA(BANK_VA_NUMBERS[paymentMethod])}
                                            style={styles.copyBtn}
                                            className="glow-cyan"
                                        >
                                            {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
                                            <span>{copied ? 'Tersalin' : 'Salin'}</span>
                                        </button>
                                    </div>
                                    <p style={styles.helperText}>
                                        Pembayaran Anda akan otomatis terverifikasi oleh sistem setelah transfer berhasil.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-secondary" 
                        style={styles.payBtn}
                        disabled={!isFormValid || isProcessing}
                    >
                        {isProcessing ? (
                            <div style={styles.spinnerRow}>
                                <div style={styles.spinner}></div>
                                <span>Memproses Pembayaran Aman...</span>
                            </div>
                        ) : (
                            `Bayar Sekarang Rp ${total.toLocaleString('id-ID')}`
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    checkoutSheet: {
        maxHeight: '92vh',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    section: {
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '16px',
    },
    sectionTitle: {
        fontSize: '1rem',
        color: 'var(--text-primary)',
        marginBottom: '14px',
        fontWeight: '600',
    },
    paymentTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px',
        fontSize: '0.95rem',
    },
    totalText: {
        fontWeight: '700',
        color: 'var(--brand-secondary)',
        fontSize: '1.15rem',
    },
    optionsList: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '10px',
        maxHeight: '220px',
        overflowY: 'auto',
        marginBottom: '16px',
        paddingRight: '2px',
    },
    paymentOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-md)',
        background: '#ffffff',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
    },
    optionText: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        textAlign: 'left',
    },
    optionTexth4: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    optionTextp: {
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
    },
    detailsBox: {
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #e2e8f0',
        background: '#f8fafc',
        textAlign: 'center',
    },
    qrisContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    qrSvg: {
        borderRadius: 'var(--radius-sm)',
        padding: '8px',
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginBottom: '12px',
    },
    helperText: {
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
        marginTop: '8px',
    },
    vaContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    vaCard: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
    },
    vaNumber: {
        fontFamily: 'monospace',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: 'var(--brand-primary)',
        letterSpacing: '1px',
    },
    copyBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: '#f8fafc',
        border: '1px solid #cbd5e1',
        color: 'var(--text-primary)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.8rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'var(--transition-smooth)',
    },
    payBtn: {
        width: '100%',
        padding: '14px',
        fontSize: '1rem',
        marginTop: '10px',
    },
    spinnerRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    spinner: {
        width: '20px',
        height: '20px',
        border: '3px solid rgba(2, 6, 23, 0.2)',
        borderTopColor: '#020617',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    }
};

// Add standard spinner animation to document style sheet dynamically in App.css or define here
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

export default CheckoutModal;
