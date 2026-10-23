import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  Play,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { STEPS } from "../data/catalog";
import { rupiah } from "../lib/marketplace";
import EmptyState from "../components/EmptyState";

export function OrderCard({
  order,
  onAdvance,
  onCancel,
  onReview,
  compact = false,
}) {
  const [expanded, setExpanded] = useState(!compact);
  const complete = order.step === 3;
  const labels =
    order.shipping === "pickup"
      ? [STEPS[0], STEPS[1], "Siap diambil", "Sudah diambil"]
      : STEPS;
  return (
    <article className={`order-card ${order.cancelled ? "cancelled" : ""}`}>
      <div className="order-card-top">
        <div>
          <span className="order-code">{order.code}</span>
          <span className="order-date">
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <span
          className={`status-badge ${order.cancelled ? "status-cancel" : complete ? "status-complete" : ""}`}
        >
          {order.cancelled ? "Dibatalkan" : labels[order.step]}
        </span>
      </div>
      <div className="order-store">
        <Store size={16} />
        <strong>{order.seller}</strong>
        <span className="badge">Demo</span>
      </div>
      <div className="order-items">
        {order.items.map((item) => (
          <div key={item.id}>
            <img src={item.image} alt={item.name} />
            <span>
              <strong>{item.name}</strong>
              <small>
                {item.quantity} × {rupiah(item.price)}
              </small>
            </span>
            <b>{rupiah(item.price * item.quantity)}</b>
          </div>
        ))}
      </div>
      <div className="order-total-row">
        <span>
          Total <small>(termasuk ongkir {rupiah(order.shippingCost)})</small>
        </span>
        <strong>{rupiah(order.total)}</strong>
      </div>
      <button
        className="order-expand"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? "Sembunyikan detail" : "Lihat detail pengiriman"}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expanded && (
        <div className="order-details">
          <p className="order-address">
            {order.shipping === "pickup" ? (
              <Store size={17} />
            ) : (
              <MapPin size={17} />
            )}
            <span>
              <strong>{order.recipient}</strong>
              {order.shipping === "pickup"
                ? "Ambil langsung di toko (simulasi)"
                : order.address}
            </span>
          </p>
          {!order.cancelled && (
            <ol className="timeline">
              {STEPS.map((step, i) => {
                const event = order.history.find((h) => h.step === i);
                return (
                  <li key={step} className={i <= order.step ? "done" : ""}>
                    <span className="timeline-dot">
                      {i < order.step ? <Check size={13} /> : i + 1}
                    </span>
                    <div>
                      <strong>
                        {order.shipping === "pickup" && i === 2
                          ? "Siap diambil"
                          : order.shipping === "pickup" && i === 3
                            ? "Sudah diambil"
                            : step}
                      </strong>
                      <small>
                        {event
                          ? new Date(event.at).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Menunggu tahap sebelumnya"}
                      </small>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <p className="small muted">
            Pembayaran {order.payment === "qris" ? "QRIS" : "virtual account"}{" "}
            demo · Tidak ada transaksi nyata.
          </p>
        </div>
      )}
      {!order.cancelled && (
        <div className="order-actions">
          {order.step === 0 && onCancel && (
            <button
              className="text-button danger-text"
              onClick={() => onCancel(order.id)}
            >
              Batalkan pesanan
            </button>
          )}
          {!complete && (
            <button
              className="button secondary"
              onClick={() => onAdvance(order.id)}
            >
              <Play size={15} /> Simulasikan tahap berikutnya{" "}
              <ArrowRight size={15} />
            </button>
          )}
          {complete && !order.review && onReview && (
            <button
              className="button primary"
              onClick={() => onReview(order.id)}
            >
              <Star size={16} /> Beri ulasan demo
            </button>
          )}
          {order.review && (
            <div className="saved-review">
              <span className="review-stars">
                {"★".repeat(order.review.rating)}
              </span>
              <p>{order.review.text}</p>
              <small>
                {order.review.condition === "safe"
                  ? "Kondisi baik pada simulasi"
                  : "Kendala dicatat pada simulasi"}
              </small>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function Orders({
  orders,
  onExplore,
  onAdvance,
  onCancel,
  onReview,
}) {
  const [filter, setFilter] = useState("all");
  const visible = orders.filter(
    (o) =>
      filter === "all" ||
      (filter === "active"
        ? !o.cancelled && o.step < 3
        : filter === "complete"
          ? !o.cancelled && o.step === 3
          : o.cancelled),
  );
  return (
    <div className="container inner-page">
      <div className="page-heading">
        <span className="section-eyebrow">DARI TOKO KE AKUARIUMMU</span>
        <h1 className="section-title">
          Perjalanan <em>pesananmu.</em>
        </h1>
        <p className="section-description">
          Pantau setiap tahap dan coba pengalaman menerima ikan pilihanmu.
        </p>
      </div>
      <div className="info-box order-info">
        <Truck size={22} />
        <p>
          <strong>Kamu yang menggerakkan demo ini.</strong> Tekan “Simulasikan
          tahap berikutnya” pada pesanan untuk mencoba proses pengemasan hingga
          ikan tiba. Untuk ambil langsung, tahap pengiriman menjadi proses
          pengambilan.
        </p>
      </div>
      <div className="order-filter" aria-label="Filter pesanan">
        {[
          ["all", "Semua"],
          ["active", "Berlangsung"],
          ["complete", "Selesai"],
          ["cancelled", "Dibatalkan"],
        ].map(([key, text]) => (
          <button
            className={filter === key ? "active" : ""}
            key={key}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
          >
            {text}
            {key === "all" && <span>{orders.length}</span>}
          </button>
        ))}
      </div>
      {visible.length ? (
        <div className="orders-grid">
          {visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAdvance={onAdvance}
              onCancel={onCancel}
              onReview={onReview}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title={
            orders.length
              ? "Belum ada pesanan di sini"
              : "Cerita pesananmu dimulai di katalog"
          }
          description={
            orders.length
              ? "Coba filter lain untuk melihat pesanan demo kamu."
              : "Pilih ikan, selesaikan checkout demo, lalu ikuti perjalanan pesananmu di halaman ini."
          }
          action="Jelajahi katalog"
          onAction={onExplore}
        />
      )}
    </div>
  );
}
