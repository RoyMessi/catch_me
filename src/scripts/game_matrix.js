import MatrixUtil from "./utils/matrix_util";
import { COLUMN_BLOCK_VALUE, WALK_ON_COLUMN_BLOCK_ENABLED } from "./app_settings";

function GameMatrix(boardSettings) {
  MatrixUtil.call(this, boardSettings);

  // Set blocks
  for (let row in boardSettings.BLOCKS) {
    boardSettings.BLOCKS[row].forEach((column) => {
      this._matrix[row][column] = COLUMN_BLOCK_VALUE;
    });
  }

  this.getNewMatrix = function () {
    return new GameMatrix(boardSettings).getMatrix();
  };

  this.isColumnBlock = function (row, column) {
    if (WALK_ON_COLUMN_BLOCK_ENABLED) return false;
    return this.getValue(row, column) === COLUMN_BLOCK_VALUE;
  };

  this.isPlayerCaught = function (item) {
    if (!["enemy", "player"].includes(item.type)) {
      return false;
    }
    const location = item.getLocation();
    if (Array.isArray(this._matrix[location.row][location.column])) {
      let _items = [];
      this._matrix[location.row][location.column].forEach((x) => _items.push(x.type));
      return _items.includes("player") && _items.includes("enemy");
    }
  };
}

GameMatrix.prototype = Object.create(GameMatrix.prototype, {
  constructor: {
    value: GameMatrix,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

export default GameMatrix;
