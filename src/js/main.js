import { createApp } from 'vue'
import App from './App.vue'

// Import our custom CSS
import '../scss/styles.scss'

// Import only the Bootstrap components we need
import { Popover } from 'bootstrap';

// Import vue-gtag for Google Analytics
import VueGtag from "vue-gtag";

// Import the router
import router from './router'

// Create the Vue app
const app = createApp(App);

// Use the router with the Vue app
app.use(router);

// Load Google Analytics only if consent is given
function initializeAnalytics() {
  app.use(VueGtag, {
    config: {  id: import.meta.env.VITE_GA_ID },
    onReady: () => {
      const consent = JSON.parse(localStorage.getItem('cookieConsent'));
      console.log(consent)
      if (consent && consent.analytics) {
        gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }
    }
  });
}

// Initialize Google Analytics
initializeAnalytics();

// Mount the app
app.mount('#app');

// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new Popover(popover)
  });

// Use the backend URL from environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL; // Updated line
console.log('Backend URL:', backendUrl);
