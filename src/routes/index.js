import { createRouter, createWebHistory } from 'vue-router';
import home from "../views/home.vue"
import admin from "../views/admin.vue"

const routes = [
    {path:'/', name: 'home', component: home},
    {path:'/admin', component: admin} 
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),  // Garante que a base_url seja correta
    routes
  });
  
  export default router;