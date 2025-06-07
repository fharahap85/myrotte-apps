<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Registrasi</h2>
      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input
            v-model="name"
            type="text"
            placeholder="Nama Lengkap"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
          <input
            v-model="dob"
            type="date"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Gender</label>
          <select
            v-model="gender"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Pilih Gender</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
          Daftar
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();
const phone = localStorage.getItem("phone");

const name = ref("");
const dob = ref("");
const gender = ref("");

const register = async () => {
  if (!name.value || !dob.value || !gender.value) {
    toast.warning("Mohon lengkapi semua data terlebih dahulu.");
    return;
  }

  try {
    const res = await fetch(`https://dreampos.id/admin/api/register`, {
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
      toast.success("Registrasi berhasil! Selamat datang 🎉");
      router.push("/home");
    } else {
      toast.error(data.message || "Registrasi gagal. Coba lagi.");
    }
  } catch (err) {
    toast.error("Terjadi kesalahan saat registrasi.");
    console.error(err);
  }
};
</script>
