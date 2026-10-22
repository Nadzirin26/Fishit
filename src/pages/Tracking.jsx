import React, { useState, useEffect } from 'react';
import { Package, MapPin, Truck, ChevronRight, Award, HelpCircle } from 'lucide-react';
import DeliveryReviewCard from '../components/DeliveryReviewCard';

const TRACKING_STEPS = [
    { status: 'Pesanan Diterima', label: 'Menunggu konfirmasi oleh Penjual.', icon: Package },
    { status: 'Karantina & Kemas', label: 'Ikan sedang dikarantina (puasa 24 jam) agar aman dikemas.', icon: Award },
    { status: 'Diserahkan ke Kurir', label: 'Paket diserahkan ke jasa kirim spesialis hewan.', icon: Truck },
    { status: 'Dalam Perjalanan', label: 'Kurir sedang membawa ikan hias ke alamat tujuan.', icon: Truck },
    { status: 'Tiba di Tujuan', label: 'Ikan hias telah diterima dengan selamat. Segera lakukan aklimatisasi air!', icon: MapPin }
];

function Tracking({ orders, onSaveDeliveryReview, showToast, onUpdateOrderStatus }) {
    // We can simulate order progression in local state for testing purposes
    const [simulatedStatus, setSimulatedStatus] = useState({});

    const handleSimulateNextStep = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        const currentStatusIndex = TRACKING_STEPS.findIndex(s => s.status === order?.status);
        const currentStep = simulatedStatus[orderId] !== undefined ? simulatedStatus[orderId] : (currentStatusIndex >= 0 ? currentStatusIndex : 0);
        const nextStep = currentStep < TRACKING_STEPS.length - 1 ? currentStep + 1 : currentStep;

        setSimulatedStatus(prev => ({
            ...prev,
            [orderId]: nextStep
        }));

        if (onUpdateOrderStatus && nextStep !== currentStep) {
            onUpdateOrderStatus(orderId, TRACKING_STEPS[nextStep].status);
        }
    };

    if (orders.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyCard} className="glass-panel">
                    <Truck size={48} color="var(--text-muted)" style={{ marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }} />
                    <h3 style={styles.emptyTitle}>Belum Ada Pengiriman</h3>
                    <p style={styles.emptyText}>
                        Silakan lakukan pembelian ikan hias terlebih dahulu melalui halaman Home dan selesaikan pembayaran.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.pageTitle}>📦 Pelacakan Pengiriman</h2>
            
            <div style={styles.ordersList}>
                {orders.map((order) => {
                    const orderStatusIndex = TRACKING_STEPS.findIndex(s => s.status === order.status);
                    const baseIndex = orderStatusIndex >= 0 ? orderStatusIndex : 0;
                    const activeStepIndex = simulatedStatus[order.id] !== undefined ? simulatedStatus[order.id] : baseIndex;
                    
                    return (
                        <div key={order.id} style={styles.orderCard} className="glass-panel">
                            {/* Order Details Header */}
                            <div style={styles.cardHeader}>
                                <div>
                                    <span style={styles.orderIdText}>ID PESANAN: #{order.id}</span>
                                    <div style={styles.metaRow}>
                                        <small>{new Date(order.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</small>
                                        <span style={styles.separator}>•</span>
                                        <small style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</small>
                                    </div>
                                </div>
                                <span className="badge badge-cyan" style={styles.statusBadge}>
                                    {TRACKING_STEPS[activeStepIndex].status}
                                </span>
                            </div>

                            {/* Shipping Destination */}
                            <div style={styles.destinationBox}>
                                <MapPin size={16} color="var(--accent-coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <h4 style={styles.destName}>{order.shippingData.nama} ({order.shippingData.telepon})</h4>
                                    <p style={styles.destAddr}>{order.shippingData.alamat}</p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div style={styles.timeline}>
                                {TRACKING_STEPS.map((step, idx) => {
                                    const StepIcon = step.icon;
                                    const isCompleted = idx < activeStepIndex;
                                    const isActive = idx === activeStepIndex;
                                    
                                    return (
                                        <div key={idx} style={styles.timelineItem}>
                                            <div style={styles.timelineIndicator}>
                                                <div 
                                                    style={{
                                                        ...styles.timelineDot,
                                                        backgroundColor: isCompleted ? 'var(--success)' : (isActive ? 'var(--accent-cyan)' : 'var(--bg-tertiary)'),
                                                        borderColor: isCompleted ? 'var(--success)' : (isActive ? 'var(--accent-cyan)' : 'var(--glass-border)'),
                                                        animation: isActive ? 'pulseGlow 2s infinite' : 'none'
                                                    }}
                                                >
                                                    {isCompleted && <span style={styles.dotCheck}>✓</span>}
                                                </div>
                                                {idx < TRACKING_STEPS.length - 1 && (
                                                    <div 
                                                        style={{
                                                            ...styles.timelineLine,
                                                            backgroundColor: idx < activeStepIndex ? 'var(--success)' : 'var(--glass-border)'
                                                        }}
                                                    ></div>
                                                )}
                                            </div>
                                            
                                            <div style={styles.timelineContent}>
                                                <h4 
                                                    style={{
                                                        ...styles.stepStatus,
                                                        color: isCompleted ? 'var(--success)' : (isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)'),
                                                        fontWeight: isActive || isCompleted ? '600' : '400'
                                                    }}
                                                >
                                                    {step.status}
                                                </h4>
                                                <p style={styles.stepLabel}>{step.label}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Simulation Actions */}
                            <div style={styles.simulationBar}>
                                <button 
                                    onClick={() => handleSimulateNextStep(order.id)} 
                                    className="btn btn-outline"
                                    style={styles.simBtn}
                                    disabled={activeStepIndex === TRACKING_STEPS.length - 1}
                                >
                                    <Truck size={14} style={{ marginRight: '6px' }} />
                                    {activeStepIndex === TRACKING_STEPS.length - 1 
                                        ? 'Pesanan Tiba!' 
                                        : 'Simulasikan Perjalanan Kurir'
                                    }
                                </button>
                                
                                <span style={styles.simulationTip}>
                                    <HelpCircle size={12} color="var(--text-muted)" style={{ marginRight: '4px' }} />
                                    Klik tombol untuk melihat simulasi status pengiriman ikan.
                                </span>
                            </div>

                            {/* Delivery & Live Fish Condition Review Section when arrived */}
                            {activeStepIndex === TRACKING_STEPS.length - 1 && (
                                <DeliveryReviewCard 
                                    order={order}
                                    onSaveReview={onSaveDeliveryReview}
                                    showToast={showToast}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
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
        fontWeight: '700',
        marginBottom: '4px',
    },
    emptyCard: {
        padding: '48px 24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--glass-border)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
    },
    emptyTitle: {
        fontSize: '1.15rem',
        fontWeight: '600',
        marginBottom: '8px',
        color: 'var(--text-primary)',
    },
    emptyText: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
        maxWidth: '300px',
    },
    ordersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    orderCard: {
        padding: '18px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '12px',
    },
    orderIdText: {
        fontSize: '0.9rem',
        fontFamily: 'monospace',
        fontWeight: '700',
        color: 'var(--accent-cyan)',
    },
    metaRow: {
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.75rem',
        marginTop: '2px',
    },
    separator: {
        color: 'var(--text-muted)',
    },
    statusBadge: {
        fontSize: '0.7rem',
        fontWeight: '700',
        padding: '4px 10px',
    },
    destinationBox: {
        display: 'flex',
        gap: '10px',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        background: 'rgba(255, 255, 255, 0.01)',
    },
    destName: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    destAddr: {
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
        marginTop: '2px',
    },
    timeline: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        paddingLeft: '10px',
        margin: '10px 0',
    },
    timelineItem: {
        display: 'flex',
        position: 'relative',
        paddingBottom: '20px',
        gap: '16px',
    },
    timelineIndicator: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
    },
    timelineDot: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    dotCheck: {
        color: '#ffffff',
        fontSize: '0.7rem',
        fontWeight: 'bold',
    },
    timelineLine: {
        width: '2px',
        position: 'absolute',
        top: '18px',
        bottom: '-10px',
        left: '9px',
        zIndex: 1,
    },
    timelineContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        paddingTop: '1px',
    },
    stepStatus: {
        fontSize: '0.85rem',
    },
    stepLabel: {
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.4',
    },
    simulationBar: {
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    simBtn: {
        width: '100%',
        padding: '10px',
        fontSize: '0.8rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    simulationTip: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
    }
};

export default Tracking;
