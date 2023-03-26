import { APP_SAVE_TO_SESSION } from "./app_settings";

const DB = (() => {
  const DB_KEY = "game";

  function get() {
    if (!APP_SAVE_TO_SESSION) {
      return {};
    }
    let store = localStorage.getItem(DB_KEY);
    return store ? JSON.parse(store) : {};
  }

  function getData(prop) {
    const store = get();
    return prop in store ? store[prop] : undefined;
  }

  function insertOrUpdate(params) {
    if (!APP_SAVE_TO_SESSION) {
      return;
    }
    let store = get();
    Object.keys(params).forEach((key) => {
      store[key] = params[key];
    });
    localStorage.setItem(DB_KEY, JSON.stringify(store));
  }

  return {
    insertOrUpdate,
    getLevel() {
      return getData("level");
    },
    getScore() {
      return getData("score");
    },
  };
})();

export default DB;
