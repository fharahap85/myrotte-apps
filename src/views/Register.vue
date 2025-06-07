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
