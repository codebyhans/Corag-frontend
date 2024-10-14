<template>
  <div class="settings-section container-fluid">
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

    <form @submit.prevent="promptPassphrase" enctype="multipart/form-data">
      <!-- File Upload Area -->
      <div 
        class="mb-3 file-drop-area"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
      >
        <div class="file-drop-zone" :class="{ 'drag-over': isDragOver }">
          <p>Drag and drop your PDF files here</p>
          <input
            type="file"
            id="file-upload"
            class="form-control"
            accept=".pdf"
            @change="handleFileUpload"
            multiple
          >
        </div>
        <div v-if="selectedFiles.length > 0" class="selected-files">
          <p>Selected files:</p>
          <ul>
            <li v-for="(file, index) in selectedFiles" :key="index">{{ file.name }}</li>
          </ul>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="d-flex justify-content-end mt-3">
        <button type="submit" class="btn btn-primary">Upload</button>
      </div>
    </form>

    <!-- Passphrase Modal -->
    <div class="modal fade" id="passphraseModal" tabindex="-1" aria-labelledby="passphraseModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="passphraseModalLabel">Enter Passphrase</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Please enter a secret passphrase. You can use this to access your files later.</p>
            <input type="password" class="form-control" v-model="passphrase" placeholder="Enter your passphrase">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="submitForm">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { Modal } from 'bootstrap';

const emit = defineEmits(['filesUploaded']);
const showToast = ref(false);
const toastMessage = ref('');
const selectedFiles = ref([]);
const isDragOver = ref(false);
const isErrorToast = ref(false);
const passphrase = ref('');
let passphraseModal;
const backendUrl = import.meta.env.VITE_BACKEND_URL; // Access the backend URL


// Show a toast notification
const showToastMessage = (message, isError = false) => {
  toastMessage.value = message;
  isErrorToast.value = isError;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000); // Auto-hide the toast after 3 seconds
};

// Handle file selection
const handleFileUpload = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

// Handle drag and drop events
const onDragOver = () => {
  isDragOver.value = true;
};

const onDragLeave = () => {
  isDragOver.value = false;
};

const onDrop = (event) => {
  isDragOver.value = false;
  const files = event.dataTransfer.files;
  const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
  if (pdfFiles.length > 0) {
    selectedFiles.value = pdfFiles;
  } else {
    showToastMessage("Please drop PDF files only.", true);
  }
};

const promptPassphrase = () => {
  if (selectedFiles.value.length === 0) {
    showToastMessage("Please select at least one PDF file to upload.", true);
    return;
  }
  passphraseModal = new Modal(document.getElementById('passphraseModal'));
  passphraseModal.show();
};

const submitForm = async () => {
  if (!passphrase.value) {
    showToastMessage("Please enter a passphrase.", true);
    return;
  }

  passphraseModal.hide();

  const formData = new FormData();
  selectedFiles.value.forEach((file) => {
    formData.append('files', file);  // Use the same key for all files
  });
  formData.append('passphrase', passphrase.value);

  try {
    const response = await axios.post(`${backendUrl}/upload`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response)
    if (response.status === 200) {
      showToastMessage("Files uploaded and processed successfully!");
      emit('filesUploaded', response.data);
      // Clear the selected files after successful upload
      selectedFiles.value = [];
      // Reset the file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        fileInput.value = '';
      }
    } else {
      showToastMessage("An error occurred while uploading and processing the files.", true);
    }
  } catch (error) {
    console.error('Error uploading and processing files:', error);
    if (error.response && error.response.data && error.response.data.detail) {
      showToastMessage(`Error: ${error.response.data.detail}`, true);
    } else {
      showToastMessage("An unexpected error occurred. Please try again later.", true);
    }
  }
};
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.file-drop-area {
  text-align: center;
  margin: 0 auto;
  width: 100%;
  height: 50vh;
  display: flex;
  flex-direction: column;
}

.file-drop-zone {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 40px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.file-drop-zone:hover, .file-drop-zone.drag-over {
  background-color: #f0f0f0;
  border-color: #007bff;
}

.file-drop-zone p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.file-drop-zone input[type="file"] {
  display: none;
}

.selected-files {
  margin-top: 20px;
  font-size: 14px;
  color: #007bff;
  text-align: left;
  max-height: 150px;
  overflow-y: auto;
}

.selected-files ul {
  list-style-type: none;
  padding-left: 0;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
