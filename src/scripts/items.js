import { COLLECTABLE_TYPES, COLLECTABLE_TYPES_VALUES } from "./app_settings";

function AbstractItem() {
  this.type = null;
  this.canCollect = false;
  this.isCollectable = false;
  this._location = { row: 0, column: 0 };
  this._cssMiddleValues = { width: -1, height: -1 };
  this._element = null;

  this.getMiddleValues = function () {
    return this._cssMiddleValues;
  };
  this.setMiddleValues = function (cssMiddleValues) {
    this._cssMiddleValues = cssMiddleValues;
    return this;
  };
  this.getDomElement = function () {
    return this._element;
  };
  this.attachDomElement = function (element) {
    this._element = element;
    return this;
  };
  this.detachDomElement = function () {
    this._element = null;
    return this;
  };
  this.getLocation = function () {
    return this._location;
  };
  this.randomLocation = function (boardSettings) {
    const { ROWS, COLUMNS } = boardSettings;
    this._location = { row: Math.floor(Math.random() * ROWS), column: Math.floor(Math.random() * COLUMNS) };
    return this;
  };
  this.setLocation = function (location) {
    this._location = location;
    return this;
  };
}

function AbstractMobileItem() {
  AbstractItem.call(this);
  // this._id = id;
  this.type = "mobile";
  this._isMoving = false;
  this._callbacks = { move: null, moveEnded: null };
  this.onMoveEnded = function (callback) {
    this._callbacks.moveEnded = callback;
    return this;
  };
  this.isMoving = function () {
    return this._isMoving;
  };
  this.onMove = function (callback) {
    this._callbacks.move = callback;
    return this;
  };
  this.stoppedMoving = function () {
    this._isMoving = false;
    this._callbacks.moveEnded?.call(this);
    return this;
  };
  this.move = function (moveDirection) {
    this._isMoving = true;
    this._callbacks.move.call(this, moveDirection);
    return this;
  };
}
AbstractMobileItem.prototype = Object.create(AbstractItem.prototype, {
  constructor: {
    value: AbstractMobileItem,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

export function Collectable(id, settings) {
  let callbacks = { collected: null };
  settings = { ...COLLECTABLE_TYPES_VALUES[COLLECTABLE_TYPES.REGULAR], ...settings };

  function ItemCollectable() {
    AbstractItem.call(this);
    this._id = id;
    this.type = "collectable";
    this.subType = settings.subType ?? COLLECTABLE_TYPES.REGULAR;
    this.isCollectable = true;
    this.value = settings.value;
    this.onCollected = function (callback) {
      callbacks.collected = callback;
      return this;
    };
    this.collected = function () {
      callbacks.collected.call(callbacks.collected, {
        id: this._id,
        value: this.value,
        subType: this.subType,
      });
      return this;
    };
  }
  ItemCollectable.prototype = Object.create(AbstractItem.prototype, {
    constructor: {
      value: ItemCollectable,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  return new ItemCollectable();
}

export function Player() {
  function ItemPlayer() {
    AbstractMobileItem.call(this);
    this.type = "player";
    this.canCollect = true;
    this._callbacks.enteredEnemyTerritory = null;

    this.onEnteredEnemyTerritory = function (callback) {
      this._callbacks.enteredEnemyTerritory = callback;
      return this;
    };
    this.enteredEnemyTerritory = function () {
      this._callbacks.enteredEnemyTerritory.call(this._callbacks.enteredEnemyTerritory);
      return this;
    };
  }
  ItemPlayer.prototype = Object.create(AbstractMobileItem.prototype, {
    constructor: {
      value: ItemPlayer,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });

  return new ItemPlayer();
}

export function Enemy() {
  function ItemEnemy() {
    AbstractMobileItem.call(this);
    this.type = "enemy";
    this._callbacks.caughtPlayer = null;
    this._strategy = null;

    this.setStrategy = function (strategy, cleanMatrix) {
      this._strategy = new strategy(this, cleanMatrix);
      return this;
    };
    this.startStrategy = function (...params) {
      this._strategy?.start.apply(this._strategy, params);
      return this;
    };
    this.stopStrategy = function () {
      this._strategy?.stop?.call(this._strategy);
      return this;
    };
    this.onCaughtPlayer = function (callback) {
      this._callbacks.caughtPlayer = callback;
      return this;
    };
    this.caughtPlayer = function () {
      this._callbacks.caughtPlayer.call(this._callbacks.caughtPlayer);
      return this;
    };
  }
  ItemEnemy.prototype = Object.create(AbstractMobileItem.prototype, {
    constructor: {
      value: ItemEnemy,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  return new ItemEnemy();
}
