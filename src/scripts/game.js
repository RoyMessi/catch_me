import { APP_ENV, APP_ENVS, DEFAULT_LEVEL_NUMBER, WAIT_BEFORE_NEXT_LEVEL, AUDIOS, EVENTS_NAMES } from "./app_settings";
import Level from "./level";
import DB from "./db";
import { myTests } from "./tests";
import { gameCompletedUI, getGameHeader, getLevelNotFoundUI, getLevelWrapper } from "./templates";
import NativeEventsHandler from "./native_js_listeners";
import GameSoundLogic from "./game_sound_logic";
import GameStatisticsLogic from "./game_statistics_logic";

export default function Game(appElement, forceLevels = null) {
  let level;
  let levelsSettings;
  let forceDefaultLevelNumber = -1;
  let levelWrapperElement;
  let observer = null;
  let nativeEventsHandler = new NativeEventsHandler();
  let gameSoundLogic = new GameSoundLogic();
  let gameStatisticsLogic = new GameStatisticsLogic(appElement);
  let gameUISettings = {
    loadHeader: true,
    loadStatistics: true,
    loadSounds: true,
  };

  const EventsHandlers = {
    [EVENTS_NAMES.COLLECTABLE_COLLECTED]: onCollectable,
    [EVENTS_NAMES.BAD_COLLECTABLE_COLLECTED]: onCollectable,
    [EVENTS_NAMES.EVENTS_CALLBACKS](eventValues) {
      nativeEventsHandler.addMultiple(eventValues);
    },
    [EVENTS_NAMES.LEVEL_STATISTICS](eventValues, eventName) {
      gameStatisticsLogic.setCollectables(eventValues.collectables);
      update(eventName);
    },
    [EVENTS_NAMES.LEVEL_STOPPED](eventValues) {
      nativeEventsHandler.removeByEventNames(eventValues.nativeEventsNames);
    },
    [EVENTS_NAMES.NO_MORE_COLLECTABLES](eventValues) {
      update();
      level.completed();
      gameSoundLogic.playLevelComplete(eventValues, nextLevel);
    },
    [EVENTS_NAMES.CAUGHT_PLAYER]: onFailed,
    [EVENTS_NAMES.ENTERED_ENEMY_TERRITORY]: onFailed,
    [EVENTS_NAMES.RELOAD_CURRENT_LEVEL]: reloadCurrentLevel,
  };

  function onLevelReady() {
    if (DB.getScore()) {
      gameStatisticsLogic.setScore(DB.getScore());
    }

    gameSoundLogic.activeBackgroundSound(level.type);
  }

  function onFailed(eventValues, eventName) {
    gameSoundLogic.playLevelFailed(eventValues);
    level.failed(eventName);
  }

  function onCollectable(eventValues, eventName) {
    gameStatisticsLogic.updateScore(eventValues.value);
    gameStatisticsLogic.onGoodCollectableCollected(eventName);
    gameSoundLogic.playCollectableCollected(eventValues.value > 0);
    checkScore(eventName);
  }

  function update(eventName) {
    let data = {
      collectables: gameStatisticsLogic.getCollectables(),
      level: level.number,
    };

    if (eventName !== "levelStatistics") {
      data.score = gameStatisticsLogic.getScore();
    }

    DB.insertOrUpdate(data);
  }

  function gameStopped(err) {
    if (err === undefined) {
      gameSoundLogic.stopAllSounds();
    } else if (err.message === "-No more levels-") {
      if (levelWrapperElement) {
        gameSoundLogic.playGameCompleted();
        levelWrapperElement.insertAdjacentHTML("beforeend", gameCompletedUI());
      } else {
        console.error("Level wrapper not found");
      }
    } else if (err.message === "Level not found") {
      gameSoundLogic.playLevelNotFound();
      levelWrapperElement.insertAdjacentHTML("beforeend", getLevelNotFoundUI());
    } else {
      console.error(err);
    }
  }

  function guardLevel(nextLevel) {
    if (Object.keys(levelsSettings).length < nextLevel) {
      throw new RangeError("-No more levels-");
    }
    if (typeof levelsSettings[nextLevel] === "undefined") {
      throw new RangeError("Level not found");
    }

    return nextLevel;
  }

  function nextLevel() {
    setTimeout(() => {
      const currentLevelNumber = level.number;
      level.tearDown();
      _Level.start(currentLevelNumber + 1);
    }, WAIT_BEFORE_NEXT_LEVEL);
  }

  function reloadCurrentLevel() {
    gameSoundLogic.stopAllSounds();
    gameStatisticsLogic.onLevelRestart(level.getReportedValues().collectables);

    level.tearDown();
    _Level.start(level.number);
  }

  function checkScore(eventName) {
    if (gameStatisticsLogic.isScoreLessThenZero()) {
      gameSoundLogic.playLevelFailed();
      level.failed(eventName);
    }
  }

  function gameListener(eventName, eventValues) {
    if (typeof EventsHandlers[eventName] === "function") {
      EventsHandlers[eventName].call(EventsHandlers[eventName], eventValues, eventName);
    } else if ([APP_ENVS.TEST, APP_ENVS.DEV].includes(APP_ENV)) {
      console.log(eventName, ...eventValues);
    }

    if (typeof observer === "function") {
      observer.call(observer, { eventName, eventValues });
    }

    gameStatisticsLogic.updateGameUIs(level.number);
  }

  function getLevelNumber(num) {
    if (num) {
      return num;
    }
    if (forceDefaultLevelNumber > 0) {
      return forceDefaultLevelNumber;
    }
    if ((level = DB.getLevel())) {
      return level;
    }
    return DEFAULT_LEVEL_NUMBER;
  }

  const _Level = {
    start(num) {
      num = getLevelNumber(num);
      try {
        guardLevel(num);
      } catch (err) {
        gameStopped(err);
        return;
      }

      level = new Level(levelWrapperElement, num, levelsSettings[num]);
      level.onReady(onLevelReady).listener(gameListener).tests(myTests).start();

      return level;
    },
    onWindowResize() {
      level?.onWindowResize();
    },
    tearDown() {
      level.tearDown();
    },
  };

  async function onGameStart(num) {
    if (!forceLevels) {
      const { LEVELS, FORCE_DEFAULT_LEVEL_NUMBER } = await import(`./levels_settings/env_settings/${APP_ENV}.js`);
      levelsSettings = forceLevels ?? LEVELS;
      forceDefaultLevelNumber = FORCE_DEFAULT_LEVEL_NUMBER;
    } else {
      levelsSettings = forceLevels;
      forceDefaultLevelNumber = -1;
    }

    document.body.classList.add("game-page");
    appElement.insertAdjacentHTML("afterbegin", getGameHeader(gameUISettings) + getLevelWrapper());
    levelWrapperElement = document.querySelector("#level_wrapper");
    _Level.start(num);

    gameSoundLogic.setUIControllers(appElement.querySelector("#game_sounds"));
  }

  return {
    start(num) {
      onGameStart(num);
      return this;
    },
    noHeader() {
      gameUISettings.loadHeader = false;
      return this;
    },
    toggleStatistics(toggle) {
      gameUISettings.loadStatistics = toggle;
      return this;
    },
    toggleSounds(toggle) {
      gameUISettings.loadSounds = toggle;
      return this;
    },
    setObserver(callback) {
      observer = callback;
      return this;
    },
    setWindowResizeObserver() {
      nativeEventsHandler.add("resize", _Level.onWindowResize).add("scroll", _Level.onWindowResize);
      return this;
    },
    tearDown() {
      nativeEventsHandler.removeAll();
      document.body.classList.remove("game-page");
      levelWrapperElement = null;
      appElement.innerHTML = "";
      _Level.tearDown();
    },
  };
}
