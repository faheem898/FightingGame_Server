"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const Constant_1 = require("../Constant");
const GameManager_1 = require("./Manager/GameManager");
const PlayerManager_1 = require("./Manager/PlayerManager");
class GameState {
    constructor() {
        this.playerManager = null;
        this.gameManager = null;
        this.totalClientsConnected = 0;
        this.gameState = Constant_1.GAMESTATE.IDEAL;
        this.initilizeGameState();
    }
    initilizeGameState() {
        this.playerManager = new PlayerManager_1.PlayerManager();
        this.gameManager = new GameManager_1.GameManager();
    }
}
exports.GameState = GameState;
