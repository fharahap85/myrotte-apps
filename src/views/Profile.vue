<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Profil Pengguna</h1>
    <div v-if="loading">Memuat data…</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- Jika tidak ada data yang cocok -->
    <div v-else-if="filtered.length === 0" class="italic text-gray-500">
      Data profil tidak ditemukan.
    </div>

    <!-- Tampilkan data yang sudah difilter -->
    <div v-else>
      <div
        v-for="item in filtered"
        :key="item.id || item.phone"
        class="mb-2 border p-4 rounded-t-xl bg-gray-200 shadow"
      >
        <div class="flex items-start space-x-2 mb-2">
          <div class="grid grid-flow-col grid-rows-1 gap-4">
            <div class="row-span-2 ...">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#D00B0B"
                class="size-16"
              >
                <path
                  fill-rule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="col-span-1 ...">
              <p class="font-semibold text-lg">{{ item.name }}</p>
              <p class="text-gray-600">{{ item.phone }}</p>
              <p class="text-gray-600">{{ item.award_points }}</p>
            </div>
          </div>
        </div>
      </div>
      <router-link to="/edit-profile">
        <div
          class="border p-2 bg-white hover:bg-[#D00B0B] hover:text-white shadow font-medium"
        >
          <div class="flex items-start space-x-2 m-2">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 mr-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg> </span
            >Edit Profil
          </div>
        </div>
      </router-link>
      <router-link to="/faq">
        <div
          class="border p-2 bg-white hover:bg-[#D00B0B] hover:text-white shadow font-medium"
        >
          <div class="flex items-start space-x-2 m-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 mr-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg> </span
            >FAQ
          </div>
        </div>
      </router-link>
      <router-link to="/syaratketentuan">
        <div
          class="border p-2 bg-white hover:bg-[#D00B0B] hover:text-white shadow font-medium"
        >
          <div class="flex items-start space-x-2 m-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 mr-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg> </span
            >Syarat & Ketentuan
          </div>
        </div>
      </router-link>
      <router-link to="/kebijakanprivasi">
        <div
          class="border p-2 bg-white hover:bg-[#D00B0B] hover:text-white shadow font-medium"
        >
          <div class="flex items-start space-x-2 m-2">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 mr-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
                />
              </svg> </span
            >Kebijakan Privasi
          </div>
        </div>
      </router-link>
      <!-- <router-link to="/edit-profile">
        <div
          class="border p-2 rounded-b-xl bg-white hover:bg-[#D00B0B] hover:text-white shadow font-medium"
        >
          <div class="flex items-start space-x-2 m-2">
            <span
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 mr-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg> </span
            >Hubungi Kami
          </div>
        </div>
      </router-link> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const phone = localStorage.getItem("phone"); // nomor user yang login
const raw = ref([]); // data asli dari API
const loading = ref(true);
const error = ref("");

// ➡️ Data yang sudah difilter: hanya yang phone-nya sama
const filtered = computed(() =>
  raw.value.filter((c) => String(c.phone) === String(phone))
);

onMounted(async () => {
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
</script>
