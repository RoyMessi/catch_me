import { MOVE_DIRECTIONS } from "../app_settings";

function _getRandomString() {
  return Math.random().toString(16).substring(2);
}

export function getRandomString() {
  return _getRandomString() + _getRandomString() + _getRandomString();
}

export function getNewLocationOnMove(boardSettings, currentLocation, direction) {
  const newLocation = Object.assign({}, currentLocation);
  if (direction === MOVE_DIRECTIONS.LEFT && newLocation.column > 0) {
    newLocation.column -= 1;
  } else if (direction === MOVE_DIRECTIONS.RIGHT && newLocation.column < boardSettings.COLUMNS - 1) {
    newLocation.column += 1;
  } else if (direction === MOVE_DIRECTIONS.UP && newLocation.row > 0) {
    newLocation.row -= 1;
  } else if (direction === MOVE_DIRECTIONS.DOWN && newLocation.row < boardSettings.ROWS - 1) {
    newLocation.row += 1;
  }
  return newLocation;
}
