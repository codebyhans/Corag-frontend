// src/eventBus.js
import { ref } from 'vue';

const passphrase = ref(null);

const setPassphrase = (newPassphrase) => {
  passphrase.value = newPassphrase;
};

const getPassphrase = () => {
  return passphrase.value;
};

const clearPassphrase = () => {
  passphrase.value = null;
  console.log('passphrase cleared')
};

export default {
  setPassphrase,
  getPassphrase,
  clearPassphrase,
};