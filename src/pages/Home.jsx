import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Fish,
  Heart,
  SearchX,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  Truck,
  X,
} from "lucide-react";
import { CATEGORIES } from "../data/catalog";
import { rating } from "../lib/marketplace";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
export default function Home({
  products,
  wishlist,
  onWishlist,
  onAdd,
  onDetail,
  query,
  setQuery,
  category,
  setCategory,
  favoritesOnly,
  onExplore,
}) {
  const [sort, setSort] = useState("recommended");
  const [inStock, setInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const CatalogHeading = favoritesOnly || query ? "h1" : "h2";
  const visible = products.filter(
    (p) =>
      !p.archived &&
      (!favoritesOnly || wishlist.includes(p.id)) &&
      (category === "all" || p.category === category) &&
      (!inStock || p.stock > 0) &&
      `${p.name} ${p.seller} ${p.location}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  if (sort === "price-low") visible.sort((a, b) => a.price - b.price);
  if (sort === "price-high") visible.sort((a, b) => b.price - a.price);
  if (sort === "rating")
    visible.sort(
      (a, b) => Number(rating(b.reviews) || 0) - Number(rating(a.reviews) || 0),
    );
  const explore = () =>
    document
      .getElementById("catalog")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div className="container home-page">
      {!favoritesOnly && !query && (
        <>
          <div className="section-eyebrow top-eyebrow">
            <span>
              <span className="tiny-fish">✦</span> PILIHAN UNTUK PENGHOBI
              AKUATIK
            </span>
            <span className="edition">FISHIT COLLECTION / 01</span>
          </div>
          <section className="hero">
            <div className="hero-copy">
              <span className="hero-label">
                <span className="live-dot" /> DARI HOBI, UNTUK HOBI
              </span>
              <h1>
                Sepotong dunia air.
                <br />
                Sejuta <em>warna baru.</em>
              </h1>
              <p>
                Temukan ikan hias pilihan untuk menghidupkan akuariummu. Karena
                setiap ikan pantas menemukan rumah yang tepat.
              </p>
              <button className="button cream" onClick={explore}>
                Temukan ikanmu <ArrowUpRight size={19} />
              </button>
              <div className="hero-footnote">
                <span className="stacked-circles">
                  <Fish size={16} />
                  <Sprout size={16} />
                  <Heart size={16} />
                </span>
                <span>Mulai cerita akuariummu di sini.</span>
              </div>
            </div>
            <div className="hero-visual">
              <img
                src="/images/cupang_halfmoon_gold.jpg"
                alt="Cupang Halfmoon berwarna emas dengan sirip lebar di dalam akuarium"
                fetchPriority="high"
                width="1200"
                height="896"
              />
              <div className="hero-image-shade" />
              <div className="hero-product">
                <span>PILIHAN KATALOG</span>
                <button onClick={() => onDetail("2")}>
                  Halfmoon Sun Gold <ArrowUpRight size={19} />
                </button>
                <p>Betta splendens · Cupang hias</p>
              </div>
              <span className="hero-number">
                01 / {products.filter((product) => !product.archived).length}
              </span>
            </div>
          </section>
          <div className="benefits">
            <div>
              <ShieldCheck />
              <span>
                <strong>Kenali sebelum membeli</strong>
                <small>Detail ikan & ulasan dalam satu tempat</small>
              </span>
            </div>
            <div>
              <Truck />
              <span>
                <strong>Pengiriman yang terencana</strong>
                <small>Coba alur packing hingga tiba</small>
              </span>
            </div>
            <div>
              <Sprout />
              <span>
                <strong>Lebih dari sekadar koleksi</strong>
                <small>Mulai dengan memahami kebutuhannya</small>
              </span>
            </div>
          </div>
        </>
      )}
      <section id="catalog" className="catalog-section">
        <div className="catalog-title-row">
          <div>
            <span className="section-eyebrow">
              {favoritesOnly ? "KOLEKSI PERSONAL" : "TEMUKAN YANG COCOK"}
            </span>
            <CatalogHeading className="section-title">
              {favoritesOnly ? (
                <>
                  Ikan <em>favoritmu.</em>
                </>
              ) : (
                <>
                  Penghuni baru <em>akuariummu.</em>
                </>
              )}
            </CatalogHeading>
            <p className="section-description">
              {favoritesOnly
                ? "Simpan yang menarik perhatianmu. Kunjungi lagi saat kamu siap."
                : "Dari sirip yang anggun sampai warna yang berani. Mana pilihanmu?"}
            </p>
          </div>
          <span className="catalog-counter">
            {visible.length} pilihan <ArrowDown size={16} />
          </span>
        </div>
        <div className="catalog-controls">
          <div className="category-list" aria-label="Kategori ikan">
            {CATEGORIES.map(([id, name]) => (
              <button
                key={id}
                className={`category-chip ${category === id ? "active" : ""}`}
                aria-pressed={category === id}
                onClick={() => setCategory(id)}
              >
                {id === "all" && <Fish size={16} />}
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-row">
          <p>
            {query ? (
              <>
                Hasil untuk <strong>“{query}”</strong>{" "}
                <button
                  className="inline-clear"
                  onClick={() => setQuery("")}
                  aria-label="Hapus kata pencarian"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                Menampilkan <strong>{visible.length}</strong> pilihan ikan hias
              </>
            )}
          </p>
          <div className="filter-actions">
            <button
              className={`filter-toggle ${inStock ? "active" : ""}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={16} /> Filter
              {inStock && <span className="filter-dot" />}
            </button>
            <label className="sort-control">
              <span>Urutkan:</span>
              <select
                aria-label="Urutkan produk"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recommended">Pilihan kami</option>
                <option value="price-low">Harga terendah</option>
                <option value="price-high">Harga tertinggi</option>
                <option value="rating">Rating tertinggi</option>
              </select>
            </label>
          </div>
        </div>
        {filtersOpen && (
          <div className="filter-panel">
            <label className="filter-category">
              Kategori ikan
              <select
                aria-label="Pilih kategori ikan"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />{" "}
              Hanya tampilkan stok tersedia
            </label>
            <button
              className="text-button"
              onClick={() => {
                setInStock(false);
                setCategory("all");
                setSort("recommended");
                setQuery("");
              }}
            >
              Reset filter
            </button>
          </div>
        )}
        {visible.length ? (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={wishlist.includes(product.id)}
                onWishlist={onWishlist}
                onAdd={onAdd}
                onDetail={onDetail}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={favoritesOnly ? Heart : SearchX}
            title={
              favoritesOnly && !wishlist.length
                ? "Belum ada ikan favorit"
                : "Belum ketemu yang cocok"
            }
            description={
              favoritesOnly && !wishlist.length
                ? "Tekan ikon hati pada ikan yang kamu suka. Koleksimu akan tersimpan di sini."
                : "Coba kata kunci lain atau hapus filter untuk melihat lebih banyak pilihan."
            }
            action={
              favoritesOnly && !wishlist.length
                ? "Jelajahi katalog"
                : "Hapus pencarian & filter"
            }
            onAction={() => {
              setInStock(false);
              setSort("recommended");
              onExplore();
            }}
          />
        )}
      </section>
      {!favoritesOnly && (
        <div className="demo-invitation">
          <span className="badge">GILIRANMU MENCOBA</span>
          <div>
            <h2>Satu demo, dua sudut pandang.</h2>
            <p>
              Sudah mencoba belanja? Lihat bagaimana rasanya mengelola toko
              ikanmu sendiri.
            </p>
          </div>
          <a className="button secondary" href="#seller">
            Coba portal penjual <ArrowRight size={17} />
          </a>
        </div>
      )}
    </div>
  );
}
