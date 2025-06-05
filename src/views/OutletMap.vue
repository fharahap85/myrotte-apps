<template>
  <div class="map-container">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
      class="w-full h-full rounded-lg shadow-md"
    >
      <l-tile-layer
        :url="tileProvider.url"
        :attribution="tileProvider.attribution"
      ></l-tile-layer>
      <l-marker
        v-for="outlet in outlets"
        :key="outlet.id"
        :lat-lng="[outlet.lat, outlet.long]"
      >
        <l-popup>
          <div class="font-semibold text-lg">{{ outlet.name }}</div>
          <div class="text-sm text-gray-700">{{ outlet.address }}</div>
          <a
            :href="generateMapsUrl(outlet.lat, outlet.long, outlet.name)"
            target="_blank"
            class="text-blue-600 hover:underline mt-2 inline-block"
          >
            Lihat di Google Maps
          </a>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import "leaflet/dist/leaflet.css"; // Impor CSS Leaflet
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import L from "leaflet"; // Import Leaflet objek untuk ikon kustom

// Props yang akan diterima dari parent component (Outlet.vue)
const props = defineProps({
  outlets: {
    type: Array,
    required: true,
  },
  initialCenter: {
    type: Array, // [latitude, longitude]
    default: () => [0.5076116360412823, 101.44907242285187], // Contoh Pekanbaru
  },
  initialZoom: {
    type: Number,
    default: 13,
  },
});

const zoom = ref(props.initialZoom);
const center = ref(props.initialCenter);
const map = ref(null); // Reference to the map component

// Konfigurasi penyedia tile peta (OpenStreetMap)
const tileProvider = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
};

// --- Perbaiki masalah ikon marker Leaflet yang hilang ---
// Leaflet menggunakan ikon default yang mungkin tidak ditemukan jika tidak diimpor dengan benar.
// Kita bisa menimpa ikon default atau mengimpornya secara eksplisit.
// Cara terbaik adalah mengimpor gambar-gambarnya.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
// --- Akhir perbaikan ikon marker ---

// Fungsi untuk membuat URL Google Maps
const generateMapsUrl = (lat, long, name) => {
  // Menggunakan q= untuk pencarian dengan nama tempat yang disarankan
  // Ini lebih robust jika lat/long tidak persis di jalan.
  return `https://www.google.com/maps/search/?api=1&query=${lat},${long}+${encodeURIComponent(
    name
  )}`;
};

// Watch untuk mengubah center peta jika props.outlets berubah dan ada outlet baru
watch(
  () => props.outlets,
  (newOutlets) => {
    if (newOutlets.length > 0 && map.value) {
      // Jika ada banyak outlet, sesuaikan tampilan peta agar semua terlihat
      // Anda bisa menghitung bounds atau hanya mengatur center ke outlet pertama
      const firstOutlet = newOutlets[0];
      center.value = [firstOutlet.lat, firstOutlet.long];

      // Jika Anda ingin peta menyesuaikan zoom agar semua marker terlihat:
      if (newOutlets.length > 1 && map.value.leafletObject) {
        const latLngs = newOutlets.map((o) => [o.lat, o.long]);
        const bounds = L.latLngBounds(latLngs);
        map.value.leafletObject.fitBounds(bounds, { padding: [50, 50] }); // Padding agar marker tidak terlalu mepet
      }
    }
  },
  { deep: true }
); // deep: true agar mendeteksi perubahan dalam array objek

onMounted(() => {
  // Jika peta dimuat dan ada outlet, atur center awal ke outlet pertama
  if (props.outlets.length > 0) {
    const firstOutlet = props.outlets[0];
    center.value = [firstOutlet.lat, firstOutlet.long];
  }
});
</script>

<style scoped>
.map-container {
  height: 500px; /* Sesuaikan tinggi peta sesuai kebutuhan Anda */
  width: 100%;
  margin-bottom: 1.5rem; /* Tambahkan sedikit margin di bawah peta */
}
</style>