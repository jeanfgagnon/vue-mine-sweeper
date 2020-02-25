<template>

  <div id='divGameForm' v-bind:style="{ width: myWidth }">
    <GameHeader />
    <GameBoard />
    <!--  :nb-col="gameOption.NbCol" :nb-row="gameOption.NbRow" -->
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import GameHeader from './GameHeader.vue';
import GameBoard  from './GameBoard.vue';
import GameOption from '../models/GameOption';

@Component({
  components: {
    GameHeader,
    GameBoard
  },
})
export default class GameForm extends Vue {
  @Prop() private gameOption: GameOption;
  private myOption: GameOption = new GameOption();
  myWidth = '';

  created() {
    this.initComponent();
    //this.$store.dispatch('setRunMode', true);
  }

  private initComponent(): void {
    if (this.gameOption === undefined) {
      this.myOption.NbCol = 30;
      this.myOption.NbRow = 16;
      this.myOption.NbBomb = 99;
    }
    else { 
      this.myOption.NbCol = this.gameOption.NbCol;
      this.myOption.NbRow = this.gameOption.NbRow;
      this.myOption.NbBomb = this.gameOption.NbBomb;
    }
    
    this.$store.dispatch('setNbRow', this.myOption.NbRow);
    this.$store.dispatch('setNbCol', this.myOption.NbCol);
    this.$store.dispatch('setNbBomb', this.myOption.NbBomb);
    this.myWidth = `${(this.$store.state.NbCol * 27) + 10}px`;    
  }

  // Properties

} // class
</script>

<style>
  #divGameForm {
    box-sizing: border-box;
    min-width: 300px;
    min-height: 200px;
    background-color: #a3a3a3;
    border: black solid 5px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 5px;
  }
</style>