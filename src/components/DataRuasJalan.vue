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
          <div v-if="dataruasjalan.length">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Nama Desa</th>
                  <th scope="col">Kode Ruas</th>
                  <th scope="col">Nama Ruas</th>
                  <th scope="col">Panjang Jalan</th>
                  <th scope="col">Lebar Jalan</th>
                  <th scope="col">Eksisting</th>
                  <th scope="col">Kondisi Jalan</th>
                  <th scope="col">Jenis Jalan</th>
                  <th scope="col">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="jalan in dataruasjalan" :key="jalan.id">
                  <td>{{ getNamaDesa(jalan.desa_id) }}</td>
                  <td>{{ jalan.kode_ruas }}</td>
                  <td>{{ jalan.nama_ruas }}</td>
                  <td>{{ jalan.panjang }}</td>
                  <td>{{ jalan.lebar }}</td>
                  <td>{{ getNamaEksisting(jalan.eksisting_id) }}</td>
                  <td>{{ getNamaKondisi(jalan.kondisi_id) }}</td>
                  <td>{{ getNamaJenisJalan(jalan.jenisjalan_id) }}</td>
                  <td>{{ jalan.keterangan }}</td>
                </tr>
              </tbody>
            </table>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      dataruasjalan: [],
      desas: [],
      eksistings: [],
      kondisis: [],
      jenisJalans: []
    }
  },
  created() {
    this.fetchDataJalan();
    this.fetchDesas();
    this.fetchEksistings();
    this.fetchKondisis();
    this.fetchJenisJalans();
  },
  methods: {
    async fetchDataJalan() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://gisapis.manpits.xyz/api/ruasjalan', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.dataruasjalan = response.data.ruasjalan;
      } catch (error) {
        console.error(error);
      }
    },
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
    getNamaDesa(id) {
      const desa = this.desas.find(d => d.id === id);
      return desa ? desa.desa : 'Tidak ditemukan';
    },
    getNamaEksisting(id) {
      const eksisting = this.eksistings.find(e => e.id === id);
      return eksisting ? eksisting.eksisting : 'Tidak ditemukan';
    },
    getNamaKondisi(id) {
      const kondisi = this.kondisis.find(k => k.id === id);
      return kondisi ? kondisi.kondisi : 'Tidak ditemukan';
    },
    getNamaJenisJalan(id) {
      const jenisJalan = this.jenisJalans.find(j => j.id === id);
      return jenisJalan ? jenisJalan.jenisjalan : 'Tidak ditemukan';
    }
  }
}
</script>
