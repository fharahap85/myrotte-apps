<!--src/views/Footer.vue-->
<template>
  <div class="bg-gradient-to-t from-[#780000] to-[#0B0808] sm:h-[535px] mt-5">
    <!-- Layer background image dengan transparansi -->
    <div class="relative">
      <div
        class="h-[530px] absolute inset-0 bg-[url('/src/assets/logo_putih_rotte.png')] bg-no-repeat bg-[length:600px] bg-[position:100px_top] opacity-20 pointer-events-none"
        aria-hidden="true"
      ></div>

      <!-- Konten Utama -->
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mx-6 lg:p-20 lg:mx-20 text-white font-bold">
        <div>
          <img src="/src/assets/logo_putih_rotte.png" alt="" class="h-[172.79px] mt-10 lg:mt-0 mb-5 object-center" />
          <p class="font-normal w-auto text-[20px] lg:w-[80%] text-justify">
            My Rotte - Belanja Roti dapat kan Poin dan tukarkan poin nya dengan hadiah menarik, banyak promo baru yang selalu update, jangan
            sampai ketinggalan.
          </p>
        </div>

        <div>
          <div class="grid sm:justify-center mt-5 sm:mt-0 h-64">
            <div class="sm:self-end self-center">
              <div class="flex-1">
                <h2 class="text-[25px] font-semibold mb-2">Kontak Kami</h2>
                <p class="text-[20px] font-normal mb-4">PT. Babada Wasaka Indonesia</p>
                <div class="flex space-x-4 text-2xl">
                  <a href="#" class="hover:text-red-400"><i class="fab fa-youtube fa-xl"></i></a>
                  <a href="#" class="hover:text-red-400"><i class="fab fa-instagram fa-xl"></i></a>
                  <a href="#" class="hover:text-red-400"><i class="fab fa-dribbble fa-xl"></i></a>
                  <a href="#" class="hover:text-red-400"><i class="fab fa-facebook-f fa-xl"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="grid sm:justify-end mt-5 sm:mt-0 h-64">
            <div class="sm:self-end">
              <div class="flex-1 border-l border-gray-300 pl-6">
                <ul class="space-y-5 sm:text-[25px] text-[20px] font-semibold">
                  <li><router-link to="#" class="hover:text-red-400">Home</router-link></li>
                  <li><router-link to="/outlet" class="hover:text-red-400">Outlet Kami</router-link></li>
                  <li><router-link to="/kebijakanprivasi" class="hover:text-red-400">Kebijakan Privasi</router-link></li>
                  <li><router-link to="/syaratketentuan" class="hover:text-red-400">Syarat Ketentuan</router-link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
