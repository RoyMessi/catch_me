import { EVENTS_NAMES } from "./app_settings";
import EnemyStrategy from "./enemy_strategy";
import {
  ENEMIES_SEARCH_PLAYER_DEBOUNCE,
  ENEMY_STRATEGY_ENABLED,
  KEY_TO_DIRECTION,
  PLAYER_DEBOUNCE,
  VALID_KEYS,
} from "./app_settings";

export default function ItemsMovenemtOnBoard(cleanMatrix) {
  let observeItems = { player: null, enemies: [] };
  let callbackEventTriggered = null;
  let allowMovement = true;
  let playerDebounce;

  function stopAllMovement() {
    allowMovement = false;
    observeItems.enemies.forEach((enemy) => {
      enemy.stopStrategy();
    });
  }
  function playerHelper(player) {
    let enemiesTimeout;
    observeItems.player = player;
    player
      .onEnteredEnemyTerritory(() => {
        if (!allowMovement) return;
        notify(EVENTS_NAMES.ENTERED_ENEMY_TERRITORY);
      })
      .onMoveEnded(() => {
        if (!allowMovement) return;
        if (enemiesTimeout) clearTimeout(enemiesTimeout);
        enemiesTimeout = setTimeout(itemsReadyToMove, ENEMIES_SEARCH_PLAYER_DEBOUNCE);
      })
      .onMove((moveDirection) => {
        if (!allowMovement) return;
        notify(EVENTS_NAMES.PLAYER_WANTS_TO_MOVE, {
          item: player,
          direction: moveDirection,
        });
      });
  }

  function enemyHelper(enemy) {
    const cloneMatrix = cleanMatrix.map((x) => x);
    observeItems.enemies.push(enemy);

    if (ENEMY_STRATEGY_ENABLED) {
      enemy.setStrategy(EnemyStrategy, cloneMatrix);
    }

    enemy
      .onCaughtPlayer(() => {
        if (!allowMovement) return;
        notify(EVENTS_NAMES.CAUGHT_PLAYER);
      })
      .onMove(function (moveDirection) {
        if (!allowMovement) return;
        notify(EVENTS_NAMES.ENEMY_WANTS_TO_MOVE, {
          item: enemy,
          direction: moveDirection,
        });
      });
  }
  function setItemMovement(item) {
    if (item.type === "player") {
      playerHelper(item);
    } else if (item.type === "enemy") {
      enemyHelper(item);
    }
  }

  function itemsReadyToMove() {
    observeItems.enemies.forEach((enemy) => {
      enemy.stopStrategy().startStrategy(observeItems.player);
    });
  }

  let isMoving = false;
  let lastIsPressRepeat = null;
  function onKeydownPressed(key, isPressRepeat) {
    if (isPressRepeat === lastIsPressRepeat && isMoving) {
      return;
    }

    const direction = KEY_TO_DIRECTION[key];

    lastIsPressRepeat = isPressRepeat;
    isMoving = true;

    if (!isPressRepeat) {
      observeItems.player.move(direction);
      return;
    }

    // This line is to compensate a bit for the JS long press lage
    observeItems.player.move(direction);
    playerDebounce = setInterval(() => {
      observeItems.player.move(direction);
    }, PLAYER_DEBOUNCE);
  }

  function getEventsCallbacks() {
    return {
      keyup(e) {
        if (!VALID_KEYS.includes(e.key) || !allowMovement) {
          return;
        }

        lastIsPressRepeat = null;
        isMoving = false;
        if (playerDebounce) clearInterval(playerDebounce);
      },
      keydown(e) {
        if (!VALID_KEYS.includes(e.key) || !allowMovement) {
          return;
        }
        console.log(e.key, "down");

        onKeydownPressed(e.key, e.repeat);
      },
    };
  }

  function notify(eventName, eventData) {
    callbackEventTriggered.call(callbackEventTriggered, eventName, eventData);
  }

  return {
    getEventsCallbacks,
    itemsReadyToMove,
    setItemMovement,
    stopAllMovement,
    onEvent(callback) {
      if (typeof callback === "function") {
        callbackEventTriggered = callback;
      }
      return this;
    },
  };
}
