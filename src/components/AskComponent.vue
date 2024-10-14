<template>
    <!-- Passphrase Dialog -->
    <div v-if="!passphrase && !eventBus.getPassphrase()" class="passphrase-dialog">
      <div class="passphrase-input">
        <input type="text" v-model="tempPassphrase" placeholder="Enter your passphrase..." class="form-control mb-2" @keydown.enter.prevent="eventBus.setPassphrase(tempPassphrase)">
        <div class="d-flex">
          <button @click="eventBus.setPassphrase(tempPassphrase)" class="btn btn-primary me-2">Start chatting!</button>
          <button @click="$router.push('/upload')" class="btn btn-secondary">Jump to upload</button>
        </div>
      </div>
    </div>

  <div class="container-fluid">

  <div class="chat-container"  >
    <!-- Question and Response -->
    <div class="question-response" ref="questionResponse">
      <div v-if="isLoading" class="d-flex justify-content-center">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </div>
      <div v-if="response" class="assistant-response">
        <div class="message-content" v-html="formatMessage(response)"></div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <form @submit.prevent="sendMessage">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="userInput"
            placeholder="Type your question here..."
            @keydown.enter.prevent="sendMessage"
          >
          <button type="submit" class="btn btn-primary" :disabled="disabled">Ask</button>
        </div>
      </form>
    </div>
  </div>
    <!-- Toast for Notifications -->
    <div
      class="toast align-items-center text-white border-0"
      :class="{ 'bg-danger': isErrorToast, 'bg-success': !isErrorToast, show: showToast }"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref="toast"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toastMessage }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Close"
          @click="showToast = false"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import axios from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import eventBus from '../eventBus'; // Import the event bus

const userInput = ref('');
const response = ref('');
const questionResponse = ref(null);
const showToast = ref(false);
const toastMessage = ref('');
const isErrorToast = ref(false);
const passphrase = ref('');
const tempPassphrase = ref('');
const isLoading = ref(false); // New loading state
const disabled = ref(false);
const backendUrl = import.meta.env.VITE_BACKEND_URL; // Access the backend URL

const showToastMessage = (message, isError = false) => {
  toastMessage.value = message;
  isErrorToast.value = isError;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const formatMessage = (content) => {
  const renderer = new marked.Renderer();
  renderer.code = (code, language) => {
    return `<pre><code>${code}</code></pre>`;
  };

  const rawMarkup = marked(content, { renderer });
  return DOMPurify.sanitize(rawMarkup);
};

const sendMessage = async () => {
  // Clear previous response before sending a new question
  response.value = ''; // Clear previous response

  // Check for non-empty input including spaces
  if (!userInput.value) return; // Removed .trim()

  const userMessage = userInput.value;
  userInput.value = ''; // Clear user input after sending
  disabled.value=true;
  isLoading.value = true; // Set loading state to true

  // Create query parameters
  const params = new URLSearchParams({
    question: userMessage,
    passphrase: passphrase.value || eventBus.getPassphrase()
  });

  // Use EventSource for streaming responses
  const eventSource = new EventSource(`${backendUrl}/ask?${params.toString()}`);
  // Handle incoming messages from the EventSource
  eventSource.onmessage = function(event) {
    isLoading.value = false;  
    const chunk = event.data; // Get the chunk of data
    if (chunk) {
      console.log('Chunk received:', chunk);
      response.value += chunk; // Update the response with the received chunk
      console.log('Total response value:', response.value); // Log the total response value
    }
  };

  // Handle errors
  eventSource.onerror = function(event) {
    if (event.eventPhase === EventSource.CLOSED) {
      console.log('EventSource connection closed.');
    } else {
      console.error('Error during streaming:', event);
      showToastMessage("An error occurred while processing your message. Please try again.", true);
    }
    eventSource.close(); // Close the EventSource on error
    isLoading.value = false; // Reset loading state on error
  };

  // Reset loading state after 2 seconds
  setTimeout(() => {
    disabled.value=false;
  }, 8000);
};

const reset = () => {
  eventBus.clearPassphrase()
  passphrase.value = '';
  console.log('reset pressed')
  response.value = ''; // Clear the response
  userInput.value = ''; // Clear the user input
};

onMounted(() => {
  passphrase.value = eventBus.getPassphrase(); // Get passphrase from event bus
  if (!passphrase.value) {
    tempPassphrase.value = ''; // Reset tempPassphrase if passphrase is not set
  }
});

watch(() => eventBus.getPassphrase(), (newPassphrase) => {
  if (newPassphrase !== passphrase.value) {
    passphrase.value = newPassphrase;
    response.value = ''; // Clear the response if passphrase changes
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  min-height: 30vh;
  height: auto;
  padding: 20px;
  max-width: 800px; 
  margin: 0 auto;
}

.question-response {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 8px;
  max-height: none;
}

.message-content {
  padding: 10px;
  border-radius: 8px;
  max-width: 100%;
}

.user-question {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
  margin-left: auto;
}

.assistant-response {
  color: black;
  align-self: flex-start;
  margin-right: auto;
  font-size: 1.7em; /* Increased font size */
  font-weight: bold; /* Made text bold */
}

.input-area {
  margin-top: auto;
  max-width: 800px;
  margin: 0 auto;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.passphrase-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.passphrase-input {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 60%;
}

.passphrase-indicator {
  background-color: green;
  color: white;
  padding: 10px;
  text-align: center;
  width: 100%;
}

.passphrase-indicator button {
  border: none;
  color: white;
  cursor: pointer;
}

</style>
