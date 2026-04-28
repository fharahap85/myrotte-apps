import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import OneSignalVuePlugin from "@onesignal/onesignal-vue3";

import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.use(Toast);
app.use(OneSignalVuePlugin, {
  appId: "7aee32c7-ed71-4984-ad52-a3c70852085c", // Ganti dengan App ID dari OneSignal
  allowLocalhostAsSecureOrigin: true, // Untuk testing di localhost
  notifyButton: {
    enable: true, // Aktifkan tombol notifikasi
  },
});

app.mount("#app");
