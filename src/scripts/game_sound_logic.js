import {
  APP_SOUND_COLLECTABLES_ENABLED,
  APP_SOUND_ENABLED,
  APP_SOUND_LEVEL_ENABLED,
  AUDIOS,
  LEVEL_TYPES,
} from "./app_settings";
import GameAudio from "./game_audio";

export default function GameSoundLogic() {
  let backgroundSound;
  const soundsControllers = {
    all_game_sounds: APP_SOUND_ENABLED,
    collectables_sounds: APP_SOUND_COLLECTABLES_ENABLED,
    level_sounds: APP_SOUND_LEVEL_ENABLED,
  };

  function initOrUpdateGameSound(sourceKey) {
    if (!backgroundSound) {
      backgroundSound = new GameAudio(sourceKey);
    } else {
      backgroundSound.updateResource(sourceKey);
    }

    if (soundsControllers.all_game_sounds && soundsControllers.level_sounds) {
      backgroundSound.play();
    }
  }

  return {
    activeBackgroundSound(levelType) {
      const sourceKey = [LEVEL_TYPES.MEDIUM, LEVEL_TYPES.HARD].includes(levelType)
        ? AUDIOS.HARD_LEVEL_BACKGROUND
        : AUDIOS.DEFAULT_BACKGROUND;

      initOrUpdateGameSound(sourceKey);
    },
    updateBackgroundSound() {},
    playBackgroundSound(sourceKey) {
      if (!backgroundSound) {
        backgroundSound = new GameAudio(sourceKey);
      } else {
        backgroundSound.updateResource(sourceKey);
      }

      if (soundsControllers.all_game_sounds && soundsControllers.level_sounds) {
        backgroundSound.play();
      }
    },
    playLevelComplete(eventValues, nextLevel) {
      if (!soundsControllers.all_game_sounds || !soundsControllers.level_sounds) {
        nextLevel();
      } else {
        new GameAudio(AUDIOS.LEVEL_COMPLETED, eventValues).onEnded(nextLevel);
      }
    },
    playLevelFailed(eventValues) {
      if (soundsControllers.all_game_sounds && soundsControllers.level_sounds) {
        new GameAudio(AUDIOS.LEVEL_FAILED, eventValues); // ,{ stopAllOtherSounds: true }
      }
    },
    playCollectableCollected(isGoodCollectable) {
      if (soundsControllers.all_game_sounds && soundsControllers.collectables_sounds) {
        const sourceKey = isGoodCollectable ? AUDIOS.COLLECTABLE_COLLECTED : AUDIOS.BAD_COLLECTABLE_COLLECTED;
        new GameAudio(sourceKey); //, eventValues);
      }
    },
    playGameCompleted() {
      initOrUpdateGameSound(AUDIOS.GAME_COMPLETED);
    },
    playLevelNotFound() {
      initOrUpdateGameSound(AUDIOS.LEVEL_NOT_FOUND);
    },
    stopAllSounds() {
      backgroundSound?.stopAllSounds();
    },
    setUIControllers(gameSoundsElement) {
      if (!gameSoundsElement) {
        return;
      }

      gameSoundsElement.querySelectorAll("[type=checkbox]").forEach((element) => {
        element.addEventListener("change", (e) => {
          soundsControllers[e.target.id] = e.target.checked;
          if (e.target.id === "all_game_sounds" || e.target.id === "level_sounds") {
            soundsControllers.all_game_sounds && soundsControllers.level_sounds
              ? backgroundSound?.play()
              : backgroundSound?.stop();
          }
        });
      });
    },
  };
}
