import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginComponent from '../components/Login.vue'
import RegisterComponent from '../components/Register.vue'
import RuasJalanComponent from '../components/CreateRuasJalan.vue'
import Uji from '../components/ujipolyline.vue'
import DataRuasJalanComponent from '../components/DataRuasJalan.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginComponent
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterComponent
    },
    {
      path: '/uji',
      name: 'Register',
      component: Uji
    },
    {
      path: '/dataruasjalan',
      name: 'DataRuasJalan',
      component: DataRuasJalanComponent
    },
    {
      path: '/ruasjalan',
      name: 'RuasJalan',
      component: RuasJalanComponent
    },
  ]
})

export default router
