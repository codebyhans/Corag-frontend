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
    <form @submit.prevent="promptPassphrase" enctype="multipart/form-data" v-if="!uploading">
      <!-- File Upload Area -->
      <div 
        class="mb-3 file-drop-area"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
      >
        <div class="file-drop-zone" :class="{ 'drag-over': isDragOver }">
          <p>Drag and drop your PDF files here, or click to select</p>
          <input
            type="file"
            id="file-upload"
            class="form-control"
            accept=".pdf"
            @change="handleFileUpload" 
            multiple
          >
          <div v-if="selectedFiles.length > 0" class="selected-files">
          <p>Selected files:</p>
          <ul class="no-list-padding">
            <li v-for="(file, index) in selectedFiles" :key="index" class="d-flex justify-content-center align-items-center my-3" @click="removeFile(index)"> <!-- Added click event to remove file on name click -->
              {{ file.name }} <!-- Prevent event bubbling -->
            </li>
          </ul>
          </div>
        </div>
      </div>
        

      <!-- Submit Button -->
      <div class="d-flex justify-content-end mt-3">
        <button type="submit" class="btn btn-primary" :disabled="uploading">Upload</button> <!-- Removed 'ing...' modification -->
      </div>
    </form>

    <!-- Spinner for loading state -->
    <div v-if="uploading" class="spinner-container">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

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
            <input 
              type="password" 
              class="form-control" 
              v-model="passphrase" 
              placeholder="Enter your passphrase" 
              @keyup.enter="submitForm" 
            >
            <!-- New input for expiration time -->
            <p>Set expiration time (in hours, max {{ expirationHoursMax }}):</p>
            <input type="number" class="form-control" v-model="expirationHours" min="0" :max="expirationHoursMax" placeholder="1-{{ expirationHoursMax }} hours">
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
import { useRouter } from 'vue-router'; // Ensure you have router imported
import eventBus from '../eventBus'; // Import the event bus
import { PDFDocument } from 'pdf-lib'; // Import pdf-lib

const emit = defineEmits(['filesUploaded']);
const showToast = ref(false);
const toastMessage = ref('');
const selectedFiles = ref([]);
const isDragOver = ref(false);
const isErrorToast = ref(false);
const passphrase = ref('');
const uploading = ref(false); // Flag to indicate if files are being uploaded
const expirationHoursMax = ref(6); // Initialize expirationHours with a default value
const expirationHours = ref(1); // Initialize expirationHours with a default value
let passphraseModal;
const router = useRouter(); // Ensure you have router imported
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
const handleFileUpload = async (event) => {
  console.log('File input changed'); // Add this line
  const files = Array.from(event.target.files);
  const validFiles = [];

  for (const file of files) {
    if (file.type === 'application/pdf') {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const pageCount = pdfDoc.getPageCount();

      if (pageCount > 0 && pageCount < 6) {
        validFiles.push(file);
      } else {
        showToastMessage(`File "${file.name}" must have between 1 and 5 pages.`, true);
      }
    }
  }

  if (selectedFiles.value.length + validFiles.length <= 5) {
    selectedFiles.value.push(...validFiles);
  } else {
    console.log('test')
    showToastMessage("Maximum 5 files can be uploaded.", true);
  }
};

// Handle drag and drop events
const onDragOver = () => {
  isDragOver.value = true;
};

const onDragLeave = () => {
  isDragOver.value = false;
};

const onDrop = async (event) => {
  isDragOver.value = false;
  const files = event.dataTransfer.files;
  const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
  const validFiles = [];

  for (const file of pdfFiles) {
    const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
    const pageCount = pdfDoc.getPageCount();
    if (pageCount > 0 && pageCount < 6) {
      validFiles.push(file);
    } else {
      showToastMessage(`File "${file.name}" must have between 1 and 5 pages.`, true);
    }
  }

  if (selectedFiles.value.length + validFiles.length <= 5) {
    selectedFiles.value.push(...validFiles);
  } else {
    showToastMessage("Maximum 5 files can be uploaded.", true);
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
  uploading.value = true; // Set uploading flag to true

  const formData = new FormData();
  selectedFiles.value.forEach((file) => {
    formData.append('files', file);  // Use the same key for all files
  });

  // Create query parameters
  const params = new URLSearchParams();
  params.append('passphrase', passphrase.value || eventBus.getPassphrase()); // Include passphrase
  params.append('expiration', expirationHours.value); // Include expiration time

  try {
    const response = await axios.post(`${backendUrl}/upload?${params.toString()}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response)
    if (response.status === 200) {
      showToastMessage("Files uploaded and processed successfully!");
      eventBus.setPassphrase(passphrase.value); // Set passphrase in event bus
      // Clear the selected files after successful upload
      selectedFiles.value = [];
      // Reset the file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        fileInput.value = '';
      }
      // Redirect to /chat
      router.push('/chat'); // Ensure you have router imported
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
  } finally {
    uploading.value = false; // Set uploading flag to false after the operation
  }
};

// Function to remove a file from the selectedFiles array
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
  showToastMessage("File removed successfully."); // Optional: show a toast message
};
</script>

<style scoped>

.spinner-container {
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  height: 40vh; /* Full height to center in the viewport */
}
.no-list-padding {
  padding: 0px;
}

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
  display: flex;
  flex-direction: column;
  /* Remove fixed height */
  /* height: 50vh; */
}
.file-drop-zone {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 40px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* Allow drop zone to grow naturally */
  min-height: 200px; /* Example min-height */
}

.file-drop-zone:hover, .file-drop-zone.drag-over {
  background-color: #f0f0f0;
  border-color: #007bff;
}

.file-drop-zone p {
  margin: 0;
  font-size: 18px;
  color: #666;
}

.file-drop-zone input[type="file"] {
  display: none;
}

.selected-files {
  margin-top: 20px;
  font-size: 16px;
  color: #007bff;
  padding-left: 0;
  padding-right: 0;
  list-style-type: none;
}
.selected-files ul {
  list-style-type: none;
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
form {
  display: flex;
  flex-direction: column;
}
</style>
