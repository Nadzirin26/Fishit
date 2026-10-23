import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  DEMO_USER,
} from "../src/data/catalog.js";
import {
  cancelOrder,
  cartLines,
  createCheckout,
  loadDemo,
  nextOrderStep,
  quote,
  rating,
  validateProduct,
} from "../src/lib/marketplace.js";

const fresh = () => ({
  products: structuredClone(INITIAL_PRODUCTS),
  cart: [],
  wishlist: [],
  orders: [],
  user: DEMO_USER,
});
const delivery = {
  user: DEMO_USER,
  address: "Alamat contoh",
  shipping: "delivery",
  payment: "qris",
};

test("shipping groups products by actual store, including different fish from the same seller", () => {
  const state = fresh();
  state.cart = [
    { productId: "1", quantity: 2 },
    { productId: "10", quantity: 1 },
  ];
  assert.deepEqual(quote(cartLines(state.cart, state.products)), {
    subtotal: 60000,
    shippingCost: 15000,
    total: 75000,
    storeCount: 1,
  });
});
test("multi-store checkout creates separate orders with correct shipping and stock", () => {
  const state = fresh();
  state.cart = [
    { productId: "1", quantity: 2 },
    { productId: "2", quantity: 1 },
  ];
  const next = createCheckout(state, delivery);
  assert.equal(next.orders.length, 2);
  assert.equal(new Set(next.orders.map((o) => o.checkoutId)).size, 1);
  assert.equal(
    next.orders.reduce((sum, o) => sum + o.total, 0),
    105000,
  );
  assert.equal(next.products.find((p) => p.id === "1").stock, 22);
  assert.equal(next.products.find((p) => p.id === "2").stock, 7);
  assert.deepEqual(next.cart, []);
  assert.equal(state.products[0].stock, 24);
  assert.equal(state.orders.length, 0);
});
test("order items remain snapshots after the catalogue changes", () => {
  const state = fresh();
  state.cart = [{ productId: "1", quantity: 1 }];
  const next = createCheckout(state, delivery);
  next.products[0].price = 99000;
  next.products[0].reviews.push({ rating: 1, text: "New review" });
  assert.equal(next.orders[0].items[0].price, 15000);
  assert.equal(next.orders[0].items[0].reviews.length, 2);
});
test("checkout refuses empty carts, unknown products, depleted stock, and hidden products", () => {
  assert.throws(() => createCheckout(fresh(), delivery));
  for (const quantity of [0, -1, 1.5, 25]) {
    const state = fresh();
    state.cart = [{ productId: "1", quantity }];
    assert.throws(() => createCheckout(state, delivery));
  }
  const state = fresh();
  state.cart = [{ productId: "missing", quantity: 1 }];
  assert.throws(() => createCheckout(state, delivery));
  state.cart = [{ productId: "1", quantity: 1 }];
  state.products[0].archived = true;
  assert.throws(() => createCheckout(state, delivery));
});
test("checkout requires a demo session and valid delivery options", () => {
  const state = fresh();
  state.cart = [{ productId: "1", quantity: 1 }];
  assert.throws(() => createCheckout(state, { ...delivery, user: null }));
  assert.throws(() => createCheckout(state, { ...delivery, address: "  " }));
  assert.throws(() =>
    createCheckout(state, { ...delivery, shipping: "unknown" }),
  );
  assert.throws(() =>
    createCheckout(state, { ...delivery, payment: "unknown" }),
  );
});
test("pickup is free for every store and does not require a delivery address", () => {
  const state = fresh();
  state.cart = [
    { productId: "1", quantity: 1 },
    { productId: "2", quantity: 1 },
  ];
  const next = createCheckout(state, {
    ...delivery,
    shipping: "pickup",
    address: "",
  });
  assert.equal(
    next.orders.reduce((sum, o) => sum + o.shippingCost, 0),
    0,
  );
  assert.equal(
    next.orders.reduce((sum, o) => sum + o.total, 0),
    60000,
  );
});
test("cancellation restores stock once and cannot cancel an already processed order", () => {
  const state = fresh();
  state.cart = [{ productId: "1", quantity: 3 }];
  const paid = createCheckout(state, delivery);
  const id = paid.orders[0].id;
  const cancelled = cancelOrder(paid, id);
  assert.equal(cancelled.products[0].stock, 24);
  assert.equal(cancelled.orders[0].cancelled, true);
  assert.equal(cancelOrder(cancelled, id), cancelled);
  const advanced = nextOrderStep(paid, id);
  assert.equal(cancelOrder(advanced, id), advanced);
});
test("delivery progresses to the final step and preserves its event history", () => {
  let state = fresh();
  state.cart = [{ productId: "1", quantity: 1 }];
  state = createCheckout(state, delivery);
  const id = state.orders[0].id;
  for (let i = 0; i < 5; i++) state = nextOrderStep(state, id);
  assert.equal(state.orders[0].step, 3);
  assert.deepEqual(
    state.orders[0].history.map((h) => h.step),
    [0, 1, 2, 3],
  );
});
test("cancelled orders cannot progress", () => {
  const state = fresh();
  state.cart = [{ productId: "1", quantity: 1 }];
  const paid = createCheckout(state, delivery);
  const id = paid.orders[0].id;
  const next = nextOrderStep(cancelOrder(paid, id), id);
  assert.equal(next.orders[0].step, 0);
  assert.equal(next.products[0].stock, 24);
});
test("product validation rejects negative, fractional, empty, and excessive values", () => {
  const product = {
    name: "Cupang",
    description: "Contoh ikan",
    price: 15000,
    stock: 5,
  };
  assert.equal(validateProduct(product), null);
  assert.equal(validateProduct({ ...product, stock: 0 }), null);
  for (const price of [-1, 0, "", 0.5, Infinity, 100000001])
    assert.ok(validateProduct({ ...product, price }));
  for (const stock of [-1, 0.5, Infinity, 10001])
    assert.ok(validateProduct({ ...product, stock }));
  assert.ok(validateProduct({ ...product, name: " " }));
  assert.ok(validateProduct({ ...product, description: "" }));
});
test("ratings are calculated from actual demo reviews", () => {
  assert.equal(rating([]), null);
  assert.equal(rating([{ rating: 5 }, { rating: 4 }]), "4.5");
});
test("corrupted or unavailable browser storage falls back to a clean demo", () => {
  for (const value of ["{broken", "null", '{"products":[]}']) {
    globalThis.localStorage = { getItem: () => value };
    assert.equal(
      loadDemo(INITIAL_PRODUCTS).products.length,
      INITIAL_PRODUCTS.length,
    );
    assert.deepEqual(loadDemo(INITIAL_PRODUCTS).cart, []);
  }
  globalThis.localStorage = {
    getItem: () => {
      throw new Error("blocked");
    },
  };
  assert.equal(loadDemo(INITIAL_PRODUCTS).user, null);
  delete globalThis.localStorage;
});
test("valid persisted checkout state is restored without losing orders or stock", () => {
  const state = fresh();
  state.cart = [{ productId: "1", quantity: 2 }];
  const next = createCheckout(state, delivery);
  globalThis.localStorage = { getItem: () => JSON.stringify(next) };
  const restored = loadDemo(INITIAL_PRODUCTS);
  assert.equal(restored.orders[0].code, next.orders[0].code);
  assert.equal(restored.products[0].stock, 22);
  delete globalThis.localStorage;
});

