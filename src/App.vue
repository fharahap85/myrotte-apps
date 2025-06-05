<template>
  <div class="max-w-full">
    <Navbar v-if="!$route.meta.hideNavbarFooter" />

    <router-view />

    <Footer v-if="!$route.meta.hideNavbarFooter" />
  </div>
</template>

<script>
import Footer from "./views/Footer.vue"; // Pastikan path ini benar
import Navbar from "./views/Navbar.vue"; // Pastikan path ini benar

export default {
  components: {
    Navbar,
    Footer,
  },
  // Anda tidak perlu data atau computed property di sini jika hanya menggunakan $route.meta
};
</script>

<style>
/* Gaya global untuk aplikasi Anda, jika ada */
</style>