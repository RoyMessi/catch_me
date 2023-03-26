import { MOVE_DIRECTIONS } from "./app_settings";

const SPEED = 400;
function actionAndWait(callback) {
  return new Promise((resolve, reject) => {
    callback();
    setTimeout(() => {
      resolve();
    }, SPEED);
  });
}
async function repeatAction(callback, repeat) {
  function action() {
    return new Promise(async (resolve) => {
      if (repeat === 0) {
        resolve(false);
        return;
      }
      await actionAndWait(callback).then(() => {
        resolve(--repeat);
      });
    });
  }

  while (await action());
}

// items.collectables[0].collected();
// items.enemies[0].caughtPlayer();

export async function myTests(num, items) {
  console.log("-", "Test", "Level number:", num, "-");
  await actionAndWait(() => {});
  if (num === 1) {
    await repeatAction(() => items.player.move(MOVE_DIRECTIONS.RIGHT), 2);
  } else if (num === 2) {
    await repeatAction(() => items.player.move(MOVE_DIRECTIONS.UP), 2);
    await repeatAction(() => items.player.move(MOVE_DIRECTIONS.RIGHT), 5);
    await repeatAction(() => items.player.move(MOVE_DIRECTIONS.DOWN), 2);
    await repeatAction(() => items.player.move(MOVE_DIRECTIONS.LEFT), 3);
  } else if (num === 3) {
    await repeatAction(() => items.player.move(MOVE_DIRECTIONS.RIGHT), 2);
    await actionAndWait(() => items.player.move(MOVE_DIRECTIONS.UP));
    await repeatAction(() => items.player.move(MOVE_DIRECTIONS.LEFT), 2);
    await repeatAction(() => items.player.move(MOVE_DIRECTIONS.UP), 3);
    await repeatAction(() => items.player.move(MOVE_DIRECTIONS.RIGHT), 5);
    await actionAndWait(() => items.player.move(MOVE_DIRECTIONS.DOWN));
  } else if (num === 4) {
    await actionAndWait(() => items.enemies[0].move(MOVE_DIRECTIONS.UP));
    await actionAndWait(() => items.enemies[0].move(MOVE_DIRECTIONS.UP));
    // await actionAndWait(() => items.enemies[0].move(MOVE_DIRECTIONS.RIGHT));
    await actionAndWait(() => items.enemies[0].move(MOVE_DIRECTIONS.LEFT));
    await actionAndWait(() => items.enemies[0].move(MOVE_DIRECTIONS.DOWN));
  }
}
