export const STORAGE_KEY = "fishit_portfolio_v2";
export const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
export const uid = () => crypto.randomUUID();
export const rating = (reviews) =>
  reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : null;

export function cartLines(cart, products) {
  return cart.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? [{ ...product, quantity: item.quantity }] : [];
  });
}

export function quote(lines, shipping = "delivery") {
  const groups = [...new Set(lines.map((item) => item.sellerId))];
  const subtotal = lines.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = shipping === "pickup" ? 0 : groups.length * 15000;
  return {
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    storeCount: groups.length,
  };
}

export function createCheckout(state, { user, address, shipping, payment }) {
  const lines = cartLines(state.cart, state.products);
  if (!lines.length) throw new Error("Keranjang kosong atau stok sudah habis.");
  if (
    lines.length !== state.cart.length ||
    lines.some(
      (line) =>
        line.quantity > line.stock ||
        line.archived ||
        !Number.isInteger(line.quantity) ||
        line.quantity <= 0,
    )
  ) {
    throw new Error("Stok berubah. Periksa kembali jumlah di keranjang.");
  }
  if (!user) throw new Error("Masuk ke akun demo terlebih dahulu.");
  if (
    !["delivery", "pickup"].includes(shipping) ||
    !["qris", "virtual-account"].includes(payment)
  )
    throw new Error("Pilih metode penerimaan dan pembayaran yang tersedia.");
  if (shipping !== "pickup" && !address.trim())
    throw new Error("Isi alamat contoh untuk simulasi pengiriman.");
  const checkoutId = uid();
  const orders = [...new Set(lines.map((line) => line.sellerId))].map(
    (sellerId) => {
      const items = lines.filter((line) => line.sellerId === sellerId);
      return {
        id: uid(),
        code: `FS-${uid().slice(0, 8).toUpperCase()}`,
        checkoutId,
        userId: user.id,
        sellerId,
        seller: items[0].seller,
        items: structuredClone(items),
        ...quote(items, shipping),
        shipping,
        payment,
        address: address.trim(),
        recipient: user.name,
        createdAt: new Date().toISOString(),
        step: 0,
        history: [{ step: 0, at: new Date().toISOString() }],
        cancelled: false,
        review: null,
      };
    },
  );
  return {
    ...state,
    cart: [],
    orders: [...orders, ...state.orders],
    products: state.products.map((product) => ({
      ...product,
      stock:
        product.stock -
        (lines.find((line) => line.id === product.id)?.quantity || 0),
    })),
  };
}

export function cancelOrder(state, orderId) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order || order.cancelled || order.step > 0) return state;
  return {
    ...state,
    orders: state.orders.map((item) =>
      item.id === orderId ? { ...item, cancelled: true } : item,
    ),
    products: state.products.map((product) => ({
      ...product,
      stock:
        product.stock +
        (order.items.find((item) => item.id === product.id)?.quantity || 0),
    })),
  };
}

export function nextOrderStep(state, orderId) {
  return {
    ...state,
    orders: state.orders.map((order) => {
      if (order.id !== orderId || order.cancelled || order.step >= 3)
        return order;
      const step = order.step + 1;
      return {
        ...order,
        step,
        history: [...order.history, { step, at: new Date().toISOString() }],
      };
    }),
  };
}

export function validateProduct(product) {
  if (!product.name.trim() || !product.description.trim())
    return "Nama dan deskripsi produk wajib diisi.";
  if (
    !Number.isSafeInteger(Number(product.price)) ||
    Number(product.price) <= 0 ||
    Number(product.price) > 100000000
  )
    return "Harga harus berupa rupiah bulat antara 1 dan 100 juta.";
  if (
    !Number.isSafeInteger(Number(product.stock)) ||
    Number(product.stock) < 0 ||
    Number(product.stock) > 10000
  )
    return "Stok harus berupa bilangan bulat antara 0 dan 10.000.";
  return null;
}

export function loadDemo(initialProducts) {
  const fallback = {
    products: structuredClone(initialProducts),
    cart: [],
    wishlist: [],
    orders: [],
    user: null,
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      !saved ||
      !Array.isArray(saved.products) ||
      !Array.isArray(saved.orders) ||
      !Array.isArray(saved.cart) ||
      !Array.isArray(saved.wishlist)
    )
      return fallback;
    const validProduct = (p) =>
      p &&
      typeof p.id === "string" &&
      typeof p.name === "string" &&
      typeof p.sellerId === "string" &&
      typeof p.seller === "string" &&
      typeof p.category === "string" &&
      typeof p.image === "string" &&
      Number.isSafeInteger(p.price) &&
      p.price > 0 &&
      Number.isInteger(p.stock) &&
      p.stock >= 0 &&
      Array.isArray(p.reviews) &&
      p.reviews.every(
        (r) =>
          r &&
          Number.isInteger(r.rating) &&
          r.rating >= 1 &&
          r.rating <= 5 &&
          typeof r.text === "string",
      );
    if (
      !saved.products.every(validProduct) ||
      !saved.cart.every(
        (item) =>
          item &&
          typeof item.productId === "string" &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0,
      ) ||
      !saved.wishlist.every((id) => typeof id === "string") ||
      !saved.orders.every(
        (o) =>
          o &&
          typeof o.id === "string" &&
          Array.isArray(o.items) &&
          o.items.every(
            (i) =>
              validProduct(i) && Number.isInteger(i.quantity) && i.quantity > 0,
          ) &&
          Number.isInteger(o.step) &&
          o.step >= 0 &&
          o.step <= 3 &&
          Number.isFinite(o.total) &&
          Array.isArray(o.history) &&
          typeof o.createdAt === "string" &&
          typeof o.userId === "string" &&
          typeof o.sellerId === "string" &&
          (!o.review ||
            (Number.isInteger(o.review.rating) &&
              o.review.rating >= 1 &&
              o.review.rating <= 5 &&
              typeof o.review.text === "string")),
      )
    )
      return fallback;
    if (
      saved.user &&
      (typeof saved.user.id !== "string" ||
        typeof saved.user.name !== "string" ||
        typeof saved.user.email !== "string")
    )
      return fallback;
    return { ...fallback, ...saved };
  } catch {
    return fallback;
  }
}
