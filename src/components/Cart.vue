<template>
  <div>
    <h2 class="text-xl font-semibold mb-2">Keranjang</h2>
    <div v-if="cart.length === 0">Keranjang kosong.</div>
    <div
      v-for="item in cart"
      :key="item.id"
      class="flex justify-between items-center border-b py-2"
    >
      <div>
        <div class="font-medium">{{ item.name }}</div>
        <div class="text-sm text-gray-600">Qty: {{ item.qty }}</div>
      </div>
      <div class="flex items-center gap-2">
        <div>Rp {{ (item.price * item.qty).toLocaleString() }}</div>
        <button
          @click="$emit('remove', item.id)"
          class="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
    </div>
    <hr class="my-2" />
    <div class="font-bold text-right">
      Total: Rp {{ total.toLocaleString() }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps(["cart"]);

const total = computed(() => {
  return props.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
});
</script>