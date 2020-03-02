<template>

  <div>
    <div id='divGameForm' ref='refGameForm' v-bind:style="{ width: myWidth }">
      <GameHeader />
      <GameBoard />
    </div>
    
    <div id="divConfigPanel" ref="configPanel" :class="ConfigAnimClass" style='display: none;'>
      <GameConfig></GameConfig>
    </div>
  </div>

</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

import GameHeader from './GameHeader.vue';
import GameBoard  from './GameBoard.vue';
import GameConfig from './GameConfig.vue';
import GameOption from '../models/GameOption';

@Component({
  components: {
    GameHeader,
    GameBoard,
    GameConfig
  },
})
export default class GameForm extends Vue {
  @Prop() private gameOption: GameOption;
  public $refs: {
    configPanel: HTMLElement;
    refGameForm: HTMLElement;
  };

  private ConfigAnimClass: string[] = [];
  private myOption: GameOption = new GameOption();
  myWidth = '';

  // life cycle

  private created() {
    this.initComponent();
    //this.$store.dispatch('setRunMode', true);
  }

  private mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'toggleShowConfig') {
        this.showConfigPanel(state.ShowConfig);
      }
    });
    this.$refs.configPanel.style.display = 'inline';
    this.prepareConfigPanel();
  }

  // privates


/*
bounding
{"x":114.5,"y":144,"width":820,"height":539,"top":144,"right":934.5,"bottom":683,"left":114.5}
*/
  private showConfigPanel(onOff: boolean): void {
    if (onOff) {
      this.setConfigAnimation(true);
    }
    else { 
      this.setConfigAnimation(false);
    }
  } 
 
  private setConfigAnimation(onOff: boolean) {
    this.ConfigAnimClass = onOff ? ['open'] : ['close'];
  }

  private prepareConfigPanel() {
    const gameFormSize = this.$refs.refGameForm.getBoundingClientRect();
    const configPanelSize = this.$refs.configPanel.getBoundingClientRect(); 

    console.group('positions de gameForm');
    console.log(JSON.stringify(gameFormSize));
    console.groupEnd();

    console.group('positions de configPanel');
    console.log(JSON.stringify(configPanelSize));
    console.groupEnd();

    this.$refs.configPanel.style.top = (gameFormSize.top + 70) + 'px';
    this.$refs.configPanel.style.left = (gameFormSize.right - configPanelSize.width) + 'px';
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
    position: relative;
    box-sizing: border-box;
    min-width: 300px;
    min-height: 200px;
    background-color: #a3a3a3;
    border: black solid 5px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 5px;
    z-index: 2000;
  }

  #divConfigPanel {
    position: absolute;
    border: 3px solid black;
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    width: 115px;
    height: 200px;
    z-index: 1000;
  }

  .animeConfig {
    animation-name: slide-config;
    animation-duration: 1s;
  }

  @keyframes slide-config {
    from { left: 0 }
    to { left: 100px }
  }


  .open {
    transform-origin: 100% 50%;
    animation: openAnimation 320ms both ease-in;
  }

  .close {
    transform-origin: 100% 50%;
    animation: closeAnimation 220ms both ease-in;
  }

  @keyframes openAnimation {
    0% {
     transform: translateX(0px);
     background-color: white;
    }
    100% {
      transform: translateX(115px);
      background-color: #c0c0c0;
    }
  }

  @keyframes closeAnimation {
    0% {
      transform: translateX(115px);
      background-color: #c0c0c0;
    }
    100% {
      transform: translateX(0px);
      background-color: white;
    }
  }

</style>