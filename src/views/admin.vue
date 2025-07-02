<template>
  <div class="admin-container">

    <div class="financeiro-section">
      <h2>Financeiro</h2>
      <div class="filter-section">
        <label for="dataInicial">Data Inicial:</label>
        <input type="date" v-model="dataInicial" id="dataInicial" @change="filtrarFinanceiro"/>

        <label for="dataFInal">Data Final:</label>
        <input type="date" v-model="dataFinal" id="dataFinal" @change="filtrarFinanceiro"/>

         <p>Total dos serviços concluídos no período: </p> <h3>{{ totalFinanceiro.toFixed(2) }}</h3>
      </div>
      </div>

    <h1>LISTA DOS AGENDAMENTOS</h1>
    <div class="status">
      <button @click="alternarAgendamento" :style="{backgroundColor: agendamentoAtivo ? '#e74c3c' : '#2ecc71'}">
        {{ agendamentoAtivo ? 'Desativar Agendamentos' : 'Ativar Agendamentos' }}
      </button>
      <p>Status atual: <strong>{{ agendamentoAtivo ? 'AGENDAMENTO ATIVO' : 'AGENDAMENTO DESATIVADO'}}</strong></p>
    </div>
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
          <p>Celular: {{ agendamento.cell || 'Não informado' }}</p>
          <p>Instagram: {{ agendamento.instagram || 'Não informado' }}</p>
          <div class="content-button">
            <div class="concluido">
                 <button @click="marcarConcluido(agendamento)">Concluído</button>
            </div>
            <div class="excluir">
                 <button @click="excluirAgendamento(agendamento)" class="excluir">Excluir</button>
            </div>
          </div>
          
        </div>
      </div>
      <p v-else class="no-result">Nenhum agendamento pendente para essa data.</p>

      <h2>Concluídos</h2>
      <div v-if="filteredConcluidos.length" class="agendamento-list">
        <div v-for="agendamento in filteredConcluidos" :key="agendamento.id" class="agendamento-card">
          <h3>{{ agendamento.nome }}</h3>
          <p>{{ agendamento.servico }} - {{ agendamento.hora }} - R$ {{ agendamento.valor }}</p>
          <p>Celular: {{ agendamento.cell || 'Não informado' }}</p>
          <p>Instagram: {{ agendamento.instagram || 'Não informado' }}</p>
        </div>
      </div>
      <p v-else class="no-result">Nenhum agendamento concluído para essa data.</p>
    </div>

    <div v-else class="no-filter">
      <p>Por favor, escolha uma data e clique em "Buscar".</p>
    </div>
    <!-- Rodapé com assinatura -->
    <footer class="assinatura">
      © {{ new Date().getFullYear() }} Desenvolvido por Heleno José
    </footer>
  </div>
</template>

<script>
import {doc, getDoc, updateDoc, onSnapshot, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../main';

export default {
  data() {
    return {
      dataFiltro: '',
      agendamentoAtivo: true,
      dataInicial:'',
      dataFinal:'',
      agendamentoFinanceiro: [],
      totalFinanceiro: 0,
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
      async ensureStatusDoc() {
        const ref = doc(db, "config", "status");
        const snap = await getDoc(ref);
          if(!snap.exists()){
            await setDoc(ref, {
              agendamentoAtivo: true,
              mensagemStatus: 'Estamos de Folga Hoje',
          });
        }
      },
        
      async alternarAgendamento() {
      const ref = doc(db, "config", "status");
      // Pega o status atual
      const snap = await getDoc(ref);
      if (snap.exists()) {
      const atual = snap.data().agendamentoAtivo;
      // Atualiza com o inverso
      await updateDoc(ref, {
        agendamentoAtivo: !atual
      });
      // Atualiza o botão local também
        this.agendamentoAtivo = !atual;
        }
      },

     async carregarStatus(){
       const ref = doc(db, "config", "status");
        const snp = await getDoc(ref);
       if (snp.exists()){
          this.agendamentoAtivo = snp.data().agendamentoAtivo
        }
      },

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

      async filtrarFinanceiro(){
      if(!this.dataInicial || !this.dataFinal){
        this.agendamentoFinanceiro = []
        this.totalFinanceiro = 0;
        return;
      }
      if(this.dataFinal < this.dataInicial){
        alert("A data final deve ser maior ou igual a data inicial!");
        return;
      }
      try{
        const agendamentoRef = collection(db,"agendamentos");
        const q = query(
          agendamentoRef,
          where("status", "==", "concluido"),
          where("data", ">=", this.dataInicial),
          where("data", "<=", this.dataFinal)
        );
        const snapshot = await getDocs(q);

        this.agendamentoFinanceiro = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

        this.totalFinanceiro = this.agendamentoFinanceiro.reduce((acc, ag) =>{
          return acc + parseFloat(ag.valor || '0');
        }, 0);  
      }catch (error) {
          console.error("Erro ao bsucar dados financeiros", error);
        }
        console.log("Agendamentos encontrados:", this.agendamentoFinanceiro);
      },
    },

  created() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('key') !== 'secreta') {
      alert('Acesso Restrito!');
      this.$router.push('/');
      return;
    }

    this.ensureStatusDoc();

    const ref = doc(db, "config", "status");
    onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        this.agendamentoAtivo = snap.data().agendamentoAtivo;
      }
    });
    this.carregarStatus();
    this.$store.dispatch('carregarAgendamentos', true);
    console.log("© " + new Date().getFullYear() + " Desenvolvido por Heleno José");
  },
};
</script>

<style scoped>
/* (Mantém os estilos existentes do seu código) */
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

.financeiro-section h2{
  text-align: center;
}

.financeiro-section p{
  font-weight: 700;
}

.financeiro-section h3{
  color: #16ac55;
}


.status{
  text-align: center;
  margin-bottom: 20px;
}

.status button{
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.content-button{
  display: flex;
}

.content-button button{
  width: 170px;
  
}

.concluido{
  padding-right: 1rem;
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
  width: 150px;
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
/* Responsividade */
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
  .content-button button{
    width: 140px;
  }  
  .excluir{
    margin-left: .1rem;
  }


}

.assinatura {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: auto;
  padding: 10px 0;
  background: #f5f5f5;
}
</style>
