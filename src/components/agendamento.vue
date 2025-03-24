<template>
  <div>
    <h2>Pendentes</h2>
    <ul>
      <li v-for="(agendamento, index) in agendamentosPendentes" :key="index">
        {{ agendamento.nome }} - {{ agendamento.servico }} - {{ agendamento.hora }} - R$ {{ agendamento.valor }}
        <button @click="marcarConcluido(agendamento)">Marcar como concluído</button>
      </li>
    </ul>

    <h2>Concluídos</h2>
    <ul>
      <li v-for="(agendamento, index) in agendamentosConcluidos" :key="index">
        {{ agendamento.nome }} - {{ agendamento.servico }} - {{ agendamento.hora }} - R$ {{ agendamento.valor }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    agendamentosPendentes() {
      return this.$store.getters.agendamentosPendentes;
    },
    agendamentosConcluidos() {
      return this.$store.getters.agendamentosConcluidos;
    },
  },
  methods: {
    marcarConcluido(agendamento) {
      this.$store.dispatch('marcarConcluido', agendamento);
      this.salvarAgendamentosNoStorage();
    },
    salvarAgendamentosNoStorage() {
      const agendamentos = this.$store.state.agendamentos;
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    },
  },
  created() {
    this.$store.dispatch('carregarAgendamentos');
  },
};
</script>
