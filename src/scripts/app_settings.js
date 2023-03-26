export const DEFAULT_LEVEL_NUMBER = 1;
export const APP_ENVS = {
  TEST: "test",
  DEV: "dev",
  PRODUCTION: "prod",
};
export const APP_ENV = import.meta.env.VITE_APP_ENV;
export const APP_NAME = import.meta.env.VITE_APP_NAME;

export const APP_SOUND_ENABLED = import.meta.env.VITE_APP_SOUND_ENABLED === "true";
export const APP_SOUND_LEVEL_ENABLED = import.meta.env.VITE_APP_SOUND_LEVEL_ENABLED === "true";
export const APP_SOUND_COLLECTABLES_ENABLED = import.meta.env.VITE_APP_SOUND_COLLECTABLES_ENABLED === "true";
export const APP_SAVE_TO_SESSION = import.meta.env.VITE_APP_SAVE_TO_SESSION === "true";

export const LOAD_ALL_ITEMS = import.meta.env.VITE_LOAD_ALL_ITEMS === "true";
export const LOAD_COLLECTABLE_ITEMS = import.meta.env.VITE_LOAD_COLLECTABLE_ITEMS === "true";
export const LOAD_ENEMIES_ITEMS = import.meta.env.VITE_LOAD_ENEMIES_ITEMS === "true";
export const LOAD_PLAYER_ITEMS = import.meta.env.VITE_LOAD_PLAYER_ITEMS === "true";

// Enemy
export const ENEMY_STRATEGY_ENABLED = import.meta.env.VITE_ENEMY_STRATEGY_ENABLED === "true";
// export const ENEMY_INITAL_VALUE_ON_MATRIX = 0;
export const ENEMY_SPEED = 500;
export const ENEMIES_SEARCH_PLAYER_DEBOUNCE = 200;

// Player
export const PLAYER_CAN_COLLECT_ENABLED = true;
// export const PLAYER_IDENTIFIER_ON_MATRIX = "P";
export const PLAYER_DEBOUNCE = 300;

// Block
export const WALK_ON_COLUMN_BLOCK_ENABLED = false;
export const COLUMN_BLOCK_VALUE = -1;

// General
export const WORKERS_PATH = "./src/scripts/workers";
export const DELAY_BEFORE_DELETE_MILLISECONDS = 200;
export const WAIT_BEFORE_NEXT_LEVEL = 1000;
export const WAIT_BEFORE_REMOVE_FROM_DOM = 300;
export const MAX_TRIES_TO_PLACE_AN_ITEM = 3;
export const BOARD_DEFAULT_SETTINGS = {
  ROWS: 8,
  COLUMNS: 16,
  ATTRIBUTE_DATA_ROW: "data-row",
  ATTRIBUTE_DATA_COLUMN: "data-column",
  CSS_CLASS_ROW: "board-row",
  CSS_CLASS_COLUMN: "board-column",
  CSS_CLASS_BLOCK: "board-column block",
  BLOCKS: {},
};

export const VALID_KEYS = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
export const MOVE_DIRECTIONS = { UP: "up", LEFT: "left", DOWN: "down", RIGHT: "right" };
export const KEY_TO_DIRECTION = {
  ArrowUp: MOVE_DIRECTIONS.UP,
  ArrowLeft: MOVE_DIRECTIONS.LEFT,
  ArrowRight: MOVE_DIRECTIONS.RIGHT,
  ArrowDown: MOVE_DIRECTIONS.DOWN,
};

// Mobile
export const MOBILE_CLASSNAME_PREFIX = "dir-";
export const MOBILE_OLD_CLASSNAME_PREFIX = "old-";
export const MOBILE_CSS_DIRECTIONS = Object.values(MOVE_DIRECTIONS).join("|");
export const MOBILE_CSS_DIRECTION_REGEX = new RegExp(`${MOBILE_CLASSNAME_PREFIX}(${MOBILE_CSS_DIRECTIONS})?`, "g");
export const MOBILE_OLD_CSS_DIRECTION_REGEX = new RegExp(
  `${MOBILE_OLD_CLASSNAME_PREFIX}(${MOBILE_CSS_DIRECTIONS})?`,
  "g"
);

