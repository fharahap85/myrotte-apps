<template>
  <div class="grid grid-cols-2 gap-4 mt-4">
    <div
      v-for="product in products"
      :key="product.id"
      class="border p-2 rounded"
    >
      <h2 class="text-lg font-bold">{{ product.name }}</h2>
      <p class="text-sm text-gray-600">
        Rp {{ Number(product.price).toLocaleString() }}
      </p>
      <img
        :src="product.image"
        alt="gambar"
        class="w-full h-100 object-cover rounded mb-2"
      />
      <!-- <button
        @click="$emit('addToCart', product)"
        class="bg-green-500 text-white px-3 py-1 mt-2 rounded hover:bg-green-600"
      >
        Tambah
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { getProductsByCategory } from "../api/API";

const props = defineProps(["kategoriId"]);
const products = ref([]);

watch(
  () => props.kategoriId,
  async (newId) => {
    if (!newId) return;
    try {
      products.value = await getProductsByCategory(newId);
    } catch (err) {
      console.error(err.message);
    }
  },
  { immediate: true }
);
</script>
