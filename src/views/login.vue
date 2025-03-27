<template>
    <div class="auth-container">
        <div class="form-container login">
      <h2>Login</h2>
      <form @submit.prevent="login">  <!-- Login -->
        <div class="form-group">
          <label for="login-email">Email</label>
          <input id="login-email" type="email" placeholder="Digite seu email" v-model="email"/>
        </div>
        <div class="form-group">
          <label for="login-senha">Senha</label>
          <input id="login-senha" type="password" placeholder="Digite sua senha" v-model="password"/>
          <p v-if="errMsg">{{ errMsg }}</p>
        </div>
        <button @click.prevent="login">Entrar</button>
        <button @click.prevent="signInWithGoogle">Entrar com a conta do Google</button>

      </form>
    </div>
    </div>
</template>


<script setup>

import { ref } from "vue"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from 'vue-router'
const email = ref("");
const password = ref("");
const errMsg = ref();
const router = useRouter();

const login = async () => {
    const auth = getAuth();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log("Logado com sucesso:", userCredential.user);
        router.push('/home');  // Redireciona para a home
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

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
      .then((result) =>{
        console.log(result.user)
        router.push("/login")
      })
      .catch((error) =>{

      })
}
</script>


<style scoped>
/* Container principal */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #74ABE2, #5563DE);
  padding: 2rem;
  box-sizing: border-box;
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

/* Grupos de inputs - deslocados para a esquerda */
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
  padding: .7rem;
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
  background-color: #5563DE;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
  margin-bottom: 1rem;
}

button:hover {
  background-color: #4356b8;
  transform: translateY(-2px);
}

/* Botão Google */
.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #ddd;
  color: #555;
}

.google-btn img {
  width: 20px;
  margin-right: 0.5rem;
}

/* Divisor */
.divider {
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #aaa;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .form-container {
    width: 90%;
  }
}
</style>