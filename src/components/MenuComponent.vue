<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import eventBus from '../eventBus'; // Import the event bus
import axios from 'axios'; // Import axios for HTTP requests
import $ from 'jquery'; // Import jQuery

const backendUrl = import.meta.env.VITE_BACKEND_URL; // Access the backend URL

const useConfirm = async (title, message) => {
  return new Promise((resolve) => { // Change reject to resolve
    const modal = new bootstrap.Modal($('#confirmModal')[0], {
      keyboard: false
    });
    modal.show();
    $('#confirmModalTitle').text(title);
    $('#confirmModalMessage').text(message);
    $('#confirmModalYes').off('click').on('click', () => {
      modal.hide();
      resolve(true);
    });
    $('#confirmModalNo').off('click').on('click', () => {
      modal.hide();
      resolve(false); // Resolve with false instead of rejecting
    });
  });
};

const router = useRouter();
const route = useRoute();

const currentSection = computed(() => route.name);

const navigateTo = async (routeName) => {
  if (routeName === 'upload' && eventBus.getPassphrase() !== null) { // Check if passphrase is not null
    const confirmed = await useConfirm('Warning', 'Resetting the passphrase will clear all chat history. Proceed?');
    if (confirmed) {
      eventBus.clearPassphrase(); // Reset the passphrase
      router.push({ name: routeName });
    }
  } else {
    router.push({ name: routeName });
  }
};

// Update reset method accordingly
const reset = async () => {
  const confirmed = await useConfirm('Reset Passphrase', 'Are you sure you want to reset the passphrase?');
  if (confirmed) {
    eventBus.clearPassphrase();
    isPassphraseVisible.value = false;
  }
};

const isPassphraseVisible = ref(false);

const showPassphrase = () => {
  isPassphraseVisible.value = true;
};

const hidePassphrase = () => {
  isPassphraseVisible.value = false;
};

// Function to fetch documents
const fetchDocuments = async () => {
  const passphrase = eventBus.getPassphrase();
  if (!passphrase) {
    console.error('No passphrase available');
    return;
  }
  try {
    const response = await axios.get(`${backendUrl}/get-documents?passphrase=${passphrase}`);
    console.log(response)
    if (response.data) {
      // Assuming there's a function to display the overlay list
      displayOverlayList(response.data.documents);
    } else {
      console.log('No documents found');
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
};

// Function to display the overlay list
const displayOverlayList = (files) => {
  const overlayModal = new bootstrap.Modal($('#overlayModal')[0], {
    keyboard: false
  });
  overlayModal.show();
  const $overlayList = $('#overlayList').empty(); // Clear the list before appending new items

  // Check if files is empty
  if (files.length === 0) {
    $('<li>', {
      text: 'No documents found',
      css: { listStyleType: 'none' }
    }).appendTo($overlayList);
    return; // Exit the function if no documents
  }

  files.forEach(file => {
    const $listItem = $('<li>', {
      text: file.document_name,
      css: { listStyleType: 'none' }
    });

    // Create a spinner element
    const $spinner = $('<span>', {
      class: 'spinner-border spinner-border-sm ms-2',
      css: { display: 'none' }
    });

    const $deleteButton = $('<button>', {
      html: '<i class="fas fa-trash"></i>',
      class: 'btn btn-danger ms-3'
    }).on('click', async () => {
      $spinner.show(); // Show spinner
      try {
        await axios.delete(`${backendUrl}/delete-document?passphrase=${eventBus.getPassphrase()}&filename=${file.document_name}`);
        console.log(`File ${file.document_name} deleted successfully.`);
        $listItem.remove(); // Remove the item from the list after deletion
      } catch (error) {
        console.error(`Error deleting file ${file.name}:`, error);
      } finally {
        $spinner.hide(); // Hide spinner after operation
      }
    });

    $listItem.append($deleteButton, $spinner); // Append delete button and spinner to the list item
    $overlayList.append($listItem); // Append list item to the overlay list
  });
};

// Initialize modal behavior
$('#exampleModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget); // Button that triggered the modal
  var recipient = button.data('whatever'); // Extract info from data-* attributes
  console.log('Modal opened for:', recipient); // Log recipient to console
  var modal = $(this);
  modal.find('.modal-title').text('New message to ' + recipient);
  modal.find('.modal-body input').val(recipient);
});

// Add this method to handle modal opening
const openModal = (recipient) => {
  const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();
  document.getElementById('recipient-name').value = recipient; // Set recipient in the input
};

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">CORAG</a>
      <!-- Passphrase Indicator -->
      <ul class="nav ms-auto">
        <li class="nav-item" v-if="eventBus.getPassphrase()">
          <template v-if="!isPassphraseVisible">
            <button @click="showPassphrase" class="btn btn-primary me-3">
              <i class="fas fa-eye"></i> <!-- Icon for Hide Passphrase -->
            </button>
          </template>
          <template v-else>
            <span class="me-1">Passphrase: {{ eventBus.getPassphrase() }}</span>
            <button @click="reset" class="btn me-3">
              <i class="fa-regular fa-circle-xmark"></i>
            </button>
            <button @click="hidePassphrase" class="btn btn-primary me-3">
              <i class="fas fa-eye-slash"></i> <!-- Icon for Hide Passphrase -->
            </button>
          </template>
        </li>
        <li class="nav-item" v-if="eventBus.getPassphrase()">
          <button @click="fetchDocuments" class="btn btn-primary me-3">
              <i class="fas fa-file"></i> <!-- Icon for Fetch Documents -->
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="btn nav-link me-3" 
            :class="{ active: currentSection === 'upload' }" 
            @click="navigateTo('upload')">
            Upload
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="btn nav-link" 
            :class="{ active: currentSection === 'chat' }" 
            @click="navigateTo('chat')">
            Chat
          </button>
        </li>
      </ul>
    </div>
  </nav>
  <!-- Modal -->
  <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmModalTitle"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="confirmModalMessage">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="confirmModalNo" data-bs-dismiss="modal">No</button>
          <button type="button" class="btn btn-primary" id="confirmModalYes">Yes</button>
        </div>
      </div>
    </div>
  </div>
  <!-- Overlay Modal for Documents -->
  <div class="modal fade" id="overlayModal" tabindex="-1" aria-labelledby="overlayModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="overlayModalLabel">Documents</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul id="overlayList"></ul>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.navbar {
  width: 100%;
  padding: 20px;
}
.nav-link.active {
  font-weight: bold;
  color: var(--bs-primary) !important;
}
</style>
