// src/api/productApi.js

const API_BASE_URL = "https://dreampos.id/admin/api";

export async function getAllProducts() {
  const res = await fetch(`${API_BASE_URL}/getProduct`);
  if (!res.ok) throw new Error("Gagal mengambil semua produk");
  return res.json();
}

export async function getPromo() {
  const res = await fetch(`${API_BASE_URL}/getPromo`);
  if (!res.ok) throw new Error("Gagal mengambil semua produk promo");
  return res.json();
}

export async function getProductsByCategory(kategoriId) {
  const res = await fetch(`${API_BASE_URL}/getProduct?kategori=${kategoriId}`);
  if (!res.ok) throw new Error("Gagal mengambil produk berdasarkan kategori");
  return res.json();
}
