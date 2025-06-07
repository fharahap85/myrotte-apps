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
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

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
    toast.warning("Anda belum login.");
    router.push("/login");
    return;
  }

  try {
    const res = await fetch("https://dreampos.id/admin/api/getCustomer");
    if (!res.ok) throw new Error("Gagal mengambil data pengguna");

    const json = await res.json();
    const data = Array.isArray(json) ? json : json.data;

    const user = data.find((u) => String(u.phone) === String(phone));
    if (!user) {
      toast.error("Data pengguna tidak ditemukan.");
      router.push("/login");
      return;
    }

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
  } catch (err) {
    toast.error("Gagal mengambil data profil: " + err.message);
  }
});

const submitForm = async () => {
  if (!userId.value) {
    toast.error("Gagal update: ID tidak ditemukan.");
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
    toast.success("✅ Profil berhasil diperbarui!");
    router.push("/profile");
  } else {
    toast.error("❌ Gagal mengupdate profil.");
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
