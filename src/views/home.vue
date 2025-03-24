<template>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-placeholder">
          <img src="../assets/images/logo7 - Copia.png" alt="logo">
        </div>
        <div class="barbearia-nome">RET CORTES</div>
      </div>
      <h1>AGENDAMENTOS</h1>
      <form @submit.prevent="agendar">
        <label for="nome">Seu nome:</label>
        <input type="text" v-model="nome" placeholder="Digite seu nome" required>
        
        <label for="data">Escolha o dia:</label>
        <input type="date" v-model="data" required>
        
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
          <option value="40">CORTE + PIGMENTAÇÃO</option>
          <option value="55">REFLEXO ALINHADO</option>
          <option value="70">NEVOU GELO</option>
        </select>
        
        <p class="total-valor">Valor Total: R$ {{ valorTotal }}</p>
        <button type="submit">Agenda</button>
      </form>
      <div id="avisoFuncionamento">
        <p>A pausa para o almoço é das 13:00 às 14:00.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nome: '',
      data: new Date().toISOString().substr(0, 10),
      hora: '',
      servico: '',
      horariosMaster: [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
      ],
    };
  },
  computed: {
    valorTotal() {
      return this.servico ? parseFloat(this.servico).toFixed(2) : '0.00';
    },
    horariosDisponiveisFiltrados() {
      if (this.data) {
        const agendamentosDoDia = this.$store.state.agendamentos.filter(a => a.data === this.data);
        const horariosOcupados = agendamentosDoDia.map(a => a.hora);
        return this.horariosMaster.filter(hora => !horariosOcupados.includes(hora));
      }
      return this.horariosMaster;
    },
  },
  methods: {
    agendar() {
      if (this.nome && this.data && this.hora && this.servico) {
        const novoAgendamento = {
          nome: this.nome,
          data: this.data,
          hora: this.hora,
          servico: this.getServicoNome(),
          valor: this.servico,
          status: 'pendente',
        };
        this.$store.dispatch('addAgendamento', novoAgendamento);
        this.nome = '';
        this.hora = '';
        this.servico = '';
      }
    },
    getServicoNome() {
      switch (this.servico) {
        case '25':
          return 'CORTE DEGRADÊ';
        case '35':
          return 'DEGRADÊ + BARBA';
        case '20':
          return 'SOCIAL';
        case '40':
          return 'CORTE + PIGMENTAÇÃO';
        case '55':
          return 'REFLEXO ALINHADO';
        case '70':
          return 'NEVOU GELO';
        default:
          return 'SERVIÇO DESCONHECIDO';
      }
    },
  },
  created() {
    this.$store.dispatch('carregarAgendamentos');
  },
};
</script>

<style scoped>
/* Wrapper para centralizar o container na página */
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.container {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
}

.header {
  margin-bottom: 20px;
}
.logo-placeholder img {
  max-width: 100%;
  height: auto;
}
.barbearia-nome {
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
  margin-top: 10px;
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
  background: #45a049;
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

/* Responsividade para dispositivos móveis */
@media (max-width: 600px) {
  .container {
    width: 100%;
    max-width: 350px;
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
</style>
