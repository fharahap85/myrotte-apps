<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded-md shadow-lg">
    <!-- Tombol Kembali -->
    <button
      @click="$router.back()"
      class="mb-4 text-red-600 hover:font-bold text-sm bg-gray-100 p-2 rounded hover:bg-gray-300"
    >
      ← Kembali
    </button>

    <!-- Loading dan Error -->
    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>

    <!-- Konten -->
    <div v-else>
      <h2 class="text-xl font-bold text-center mb-2">Detail Penukaran</h2>

      <!-- Gambar -->
      <img
        :src="claim.pp_image"
        alt="Gambar Produk"
        class="w-full h-auto mb-4 rounded-md object-cover"
      />

      <!-- Nama Produk -->
      <div class="text-center mb-2">
        <h3 class="text-lg font-semibold">{{ claim.pp_nama }}</h3>
        <p class="text-sm text-gray-600">
          Periode Penukaran: {{ formatDate(claim.tkr_tgl_pengajuan) }} -
          {{ formatDate(claim.tkr_tgl_expired) }}
        </p>
      </div>

      <!-- Kode Tukar -->
      <div
        class="bg-red-100 border border-red-300 rounded-lg text-center mt-4 p-4"
      >
        <h4 class="text-sm font-medium text-red-700">KODE TUKAR</h4>
        <p class="text-lg font-bold text-red-700">{{ claim.tkr_kode }}</p>
        <p class="text-xs mt-2 border-t border-t-red-600 font-bold text-gray-600">
          <br>{{ countdownText }}
        </p>
      </div>

      <!-- Informasi -->
      <div class="mt-6">
        <h5 class="font-semibold mb-2">Cara Penukaran Point:</h5>
        <ol class="list-decimal list-inside text-sm space-y-1 text-gray-700">
          <li>
            Tunjukkan Kode Tukar di atas kepada kasir di Outlet Rotte Bakery.
          </li>
          <li>Kunjungi outlet tempat penukaran point (lihat di bawah).</li>
          <li>Penukaran hanya berlaku 1 kali.</li>
          <li>Harus ditukarkan sebelum batas waktu atau akan hangus.</li>
        </ol>
      </div>

      <!-- Lokasi -->
      <div class="mt-4">
        <button class="text-sm text-red-600 hover:underline">
          ⓘ Tekan di sini untuk melihat tempat penukaran
        </button>
      </div>

      <!-- Promo Info -->
      <div
        class="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-4 text-sm text-yellow-800 rounded"
      >
        {{ claim.pp_deskripsi }}
      </div>

      <!-- Tanggal Info -->
      <div class="grid grid-cols-2 text-xs text-gray-500 mt-6 border-t pt-4">
        <div>Diajukan:</div>
        <span class="font-bold text-right">{{
          formatDateTime(claim.tkr_tgl_pengajuan)
        }}</span>

        <div>Batas Penukaran:</div>
        <span class="font-bold text-right">{{
          formatDateTime(claim.tkr_tgl_expired)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      claim: null,
      loading: true,
      error: null,
      countdownText: "",
      interval: null,
    };
  },
  async mounted() {
    await this.fetchClaim();
    this.startCountdown();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler() {
        this.fetchClaim().then(() => this.startCountdown());
      },
    },
  },
  methods: {
    async fetchClaim() {
      this.loading = true;
      this.error = null;
      this.claim = null;
      clearInterval(this.interval); // stop timer if re-fetching

      const claimId = this.$route.params.id;
      try {
        const res = await fetch(
          `https://dreampos.id/admin/api/getClaimbytkrID/${claimId}`
        );
        if (!res.ok) throw new Error("Gagal mengambil detail klaim");
        const data = await res.json();
        this.claim = Array.isArray(data) ? data[0] : data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
    formatDateTime(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleString("id-ID");
    },
    startCountdown() {
      clearInterval(this.interval);
      if (!this.claim || !this.claim.tkr_tgl_expired) return;

      const updateCountdown = () => {
        const now = new Date();
        const target = new Date(this.claim.tkr_tgl_expired);
        const diff = target - now;

        if (isNaN(diff)) {
          this.countdownText = "Tanggal tidak valid";
          clearInterval(this.interval);
          return;
        }

        if (diff <= 0) {
          this.countdownText = "Expired";
          clearInterval(this.interval);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        this.countdownText = `Batas Waktu: ${days} hari ${hours} jam ${minutes} menit ${seconds} detik`;
      };

      updateCountdown(); // update pertama kali
      this.interval = setInterval(updateCountdown, 1000);
    },
  },
};
</script>

<style scoped>
/* Tambahkan styling khusus jika dibutuhkan */
</style>
