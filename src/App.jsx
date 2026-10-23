import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Fish,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  RotateCcw,
  Store,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  DEMO_STORE,
  DEMO_USER,
  INITIAL_PRODUCTS,
} from "./data/catalog";
import {
  cancelOrder,
  cartLines,
  createCheckout,
  loadDemo,
  nextOrderStep,
  STORAGE_KEY,
  uid,
  validateProduct,
} from "./lib/marketplace";
import Header from "./components/Header";
import Modal from "./components/Modal";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import {
  CartDialog,
  CheckoutDialog,
  ProductDialog,
  ChatDialog,
  ReviewDialog,
  ProductForm,
} from "./components/DemoDialogs";

const PAGES = ["home", "wishlist", "orders", "seller"];
const readPage = () =>
  PAGES.includes(location.hash.slice(1)) ? location.hash.slice(1) : "home";

export default function App() {
  const [state, setState] = useState(() => loadDemo(INITIAL_PRODUCTS));
  const [page, setPage] = useState(readPage);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [storageError, setStorageError] = useState(false);
  const toastTimer = useRef(null);
  const paymentLock = useRef(false);
  const notify = (text) => {
    clearTimeout(toastTimer.current);
    setToast(text);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);
  useEffect(() => {
    const onHash = () => {
      setPage(readPage());
      setModal(null);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    const sync = (event) => {
      if (event.key === STORAGE_KEY) {
        setState(loadDemo(INITIAL_PRODUCTS));
        setModal(null);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const navigate = (next) => {
    setModal(null);
    if (next !== page) location.hash = next;
    setPage(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const lines = cartLines(state.cart, state.products);
  const itemCount = lines.reduce((sum, item) => sum + item.quantity, 0);
  const myOrders = state.orders.filter(
    (order) => order.userId === DEMO_USER.id,
  );
  const activeProduct = modal?.productId
    ? state.products.find((p) => p.id === modal.productId)
    : null;
  const toggleWishlist = (id) => {
    const exists = state.wishlist.includes(id);
    setState((prev) => ({
      ...prev,
      wishlist: exists
        ? prev.wishlist.filter((item) => item !== id)
        : [...prev.wishlist, id],
    }));
    notify(exists ? "Dihapus dari favorit." : "Disimpan ke favorit.");
  };
  const addToCart = (product) => {
    const existing = state.cart.find((item) => item.productId === product.id);
    if ((existing?.quantity || 0) >= product.stock) {
      notify("Jumlah di keranjang sudah mencapai stok tersedia.");
      return;
    }
    setState((prev) => ({
      ...prev,
      cart: existing
        ? prev.cart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...prev.cart, { productId: product.id, quantity: 1 }],
    }));
    notify(`${product.name} masuk keranjang.`);
  };
  const updateQuantity = (id, change) => {
    const product = state.products.find((p) => p.id === id);
    setState((prev) => ({
      ...prev,
      cart: prev.cart
        .map((item) =>
          item.productId === id
            ? {
                ...item,
                quantity: Math.min(item.quantity + change, product.stock),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    }));
  };
  const proceedCheckout = () => {
    if (!lines.length) return;
    paymentLock.current = false;
    setModal({
      type: state.user ? "checkout" : "auth",
      afterLogin: "checkout",
    });
  };
  const pay = (form) => {
    if (paymentLock.current) return;
    try {
      paymentLock.current = true;
      const next = createCheckout(state, { ...form, user: state.user });
      const created = next.orders.filter(
        (order) => !state.orders.some((old) => old.id === order.id),
      );
      setState(next);
      setModal({ type: "success", orders: created });
    } catch (error) {
      paymentLock.current = false;
      notify(error.message);
    }
  };
  const saveProduct = (product) => {
    const error = validateProduct(product);
    if (error) {
      notify(error);
      return;
    }
    const normalized = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      name: product.name.trim(),
      description: product.description.trim(),
    };
    setState((prev) => ({
      ...prev,
      products: product.id
        ? prev.products.map((p) =>
            p.id === product.id && p.sellerId === DEMO_STORE.id
              ? { ...p, ...normalized }
              : p,
          )
        : [
            {
              ...normalized,
              id: uid(),
              sellerId: DEMO_STORE.id,
              seller: DEMO_STORE.name,
              location: DEMO_STORE.location,
              reviews: [],
              tag: "Baru",
            },
            ...prev.products,
          ],
    }));
    setModal(null);
    notify(
      product.id ? "Produk demo diperbarui." : "Produk baru tampil di katalog.",
    );
  };
  const reset = () => {
    setState({
      products: structuredClone(INITIAL_PRODUCTS),
      cart: [],
      wishlist: [],
      orders: [],
      user: null,
    });
    setQuery("");
    setCategory("all");
    navigate("home");
    notify("Demo direset. Selamat menjelajah lagi!");
  };
  return (
    <>
      <a className="skip-link" href="#main-content">
        Lewati ke konten
      </a>
      <div className="demo-bar">
        <span>
          <span className="live-dot" />
          PROYEK PORTOFOLIO{" "}
          <span className="demo-bar-detail">
            — Jelajahi, belanja, dan kelola toko dalam mode demo.
          </span>
        </span>
        <button onClick={() => setModal({ type: "about" })}>
          Tentang demo <ArrowUpRight size={13} />
        </button>
      </div>
      <Header
        page={page}
        navigate={navigate}
        query={query}
        onSearch={(value) => {
          setQuery(value);
          if (page !== "home") navigate("home");
        }}
        itemCount={itemCount}
        user={state.user}
        onCart={() => setModal({ type: "cart" })}
        onUser={() => setModal({ type: state.user ? "profile" : "auth" })}
      />
      {storageError && (
        <div className="storage-warning" role="alert">
          Penyimpanan browser penuh atau diblokir. Kamu masih bisa mencoba demo,
          tetapi perubahan mungkin hilang saat halaman dimuat ulang. Hapus foto
          unggahan atau reset demo.
        </div>
      )}
      <main id="main-content" tabIndex={-1}>
        {(page === "home" || page === "wishlist") && (
          <Home
            products={state.products}
            wishlist={state.wishlist}
            onWishlist={toggleWishlist}
            onAdd={addToCart}
            onDetail={(id) => setModal({ type: "product", productId: id })}
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            favoritesOnly={page === "wishlist"}
            onExplore={() => {
              setQuery("");
              setCategory("all");
              navigate("home");
            }}
          />
        )}
        {page === "orders" && (
          <Orders
            orders={myOrders}
            onExplore={() => navigate("home")}
            onAdvance={(id) => {
              setState((prev) => nextOrderStep(prev, id));
              notify("Status pengiriman demo diperbarui.");
            }}
            onCancel={(id) => setModal({ type: "cancel", orderId: id })}
            onReview={(id) => setModal({ type: "review", orderId: id })}
          />
        )}
        {page === "seller" && (
          <SellerDashboard
            products={state.products.filter(
              (p) => p.sellerId === DEMO_STORE.id,
            )}
            orders={myOrders}
            onAdd={() => setModal({ type: "productForm" })}
            onEdit={(id) => setModal({ type: "productForm", productId: id })}
            onAdvance={(id) => setState((prev) => nextOrderStep(prev, id))}
            onArchive={(id) => {
              setState((prev) => ({
                ...prev,
                products: prev.products.map((p) =>
                  p.id === id ? { ...p, archived: !p.archived } : p,
                ),
              }));
              notify("Visibilitas produk diperbarui.");
            }}
            onExplore={() => navigate("home")}
          />
        )}
      </main>
      <section className="bottom-story container">
        <div className="story-symbol">
          <Fish size={30} strokeWidth={1.5} />
        </div>
        <div>
          <h2>Hobi kecil. Dunia yang lebih berwarna.</h2>
          <p>
            Temukan penghuni baru, pelajari kebutuhannya, dan nikmati proses
            merawatnya.
          </p>
        </div>
        <button
          className="text-button"
          onClick={() => setModal({ type: "guide" })}
        >
          Panduan penghobi <ArrowUpRight size={17} />
        </button>
      </section>
      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand" href="#home" aria-label="Fishit beranda">
            <Fish size={27} />
            <span>
              fishit<span className="brand-dot">.</span>
            </span>
          </a>
          <p>Marketplace ikan hias · Demo interaktif oleh Nadzirin</p>
          <div>
            <button onClick={() => setModal({ type: "reset" })}>
              <RotateCcw size={14} /> Reset demo
            </button>
            <a
              href="https://github.com/Nadzirin26/Fishit"
              target="_blank"
              rel="noreferrer"
            >
              Lihat kode <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <p className="footer-note">
          Tidak ada transaksi, pengiriman, atau komunikasi dengan penjual
          sungguhan. Data demo tersimpan di browser ini.
        </p>
      </footer>
      <nav className="mobile-nav" aria-label="Navigasi utama seluler">
        {[
          [Fish, "home", "Jelajahi"],
          [Heart, "wishlist", "Favorit"],
          [Package, "orders", "Pesanan"],
          [LayoutDashboard, "seller", "Penjual"],
        ].map(([Icon, key, label]) => (
          <button
            key={key}
            aria-current={page === key ? "page" : undefined}
            className={page === key ? "active" : ""}
            onClick={() => navigate(key)}
          >
            <Icon size={21} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          <span>{toast}</span>
          <button
            onClick={() => setToast(null)}
            aria-label="Tutup pemberitahuan"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {modal?.type === "cart" && (
        <CartDialog
          lines={lines}
          onClose={() => setModal(null)}
          onQuantity={updateQuantity}
          onRemove={(id) =>
            setState((prev) => ({
              ...prev,
              cart: prev.cart.filter((item) => item.productId !== id),
            }))
          }
          onCheckout={proceedCheckout}
          onExplore={() => navigate("home")}
        />
      )}
      {modal?.type === "checkout" && (
        <CheckoutDialog
          lines={lines}
          user={state.user}
          onPay={pay}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "product" && activeProduct && (
        <ProductDialog
          product={activeProduct}
          isFavorite={state.wishlist.includes(activeProduct.id)}
          onWishlist={() => toggleWishlist(activeProduct.id)}
          onAdd={() => addToCart(activeProduct)}
          onChat={() => setModal({ type: "chat", productId: activeProduct.id })}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "chat" && activeProduct && (
        <ChatDialog product={activeProduct} onClose={() => setModal(null)} />
      )}
      {modal?.type === "productForm" && (
        <ProductForm
          product={activeProduct}
          categories={CATEGORIES.slice(1)}
          onSave={saveProduct}
          onClose={() => setModal(null)}
          notify={notify}
        />
      )}
      {modal?.type === "review" && (
        <ReviewDialog
          onClose={() => setModal(null)}
          onSave={(review) => {
            const order = state.orders.find((o) => o.id === modal.orderId);
            if (!order || order.cancelled || order.step !== 3 || order.review)
              return;
            setState((prev) => ({
              ...prev,
              orders: prev.orders.map((o) =>
                o.id === order.id ? { ...o, review } : o,
              ),
              products: prev.products.map((p) =>
                order.items.some((i) => i.id === p.id)
                  ? {
                      ...p,
                      reviews: [
                        ...p.reviews,
                        {
                          ...review,
                          id: uid(),
                          user: state.user?.name || DEMO_USER.name,
                        },
                      ],
                    }
                  : p,
              ),
            }));
            setModal(null);
            notify("Ulasan demo tersimpan. Terima kasih!");
          }}
        />
      )}
      {modal?.type === "auth" && (
        <Modal
          title="Selamat datang di Fishit"
          subtitle="Cukup nama panggilan untuk mencoba. Tidak perlu akun atau kata sandi."
          onClose={() => setModal(null)}
        >
          <div className="auth-illustration">
            <Fish size={52} strokeWidth={1.3} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = new FormData(e.currentTarget).get("name").trim();
              if (!name) return;
              setState((prev) => ({ ...prev, user: { ...DEMO_USER, name } }));
              setModal(modal.afterLogin ? { type: modal.afterLogin } : null);
              notify(`Halo, ${name}! Akun demo siap digunakan.`);
            }}
            className="form-stack"
          >
            <label>
              Nama panggilan
              <input
                name="name"
                placeholder="Contoh: Nabil"
                maxLength={40}
                required
                autoComplete="off"
              />
            </label>
            <button className="button primary" type="submit">
              Mulai sebagai pengunjung <ArrowUpRight size={17} />
            </button>
            <p className="muted small">
              Gunakan nama contoh. Informasi ini hanya disimpan di browser kamu.
            </p>
          </form>
        </Modal>
      )}
      {modal?.type === "profile" && (
        <Modal title="Profil demo" onClose={() => setModal(null)}>
          <div className="profile-card">
            <span className="avatar">
              {state.user.name.charAt(0).toUpperCase()}
            </span>
            <h3>{state.user.name}</h3>
            <span className="badge">Pengunjung demo</span>
            <p>
              {myOrders.length} pesanan · {state.wishlist.length} ikan favorit
            </p>
          </div>
          <div className="form-stack">
            <button
              className="button secondary"
              onClick={() => navigate("orders")}
            >
              <Package size={18} /> Lihat pesanan
            </button>
            <button
              className="button ghost"
              onClick={() => {
                setState((prev) => ({ ...prev, user: null }));
                setModal(null);
                notify(
                  "Keluar dari sesi demo. Riwayat tetap ada di browser ini.",
                );
              }}
            >
              <LogOut size={17} /> Keluar dari sesi
            </button>
          </div>
        </Modal>
      )}
      {modal?.type === "success" && (
        <Modal
          title="Pesanan demo berhasil!"
          subtitle="Tidak ada uang yang ditagihkan. Kamu sudah menyelesaikan simulasi checkout."
          onClose={() => setModal(null)}
        >
          <div className="success-icon">
            <Check size={38} />
          </div>
          <p className="center-text">
            {modal.orders.length > 1
              ? `Belanja kamu dipisah menjadi ${modal.orders.length} pesanan sesuai toko.`
              : "Ikan pilihanmu sudah masuk ke daftar pesanan demo."}
          </p>
          <div className="order-codes">
            {modal.orders.map((order) => (
              <span className="badge" key={order.id}>
                {order.code}
              </span>
            ))}
          </div>
          <button
            className="button primary full"
            onClick={() => navigate("orders")}
          >
            Lacak pesanan demo <Package size={17} />
          </button>
        </Modal>
      )}
      {modal?.type === "cancel" && (
        <Modal
          title="Batalkan pesanan demo?"
          subtitle="Stok ikan akan dikembalikan ke katalog. Tidak ada dana sungguhan yang diproses."
          onClose={() => setModal(null)}
        >
          <div className="dialog-actions">
            <button className="button secondary" onClick={() => setModal(null)}>
              Kembali
            </button>
            <button
              className="button danger"
              onClick={() => {
                setState((prev) => cancelOrder(prev, modal.orderId));
                setModal(null);
                notify("Pesanan dibatalkan dan stok dikembalikan.");
              }}
            >
              Ya, batalkan
            </button>
          </div>
        </Modal>
      )}
      {modal?.type === "reset" && (
        <Modal
          title="Mulai demo dari awal?"
          subtitle="Pesanan, favorit, profil, dan produk yang kamu tambahkan pada demo ini akan dihapus. Sepuluh produk awal akan dipulihkan."
          onClose={() => setModal(null)}
        >
          <div className="dialog-actions">
            <button className="button secondary" onClick={() => setModal(null)}>
              Kembali
            </button>
            <button className="button danger" onClick={reset}>
              <RotateCcw size={16} /> Reset demo
            </button>
          </div>
        </Modal>
      )}
      {modal?.type === "about" && (
        <Modal
          title="Sebuah ide, jadi pengalaman."
          subtitle="Fishit · Proyek UAS Technopreneurship"
          onClose={() => setModal(null)}
        >
          <div className="prose">
            <p>
              Fishit mengeksplorasi pengalaman jual beli ikan hias: mulai dari
              menemukan ikan, berbelanja, sampai memantau pengiriman.
            </p>
            <p>
              Proyek ini dikembangkan oleh <strong>Nadzirin</strong> sebagai
              demo portofolio menggunakan React dan Vite. Seluruh toko, stok,
              ulasan, pembayaran, dan pengiriman di aplikasi adalah data atau
              simulasi demo.
            </p>
            <div className="info-box">
              <Store size={20} />
              <p>
                Coba katalog → tambah ke keranjang → checkout demo → simulasikan
                pengiriman → beri ulasan. Di portal penjual, coba tambah dan
                edit produkmu sendiri.
              </p>
            </div>
            <p>
              Data tersimpan di browser ini. Kamu bisa menghapusnya kapan saja
              melalui <strong>Reset demo</strong>. Jangan masukkan data pribadi
              atau melakukan transfer.
            </p>
          </div>
          <a
            className="button secondary full"
            href="https://github.com/Nadzirin26/Fishit"
            target="_blank"
            rel="noreferrer"
          >
            Jelajahi kode di GitHub <ArrowUpRight size={17} />
          </a>
        </Modal>
      )}
      {modal?.type === "guide" && (
        <Modal
          title="Sebelum membawa ikan pulang"
          subtitle="Checklist awal untuk menikmati hobi dengan lebih bertanggung jawab."
          onClose={() => setModal(null)}
        >
          <ol className="guide-list">
            <li>
              <strong>Kenali kebutuhan spesies.</strong>
              <p>
                Cari tahu ukuran dewasa, kebutuhan ruang, karakter, dan
                kecocokan dengan penghuni akuarium lainnya.
              </p>
            </li>
            <li>
              <strong>Siapkan akuarium terlebih dahulu.</strong>
              <p>
                Pastikan kualitas air dan filtrasi sesuai. Hindari membeli ikan
                hanya karena tampilannya menarik.
              </p>
            </li>
            <li>
              <strong>Periksa informasi penjual.</strong>
              <p>
                Tanyakan kondisi ikan, foto terkini, metode pengiriman, dan
                cakupan garansi sebelum membeli.
              </p>
            </li>
            <li>
              <strong>Pelajari aklimatisasi yang sesuai.</strong>
              <p>
                Ikuti panduan spesies dan kondisi pengiriman. Mintalah bantuan
                penghobi berpengalaman bila ragu.
              </p>
            </li>
          </ol>
          <p className="small muted">
            Konten edukasi umum untuk demo. Kebutuhan tiap spesies dan kondisi
            ikan bisa berbeda.
          </p>
        </Modal>
      )}
    </>
  );
}
