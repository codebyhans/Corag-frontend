<template>
  <footer class="mt-5" style="padding: 20px;">
    <hr class="mt-5 mb-4">
    <nav class="navbar navbar-light flex-column align-items-start">
      <a class="navbar-brand mb-2" href="https://www.linkedin.com/in/hansottokristiansen/">☕: Hansotto Kristiansen</a>
      
      <ul class="navbar-nav d-flex flex-row w-100">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/how-it-works">How it works</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/terms-of-use">Terms of use</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/privacy">Privacy</router-link>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
};
</script>

<style scoped>
.navbar-brand {
  flex-basis: 100%;
}

.navbar-nav {
  justify-content: flex-start;
}

.nav-item {
  margin-right: 15px; /* Add spacing between items */
}
</style>
