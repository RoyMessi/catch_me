import { ENEMY_SPEED, WORKERS_PATH } from "./app_settings";

export default function EnemyStrategy(enemy, cleanMatrix) {
  this.workerFillMatrixByEnemy = null;
  this.workerFindPossibleRoutesToPlayer = null;
  this.stopMoving = false;
  this.enemyRoute = [];
  this.timeout = null;

  function fillMatrix(settings) {
    const _this = this;
    return new Promise((resolve, reject) => {
      // Fill metrix by enemy location
      _this.workerFillMatrixByEnemy = new Worker(`${WORKERS_PATH}/fill_matrix_by_enemy_worker.js`);
      _this.workerFillMatrixByEnemy.postMessage(settings);
      _this.workerFillMatrixByEnemy.onmessage = (e) => {
        _this.workerFillMatrixByEnemy.terminate();
        resolve(e.data.matrix);
      };
    });
  }

  function getRoute(settings) {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.workerFindPossibleRoutesToPlayer = new Worker(`${WORKERS_PATH}/find_possible_routes_to_player_worker.js`);
      _this.workerFindPossibleRoutesToPlayer.postMessage(settings);
      _this.workerFindPossibleRoutesToPlayer.onmessage = async (e2) => {
        _this.workerFindPossibleRoutesToPlayer.terminate();
        const possibleRoutes = e2.data;

        // Get random route, because why to go with the same way in same player/enemy locations
        const randomRouteIndex = Math.floor(Math.random() * possibleRoutes.length);
        const route = possibleRoutes[randomRouteIndex];
        if (!route) {
          console.error({
            route,
            randomRouteIndex,
            possibleRoutes,
          });
          reject("Route not found");
        } else {
          resolve(route);
        }
      };
    });
  }

  async function moveEnemy() {
    const _this = this;
    async function step() {
      return new Promise((resolve, reject) => {
        if (_this.stopMoving) {
          clearTimeout(_this.timeout);
          reject(-1);
          return;
        }
        const direction = _this.enemyRoute[0];
        enemy.move(direction);
        _this.enemyRoute.splice(0, 1);

        _this.timeout = setTimeout(() => {
          resolve(_this.enemyRoute.length > 0);
        }, ENEMY_SPEED);
      });
    }
    while (await step());
  }

  this.start = async function (player) {
    this.stopMoving = false;
    const playerLocation = player.getLocation();
    const enemyLocation = enemy.getLocation();
    const { row: playerRow, column: playerColumn } = playerLocation;
    const { row: enemyRow, column: enemyColumn } = enemyLocation;

    const enemyMatrix = await fillMatrix.call(this, {
      matrix: cleanMatrix,
      playerLocation,
      enemyLocation: [enemyRow, enemyColumn],
    });

    this.enemyRoute = await getRoute.call(this, {
      matrix: enemyMatrix,
      playerLocation: [playerRow, playerColumn],
    });

    if (this.enemyRoute?.error) {
      console.error("error.data", route.error.data);
      throw new Error(route.error.message);
    } else {
      await moveEnemy.call(this);
    }
  };

  this.stop = function () {
    this.stopMoving = true;
    this.enemyRoute.splice(0, this.enemyRoute.length);
    this.workerFillMatrixByEnemy?.terminate();
    this.workerFindPossibleRoutesToPlayer?.terminate();
    if (this.timeout) clearTimeout(this.timeout);
  };
}
