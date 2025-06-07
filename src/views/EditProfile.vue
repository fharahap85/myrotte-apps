<template>
  <div class="max-w-xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Edit Profil</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <input v-model="form.name" placeholder="Nama" class="input" />
      <select v-model="form.gender" class="input">
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>
      <input type="date" v-model="form.birth" class="input" />
      <input v-model="form.email" placeholder="Email" class="input" />
      <input v-model="form.phone" placeholder="No. WhatsApp" class="input" />
      <input v-model="form.city" placeholder="Kota" class="input" />
      <textarea v-model="form.address" placeholder="Alamat" class="input"></textarea>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan Perubahan</button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({
  name: "",
  gender: "",
  birth: "",
  email: "",
  phone: "",
  city: "",
  address: "",
});
const userId = ref(null); // ID akan disimpan di sini

onMounted(async () => {
  const phone = localStorage.getItem("phone");
  if (!phone) {
    alert("Nomor telepon tidak ditemukan di localStorage.");
    router.push("/login");
    return;
  }

  try {
    const res = await fetch("https://dreampos.id/admin/api/getCustomer");
    if (!res.ok) throw new Error("Gagal mengambil data user");

    const data = await res.json();
    const user = data.find((u) => u.phone === phone);

    if (user) {
      userId.value = user.id;
      form.value = {
        name: user.name || "",
        gender: user.gender || "",
        birth: user.birth || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
      };
    } else {
      alert("Data user tidak ditemukan.");
      router.push("/login");
    }
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
});

const submitForm = async () => {
  if (!userId.value) {
    alert("Gagal update: ID tidak ditemukan");
    return;
  }

  const res = await fetch(`/api/editUser?id=${userId.value}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form.value),
  });

  const data = await res.json();
  if (data.success) {
    alert("Profil berhasil diupdate!");
    router.push("/profile");
  } else {
    alert("Gagal mengupdate profil.");
  }
};
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}
</style>
