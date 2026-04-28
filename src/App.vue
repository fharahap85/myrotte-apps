<!--src/App.vue-->
<template>
  <div class="max-w-full">
    <Navbar v-if="!$route.meta.hideNavbarFooter" />
    <router-view />

    <Footer v-if="!$route.meta.hideNavbarFooter" />
    <!-- <div v-if="token">
      <p>Firebase Token: {{ token }}</p>
    </div> -->
  </div>
</template>

<script>
import Footer from "./views/Footer.vue";
import Navbar from "./views/Navbar.vue";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD5yt182xOHeUnxa06vz1SwF4cxQJE49KU",
  authDomain: "notifikasi-74c94.firebaseapp.com",
  projectId: "notifikasi-74c94",
  storageBucket: "notifikasi-74c94.firebasestorage.app",
  messagingSenderId: "632621079630",
  appId: "1:632621079630:web:bcffc7d2e4b5a481cfb71f",
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging();

export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      token: "", // Menyimpan token
    };
  },
  created() {
    // Mendapatkan token dan menyimpannya di data komponen
    getToken(messaging, {
      vapidKey:
        "BOYhj6vysb_YmJ0ozF8wDNXN_XjNQuVYdV8JumbJXOXVrNXBs3pmDym-gr9vLnDNr583Lkuw9quOXVEsSnu_7mQ",
    })
      .then((currentToken) => {
        if (currentToken) {
          this.token = currentToken; // Menyimpan token ke dalam data
          console.log("Token is : ", currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });

    // Mendengarkan pesan masuk
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
    });
  },
};
</script>
