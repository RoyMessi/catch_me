import { COLLECTABLE_TYPES, LEVEL_TYPES } from "../../app_settings";
import { POSITION } from "../utils/constants";
import LevelSettings, { createArrayRange } from "../utils/level_constructor";

console.warn("ENV_MOED::", "dev");

// -1: Don't force
export const FORCE_DEFAULT_LEVEL_NUMBER = -1;

export const LEVELS = {
  1: new LevelSettings({
    board: { ROWS: 3 },
    player: { location: { column: POSITION.START } },
    collectables: [{ location: { column: 2 } }, { location: { column: POSITION.MIDDLE } }],
  }),
  2: new LevelSettings({
    board: {
      ROWS: 5,
      BLOCKS: { custom: { 2: createArrayRange(2, 5), 3: [2] } },
    },
    collectables: [
      { location: { row: 2, column: 1 } },
      { location: { row: 2, column: 8 }, type: COLLECTABLE_TYPES.BAD },
      { location: { row: 2, column: 7 }, type: COLLECTABLE_TYPES.BAD },
      { location: { row: 2, column: 6 }, type: COLLECTABLE_TYPES.BAD },
      { location: { row: POSITION.END, column: 3 } },
    ],
    player: { location: { row: POSITION.END } },
  }),
  3: new LevelSettings({
    type: LEVEL_TYPES.MEDIUM,
    board: {
      ROWS: 8,
      BLOCKS: {
        custom: { 1: createArrayRange(5, 9), 2: [6, 7, 8], 3: [7] },
      },
      // UNBLOCK: { 4: [0, 15], 0: [7], 7: [7] },
    },
    collectables: [
      { location: { row: POSITION.END, column: POSITION.MIDDLE } },
      { location: { column: POSITION.START } },
      { location: { row: 2, column: POSITION.END } },
      { location: { row: -2, column: 3 } },
      { location: { row: 3, column: 6 }, type: COLLECTABLE_TYPES.BAD },
      { location: { row: 3, column: 8 }, type: COLLECTABLE_TYPES.BAD },
    ],
    player: { location: { row: POSITION.END } },
    enemies: [{ location: { column: POSITION.END } }],
  }),
  4: new LevelSettings({
    type: LEVEL_TYPES.MEDIUM,
    board: {
      ROWS: 8,
      BLOCKS: {
        custom: { 1: [11], 2: [11], 3: [11, 13, 14], 5: [4, 5, 6] },
      },
    },
    collectables: [
      { location: { row: POSITION.END, column: POSITION.MIDDLE } },
      { location: { column: POSITION.START } },
      { location: { row: 2, column: POSITION.END } },
      { location: { row: -2, column: 3 } },
      { location: { row: 3, column: 9 }, type: COLLECTABLE_TYPES.BAD },
    ],
    player: { location: { row: POSITION.END } },
    enemies: [{ location: { column: POSITION.END } }, { location: { row: POSITION.END, column: POSITION.END } }],
  }),
  5: new LevelSettings({
    type: LEVEL_TYPES.HARD,
    board: {
      ROWS: 8,
      BLOCKS: {
        custom: { 1: [12], 2: [12], 5: [3, 12], 6: [3, 12] },
      },
    },
    collectables: [
      { location: { row: 1, column: -3 } },
      { location: { row: POSITION.MIDDLE, column: POSITION.MIDDLE } },
      { location: { row: -2, column: 3 } },
      { location: { row: POSITION.END, column: -3 } },
      { location: { row: 3, column: -2 }, type: COLLECTABLE_TYPES.BAD },
      { location: { row: -2, column: 4 }, type: COLLECTABLE_TYPES.BAD },
    ],
    player: { location: { column: POSITION.START } },
    enemies: [
      { location: { column: POSITION.END } },
      { location: { row: POSITION.END, column: POSITION.END } },
    ],
  }),
};
