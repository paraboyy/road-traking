<template>
  <div class="">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">GIS || Road Tracker</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Data Desa</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/dataruasjalan">Data Jalan</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/ruasjalan">Tambah Jalan</a>
            </li>
          </ul>
          <a href="/login"><button class="btn btn-danger">Logout</button></a>
        </div>
      </div>
    </nav>

    <div class="mt-5 mx-5 p-5 shadow-lg glass-effect">
      <div class="row">
        <!-- Sidebar untuk pencarian -->
        <div class="col-md-4 p-4 shadow-lg mx-4 glass-effect">
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
        <div class="col-md-6 p-4 shadow-lg mx-4 glass-effect">
          <div v-if="desas.length">
            <table class="table table-warning table-hover table-striped-columns">
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

  .backgroundimg{
        background-image: url('https://www.denpasarkota.go.id/public/uploads/Background_221903010352_pemerintah-kota-denpasar.jpg');
        background-repeat: no-repeat; 
        background-size: cover; 
        background-position: center; 
        background-attachment: fixed;
    }
  </style>
  