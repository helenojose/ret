<template>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-placeholder">
          <img src="../assets/images/logo.png" alt="logo">
        </div>
        <div class="barbearia-nome">RET BARBESHOP
            <p>ESTÉTICA MASCULINA</p>
        </div>
      </div>

      <h1>AGENDAMENTOS</h1>


      <div class="user-info">
        <div class="user-fone" v-if="usuario">
          <p>Celular: {{ usuario.celular || 'Não informado' }}</p>
        </div>
        <div class="user-insta">
          <p>Instagram: {{ usuario.instagram || 'Não informado' }}</p>
        </div>
      </div>
      <div v-if="agendamentoPendente" class="alerta-agendamento">
        ⚠️ Você já tem um agendamento pendente para o dia <strong>{{ formatarDataBR(agendamentoPendente.data) }}</strong>,
        às <strong>{{ agendamentoPendente.hora }}</strong> – {{ agendamentoPendente.servico }}.
      </div>
       <!-- Se agendamento desativado, mostrar mensagem gigante -->
      <div v-if="!statusAgendamento" class="aviso">
        <h2>Agendamentos temporariamente Indisponiveis!</h2>
        <p>Entre em contato com: insta: <a href="https://www.instagram.com/retdocorte01?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">retdocorte01</a> whatsApp: <a href="wa.me/5581996627021 ">Contato</a></p>
      </div>

       <!-- Se agendamento ativo, mostrar formulário -->
      <form v-else @submit.prevent="prepareAgendamento">
        <label for="nome">Seu nome:</label>
        <input type="text" v-model="nome" placeholder="Digite seu nome" required>
        
        <label for="data">Escolha o dia:</label>
        <input type="date" v-model="data" required @change="atualizarHorariosDisponiveis">
        
        <label for="hora">Escolha a hora:</label>
        <select v-model="hora" required>
          <option value="" disabled>Selecione a hora</option>
          <option v-for="horaDisponivel in horariosDisponiveisFiltrados" :key="horaDisponivel" :value="horaDisponivel">
            {{ horaDisponivel }}
          </option>
        </select>
        
        <label for="servico">Escolha o serviço:</label>
        <select v-model="servico" required>
          <option value="" disabled>Selecione o serviço</option>
          <option value="25">CORTE DEGRADÊ</option>
          <option value="35">DEGRADÊ + BARBA</option>
          <option value="20">SOCIAL</option>
          <option value="35.01">CORTE + PIGMENTAÇÃO</option>
          <option value="55">REFLEXO ALINHADO</option>
          <option value="70">NEVOU GELO</option>
        </select>
        
        <p class="total-valor">Valor Total: R$ {{ valorTotal }}</p>
        <button type="submit">Agendar</button>
      </form>
      <div id="avisoFuncionamento">
        <p>A pausa para o almoço é das 13:00 às 14:00.</p>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h2>Confirmar Agendamento</h2>
        <p><strong>Nome:</strong> {{ nome }}</p>
        <p><strong>Data:</strong> {{ data }}</p>
        <p><strong>Hora:</strong> {{ hora }}</p>
        <p><strong>Serviço:</strong> {{ getServicoNome() }}</p>
        <p><strong>Valor:</strong> R$ {{ valorTotal }}</p>
        <div class="modal-buttons">
          <button @click="confirmAgendamento">Confirmar</button>
          <button @click="cancelAgendamento">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Rodapé com assinatura -->
    <footer class="assinatura">
      © {{ new Date().getFullYear() }} Desenvolvido por Heleno José
    </footer>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import {doc, getDoc, onSnapshot, collection, query, where, getDocs} from "firebase/firestore";
