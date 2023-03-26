import { Collectable, Enemy, Player } from "./items";
import {
  LOAD_ALL_ITEMS,
  LOAD_COLLECTABLE_ITEMS,
  LOAD_ENEMIES_ITEMS,
  LOAD_PLAYER_ITEMS,
  EVENTS_NAMES,
  NOT_REQUIRED_COLLECTABLE_TYPES,
} from "./app_settings";
import ItemsMovenemtOnBoard from "./items_movement_on_board";

const ACTIONS = {
  DROW_ON_BOARD: "drawOnBoard",
  ITEMS_READY: "itemsReady",
  DISPLAY_ITEM: "displayItem",
  EVENT_TRIGGERED: "eventTriggered",
};

export default function ItemsFactory(currentLevel, cleanMatrix) {
  let itemsMovenemtOnBoard = new ItemsMovenemtOnBoard(cleanMatrix);
  let statistics = { collectables: 0, enemies: 0 };
  let collectables = { required: 0, notRequired: 0 };
  let items = { collectables: [], player: null, enemies: [] };
  let callbacks = {
    [ACTIONS.DROW_ON_BOARD]: null,
    [ACTIONS.ITEMS_READY]: null,
    [ACTIONS.DISPLAY_ITEM]: null,
    [ACTIONS.EVENT_TRIGGERED]: null,
  };

  function setItemLocation(item, settings) {
    if (settings && "location" in settings) {
      item.setLocation(settings.location);
    } else {
      item.randomLocation(currentLevel.boardSettings);
    }
  }

  function onCollectableBuild(subType) {
    if (NOT_REQUIRED_COLLECTABLE_TYPES.includes(subType)) {
      collectables.notRequired += 1;
    } else {
      collectables.required += 1;
    }
  }

  function onCollectableCollected(subType) {
    if (NOT_REQUIRED_COLLECTABLE_TYPES.includes(subType)) {
      collectables.notRequired -= 1;
    } else {
      collectables.required -= 1;
    }
  }

  function buildCollectable(collectableSettings, index) {
    const collectable = new Collectable(index, collectableSettings);
    setItemLocation(collectable, collectableSettings);
    notify(ACTIONS.DROW_ON_BOARD, collectable);
    onCollectableBuild(collectable.subType);

    collectable.onCollected((collectableData) => {
      onCollectableCollected(collectableData.subType);
      delete items.collectables[collectableData.id];

      const eventName = NOT_REQUIRED_COLLECTABLE_TYPES.includes(collectable.subType)
        ? EVENTS_NAMES.BAD_COLLECTABLE_COLLECTED
        : EVENTS_NAMES.COLLECTABLE_COLLECTED;
      notify(ACTIONS.EVENT_TRIGGERED, {
        eventName: eventName,
        eventData: collectableData,
      });

      if (collectables.required === 0) {
        notify(ACTIONS.EVENT_TRIGGERED, { eventName: EVENTS_NAMES.NO_MORE_COLLECTABLES });
      }
    });
    items.collectables[index] = collectable;
  }

  function buildEnemy(enemiesSettings) {
    const enemy = new Enemy();
    itemsMovenemtOnBoard.setItemMovement(enemy);
    setItemLocation(enemy, enemiesSettings);
    notify(ACTIONS.DROW_ON_BOARD, enemy);
    items.enemies.push(enemy);
  }

  function loadCollectables() {
    if (!LOAD_COLLECTABLE_ITEMS || !currentLevel.collectables) {
      return;
    }

    if (typeof currentLevel.collectables === "number") {
      for (let index = 0; index < currentLevel.collectables; index++) {
        buildCollectable(null, index);
      }
    } else {
      currentLevel.collectables.forEach(buildCollectable);
    }
    statistics.collectables = collectables.required;
  }

  function loadPlayer() {
    if (!LOAD_PLAYER_ITEMS) {
      return;
    }

    const player = new Player();
    itemsMovenemtOnBoard.setItemMovement(player);
    setItemLocation(player, currentLevel.player);
    notify(ACTIONS.DROW_ON_BOARD, player);
    items.player = player;
  }

  function loadEnemies() {
    if (!LOAD_ENEMIES_ITEMS && !currentLevel.enemies) {
      return;
    }

    if (typeof currentLevel.enemies === "number") {
      for (let index = 0; index < currentLevel.enemies; index++) {
        buildEnemy(null, index);
      }
      statistics.enemies = currentLevel.enemies;
    } else {
      currentLevel.enemies.forEach(buildEnemy);
      statistics.enemies = currentLevel.enemies.length;
    }
  }

  function loadItems() {
    if (!LOAD_ALL_ITEMS) {
      return;
    }

    loadCollectables();
    loadPlayer();
    loadEnemies();
    notify(ACTIONS.ITEMS_READY, {
      statistics,
      eventsCallbacks: itemsMovenemtOnBoard.getEventsCallbacks(),
    });
    itemsMovenemtOnBoard.onEvent((eventName, eventData) => {
      notify(ACTIONS.EVENT_TRIGGERED, { eventName, eventData });
    });
  }

  async function displayItems() {
    forEach((item) => notify(ACTIONS.DISPLAY_ITEM, item));
    await itemsMovenemtOnBoard.itemsReadyToMove();
  }

  function notify(...params) {
    const action = params[0];
    params.splice(0, 1);
    callbacks[action].apply(callbacks[action], params);
  }

  function setCallback(action, callback) {
    if (action in callbacks && typeof callback === "function") {
      callbacks[action] = callback;
    }
  }

  function forEach(callback) {
    [items.player, ...items.enemies, ...items.collectables].forEach((item) => {
      if (item) {
        callback.call(callback, item);
      }
    });
  }

  return {
    loadItems,
    displayItems,
    forEach,
    getNativeEventsNames() {
      return Object.keys(itemsMovenemtOnBoard.getEventsCallbacks());
    },
    stopAllMovement() {
      itemsMovenemtOnBoard.stopAllMovement();

      items.player = null;
      items.collectables.splice(0, items.collectables.length);
      items.enemies.splice(0, items.enemies.length);

      return this;
    },
    onRequstToDrawOnBoard(callback) {
      setCallback(ACTIONS.DROW_ON_BOARD, callback);
      return this;
    },
    onItemsReady(callback) {
      setCallback(ACTIONS.ITEMS_READY, callback);
      return this;
    },
    onRequstToDisplayItem(callback) {
      setCallback(ACTIONS.DISPLAY_ITEM, callback);
      return this;
    },
    onEvent(callback) {
      setCallback(ACTIONS.EVENT_TRIGGERED, callback);
      return this;
    },
  };
}