// From constants.js
export const EVENTS_NAMES = {
  // GAME
  COLLECTABLE_COLLECTED: "collected",
  BAD_COLLECTABLE_COLLECTED: "bad_collected",
  LEVEL_STATISTICS: "levelStatistics",
  EVENTS_CALLBACKS: "eventsCallbacks",
  NO_MORE_COLLECTABLES: "noMoreCollectables",
  CAUGHT_PLAYER: "caughtPlayer",
  ENTERED_ENEMY_TERRITORY: "enteredEnemyTerritory",
  // PLAYER_IS_READY_TO_MOVE: "playerIsReadyToMove",
  // STOP_PLAYER: "stopPlayer",
  ENEMY_IS_READY_TO_SEARCH_PLAYER: "enemyIsReadyToSearchPlayer",
  LEVEL_STOPPED: "levelStopped",
  RELOAD_CURRENT_LEVEL: "reloadCurrentLevel",
  LOG: "log",

  // LEVEL
  APPEND_ELEMENT_TO_GAME: "append",
  APPEND_STRING_AS_DOM_TO_THE_END_OF_GAME: "appendStringAsDOM",
  REMOVE_ELEMENT_BY_LOCATION: "removeElementByLocation",
  MOVE_END: "moveEnd",

  // STOP_ITEM_MOVEMENT: "stopItemMovement",
  PLAYER_WANTS_TO_MOVE: "playerWantsToMove",
  ENEMY_WANTS_TO_MOVE: "enemyWantsToMove",
};

export const LEVEL_TYPES = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  VERY_HARD: "very_hard",
};

export const AUDIOS_DIRECTORY = "./src/assets/audios/";
export const AUDIOS = {
  DEFAULT_BACKGROUND: "default_background",
  HARD_LEVEL_BACKGROUND: "hard_level",
  COLLECTABLE_COLLECTED: "collectable_collected",
  BAD_COLLECTABLE_COLLECTED: "bad_collectable_collected",
  LEVEL_FAILED: "level_failed",
  LEVEL_COMPLETED: "level_completed",
  LEVEL_NOT_FOUND: "level_not_found",
  GAME_COMPLETED: "game_completed",
};
export const AUDIOS_SETTINGS = {
  [AUDIOS.DEFAULT_BACKGROUND]: {
    src: "levels/easy.mp3",
    volume: 0.5,
    loop: true,
    autoplay: false,
    // allowToPlay: false,
    // dontUpdateOnMatchSrouce: true,
  },
  [AUDIOS.HARD_LEVEL_BACKGROUND]: {
    src: "levels/hard.mp3",
    volume: 0.6,
    autoplay: false,
    loop: true,
    // allowToPlay: false,
    // dontUpdateOnMatchSrouce: true,
  },
  [AUDIOS.LEVEL_NOT_FOUND]: {
    src: "levels/level_not_found.mp3",
    volume: 0.6,
    autoplay: true,
    stopAllOtherSounds: true,
  },
  [AUDIOS.LEVEL_FAILED]: {
    src: "levels/failed.mp3",
    volume: 0.6,
    autoplay: true,
    stopAllOtherSounds: true,
  },
  [AUDIOS.LEVEL_COMPLETED]: {
    src: "levels/done.mp3",
    volume: 1,
    autoplay: true,
    duration: 2.5,
    stopAllOtherSounds: true,
  },
  [AUDIOS.COLLECTABLE_COLLECTED]: {
    src: "collectables/good.mp3",
    autoplay: true,
    duration: 0.2,
  },
  [AUDIOS.BAD_COLLECTABLE_COLLECTED]: {
    src: "collectables/bad.mp3",
    volume: 1,
    autoplay: true,
    duration: 0.5,
  },
  [AUDIOS.GAME_COMPLETED]: {
    src: "game_completed.mp3",
    volume: 0.6,
    autoplay: false,
    loop: false,
  },
};

export const ENEMIES_ICONS = ["enemy_1.svg", "enemy_2.svg", "enemy_3.svg", "enemy_4.svg", "enemy_5.svg", "enemy_6.svg"];

// Collectables
export const COLLECTABLE_TYPES = { VERY_GOOD: "very_good", REGULAR: "regular", BAD: "bad" };
export const NOT_REQUIRED_COLLECTABLE_TYPES = [COLLECTABLE_TYPES.BAD];
export const COLLECTABLE_TYPES_VALUES = {
  [COLLECTABLE_TYPES.REGULAR]: {
    value: 1,
    src: "collectables/regular.svg",
  },
  [COLLECTABLE_TYPES.VERY_GOOD]: {
    value: 4,
    src: "collectables/very_good.svg",
  },
  [COLLECTABLE_TYPES.BAD]: {
    value: -1,
    src: "collectables/bad.svg",
  },
};
