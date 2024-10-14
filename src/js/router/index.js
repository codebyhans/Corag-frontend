import { createRouter, createWebHistory } from 'vue-router';
import PrivacyPolicy from '../../components/PrivacyPolicy.vue'; // Adjust the path based on your structure
import HowItWorks from '../../components/HowItWorksComponent.vue'; // Adjust the path based on your structure
import TermsOfUse from '../../components/TermsComponent.vue'; // Adjust the path based on your structure
import UploadComponent from '../../components/UploadComponent.vue'; // Adjust the path based on your structure
import AskComponent from '../../components/AskComponent.vue'; // Adjust the path based on your structure
import HomeComponent from '../../components/HomeComponent.vue'; // Adjust the path based on your structure
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeComponent
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadComponent
  },

  {
    path: '/chat',
    name: 'chat',
    component: AskComponent
  },
  {
    path: '/how-it-works',
    name: 'HowItWorks',
    component: HowItWorks
  },
  {
    path: '/terms-of-use',
    name: 'TermsOfUse',
    component: TermsOfUse
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyPolicy
  }
];

const router = createRouter({
  history: createWebHistory(),  
  routes
});

export default router;
