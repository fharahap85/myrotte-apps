<!-- src/views/Register.vue -->
<template>
  <div>
    <h2>Registrasi</h2>
    <form @submit.prevent="register">
      <input v-model="name" placeholder="Nama Lengkap" />
      <input v-model="dob" type="date" />
      <select v-model="gender">
        <option value="">Pilih Gender</option>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>
      <button type="submit">Daftar</button>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const phone = localStorage.getItem("phone");
const name = ref("");
const dob = ref("");
const gender = ref("");

const register = async () => {
  const res = await fetch(`/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone,
      name: name.value,
      birth: dob.value,
      gender: gender.value,
    }),
  });
  const data = await res.json();

  if (data.success) {
    router.push("/home");
  } else {
    alert(data.message);
  }
};
</script>
