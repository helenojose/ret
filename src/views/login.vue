<template>
  <div class="auth-container">
    <div class="form-container login">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input id="login-email" type="email" placeholder="Digite seu email" v-model="email"/>
        </div>
        <div class="form-group">
          <label for="login-senha">Senha</label>
          <input id="login-senha" type="password" placeholder="Digite sua senha" v-model="password"/>
          <p class="errMsg" v-if="errMsg">{{ errMsg }}</p>
        </div>
        <button type="submit">Entrar</button>
        <p class="no-account">Não tem uma conta?</p>
        <button type="button" class="register-btn" @click="goToRegister">Cadastre-se</button>
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';

const email = ref("");
const password = ref("");
const errMsg = ref("");
const showModal = ref(false);
const router = useRouter();

const login = async () => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    showModal.value = true;  // Exibe o modal de sucesso
    setTimeout(() => {
      Swal.fire({
        title: "Login Efetuado Com Sucesso!",
        text: "RET CORTES",
        icon: "success"
      });
      router.push('/home');
    }, 2000); // Fecha o modal e redireciona após 2 segundos
  } catch (error) {
    console.log(error.code);
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "Email inválido";
        break;
      case "auth/user-not-found":
        errMsg.value = "Nenhuma conta encontrada com esse email";
        break;
      case "auth/wrong-password":
        errMsg.value = "Senha incorreta";
        break;
      default:
        errMsg.value = "Erro ao tentar entrar";
        break;
    }
  }
};

const goToRegister = () => {
  router.push("/cadastro");
}

console.log("© " + new Date().getFullYear() + " Desenvolvido por Heleno José");
</script>

<style scoped>
/* Container principal */
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

/* Botões */
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

.register-btn {
  background: rgb(248, 75, 75);
}

.register-btn:hover {
  background-color: #fd3838;
  transform: translateY(-2px);
}

button:hover {
  background-color: #39833c;
  transform: translateY(-2px);
}

.errMsg {
  text-align: center;
  color: #fd3838;
  font-weight: 500;
}

/* Modal de Sucesso */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.modal-content h3 {
  font-size: 1.5rem;
  color: #5563DE;
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

/* Responsividade */
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
  
  .errMsg {
    font-size: 0.8rem;
  }
}
</style>
