<template>
  <div class="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
    <button @click="goBack" class="mb-4 flex items-center text-red-600 hover:text-red-800 font-semibold text-sm">
      ← Kembali ke Daftar Produk
    </button>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else>
      <img :src="product.pp_image" alt="Product Image" class="w-full h-auto object-cover rounded-md mb-4" />
      <h2 class="text-2xl font-bold mb-2">{{ product.pp_nama }}</h2>
      <!-- Keterangan Status -->
      <p
        class="mb-4 px-3 py-2 rounded text-sm font-semibold"
        :class="product.pp_status === '1' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'"
      >
        {{ product.pp_status === "1" ? "Produk Tersedia" : "Produk Kosong" }}
      </p>
      <p>{{ product.pp_deskripsi }}</p>
      <div class="border-t mt-5 p-4">
        <div class="flex justify-end gap-4">
          <p class="text-red-600 font-semibold mb-4 p-2">Poin: {{ product.pp_point }}</p>
          <p
            class="text-red-600 font-semibold mb-4 bg-red-300 p-2 rounded-md text-center cursor-pointer"
            :class="{
              'bg-red-500 hover:bg-red-600 text-white': canRedeem,
              'opacity-50 cursor-not-allowed': !canRedeem,
            }"
            @click="canRedeem ? redeemPoints() : null"
          >
            Tukar Poin
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  props: ["id", "awardPoints"],
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      toast: null,
    };
  },
  computed: {
    canRedeem() {
      return this.product && parseInt(this.awardPoints) >= parseInt(this.product.pp_point);
    },
  },
  mounted() {
    this.toast = useToast();
    this.fetchProduct();
  },
  watch: {
    id(newId, oldId) {
      if (newId !== oldId) {
        this.fetchProduct();
      }
    },
  },
  methods: {
    goBack() {
      this.$router.back(); // navigasi kembali
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll ke atas
    },
    async fetchProduct() {
      this.loading = true;
      this.error = null;
      this.product = null;
      try {
        const response = await fetch(`https://dreampos.id/admin/api/getProductClaim`);
        const data = await response.json();
        this.product = data.find((item) => item.pp_id === this.id);
        if (!this.product) throw new Error("Produk tidak ditemukan");
      } catch (err) {
        this.error = err.message;
        this.toast.error("Gagal mengambil data produk: " + err.message);
      } finally {
        this.loading = false;
      }
    },

    async redeemPoints() {
      const customerId = localStorage.getItem("customerId");
      if (!customerId || !this.product?.pp_id) return;

      try {
        const response = await fetch("https://dreampos.id/admin/api/savePenukaranPoin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tkr_cus_id: customerId,
            tkr_pp_id: this.product.pp_id,
          }),
        });

        const result = await response.json();

        if (result.success) {
          this.toast.success("Poin berhasil ditukar!");

          // Kurangi poin di localStorage
          const oldPoints = parseInt(localStorage.getItem("award_points") || "0", 10);
          localStorage.setItem("award_points", oldPoints - parseInt(this.product.pp_point));

          // Set tab dan redirect
          localStorage.setItem("autoTab", "2");
          setTimeout(() => {
            this.$router.push("/tukarpoin");
          }, 1000);
        } else {
          this.toast.warning(result.message || "Penukaran gagal.");
        }
      } catch (error) {
        this.toast.error("Terjadi kesalahan saat menukar poin.");
        console.error(error);
      }
    },
  },
};
</script>
