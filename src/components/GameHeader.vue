<template>

  <div id='game-header'>
    <div class="interieur">
      Vue MineSweeper v1.0 - 
      Cols: {{ this.$store.state.NbCol }} 
      Rows: {{ this.$store.state.NbRow }}
      Bombs: {{ this.$store.state.NbBomb }}
      
    </div>
    <div class="container">
      <div style="justify-self: start;"><div class="digit-box">{{ displayRemainingBomb }}</div></div>
      <div>
        <a href='#' v-on:click="restart">
        <img v-if="!this.$store.state.Boom" id="img-smiley" src="../assets/smiley-smile.png">
        <img v-if="this.$store.state.Boom" id="img-smiley" src="../assets/smiley-sad.png">
        </a>
      </div>
      <div style="justify-self: end;"><div class="digit-box">{{ displayElapsed }}</div></div>
    </div>
  </div>

</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

@Component
export default class GameHeader extends Vue {
  private displayRemainingBomb = '000';
  private displayElapsed = '000';
  private elapsed = 0;
  private flagged = 0;
  private intervalHandle = 0;

  // life cycle

  mounted() {
    this.initComponent();
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setRunMode') {
        if (!state.Run) {
          clearInterval(this.intervalHandle);
        }
        else {
          this.startTimer();
        }
      }
      else if (mutation.type === 'incrementNbFlagged') {
        this.setRemainingBomb();
      }
    });
  }

  // event handlers

  // restart the whole smorgasboard !!
  private restart(e: Event) {
    e.preventDefault();
    this.$store.dispatch('incrementNbGames');
    this.$store.dispatch('setNbFlagged', 0);
    this.$store.dispatch('setBoom', false);
    this.initComponent();
  }

  // private 

  private initComponent(): void {
    clearInterval(this.intervalHandle);
    this.setRemainingBomb();
    this.displayElapsed = '000';
  }

  private setRemainingBomb(): void { 
    const nbBomb: number  = this.$store.state.NbBomb - this.$store.state.NbFlagged;
    if (nbBomb < 10) {
      this.displayRemainingBomb = '00' + nbBomb.toString();
    }
    else if (nbBomb < 100) {
      this.displayRemainingBomb = '0' + nbBomb.toString();
    }
    else { 
      this.displayRemainingBomb = nbBomb.toString();
    }
  }

  private startTimer(): void  {
    this.elapsed = 0;
    this.intervalHandle = setInterval(() => this.increment(), 1000);
  }

  private increment(): void {
    this.elapsed++;
    if (this.elapsed < 10) {
      this.displayElapsed = '00' + this.elapsed.toString();
    }
    else if (this.elapsed < 100) {
      this.displayElapsed = '0' + this.elapsed.toString();
    }
    else { 
      this.displayElapsed = this.elapsed.toString();
    }
  }
}

</script>

<style scoped>

  @font-face {
    font-family: 'DS-Digital Bold';
    font-style: normal;
    font-weight: normal;
    src: local('DS-Digital Bold'), url('../assets/DS-DIGIB.woff') format('woff');
  }

  #game-header {
    font-size: 9pt;
    font-family: Arial;
    border-bottom: solid 2px black;
  }

  #game-header .interieur {
    padding: 5px;
    box-sizing: border-box;
    font-size: 12pt;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    justify-content: space-between;
  }

  .digit-box {
    font-family: 'DS-Digital Bold';
    font-weight: normal;
    font-size: 42px;
    color: red;
    width: 65px;
    height: 35px;
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    margin-left: 20px;
  }

</style>