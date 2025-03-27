import { createApp } from 'vue';
import './style.css';
import router from './routes';
import { store } from './store';
import App from './App.vue';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUk_A1aKbP_pHtKYitXqSpFE0Hznhk8dY",
  authDomain: "sistema-cadastro-185ce.firebaseapp.com",
  projectId: "sistema-cadastro-185ce",
  storageBucket: "sistema-cadastro-185ce.firebasestorage.app",
  messagingSenderId: "119149461568",
  appId: "1:119149461568:web:be77b67789ba79c00e9fa5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
export { auth };
createApp(App)
.use(store)
.use(router)
.mount('#app')
