function getCleanMatrix(boardSettings) {
  const matrix = Array(boardSettings.ROWS)
    .fill()
    .map((x) => Array(boardSettings.COLUMNS).fill(undefined));

  return matrix;
}

export default function MatrixUtil(boardSettings) {
  this._matrix = getCleanMatrix(boardSettings);

  this.getMatrix = function () {
    return this._matrix;
  };

  this.getValue = function (row, column) {
    return this._matrix[row][column];
  };

  this.hasValue = function (row, column) {
    return this._matrix[row][column];
  };

  this.setValue = function (row, column, value) {
    if (this._matrix[row][column]) {
      if (Array.isArray(this._matrix[row][column])) {
        this._matrix[row][column].push(value);
      } else {
        this._matrix[row][column] = [this._matrix[row][column]];
        this._matrix[row][column].push(value);
      }
    } else {
      this._matrix[row][column] = value;
    }
  };

  this.removeValue = function (row, column, value) {
    if (Array.isArray(this._matrix[row][column])) {
      const valueIndex = this._matrix[row][column].indexOf(value);
      this._matrix[row][column].splice(valueIndex, 1);
      this._matrix[row][column] = this._matrix[row][column][0];
    } else {
      this._matrix[row][column] = undefined;
    }
  };
}
