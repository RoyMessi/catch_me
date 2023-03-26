import Game from "../game";
import { EVENTS_NAMES, KEY_TO_DIRECTION, VALID_KEYS } from "../app_settings";
import {
  getFirstScreenTemplate,
  getSecondScreenTemplate,
  getThirdScreenTemplate,
  getWelcomeContainerTemplate,
} from "./templates";
import { LEVELS } from "../levels_settings/env_settings/welcome";

function getFirstScreen(containerElem, next) {
  containerElem.insertAdjacentHTML("afterbegin", getFirstScreenTemplate());

  return {
    setup() {
      containerElem.querySelector("[data-next-step]").addEventListener("click", next, { once: true });
    },
    tearDown() {
      containerElem.querySelector("[data-next-step]").removeEventListener("click", next, { once: true });
    },
  };
}

function getSecondScreen(containerElem, next) {
  containerElem.insertAdjacentHTML("afterbegin", getSecondScreenTemplate());
  const keyboardElem = document.querySelector(".keyboard.arrows-demo");
  const btnNext = containerElem.querySelector("[data-next-step]");
  const gameInstance = new Game(containerElem.querySelector("#game_demo"), LEVELS);

  let currentKey;
  let currentKeyElem;

  function cleanOldActiveKey() {
    currentKeyElem?.classList.remove("active");
  }

  function onKeydown(e) {
    if (!VALID_KEYS.includes(e.key)) {
      return;
    }
    cleanOldActiveKey();
    currentKey = `.key-${KEY_TO_DIRECTION[e.key]}`;
    currentKeyElem = keyboardElem.querySelector(currentKey);
    currentKeyElem.classList.add("active");
  }
  function onKeyup(e) {
    if (!VALID_KEYS.includes(e.key)) {
      return;
    }
    cleanOldActiveKey();
  }

  return {
    setup() {
      document.addEventListener("keydown", onKeydown);
      document.addEventListener("keyup", onKeyup);
      btnNext.addEventListener("click", next, { once: true });
      gameInstance
        .noHeader()
        .toggleStatistics(false)
        .toggleSounds(false)
        .setObserver((res) => {
          if (res.eventName === EVENTS_NAMES.NO_MORE_COLLECTABLES) {
            next();
          }
        })
        .setWindowResizeObserver()
        .start();
    },
    tearDown() {
      gameInstance.tearDown();
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onkeyup);
    },
  };
}

function getThirdScreen(containerElem, next) {
  containerElem.insertAdjacentHTML("afterbegin", getThirdScreenTemplate());

  function dontWantToPlay() {
    if (confirm("Window will close.\nAre you sure you don't want to try the game?")) {
      window.close();
    }
  }

  return {
    setup() {
      containerElem.querySelector("[data-dont-want-to-play]").addEventListener("click", dontWantToPlay);
      containerElem.querySelector("[data-next-step]").addEventListener("click", next, { once: true });
    },
    tearDown() {
      containerElem.querySelector("[data-dont-want-to-play]").removeEventListener("click", dontWantToPlay);
      containerElem.querySelector("[data-next-step]").removeEventListener("click", next, { once: true });
    },
  };
}

const screens = [getFirstScreen, getSecondScreen, getThirdScreen];

export default function Welcome(appElement) {
  let stepContainerElem;
  let currentStep = 1;
  let currentScreen;
  let callbackStartTheGame;

  function next() {
    currentStep++;
    currentScreen.tearDown();
    clearStepContainer();
    setupScreen();
  }

  function setupScreen() {
    if (typeof screens[currentStep - 1] === "function") {
      currentScreen = screens[currentStep - 1](stepContainerElem, next);
      currentScreen.setup();
    } else {
      tearDown();
      callbackStartTheGame();
    }
  }

  function onStartTheGame(callback) {
    callbackStartTheGame = callback;
  }

  function start() {
    document.body.classList.add("welcome-page");
    appElement.insertAdjacentHTML("afterbegin", getWelcomeContainerTemplate());
    stepContainerElem = appElement.firstChild;
    setupScreen();
    return this;
  }

  function clearStepContainer() {
    stepContainerElem.innerHTML = "";
  }

  function tearDown() {
    document.body.classList.remove("welcome-page");
    appElement.innerHTML = "";
    return this;
  }

  return { start, tearDown, onStartTheGame };
}
