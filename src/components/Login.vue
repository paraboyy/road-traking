<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light backgroundimg">
    <div class="glass-effect p-4 rounded shadow-lg w-25">
      <h2 class="text-center mb-4 text-white">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label text-white">Email</label>
          <input v-model="email" type="email" id="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label text-white">Password</label>
          <input v-model="password" type="password" id="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-info w-100 text-white">Login</button>
        <div class="text-center">
          <p class="text-white pt-2">Don't have an account? <router-link to="/register" class="btn-link text-white">Register</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://gisapis.manpits.xyz/api/login', {
          email: this.email,
          password: this.password,
        });
        const token = response.data.meta.token;
        localStorage.setItem('token', token);
        this.$router.push('/');
      } catch (error) {
        console.error(error);
        alert('Login failed. Please check your credentials and try again.');
      }
    },
  },
};
</script>

<style>
    .backgroundimg{
        background-image: url('https://www.unud.ac.id/ac-admin/uploads/img_0744-5235598995.jpg');
        background-repeat: no-repeat; 
        background-size: cover; 
        background-position: center; 
        background-attachment: fixed;
    }
</style>
