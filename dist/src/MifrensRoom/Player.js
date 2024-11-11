"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(client, options, room, playerList) {
        this.totalHealth = 20;
        this.currentHealth = 20;
        this.placeId = "0";
        this.isPlaying = true;
        this.totalSpecialPower = 10;
        this.currentSpecialPower = 0;
        this.isWinner = false;
        this.isShieldActivated = false;
        this.sessionId = client.id; // Always use client's unique socket ID as sessionId
        this.playerId = options === null || options === void 0 ? void 0 : options.playerId;
        this.playerName = options === null || options === void 0 ? void 0 : options.playerName;
        this.wagerAmount = options === null || options === void 0 ? void 0 : options.wagerAmount;
        this.photoId = options === null || options === void 0 ? void 0 : options.photoId;
        client.data = { playerId: options === null || options === void 0 ? void 0 : options.playerId };
    }
    setShield() {
        try {
            this.isShieldActivated = true;
            if (this.shieldTimeout)
                clearTimeout(this.shieldTimeout);
            this.shieldTimeout = setTimeout(() => {
                this.isShieldActivated = false;
            }, 1000);
        }
        catch (error) { }
    }
}
exports.Player = Player;
