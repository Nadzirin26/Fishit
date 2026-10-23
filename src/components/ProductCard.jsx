import { Heart, MapPin, Plus, Star } from "lucide-react";
import { rating, rupiah } from "../lib/marketplace";
export default function ProductCard({
  product,
  isFavorite,
  onWishlist,
  onAdd,
  onDetail,
}) {
  const score = rating(product.reviews);
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <button
          className="product-image-link"
          onClick={() => onDetail(product.id)}
          aria-label={`Lihat detail ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width="400"
            height="300"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/fish-placeholder.svg";
            }}
          />
        </button>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className={`favorite-button ${isFavorite ? "selected" : ""}`}
          onClick={() => onWishlist(product.id)}
          aria-label={`${isFavorite ? "Hapus" : "Simpan"} ${product.name} ${isFavorite ? "dari" : "ke"} favorit`}
          aria-pressed={isFavorite}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        {product.stock === 0 && <span className="sold-out">Stok habis</span>}
      </div>
      <div className="product-content">
        <div className="product-meta">
          <span>{product.size || "Ukuran bervariasi"}</span>
          <span>
            <Star size={12} fill={score ? "currentColor" : "none"} />
            {score || "Baru"}
            {score && <small>({product.reviews.length})</small>}
          </span>
        </div>
        <h3>
          <button onClick={() => onDetail(product.id)}>{product.name}</button>
        </h3>
        <p className="product-location">
          <MapPin size={13} />
          <span>
            {product.location} · {product.seller}
          </span>
        </p>
        <div className="product-bottom">
          <div>
            <strong>{rupiah(product.price)}</strong>
            <small>
              {product.category === "tetra" ? "per paket" : "per item"} · Stok{" "}
              {product.stock}
            </small>
          </div>
          <button
            className="add-button"
            disabled={!product.stock}
            aria-label={`Tambah ${product.name} ke keranjang`}
            onClick={() => onAdd(product)}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}
