<template>
    <div class="mt-5 mx-5 shadow-lg p-5 border border-2 border-dark">
      <div class="row">
        <!-- Sidebar untuk pencarian -->
        <div class="col-md-4 p-4 shadow-lg mx-4 border border-2 border-dark">
          <h3 class="mb-4">Search</h3>
          <div class="mb-3">
            <label for="province" class="form-label">Pilih Provinsi:</label>
            <select id="province" class="form-select" v-model="selectedProvince" @change="onProvinceChange">
              <option v-for="province in provinces" :key="province.id" :value="province.id">
                {{ province.provinsi }}
              </option>
            </select>
          </div>
  
          <div v-if="kabupatens.length" class="mb-3">
            <label for="kabupaten" class="form-label">Pilih Kabupaten:</label>
            <select id="kabupaten" class="form-select" v-model="selectedKabupaten" @change="onKabupatenChange">
              <option v-for="kabupaten in kabupatens" :key="kabupaten.id" :value="kabupaten.id">
                {{ kabupaten.value }}
              </option>
            </select>
          </div>
  
          <div v-if="kecamatans.length" class="mb-3">
            <label for="kecamatan" class="form-label">Pilih Kecamatan:</label>
            <select id="kecamatan" class="form-select" v-model="selectedKecamatan" @change="onKecamatanChange">
              <option v-for="kecamatan in kecamatans" :key="kecamatan.id" :value="kecamatan.id">
                {{ kecamatan.value }}
              </option>
            </select>
          </div>
        </div>
  
        <!-- Tabel data di sebelah kanan -->
        <div class="col-md-6 p-4 shadow-lg mx-4 border border-2 border-dark">
          <div v-if="desas.length">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Nama Desa</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="desa in desas" :key="desa.id">
                  <td>{{ desa.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        provinces: [],
        kabupatens: [],
        kecamatans: [],
        desas: [],
        selectedProvince: null,
        selectedKabupaten: null,
        selectedKecamatan: null
      };
    },
    created() {
      this.fetchProvinces();
    },
    methods: {
      async fetchProvinces() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('https://gisapis.manpits.xyz/api/mregion', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.provinces = response.data.provinsi;
          this.kabupatens = response.data.kabupaten;
          this.kecamatans = response.data.kecamatan;
          this.desas = response.data.desa;
        } catch (error) {
          console.error(error);
        }
      },
      async fetchKabupaten() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://gisapis.manpits.xyz/api/kabupaten/${this.selectedProvince}`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.kabupatens = response.data.kabupaten;
          this.kecamatans = [];
          this.desas = [];
        } catch (error) {
          console.error(error);
        }
      },
      async fetchKecamatan() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://gisapis.manpits.xyz/api/kecamatan/${this.selectedKabupaten}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.kecamatans = response.data.kecamatan;
          this.desas = [];
        } catch (error) {
          console.error(error);
        }
      },
      async fetchDesa() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`https://gisapis.manpits.xyz/api/desa/${this.selectedKecamatan}`,{
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.desas = response.data.desa;
        } catch (error) {
          console.error(error);
        }
      },
      onProvinceChange() {
        this.fetchKabupaten();
      },
      onKabupatenChange() {
        this.fetchKecamatan();
      },
      onKecamatanChange() {
        this.fetchDesa();
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  </style>
  