import { getRandomString } from "./general_util";

const DEFAULT_SETTINGS = {
  src: "",
  volume: 0.2,
  autoplay: false,
  loop: false,
};

const HELPERS_SETTINGS = {
  allowToPlay: true,
  stopAllOtherSounds: false,
  duration: 0,
  dontUpdateOnMatchSrouce: false,
  // pauseWhenOtherSoundPlay: true,
};

let audios = [];
export default function AudioUtil(settings, callback) {
  this.id = getRandomString();
  this.audioSettings = { ...DEFAULT_SETTINGS };
  this.helpersSettings = { ...HELPERS_SETTINGS };
  this.observers = { ended: null };
  this.audio = new Audio();
  this.audio.addEventListener("ended", (e) => {
    this.observers.ended?.call(this.observer, e.type);
    if (!e.target.loop) {
      audios = audios.filter((audio) => audio.id !== this.id);
      this.observers.ended = null;
    } else {
      e.target.currentTime = 0;
      e.target.play();
    }
  });

  function init(settings) {
    Object.keys(HELPERS_SETTINGS).forEach((key) => {
      this.helpersSettings[key] = settings[key] ?? HELPERS_SETTINGS[key];
    });

    if (this.helpersSettings.stopAllOtherSounds) {
      stopAllSounds();
    }

    Object.keys(DEFAULT_SETTINGS).forEach((prop) => {
      this.audioSettings[prop] = settings[prop] ?? DEFAULT_SETTINGS[prop];
      if (prop === "autoplay" && !this.helpersSettings.allowToPlay) {
        this.audioSettings[prop] = false;
      }
      this.audio[prop] = this.audioSettings[prop];
    });

    if (this.helpersSettings.duration > 0) {
      this.audio.addEventListener("timeupdate", onTimeUpdated.bind(this));
    }

    audios.push({ id: this.id, audio: this.audio });

    if (this.audioSettings.autoplay) {
      play.call(this);
    }
  }

  function onTimeUpdated(e) {
    if (e.target.currentTime >= this.helpersSettings.duration) {
      this.audio.pause();
      this.audio.removeEventListener("timeupdate", onTimeUpdated);
      this.audio.dispatchEvent(new Event("ended"));
    }
  }

  function play() {
    if (!this.helpersSettings.allowToPlay) {
      return;
    }

    this.audio.play().then(() => {
      if (typeof callback === "function") {
        callback.call(callback);
      }
    });
  }

  function pause() {
    this.audio.pause();
  }

  function stop() {
    pause.call(this);
    this.audio.currentTime = 0;
  }

  function updateResource(newSettings) {
    const dontUpdateOnMatch = newSettings?.dontUpdateOnMatchSrouce;
    if (!dontUpdateOnMatch || (dontUpdateOnMatch && this.audioSettings.src !== newSettings.src)) {
      stop.call(this);
      init.call(this, newSettings);
    }
  }

  function stopAllSounds() {
    audios.forEach((audioInstance) => {
      audioInstance.audio.pause();
      audioInstance.audio.currentTime = 0;
    });
    audios.splice(0, audios.length);
  }

  function onEnded(callback) {
    if (typeof callback === "function") {
      this.observers.ended = callback;
    }
  }

  init.call(this, settings);

  return {
    play: play.bind(this),
    updateResource: updateResource.bind(this),
    pause: pause.bind(this),
    stop: stop.bind(this),
    stopAllSounds,
    onEnded: onEnded.bind(this),
  };
}
