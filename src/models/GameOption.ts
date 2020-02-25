export default class GameOption {
  private _NbRow = 0;
  private _NbCol = 0;
  private _NbBomb = 0;

  public set NbRow(nbRow: number) {
    this._NbRow = nbRow;
  }
  public get NbRow(): number {
    return this._NbRow;
  }
  
  public set NbCol(nbCol: number) {
    this._NbCol = nbCol;    
  }
  public get NbCol(): number {
    return this._NbCol;
  }

  public set NbBomb (nbBomb: number) {
    this._NbBomb = nbBomb;
  }
  public get NbBomb(): number {
    return this._NbBomb;
  }
}