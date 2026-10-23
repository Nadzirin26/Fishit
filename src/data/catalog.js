import originalProducts from "./original-products.json" with { type: "json" };

export const CATEGORIES = [
  ["all", "Semua ikan"],
  ["cupang", "Cupang"],
  ["guppy", "Guppy"],
  ["discus", "Discus"],
  ["koi", "Koi"],
  ["tetra", "Tetra"],
  ["udang", "Udang"],
  ["oscar", "Oscar"],
  ["molly", "Molly"],
  ["arowana", "Arwana"],
];

const details = [
  [
    "Depok",
    "3–4 cm",
    24,
    "Corak cobra yang kontras dengan ekor lebar. Pilihan menarik untuk akuarium komunitas yang tenang.",
  ],
  [
    "Jakarta Selatan",
    "5–6 cm",
    8,
    "Sirip halfmoon lebar dengan warna keemasan. Pelihara jantan secara terpisah dan sediakan akuarium yang sesuai.",
  ],
  [
    "Tangerang",
    "10–12 cm",
    6,
    "Discus dengan warna biru lembut. Cocok untuk penghobi yang sudah berpengalaman menjaga kualitas air.",
  ],
  [
    "Depok",
    "3–5 cm",
    30,
    "Molly berwarna jingga cerah untuk menambah warna di akuarium. Foto merupakan contoh dari satu kelompok ikan.",
  ],
  [
    "Jakarta Barat",
    "18–22 cm",
    3,
    "Ikan predator untuk penghobi berpengalaman. Pastikan tersedia akuarium besar dan penutup yang aman.",
  ],
  [
    "Bogor",
    "15–18 cm",
    12,
    "Pola merah dan putih khas Kohaku. Siapkan kolam dengan ruang berenang dan filtrasi yang memadai.",
  ],
  [
    "Bandung",
    "1–2 cm",
    50,
    "Udang merah kecil untuk akuarium tanaman yang stabil. Hindari mencampurnya dengan ikan predator.",
  ],
  [
    "Bekasi",
    "8–10 cm",
    10,
    "Oscar bercorak tiger dengan karakter aktif. Membutuhkan ruang luas dan filtrasi yang sesuai.",
  ],
  [
    "Jakarta Selatan",
    "4–5 cm",
    7,
    "Cupang plakat dengan pola galaxy berwarna-warni. Pola tiap individu dapat berbeda dari foto contoh.",
  ],
  [
    "Depok",
    "2–3 cm",
    15,
    "Satu paket berisi 10 ekor neon tetra. Ikan berkelompok untuk akuarium komunitas yang sudah stabil.",
  ],
];

export const DEMO_STORE = {
  id: "demo-store",
  name: "Aquatic Studio",
  location: "Depok",
};

export const INITIAL_PRODUCTS = originalProducts.map((product, index) => ({
  id: String(product.id),
  name: product.name,
  seller:
    product.seller === "Toko Air Sehat" ? DEMO_STORE.name : product.seller,
  sellerId:
    product.seller === "Toko Air Sehat"
      ? DEMO_STORE.id
      : `store-${product.seller.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  price: product.price,
  category: product.category,
  image: product.id === 2 ? product.image : `/images/fish-${product.id}.jpg`,
  location: details[index][0],
  size: details[index][1],
  stock: details[index][2],
  description: details[index][3],
  tag: product.tag || null,
  reviews: product.reviewsData.map((review, i) => ({
    ...review,
    id: `seed-${index}-${i}`,
  })),
}));

export const STEPS = [
  "Pesanan diterima",
  "Persiapan & pengemasan",
  "Dalam perjalanan",
  "Tiba di tujuan",
];
export const DEMO_USER = {
  id: "visitor",
  name: "Pengunjung Fishit",
  email: "pengunjung@example.com",
};
