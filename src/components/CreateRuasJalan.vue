<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">GIS || Pelacak Jalan</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">Data Desa</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/dataruasjalan">Data Jalan</a>
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
            <div id="map" ref="map" style="height: 100%;"></div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card shadow">
            <div class="card-body">
              <form @submit.prevent="tambahJalan">
                <div class="form-group">
                  <label for="desa">Nama Desa:</label>
                  <select id="desa" class="form-select" v-model="selectedDesa" @change="onDesaChange">
                    <option v-for="desa in desas" :key="desa.id" :value="desa.id">
                      {{ desa.desa }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="nama_ruas">Nama Ruas:</label>
                  <input type="text" class="form-control" v-model="jalanForm.nama_ruas" required>
                </div>
                <div class="form-group">
                  <label for="lebar">Lebar Ruas:</label>
                  <input type="text" class="form-control" v-model="jalanForm.lebar" required>
                </div>
                <div class="form-group">
                  <label for="kode_ruas">Kode Ruas:</label>
                  <input type="text" class="form-control" v-model="jalanForm.kode_ruas" required>
                </div>
                <div class="form-group">
                  <label for="eksisting">Eksisting:</label>
                  <select id="eksisting" class="form-select" v-model="selectedEksisting" @change="onEksistingChange">
                    <option v-for="eksisting in eksistings" :key="eksisting.id" :value="eksisting.id">
                      {{ eksisting.eksisting }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="kondisi">Kondisi:</label>
                  <select id="kondisi" class="form-select" v-model="selectedKondisi" @change="onKondisiChange">
                    <option v-for="kondisi in kondisis" :key="kondisi.id" :value="kondisi.id">
                      {{ kondisi.kondisi }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="jenis_jalan">Jenis Jalan:</label>
                  <select id="jenis_jalan" class="form-select" v-model="selectedJenisJalan" @change="onJenisJalanChange">
                    <option v-for="jenis_jalan in jenisJalans" :key="jenis_jalan.id" :value="jenis_jalan.id">
                      {{ jenis_jalan.jenisjalan }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="keterangan">Keterangan:</label>
                  <input type="text" class="form-control" v-model="jalanForm.keterangan" required>
                </div>
                <div class="form-group">
                  <label for="panjang">Panjang Jalan (m):</label>
                  <input type="text" class="form-control" v-model="jalanForm.panjang" readonly>
                </div>
                <div class="form-group">
                  <label for="polyline">Polyline:</label>
                  <textarea class="form-control" v-model="polylineHash" readonly></textarea>
                </div>
                <button type="submit" class="btn btn-primary mt-4">Tambah Jalan</button>
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
import sha256 from 'crypto-js/sha256'; // Pastikan crypto-js sudah terpasang

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
      desas: [],
      eksistings: [],
      kondisis: [],
      jenisJalans: [],
      selectedDesa: null,
      selectedEksisting: null,
      selectedKondisi: null,
      selectedJenisJalan: null,
      polyline: null,
      polylineCoords: [],
      polylineHash: ''
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

    // Menangani event klik pada peta untuk menggambar polyline
    this.map.on('click', this.onMapClick);
  },

  created() {
    this.fetchDesas();
    this.fetchEksistings();
    this.fetchKondisis();
    this.fetchJenisJalans();
  },

  methods: {
    async fetchDesas() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://gisapis.manpits.xyz/api/mregion', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.desas = response.data.desa;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchEksistings() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://gisapis.manpits.xyz/api/meksisting', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.eksistings = response.data.eksisting;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchKondisis() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://gisapis.manpits.xyz/api/mkondisi', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.kondisis = response.data.eksisting;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchJenisJalans() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://gisapis.manpits.xyz/api/mjenisjalan', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.jenisJalans = response.data.eksisting;
      } catch (error) {
        console.error(error);
      }
    },
    onDesaChange() {
      this.fetchDesas();
    },
    onEksistingChange() {
      this.fetchEksistings();
    },
    onKondisiChange() {
      this.fetchKondisis();
    },
    onJenisJalanChange() {
      this.fetchJenisJalans();
    },
    onMapClick(e) {
      // Tambahkan titik klik ke polylineCoords
      this.polylineCoords.push(e.latlng);

      // Jika polyline sudah ada, hapus polyline tersebut
      if (this.polyline) {
        this.map.removeLayer(this.polyline);
      }

      // Gambar polyline baru
      this.polyline = L.polyline(this.polylineCoords, { color: 'red' }).addTo(this.map);

      // Hitung panjang polyline
      this.jalanForm.panjang = this.calculatePolylineLength(this.polylineCoords);

      // Hash polyline
      this.polylineHash = sha256(JSON.stringify(this.polylineCoords)).toString();
    },
    calculatePolylineLength(coords) {
      let length = 0;
      for (let i = 0; i < coords.length - 1; i++) {
        length += coords[i].distanceTo(coords[i + 1]);
      }
      return length.toFixed(2); // Panjang dalam meter dengan 2 angka desimal
    },
    async tambahJalan() {
      // Logika untuk menambah jalan ke database
      // Anda mungkin perlu menyesuaikan ini sesuai kebutuhan API Anda
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('https://gisapis.manpits.xyz/api/ruasjalan', {
          desa_id: this.selectedDesa,
          nama_ruas: this.jalanForm.nama_ruas,
          lebar: this.jalanForm.lebar,
          kode_ruas: this.jalanForm.kode_ruas,
          eksisting_id: this.selectedEksisting,
          kondisi_id: this.selectedKondisi,
          jenisjalan_id: this.selectedJenisJalan,
          keterangan: this.jalanForm.keterangan,
          panjang: this.jalanForm.panjang,
          paths: this.polylineHash, 
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        alert('Jalan berhasil ditambahkan');
      } catch (error) {
        console.error(error);
        alert('Gagal menambahkan jalan');
      }
    }
  }
}
</script>

<style>
/* Tambahkan gaya kustom Anda di sini */
</style>