import { db } from  '../main';
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      nome: '',
      data: new Date().toISOString().substr(0, 10),
      hora: '',
      servico: '',
      showModal: false,
      horariosMaster: [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"," 19:00", "19:30", "20:00"
      ],
      statusAgendamento: true,
      mensagemStatus: '',
      mostrarMensagem: false,
      agendamentoPendente: null,
    };
  },
  computed: {
    valorTotal() {
      return this.servico ? parseFloat(this.servico).toFixed(2) : '0.00';
    },
    horariosDisponiveisFiltrados() {
      let horarios = this.horariosMaster;
      if (this.data && this.$store.state.agendamentosFiltrados.length) {
        const horariosOcupados = this.$store.state.agendamentosFiltrados.map(a => a.hora);
        horarios = horarios.filter(hora => !horariosOcupados.includes(hora));
      }
      const hoje = new Date().toISOString().substr(0, 10);
      if (this.data === hoje){
        const agora = new Date();
        const horaAtual = agora.getHours();
        const minutoAtual = agora.getMinutes();

        horarios = horarios.filter(hora => {
          const [ h, m] = hora.split(":").map(Number);
          return h > horaAtual || (h === horaAtual && minutoAtual );
        });
      }
      return horarios;
    },
    usuario() {
      return this.$store.state.usuario;
    },
  },
  methods: {
    prepareAgendamento() {
      if (!this.nome || !this.data || !this.hora || !this.servico) {
        alert("Por favor, preencha todos os campos antes de agendar.");
        return;
      }
      this.showModal = true;
    },
    confirmAgendamento() {
      const novoAgendamento = {
        nome: this.nome,
        data: this.data,
        hora: this.hora,
        servico: this.getServicoNome(),
        valor: this.servico,
        status: 'pendente',
        cell: this.usuario ? this.usuario.celular || '' : '',
        instagram: this.usuario ? this.usuario.instagram || '' : ''
      };

      this.$store.dispatch('addAgendamento', novoAgendamento);

      Swal.fire({
        title: "Agendamento Realizado Com Sucesso!",
        text: "RET CORTES",
        icon: "success"
      });

      this.nome = '';
      this.hora = '';
      this.servico = '';
      this.showModal = false;
    },
    cancelAgendamento() {
      this.showModal = false;
    },
    getServicoNome() {
      const servicos = {
        '25': 'CORTE DEGRADÊ',
        '35': 'DEGRADÊ + BARBA',
        '20': 'SOCIAL',
        '35.01': 'CORTE + PIGMENTAÇÃO',
        '55': 'REFLEXO ALINHADO',
        '70': 'NEVOU GELO',
      };
      return servicos[this.servico] || 'SERVIÇO DESCONHECIDO';
    },
    atualizarHorariosDisponiveis() {
      this.$store.dispatch('filtrarPorData', this.data);
    },
    async verificarAgendamentoPendente(){
      try{
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if(!userId) return;

        const agendamentoRef = collection(db, "agendamentos");
        const q = query(
          agendamentoRef,
          where("userId", "==", userId),
          where("status", "==", "pendente"),
        );
        const snapshot = await getDocs(q);

        if(!snapshot.empty){
           //pega o primeiro agendamento pendente
           this.agendamentoPendente = snapshot.docs[0].data();
        }else{
          this.agendamentoPendente = null;
        }
      }catch(error){
        console.error("Erro ao verificar agendamento pendente:", error);
      }
    },
    formatarDataBR(dataISO){
      if (!dataISO) return '';
      const partes = dataISO.split('-'); //["aaaa", "mm", "dd"]
      return `${partes [2]}/${partes[1]}/${partes[0]}`;
    },
  },
  created() {
    // Assinar mudanças em tempo real no status do agendamento
    const ref = doc(db, "config", "status");
    this.unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.data();
        this.statusAgendamento = dados.agendamentoAtivo;
        this.mensagemStatus = dados.mensagemStatus || '';
        this.mostrarMensagem = !dados.agendamentoAtivo;
      }
    });
    // carregue outras coisas
    this.$store.dispatch('carregarUsuario');
    this.atualizarHorariosDisponiveis();

    console.log("© " + new Date().getFullYear() + " Desenvolvido por Heleno José");

    this.verificarAgendamentoPendente();
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe(); // para não vazar listener
    }
  }
}
</script>

<style scoped>
/* Layout principal reestruturado */
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

/* Centraliza o container horizontalmente */
.container {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
  margin: auto;
}

.header {
  margin-bottom: 20px;
}

.aviso{
  background-color: #ffdddd;
  color: #b71c1c;
  padding: 40px;
  border-radius: 12px;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.alerta-agendamento {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: left;
}



img{
  width: 100px;
}

.logo-placeholder img {
  max-width: 100%;
  height: auto;
}

.barbearia-nome {
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin-top: 10px;
}

.barbearia-nome p{
  font-size: 12px;
  margin-top: -.2rem;
   color: #747474;
}

.user-info {
  margin-bottom: 20px;
  text-align: left;
  font-size: 14px;
  color: #333;
  border-radius: 0.5rem;
  opacity: 0.9;
}

.user-insta {
  color: #45a049;
  font-size: 17px;
}

.user-fone {
  color: #45a049;
  font-size: 17px;
}

h1 {
  margin-bottom: 25px;
  font-size: 22px;
  color: #4CAF50;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  margin-left: 1rem;
  text-align: left;
  color: #000;
}

input, select {
  width: 318px;
  height: 35px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 10px;
  background: #4CAF50;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: #39833c;
  transform: translateY(-2px);
}

#avisoFuncionamento {
  margin-top: 20px;
  font-size: 18px;
  color: #f44336;
}

.total-valor {
  font-size: 16px;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
}

.modal h2 {
  margin-bottom: 15px;
  color: #4CAF50;
}

.modal p {
  margin: 5px 0;
  font-size: 14px;
  color: #333;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  width: 45%;
  padding: 8px;
}

/* Responsividade */
@media (max-width: 600px) {
  .container {
    width: 100%;
    max-width: 290px;
    padding: 1.7rem;
  }
  h1 {
    font-size: 20px;
  }
  label {
    font-size: 14px;
    margin-left: 1px;
  }
  input, select {
    width: 100%;
    height: 35px;
    font-size: 14px;
  }
  button {
    padding: 8px;
    font-size: 14px;
  }
  #avisoFuncionamento {
    font-size: 16px;
  }
  .total-valor {
    font-size: 14px;
  }
}

/* Rodapé com assinatura fixado na parte inferior */
.assinatura {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: auto;
  padding: 10px 0;
  background: #f5f5f5;
}
</style>
