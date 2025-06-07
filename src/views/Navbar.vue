<template>
  <!-- Bar atas -->
  <div class="grid grid-cols-2 bg-red-600 text-white text-sm px-4 py-1 font-semibold">
    <div class="text-left sm:text-xl">
      {{ isLoggedIn ? "Halo, " + customerName : "" }}
    </div>
    <div class="text-right">Layanan Pelanggan</div>
  </div>

  <!-- Navbar utama -->
  <div class="flex items-center justify-between px-6 py-4 shadow-lg mb-6">
    <!-- Logo -->
    <div class="flex items-center space-x-2">
      <router-link to="/home"><img src="/src/assets/Rotte_Logo 1.png" alt="Logo" class="h-14 w-auto sm:ml-10" /></router-link>
    </div>

    <!-- Search -->
    <!-- <div class="flex-1 mx-8">
      <div class="flex">
        <input
          v-model="searchQuery"
          @input="searchProducts"
          type="text"
          placeholder="Cari produk..."
          class="w-full border border-red-500 rounded-md px-4 py-2 text-sm focus:outline-none"
        />
        <button
          class="bg-red-600 text-white px-4 rounded-md flex items-center justify-center ml-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-white hover:text-gray-600 transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
      <div v-if="products.length">
        <div v-for="product in products" :key="product.id" class="product-card">
          <img :src="product.image" :alt="product.name" />
          <h3>{{ product.name }}</h3>
          <p>Rp {{ formatPrice(product.price) }}</p>
          <p>{{ product.details }}</p>
        </div>
      </div>
    </div> -->

    <!-- Tombol -->
    <div class="flex items-center space-x-4 font-semibold">
      <router-link to="/home" class="hover:text-red-600 hover:font-bold">Home</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Daftar</router-link>
      <router-link v-if="!isLoggedIn" to="/login">
        <button
          class="flex items-center bg-gradient-to-r to-[#D00B0B] from-[#FF6262] hover:bg-gradient-to-r hover:from-[#D00B0B] hover:to-[#FF6262] text-white hover:text-red-950 px-4 py-2 rounded text-sm"
        >
          <span class="mr-1"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </span>
          Masuk
        </button>
      </router-link>
      <template v-else>
        <router-link to="/profile" class="hover:text-red-600 hover:font-bold">Profil</router-link>
        <button @click="logout" class="bg-[#FF0000] py-2 px-4 text-white hover:bg-[#da3838] hover:text-red-200">Logout</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { getPromo } from "../api/API";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification"; // ✅ import toast

const toast = useToast(); // ✅ setup toast
const promos = ref([]);
const searchQuery = ref("");
const products = ref([]);
let timeout = null;

const isLoggedIn = ref(false);
const router = useRouter();
const customerName = ref(""); // Store the customer's name
const awardPoints = ref(0);

const fetchCustomerProfile = async (phone) => {
  const response = await fetch(`https://dreampos.id/admin/api/getCustomer`);
  const data = await response.json();
  const customer = data.find((cust) => cust.phone === phone);
  if (customer) {
    customerName.value = customer.name;
    localStorage.setItem("customerId", customer.id); // Menyimpan customer ID
    awardPoints.value = parseInt(customer.award_points || 0, 10);
    localStorage.setItem("award_points", awardPoints.value); // Simpan ke localStorage
  } else {
    customerName.value = "Pelanggan tidak ditemukan";
  }
};

const updateLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem("phone");
  if (isLoggedIn.value) {
    const phone = localStorage.getItem("phone");
    fetchCustomerProfile(phone); // Mengambil data profil
  } else {
    customerName.value = "";
  }
};

onMounted(() => {
  updateLoginStatus();
  window.addEventListener("login-status-changed", updateLoginStatus);
  fetchCustomerProfile(); // Fetch customer profile when component is mounted
});

onMounted(() => {
  updateLoginStatus(); // Initialize status on component mount
  window.addEventListener("login-status-changed", updateLoginStatus); // Listen for status change
});

onUnmounted(() => {
  window.removeEventListener("login-status-changed", updateLoginStatus); // Clean up listener
});

const logout = () => {
  localStorage.clear();
  toast.success("Berhasil logout. Sampai jumpa lagi!"); // ✅ notifikasi logout
  isLoggedIn.value = false;
  customerName.value = "";
  router.push("/login");
  window.dispatchEvent(new Event("login-status-changed")); // Trigger event for status change
};

onMounted(async () => {
  try {
    promos.value = await getPromo();
  } catch (error) {
    console.error("Gagal mengambil promo:", error);
  }
});

const searchProducts = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (searchQuery.value.trim() === "") {
      products.value = [];
      return;
    }

    const url = `https://dreampos.id/admin/api/getproduct?name=${encodeURIComponent(searchQuery.value)}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        products.value = data;
      })
      .catch((error) => {
        console.error("Error fetch:", error);
        products.value = [];
      });
  }, 400);
};

const formatPrice = (value) => {
  return parseInt(value).toLocaleString("id-ID");
};
</script>
