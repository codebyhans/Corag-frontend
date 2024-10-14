<template>
    <div class="privacy-policy">
      <h1>Privacy Policy</h1>
      
      <section>
        <h2>Introduction</h2>
        <p>
          We value your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and share your information.
        </p>
      </section>
  
      <section>
        <h2>Information We Collect</h2>
        <p>
          We collect the following types of information:
        </p>
        <ul>
          <li><strong>Request Data:</strong> Information automatically logged when you interact with our backend services, such as your request headers, and timestamps.</li>
          <li><strong>Cookies:</strong> We use cookies exclusively for Google Analytics to track and analyze website usage.</li>
        </ul>
      </section>
  
      <section>
        <h2>How We Use Your Information</h2>
        <p>
          The information we collect is used to:
        </p>
        <ul>
          <li>Provide and maintain our service.</li>
          <li>Analyze usage to improve our service through Google Analytics.</li>
          <li>Log and monitor backend requests to ensure system security and integrity.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </section>
  
      <section>
        <h2>Sharing Your Information</h2>
        <p>
          We do not share your personal information with third parties except:
        </p>
        <ul>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>
  
      <section>
        <h2>Your Rights</h2>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request the correction of inaccurate data.</li>
          <li>Request the deletion of your data.</li>
          <button @click="deleteOldData" class="btn btn-danger">Delete Old Data</button>
          <li>Opt-out of Google Analytics tracking by adjusting your browser settings.</li>
        </ul>
      </section>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref } from 'vue';
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Access the backend URL

  export default {
    name: 'PrivacyPolicy',
    setup() {
      const showToastMessage = (message, isError = false) => {
        // Assuming there's a method to show toast messages
        console.log(message, isError);
      };

      const deleteOldData = async () => {
        try {
          await axios.post(`${backendUrl}/sanitize`); // Call the sanitize endpoint
          showToastMessage("Old data deleted successfully.");
        } catch (error) {
          console.error("Error deleting old data:", error);
          showToastMessage("Failed to delete old data.", true);
        }
      };

      return {
        deleteOldData
      };
    }
  };
  </script>
  
  <style scoped>
  .privacy-policy {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1, h2 {
    color: #333;
  }
  
  p, li {
    line-height: 1.6;
    color: #555;
  }
  </style>