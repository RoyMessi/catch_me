import {
  EVENTS_NAMES,
  MAX_TRIES_TO_PLACE_AN_ITEM,
  MOBILE_CLASSNAME_PREFIX,
  MOBILE_CSS_DIRECTION_REGEX,
  MOBILE_OLD_CLASSNAME_PREFIX,
  MOBILE_OLD_CSS_DIRECTION_REGEX,
} from "./app_settings";

import { ITEM_TEMPLATES, removeItemTemplateOpacity } from "./items_templates";
import { getBoardTemplate } from "./templates";
import { getNewLocationOnMove } from "./utils/general_util";
import GameMatrix from "./game_matrix";

export default function Board(boardSettings) {
  const boardElement = document.createElement("div");
  const _this = this;
  this.boardCssSettings = {};
  this.notifyCallback;
  this.gameMatrix = new GameMatrix(boardSettings);
  this._cleanMatrix = this.gameMatrix.getNewMatrix();

  this.getCleanMatrix = function () {
    return this._cleanMatrix;
  };

  this.tearDown = function () {
    this.boardCssSettings = {};
    this.notifyCallback = null;
    this.gameMatrix = null;
    boardElement.remove();
  };

  this.onNotify = function (callback) {
    this.notifyCallback = callback;
    this.notifyCallback.bind(this.notifyCallback);
    return this;
  };

  this.notify = function (action, data) {
    return this.notifyCallback.call(this.notifyCallback, action, data);
  };

  this.onWindowResize = function () {
    _this.boardCssSettings = boardElement.getBoundingClientRect();
  };

  this.draw = function () {
    boardElement.className = "board";
    boardElement.innerHTML = getBoardTemplate(boardSettings);
    _this.notify(EVENTS_NAMES.APPEND_ELEMENT_TO_GAME, boardElement);
    _this.boardCssSettings = boardElement.getBoundingClientRect();
    return this;
  };

  this.addItem = function (item, tries = 0) {
    const { row, column } = item.getLocation();
    // We only want to place item on a free space
    if (_this.gameMatrix.getValue(row, column)) {
      if (tries < MAX_TRIES_TO_PLACE_AN_ITEM) {
        _this.addItem(item, ++tries);
      } else {
        console.error("Failed to place item on board", item);
      }
      return;
    }

    _this.gameMatrix.setValue(row, column, item);
    insertToDom(row, column, item);
  };

  this.moveItem = function (item, moveDirection) {
    return new Promise((resolve, reject) => {
      const currentLocation = item.getLocation();
      const newLocation = getNewLocationOnMove(boardSettings, currentLocation, moveDirection);
      if (_this.gameMatrix.isColumnBlock(newLocation.row, newLocation.column)) {
        updateItemCssClassDirection(item, moveDirection);
        item.stoppedMoving();
        reject("Encounter block");
        return;
      }

      item.setLocation(newLocation);
      removeItem(currentLocation, newLocation, item);
      _this.gameMatrix.setValue(newLocation.row, newLocation.column, item);
      moveElementOnBoard(item, moveDirection);
      item.stoppedMoving();
      resolve();
      _this.checkIsPlayerCaught(item);
    });
  };

  this.checkIsPlayerCaught = function (item) {
    if (!_this.gameMatrix.isPlayerCaught(item)) {
      return;
    }

    if (typeof item.caughtPlayer === "function") {
      item.caughtPlayer();
    } else {
      item.enteredEnemyTerritory();
    }
  };

  this.displayItem = function (item) {
    removeItemTemplateOpacity(item.getDomElement());
  };

  this.updateCssTopAndLeft = function (item) {
    const location = item.getLocation();
    const { top, left } = getColumnMiddlePosition(location.row, location.column);
    const itemElem = item.getDomElement();
    const cssMiddleValues = item.getMiddleValues();

    const l = left - cssMiddleValues.width + "px";
    const t = top - cssMiddleValues.height + "px";
    itemElem.style.transform = `translate(${l}, ${t})`;
  };

  function getColumnMiddlePosition(row, column) {
    const columnElement = boardElement.querySelector(
      `[${boardSettings.ATTRIBUTE_DATA_ROW}="${row}"] [${boardSettings.ATTRIBUTE_DATA_COLUMN}="${column}"]`
    );

    const columnCssSettings = columnElement.getBoundingClientRect();
    const top = columnCssSettings.top - _this.boardCssSettings.top + columnCssSettings.height / 2;
    const left = columnCssSettings.left - _this.boardCssSettings.left + columnCssSettings.width / 2;
    return {
      top,
      left,
    };
  }

  async function insertToDom(row, column, item) {
    const { top, left } = getColumnMiddlePosition(row, column);
    if (typeof ITEM_TEMPLATES[item.type] !== "function") {
      return;
    }

    const template = ITEM_TEMPLATES[item.type].call(ITEM_TEMPLATES[item.type], item.type, item?.subType);
    template.style.transform = `translate(${left}px, ${top}px)`;

    const element = await _this.notify(EVENTS_NAMES.APPEND_STRING_AS_DOM_TO_THE_END_OF_GAME, template);
    const domRect = element.getBoundingClientRect();
    const cssMiddleValues = {
      height: domRect.height / 2,
      width: domRect.width / 2,
    };

    const t = top - cssMiddleValues.height + "px";
    const l = left - cssMiddleValues.width + "px";
    element.style.transform = `translate(${l}, ${t})`;

    item.attachDomElement(element).setMiddleValues(cssMiddleValues);
  }

  function updateItemCssClassDirection(item, moveDirection) {
    const itemElem = item.getDomElement();

    let oldDirectionClassName = "";
    let className = itemElem.className;
    className = className
      .replace(MOBILE_CSS_DIRECTION_REGEX, (match) => {
        oldDirectionClassName = MOBILE_OLD_CLASSNAME_PREFIX + match;
        return "";
      })
      .trim();

    className = className.replace(MOBILE_OLD_CSS_DIRECTION_REGEX, "").trim();

    itemElem.className = className;
    if (oldDirectionClassName && oldDirectionClassName !== MOBILE_OLD_CLASSNAME_PREFIX) {
      itemElem.classList.add(oldDirectionClassName);
    }
    itemElem.classList.add(MOBILE_CLASSNAME_PREFIX + moveDirection);
  }

  function moveElementOnBoard(item, moveDirection) {
    _this.updateCssTopAndLeft(item);
    updateItemCssClassDirection(item, moveDirection);
  }

  function removeItem(currentLocation, newLocation, item) {
    removeElementByLocationOnMatrix(newLocation, item);
    const itemOnNewLocation = _this.gameMatrix.getValue(newLocation.row, newLocation.column);

    if (itemOnNewLocation?.isCollectable && item?.canCollect) {
      _this.gameMatrix.removeValue(newLocation.row, newLocation.column, itemOnNewLocation);
    }

    _this.gameMatrix.removeValue(currentLocation.row, currentLocation.column, item);
  }

  function removeElementByLocationOnMatrix(newLocation, item) {
    if (_this.gameMatrix.isColumnBlock(newLocation.row, newLocation.column)) {
      return;
    }

    const currentItem = _this.gameMatrix.getValue(newLocation.row, newLocation.column);
    _this.notify(EVENTS_NAMES.REMOVE_ELEMENT_BY_LOCATION, { oldItem: item, currentItem });
  }
}
