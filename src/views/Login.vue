<template>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
  </head>
  <div class="m-0 p-0">
    <div class="w-screen h-screen bg-gray-200 p-4">
      <div class="w-full h-full bg-gray-300 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6">
        <Iklan />

        <div class="flex flex-col justify-center w-full md:w-1/2 space-y-4 md:order-1">
          <form @submit.prevent="submitPhone" class="max-w-sm mx-auto">
            <label for="phone-number-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Masukkan Nomor HP</label>
            <div class="flex">
              <span
                class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                >+62
              </span>
              <input
                id="phone-number-input"
                v-model="phone"
                type="tel"
                inputmode="numeric"
                pattern="[0-9]*"
                class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="8123456789"
                required
              />
            </div>
            <button
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
              type="submit"
            >
              Kirim OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import Iklan from "./Iklan.vue"; // Pastikan path ini benar
import { useToast } from "vue-toastification";

const router = useRouter();
const phone = ref(""); // Menyimpan bagian nomor HP tanpa '62'
const toast = useToast();

const submitPhone = async () => {
  if (!phone.value) {
    toast.error("Mohon masukkan nomor HP Anda.");
    return;
  }

  // Gabungkan dengan kode negara (jika API membutuhkan)
  const fullPhone = `62${phone.value}`;

  try {
    // Panggil API untuk Cek Nomor Telepon dan Mengirim OTP
    // Sesuaikan endpoint dan cara API Anda merespons
    const response = await fetch(`https://dreampos.id/admin/api/cekNotelp?phone=${fullPhone}`);
    const data = await response.json();

    // Asumsi: API akan mengembalikan 'success: true' jika nomor valid dan OTP dikirim
    // Atau 'success: false' dengan pesan error jika nomor tidak terdaftar/masalah lain.
    if (response.ok && data.success) {
      // --- PENTING: HANYA SIMPAN penanda sementara untuk OTP ---
      localStorage.setItem("temp_phone_for_otp", fullPhone);

      toast.success("✅ OTP berhasil dikirim ke nomor Anda.");
      router.push({ name: "Otp" }); // Arahkan ke halaman OTP
    } else {
      // Tampilkan pesan error dari API jika ada, atau pesan default
      toast.error(`❌ Gagal mengirim OTP: ${data.message || "Nomor tidak terdaftar atau ada kesalahan."}`);
      // Jika API gagal mengirim OTP, pastikan penanda sementara dihapus
      localStorage.removeItem("temp_phone_for_otp");
    }
  } catch (error) {
    console.error("Error saat mengirim OTP:", error);
    toast.error("⚠️ Terjadi kesalahan jaringan atau server saat mengirim OTP.");
    // Jika ada error jaringan, juga hapus penanda sementara
    localStorage.removeItem("temp_phone_for_otp");
  }
};
</script>

<style scoped>
/* Anda bisa tambahkan style khusus untuk komponen ini di sini */
</style>
