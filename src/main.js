// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import { store } from './store';
import './style.css';

// Firebase initialization and logic estão aqui
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDUk_A1aKbP_pHtKYitXqSpFE0Hznhk8dY",
  authDomain: "sistema-cadastro-185ce.firebaseapp.com",
  projectId: "sistema-cadastro-185ce",
  storageBucket: "sistema-cadastro-185ce.firebasestorage.app",
  messagingSenderId: "119149461568",
  appId: "1:119149461568:web:be77b67789ba79c00e9fa5"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');

// Exporta os objetos Firebase para uso em outros módulos (como o store)
export { db, auth };
