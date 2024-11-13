import { Socket } from "socket.io";
import { RandomRoom } from "../rooms/RandomRoom";

export class Player {
  sessionId: string;
  playerName: string;
  playerId: string;
  wagerAmount: number;
  totalHealth: number = 20;
  currentHealth: number = 20;
  photoId: number;
  placeId: string = "0";
  isPlaying: boolean = true;
  totalSpecialPower: number = 10;
  currentSpecialPower: number = 0;
  isLeave: boolean | undefined;
  isWinner: boolean = false;
  isShieldActivated: boolean = false;
  shieldTimeout: any;
  characterName:any;
  roomType:any;

  constructor(client: Socket, options: any, room: RandomRoom, playerList: any) {
    this.sessionId = client.id; // Always use client's unique socket ID as sessionId
    this.playerId = options?.playerId;
    this.playerName = options?.playerName;
    this.wagerAmount = options?.wagerAmount;
    this.photoId = options?.photoId;
    this.characterName= options?.characterName;
    this.roomType=options?.roomType;
    client.data = { playerId: options?.playerId };
  }
  setShield() {
    try {
      this.isShieldActivated = true;
      if(this.shieldTimeout)
        clearTimeout(this.shieldTimeout);
      this.shieldTimeout=setTimeout(() => {
        this.isShieldActivated=false;
      }, 1000);
    } catch (error) {}
  }
}


