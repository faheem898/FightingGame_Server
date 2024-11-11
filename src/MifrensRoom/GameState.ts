import { GAMESTATE } from "../Constant";
import { GameManager } from "./Manager/GameManager";
import { PlayerManager } from "./Manager/PlayerManager";

export class GameState {
    playerManager: PlayerManager |null= null;
    gameManager: GameManager|null = null;
    totalClientsConnected: number = 0;
    gameState: number = GAMESTATE.IDEAL;
    constructor() {
        this.initilizeGameState();
    }

    initilizeGameState() {
        this.playerManager = new PlayerManager();
        this.gameManager = new GameManager();
    }
}