test("expanded catalogue has unique products, valid categories, and bundled photos with credits", () => {
  assert.equal(INITIAL_PRODUCTS.length, 30);
  assert.equal(new Set(INITIAL_PRODUCTS.map((p) => p.id)).size, 30);
  const categories = new Set(CATEGORIES.map(([id]) => id));
  for (const product of INITIAL_PRODUCTS) {
    assert.ok(categories.has(product.category), product.name);
    assert.equal(validateProduct(product), null, product.name);
    assert.ok(
      existsSync(new URL(`../public${product.image}`, import.meta.url)),
      product.image,
    );
    if (Number(product.id) > 10) {
      assert.ok(product.imageCredit.author);
      assert.ok(product.imageCredit.license);
      assert.match(product.imageCredit.licenseUrl, /^https:\/\//);
      assert.match(
        product.imageCredit.source,
        /^https:\/\/commons\.wikimedia\.org\//,
      );
    }
  }
});

test("returning visitors receive new fish without losing orders, cart, stock edits, or custom products", () => {
  const original = fresh();
  original.products = original.products.slice(0, 10);
  original.cart = [{ productId: "1", quantity: 2 }];
  const saved = createCheckout(original, delivery);
  saved.products[1].archived = true;
  saved.products.push({
    ...structuredClone(saved.products[0]),
    id: "custom-fish",
    name: "Ikan buatan pengunjung",
  });
  saved.cart = [{ productId: "10", quantity: 1 }];
  saved.wishlist = ["3"];
  globalThis.localStorage = { getItem: () => JSON.stringify(saved) };
  const restored = loadDemo(INITIAL_PRODUCTS);
  assert.equal(restored.products.length, 31);
  assert.equal(restored.products.find((p) => p.id === "1").stock, 22);
  assert.equal(restored.products.find((p) => p.id === "2").archived, true);
  assert.equal(
    restored.products.find((p) => p.id === "custom-fish").name,
    "Ikan buatan pengunjung",
  );
  assert.deepEqual(restored.cart, saved.cart);
  assert.deepEqual(restored.wishlist, saved.wishlist);
  assert.deepEqual(restored.orders, saved.orders);
  globalThis.localStorage = { getItem: () => JSON.stringify(restored) };
  assert.equal(loadDemo(INITIAL_PRODUCTS).products.length, 31);
  delete globalThis.localStorage;
});
