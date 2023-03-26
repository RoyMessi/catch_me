const SUPPORTED_NATIVE_EVENTS = ["resize", "scroll", "keyup", "keydown"];

export default function NativeEventsHandler() {
  let subscribers = {};
  let listeners = [];

  function notify(callback, e) {
    callback.call(callback, e);
  }

  function onEventOccurred(e) {
    if (!subscribers[e.type] || subscribers[e.type].length === 0) {
      return;
    }
    subscribers[e.type].forEach((callback) => notify(callback, e));
  }

  function startListener(eventName) {
    if (!listeners.includes(eventName)) {
      window.addEventListener(eventName, onEventOccurred);
    }
  }

  function removeListener(eventName) {
    window.removeEventListener(eventName, onEventOccurred);
  }

  function removeSubscribers(eventName) {
    subscribers[eventName]?.splice(0, subscribers[eventName].length);
    delete subscribers[eventName];
  }

  return {
    addMultiple(obj) {
      Object.keys(obj).forEach((eventName) => {
        if (typeof obj[eventName] === "function") {
          this.add(eventName, obj[eventName]);
        } else {
          throw new Error("Not implemented yet");
        }
      });
    },
    add(eventName, callback) {
      if (!SUPPORTED_NATIVE_EVENTS.includes(eventName)) {
        return;
      }

      if (!subscribers[eventName]) {
        subscribers[eventName] = [];
      }
      subscribers[eventName].push(callback);
      startListener(eventName);
      return this;
    },
    removeEventSubscribers(eventName) {
      removeSubscribers(eventName);
      removeListener(eventName);
      return this;
    },
    removeByEventName(eventName) {
      if (eventName in subscribers) {
        return;
      }
      removeSubscribers(eventName);
      removeListener(eventName);
    },
    removeByEventNames(eventNames) {
      eventNames.forEach(this.removeByEventName);
    },
    removeAll() {
      subscribers = {};
      listeners.forEach((eventName) => {
        removeSubscribers(eventName);
        removeListener(eventName);
      });
    },
  };
}
