import { COLLECTABLE_TYPES_VALUES, ENEMIES_ICONS } from "./app_settings";

export const ITEM_TEMPLATES = {
  collectable: getCollectableTemplate,
  player: getPlayerTemplate,
  enemy: getRandomEnemyTemplate,
};

function getItemWrapper(cssClass, template) {
  const div = document.createElement("div");
  div.className = `opacity-0 ${cssClass}`;
  div.innerHTML = template;
  return div;
}

export function removeItemTemplateOpacity(element) {
  element.classList.remove("opacity-0");
}

export function setItemTemplateToPositionRelative(element) {
  element.style.position = "relative";
}

export function getEnemyTemplate(src) {
  return getItemWrapper("mobile enemy", getObjectWrapper("enemies/" + src));
}

function getObjectWrapper(fileName) {
  return `<object type="image/svg+xml" data="./src/assets/icons/${fileName}"></object>`;
}

function getCollectableTemplate(_, subType) {
  const _subType = subType.replace(/_/g, "-");
  const cssClass = `immobile collectable collectable-type-${_subType}`;
  return getItemWrapper(cssClass, getObjectWrapper(COLLECTABLE_TYPES_VALUES[subType].src));
}

function getPlayerTemplate() {
  return getItemWrapper("mobile player", getObjectWrapper("player.svg"));
}

function getRandomEnemyTemplate() {
  const iconIndex = Math.floor(Math.random() * ENEMIES_ICONS.length);
  return getEnemyTemplate(ENEMIES_ICONS[iconIndex]);
}
