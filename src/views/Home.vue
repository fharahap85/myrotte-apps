<!--src/views/Home.vue-->
<template>
  <div class="mx-auto">
    <Header />
    <div class="p-4 max-w-7xl mx-auto">
      <div v-for="item in filtered" :key="item.id || item.phone" class="grid grid-cols-2 border p-4 rounded-xl shadow text-[#FF0000]">
        <router-link to="/rottepoin">
          <div class="flex justify-start items-center space-x-4">
            <img src="/src/assets/Tukar point.png" alt="" class="size-16" />
            <p class="font-semibold text-lg text-left">
              Rotte Poin <br />
              {{ item.award_points }}
            </p>
          </div>
        </router-link>
        <router-link to="/tukarpoin">
          <div class="flex-1 border-l">
            <div class="flex justify-end items-center space-x-4">
              <p class="font-semibold text-lg text-right">Tukar<br />Poin</p>
              <img src="/src/assets/Tukar point.png" alt="" class="size-16" />
            </div>
          </div>
        </router-link>
      </div>
      <BestSeller />
      <h1 class="text-2xl sm:text-3xl font-bold mb-4 mt-4">Kategori</h1>
      <KategoriList @select="setKategori" />
      <div v-if="kategoriId" class="mt-4">
        <ProductList :kategoriId="kategoriId" @addToCart="tambah" />
      </div>
      <!-- <div v-if="isLoggedIn">
        <p>Halo, {{ phone }}</p>
        <button @click="logout">Logout</button>
        <p>Fitur lengkap tersedia!</p>
      </div>

      <div v-else>
        <p>Selamat datang, pengunjung!</p>
        <p><i>Silakan login untuk mengakses fitur lengkap.</i></p>
        <router-link to="/login">Login</router-link>
      </div> -->
    </div>
    <div class="w-full">
      <img src="/src/assets/BG.png" alt="" class="w-full lg:mb-5 p-3 lg:p-20" />
      <img src="/src/assets/banner_bawah.png" alt="" class="w-full mt-5" />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import Header from "./Header.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import KategoriList from "../components/KategoriList.vue";
import ProductList from "../components/ProductList.vue";
import Cart from "../components/Cart.vue";
import BestSeller from "../components/BestSeller.vue";
import { useToast } from "vue-toastification"; // ✅ import toast

const toast = useToast(); // ✅ setup toast
const kategoriId = ref(null);
const cart = ref([]);
const phone = ref("");
const isLoggedIn = ref(false);
const raw = ref([]);
const loading = ref(true);
const error = ref("");

const router = useRouter();

const filtered = computed(() => raw.value.filter((c) => String(c.phone) === String(phone.value)));

onMounted(async () => {
  const p = localStorage.getItem("phone");
  if (p) {
    isLoggedIn.value = true;
    phone.value = p;
  }

  try {
    const res = await fetch("https://dreampos.id/admin/api/getCustomer");
    if (!res.ok) throw new Error("Gagal mengambil data profil");
    raw.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

const logout = () => {
  localStorage.clear();
  toast.success("Berhasil logout. Sampai jumpa lagi!"); // ✅ notifikasi logout
  router.push("/login");
};

function setKategori(id) {
  kategoriId.value = id;
}

function tambah(product) {
  const ada = cart.value.find((item) => item.id === product.id);
  if (ada) {
    ada.qty++;
  } else {
    cart.value.push({ ...product, qty: 1 });
  }
}

function hapus(id) {
  cart.value = cart.value.filter((p) => p.id !== id);
}

function checkout() {
  ("Pesanan Anda telah diproses!");
  cart.value = [];
}
</script>
