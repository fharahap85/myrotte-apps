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
          <h1 class="mb-2 text-2xl">Register</h1>
        </div>
        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Nama Lengkap</label
            >
            <input
              v-model="name"
              type="text"
              placeholder="Nama Lengkap"
              class="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Tanggal Lahir</label
            >
            <input
              v-model="dob"
              type="date"
              class="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Gender</label
            >
            <select
              v-model="gender"
              class="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <button
            type="submit"
            class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-lg px-10 py-2 mb-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt-3"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useToast } from "vue-toastification";
import image from "/src/assets/icon point.png";
import bgimage from "/src/assets/bgwebbase.jpg";

const toast = useToast();
const router = useRouter();
const phone = localStorage.getItem("phone");

const name = ref("");
const dob = ref("");
const gender = ref("");

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

const register = async () => {
  if (!name.value || !dob.value || !gender.value) {
    toast.warning("Mohon lengkapi semua data terlebih dahulu.");
    return;
  }

  try {
    const res = await fetch(`https://dreampos.id/admin/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        name: name.value,
        birth: dob.value,
        gender: gender.value,
      }),
    });
    const data = await res.json();

    if (data.success) {
      toast.success("Registrasi berhasil! Selamat datang 🎉");
      router.push("/home");
    } else {
      toast.error(data.message || "Registrasi gagal. Coba lagi.");
    }
  } catch (err) {
    toast.error("Terjadi kesalahan saat registrasi.");
    console.error(err);
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
