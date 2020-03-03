<template>
  
  <div>

    <div class='gc-container'>
      <div class='gc-title'>
        Settings      
      </div>
      
      <div class='gc-field'>
        <div class='gc-label-zone'>
          Rows
        </div>
        <div class='gc-input-zone'>
          <input type='number' ref="refTxtRow" id='txtRow' class='gc-input' @change="inputChanged($event, 'row')" :value="NbRows" />
        </div>
      </div>  

      <div class='gc-field'>
        <div class='gc-label-zone'>
          Columns
        </div>
        <div class='gc-input-zone'>
          <input type='number' ref="refTxtCol" id='txtCol' class='gc-input' @change="inputChanged($event, 'col')" :value="NbCols" />
        </div>      
      </div>

      <div class='gc-field'>
        <div class='gc-label-zone'>
          Bombs
        </div>
        <div class='gc-input-zone'>
          <input type='number' ref="refTxtBomb" id='txtBomb' class='gc-input' @change="inputChanged($event, 'bomb')"  :value="NbBombs" />
        </div>      
      </div>

    </div>

  </div>

</template>


<script lang="ts">
// 💩 lol &#x1f4a9; 
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class GameConfig extends Vue {
  
  private NbRows = 0;
  private NbCols = 0;
  private NbBombs = 0;

  // lifecycle

  private mounted() {
    this.NbRows = this.$store.state.NbRow;
    this.NbCols = this.$store.state.NbCol;
    this.NbBombs = this.$store.state.NbBomb;
  }

  // event handlers
  private  inputChanged(e: Event, src: string) { 
    const el = e.target as HTMLInputElement;
    const newValue = parseInt(el.value);
    
    switch (src) {
      case 'row':
        this.$store.dispatch('setNbRow', newValue);
        break;
      
      case 'col':
        this.$store.dispatch('setNbCol', newValue);
        break; 

      case 'bomb':
        this.$store.dispatch('setNbBomb', newValue);
        break; 
    }
  }
}

</script>

<style scoped>

  .gc-container {
    box-sizing: border-box;
    padding: 15px;
  }

  .gc-title {
    text-align: center;
    margin: 4px;
  }

  .gc-field {
     margin-bottom: 8px;
  }

  .gc-label-zone {
    font-size: 9pt;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }

  .gc-input {
    font-size: 11pt;
    border: none;
    color: #252525;
    background-color: white;
    box-sizing: border-box;
    padding: 2px 5px 2px 5px;
    border-radius: 5px;
    width: 100%;
  }

</style>  