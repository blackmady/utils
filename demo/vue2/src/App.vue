<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div>id:{{id}}</div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import nog from '../../../lib/nog'
export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data(){
    return {
      id:''
    }
  },
  async created(){
    this.id=await nog.fingerprint();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
