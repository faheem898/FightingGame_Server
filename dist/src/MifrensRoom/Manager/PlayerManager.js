"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerManager = void 0;
const Player_1 = require("../Player");
class PlayerManager {
    constructor() {
        this.playerList = new Map();
    }
    getPlayerWithSessionId(playerId) {
        return this.playerList.get(playerId);
    }
    addPlayer(client, options, room) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Player Data", options);
                room.state.totalClientsConnected++;
                const player = new Player_1.Player(client, options, room, this.playerList);
                player.placeId = (this.playerList.size).toString();
                console.log("Player Data", player);
                this.playerList.set(player.playerId, player);
                room.state.playerManager = this;
                console.log("Player Data", this.playerList);
                resolve(player);
            }
            catch (error) {
                console.error("Error adding player:", error);
                reject(error);
            }
        }));
    }
}
exports.PlayerManager = PlayerManager;
