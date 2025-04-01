<template>
  <div class="auth-container">
    <div class="form-container cadastro">
      <h2>Cadastro</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="cadastro-email">Email</label>
          <input id="cadastro-email" type="email" placeholder="Digite seu email" v-model="email" />
        </div>
        <div class="form-group">
          <label for="cadastro-senha">Senha</label>
          <input id="cadastro-senha" type="password" placeholder="Digite sua senha" v-model="password" />
        </div>
        <div class="form-group">
          <label for="cadastro-cell">Celular</label>
          <input id="cadastro-cell" type="text" placeholder="Digite seu número de celular" v-model="cell" />
        </div>
        <div class="form-group">
          <label for="cadastro-instagram">Instagram</label>
          <input id="cadastro-instagram" type="text" placeholder="Digite seu Instagram" v-model="instagram" />
        </div>
        <button type="submit" @click.prevent="register">Cadastrar</button>
      </form>
    </div>
    <!-- Rodapé com assinatura -->
    <footer class="assinatura">
      © {{ new Date().getFullYear() }} Desenvolvido por Heleno José
    </footer>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { useStore } from "vuex";

const email = ref("");
const password = ref("");
const cell = ref("");
const instagram = ref("");
const showModal = ref(false);
const router = useRouter();
const store = useStore();
const db = getFirestore();

const register = async () => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // Salva os dados extras no Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      celular: cell.value,
      instagram: instagram.value,
    });

    store.dispatch('carregarUsuario'); // Atualiza o Vuex

    Swal.fire({
      title: "Cadastrado com Sucesso!",
      text: "RET CORTES",
      icon: "success"
    });

    setTimeout(() => {
      showModal.value = false;
      router.push('/');
    }, 2000);
  } catch (error) {
    console.log(error.code);
    alert(error.message);
  }
};

console.log("© " + new Date().getFullYear() + " Desenvolvido por Heleno José");
</script>

<style scoped>
/* Container principal com layout em coluna para empurrar o rodapé para baixo */
.auth-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #74ABE2, #5563DE);
  padding: 2rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
}

/* Caixa de formulário */
.form-container {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  padding: 2rem;
  width: 320px;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Título */
.form-container h2 {
  margin-bottom: 1.5rem;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

/* Grupos de inputs */
.form-group {
  margin-bottom: 1.25rem;
  text-align: left;
  margin-left: 1px;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.form-group input {
  width: calc(100% - 25px);
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #5563DE;
}

/* Botão */
button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background-color: #45a049;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
  margin-bottom: 1rem;
}

button:hover {
  background-color: #39833c;
  transform: translateY(-2px);
}

/* Rodapé com assinatura fixado na parte inferior */
.assinatura {
  font-size: 12px;
  color: #d7dbff;
  text-align: center;
  margin-top: auto;
  margin-bottom: 2rem;
  width: 100%;
  padding: 10px 0;
}

/* Responsividade para celulares */
@media (max-width: 480px) {
  .form-container {
    width: 90%;
    padding: 1.5rem;
    margin-top: 7rem;
  }
  
  .form-group input {
    width: calc(100% - 20px);
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  button {
    padding: 0.65rem;
    font-size: 0.9rem;
  }
  
  .form-container h2 {
    font-size: 1.5rem;
  }
  
  .form-group label {
    font-size: 0.8rem;
  }
}
</style>
