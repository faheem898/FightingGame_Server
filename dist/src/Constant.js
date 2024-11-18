"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerAnimType = exports.GAMESTATE = exports.ServerEvents = exports.ClientEvents = void 0;
exports.getRandomNumber = getRandomNumber;
var ClientEvents;
(function (ClientEvents) {
    ClientEvents["DISCONNECT"] = "DISCONNECT";
    ClientEvents["LEAVE"] = "LEAVE";
    ClientEvents["JOIN"] = "JOIN";
    ClientEvents["PLAYER_POSITION"] = "PLAYER_POSITION";
    ClientEvents["PLAYER_ANIMATION"] = "PLAYER_ANIMATION";
    ClientEvents["PLAYER_DATA_UPDATE"] = "PLAYER_DATA_UPDATE";
})(ClientEvents || (exports.ClientEvents = ClientEvents = {}));
var ServerEvents;
(function (ServerEvents) {
    ServerEvents["CLIENT_JOIN"] = "CLIENT_JOIN";
    ServerEvents["CLIENT_LEAVE"] = "CLIENT_LEAVE";
    ServerEvents["GAME_START_TIME"] = "GAME_START_TIME";
    ServerEvents["ON_JOIN"] = "ON_JOIN";
    ServerEvents["ON_LEAVE"] = "ON_LEAVE";
    ServerEvents["GAME_START"] = "GAME_START";
    ServerEvents["PLAYER_POSITION"] = "PLAYER_POSITION";
    ServerEvents["PLAYER_ANIMATION"] = "PLAYER_ANIMATION";
    ServerEvents["PLAYER_DATA_UPDATE"] = "PLAYER_DATA_UPDATE";
    ServerEvents["PLAYER_WINNER"] = "PLAYER_WINNER";
    ServerEvents["NEW_ROUND_START"] = "NEW_ROUND_START";
})(ServerEvents || (exports.ServerEvents = ServerEvents = {}));
var GAMESTATE;
(function (GAMESTATE) {
    GAMESTATE[GAMESTATE["IDEAL"] = 0] = "IDEAL";
    GAMESTATE[GAMESTATE["WAITING"] = 1] = "WAITING";
    GAMESTATE[GAMESTATE["STARTED"] = 2] = "STARTED";
})(GAMESTATE || (exports.GAMESTATE = GAMESTATE = {}));
var PlayerAnimType;
(function (PlayerAnimType) {
    PlayerAnimType[PlayerAnimType["Hand"] = 0] = "Hand";
    PlayerAnimType[PlayerAnimType["Leg"] = 1] = "Leg";
    PlayerAnimType[PlayerAnimType["SpecialPower"] = 2] = "SpecialPower";
    PlayerAnimType[PlayerAnimType["Shield"] = 3] = "Shield";
    PlayerAnimType[PlayerAnimType["Movement"] = 4] = "Movement";
})(PlayerAnimType || (exports.PlayerAnimType = PlayerAnimType = {}));
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
