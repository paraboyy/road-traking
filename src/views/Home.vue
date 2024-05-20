<template>
    <TableComponent />
  </template>
  
  <script>
    import TableComponent from '../components/TableData.vue';
    import redaxios from 'redaxios'; // Import Redaxios instead of Axios
    
    export default {
      components: {
        TableComponent
      },
      data() {
        return {
          user: [],
          token: '',
        }
      },
      created() {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
        }
        else {
          this.token = token; // Simpan token ke dalam variabel data
          this.cekuser(); // Panggil method untuk mendapatkan data user setelah mendapatkan token
        }
      },
  
      methods: {
        async cekuser() {
          try {
            const token = localStorage.getItem('token');
            const response = await redaxios.get('https://gisapis.manpits.xyz/api/user', {
              headers: {
                Authorization: `Bearer ${token}` // Use backticks for string interpolation
              }
            });
            this.user = response.data.user;
          } catch (error) {
            // Handle errors
            console.error('Error fetching user data:', error);
          }
        }
      }
    };
  </script>
  