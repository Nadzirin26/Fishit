import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  Truck,
  Upload,
} from "lucide-react";
import { quote, rating, rupiah } from "../lib/marketplace";
import Modal from "./Modal";
import EmptyState from "./EmptyState";

function Summary({ totals }) {
  return (
    <div className="price-summary">
      <div>
        <span>Subtotal produk</span>
        <span>{rupiah(totals.subtotal)}</span>
      </div>
      <div>
        <span>Pengiriman demo ({totals.storeCount} toko)</span>
        <span>
          {totals.shippingCost ? rupiah(totals.shippingCost) : "Gratis"}
        </span>
      </div>
      <div className="summary-total">
        <strong>Total simulasi</strong>
        <strong>{rupiah(totals.total)}</strong>
      </div>
    </div>
  );
}

export function CartDialog({
  lines,
  onClose,
  onQuantity,
  onRemove,
  onCheckout,
  onExplore,
}) {
  const totals = quote(lines);
  const invalid = lines.some(
    (item) => item.quantity > item.stock || item.archived,
  );
  return (
    <Modal
      title="Keranjang belanjamu"
      subtitle={`${lines.reduce((sum, item) => sum + item.quantity, 0)} item pilihan untuk akuariummu.`}
      onClose={onClose}
    >
      {!lines.length ? (
        <EmptyState
          icon={ShoppingBag}
          title="Masih ada ruang untuk ikan baru"
          description="Jelajahi katalog dan tambahkan ikan yang menarik perhatianmu."
          action="Jelajahi katalog"
          onAction={onExplore}
        />
      ) : (
        <>
          <div className="cart-items">
            {lines.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} onError={imageFallback} />
                <div className="cart-item-info">
                  <small>{item.seller}</small>
                  <h3>{item.name}</h3>
                  <strong>{rupiah(item.price)}</strong>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        aria-label={`Kurangi ${item.name}`}
                        onClick={() => onQuantity(item.id, -1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-label={`Jumlah ${item.name}`}>
                        {item.quantity}
                      </span>
                      <button
                        aria-label={`Tambah jumlah ${item.name}`}
                        disabled={item.quantity >= item.stock || item.archived}
                        onClick={() => onQuantity(item.id, 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      className="icon-button delete-button"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Hapus ${item.name} dari keranjang`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {(item.quantity > item.stock || item.archived) && (
                    <p className="field-error">
                      {item.archived
                        ? "Produk disembunyikan penjual. Hapus dari keranjang."
                        : `Stok tersisa ${item.stock}. Kurangi jumlah atau hapus produk.`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Summary totals={totals} />
          <p className="small muted">
            Estimasi demo Rp15.000 per toko. Pilihan ambil langsung tersedia
            saat checkout.
          </p>
          <button
            className="button primary full"
            onClick={onCheckout}
            disabled={invalid}
          >
            Lanjut checkout demo <ArrowRight size={17} />
          </button>
        </>
      )}
    </Modal>
  );
}

export function CheckoutDialog({ lines, user, onPay, onClose }) {
  const [shipping, setShipping] = useState("delivery");
  const [payment, setPayment] = useState("qris");
  const [address, setAddress] = useState("Jl. Akuarium No. 10, Kota Contoh");
  const totals = quote(lines, shipping);
  return (
    <Modal
      title="Checkout demo"
      subtitle="Semua pembayaran dan pengiriman di sini adalah simulasi."
      onClose={onClose}
    >
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          onPay({ shipping, payment, address });
        }}
      >
        <div className="info-box">
          <Info size={19} />
          <p>
            Tidak perlu transfer atau mengisi data pribadi. Alamat contoh sudah
            disiapkan untuk mencoba alurnya.
          </p>
        </div>
        <div>
          <span className="field-title">Penerima demo</span>
          <p className="recipient">
            <span className="avatar small-avatar">
              {user.name.charAt(0).toUpperCase()}
            </span>
            {user.name}
          </p>
        </div>
        <fieldset>
          <legend>Metode penerimaan</legend>
          <div className="choice-grid">
            <label
              className={`choice ${shipping === "delivery" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="shipping"
                value="delivery"
                checked={shipping === "delivery"}
                onChange={() => setShipping("delivery")}
              />
              <Truck size={21} />
              <span>
                <strong>Kirim ke alamat</strong>
                <small>Rp15.000 / toko · Simulasi</small>
              </span>
            </label>
            <label
              className={`choice ${shipping === "pickup" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="shipping"
                value="pickup"
                checked={shipping === "pickup"}
                onChange={() => setShipping("pickup")}
              />
              <Store size={21} />
              <span>
                <strong>Ambil di toko</strong>
                <small>Tanpa biaya kirim</small>
              </span>
            </label>
          </div>
        </fieldset>
        {shipping === "delivery" && (
          <label>
            Alamat contoh
            <textarea
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={300}
              rows={2}
              required
            />
            <span className="field-help">
              Gunakan alamat fiktif, bukan alamat rumahmu.
            </span>
          </label>
        )}
        <fieldset>
          <legend>Metode pembayaran simulasi</legend>
          <div className="choice-grid">
            <label className={`choice ${payment === "qris" ? "selected" : ""}`}>
              <input
                type="radio"
                name="payment"
                checked={payment === "qris"}
                onChange={() => setPayment("qris")}
              />
              <CreditCard size={21} />
              <span>
                <strong>QRIS demo</strong>
                <small>Tanpa pemindaian QR</small>
              </span>
            </label>
            <label
              className={`choice ${payment === "virtual-account" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="payment"
                checked={payment === "virtual-account"}
                onChange={() => setPayment("virtual-account")}
              />
              <Store size={21} />
              <span>
                <strong>Virtual account demo</strong>
                <small>Tanpa transfer bank</small>
              </span>
            </label>
          </div>
        </fieldset>
        <Summary totals={totals} />
        <p className="small muted">
          {totals.storeCount > 1
            ? `Checkout ini menghasilkan ${totals.storeCount} pesanan, masing-masing untuk satu toko.`
            : "Stok demo akan berkurang setelah checkout berhasil."}
        </p>
        <button
          className="button primary full"
          type="submit"
          disabled={
            !lines.length || (shipping === "delivery" && !address.trim())
          }
        >
          Simulasikan pembayaran · {rupiah(totals.total)}{" "}
          <ArrowRight size={17} />
        </button>
      </form>
    </Modal>
  );
}

function imageFallback(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = "/fish-placeholder.svg";
}

export function ProductDialog({
  product,
  isFavorite,
  onWishlist,
  onAdd,
  onChat,
  onClose,
}) {
  const [tab, setTab] = useState("info");
  const score = rating(product.reviews);
  return (
    <Modal title="Kenali ikan pilihanmu" onClose={onClose} wide>
      <div className="product-detail">
        <div className="detail-image">
          <img
            src={product.image}
            alt={product.name}
            width="600"
            height="600"
            onError={imageFallback}
          />
          <span className="detail-image-caption">
            Foto ilustrasi katalog demo · Kondisi dan warna individu dapat
            berbeda.
            {product.imageCredit && (
              <span className="image-credit">
                Foto: {product.imageCredit.author} ·{" "}
                <a
                  href={
                    product.imageCredit.licenseUrl || product.imageCredit.source
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {product.imageCredit.license}
                </a>{" "}
                ·{" "}
                <a
                  href={product.imageCredit.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikimedia Commons
                </a>
              </span>
            )}
          </span>
        </div>
        <div className="detail-info">
          <span className="section-eyebrow">
            {product.category.toUpperCase()} / KOLEKSI FISHIT
          </span>
          <h3>{product.name}</h3>
          <p className="detail-location">
            <MapPin size={15} />
            {product.location} · {product.seller}
          </p>
          <div className="detail-rating">
            <Star size={15} fill={score ? "currentColor" : "none"} />
            {score
              ? `${score} · ${product.reviews.length} ulasan demo`
              : "Belum ada ulasan"}
            <span>Stok {product.stock}</span>
          </div>
          <strong className="detail-price">{rupiah(product.price)}</strong>
          <div className="detail-specs">
            <div>
              <small>Ukuran contoh</small>
              <strong>{product.size || "Bervariasi"}</strong>
            </div>
            <div>
              <small>Satuan pembelian</small>
              <strong>
                {product.category === "tetra" ? "Paket 10 ekor" : "Per item"}
              </strong>
            </div>
          </div>
          <div
            className="detail-tabs"
            role="tablist"
            aria-label="Informasi produk"
          >
            {[
              ["info", "Tentang ikan"],
              ["care", "Sebelum membeli"],
              ["reviews", "Ulasan"],
            ].map(([id, label]) => (
              <button
                id={`tab-${id}`}
                key={id}
                role="tab"
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            className="tab-content"
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
          >
            {tab === "info" && <p>{product.description}</p>}
            {tab === "care" && (
              <div className="prose">
                <p>
                  Pastikan ruang, kualitas air, dan penghuni akuariummu sesuai
                  dengan kebutuhan spesies ini.
                </p>
                <p>
                  Tanyakan ukuran aktual, kondisi kesehatan, foto terkini, dan
                  pilihan pengiriman kepada penjual sebelum membeli di
                  marketplace sungguhan.
                </p>
              </div>
            )}
            {tab === "reviews" &&
              (product.reviews.length ? (
                <div className="reviews-list">
                  {product.reviews.map((r) => (
                    <div key={r.id}>
                      <div>
                        <strong>{r.user}</strong>
                        <span className="review-stars">
                          {"★".repeat(r.rating)}
                        </span>
                      </div>
                      <p>{r.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>
                  Belum ada ulasan. Selesaikan pesanan demo untuk mencoba
                  memberi ulasan.
                </p>
              ))}
          </div>
          <div className="detail-actions">
            <button
              className="button primary"
              disabled={!product.stock || product.archived}
              onClick={onAdd}
            >
              <ShoppingBag size={17} />
              {product.stock ? "Tambah ke keranjang" : "Stok habis"}
            </button>
            <button
              className={`icon-button outlined ${isFavorite ? "favorite-active" : ""}`}
              aria-label={
                isFavorite ? "Hapus dari favorit" : "Simpan ke favorit"
              }
              aria-pressed={isFavorite}
              onClick={onWishlist}
            >
              <Heart size={19} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          <button className="button ghost full" onClick={onChat}>
            <MessageCircle size={17} /> Coba chat penjual
          </button>
        </div>
      </div>
    </Modal>
  );
}

const suggestions = [
  "Apakah ikannya tersedia?",
  "Bagaimana pengirimannya?",
  "Apakah ada garansi?",
];
export function ChatDialog({ product, onClose }) {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `Halo! Ini asisten demo ${product.seller}. Coba tanyakan tentang ${product.name}. Balasan dibuat otomatis, bukan dari penjual sungguhan.`,
    },
  ]);
  const [input, setInput] = useState("");
  const end = useRef(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages]);
  const send = (text) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    const lower = cleaned.toLowerCase();
    const reply = /stok|tersedia|ready/.test(lower)
      ? `Di katalog demo, stok ${product.name} tersedia ${product.stock} item dengan harga ${rupiah(product.price)} per item.`
      : /kirim|packing/.test(lower)
        ? "Pada demo ini, ongkir ditetapkan Rp15.000 per toko atau gratis untuk ambil langsung. Setelah checkout, kamu bisa mencoba setiap tahap pengiriman di halaman Pesanan."
        : /garansi|mati|doa/.test(lower)
          ? "Pada marketplace sungguhan, cakupan garansi D.O.A perlu disepakati dengan penjual sebelum membeli. Demo Fishit tidak menyediakan garansi atau pengiriman nyata."
          : "Ini percakapan simulasi. Coba tanyakan stok, pengiriman, atau garansi menggunakan pilihan di bawah. Tidak ada pesan yang dikirim ke penjual.";
    setMessages((prev) => [
      ...prev,
      { from: "user", text: cleaned },
      { from: "bot", text: reply },
    ]);
    setInput("");
  };
  return (
    <Modal
      title={product.seller}
      subtitle="Asisten demo · Balasan otomatis · Tidak tersambung ke penjual"
      onClose={onClose}
    >
      <div className="chat-product">
        <img src={product.image} alt="" onError={imageFallback} />
        <span>{product.name}</span>
      </div>
      <div
        className="chat-messages"
        role="log"
        aria-label="Percakapan demo"
        aria-live="polite"
      >
        {messages.map((message, i) => (
          <div className={`chat-message ${message.from}`} key={i}>
            {message.text}
          </div>
        ))}
        <div ref={end} />
      </div>
      <div className="chat-suggestions">
        {suggestions.map((suggestion) => (
          <button key={suggestion} onClick={() => send(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          aria-label="Pesan demo"
          value={input}
          maxLength={500}
          placeholder="Tulis pesan contoh..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="icon-button"
          type="submit"
          disabled={!input.trim()}
          aria-label="Kirim pesan demo"
        >
          <Send size={20} />
        </button>
      </form>
    </Modal>
  );
}

export function ReviewDialog({ onSave, onClose }) {
  const [score, setScore] = useState(5);
  const [text, setText] = useState("");
  const [condition, setCondition] = useState("safe");
  return (
    <Modal
      title="Bagaimana pengalamanmu?"
      subtitle="Coba beri ulasan untuk pesanan demo yang sudah tiba."
      onClose={onClose}
    >
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim())
            onSave({ rating: score, text: text.trim(), condition });
        }}
      >
        <fieldset>
          <legend>Penilaian pesanan</legend>
          <div className="rating-picker">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setScore(n)}
                aria-label={`${n} bintang`}
                aria-pressed={score === n}
              >
                <Star size={32} fill={n <= score ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <p className="small muted">{score} dari 5 bintang</p>
        </fieldset>
        <label>
          Kondisi ikan pada simulasi
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="safe">Tiba dalam kondisi baik</option>
            <option value="issue">Ada kendala saat diterima</option>
          </select>
        </label>
        {condition === "issue" && (
          <div className="info-box">
            <Info size={18} />
            <p>
              Catatan kendala ini hanya bagian dari demo. Tidak ada klaim
              garansi atau refund yang diproses.
            </p>
          </div>
        )}
        <label>
          Ceritakan pengalaman demo
          <textarea
            rows={3}
            maxLength={500}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contoh: Alur checkout mudah dipahami..."
            required
          />
        </label>
        <button
          className="button primary full"
          type="submit"
          disabled={!text.trim()}
        >
          Simpan ulasan demo <Check size={17} />
        </button>
      </form>
    </Modal>
  );
}

export function ProductForm({ product, categories, onSave, onClose, notify }) {
  const [form, setForm] = useState(() =>
    product
      ? { ...product }
      : {
          name: "",
          price: "",
          stock: "10",
          category: "cupang",
          size: "",
          description: "",
          image: "/fish-placeholder.svg",
        },
  );
  const [reading, setReading] = useState(false);
  const readerRef = useRef(null);
  const fileRef = useRef(null);
  useEffect(
    () => () => {
      if (readerRef.current?.readyState === 1) readerRef.current.abort();
    },
    [],
  );
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const upload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 600 * 1024
    ) {
      notify("Pilih JPG, PNG, atau WebP dengan ukuran maksimal 600 KB.");
      e.target.value = "";
      return;
    }
    if (readerRef.current?.readyState === 1) readerRef.current.abort();
    setReading(true);
    const reader = new FileReader();
    readerRef.current = reader;
    reader.onload = () => {
      update("image", reader.result);
      setReading(false);
    };
    reader.onerror = () => {
      notify("Foto gagal dibaca. Coba file lain.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  };
  return (
    <Modal
      title={product ? "Edit produk demo" : "Tambahkan ikan pilihanmu"}
      subtitle="Produk disimpan di browser ini dan akan tampil di katalog demo."
      onClose={onClose}
    >
      <form
        className="form-stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (!reading) onSave(form);
        }}
      >
        <div className="image-upload">
          <img
            src={form.image}
            alt="Pratinjau foto produk"
            onError={imageFallback}
          />
          <div>
            <label className="button secondary upload-label">
              <Upload size={16} /> Pilih foto
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={upload}
              />
            </label>
            <p className="field-help">
              JPG, PNG, WebP · Maksimal 600 KB.
              <br />
              Gunakan gambar yang boleh kamu pakai.
            </p>
            {form.image !== "/fish-placeholder.svg" && (
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  if (readerRef.current?.readyState === 1)
                    readerRef.current.abort();
                  setReading(false);
                  update("image", "/fish-placeholder.svg");
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                Hapus foto
              </button>
            )}
          </div>
        </div>
        <label>
          Nama ikan
          <input
            required
            maxLength={90}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Contoh: Cupang Plakat Koi"
          />
        </label>
        <div className="form-columns">
          <label>
            Harga (Rp)
            <input
              required
              type="number"
              min="1"
              max="100000000"
              step="1"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="45000"
            />
          </label>
          <label>
            Stok
            <input
              required
              type="number"
              min="0"
              max="10000"
              step="1"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
            />
          </label>
        </div>
        <div className="form-columns">
          <label>
            Kategori
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {categories.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ukuran contoh
            <input
              maxLength={30}
              value={form.size}
              onChange={(e) => update("size", e.target.value)}
              placeholder="4–5 cm"
            />
          </label>
        </div>
        <label>
          Deskripsi
          <textarea
            required
            maxLength={1000}
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Ceritakan warna, karakter, dan kebutuhan ikan..."
          />
        </label>
        <button
          type="submit"
          className="button primary full"
          disabled={reading}
        >
          {reading
            ? "Membaca foto..."
            : product
              ? "Simpan perubahan"
              : "Terbitkan ke katalog demo"}{" "}
          <ArrowRight size={17} />
        </button>
      </form>
    </Modal>
  );
}
