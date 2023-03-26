import { AUDIOS_DIRECTORY, AUDIOS_SETTINGS, APP_SOUND_ENABLED } from "./app_settings";
import AudioUtil from "./utils/audio_util";

export default function GameAudio(audioKey, extraData) {
  let audioSettings;
  let audioUtil;

  init(audioKey);

  function init(audioKey) {
    audioSettings = AUDIOS_SETTINGS[audioKey];
    audioSettings = { ...audioSettings, ...{ src: AUDIOS_DIRECTORY + audioSettings.src } };

    if (audioUtil) {
      return;
    }

    audioUtil = new AudioUtil(audioSettings, () => {
      console.log("Audio playing/played");
    });
  }

  return {
    ...audioUtil,
    updateResource: (newAudioKey) => {
      init(newAudioKey);
      audioUtil.updateResource.call(audioUtil, audioSettings);
    },
  };
}
