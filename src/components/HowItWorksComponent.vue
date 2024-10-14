<template>
  <div class="how-it-works">
    <h1>How It Works</h1>
    
      
    <section>
      <h3>How the App Works</h3>
      <p>
        Our app is designed for querying simple knowledge bases and providing relevant content. Users can upload PDF documents, which are processed and stored securely in a vector database. The application allows users to ask questions based on the uploaded content, providing AI-generated answers without enabling a conversational interface. The app relies on a Azure vector database, and a privately deployed Large Language Model from OpenAI. 
      </p>
      </section>
      <section>
      <h3>Document Uploading</h3>
      <p>
        Users can upload multiple PDF files through a user-friendly interface. Once uploaded, each document undergoes a series of processing steps:
        <ul>
          <li><strong>Reading and Storing:</strong> The application reads the contents of the uploaded PDFs and stores them temporarily for processing.</li>
          <li><strong>Chunking:</strong> The documents are split into smaller, manageable chunks to facilitate efficient embedding and retrieval.</li>
          <li><strong>Embedding:</strong> Each chunk is converted into a vector representation using advanced embedding techniques, allowing the system to understand and retrieve relevant information based on user queries.</li>
          <li><strong>Secure Storage:</strong> The embedded chunks are stored in a vector database, associated with a unique passphrase for secure access.</li>
        </ul>
      </p>
      
      <h3>Question Answering</h3>
      <p>
        Once documents are uploaded, users can ask questions related to the content. The question-answering process involves:
        <ul>
          <li><strong>Embedding the Question:</strong> The user's question is embedded into a vector format, similar to the document chunks.</li>
          <li><strong>Retrieving Relevant Content:</strong> The system performs a vector search to find the most relevant document chunks based on the embedded question.</li>
          <li><strong>Generating Responses:</strong> Using the retrieved content, the application generates AI-driven responses, which are streamed back to the user in real-time.</li>
        </ul>
      </p>
          </section>
      <section>
      <h3>Security and Privacy</h3>
      <p>
        Security is a top priority for our application. Each document upload is associated with a unique passphrase, ensuring that only authorized users can access the stored data. The application employs best practices for data handling and storage, protecting user information and maintaining confidentiality. 
      </p>
      <p>
        DO NOT upload sensitive information. 
        Any uploaded information may remain in the azure database until next time somebody uploads new data. Your data can remain in the database for a longer period of time if the app is not used. 
      </p>
    </section>
    <section>
      <h3>Overview of the System</h3>
      <p>
        Our application is designed as a zero-shot retrieval-augmented generation (RAG) system, optimized for efficient data retrieval and generation. The backend is responsible for managing the upload, processing, and storage of data in a vector database. This architecture allows for secure access to each data chunk using a unique passphrase set during the upload process. 
      </p>
        </section>
      <section>
    
    <h3>RAG in general</h3>
      <p>
        <strong>Advantages:</strong>
        <ul>
          <li>Supports diverse data formats, enabling flexible handling of various document types, particularly PDF files.</li>
          <li>Enables rapid access to relevant information without the need for complex queries, making it user-friendly and efficient.</li>
          <li>Facilitates real-time interaction with the data, allowing users to receive immediate responses to their queries.</li>
        </ul>
        <strong>Limitations:</strong>
        <ul>
          <li>May compromise on retrieval accuracy compared to structured search methods, as it relies on the quality of the underlying data and embeddings.</li>
          <li>Relies heavily on the quality of the data chunking process, which can affect the relevance of the retrieved information.</li>
          <li>As a zero-shot system, it may struggle with highly specific or niche queries that require extensive contextual knowledge.</li>
        </ul>
        <strong>Key Considerations:</strong>
        <ul>
          <li>Striking a balance between retrieval speed and accuracy is crucial for user satisfaction.</li>
          <li>Effectively managing data storage and access control complexities is essential to maintain security and performance.</li>
          <li>Continuous improvement of the embedding and retrieval algorithms is necessary to enhance the system's capabilities over time.</li>
        </ul>
      </p>
    </section>
    

  </div>
</template>

<script>
export default {
  name: 'HowItWorks'
};
</script>

<style scoped>
.how-it-works {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2, h3 {
  color: #333;
}

p, li {
  line-height: 1.6;
  color: #555;
}
</style>
