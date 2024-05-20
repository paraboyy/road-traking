<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light backgroundimg">
    <div class="bg-white p-4 rounded shadow-lg w-25">
      <h2 class="text-center mb-4">Register</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input v-model="name" type="text" id="name" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" id="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" id="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Register</button>
        <div class="text-center">
          <p>have an account? <router-link to="/login" class="btn btn-link">Login</router-link></p>
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
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async register() {
      try {
        await axios.post('https://gisapis.manpits.xyz/api/register', {
          name: this.name,
          email: this.email,
          password: this.password,
        });
        alert('Registration Succes');
        this.$router.push('/login');
      } catch (error) {
        console.error(error);
        alert('Registration failed. Please try again.');
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
