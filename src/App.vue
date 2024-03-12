<template>
  <h1>💖 Hello World!</h1>
  <p>Welcome to your Electron application.</p>
  <div v-for="item in dircList" :key="item">{{ item }}</div>
</template>

<script setup>
  import { onMounted, reactive } from 'vue'
  let dircList = reactive([])
</script>