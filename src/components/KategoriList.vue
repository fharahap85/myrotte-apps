<template>
  <div class="overflow-x-auto whitespace-nowrap px-2 py-3 justify-center">
    <div class="flex gap-4 items-start">
      <button
        v-for="kategori in kategoris"
        :key="kategori.id"
        @click="$emit('select', kategori.id)"
      >
        <div class="flex flex-col items-center flex-none text-center">
          <div class=" min-h-20 min-w-20 bg-gray-100 rounded-lg p-4 hover:bg-red-500">
            <img
              :src="kategori.image"
              alt="gambar"
              class="w-full h-full object-cover rounded mb-2"
            />
          </div>
        </div>
        <span
          class="text-sm font-medium mt-2 text-red-500 break-words whitespace-normal max-w-[100px]"
        >
          {{ kategori.nama_kategori }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const kategoris = ref([]);

onMounted(async () => {
  const res = await fetch("https://dreampos.id/admin/api/getKategori");
  const data = await res.json();
  kategoris.value = data;
});
</script>
