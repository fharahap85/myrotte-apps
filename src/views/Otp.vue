<template>
  <div class="m-0 p-0">
    <div class="w-screen h-screen bg-gray-200 p-4">
      <div class="w-full h-full bg-gray-300 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6">
        <Iklan />

        <div class="flex flex-col justify-center w-full md:w-1/2 space-y-4 md:order-1">
          <form @submit.prevent="verifyOtp" class="max-w-sm mx-auto">
            <label for="otp-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Masukkan OTP
              <span v-if="tempPhoneNumber" class="text-gray-600 text-xs"> (dikirim ke {{ tempPhoneNumber }}) </span>
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
            <p v-if="!tempPhoneNumber" class="text-red-500 text-sm mt-2">Nomor HP tidak ditemukan. Mohon kembali ke halaman login.</p>
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
import { useToast } from "vue-toastification";

const router = useRouter();
const otp = ref("");
const tempPhoneNumber = ref(""); // Gunakan ini untuk menyimpan nomor HP sementara dari login
const toast = useToast();

onMounted(() => {
  // Ambil nomor HP sementara dari localStorage saat komponen dimuat
  const storedPhone = localStorage.getItem("temp_phone_for_otp");
  if (storedPhone) {
    tempPhoneNumber.value = storedPhone;
  } else {
    // Jika tidak ada temp_phone_for_otp, arahkan kembali ke login
    toast.warning("Silakan masukkan nomor HP di halaman login terlebih dahulu.");
    router.replace({ name: "Login" }); // Gunakan replace agar user tidak bisa kembali ke OTP dengan back button
  }
});

const verifyOtp = async () => {
  if (!otp.value) {
    toast.error("Mohon masukkan kode OTP.");
    return;
  }

  if (!tempPhoneNumber.value) {
    toast.error("Nomor HP tidak ditemukan. Silakan login kembali.");
    router.replace({ name: "Login" });
    return;
  }

  try {
    // 1. Verifikasi OTP
    const res = await fetch(`https://dreampos.id/admin/api/verifikasiOTP?phone=${tempPhoneNumber.value}&otp=${otp.value}`);
    const data = await res.json();

    if (res.ok && data.success) {
      // 2. Simpan login
      localStorage.setItem("phone", tempPhoneNumber.value);
      localStorage.removeItem("temp_phone_for_otp");
      window.dispatchEvent(new Event("login-status-changed"));

      // 3. Cek apakah nomor terdaftar
      const cekRes = await fetch(`https://dreampos.id/admin/api/cekNotelp?phone=${tempPhoneNumber.value}`);
      const cekData = await cekRes.json();

      if (cekRes.ok && cekData.success) {
        toast.success("✅ Login berhasil!");
        router.push({ name: "Home" });
      } else {
        toast.info("⚠️ Nomor belum terdaftar. Silakan lengkapi pendaftaran.");
        router.push({ name: "Register" });
      }
    } else {
      toast.error(data.message || "Kode OTP salah atau sudah kadaluarsa.");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    toast.error("Terjadi kesalahan saat memverifikasi OTP.");
  }
};
</script>

<style scoped>
/* Anda bisa tambahkan style khusus untuk komponen ini di sini */
</style>
