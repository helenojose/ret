import { createStore } from 'vuex';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from '../main';
import { getAuth } from "firebase/auth";

export const store = createStore({
  state: {
    agendamentos: [],
    agendamentosFiltrados: [],
  },
  mutations: {
    ADD_AGENDAMENTO(state, agendamento) {
      state.agendamentos.push(agendamento);
    },
    SET_AGENDAMENTOS(state, agendamentos) {
      state.agendamentos = agendamentos;
    },
    SET_AGENDAMENTOS_FILTRADOS(state, agendamentos) {
      state.agendamentosFiltrados = agendamentos;
    },
    MARCAR_CONCLUIDO(state, agendamentoId) {
      const index = state.agendamentos.findIndex(a => a.id === agendamentoId);
      if (index !== -1) {
        state.agendamentos[index].status = 'concluido';
      }
    },
    EXCLUIR_AGENDAMENTO(state, agendamentoId) {
      state.agendamentos = state.agendamentos.filter(a => a.id !== agendamentoId);
    },
  },
  actions: {
    async addAgendamento({ dispatch, commit }, agendamento) {
      try {
        const auth = getAuth();
        if (auth.currentUser) {
          agendamento.userId = auth.currentUser.uid;
        }
        const docRef = await addDoc(collection(db, "agendamentos"), agendamento);
        commit('ADD_AGENDAMENTO', { ...agendamento, id: docRef.id });

        // Atualiza a lista de horários filtrados para todos os usuários
        await dispatch('filtrarPorData', agendamento.data);
      } catch (error) {
        console.error("Erro ao adicionar agendamento:", error);
      }
    },

    async carregarAgendamentos({ commit }, loadAll = false) {
      try {
        const auth = getAuth();
        let q;
        if (loadAll || (auth.currentUser && auth.currentUser.email === "admin@email.com")) { 
          q = query(collection(db, "agendamentos"));
        } else {
          q = query(collection(db, "agendamentos"), where("userId", "==", auth.currentUser.uid));
        }

        const querySnapshot = await getDocs(q);
        let agendamentos = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

        commit('SET_AGENDAMENTOS', agendamentos);
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
      }
    },

    async filtrarPorData({ commit }, dataFiltro) {
      try {
        const q = query(collection(db, "agendamentos"), where("data", "==", dataFiltro));
        const querySnapshot = await getDocs(q);
        
        const agendamentos = querySnapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        commit('SET_AGENDAMENTOS_FILTRADOS', agendamentos);
      } catch (error) {
        console.error("Erro ao filtrar por data:", error);
      }
    },

    async marcarConcluido({ dispatch, commit }, agendamento) {
      try {
        const agendamentoDoc = doc(db, "agendamentos", agendamento.id);
        await updateDoc(agendamentoDoc, { status: 'concluido' });
        commit('MARCAR_CONCLUIDO', agendamento.id);

        // Atualiza os horários disponíveis para todos os usuários
        await dispatch('filtrarPorData', agendamento.data);
      } catch (error) {
        console.error("Erro ao atualizar agendamento:", error);
      }
    },

    async excluirAgendamento({ dispatch, commit }, agendamento) {
      try {
        const agendamentoDoc = doc(db, "agendamentos", agendamento.id);
        await deleteDoc(agendamentoDoc);
        commit('EXCLUIR_AGENDAMENTO', agendamento.id);

        // Atualiza os horários disponíveis para todos os usuários
        await dispatch('filtrarPorData', agendamento.data);
      } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
      }
    },
  },
  getters: {
    agendamentosPendentes: state => state.agendamentos.filter(a => a.status === 'pendente'),
    agendamentosConcluidos: state => state.agendamentos.filter(a => a.status === 'concluido'),
    agendamentosFiltrados: state => state.agendamentosFiltrados || [],
  },
});
