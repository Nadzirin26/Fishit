import { useState } from "react";
import {
  ArrowUpRight,
  Banknote,
  Edit3,
  Eye,
  EyeOff,
  Fish,
  Package,
  Plus,
  Store,
} from "lucide-react";
import { DEMO_STORE } from "../data/catalog";
import { rupiah } from "../lib/marketplace";
import EmptyState from "../components/EmptyState";
import { OrderCard } from "./Orders";

export default function SellerDashboard({
  products,
  orders,
  onAdd,
  onEdit,
  onArchive,
  onAdvance,
  onExplore,
}) {
  const [tab, setTab] = useState("products");
  const storeOrders = orders.filter((o) => o.sellerId === DEMO_STORE.id);
  const finished = storeOrders.filter((o) => o.step === 3 && !o.cancelled);
  const revenue = finished.reduce((sum, o) => sum + o.subtotal, 0);
  const active = storeOrders.filter((o) => !o.cancelled && o.step < 3);
  return (
    <div className="container inner-page seller-page">
      <div className="seller-heading">
        <div className="page-heading">
          <span className="section-eyebrow">DI BALIK ETALASE</span>
          <h1 className="section-title">
            Halo, <em>pemilik toko.</em>
          </h1>
          <p className="section-description">
            Ruang kecil untuk mengelola ikan pilihan dan pesananmu.
          </p>
        </div>
        <button className="button primary" onClick={onAdd}>
          <Plus size={18} /> Tambah produk
        </button>
      </div>
      <div className="seller-layout">
        <aside className="seller-sidebar">
          <div className="store-avatar">
            <Store size={29} />
          </div>
          <h2>{DEMO_STORE.name}</h2>
          <p>{DEMO_STORE.location}</p>
          <span className="badge">Toko demo milikmu</span>
          <div className="seller-side-nav">
            <button
              className={tab === "products" ? "active" : ""}
              onClick={() => setTab("products")}
            >
              <Fish size={18} /> Etalase produk <span>{products.length}</span>
            </button>
            <button
              className={tab === "orders" ? "active" : ""}
              onClick={() => setTab("orders")}
            >
              <Package size={18} /> Pesanan toko{" "}
              <span>{storeOrders.length}</span>
            </button>
          </div>
          <div className="seller-tip">
            <strong>Mulai dari satu ikan.</strong>
            <p>
              Tambahkan produk, temukan di katalog, lalu beli lewat checkout
              demo untuk melihat pesanan masuk di toko ini.
            </p>
            <button className="text-button" onClick={onExplore}>
              Buka katalog <ArrowUpRight size={15} />
            </button>
          </div>
        </aside>
        <div className="seller-main">
          <div className="stats-grid">
            <div>
              <span>
                <Banknote size={17} /> Penjualan selesai
              </span>
              <strong>{rupiah(revenue)}</strong>
              <small>Nilai produk, di luar ongkir</small>
            </div>
            <div>
              <span>
                <Package size={17} /> Pesanan aktif
              </span>
              <strong>{active.length.toString().padStart(2, "0")}</strong>
              <small>Menunggu proses berikutnya</small>
            </div>
            <div>
              <span>
                <Fish size={17} /> Produk di etalase
              </span>
              <strong>
                {products
                  .filter((p) => !p.archived)
                  .length.toString()
                  .padStart(2, "0")}
              </strong>
              <small>
                {products.filter((p) => p.archived).length} produk disembunyikan
              </small>
            </div>
          </div>
          <section className="seller-panel">
            <div className="seller-panel-heading">
              <div>
                <h2>
                  {tab === "products" ? "Etalase produkmu" : "Pesanan masuk"}
                </h2>
                <p>
                  {tab === "products"
                    ? "Kelola stok, detail, dan visibilitas produk demo."
                    : "Hanya pesanan untuk Aquatic Studio yang tampil di sini."}
                </p>
              </div>
              <span className="badge">
                {tab === "products" ? products.length : storeOrders.length}{" "}
                {tab === "products" ? "produk" : "pesanan"}
              </span>
            </div>
            {tab === "products" ? (
              products.length ? (
                <div className="seller-products">
                  {products.map((product) => (
                    <article key={product.id}>
                      <img src={product.image} alt={product.name} />
                      <div>
                        <h3>{product.name}</h3>
                        <p>
                          {rupiah(product.price)}{" "}
                          <span>· Stok {product.stock}</span>
                        </p>
                        <span
                          className={`status-badge ${product.archived ? "status-cancel" : "status-complete"}`}
                        >
                          {product.archived
                            ? "Disembunyikan"
                            : product.stock
                              ? "Aktif"
                              : "Stok habis"}
                        </span>
                      </div>
                      <div className="seller-product-actions">
                        <button
                          className="icon-button outlined"
                          onClick={() => onEdit(product.id)}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="icon-button outlined"
                          onClick={() => onArchive(product.id)}
                          aria-label={`${product.archived ? "Tampilkan" : "Sembunyikan"} ${product.name}`}
                        >
                          {product.archived ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Etalase siap diisi"
                  description="Coba tambahkan ikan dengan nama, foto, harga, dan stok pilihanmu. Produk akan langsung muncul di katalog demo."
                  action="Tambah produk pertama"
                  onAction={onAdd}
                />
              )
            ) : storeOrders.length ? (
              <div className="seller-orders">
                {storeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAdvance={onAdvance}
                    compact
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="Belum ada pesanan untuk tokomu"
                description="Tambahkan produk dari toko ini, lalu lakukan checkout dari katalog untuk mencoba alur pesanan penjual."
                action="Jelajahi katalog"
                onAction={onExplore}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
