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
exports.GameManager = void 0;
const Constant_1 = require("../../Constant");
class GameManager {
    constructor() {
        this.isRoundStart = false;
    }
    onGameStart(client) {
        try {
            console.log("ON GAME SATRT : ");
            let playingPlayer = [];
            this.room.state.playerManager.playerList.forEach((plyr) => {
                let playerData = {
                    playerId: plyr.playerId,
                    playerName: plyr.playerName,
                    sessionId: plyr.sessionId,
                    isPlaying: plyr.isPlaying,
                    wagerAmount: plyr.wagerAmount,
                    totalHealth: plyr.totalHealth,
                    currentHealth: plyr.currentHealth,
                    photoId: plyr.photoId,
                    placeId: plyr.placeId,
                    totalSpecialPower: plyr.totalSpecialPower,
                    currentSpecialPower: plyr.currentSpecialPower,
                };
                playingPlayer.push(playerData);
            });
            this.room.io.emit(Constant_1.ServerEvents.GAME_START, JSON.stringify(playingPlayer));
            this.isRoundStart = true;
        }
        catch (error) {
            console.log("On Game Start : ", error);
        }
        const state = this.room.state;
    }
    updatePlayerPosition(client, data) {
        var _a;
        try {
            const player = this.room.state.playerManager.getPlayerWithSessionId((_a = client.data) === null || _a === void 0 ? void 0 : _a.playerId);
            if (player) {
                // console.log("Player Position", data);
                this.room.io.emit(Constant_1.ServerEvents.PLAYER_POSITION, JSON.stringify(data));
            }
        }
        catch (error) {
            console.log("Position Changed");
        }
    }
    updatePlayerAnimation(client, data) {
        var _a;
        try {
            const player = this.room.state.playerManager.getPlayerWithSessionId((_a = client.data) === null || _a === void 0 ? void 0 : _a.playerId);
            if (player) {
                //console.log("Player Animation", data);
                this.room.io.emit(Constant_1.ServerEvents.PLAYER_ANIMATION, JSON.stringify(data));
                if (data.isCollision && this.isRoundStart) {
                    setTimeout(() => {
                        this.checkDamage(data);
                    }, 500);
                }
            }
        }
        catch (error) {
            console.log("Position Changed");
        }
    }
    checkDamage(data) {
        try {
            console.log("Check Damage");
            let animType = data.animType;
            let _selfPLayer;
            let opponentPlayer;
            this.room.state.playerManager.playerList.forEach((plyr) => {
                if (plyr.playerId === data.playerId) {
                    _selfPLayer = plyr;
                }
                else {
                    opponentPlayer = plyr;
                }
            });
            switch (animType) {
                case Constant_1.PlayerAnimType.Hand:
                    opponentPlayer.currentHealth -= 1;
                    break;
                case Constant_1.PlayerAnimType.Leg:
                    opponentPlayer.currentHealth -= 1;
                    break;
                case Constant_1.PlayerAnimType.SpecialPower:
                    opponentPlayer.currentHealth -= 5;
                    break;
                case Constant_1.PlayerAnimType.Shield:
                    _selfPLayer.setShield();
                    break;
                default:
                    break;
            }
            if (opponentPlayer.isShieldActivated &&
                animType !== Constant_1.PlayerAnimType.Movement) {
                opponentPlayer.currentHealth += 1;
            }
            this.sendPlayerData();
            this.checkWinner(opponentPlayer);
        }
        catch (err) {
            console.log("Check Damage Error : ", err);
        }
    }
    sendPlayerData() {
        //console.log("sendPlayerData");
        let playingPlayer = [];
        this.room.state.playerManager.playerList.forEach((plyr) => {
            let playerData = {
                playerId: plyr.playerId,
                playerName: plyr.playerName,
                sessionId: plyr.sessionId,
                isPlaying: plyr.isPlaying,
                wagerAmount: plyr.wagerAmount,
                totalHealth: plyr.totalHealth,
                currentHealth: plyr.currentHealth,
                photoId: plyr.photoId,
                placeId: plyr.placeId,
                totalSpecialPower: plyr.totalSpecialPower,
                currentSpecialPower: plyr.currentSpecialPower,
            };
            playingPlayer.push(playerData);
        });
        //console.log("Player Data Updated : ", playingPlayer);
        this.room.io.emit(Constant_1.ServerEvents.PLAYER_DATA_UPDATE, JSON.stringify(playingPlayer));
    }
    checkWinner(plyr) {
        try {
            let winnerPlayer;
            let LoserPlayer;
            let playerData = [];
            if (plyr.currentHealth <= 0) {
                plyr.currentHealth = 0;
                LoserPlayer = plyr;
                plyr.isWinner = false;
                this.isRoundStart = false;
            }
            this.room.state.playerManager.playerList.forEach((plyr) => {
                if (plyr.playerId !== LoserPlayer.playerId) {
                    winnerPlayer = plyr;
                }
            });
            this.declareWinner(winnerPlayer, LoserPlayer);
        }
        catch (error) { }
    }
    declareWinner(winner, LoserPlayer) {
        let playingPlayer = [];
        this.room.state.playerManager.playerList.forEach((plyr) => {
            let isWinner = plyr.currentHealth <= 0 ? false : true;
            let playerData = {
                playerId: plyr.playerId,
                playerName: plyr.playerName,
                sessionId: plyr.sessionId,
                winner: isWinner,
            };
            playingPlayer.push(playerData);
        });
        this.room.io.emit(Constant_1.ServerEvents.PLAYER_WINNER, JSON.stringify(playingPlayer));
        setTimeout(() => {
            this.startNextRound();
        }, 5000);
    }
    onPlayerJoin(client) {
        try {
        }
        catch (error) {
            console.log("===player error====", error);
        }
    }
    startNextRound() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("New Round Start");
                this.room.state.playerManager.playerList.forEach((plyr) => {
                    plyr.currentHealth = 20;
                });
                let playersData = yield this.getPlayerData();
                this.room.io.emit(Constant_1.ServerEvents.NEW_ROUND_START, JSON.stringify(playersData));
                this.isRoundStart = true;
            }
            catch (error) { }
        });
    }
    getPlayerData() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let playingPlayer = [];
                    this.room.state.playerManager.playerList.forEach((plyr) => {
                        let playerData = {
                            playerId: plyr.playerId,
                            playerName: plyr.playerName,
                            sessionId: plyr.sessionId,
                            isPlaying: plyr.isPlaying,
                            wagerAmount: plyr.wagerAmount,
                            totalHealth: plyr.totalHealth,
                            currentHealth: plyr.currentHealth,
                            photoId: plyr.photoId,
                            placeId: plyr.placeId,
                            totalSpecialPower: plyr.totalSpecialPower,
                            currentSpecialPower: plyr.currentSpecialPower,
                        };
                        playingPlayer.push(playerData);
                        resolve(playingPlayer);
                    });
                }
                catch (error) {
                    console.error("Error adding player:", error);
                    reject(error);
                }
            }));
        });
    }
}
exports.GameManager = GameManager;
