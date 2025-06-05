<template>
  <div class="m-0 p-0">
    <div class="w-screen h-screen bg-gray-200 p-4">
      <div
        class="w-full h-full bg-gray-300 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6"
      >
        <Iklan />

        <div
          class="flex flex-col justify-center w-full md:w-1/2 space-y-4 md:order-1"
        >
          <form @submit.prevent="verifyOtp" class="max-w-sm mx-auto">
            <label
              for="otp-input"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Masukkan OTP
              <span v-if="tempPhoneNumber" class="text-gray-600 text-xs">
                (dikirim ke {{ tempPhoneNumber }})
              </span>
            </label>
            <div class="flex">
              <input
                id="otp-input"
                v-model="otp"
                maxlength="4"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                class="rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center tracking-widest"
                placeholder="0000"
                required
              />
            </div>
            <button
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-3"
              type="submit"
            >
              Verifikasi
            </button>
            <p v-if="!tempPhoneNumber" class="text-red-500 text-sm mt-2">
              Nomor HP tidak ditemukan. Mohon kembali ke halaman login.
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Iklan from "./Iklan.vue"; // Pastikan path ini benar

const router = useRouter();
const otp = ref("");
const tempPhoneNumber = ref(""); // Gunakan ini untuk menyimpan nomor HP sementara dari login

onMounted(() => {
  // Ambil nomor HP sementara dari localStorage saat komponen dimuat
  const storedPhone = localStorage.getItem("temp_phone_for_otp");
  if (storedPhone) {
    tempPhoneNumber.value = storedPhone;
  } else {
    // Jika tidak ada temp_phone_for_otp, arahkan kembali ke login
    alert("Mohon masukkan nomor HP Anda di halaman login terlebih dahulu.");
    router.replace({ name: "Login" }); // Gunakan replace agar user tidak bisa kembali ke OTP dengan back button
  }
});

const verifyOtp = async () => {
  if (!otp.value) {
    alert("Mohon masukkan kode OTP.");
    return;
  }

  if (!tempPhoneNumber.value) {
    alert("Nomor HP tidak ditemukan. Mohon kembali ke halaman login.");
    router.replace({ name: "Login" });
    return;
  }

  try {
    // Panggil API untuk Verifikasi OTP
    // Sesuaikan endpoint dan cara API Anda merespons
    const res = await fetch(
      `https://dreampos.id/admin/api/verifikasiOTP?phone=${tempPhoneNumber.value}&otp=${otp.value}`
    );
    const data = await res.json();

    if (res.ok && data.success) {
      // Asumsi API mengembalikan 'success: true' jika OTP benar
      // --- PENTING: BARU SET 'phone' KE LOCALSTORAGE DI SINI SETELAH OTP TERVERIFIKASI ---
      localStorage.setItem("phone", tempPhoneNumber.value); // Ini menandakan user sudah login
      localStorage.removeItem("temp_phone_for_otp"); // Hapus penanda sementara setelah berhasil

      // Dispatch event agar komponen seperti Navbar bisa merespons perubahan status login
      window.dispatchEvent(new Event("login-status-changed"));

      // Lanjutkan dengan logika setelah berhasil verifikasi OTP:
      // Cek apakah nomor HP sudah terdaftar. Ini bisa dilakukan di backend
      // atau melalui API 'cekNotelp' lagi jika memang alur Anda memerlukan itu.
      const cekRes = await fetch(
        `https://dreampos.id/admin/api/cekNotelp?phone=${tempPhoneNumber.value}`
      );
      const cekData = await cekRes.json();

      // Asumsi: cekData.is_registered adalah boolean yang menandakan pendaftaran.
      // Anda harus menyesuaikan properti ini berdasarkan respons API Anda.
      if (cekData.success && cekData.is_registered) {
        alert("Verifikasi berhasil! Selamat datang kembali.");
        router.push({ name: "Home" }); // User sudah terdaftar, arahkan ke home
      } else {
        alert("Verifikasi berhasil! Silakan lengkapi pendaftaran Anda.");
        router.push({ name: "Register" }); // User belum terdaftar, arahkan ke register
      }
    } else {
      // Tampilkan pesan error dari API jika ada, atau pesan default
      alert(
        data.message ||
          "Verifikasi OTP gagal. Kode OTP salah atau sudah kadaluarsa."
      );
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    alert("Terjadi kesalahan jaringan atau server saat memverifikasi OTP.");
  }
};
</script>

<style scoped>
/* Anda bisa tambahkan style khusus untuk komponen ini di sini */
</style>