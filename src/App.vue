<template>
  <!-- <h1>💖 Hello World!</h1> -->
  <!-- <p>Welcome to your Electron application.</p> -->
  <div class="container">
    <div class="item" v-for="item in dircList" :key="item" @click="itemClick(item)">{{ item }}</div>
  </div>
</template>

<script setup>
  import { onMounted, reactive } from 'vue'
  let dircList = reactive([])
  window.electronAPI.onUpdateCounter((value) => {
    console.log(value, 'value');
    dircList.splice(0, dircList.length)
    dircList.push(...value)
})
const itemClick = (item) => {
  window.electronAPI.chooseFile(item)
}
</script>
<style scoped>
.item {
  box-shadow: 0px 0px ;
  background-color: black;
  color: white;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  
}

</style>