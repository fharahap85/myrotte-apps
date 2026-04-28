<template>
  <div class="absolute top-10 left-4 sm:top-20 sm:left-1/4 z-0">
    <img
      :src="image"
      alt="Gambar 1"
      class="w-20 sm:hidden mobile-float-medium"
    />
    <img
      :src="image"
      alt="Gambar 1"
      class="w-20 sm:w-32 hidden sm:block"
      :style="getParallaxStyle(-1)"
    />
  </div>
  <div class="absolute bottom-10 right-4 sm:bottom-24 sm:right-1/3 z-0">
    <img
      :src="image"
      alt="Gambar 2"
      class="w-24 sm:hidden mobile-float-strong"
    />
    <img
      :src="image"
      alt="Gambar 2"
      class="w-20 sm:w-28 hidden sm:block"
      :style="getParallaxStyle(0.5)"
    />
  </div>
  <div
    class="absolute top-1/2 right-1/2 sm:right-96 sm:top-1/3 z-0 transform -translate-y-1/2"
  >
    <img
      :src="image"
      alt="Gambar 3"
      class="w-24 sm:hidden mobile-float-circle"
    />
    <img
      :src="image"
      alt="Gambar 3"
      class="w-auto hidden sm:block"
      :style="getParallaxStyle(4)"
    />
  </div>
  <div
    class="flex h-screen w-full items-center justify-center bg-white bg-cover bg-no-repeat"
    :style="{ backgroundImage: `url(${bgimage})` }"
  >
    <div
      class="rounded-xl max-w-md bg-gray-300 mx-6 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8"
    >
      <div class="text-white text-center">
        <div class="flex flex-col items-center">
          <img
            src="/src/assets/Rotte_Logo 1.png"
            width="100"
            alt=""
            srcset=""
          />
        </div>
        <form @submit.prevent="verifyOtp" class="max-w-sm mx-auto">
          <label
            for="otp-input"
            class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
          >
            Masukkan OTP
            <span v-if="tempPhoneNumber" class="text-gray-700 text-sm">
              ( dikirim ke {{ tempPhoneNumber }} )
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
            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-lg px-10 py-2 mb-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt-3"
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
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";
import Iklan from "./Iklan.vue"; // Pastikan path ini benar
import { useToast } from "vue-toastification";
import image from "/src/assets/icon point.png";
import bgimage from "/src/assets/bgwebbase.jpg";
const successStatus = ref(false); // ⬅️ status apakah nomor sudah terdaftar

const router = useRouter();
const otp = ref("");
const tempPhoneNumber = ref(""); // Gunakan ini untuk menyimpan nomor HP sementara dari login
const toast = useToast();
// Untuk animasi parallax
const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (event) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  mouseX.value = (event.clientX - centerX) / 30;
  mouseY.value = (event.clientY - centerY) / 30;
};

// Fungsi untuk hitung gaya parallax tiap gambar
const getParallaxStyle = (multiplierX, multiplierY = multiplierX) => {
  return {
    transform: `translate(${mouseX.value * multiplierX}px, ${
      mouseY.value * multiplierY
    }px)`,
    transition: "transform 0.1s ease-out",
  };
};

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});

// Submit nomor HP

onMounted(() => {
  const storedPhone = localStorage.getItem("temp_phone_for_otp");
  const storedSuccess = localStorage.getItem("temp_success_status");

  if (storedPhone) {
    tempPhoneNumber.value = storedPhone;
  } else {
    toast.warning(
      "Silakan masukkan nomor HP di halaman login terlebih dahulu."
    );
    router.replace({ name: "Login" });
  }

  // Simpan hasil success dari cekNotelp
  if (storedSuccess) {
    successStatus.value = storedSuccess === "true"; // Konversi ke boolean
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
    const res = await fetch(
      `https://dreampos.id/admin/api/verifikasiOTP?phone=${tempPhoneNumber.value}&otp=${otp.value}`
    );
    const data = await res.json();

    if (res.ok && data.success) {
      // Login berhasil
      localStorage.setItem("phone", tempPhoneNumber.value);
      localStorage.removeItem("temp_phone_for_otp");
      localStorage.removeItem("temp_success_status");
      window.dispatchEvent(new Event("login-status-changed"));

      if (successStatus.value) {
        toast.success("✅ Login berhasil! Selamat datang kembali.");
        router.push({ name: "Home" });
      } else {
        toast.info("📋 Nomor belum terdaftar. Silakan lengkapi data.");
        router.push({ name: "Register" });
      }
    } else {
      toast.error(data.message || "Kode OTP salah atau sudah kadaluarsa.");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    toast.error(
      "Terjadi kesalahan jaringan atau server saat memverifikasi OTP."
    );
  }
};
</script>

<style scoped>
/* Anda bisa tambahkan style khusus untuk komponen ini di sini */
@keyframes float-strong {
  0% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(50px, 100px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes float-medium {
  0% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(50px, -20px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes float-light {
  0% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(50px, -1px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
@keyframes float-circle {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(100px, 0);
  }
  50% {
    transform: translate(100px, 100px);
  }
  75% {
    transform: translate(0, 100px);
  }
  100% {
    transform: translate(0, 0);
  }
}

/* kelas animasi melingkar */
.mobile-float-circle {
  animation: float-circle 6s linear infinite;
}

/* Kelas animasinya */
.mobile-float-strong {
  animation: float-strong 5s ease-in-out infinite;
}
.mobile-float-medium {
  animation: float-medium 6s ease-in-out infinite;
}
.mobile-float-light {
  animation: float-light 8s ease-in-out infinite;
}
</style>
