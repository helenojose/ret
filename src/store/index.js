import { createStore } from 'vuex';

export const store = createStore({
  state: {
    agendamentos: [],
  },
  mutations: {
    ADD_AGENDAMENTO(state, agendamento) {
      state.agendamentos.push(agendamento);
    },
    FILTRAR_POR_DATA(state, data) {
      state.agendamentosFiltrados = state.agendamentos.filter(a => a.data === data);
    },
    SET_AGENDAMENTOS(state, agendamentos) {
      state.agendamentos = agendamentos;
    },
    MARCAR_CONCLUIDO(state, agendamento) {
      const index = state.agendamentos.findIndex(a =>
        a.nome === agendamento.nome &&
        a.data === agendamento.data &&
        a.hora === agendamento.hora &&
        a.valor === agendamento.valor
      );
      if (index !== -1) {
        state.agendamentos[index].status = 'concluido';
      }
    },
    EXCLUIR_AGENDAMENTO(state, agendamento) {
      state.agendamentos = state.agendamentos.filter(a =>
        !(a.nome === agendamento.nome &&
          a.data === agendamento.data &&
          a.hora === agendamento.hora &&
          a.valor === agendamento.valor)
      );
    },
    
    LIMPAR_AGENDAMENTOS_DO_DIA(state, data) {
      state.agendamentos = state.agendamentos.filter(a => a.data !== data);
    },
  },
  actions: {
    addAgendamento({ commit, state }, agendamento) {
      commit('ADD_AGENDAMENTO', agendamento);
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
      agendamentos.push(agendamento);
      localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
    },
    filtrarPorData({ commit }, data) {
      commit('FILTRAR_POR_DATA', data);
    },
    carregarAgendamentos({ commit }) {
      const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
      commit('SET_AGENDAMENTOS', agendamentos);
    },
    marcarConcluido({ commit, state }, agendamento) {
      commit('MARCAR_CONCLUIDO', agendamento);
      localStorage.setItem('agendamentos', JSON.stringify(state.agendamentos));
    },
    excluirAgendamento({ commit, state }, agendamento) {
      commit('EXCLUIR_AGENDAMENTO', agendamento);
      localStorage.setItem('agendamentos', JSON.stringify(state.agendamentos));
    },
    // Ação para excluir todos os agendamentos do dia informado
    limparAgendamentos({ commit, state }, data) {
      commit('LIMPAR_AGENDAMENTOS_DO_DIA', data);
      localStorage.setItem('agendamentos', JSON.stringify(state.agendamentos));
    },
  },
  getters: {
    agendamentosPendentes: state => state.agendamentos.filter(a => a.status === 'pendente'),
    agendamentosConcluidos: state => state.agendamentos.filter(a => a.status === 'concluido'),
    agendamentosFiltrados: state => state.agendamentosFiltrados || [],
  },
});