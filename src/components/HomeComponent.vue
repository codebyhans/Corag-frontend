<template>
  <div class="home-section container-fluid d-flex justify-content-center align-items-center">
    <div class="d-flex">
      <button @click="navigateTo('upload')" class="btn btn-primary me-3">Upload</button>
      <button @click="navigateTo('chat')" class="btn btn-primary">Chat</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (route) => {
  router.push({ name: route });
};
</script>

<style scoped>
.home-section {
  height: 60vh;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  padding: 10px 20px;
  font-size: 16px;
  transition: all 0.3s ease;
  border-radius: 30px;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
