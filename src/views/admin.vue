<template>
  <div class="admin-container">
    <h1>Admin - Agendamentos</h1>
    
    <div class="filter-section">
      <label for="dataFiltro">Escolha o dia:</label>
      <input type="date" v-model="dataFiltro" id="dataFiltro" />
      <button @click="filtrarPorData">Buscar</button>
    </div>

    <div v-if="dataFiltro" class="results">
      <h2>Pendentes</h2>
      <div v-if="filteredPendentes.length" class="agendamento-list">
        <div v-for="agendamento in filteredPendentes" :key="agendamento.id" class="agendamento-card">
          <h3>{{ agendamento.nome }}</h3>
          <p>{{ agendamento.servico }} - {{ agendamento.hora }} - R$ {{ agendamento.valor }}</p>
          <button @click="marcarConcluido(agendamento)">Concluído</button>
          <button @click="excluirAgendamento(agendamento)" class="excluir">Excluir</button>
        </div>
      </div>
      <p v-else class="no-result">Nenhum agendamento pendente para essa data.</p>

      <h2>Concluídos</h2>
      <div v-if="filteredConcluidos.length" class="agendamento-list">
        <div v-for="agendamento in filteredConcluidos" :key="agendamento.id" class="agendamento-card">
          <h3>{{ agendamento.nome }}</h3>
          <p>{{ agendamento.servico }} - {{ agendamento.hora }} - R$ {{ agendamento.valor }}</p>
        </div>
      </div>
      <p v-else class="no-result">Nenhum agendamento concluído para essa data.</p>
    </div>

    <div v-else class="no-filter">
      <p>Por favor, escolha uma data e clique em "Buscar".</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataFiltro: '',
    };
  },
  computed: {
    filteredPendentes() {
      return this.$store.getters.agendamentosFiltrados.filter(a => a.status === 'pendente');
    },
    filteredConcluidos() {
      return this.$store.getters.agendamentosFiltrados.filter(a => a.status === 'concluido');
    },
  },
  methods: {
    filtrarPorData() {
      if (!this.dataFiltro) {
        alert("Escolha uma data válida!");
        return;
      }
      this.$store.dispatch('filtrarPorData', this.dataFiltro);
    },
    marcarConcluido(agendamento) {
      this.$store.dispatch('marcarConcluido', agendamento);
    },
    excluirAgendamento(agendamento) {
      this.$store.dispatch('excluirAgendamento', agendamento);
      this.filtrarPorData();
    },
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('key') !== 'secreta') {
      alert('Acesso Restrito!');
      this.$router.push('/');
      return;
    }
    this.$store.dispatch('carregarAgendamentos', true);
  },
};
</script>



<!-- (Os estilos permanecem inalterados) -->


<style scoped>
.admin-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: #4CAF50;
  margin-bottom: 20px;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.filter-section label {
  font-size: 16px;
  color: #333;
}

.filter-section input[type="date"] {
  padding: 6px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 150px;
}

.filter-section button {
  padding: 6px 12px;
  font-size: 14px;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.filter-section button:hover {
  background: #16ac55;
}

/* Botão para excluir todos os agendamentos do dia */
.filter-section button.excluir-todos {
  padding: 6px 12px;
  font-size: 14px;
  background: #e74c3c; /* Vermelho */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.filter-section button.excluir-todos:hover {
  background: #c0392b; /* Vermelho mais escuro */
}
.results h2 {
  margin-top: 30px;
  color: #333;
}

.agendamento-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.agendamento-card {
  flex: 1 1 300px;
  background: #e0f7fa;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.agendamento-card h3 {
  margin: 0 0 8px;
  color: #333;
  font-size: 18px;
}

.agendamento-card p {
  margin: 0 0 10px;
  color: #555;
  font-size: 16px;
}

.btn-actions {
  display: flex;
  gap: 10px;
}

.agendamento-card button {
  padding: 6px 10px;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.agendamento-card button:hover {
  background: #45a049;
}

/* Botão para excluir agendamento individual */
.agendamento-card button.excluir {
  background: #e74c3c;
}

.agendamento-card button.excluir:hover {
  background: #c0392b;
}

.no-result,
.no-filter {
  text-align: center;
  color: #777;
  margin-top: 20px;
  font-size: 16px;
}

/* Ajustes para telas de celulares */
@media (max-width: 600px) {
  .filter-section {
    flex-direction: column;
    align-items: center;
  }
  .filter-section label {
    font-size: 14px;
  }
  .filter-section input[type="date"] {
    font-size: 14px;
    padding: 4px;
    width: 130px;
  }
  .filter-section button {
    font-size: 14px;
    padding: 4px 10px;
  }
  .agendamento-card h3 {
    font-size: 16px;
  }
  .agendamento-card p {
    font-size: 14px;
  }
  .agendamento-card button {
    font-size: 14px;
    padding: 4px 8px;
  }
}
</style>
