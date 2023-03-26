let gameDimensions = { ROWS: 0, COLUMNS: 0 };
let isPlayerLocationFound = false;
let maxSteps;
let matrix = [];
let playerLocation = { row: 0, column: 0 };

function getPossibleDirections(row, column) {
  return {
    up: row - 1 >= 0 ? row - 1 : null,
    down: row + 1 < gameDimensions.ROWS ? row + 1 : null,
    left: column - 1 >= 0 ? column - 1 : null,
    right: column + 1 < gameDimensions.COLUMNS ? column + 1 : null,
  };
}
function getIsMatrixPositionEmpty(row, column) {
  return typeof matrix[row][column] !== "number";
}
function getNextStepOptions(row, column, currentStep) {
  row = Number(row);
  column = Number(column);

  const nextStep = getPossibleDirections(row, column);
  const rtn = [];
  if (nextStep.up !== null && getIsMatrixPositionEmpty(nextStep.up, column)) {
    rtn.push([nextStep.up, column, currentStep]);
  }
  if (nextStep.down !== null && getIsMatrixPositionEmpty(nextStep.down, column)) {
    rtn.push([nextStep.down, column, currentStep]);
  }
  if (nextStep.left !== null && getIsMatrixPositionEmpty(row, nextStep.left)) {
    rtn.push([row, nextStep.left, currentStep]);
  }
  if (nextStep.right !== null && getIsMatrixPositionEmpty(row, nextStep.right)) {
    rtn.push([row, nextStep.right, currentStep]);
  }

  return rtn;
}

function fillMatrixByEnemyLocation(currentStep, lastStepList) {
  --maxSteps;
  if (isPlayerLocationFound || maxSteps === -1) {
    postMessage({
      status: "end",
      hasMoreSteps: maxSteps > 0,
      matrix,
    });
    return;
  }

  let lastResults = [];
  lastStepList.forEach((position) => {
    let nextStepOptions = getNextStepOptions(position[0], position[1], currentStep);
    nextStepOptions.forEach((entry) => {
      const value = matrix[entry[0]][entry[1]];
      if (entry[0] === playerLocation.row && entry[1] === playerLocation.column) {
        isPlayerLocationFound = true;
      }
      if (typeof value !== "number") {
        matrix[entry[0]][entry[1]] = entry[2];
      }
    });
    lastResults.push(...nextStepOptions);
  });

  lastStepList.splice(0, lastStepList.length);
  lastStepList = lastResults;
  fillMatrixByEnemyLocation(++currentStep, lastStepList);
}

onmessage = function (event) {
  const data = event.data;
  gameDimensions = { ROWS: data.matrix.length, COLUMNS: data.matrix[0].length };
  maxSteps = gameDimensions.ROWS * gameDimensions.COLUMNS;
  playerLocation = data.playerLocation;
  matrix = data.matrix;
  matrix[data.enemyLocation[0]][data.enemyLocation[1]] = 0;
  fillMatrixByEnemyLocation.call(fillMatrixByEnemyLocation, 1, [data.enemyLocation]);
};
