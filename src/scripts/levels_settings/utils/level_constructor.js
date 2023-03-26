import { COLLECTABLE_TYPES, COLLECTABLE_TYPES_VALUES, LEVEL_TYPES, BOARD_DEFAULT_SETTINGS } from "../../app_settings";
import { BLOCK_TYPES, POSITION } from "./constants";

const Blocks = (() => {
  function blockAround(newSettings) {
    let blocks = {};
    for (let row = 0; row < newSettings.ROWS; row++) {
      if (row === 0 || row === newSettings.ROWS - 1) {
        blocks[row] = [...Array(newSettings.COLUMNS).keys()];
      } else {
        blocks[row] = [0, newSettings.COLUMNS - 1];
      }
    }
    return blocks;
  }

  function addBlocks(newSettings) {
    let customBlock = newSettings.BLOCKS?.custom ?? {};
    if (newSettings.blockType === BLOCK_TYPES.BLOCK_AROUND) {
      newSettings.blockType = BLOCK_TYPES.BLOCK_AROUND;
      newSettings.BLOCKS = blockAround({ ROWS: newSettings.ROWS, COLUMNS: newSettings.COLUMNS });
    } else {
      newSettings.BLOCKS = [];
    }

    Object.keys(customBlock).forEach((row) => {
      if (!newSettings.BLOCKS[row]) {
        newSettings.BLOCKS[row] = [];
      }
      newSettings.BLOCKS[row].push(...customBlock[row]);
    });
  }

  function removeBlocks(newSettings) {
    if (!newSettings?.UNBLOCK) {
      return;
    }

    Object.keys(newSettings?.UNBLOCK).forEach((row) => {
      if (!newSettings.BLOCKS[row]) {
        return;
      }
      newSettings.BLOCKS[row] = newSettings.BLOCKS[row].filter((column) => !newSettings.UNBLOCK[row].includes(column));
    });
  }

  return {
    addBlocks,
    removeBlocks,
  };
})();

function updateBoardSettings(settings) {
  let tmp = Object.create(BOARD_DEFAULT_SETTINGS);
  let newSettings = Object.assign(tmp, settings);
  newSettings.blockType = settings?.BLOCKS?.type ?? BLOCK_TYPES.BLOCK_AROUND;
  Blocks.addBlocks(newSettings);
  Blocks.removeBlocks(newSettings);
  return newSettings;
}

export function createArrayRange(start, end) {
  const step = 1;
  return Array.from({ length: end - start + 1 }, (_, x) => start + x * step);
}

export default function LevelSettings(settings) {
  settings = settings || {};
  this.levelSettings = {
    type: settings?.type ?? LEVEL_TYPES.EASY,
    boardSettings: updateBoardSettings(settings?.board),
    collectables: [],
    enemies: [],
    player: null,
  };

  this.getLocationAxis = function (axis, value) {
    const hasBlockAround = this.levelSettings.boardSettings.blockType === BLOCK_TYPES.BLOCK_AROUND;
    const defaultValue = hasBlockAround ? 1 : 0;
    const defaultSetting = this.levelSettings.boardSettings[axis];
    const arrayValue = hasBlockAround ? defaultSetting - 2 : defaultSetting - 1;

    if (typeof value === "string") {
      if (value === POSITION.START) {
        return defaultValue;
      } else if (value === POSITION.MIDDLE) {
        return Math.floor(arrayValue / 2);
      } else if (value === POSITION.END) {
        return arrayValue;
      }
    } else if (typeof value === "number") {
      if (value < 0 && Math.abs(value) <= arrayValue) {
        return arrayValue + value;
      }
      return value < arrayValue ? value : arrayValue;
    }

    return defaultValue;
  };

  this.itemData = function (data) {
    if (data.location) {
      data.location.column = this.getLocationAxis("COLUMNS", data.location?.column);
      data.location.row = this.getLocationAxis("ROWS", data.location?.row);
    } else {
      data.location = { row: 0, column: 0 };
    }
    return data;
  };

  if (settings.collectables) {
    this.levelSettings.collectables = settings.collectables.map((c) => {
      let collectable = this.itemData(c);
      if (typeof collectable.type === "undefined") {
        collectable.subType = COLLECTABLE_TYPES.REGULAR;
      } else {
        collectable.subType = collectable.type;
      }

      return { ...COLLECTABLE_TYPES_VALUES[collectable.subType], ...collectable };
    });
  }

  if (settings.enemies) {
    this.levelSettings.enemies = settings.enemies.map((e) => this.itemData(e));
  }

  if (settings.player) {
    this.levelSettings.player = this.itemData(settings.player);
  }

  return this.levelSettings;
}
