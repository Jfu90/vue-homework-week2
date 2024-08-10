<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav :hidden="true">
        <RouterLink to="/">Task</RouterLink> | <RouterLink to="/homework">Do home work</RouterLink>
      </nav>
    </div>
    <RouterView />
  </header>
</template>
