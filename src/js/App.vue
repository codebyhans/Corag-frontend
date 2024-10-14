<script setup>
import { ref, onMounted } from 'vue';
import Footer from '../components/AppFooter.vue';
import Concent from '../components/Concent.vue';
import MenuComponent from '../components/MenuComponent.vue';
</script>

<template>
<MenuComponent />
  <router-view />
    <Concent />
    <Footer />
</template>



