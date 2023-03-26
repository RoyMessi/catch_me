import { APP_NAME, APP_SOUND_COLLECTABLES_ENABLED, APP_SOUND_ENABLED, APP_SOUND_LEVEL_ENABLED } from "./app_settings";

export function getLevelWrapper() {
  return `<div id="level_wrapper"></div>`;
}

export function getGameHeader(settings) {
  let template = "";
  let gameInfoTemplate = "";
  if (settings.loadHeader) {
    template += `<h1 class="main-color">${APP_NAME}!</h1>`;
  }

  if (settings.loadStatistics) {
    gameInfoTemplate += getGameStatisticsTemplate();
  }
  if (settings.loadSounds) {
    gameInfoTemplate += getGameSoundsTemplate();
  }

  if (gameInfoTemplate) {
    gameInfoTemplate = `<div id='game_info'>${gameInfoTemplate}</div>`;
  }
  return `<div>${template}${gameInfoTemplate}</div>`;
}

export function getBoardTemplate(boardSettings) {
  let rtn = "";
  for (let row = 0; row < boardSettings.ROWS; row++) {
    rtn += `<div class='${boardSettings.CSS_CLASS_ROW}' ${boardSettings.ATTRIBUTE_DATA_ROW}='${row}'>`;
    for (let column = 0; column < boardSettings.COLUMNS; column++) {
      const block = boardSettings.BLOCKS[row]?.includes(column) ? " block" : "";
      rtn += `<div class='${boardSettings.CSS_CLASS_COLUMN}${block}' ${boardSettings.ATTRIBUTE_DATA_COLUMN}='${column}'></div>`;
    }
    rtn += "</div>";
  }
  return rtn;
}

function getGameStatisticsTemplate() {
  let rtn = '<div id="game_statistics" class="main-color my-2">';
  rtn += '<span>Level</span>: <strong id="level_number">0</strong> | ';
  rtn += '<span>Collectables</span>: <strong id="remains_collectable">0</strong> | ';
  rtn += '<span>Score</span>: <strong id="score">0</strong>';
  rtn += "</div>";
  return rtn;
}

function getSoundTemplate(value, id, text) {
  const checkedAttribute = value ? " checked" : "";
  return `<div><input type="checkbox" ${checkedAttribute} id="${id}" /> <label for="${id}">${text}<label></div>`;
}

function getGameSoundsTemplate() {
  let rtn = '<div id="game_sounds" class="d-flex my-2 flex-gap-1 main-color">';
  rtn += getSoundTemplate(APP_SOUND_ENABLED, "all_game_sounds", "All game sounds");
  rtn += getSoundTemplate(APP_SOUND_LEVEL_ENABLED, "level_sounds", "Level sounds");
  rtn += getSoundTemplate(APP_SOUND_COLLECTABLES_ENABLED, "collectables_sounds", "Collectables sounds");
  rtn += "</div>";
  return rtn;
}

export function gameCompletedUI() {
  let rtn = '<div id="game_over_with_success" class="d-flex flex-center flex-d-column main-color">';
  rtn += "<h1>Winner!</h1>";
  rtn += "<h2>Well done, you finished the game</h2>";
  rtn += "</div>";
  return rtn;
}

export function getLevelNotFoundUI() {
  let rtn = "<div id='level_not_found' class='d-flex flex-center flex-d-column main-color'>";
  rtn += "<h2>404 Level Not Found</h2>";
  rtn += "</div>";
  return rtn;
}

export function getLevelFailedUI() {
  let rtn = "<div id='level_status' class='main-color'>";
  rtn += "<h2>Level failed</h2>";
  rtn += `<button class="btn mt-2">Try again</button>`;
  rtn += "</div>";
  return rtn;
}

export function getLevelCompletedUI() {
  let rtn = "<div id='level_status' class='main-color'>";
  rtn += "<h2>Level completed</h2>";
  rtn += "</div>";
  return rtn;
}
