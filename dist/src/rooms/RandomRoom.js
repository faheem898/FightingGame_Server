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
exports.RandomRoom = void 0;
const Constant_1 = require("../Constant");
const GameState_1 = require("../MifrensRoom/GameState");
const BaseRoom_1 = require("./BaseRoom");
class RandomRoom extends BaseRoom_1.BaseRoom {
    constructor(io) {
        super();
        this.maxClients = 2; // Limit to 2 players per room
        this.io = io;
        this.maxClients = 2; // Ensure that no more than 2 players can join
        this.state = new GameState_1.GameState();
        this.state.gameManager.room = this;
    }
    // Register event listeners
    registerEvents(socket) {
        console.log("Registering events for room");
        socket.on(Constant_1.ClientEvents.DISCONNECT, (reason) => this.onLeave(socket, false));
        socket.on(Constant_1.ClientEvents.JOIN, (data) => this.onJoin(socket, data));
        socket.on(Constant_1.ClientEvents.PLAYER_POSITION, (data) => this.updatePlayerPosition(socket, data));
        socket.on(Constant_1.ClientEvents.PLAYER_ANIMATION, (data) => this.updatePlayerAnimation(socket, data));
        socket.on(Constant_1.ClientEvents.LEAVE, (data) => this.onLeave(socket, true));
    }
    // Handle when a player joins the room
    onJoin(client, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                options = JSON.parse(options);
                if (this.state.playerManager.playerList.size >= this.maxClients) {
                    return;
                }
                console.log("Player: ", this.state.playerManager.playerList);
                // Add the player to the room
                const player = yield this.state.playerManager.addPlayer(client, options, this);
                // Prepare and send the updated player list
                let playerList = [];
                this.state.playerManager.playerList.forEach((plyr) => {
                    playerList.push({
                        sessionId: plyr.sessionId,
                        playerName: plyr.playerName,
                    });
                });
                // Emit the updated player list to all players in the room
                //this.io.emit(ServerEvents.ON_JOIN, { playerList });
                //console.log("Player List : ",this.state.playerManager!.playerList)
                // Start the game and handle player join logic
                if (this.state.playerManager.playerList.size === this.maxClients) {
                    this.state.gameManager.onGameStart(client);
                    this.state.gameManager.onPlayerJoin(client);
                }
            }
            catch (err) {
                // If an error occurs, notify the player
                //client.emit(ServerEvents.ALERT_MESSAGE, { message: "Failed to join room" });
                console.error("Error while joining room:", err);
            }
        });
    }
    updatePlayerPosition(client, data) {
        var _a, _b;
        try {
            data = JSON.parse(data);
            const player = this.state.playerManager.getPlayerWithSessionId((_a = client.data) === null || _a === void 0 ? void 0 : _a.playerId);
            if (player) {
                (_b = this.state.gameManager) === null || _b === void 0 ? void 0 : _b.updatePlayerPosition(client, data);
            }
        }
        catch (error) {
            console.log("Position Changed");
        }
    }
    updatePlayerAnimation(client, data) {
        var _a, _b;
        try {
            data = JSON.parse(data);
            const player = this.state.playerManager.getPlayerWithSessionId((_a = client.data) === null || _a === void 0 ? void 0 : _a.playerId);
            if (player) {
                (_b = this.state.gameManager) === null || _b === void 0 ? void 0 : _b.updatePlayerAnimation(client, data);
            }
        }
        catch (error) {
            console.log("Position Changed");
        }
    }
    // Handle when a player leaves the room
    onLeave(client, consented) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const player = this.state.playerManager.getPlayerWithSessionId((_a = client === null || client === void 0 ? void 0 : client.data) === null || _a === void 0 ? void 0 : _a.playerId);
                if (player) {
                    player.isLeave = true;
                    // Optionally, remove player from the manager and cleanup room
                    //await this.state.playerManager!.removePlayer(player.sessionId, this);
                    if (this.state.playerManager.playerList.size === 0) {
                        this.onDispose(); // Dispose the room if no players are left
                    }
                }
            }
            catch (error) {
                console.error("Error while leaving room:", error);
            }
        });
    }
    // Cleanup resources when the room is disposed
    onDispose() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Disposing RandomRoom...");
                // Reset or cleanup game data if needed
                // this.state.gameManager!.resetGamePlayData();
            }
            catch (err) {
                console.error("Error during room disposal:", err);
            }
        });
    }
}
exports.RandomRoom = RandomRoom;
