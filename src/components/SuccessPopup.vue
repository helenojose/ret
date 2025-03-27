/* SuccessPopup.vue */
<template>
  <div v-if="visible" class="overlay">
    <div class="popup">
      <div class="checkmark">✔</div>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";

const visible = ref(false);
const message = ref("");

const show = (msg) => {
  message.value = msg;
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, 2000);
};

defineExpose({ show });
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.popup {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
.checkmark {
  font-size: 50px;
  color: green;
}
</style>