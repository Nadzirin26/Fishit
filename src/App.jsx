import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Tracking from './pages/Tracking';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import ProductDetailModal from './components/ProductDetailModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import PaymentSuccess from './components/PaymentSuccess';
import LiveChatModal from './components/LiveChatModal';
import SellerDashboard from './pages/SellerDashboard';

// DATA DUMMY PRODUK
const INITIAL_PRODUCTS = [
    { 
        id: 1, 
        name: "Ikan Guppy Cobra Premium", 
        seller: "Toko Air Sehat", 
        price: 15000, 
        rating: 4.8, 
        reviews: 120, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH-ZahsQx26R9xRFKZGrYbxFcdrIXdaCJSsQ&s', 
        sellerPhone: '628123456789', 
        tag: "Best Seller",
        category: "guppy",
        reviewsData: [ 
            { user: "Siska P.", rating: 5, text: "Ikan sangat sehat, berenang aktif, pengiriman sangat cepat dan packing rapi menggunakan box sterofoam!" }, 
            { user: "Tio W.", rating: 4, text: "Barang sesuai deskripsi, airnya jernih saat sampai." } 
        ] 
    },
    { 
        id: 2, 
        name: "Cupang Halfmoon Sun Gold", 
        seller: "Betta King Ciganjur", 
        price: 45000, 
        rating: 5.0, 
        reviews: 350, 
        image: '/images/cupang_halfmoon_gold.jpg', 
        sellerPhone: '628123456790', 
        tag: "Hot Item",
        category: "cupang",
        reviewsData: [ 
            { user: "Budi H.", rating: 5, text: "Ekornya mekar sempurna lebar sekali! Warnanya cerah!" } 
        ] 
    },
    { 
        id: 3, 
        name: "Ikan Discus Blue Diamond XL", 
        seller: "Aquatic Premium Lab", 
        price: 250000, 
        rating: 4.5, 
        reviews: 88, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjZM5s6hOuVwjLZ3zspm5-Afjet5k8h5lZOQ&s', 
        sellerPhone: '628123456791', 
        tag: "Rare",
        category: "discus",
        reviewsData: [ 
            { user: "Rian K.", rating: 5, text: "Discus sampai dengan selamat, ukurannya besar sesuai deskripsi." } 
        ] 
    },
    { 
        id: 4, 
        name: "Ikan Molly Balon Orange", 
        seller: "Fishie Farm Depok", 
        price: 12000, 
        rating: 4.2, 
        reviews: 210, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs_888BF-0opj53lrZWA_vH8pDwEgbsMd_fA&s', 
        sellerPhone: '628123456792', 
        category: "molly",
        reviewsData: [] 
    },
    { 
        id: 5, 
        name: "Ikan Arwana Silver Platinum", 
        seller: "Toko Hias Jakarta", 
        price: 550000, 
        rating: 4.9, 
        reviews: 55, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa1RtbVYbtQ0gyEDkaGMvWpUeQS-HEM4tN_A&s', 
        sellerPhone: '628123456793', 
        tag: "Premium Only",
        category: "arowana",
        reviewsData: [] 
    },
    { 
        id: 6, 
        name: "Ikan Koi Kohaku A-Class", 
        seller: "Jawa Koi Centre", 
        price: 180000, 
        rating: 4.7, 
        reviews: 90, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHJZBE86qIk4roJGtCSNLRDeTh1VxGw29lmQ&s', 
        sellerPhone: '628123456794', 
        tag: "Best Seller",
        category: "koi",
        reviewsData: [] 
    },
    { 
        id: 7, 
        name: "Udang Hias Red Cherry", 
        seller: "Shrimp Lovers Indo", 
        price: 5000, 
        rating: 4.6, 
        reviews: 450, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1iu2AshZHEydZ8sxb8Sn65a3QPfNtmFExiQ&s', 
        sellerPhone: '628123456795', 
        category: "udang",
        reviewsData: [] 
    },
    { 
        id: 8, 
        name: "Ikan Oscar Tiger Exotic", 
        seller: "Predator Fish Store", 
        price: 90000, 
        rating: 4.4, 
        reviews: 70, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyHFrl2k5MSKFSSt2_PhaHq--U8I40RiJLOg&s', 
        sellerPhone: '628123456796', 
        category: "oscar",
        reviewsData: [] 
    },
    { 
        id: 9, 
        name: "Cupang Plakat Galaxy Multi", 
        seller: "Betta King Ciganjur", 
        price: 75000, 
        rating: 5.0, 
        reviews: 200, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmWLVDbM4fsqlKrmPtRlVIH2svuavM4GbHMw&s', 
        sellerPhone: '628123456797', 
        tag: "Hot Item",
        category: "cupang",
        reviewsData: [] 
    },
    { 
        id: 10, 
        name: "Ikan Neon Tetra (Paket 10 Ekor)", 
        seller: "Toko Air Sehat", 
        price: 30000, 
        rating: 4.8, 
        reviews: 600, 
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ5Ya9kj1jgty3ZfVs9K3guz7XwqxxfbwAsw&s', 
        sellerPhone: '628123456798', 
        category: "tetra",
        reviewsData: [] 
    },
];

