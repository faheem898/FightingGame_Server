export enum ClientEvents {
  DISCONNECT = "DISCONNECT",
  LEAVE = "LEAVE",
  JOIN = "JOIN",
  PLAYER_POSITION="PLAYER_POSITION",
  PLAYER_ANIMATION = "PLAYER_ANIMATION",
  PLAYER_DATA_UPDATE = "PLAYER_DATA_UPDATE",

}
export enum ServerEvents {
  CLIENT_JOIN = "CLIENT_JOIN",
  CLIENT_LEAVE = "CLIENT_LEAVE",
  GAME_START_TIME = "GAME_START_TIME",
  ON_JOIN = "ON_JOIN",
  ON_LEAVE = "ON_LEAVE",
  GAME_START = "GAME_START",
  PLAYER_POSITION="PLAYER_POSITION",
  PLAYER_ANIMATION = "PLAYER_ANIMATION",
  PLAYER_DATA_UPDATE = "PLAYER_DATA_UPDATE",
  PLAYER_WINNER = "PLAYER_WINNER",
  NEW_ROUND_START = "NEW_ROUND_START",


}
export enum GAMESTATE {
  IDEAL,
  WAITING,
  STARTED,
}
export interface IPlayingPlayer {
  roomId: string;
  playerList: IPlayerData[];
}
export interface IPlayerData {
    playerId?: string;
    playerName?: string;
    sessionId: string;
    isPlaying?: boolean;
    wagerAmount?: number;
    totalHealth?: number;
    currentHealth?: number;
    photoId?: number;
    placeId?: string;
    totalSpecialPower?: number;
    currentSpecialPower?: number;
    characterName?: number;
    roomType?: number;
}
export enum PlayerAnimType{
    Hand,
    Leg,
    SpecialPower,
    Shield,
    Movement,
}
export interface IResultData {
    winner?: IPlayerResult;
    loser?: IPlayerResult;
    
}
export interface IPlayerResult {
  playerId?: string;
  playerName?: string;
  sessionId: string;
  winner: boolean;
}