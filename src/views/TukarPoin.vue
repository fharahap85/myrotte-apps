<template>
  <div class="w-full max-w-3xl mx-auto mt-10">
    <!-- Menu Tab -->
    <div class="flex justify-around text-black p-4">
      <button
        @click="showMenu = 1"
        :class="{
          'border-b-4 border-red-600 text-red-600 font-bold': showMenu === 1,
          'hover:border-b-4 hover:border-red-300 hover:text-red-300':
            showMenu !== 1,
        }"
        class="w-1/2 py-2 focus:outline-none transition"
      >
        Produk
      </button>
      <button
        @click="showMenu = 2"
        :class="{
          'border-b-4 border-red-600 text-red-600 font-bold': showMenu === 2,
          'hover:border-b-4 hover:border-red-300 hover:text-red-300':
            showMenu !== 2,
        }"
        class="w-1/2 py-2 focus:outline-none transition"
      >
        Penukaran Saya
      </button>
    </div>

    <!-- Konten Menu -->
    <div class="bg-gray-100 p-6 rounded-b-md">
      <!-- Menu 1: Tampilkan data produk dari API -->
      <div v-if="showMenu === 1" class="text-xl font-bold text-gray-800">
        <h2 class="mb-5">Produk Claim</h2>
        <div v-if="loading" class="text-center text-gray-600">Loading...</div>
        <div v-else-if="error" class="text-center text-red-600">
          Terjadi kesalahan: {{ error }}
        </div>
        <div v-else>
          <ul class="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <!-- Menampilkan produk dalam bentuk grid -->
            <div
              v-for="product in products"
              :key="product.pp_id"
              @click="goToProduct(product.pp_id)"
              class="cursor-pointer bg-white p-2 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div class="flex flex-col items-start">
                <img
                  :src="product.pp_image"
                  alt="Profile Image"
                  class="rounded-md object-cover mb-4"
                />
                <h3 class="text-sm font-semibold text-gray-800">
                  {{ product.pp_nama }}
                </h3>
                <div class="font-semibold text-sm text-red-600">
                  Poin: {{ product.pp_point }}
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>

      <!-- Menu 2: Tampilkan data klaim produk berdasarkan user -->
      <div v-if="showMenu === 2" class="text-xl font-bold text-gray-800">
        <h2 class="mb-5">Data Klaim Pengguna</h2>
        <div v-if="loading" class="text-center text-gray-600">Loading...</div>
        <div v-else-if="error" class="text-center text-red-600">
          Terjadi kesalahan: {{ error }}
        </div>
        <div v-else>
          <div class="grid gap-6">
            <!-- Menampilkan klaim produk dalam bentuk tile dengan gambar di kiri dan teks di kanan -->
            <div
              v-for="claim in claims"
              :key="claim.tkr_id"
              @click="goToClaim(claim.tkr_id)"
              class="bg-white p-4 rounded-md shadow-md flex items-center hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <!-- Gambar di kiri -->
              <div class="">
                <img
                  :src="claim.pp_image"
                  alt="Claim Image"
                  class="w-auto h-16 object-cover rounded-md"
                />
              </div>

              <!-- Keterangan di kanan -->
              <div class="w-2/3 pl-4 py-0.5">
                <h3 class="text-[12px] text-red-600 leading-tight mb-0.5">
                  Produk : {{ claim.pp_nama }}
                </h3>
                <div
                  class="text-[12px] text-gray-600 leading-tight space-y-0.5"
                >
                  <p class="text-gray-500">Kode Tukar: {{ claim.tkr_kode }}</p>
                  <p class="text-red-600 text[12px]">
                    {{ countdownTo(claim.tkr_tgl_expired) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMenu: 1, // Menyimpan state menu yang sedang ditampilkan (1 atau 2)
      products: [], // Menyimpan produk yang diterima dari API untuk Menu 1
      claims: [], // Menyimpan klaim produk yang diterima dari API untuk Menu 2
      loading: true, // Status loading
      error: null, // Menyimpan error jika terjadi
    };
  },
  mounted() {
    const savedTab = localStorage.getItem("autoTab");
    if (savedTab) {
      this.showMenu = parseInt(savedTab, 10);
      localStorage.removeItem("autoTab"); // hapus agar tidak terus-terusan pindah tab
    }

    // Memanggil API untuk mendapatkan data produk saat komponen di-mount
    this.fetchProductClaims(); // Mengambil produk untuk Menu 1
    this.fetchUserClaims(); // Mengambil klaim produk untuk Menu 2
  },
  methods: {
    // Fungsi untuk mengambil data produk dari API (untuk Menu 1)
    async fetchProductClaims() {
      try {
        const response = await fetch(
          "https://dreampos.id/admin/api/getProductClaim"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.products = data; // Menyimpan data produk
        this.loading = false; // Menandakan bahwa loading selesai
      } catch (error) {
        this.error = error.message; // Menyimpan error jika terjadi masalah
        this.loading = false;
      }
    },

    // Fungsi untuk mengambil data klaim berdasarkan ID pengguna (untuk Menu 2)
    async fetchUserClaims() {
      const customerId = localStorage.getItem("customerId"); // Ambil ID dari localStorage

      if (customerId) {
        try {
          const response = await fetch(
            `https://dreampos.id/admin/api/getClaimbyUser/${customerId}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          this.claims = data; // Menyimpan data klaim
          this.loading = false; // Menandakan bahwa loading selesai
        } catch (error) {
          this.error = error.message; // Menyimpan error jika terjadi masalah
          this.loading = false; // Menandakan bahwa loading selesai meskipun ada error
        }
      } else {
        this.error = "ID pengguna tidak ditemukan.";
        this.loading = false;
      }
    },

    daysUntil(dateString) {
      const today = new Date();
      const targetDate = new Date(dateString);

      today.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);

      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (isNaN(diffDays)) return "Tanggal tidak valid";

      return diffDays > 0
        ? `${diffDays} hari lagi`
        : diffDays === 0
        ? "Hari ini"
        : `${Math.abs(diffDays)} hari yang lalu`;
    },

    countdownTo(dateString) {
      const now = new Date();
      const target = new Date(dateString);
      const diffMs = target - now;

      if (isNaN(diffMs)) return "Tanggal tidak valid";
      if (diffMs <= 0) return "Expired";

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return `Batas Waktu : ${days} hari ${hours
        .toString()
        .padStart(2, "0")} jam ${minutes.toString().padStart(2, "0")} menit`;
    },

    goToProduct(id) {
      this.$router.push(`/product/${id}`);
    },

    goToClaim(id) {
      // Arahkan ke halaman detail klaim (gunakan Vue Router)
      this.$router.push(`/claim/${id}`);
    },
  },
};
</script>

<style scoped>
/* Tambahkan style tambahan jika diperlukan */
</style>