function App() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activePage, setActivePage] = useState('home'); // 'home' | 'tracking'
    const [searchQuery, setSearchQuery] = useState('');
    
    // Auth, Toast, and Role States
    const [currentUser, setCurrentUser] = useState(null); // { name, email, phone, tier }
    const [toasts, setToasts] = useState([]);
    const [role, setRole] = useState('buyer'); // 'buyer' | 'seller'
    const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
    const [activeChatProduct, setActiveChatProduct] = useState(null);

    // Modals Visibility
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false); // will trigger ProductDetailModal
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    
    // Active Item for review
    const [activeReviewProductId, setActiveReviewProductId] = useState(null);
    const [lastCreatedOrder, setLastCreatedOrder] = useState(null);

    // --- Toast Actions ---
    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // --- Backoffice Actions ---
    const updateOrderStatus = (orderId, nextStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
        showToast(`Status pesanan ${orderId} diperbarui menjadi: ${nextStatus}!`, 'info');
    };

    const addProduct = (newProd) => {
        setProducts(prev => [newProd, ...prev]);
    };

    // --- Actions ---
    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                showToast(`Kuantitas ${product.name} ditambahkan!`, 'success');
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            showToast(`${product.name} berhasil dimasukkan ke keranjang!`, 'success');
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, change) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = item.quantity + change;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const removeItem = (productId) => {
        const item = cartItems.find(i => i.id === productId);
        setCartItems(prev => prev.filter(item => item.id !== productId));
        if (item) {
            showToast(`${item.name} dihapus dari keranjang.`, 'info');
        }
    };

    const handleLogin = (email) => {
        const username = email.split('@')[0];
        const user = {
            name: username.charAt(0).toUpperCase() + username.slice(1),
            email: email,
            phone: '0812-4567-8910',
            tier: 'Bronze Aquatic Member'
        };
        setCurrentUser(user);
        setIsAuthOpen(false);
        showToast(`Login berhasil! Selamat datang, ${user.name}.`, 'success');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsProfileOpen(false);
        setCartItems([]);
        showToast('Anda telah berhasil keluar dari akun.', 'info');
    };

    const handleCheckoutProceed = () => {
        if (!currentUser) {
            setIsCartOpen(false);
            setIsAuthOpen(true);
            showToast('Anda harus masuk log terlebih dahulu untuk checkout.', 'info');
            return;
        }
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    const handlePaymentComplete = (shippingData, paymentMethod) => {
        const newOrderId = `FST${Math.floor(Math.random() * 90000) + 10000}`;
        const newOrder = {
            id: newOrderId,
            items: [...cartItems],
            paymentMethod,
            shippingData,
            date: new Date(),
            status: 'Pesanan Diterima', // initial status
            shippingCost: 15000,
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 15000
        };

        setOrders(prev => [newOrder, ...prev]);
        setLastCreatedOrder(newOrder);
        setCartItems([]); // Clear cart
        setIsCheckoutOpen(false);
        setIsSuccessOpen(true);
    };

    const handleAddReview = (rating, text) => {
        if (!currentUser) return;
        
        setProducts(prev => prev.map(prod => {
            if (prod.id === activeReviewProductId) {
                const updatedReviews = [
                    ...prod.reviewsData,
                    { user: currentUser.name, rating, text }
                ];
                const avgRating = parseFloat((updatedReviews.reduce((s, r) => s + r.rating, 0) / updatedReviews.length).toFixed(1));
                
                showToast(`Ulasan berhasil ditambahkan untuk ${prod.name}!`, 'success');
                
                return {
                    ...prod,
                    reviewsData: updatedReviews,
                    reviews: updatedReviews.length,
                    rating: avgRating
                };
            }
            return prod;
        }));
    };

    return (
        <div className="app-container">
            {/* FLOATING ROLE SWITCHER */}
            <div className="role-switcher-container">
                <button 
                    onClick={() => {
                        setRole(prev => prev === 'buyer' ? 'seller' : 'buyer');
                        showToast(`Pindah ke ${role === 'buyer' ? 'Mode Penjual (Seller Mode)' : 'Mode Pembeli (Buyer Mode)'}`, 'info');
                    }}
                    className="role-switcher-btn"
                >
                    ⇄ Switch to {role === 'buyer' ? 'Seller Portal' : 'Buyer Portal'}
                </button>
            </div>

            <Header 
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onCartClick={() => setIsCartOpen(true)}
                currentUser={currentUser}
                onUserClick={() => currentUser ? setIsProfileOpen(true) : setIsAuthOpen(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <main style={{ flexGrow: 1 }}>
                {role === 'seller' ? (
                    <SellerDashboard 
                        orders={orders}
                        products={products}
                        onUpdateOrderStatus={updateOrderStatus}
                        onAddProduct={addProduct}
                        showToast={showToast}
                    />
                ) : activePage === 'home' ? (
                    <Home 
                        products={products}
                        searchQuery={searchQuery}
                        onAddToCart={addToCart}
                        onOpenReviews={(id) => {
                            setActiveReviewProductId(id);
                            setIsReviewsOpen(true);
                        }}
                        onChatClick={(prod) => {
                            setActiveChatProduct(prod);
                            setIsLiveChatOpen(true);
                        }}
                    />
                ) : (
                    <Tracking orders={orders} />
                )}
            </main>

            {role === 'buyer' && (
                <BottomNav 
                    activePage={activePage} 
                    setActivePage={setActivePage}
                    currentUser={currentUser}
                    onUserClick={() => currentUser ? setIsProfileOpen(true) : setIsAuthOpen(true)}
                />
            )}

            {/* MODALS */}
            {isCartOpen && (
                <CartModal 
                    cartItems={cartItems}
                    onClose={() => setIsCartOpen(false)}
                    onUpdateQty={updateQuantity}
                    onRemove={removeItem}
                    onCheckout={handleCheckoutProceed}
                />
            )}

            {isCheckoutOpen && (
                <CheckoutModal 
                    cartItems={cartItems}
                    currentUser={currentUser}
                    onClose={() => setIsCheckoutOpen(false)}
                    onPay={handlePaymentComplete}
                />
            )}

            {isAuthOpen && (
                <AuthModal 
                    onClose={() => setIsAuthOpen(false)}
                    onLogin={handleLogin}
                    showToast={showToast}
                />
            )}

            {isProfileOpen && (
                <ProfileModal 
                    currentUser={currentUser}
                    orders={orders}
                    onClose={() => setIsProfileOpen(false)}
                    onLogout={handleLogout}
                />
            )}

            {isReviewsOpen && (
                <ProductDetailModal 
                    product={products.find(p => p.id === activeReviewProductId)}
                    currentUser={currentUser}
                    onClose={() => {
                        setIsReviewsOpen(false);
                        setActiveReviewProductId(null);
                    }}
                    onAddToCart={addToCart}
                    onAddReview={handleAddReview}
                    onLoginPrompt={() => {
                        setIsReviewsOpen(false);
                        setIsAuthOpen(true);
                    }}
                    onChatClick={(prod) => {
                        setIsReviewsOpen(false);
                        setActiveChatProduct(prod);
                        setIsLiveChatOpen(true);
                    }}
                    showToast={showToast}
                />
            )}

            {isSuccessOpen && (
                <PaymentSuccess 
                    onClose={() => {
                        setIsSuccessOpen(false);
                        setActivePage('tracking');
                    }}
                />
            )}

            {isLiveChatOpen && (
                <LiveChatModal 
                    product={activeChatProduct}
                    onClose={() => {
                        setIsLiveChatOpen(false);
                        setActiveChatProduct(null);
                    }}
                />
            )}

            {/* TOAST NOTIFICATIONS */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast-item toast-${toast.type}`}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
