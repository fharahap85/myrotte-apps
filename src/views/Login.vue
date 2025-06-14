<template>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
  </head>

  <!-- Gambar Melayang -->
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

  <!-- Konten Login -->
  <div
    class="flex h-screen w-full items-center justify-center bg-gradient-to-tr from-white to-blue-100 text-white bg-cover bg-no-repeat"
    :style="{ backgroundImage: `url(${bgimage})` }"
  >
    <div
      class="rounded-xl max-w-md bg-gray-300 mx-6 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8"
    >
      <div class="text-center">
        <div class="flex flex-col items-center">
          <img
            src="/src/assets/Rotte_Logo 1.png"
            width="100"
            alt=""
            srcset=""
          />
          <h1 class="mb-2 text-2xl">Login</h1>
          <span class="text-shadow-2xl"
            >Selamat Datang, silahkan login menggunakan nomor hp anda</span
          >
        </div>
        <form @submit.prevent="submitPhone">
          <div class="flex mt-2">
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
            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-lg px-10 py-2 mb-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt-3"
            type="submit"
          >
            Login
          </button>
        </form>
        <span class=""
          >Dengan melanjutkan, kamu setuju dengan
          <b
            ><router-link to="/syaratketentuan" class="hover:text-red-400"
              >Syarat & Ketentuan</router-link
            ></b
          >
          serta
          <b>
            <router-link to="/kebijakanprivasi" class="hover:text-red-400"
              >Kebijakan Privasi</router-link
            ></b
          >
          kami</span
        >
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

const router = useRouter();
const phone = ref(""); // Menyimpan bagian nomor HP tanpa '62'
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
    // Setelah menerima response dari cekNotelp
    const response = await fetch(
      `https://dreampos.id/admin/api/cekNotelp?phone=${fullPhone}`
    );
    const data = await response.json();

    // Simpan hasil 'success' di localStorage
    localStorage.setItem("temp_phone_for_otp", fullPhone);
    localStorage.setItem("temp_success_status", data.success); // ✅ Tambahan ini

    toast.success("✅ OTP berhasil dikirim ke nomor Anda.");
    router.push({ name: "Otp" });
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
