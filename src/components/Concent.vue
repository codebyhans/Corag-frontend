<template>
    <div v-if="!consentGiven" class="cookie-consent-banner bg-light">
      <p>
        We use cookies to improve your experience on our site. By clicking "Accept All", you agree to the use of cookies for analytics and personalized content.
      </p>
      <div class="buttons bg-light">
        <button class="accept" @click="acceptAllCookies">Accept All</button>
        <button @click="rejectCookies">Reject</button>
        <button @click="showSettings = true">Settings</button>
      </div>
  
      <div v-if="showSettings" class="cookie-settings">
        <p>Choose your preferences:</p>
        <label>
          <input type="checkbox" v-model="analyticsConsent">
          Analytics Cookies
        </label>
        <label>
          <input type="checkbox" v-model="personalizationConsent">
          Personalization Cookies
        </label>
        <button @click="saveSettings">Save Settings</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showSettings: false,
        consentGiven: localStorage.getItem('cookieConsent') !== null,
        analyticsConsent: false,
        personalizationConsent: false,
      };
    },
    methods: {
      acceptAllCookies() {
        this.setConsent(true, true);
      },
      rejectCookies() {
        this.setConsent(false, false);
      },
      saveSettings() {
        this.setConsent(this.analyticsConsent, this.personalizationConsent);
      },
      setConsent(analytics, personalization) {
        this.analyticsConsent = analytics;
        this.personalizationConsent = personalization;
  
        localStorage.setItem('cookieConsent', JSON.stringify({
          analytics: analytics,
          personalization: personalization,
        }));
  
        if (analytics) {
          this.grantConsent();
        } else {
          this.revokeConsent();
        }
  
        this.consentGiven = true;
      },
      grantConsent() {
        gtag('consent', 'update', {
          'ad_storage': this.personalizationConsent ? 'granted' : 'denied',
          'analytics_storage': this.analyticsConsent ? 'granted' : 'denied',
          'ad_personalization': this.personalizationConsent ? 'granted' : 'denied',
          'ad_user_data': 'granted',
        });
      },
      revokeConsent() {
        gtag('consent', 'update', {
          'ad_storage': 'denied',
          'analytics_storage': 'denied',
          'ad_personalization': 'denied',
          'ad_user_data': 'denied',
        });
      },
    },
    mounted() {
      const consent = JSON.parse(localStorage.getItem('cookieConsent'));
      if (consent) {
        this.analyticsConsent = consent.analytics;
        this.personalizationConsent = consent.personalization;
        this.grantConsent();
      }
    }
  };
  </script>
  
  <style scoped>
  .cookie-consent-banner {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 15px;
    text-align: center;
    z-index: 1000;
  }
  
  .buttons {
    margin-top: 10px;
  }
  
  button {
    margin: 0 5px;
    padding: 5px 10px;
    color: #333;
    border: 1px solid #a9a9a9; /* Slightly darker border */
    cursor: pointer;
  }
  
  button:hover {
    background-color: #c0c0c0; /* Slightly darker on hover */
  }
  
  button.accept {
    background-color: var(--bs-success); /* Bootstrap success color for Accept All */
    color: var(--bs-white);
    border: none;
  }
  
  button.accept:hover {
    background-color: var(--bs-success); /* Darken on hover */
  }
  
  .cookie-settings {
    margin-top: 20px;
    text-align: left;
  }
  </style>
  