<template>

  <div id="app">
    <div id='divLogo'>
      <img alt="Vue logo" src="./assets/logo.png" />
    </div>
    <GameForm :game-option="{NbRow:16,NbCol:30,NbBomb:99}"></GameForm>
  </div>

</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import store from './store/index';

import GameForm from './components/GameForm.vue';

@Component({
  components: {
    GameForm
  },
  store: store
})
export default class App extends Vue {
}

</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

#divLogo {
  text-align: center;
}

#divLogo img {
  width: 80px;
}

</style>
