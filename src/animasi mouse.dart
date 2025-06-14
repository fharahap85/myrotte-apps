<template>
  <div id="app" @mousemove="moveImages">
    <div class="background">
      <!-- Gambar pertama -->
      <img :style="image1Style" src="/src/assets/Rotte_Logo 1.png" class="moving-image" alt="Image 1" />
      <!-- Gambar kedua -->
      <img :style="image2Style" src="/src/assets/Rotte_Logo 1.png" class="moving-image" alt="Image 2" />
      <!-- Gambar ketiga -->
      <img :style="image3Style" src="/src/assets/Rotte_Logo 1.png" class="moving-image" alt="Image 3" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Posisi acak untuk gambar
      image1InitialPos: this.getRandomPosition(),
      image2InitialPos: this.getRandomPosition(),
      image3InitialPos: this.getRandomPosition(),
      
      // Posisi saat ini (inicialisasi dengan posisi acak)
      image1Style: {},
      image2Style: {},
      image3Style: {},
    };
  },
  mounted() {
    // Setelah halaman dimuat, set posisi gambar dengan posisi acak
    this.image1Style = { ...this.image1InitialPos };
    this.image2Style = { ...this.image2InitialPos };
    this.image3Style = { ...this.image3InitialPos };
  },
  methods: {
    // Fungsi untuk mendapatkan posisi acak
    getRandomPosition() {
      const randomX = Math.random() * 100; // Posisi acak horizontal (0-100%)
      const randomY = Math.random() * 100; // Posisi acak vertikal (0-100%)
      return {
        position: 'absolute',
        top: `${randomY}%`,
        left: `${randomX}%`,
        transform: 'translate(-50%, -50%)',
        transition: 'all 0.1s ease', // Transisi halus
      };
    },
    moveImages(event) {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Untuk gambar pertama, pergerakan lebih halus
      this.image1Style.left = `${parseFloat(this.image1InitialPos.left) + (mouseX - window.innerWidth / 2) / 30}%`;
      this.image1Style.top = `${parseFloat(this.image1InitialPos.top) + (mouseY - window.innerHeight / 2) / 30}%`;

      // Untuk gambar kedua, pergerakan lebih lembut
      this.image2Style.left = `${parseFloat(this.image2InitialPos.left) + (mouseX - window.innerWidth / 2) / 50}%`;
      this.image2Style.top = `${parseFloat(this.image2InitialPos.top) + (mouseY - window.innerHeight / 2) / 50}%`;

      // Untuk gambar ketiga, sedikit lebih acak
      this.image3Style.left = `${parseFloat(this.image3InitialPos.left) + (mouseX - window.innerWidth / 2) / 40}%`;
      this.image3Style.top = `${parseFloat(this.image3InitialPos.top) + (mouseY - window.innerHeight / 2) / 40}%`;
    },
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #000;
}

.background {
  position: relative;
  width: 100%;
  height: 100vh;
}

.moving-image {
  position: absolute;
  transition: all 0.1s ease;
  width: 100px; /* Atur sesuai dengan ukuran gambar */
  height: 100px;
  object-fit: contain;
  pointer-events: none;
}

@media (max-width: 768px) {
  .moving-image {
    width: 80px;
    height: 80px;
  }
}
</style>
