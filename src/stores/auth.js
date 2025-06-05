// src/stores/auth.js
import { reactive } from "vue";

export const auth = reactive({
  isLoggedIn: !!localStorage.getItem("phone"),
  phone: localStorage.getItem("phone") || "",
  login(phone) {
    this.isLoggedIn = true;
    this.phone = phone;
    localStorage.setItem("phone", phone);
  },
  logout() {
    this.isLoggedIn = false;
    this.phone = "";
    localStorage.clear();
  },
});
