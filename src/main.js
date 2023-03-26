import "./styles/main.css";

const localStorageKey = "__SHOW_WELCOME_PAGE__";
const appElement = document.querySelector("#app");

let showWelcomePage = localStorage.getItem(localStorageKey);
showWelcomePage = showWelcomePage === null;

async function initGame() {
  const Game = await (await import("./scripts/game")).default;
  new Game(appElement).start().setWindowResizeObserver();
}

(async (showWelcomePage) => {
  if (!showWelcomePage) {
    initGame();
  } else {
    const Welcome = await (await import("./scripts/welcome/index")).default;
    new Welcome(appElement).start().onStartTheGame(() => {
      localStorage.setItem(localStorageKey, false);
      initGame();
    });
  }
})(showWelcomePage);
