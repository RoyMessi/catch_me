import { BLOCK_TYPES, POSITION } from "../utils/constants";
import LevelSettings, { createArrayRange } from "../utils/level_constructor";

// -1: Don't force
export const FORCE_DEFAULT_LEVEL_NUMBER = -1;

export const LEVELS = {
  1: new LevelSettings({
    board: { ROWS: 3, BLOCKS: { type: BLOCK_TYPES.BLOCK_AROUND } },
    player: { location: { column: POSITION.START } },
    collectables: [{ location: { column: POSITION.MIDDLE } }],
  }),
  2: new LevelSettings({
    board: {
      ROWS: 5,
      BLOCKS: { type: BLOCK_TYPES.BLOCK_AROUND, custom: { 2: createArrayRange(2, 5), 3: [2] } },
    },
    collectables: [{ location: { row: POSITION.END, column: 3 } }],
    player: { location: { row: POSITION.END } },
  }),
  3: new LevelSettings({
    board: {
      ROWS: 7,
      BLOCKS: { type: BLOCK_TYPES.BLOCK_AROUND, custom: { 2: createArrayRange(2, 5), 3: [2] } },
    },
    collectables: [
      { location: { row: POSITION.END, column: POSITION.MIDDLE } },
      { location: { column: POSITION.START } },
      { location: { row: 2, column: POSITION.END } },
    ],
    player: { location: { row: POSITION.END } },
    enemies: [{ location: { column: POSITION.END } }],
  }),
};
