<template>
  <div id="game-board">
    <div class='game-grid'>
      <table v-on:click.right.prevent>
        <tr v-for="rowIndex in myRowCount" :key="rowIndex">
          <td v-for="colIndex in myColCount" :key="colIndex">
            <GameCell @cell-click="onCellClick" 
                      @right-click="onRightClick" 
                      :cell="getCell(rowIndex, colIndex)" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import GameCell from './GameCell.vue';
import CellModel from '@/models/CellModel';
import CellCoords from '@/models/CellCoords';

@Component ({
  components: {
    GameCell
  }
})
export default class GameBoard extends Vue {
  private myRowCount = this.$store.state.NbRow;
  private myColCount = this.$store.state.NbCol; 
  private board: CellModel[] = [];
  private bombSet = false;
  private azimuth = ['ne', 'n', 'nw', 'w', 'e', 'sw', 's', 'se' ];
  private clickedOnce = false;

// life cycle

  private created() {
    this.initBoard();
  }

  private mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'incrementNbGames') {
        this.initBoard();
      }
    });
  }

  // event handlers

  private onCellClick(cellModel: CellModel): void {
    if (!this.clickedOnce) {
      this.clickedOnce = true;
      this.$store.dispatch('setRunMode', true);
    }

    if (this.$store.state.Run && !cellModel.IsRedFlagVisible) {
      if (!this.bombSet) {
        this.bombSet = true;
        this.putBombs(cellModel.CellNo);
        this.moveNearBombs(cellModel.CellNo);
      }

      if (cellModel.IsBomb) {
        this.boom(cellModel.CellNo);
      }
      else { 
        cellModel.IsRedFlagVisible = false;
        cellModel.CssClass = "empty-cell";
        cellModel.IsCleared = true;
        const coords = this.getCellCoord(cellModel.CellNo);
        const nearBombCount = this.getNearBombCount(coords);
        if (nearBombCount > 0) {
          cellModel.Text = nearBombCount.toString();
          cellModel.Style = this.getStyleColorByNbBomb(nearBombCount);
        }
        else { 
          this.clearEmptyAround(coords);
        }
      }
    }
  }

  private onRightClick(cellModel: CellModel): void {
    if (this.$store.state.Run && !cellModel.IsCleared) {
      cellModel.IsRedFlagVisible = !cellModel.IsRedFlagVisible;
      this.$store.dispatch('incrementNbFlagged', (cellModel.IsRedFlagVisible ? 1 : -1));
    }
  }

  // helpers

  private getCell(rowNo: number, colNo: number): CellModel {
    const index = ((rowNo - 1) * this.myColCount) + colNo - 1;
    return this.board[index];
  }

  // privates

  // clean around 'coords' up to cells with near bomb(s)
  private clearEmptyAround(coords: CellCoords): void {
    const pos = this.getBoardPos(coords);
    this.board[pos].IsCleared = true;
    this.board[pos].CssClass = "empty-cell";
    const nearBombCount = this.getNearBombCount(coords);
    if (nearBombCount > 0) {
      this.board[pos].Text = nearBombCount.toString();
      this.board[pos].Style = this.getStyleColorByNbBomb(nearBombCount);
    }
    else {
      this.azimuth.map (aziStr => {
        const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);
        if (aziCoords.valid) {
          const aziPos = this.getBoardPos(aziCoords);
          if (!this.board[aziPos].IsCleared) {
            this.clearEmptyAround(aziCoords);
          }
        }
      });
    }
  }

  // add the required bombs anywhere randomly in the board
  private putBombs(firstClickedCellNo: number): void {
    if (this.$store.state.NbBomb < this.board.length) {
      for (let i = 0; i < this.$store.state.NbBomb; i++) {
        let pos = this.getRandomPos();
        while (pos === firstClickedCellNo || this.board[pos].IsBomb) {
          pos = this.getRandomPos();
        }
        this.board[pos].IsBomb = true;
      }
    }
  }

  getNearBombCount(coords: CellCoords): number {
    let nbBomb = 0;
    const surroundingBoardPos: number[] = this.computeSurroundingBoardPos(coords);
    surroundingBoardPos.map(n => {
      if (this.board[n].IsBomb) {
        nbBomb++;
      }
    });

    return nbBomb;
  }

  computeSurroundingBoardPos(coords: CellCoords): number[] {
    const surroundingBoardPos: number[] = [];

    this.azimuth.map (aziStr => {
      const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);
      if (aziCoords.valid) {
        surroundingBoardPos.push(this.getBoardPos(aziCoords));
      }
    });

    return surroundingBoardPos;
  }

  moveNearBombs(firstClickedCellNo: number) {
    const coords = this.getCellCoord(firstClickedCellNo);
    const surroundingBoardPos: number[] = this.computeSurroundingBoardPos(coords);

    this.azimuth.map (aziStr => {

      const aziCoords: CellCoords = this.getAziCoords(coords, aziStr);
      if (aziCoords.valid) {
        const curPos = this.getBoardPos(aziCoords);
        if (this.board[curPos].IsBomb) {
          this.board[curPos].IsBomb = false;
          let pos = this.getRandomPos();
          while (pos === firstClickedCellNo || surroundingBoardPos.indexOf(pos) != -1 || this.board[pos].IsBomb) {
            pos = this.getRandomPos();
            console.log('moving bomb from %s %s to %s', aziStr, curPos, pos);
          }
          this.board[pos].IsBomb = true;
        }
      }

    });
  }

  getAziCoords(coords: CellCoords, aziStr: string): CellCoords {
    const newCoords = new CellCoords();
    
    switch(aziStr) {
      case 'ne':
        if (coords.RowPos > 1 && coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos - 1;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 'n': 
        if (coords.RowPos > 1) {
          newCoords.RowPos = coords.RowPos - 1;
          newCoords.ColPos = coords.ColPos;
          newCoords.valid = true;
        }
        break;

      case 'nw':
        if (coords.RowPos > 1 && coords.ColPos < this.myColCount) {
          newCoords.RowPos = coords.RowPos - 1;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;

      case 'w': 
        if (coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 'e':
        if (coords.ColPos < this.myColCount) {
          newCoords.RowPos = coords.RowPos;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;

      case 'sw':
        if (coords.RowPos < this.myRowCount  && coords.ColPos > 1) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos - 1;
          newCoords.valid = true;
        }
        break;

      case 's':
        if (coords.RowPos < this.myRowCount) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos;
          newCoords.valid = true;
        }
        break;

      case 'se':
        if (coords.RowPos < this.myRowCount && coords.ColPos < this.myColCount) {
          newCoords.RowPos = coords.RowPos + 1;
          newCoords.ColPos = coords.ColPos + 1;
          newCoords.valid = true;
        }
        break;
    }

    return newCoords;
  }

  boom(currentCellNo: number): void {
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i].IsBomb) {
        if (i == currentCellNo) {
          this.board[i].CssClass = "cellBombCur";
        }
        else {
          if (!this.board[i].IsRedFlagVisible) {
            this.board[i].CssClass = "cellBomb";
          }
        }
      }
      else if (this.board[i].IsRedFlagVisible) {
        this.board[i].IsRedFlagVisible = false;
        this.board[i].CssClass = "badCellBomb";
        this.$store.dispatch('incrementNbFlagged', -1);        
      }
    }
    this.$store.dispatch('setRunMode', false);
    this.$store.dispatch('setBoom', true);
  }

  // get the board position by cell coord
  getBoardPos(coords: CellCoords): number {
    const rv = ((coords.RowPos - 1) * this.myColCount) + (coords.ColPos - 1);

    return rv;
  }

  getCellCoord(no: number): CellCoords {
    const cc = new CellCoords();
    
    cc.RowPos = Math.floor(no / this.myColCount) + 1;
    cc.ColPos = (no % this.myColCount) + 1;

    return cc;
  }

  // create board cells
  private initBoard(): void {
    this.bombSet = false;
    this.clickedOnce = false;
    this.board = [];
    let index = 0;
    for (let rowNo = 0; rowNo < this.myRowCount; rowNo++) {
      for (let colNo = 0; colNo < this.myColCount; colNo++) {
        const cell = this.createCellModel(index, rowNo, colNo);
        this.board.push(cell);
        index++;
      }
    }
  }

  // create and initialize one board cell
  private createCellModel(index: number, rowNo: number, colNo: number): CellModel {
    const cell = new CellModel();

    cell.CellId = `cell_${rowNo + 1}_${colNo + 1}`;
    cell.CellNo = index;
    cell.IsRedFlagVisible = false;
    cell.IsBomb = false;
    cell.IsCleared = false;
    cell.Text = '';
    cell.CssClass = 'cellUnclick'

    return cell;
  }

  // return a random where n >= 0 && n < board size
  private getRandomPos(): number {
    const rnd = Math.floor(Math.random() * this.board.length);

    return rnd;
  }

  // select text color by bomb count
  getStyleColorByNbBomb(nbBomb: number): string {
    let rv = '';

    switch(nbBomb) {
      case 1: rv = 'color: blue'; break;
      case 2: rv = 'color: green'; break;
      case 3: rv = 'color: red'; break;
      case 4: rv = 'color: indigo'; break;
      case 5: rv = 'color: magenta'; break;
      case 6: rv = 'color: maroon'; break;
      case 7: rv = 'color: orangered'; break;
      case 8: rv = 'color: purple'; break;      
    }

    return rv;
  }

} // class

</script>

<style scoped>

  #game-board {
    box-sizing: border-box;
    padding: 15px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  table, th, td {
    border: 1px solid black;
    padding: 0;
  }

  .cellUnclick {
    /* color: orange; */
    background-image: url(../assets/game-cell.png);
  }

  .cellEmpty {
    background-color: #a3a3a3;
  }

  .cellBomb {
    background-image: url(../assets/bomb-cell.png);
    background-color: #a3a3a3;
    background-position: center center;
    background-size: 16px;
  }

  .badCellBomb {
    background-image: url(../assets/bad-bomb-cell.png);
    background-color: #a3a3a3;
    background-position: center center;
    background-size: 16px;
  }

  .cellBombCur {
    background-image: url(../assets/bomb-cell.png);
    background-color: red;
    background-position: center center;
    background-size: 16px;
  }

</style>