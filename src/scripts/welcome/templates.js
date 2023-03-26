import { APP_NAME, COLLECTABLE_TYPES_VALUES, ENEMIES_ICONS, NOT_REQUIRED_COLLECTABLE_TYPES } from "../app_settings";
import { getEnemyTemplate, ITEM_TEMPLATES, removeItemTemplateOpacity, setItemTemplateToPositionRelative } from "../items_templates";

export function getWelcomeContainerTemplate() {
  return '<div id="welcome" class="d-flex flex-d-column flex-center main-color"></div>';
}

export function getFirstScreenTemplate() {
  let enemies = "";
  let badCollectables = "";
  let goodCollectables = "";

  ENEMIES_ICONS.forEach((src) => {
    const element = itemTemplateHelper(getEnemyTemplate(src));
    element.style.position = "relative";
    enemies += element.outerHTML;
  });

  Object.keys(COLLECTABLE_TYPES_VALUES).forEach((collectableType) => {
    const element = itemTemplateHelper(ITEM_TEMPLATES.collectable(null, collectableType));
    if (NOT_REQUIRED_COLLECTABLE_TYPES.includes(collectableType)) {
      badCollectables += element.outerHTML;
    } else {
      goodCollectables += element.outerHTML;
    }
  });

  return `<h1>Welcome to ${APP_NAME}!</h1>
  <h2 class="mt-2">Some information before starting the game:</h2>
  <h3 class="mt-2">Good collectables:</h3>
  <div class="d-flex flex-d-row">${goodCollectables}</div>
  <h3 class="mt-2">Bad collectables:</h3>
  <div class="d-flex flex-d-row">${badCollectables}</div>
  <h3 class="mt-2">Avoid those devils:</h3>
  <div class="d-flex flex-d-row">${enemies}</div>
  <div class="d-flex flex-d-row flex-gap-1 mt-2">
  <button class='btn mt-2' data-next-step>Got it</button>
  </div>`;
}

export function getSecondScreenTemplate() {
  let buttons = "";
  ["left", "up", "down", "right"].forEach((direction) => {
    buttons += `<button class="key-${direction}"><i class="keyboard arrow ${direction}"></i></button>`;
  });

  return `<h1>Try the demo!</h1>
  <h3>Type on the arrow buttons on your keyboard to move the character</h3>
  <div class="keyboard arrows-demo mt-2">${buttons}</div>
  <div id='game_demo' class='mt-2 w-100'></div>
  <div class='d-none mt-2'><button class='btn' data-next-step>Next</button></div>`;
}

function itemTemplateHelper(element) {
  removeItemTemplateOpacity(element);
  setItemTemplateToPositionRelative(element);
  return element;
}

export function getThirdScreenTemplate() {
  return `<h2>Well done!</h2>
  <div class="flex-center flex-d-column" data-delay-display>
  <h2>Let's collect yummy food</h2>
    <div class="d-flex flex-d-row flex-gap-1 mt-2">
    <button class='btn' data-next-step>Yes!</button>
    <button class='btn' data-dont-want-to-play>No</button>
    </div>
  </div>`;
}
