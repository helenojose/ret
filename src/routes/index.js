import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from "firebase/auth"
import home from "../views/home.vue";
import admin from "../views/admin.vue";
import cadastro from "../views/cadastro.vue";
import login from "../views/login.vue";


const routes = [
    {path:'/home', name: 'home', component: home, meta: {
        requiresAuth: true
    }},
    {path:'/admin', name: 'admin', component: admin},
    {path:'/cadastro', name: 'cadastro', component: cadastro},
    {path:'/', name: 'login', component: login},
   
];

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user); // Resolvendo a Promise corretamente
            },
            reject
        );
    });
};


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (await getCurrentUser()) {
            next();
        } else {
            alert("VOCÊ NÃO TEM ACESSO!");
            next("/cadastro");
        }
    } else {
        next();
    }
});

export default router;
