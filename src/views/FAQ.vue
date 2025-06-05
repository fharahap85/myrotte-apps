<template>
  <div class="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
    <h1 class="text-3xl font-extrabold text-gray-900 mb-8 text-center">
      FAQ
    </h1>

    <div class="space-y-4">
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <button
          @click="toggleFaq('getPoints')"
          class="flex justify-between items-center w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-b border-gray-200': activeFaq === 'getPoints' }"
        >
          <span class="text-xl font-semibold text-gray-800"
            >Cara mendapatkan Poin</span
          >
          <svg
            class="w-6 h-6 text-gray-600 transform transition-transform duration-300"
            :class="{ 'rotate-180': activeFaq === 'getPoints' }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        <div
          v-if="activeFaq === 'getPoints'"
          class="p-6 pt-0 text-gray-700 leading-relaxed"
        >
          <ol class="list-decimal list-inside space-y-2">
            <li>
              Dapatkan Rotte Poin untuk setiap transaksi belanja di Rotte
              seluruh wilayah Riau.
            </li>
            <li>
              Dapatkan 1 Rotte Poin untuk setiap transaksi sebesar Rp 10.000 dan
              berlaku kelipatannya. Contoh: Transaksi sebesar Rp 35.000 akan
              mendapatkan 3 Rotte Poin; transaksi sebesar Rp 51.000 akan
              mendapatkan 5 Rotte Poin.
            </li>
            <li>
              Masa berlaku Rotte Poin adalah 12 bulan sejak Poin didapat. Jika
              tidak ditukarkan, maka Poin Rotte Lovers akan hangus otomatis.
            </li>
          </ol>
        </div>
      </div>

      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <button
          @click="toggleFaq('claimPoints')"
          class="flex justify-between items-center w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-b border-gray-200': activeFaq === 'claimPoints' }"
        >
          <span class="text-xl font-semibold text-gray-800"
            >Cara Melakukan Klaim Poin</span
          >
          <svg
            class="w-6 h-6 text-gray-600 transform transition-transform duration-300"
            :class="{ 'rotate-180': activeFaq === 'claimPoints' }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        <div
          v-if="activeFaq === 'claimPoints'"
          class="p-6 pt-0 text-gray-700 leading-relaxed"
        >
          <ol class="list-decimal list-inside space-y-2">
            <li>
              Buka menu Tukar Poin melalui aplikasi beranda, lalu pilih produk
              yang Rotte Lovers inginkan.
            </li>
            <li>
              Tukarkan Poin tersebut dengan Produk yang sesuai dengan jumlah
              Rotte Poin yang dimiliki.
            </li>
            <li>
              Setelah penukaran berhasil, konfirmasi ke Tim Kasir Rotte dan Tim
              Kasir Rotte akan menyerahkan Produk yang sudah dipilih.
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FaqSection",
  data() {
    return {
      activeFaq: null, // Stores the currently active FAQ item
    };
  },
  methods: {
    toggleFaq(faqName) {
      if (this.activeFaq === faqName) {
        this.activeFaq = null; // Close if already open
      } else {
        this.activeFaq = faqName; // Open the clicked FAQ
      }
    },
  },
};
</script>

<style scoped>
/* No specific <style> tag needed if using only Tailwind CSS utility classes.
   If you need custom styles, add them here.
*/
</style>