import { Fish, Search, ShoppingBag, Store, UserRound } from "lucide-react";
export default function Header({
  page,
  navigate,
  query,
  onSearch,
  itemCount,
  user,
  onCart,
  onUser,
}) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#home" aria-label="Fishit beranda">
          <Fish size={31} strokeWidth={1.8} />
          <span>
            fishit<span className="brand-dot">.</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navigasi utama">
          {[
            ["home", "Jelajahi"],
            ["wishlist", "Favorit"],
            ["orders", "Pesanan"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={page === key ? "active" : ""}
              aria-current={page === key ? "page" : undefined}
              onClick={() => navigate(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="header-search">
          <Search size={17} />
          <input
            aria-label="Cari ikan atau toko"
            placeholder="Cari ikan atau toko..."
            value={query}
            onChange={(e) => onSearch(e.target.value)}
          />
          {query && (
            <button
              className="search-clear"
              aria-label="Hapus pencarian"
              onClick={() => onSearch("")}
            >
              ×
            </button>
          )}
        </div>
        <div className="header-actions">
          <button
            className="seller-link"
            aria-label="Portal penjual"
            aria-current={page === "seller" ? "page" : undefined}
            onClick={() => navigate("seller")}
          >
            <Store size={17} />
            <span>Portal penjual</span>
          </button>
          <span className="header-divider" />
          <button
            className="icon-button cart-button"
            onClick={onCart}
            aria-label={`Buka keranjang, ${itemCount} item`}
          >
            <ShoppingBag size={21} />
            {itemCount > 0 && (
              <span className="count-badge">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
          <button
            className={`icon-button user-button ${user ? "signed-in" : ""}`}
            onClick={onUser}
            aria-label={user ? `Profil ${user.name}` : "Masuk demo"}
          >
            {user ? user.name.charAt(0).toUpperCase() : <UserRound size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}
