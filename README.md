# Catch me

## What you can do?

### Levels

- Set multiple levels
- Control over level structure
- Set different structure in each level

### Items

- Add multiple collectables (good, bad, very good)
- Add multiple enemies (no types yet)
- Set collectables & enemies & player locations over each level

## Add new level

- Go to `src/scripts/levels_settings/env_settings/{ENV FILE}.js`
- You can force from which level you want to start the game
  ```
  export const FORCE_DEFAULT_LEVEL_NUMBER = -1;
  ```
- Inside the `LEVELS` is where the magic is goin!

  ```
  export const LEVELS = {};
  ```

  ### Work with Level

  - For now the levels are inside an `Object` (used for development) but it probably will change soon
  - This is a vary simple code for a level.
    ```
      1: new LevelSettings({
        board: { ROWS: 3 },
        player: { location: { column: 1 } },
        collectables: [{ location: { column: 2 } }, { location: { column: 6 } }],
      })
    ```
  - We have a board with only 3 `ROWS`
    The LevelSettings will auto complete the `COLUMNS`.
    You can find the `COLUMNS` settings insdie the `./app_settings.js`. - Player location. We only need to set the `column`, the default for `row` will be `0` or the next available row index. - Collectables. Here we have an array of collectables. Again, we only have to set the `column` - because the only `row` our player can move is `row: 1`.

  <br>

  ### Cool, now let's get fun with it!

  Let's say the `BOARD_DEFAULT_SETTINGS.COLUMNS` is 16.\
  You know you don't want to change the `location.column` everytime the `BOARD_DEFAULT_SETTINGS.COLUMNS` changed, right?\
  To overcome that you can use: `POSITION.END`, `POSITION.START`, `POSITION.MIDDLE`. Then the `LevelSettings` will set it for you.\
  This availible for both `location.row` & `location.column`.

  Let's see an exmpale of this technique, over the last example I showed you:

  ```
  1: new LevelSettings({
    board: { ROWS: 3 },
    player: { location: { column: POSITION.START } },
    collectables: [{ location: { column: 2 } }, { location: { column: POSITION.MIDDLE } }],
  }),
  ```

  - In here we setting the player `location.column` in the start of the row
  - The second collectable is in the middle of the row

  <br>

  But wait! what if you want to place an item `-2` or more from the end? well, you can :)\
  (Note: Not fully working, because you need to think on other options of blocked columns. Blocked columns will be explore soon)

  ### Let's explore some types!

  - Level types:\
    You can have multiple levels types: easy, medium, hard, very_hard. Check the `LEVEL_TYPES` on `./app_settings.js`
  - Collectable types:\
    regular, very_good, bad. Check the `COLLECTABLE_TYPES` on `./app_settings.js`.\
    You will also find the value of each collectable type + its image source.

  <br>

  Let's see an exmpale of this technique, over the last example I showed you:

  ```
  1: new LevelSettings({
    type: LEVEL_TYPES.MEDIUM,
    board: { ROWS: 3 },
    player: { location: { column: POSITION.START } },
    collectables: [
      { location: { column: 2 } },
      { location: { column: POSITION.MIDDLE }, type: COLLECTABLE_TYPES.BAD }
    ],
  }),
  ```

  - Now the level type is Medium (The default is easy)
  - We now add a type bad to the collectable (The deault is regular)

  <br>

  ### Custom a level with BLOCKS & UNBLOCK

  <br>

  #### - BLOCKS -

  `BLOCKS` option is great! its giving you the ability to shape the level as you like.\
   This time Let's see an example of a large level:

  ```
  2: new LevelSettings({
    type: LEVEL_TYPES.MEDIUM,
    board: {
      ROWS: 8,
      BLOCKS: {
        custom: { 1: createArrayRange(5, 9), 2: [6, 7, 8], 3: [7] },
      },
    },
    collectables: [
      { location: { row: POSITION.END, column: POSITION.MIDDLE } },
      { location: { column: POSITION.START } },
      { location: { row: 2, column: POSITION.END } },
      { location: { row: -2, column: 3 } },
    ],
    player: { location: { row: POSITION.END } },
    enemies: [{ location: { column: POSITION.END } }],
  }),
  ```

  - Inside `board.BLOCKS` we have the ability to customize our blocks on the board.\
    We can have as many as we want (in the level dimensions of course)\
  - So how does it works?\
    The `board.BLOCKS.custom` is an Object. The keys are the number of the row (which starts from 0).\
    The value is an Array of columns indexes we want to block.
    Now, let's say you don't want to write an array of numbers from 3 to 10 - you can use the function `createArrayRange`.\
    You need to pass 2 numbers - start & end. The function will return an array that includes both start & end numbers.

  <br>

  #### - UNBLOCKS -

  Use this option for when, you know, you want to unblock some columns hah ;)
  Let's see an example:

  ```
  2: new LevelSettings({
    type: LEVEL_TYPES.MEDIUM,
    board: {
      ROWS: 8,
      BLOCKS: {
        custom: { 1: createArrayRange(5, 9), 2: [6, 7, 8], 3: [7] },
      },
      UNBLOCK: { 4: [0, 15], 0: [7], 7: [7] },
    },
    collectables: [
      { location: { row: POSITION.END, column: POSITION.MIDDLE } },
      { location: { column: POSITION.START } },
      { location: { row: 2, column: POSITION.END } },
      { location: { row: -2, column: 3 } },
    ],
    player: { location: { row: POSITION.END } },
    enemies: [{ location: { column: POSITION.END } }],
  }),
  ```

  For now it's doesn't helping match, but in the future I'm sure it will

## App Settings (`./app_settings.js`)

Some of the settings you can change:

- Different audios the app can play
- Different collectables types & Images
- Player & Enemies speeds
- Default board size

As you can see, you can change a lot of things :)

## Known issues

- In case `src/scripts/levels_settings/{ENV}_settings.js` doesn't exists the game will not load
- Placing items
  - in case of an occupied column - the app will try 3 times (Find in settings) to place it
  - In case you're trying to place an item outside the level size(rows|columns) - you'll get an error
- on keydown long press the player is stuck for a moment
  - This is due to how the JS handle the keydown repeat (Will try to attend this issue)
