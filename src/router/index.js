// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";

// Import semua komponen View Anda
import Login from "../views/Login.vue";
import Otp from "../views/Otp.vue";
import Register from "../views/Register.vue";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import RottePoin from "../views/RottePoin.vue";
import TukarPoin from "../views/TukarPoin.vue";
import ProductDetail from "../views/ProductDetail.vue";
import DetailClaim from "../views/DetailClaim.vue";
import SyaratKetentuan from "../views/SyaratKetentuan.vue";
import KebijakanPrivasi from "../views/KebijakanPrivasi.vue";
import FAQ from "../views/FAQ.vue";
import Outlet from "../views/Outlet.vue";

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      hideNavbarFooter: true, // Untuk menyembunyikan Navbar/Footer di halaman ini
      authFlow: true, // Menandakan ini bagian dari alur autentikasi
    },
  },
  {
    path: "/otp",
    name: "Otp",
    component: Otp,
    meta: {
      hideNavbarFooter: true, // Untuk menyembunyikan Navbar/Footer di halaman ini
      authFlow: true, // Menandakan ini bagian dari alur autentikasi
      requiresPhoneInput: true, // Memerlukan penanda temp_phone_for_otp dari login
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      hideNavbarFooter: true, // Untuk menyembunyikan Navbar/Footer di halaman ini
      authFlow: true, // Menandakan ini bagian dari alur autentikasi
    },
  },
  {
    path: "/profile",
    name: "Profile", // Tambahkan nama rute
    component: Profile,
    meta: { requiresAuth: true }, // Memerlukan autentikasi
  },
  {
    path: "/rottepoin",
    name: "RottePoin", // Tambahkan nama rute
    component: RottePoin,
    meta: { requiresAuth: true }, // Memerlukan autentikasi
  },
  {
    path: "/tukarpoin",
    name: "TukarPoin", // Tambahkan nama rute
    component: TukarPoin,
    meta: { requiresAuth: true }, // Memerlukan autentikasi
  },
  { path: "/home", name: "Home", component: Home },
  {
    path: "/syaratketentuan",
    name: "SyaratKetentuan",
    component: SyaratKetentuan,
  },
  {
    path: "/kebijakanprivasi",
    name: "KebijakanPrivasi",
    component: KebijakanPrivasi,
  },
  {
    path: "/outlet",
    name: "Outlet",
    component: Outlet,
  },
  { path: "/faq", name: "FAQ", component: FAQ },
  {
    path: "/edit-profile",
    name: "EditProfile",
    component: () => import("../views/EditProfile.vue"),
    meta: { requiresAuth: true }, // Memerlukan autentikasi
  },
  {
    path: "/product/:id",
    name: "ProductDetail",
    component: ProductDetail,
    props: (route) => ({
      id: route.params.id,
      // Asumsi award_points di localStorage adalah string yang perlu di-parse
      awardPoints: parseInt(localStorage.getItem("award_points") || "0", 10),
    }),
    meta: { requiresAuth: true }, // Memerlukan autentikasi
  },
  {
    path: "/claim/:id",
    name: "DetailClaim",
    component: () => import("../views/DetailClaim.vue"),
    meta: { requiresAuth: true }, // Memerlukan autentikasi
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Middleware untuk navigasi: Dieksekusi sebelum setiap perubahan rute
router.beforeEach((to, from, next) => {
  // Cek status login (true jika ada 'phone' di localStorage)
  const isLoggedIn = !!localStorage.getItem("phone");
  // Cek apakah ada penanda nomor HP sementara untuk alur OTP
  const hasTempPhoneForOtp = !!localStorage.getItem("temp_phone_for_otp");

  console.log(`Navigating to: ${to.name || to.path}, from: ${from.name || from.path}`);
  console.log(`isLoggedIn: ${isLoggedIn}, hasTempPhoneForOtp: ${hasTempPhoneForOtp}`);

  // 1. Jika pengguna SUDAH LOGIN dan mencoba mengakses halaman autentikasi (Login, OTP, Register)
  if (isLoggedIn && to.meta.authFlow) {
    console.log("Sudah login, redirecting from authFlow page to /home");
    return next({ name: "Home" });
  }

  // 2. Logika khusus untuk halaman OTP:
  //    Jika rute tujuan adalah OTP, TAPI belum ada penanda `temp_phone_for_otp` DAN belum login,
  //    maka arahkan kembali ke halaman Login.
  if (to.meta.requiresPhoneInput && !hasTempPhoneForOtp && !isLoggedIn) {
    console.log("Attempted to access OTP without temp_phone_for_otp and not logged in, redirecting to /login");
    return next({ name: "Login" });
  }

  // 3. Logika untuk rute yang memerlukan autentikasi:
  //    Jika rute tujuan memerlukan autentikasi (`requiresAuth: true`), TAPI pengguna belum login,
  //    maka arahkan kembali ke halaman Login.
  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log("Requires auth, but not logged in, redirecting to /login");
    return next({ name: "Login" });
  }

  // 4. Logika pembersihan `temp_phone_for_otp`:
  //    Hapus `temp_phone_for_for_otp` ketika pengguna meninggalkan halaman OTP ke halaman non-autentikasi
  //    Ini mencegah akses langsung ke OTP jika pengguna navigasi keluar dari alur tanpa login.
  if (from.name === "Otp" && !to.meta.authFlow && !isLoggedIn) {
    console.log("Leaving OTP page to non-auth flow, clearing temp_phone_for_otp");
    localStorage.removeItem("temp_phone_for_otp");
  }

  // Jika tidak ada kondisi di atas yang terpenuhi, lanjutkan navigasi.
  next();
});

export default router;
