<template>
  <div class='game-cell'  
      v-bind:id="cellId" 
      v-on:click.right="onRightClick" 
      v-on:click="onClick" 
      v-bind:class="this.cell.CssClass" 
      v-bind:style="this.cell.Style"
      :title="blah()">
    <img v-if="this.cell ? this.cell.IsRedFlagVisible : false" src='../assets/flag-cell.png' class='flag-img' />
    {{ this.cell.Text }}
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

import CellModel from '../models/CellModel';

@Component
export default class GameCell extends Vue {
  @Prop() cell: CellModel;

  cellId = this.cell.CellId;
  
  // life cycle 
  mounted() {
    //this.cellCssClass = this.cell.CssClass;
  }

  // event handlers

  onClick(e: Event): void {
    this.$emit("cell-click", this.cell);
    e.preventDefault();
  }

  onRightClick(e: Event): void {
    this.$emit('right-click', this.cell);
    e.preventDefault();
  }

  // helpers

  blah(): string {
    return `Cell id: ${ this.cell ? this.cell.CellId : ''}`;
  }

} 

</script>

<style scoped>
  .game-cell {
    font-size: 15pt;
    font-weight: bold;
    font-family: Arial;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    width: 25px;
    color: blue;
    border: 0px;
    margin: 0;
    background-repeat: no-repeat;
    cursor: pointer;
  }

  .flag-img {
    height: 14px;
  }

</style>