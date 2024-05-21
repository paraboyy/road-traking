<template>
  <div>
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
              <a class="nav-link active" aria-current="page" href="/">Data Desa</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Data Jalan</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/ruasjalan">Tambah Jalan</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="mt-5 mx-5 p-5 shadow-lg glass-effect">
        <div class="d-flex">
            <div class="card shadow" style="width: 100%;">
                <div class="card-body">
                    <div id="map" ref="map" style="height: 400px;"></div> 
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow">
                    <div class="card-body">
                    <form @submit.prevent="addMarker">
                        <div class="form-group">
                            <label for="latitude">Nama Desa:</label>
                            <select id="province" class="form-select" v-model="selectedDesa" @change="onDesaChange">
                                <option v-for="desas in desa" :key="desas.id" :value="desas.id">
                                    {{ desas.desa }}
                                </option>
                            </select>    
                        </div>  
                        <div class="form-group">
                            <label for="nama_ruas">Nama Ruas:</label>
                            <input type="text" class="form-control" v-model="jalanForm.nama_ruas" required>
                        </div>
                        <div class="form-group">
                            <label for="Eksisting">Eksisting:</label>
                            <select id="province" class="form-select" v-model="selectedEksisting" @change="onEksistingChange">
                                <option v-for="meksistings in meksisting" :key="meksistings.id" :value="meksistings.id">
                                    {{ meksistings.eksisting }}
                                </option>                   
                            </select>
                        </div>
                        <div class="form-group">
                        <label for="Kondisi">Kondisi:</label>
                            <select id="Kondisi" class="form-select" v-model="selectedKondisi" @change="onKondisiChange">
                                <option v-for="mkondisis in mkondisi" :key="mkondisis.id" :value="mkondisis.id">
                                    {{ mkondisis.kondisi }}
                                </option>                   
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary mt-4">Add Road</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>

</template>

<script>
import L from 'leaflet';
import axios from 'axios';
export default {

    data() {
        return {
            jalanForm: {
                desa_id: '',
                kode_ruas: '',
                nama_ruas: '',
                panjang: '',
                lebar: '',
                eksisting_id: '',
                kondisi_id: '',
                jenisjalan_id: '',
                keterangan: '',
            },
            desa: [],
            meksisting: [],
            mkondisi: [],
            selectedDesa: null,
            selectedEksisting: null,
            selectedKondisi: null,
        }
    },

    mounted() {
        // Inisialisasi peta Leaflet
        this.map = L.map('map').setView([-8.6832467, 115.2095182], 11);

        // Menambahkan layer peta OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

    },

    created() {
      this.fetchDesa();
      this.fetchEksisting();
      this.fetchKondisi();
    },

    methods: {
      async fetchDesa() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('https://gisapis.manpits.xyz/api/mregion', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.desa = response.data.desa;
        } catch (error) {
          console.error(error);
        }
      },
      async fetchEksisting() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('https://gisapis.manpits.xyz/api/meksisting', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.meksisting = response.data.eksisting;
        } catch (error) {
          console.error(error);
        }
      },
      async fetchKondisi() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('https://gisapis.manpits.xyz/api/mkondisi', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.mkondisi = response.data.eksisting;
        } catch (error) {
          console.error(error);
        }
      },
      onDesaChange() {
        this.fetchDesa();
      },
      onEksistingChange() {
        this.fetchEksisting();
      },
      onKondisiChange() {
        this.fetchKondisi();
      }
    }
}
</script>

<style>

</style>