import { EVENTS_NAMES } from "./app_settings";

export default function GameStatisticsLogic(appElement) {
  let gameStatistics = {
    level: 0,
    score: 0,
    collectables: 0,
    enemies: 0,
  };

  function updateUI(selector, value) {
    const element = appElement.querySelector(selector);
    if (element) {
      element.innerText = value;
    }
  }

  function updateGameUIs(levelNumber) {
    updateUI("#level_number", levelNumber);
    updateUI("#remains_collectable", gameStatistics.collectables);
    updateUI("#score", gameStatistics.score);
  }

  return {
    updateGameUIs,
    getCollectables() {
      return gameStatistics.collectables;
    },
    getScore() {
      return gameStatistics.score;
    },
    setScore(score) {
      updateUI("#score", score);
    },
    updateScore(score) {
      gameStatistics.score += score;
    },
    isScoreLessThenZero() {
      return gameStatistics.score < 0;
    },
    onLevelRestart(score) {
      gameStatistics.score -= score;
    },
    onGoodCollectableCollected(eventName) {
      if (eventName === EVENTS_NAMES.COLLECTABLE_COLLECTED) {
        --gameStatistics.collectables;
      }
    },
    setCollectables(total) {
      gameStatistics.collectables = total;
    },
  };
}
