<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
      Outlet Kami
    </h1>

    <div v-if="loading" class="text-center text-lg text-gray-600">
      Memuat data outlet dan peta...
    </div>

    <div v-if="error" class="text-center text-red-600 text-lg">
      Terjadi kesalahan: {{ error }}
    </div>

    <div v-if="!loading && !error && outlets.length > 0" class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">
        Lokasi Outlet di Peta
      </h2>
      <OutletMap :outlets="outlets" />
    </div>

    <div v-if="!loading && !error && outlets.length > 0">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Daftar Outlet</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="outlet in outlets"
          :key="outlet.id"
          class="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer"
          @click="openMaps(outlet.lat, outlet.long, outlet.name)"
        >
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
              {{ outlet.name }}
            </h2>
            <div class="text-gray-600 text-sm mb-4">
              <i class="fas fa-map-marker-alt mr-2"></i>{{ outlet.address }}
            </div>
            <div class="flex items-center text-gray-700">
              <i class="fas fa-phone mr-2"></i>
              <span>{{ outlet.phone || "Tidak Tersedia" }}</span>
            </div>
            <p v-if="outlet.description" class="text-gray-500 text-sm mt-2">
              {{ outlet.description }}
            </p>
          </div>
          <div
            class="bg-blue-100 text-blue-800 text-center py-2 px-4 text-sm font-medium"
          >
            Lihat di Google Maps
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="!loading && !error"
      class="text-center text-lg text-gray-600"
    >
      Tidak ada data outlet yang tersedia.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import OutletMap from "../views/OutletMap.vue"; // <-- Impor komponen peta

const outlets = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchOutlets = async () => {
  try {
    const response = await fetch("https://dreampos.id/admin/api/getOutlet");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();

    let processedOutlets = [];
    if (Array.isArray(rawData)) {
      processedOutlets = rawData;
    } else if (rawData && Array.isArray(rawData.data)) {
      processedOutlets = rawData.data;
    } else {
      throw new Error(
        "Format data outlet tidak sesuai. Diharapkan array atau objek dengan properti 'data' berupa array."
      );
    }

    // --- PENTING: Lakukan pembersihan HTML di sini ---
    outlets.value = processedOutlets
      .map((outlet) => {
        // Buat salinan outlet untuk menghindari mutasi langsung pada objek asli jika tidak diinginkan
        const newOutlet = { ...outlet };

        // Hapus tag HTML dari properti 'address'
        if (typeof newOutlet.address === "string") {
          newOutlet.address = newOutlet.address.replace(/<[^>]*>/g, ""); // Regex untuk menghapus semua tag HTML
          newOutlet.address = newOutlet.address.trim(); // Hapus spasi di awal/akhir jika ada
        }

        // Pastikan lat/long adalah angka (jika API mengembalikan string)
        newOutlet.lat = parseFloat(newOutlet.lat);
        newOutlet.long = parseFloat(newOutlet.long);

        return newOutlet;
      })
      .filter((outlet) => !isNaN(outlet.lat) && !isNaN(outlet.long)); // Filter outlet dengan lat/long yang tidak valid
  } catch (err) {
    error.value = err.message;
    console.error("Failed to fetch outlets:", err);
  } finally {
    loading.value = false;
  }
};

const openMaps = (lat, long, name) => {
  if (lat && long) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${long}+${encodeURIComponent(
      name
    )}`;
    window.open(mapsUrl, "_blank");
  } else {
    alert(`Lokasi untuk ${name || "outlet ini"} tidak tersedia.`);
  }
};

onMounted(() => {
  fetchOutlets();
});
</script>

<style scoped>
/* Pastikan Font Awesome CSS diimpor di `index.html` atau `main.js` Anda */
/* Contoh di `index.html` (di dalam <head>):
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />
*/
</style>