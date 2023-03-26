import { BLOCK_TYPES, POSITION } from "../utils/constants";
import LevelSettings from "../utils/level_constructor";

console.warn("ENV_MOED::", "welcome");

// -1: Don't force
export const FORCE_DEFAULT_LEVEL_NUMBER = -1;

export const LEVELS = {
  1: new LevelSettings({
    board: {
      ROWS: 7,
      COLUMNS: 9,
      BLOCKS: {
        type: BLOCK_TYPES.BLOCK_AROUND,
        custom: {
          1: [4, 5, 6],
          2: [1, 2, 4, 5, 6],
          3: [1, 4],
          4: [1, 3, 4, 6, 7],
          5: [6, 7],
        },
      },
    },
    player: { location: { column: POSITION.START } },
    collectables: [{ location: { column: POSITION.END } }, { location: { row: POSITION.END, column: POSITION.START } }],
  }),
};
