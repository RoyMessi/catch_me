let gameDimensions = { ROWS: 0, COLUMNS: 0 };
let matrix;
let playerLocation;

let possibleRoutes = {};
let maxSteps;
let hasAdditionalStep = true;

function findRoute() {
  --maxSteps;
  if (maxSteps === 0) {
    postMessage({
      error: {
        message: "Reached max steps and failed to find a route",
        data: { matrix },
      },
    });
    return;
  }
  if (!hasAdditionalStep) {
    postMessage(getPossibleRoutesWithDirections());
    return;
  }

  let locations = Object.keys(possibleRoutes);
  if (locations.length === 0) {
    possibleRoutes[playerLocation] = undefined;
    locations = Object.keys(possibleRoutes);
  }

  locations.forEach((location) => {
    if (!hasAdditionalStep) {
      return;
    }

    let { row, column } = getNumericRowAndColumn(location);
    const locationArr = [row, column];
    const stepNumber = matrix[row][column];
    const nextStep = getPossibleDirectionsIndexes(row, column);

    if (stepNumber - 1 === -1) {
      hasAdditionalStep = false;
      return;
    }

    if (nextStep.up !== null) {
      setPossibleRouteFromPlayerLocation(nextStep.up, column, stepNumber, locationArr);
    }
    if (nextStep.down !== null) {
      setPossibleRouteFromPlayerLocation(nextStep.down, column, stepNumber, locationArr);
    }
    if (nextStep.left !== null) {
      setPossibleRouteFromPlayerLocation(row, nextStep.left, stepNumber, locationArr);
    }
    if (nextStep.right !== null) {
      setPossibleRouteFromPlayerLocation(row, nextStep.right, stepNumber, locationArr);
    }

    delete possibleRoutes[locationArr];
  });
  findRoute();
}
function getPossibleDirectionsIndexes(row, column) {
  return {
    up: row - 1 >= 0 ? row - 1 : null,
    down: row + 1 < gameDimensions.ROWS ? row + 1 : null,
    left: column - 1 >= 0 ? column - 1 : null,
    right: column + 1 < gameDimensions.COLUMNS ? column + 1 : null,
  };
}
function setPossibleRouteFromPlayerLocation(row, column, stepNumber, location) {
  const num = matrix[row][column];
  if (stepNumber - 1 === num) {
    possibleRoutes[[row, column]] = {
      [location]: possibleRoutes[location],
    };
  }
}
function getNumericRowAndColumn(locationKey) {
  let [row, column] = locationKey.split(",");
  return { row: Number(row), column: Number(column) };
}
function getPossibleRoutesWithDirections() {
  return Object.keys(possibleRoutes).map((location) => {
    let route = [];
    let locationKey = location;
    let routeItem = possibleRoutes[location];
    let currentRowAndColumn = getNumericRowAndColumn(locationKey);

    while (routeItem !== undefined) {
      locationKey = Object.keys(routeItem)[0];
      let { row, column } = getNumericRowAndColumn(locationKey);
      if (row < currentRowAndColumn.row) {
        route.push("up");
      } else if (row > currentRowAndColumn.row) {
        route.push("down");
      } else if (column < currentRowAndColumn.column) {
        route.push("left");
      } else if (column > currentRowAndColumn.column) {
        route.push("right");
      }

      currentRowAndColumn = { row, column };
      routeItem = routeItem[locationKey];
    }
    return route;
  });
}

onmessage = function (event) {
  const data = event.data;
  matrix = data.matrix;
  playerLocation = data.playerLocation;

  gameDimensions = { ROWS: data.matrix.length, COLUMNS: data.matrix[0].length };
  maxSteps = gameDimensions.ROWS * gameDimensions.COLUMNS;
  hasAdditionalStep = true;
  findRoute();
};
