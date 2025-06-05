<template>
  <section class="relative mt-5">
    <div
      class="bg-gradient-to-r from-[#FF0000] to-[#B60000] text-white px-4 py-6 rounded-2xl"
    >
      <h2 class="lg:text-2xl sm:text-lg font-bold mb-4">Produk Terlaris</h2>

      <div class="overflow-x-auto mx-7">
        <swiper
          :space-between="20"
          :centered-slides="true"
          :loop="true"
          :autoplay="{ delay: 2000, disableOnInteraction: false }"
          :pagination="{ el: '.swiper-pagination', clickable: true }"
          :navigation="{ nextEl: '#custom-next1', prevEl: '#custom-prev1' }"
          :modules="[Pagination, Navigation, Autoplay]"
          :breakpoints="{
            0: { slidesPerView: 2 }, // Mobile
            640: { slidesPerView: 2 }, // Tablet (sm)
            1024: { slidesPerView: 4.4 }, // Desktop (lg+)
          }"
          class="mySwiper"
        >
          <swiper-slide v-for="(best, index) in bestSellers" :key="index">
            <div class="bg-white text-black rounded-xl p-2">
              <img
                :src="best.image"
                alt="Promo"
                class="w-full h-full object-cover rounded-xl"
              />
              <h1 class="font-bold lg:text-2xl text-xs">{{ best.name }}</h1>
              <h1 class="lg:text-lg text-xs">
                Rp{{ Number(best.price).toLocaleString(0) }}
              </h1>
            </div>
          </swiper-slide>
          <div class="swiper-pagination relative mt-4"></div>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

const bestSellers = ref([]);

onMounted(async () => {
  try {
    const response = await fetch("https://dreampos.id/admin/api/getBestSeller");
    bestSellers.value = await response.json();
  } catch (error) {
    console.error("Gagal mengambil promo:", error);
  }
});
</script>
