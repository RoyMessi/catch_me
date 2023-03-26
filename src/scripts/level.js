import {
  EVENTS_NAMES,
  APP_ENVS,
  APP_ENV,
  PLAYER_CAN_COLLECT_ENABLED,
  WAIT_BEFORE_REMOVE_FROM_DOM,
} from "./app_settings";

import Board from "./board";
import { getLevelCompletedUI, getLevelFailedUI } from "./templates";
import ItemsFactory from "./items_factory";

export default function Level(gameElement, num, levelData) {
  const currentLevel = levelData;
  const board = new Board(currentLevel.boardSettings);
  const itemsFactory = new ItemsFactory(currentLevel, board.getCleanMatrix());

  let callbacks = { listener: null, ready: null, tests: null };
  let reportedValues = { collectables: 0 };
  let isLevelRunning = true;

  board
    .onNotify((action, data) => {
      return new Promise((resolve, reject) => {
        if (action === EVENTS_NAMES.APPEND_ELEMENT_TO_GAME) {
          gameElement.append(data);
          resolve();
        } else if (action === EVENTS_NAMES.APPEND_STRING_AS_DOM_TO_THE_END_OF_GAME) {
          gameElement.append(data);
          resolve(data);
        } else if (action === EVENTS_NAMES.REMOVE_ELEMENT_BY_LOCATION) {
          if (
            PLAYER_CAN_COLLECT_ENABLED &&
            data.oldItem.canCollect &&
            typeof data.currentItem?.collected === "function"
          ) {
            setTimeout(() => {
              data.currentItem.collected().getDomElement().remove();
              data.currentItem.detachDomElement();
            }, WAIT_BEFORE_REMOVE_FROM_DOM);
          }
        } else {
          reject();
        }
      });
    })
    .draw();

  function notify(eventName, eventValus) {
    callbacks.listener.call(callbacks.listener, eventName, eventValus);
    return this;
  }
  function listener(callback) {
    callbacks.listener = callback;
    return this;
  }
  function onReady(callback) {
    callbacks.ready = callback;
    return this;
  }
  function setTests(callback) {
    if (APP_ENV === APP_ENVS.TEST) {
      callbacks.tests = callback;
    }
    return this;
  }

  function levelReady() {
    itemsFactory.displayItems();
    if (typeof callbacks.ready === "function") {
      callbacks.ready.call(callbacks.ready, currentLevel);
    }

    if (typeof callbacks.tests === "function") {
      // callbacks.tests.call(callbacks.tests, num, items);
    }
  }

  function stopLevel() {
    isLevelRunning = false;
    itemsFactory.stopAllMovement();
    notify(EVENTS_NAMES.LEVEL_STOPPED, {
      nativeEventsNames: itemsFactory.getNativeEventsNames(),
    });
  }

  function levelFailed(reason) {
    if (!isLevelRunning) {
      return false;
    }

    stopLevel();
    gameElement.insertAdjacentHTML("beforeend", getLevelFailedUI());
    gameElement
      .querySelector("#level_status button")
      .addEventListener("click", () => notify(EVENTS_NAMES.RELOAD_CURRENT_LEVEL), { once: true });
    console.info("Level", "failed:", reason);
  }

  function levelCompleted() {
    if (!isLevelRunning) {
      return false;
    }

    stopLevel();
    gameElement.insertAdjacentHTML("beforeend", getLevelCompletedUI());
  }

  function tearDown() {
    stopLevel();
    board.tearDown();
    gameElement.querySelectorAll(".immobile,.mobile,#level_status").forEach((elem) => elem.remove());
  }

  function start() {
    itemsFactory
      .onRequstToDrawOnBoard(board.addItem)
      .onRequstToDisplayItem(board.displayItem)
      .onItemsReady((data) => {
        notify(EVENTS_NAMES.LEVEL_STATISTICS, data.statistics);
        notify(EVENTS_NAMES.EVENTS_CALLBACKS, data.eventsCallbacks);
      })
      .onEvent((data) => {
        if ([EVENTS_NAMES.PLAYER_WANTS_TO_MOVE, EVENTS_NAMES.ENEMY_WANTS_TO_MOVE].includes(data.eventName)) {
          board.moveItem.call(board.moveItem, data.eventData.item, data.eventData.direction);
        } else if (
          [EVENTS_NAMES.BAD_COLLECTABLE_COLLECTED, EVENTS_NAMES.COLLECTABLE_COLLECTED].includes(data.eventName)
        ) {
          reportedValues.collectables += data.eventData.value;
          notify(data.eventName, data.eventData);
        } else {
          notify(data.eventName, data.eventData);
        }
      })
      .loadItems();

    // Let the level to build and then call ready
    setTimeout(levelReady, 0);
  }

  return {
    number: num,
    type: levelData.type,
    start,
    onReady,
    listener,
    getReportedValues() {
      return reportedValues;
    },
    onWindowResize: () => {
      board.onWindowResize();
      itemsFactory.forEach(board.updateCssTopAndLeft);
    },
    tearDown,
    failed: levelFailed,
    completed: levelCompleted,
    tests: setTests,
  };
}
