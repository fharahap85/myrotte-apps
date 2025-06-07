<template>
  <section class="px-4 py-6 relative">
    <swiper
      v-if="promos.length"
      :slides-per-view="1.5"
      :space-between="20"
      :centered-slides="true"
      :loop="true"
      :autoplay="{ delay: 2000, disableOnInteraction: false }"
      :pagination="{ el: '.swiper-pagination', clickable: true }"
      :navigation="{ nextEl: '#custom-next', prevEl: '#custom-prev' }"
      :modules="[Pagination, Navigation, Autoplay]"
      class="mySwiper"
    >
      <swiper-slide v-for="(promo, index) in promos" :key="index">
        <img :src="promo.pmo_image" alt="Promo" class="w-full h-full object-cover rounded-xl" />
      </swiper-slide>
      <div class="swiper-pagination relative mt-5 right-4 flex"></div>
    </swiper>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { getPromo } from "../api/API";

const promos = ref([]);
const searchQuery = ref("");
const products = ref([]);
let timeout = null;

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
