import { Socket } from "socket.io";
import { RandomRoom } from "../../rooms/RandomRoom";
import { ChallengeRoom } from "../../rooms/ChallengeRoom";
import { PlayWithFriendsRoom } from "../../rooms/PlayWithFriendsRoom";
import {
  IPlayerData,
  IPlayerResult,
  IResultData,
  PlayerAnimType,
  ServerEvents,
} from "../../Constant";
import { Player } from "../Player";

export class GameManager {
  room!: RandomRoom;
  isRoundStart: boolean = false;
  roundTimeOut: any;
  onGameStart(client: Socket) {
    try {
      console.log("ON GAME SATRT : ");
      let playingPlayer: IPlayerData[] = [];
      this.room.state.playerManager!.playerList.forEach((plyr: Player) => {
        let playerData: IPlayerData = {
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
          characterName: plyr.characterName,
          roomType: plyr.roomType,
        };
        playingPlayer.push(playerData);
      });
      this.room.io.emit(ServerEvents.GAME_START, JSON.stringify(playingPlayer));
      this.isRoundStart = true;
      this.roundTimeOut = setTimeout(() => {
        this.checkTimeOverWinner();
      }, 180000);
    } catch (error) {
      console.log("On Game Start : ", error);
    }
    const state = this.room.state;
  }
  updatePlayerPosition(client: Socket, data: any) {
    try {
      const player = this.room.state.playerManager!.getPlayerWithSessionId(
        client.data?.playerId
      ) as Player;
      if (player) {
        // console.log("Player Position", data);
        this.room.io.emit(ServerEvents.PLAYER_POSITION, JSON.stringify(data));
      }
    } catch (error) {
      console.log("Position Changed");
    }
  }
  updatePlayerAnimation(client: Socket, data: any) {
    try {
      const player = this.room.state.playerManager!.getPlayerWithSessionId(
        client.data?.playerId
      ) as Player;
      if (player) {
        //console.log("Player Animation", data);
        this.room.io.emit(ServerEvents.PLAYER_ANIMATION, JSON.stringify(data));
        if (data.isCollision && this.isRoundStart) {
          setTimeout(() => {
            this.checkDamage(data);
          }, 500);
        }
      }
    } catch (error) {
      console.log("Position Changed");
    }
  }
  checkDamage(data: any) {
    try {
      console.log("Check Damage");
      let animType: PlayerAnimType = data.animType;
      let _selfPLayer!: Player;
      let opponentPlayer!: Player;
      this.room!.state!.playerManager!.playerList.forEach((plyr: Player) => {
        if (plyr.playerId === data.playerId) {
          _selfPLayer = plyr;
        } else {
          opponentPlayer = plyr;
        }
      });
      switch (animType) {
        case PlayerAnimType.Hand:
          opponentPlayer.currentHealth -= 1;
          break;
        case PlayerAnimType.Leg:
          opponentPlayer.currentHealth -= 1;
          break;
        case PlayerAnimType.SpecialPower:
          opponentPlayer.currentHealth -= 5;
          break;
        case PlayerAnimType.Shield:
          _selfPLayer.setShield();
          break;

        default:
          break;
      }
      if (
        opponentPlayer.isShieldActivated &&
        animType !== PlayerAnimType.Movement
      ) {
        opponentPlayer.currentHealth += 1;
      }
      this.sendPlayerData();
      this.checkWinner(opponentPlayer);
    } catch (err) {
      console.log("Check Damage Error : ", err);
    }
  }
  sendPlayerData() {
    //console.log("sendPlayerData");
    let playingPlayer: IPlayerData[] = [];
    this.room.state.playerManager!.playerList.forEach((plyr: Player) => {
      let playerData: IPlayerData = {
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
        characterName: plyr.characterName,
        roomType: plyr.roomType,
      };
      playingPlayer.push(playerData);
    });
    //console.log("Player Data Updated : ", playingPlayer);
    this.room.io.emit(
      ServerEvents.PLAYER_DATA_UPDATE,
      JSON.stringify(playingPlayer)
    );
  }
  checkWinner(plyr: Player) {
    try {
      let winnerPlayer!: Player;
      let LoserPlayer!: Player;
      let playerData: IPlayerData[] = [];
      if (plyr.currentHealth <= 0) {
        plyr.currentHealth = 0;
        LoserPlayer = plyr;
        plyr.isWinner = false;
        this.isRoundStart = false;
      }
      this.room.state.playerManager!.playerList.forEach((plyr: Player) => {
        if (plyr.playerId !== LoserPlayer.playerId) {
          winnerPlayer = plyr;
        }
      });
      this.declareWinner(winnerPlayer, LoserPlayer);
    } catch (error) {}
  }
  declareWinner(winner: Player, LoserPlayer: Player) {
    let playingPlayer: IPlayerResult[] = [];
    this.room.state.playerManager!.playerList.forEach((plyr: Player) => {
      let isWinner = plyr.currentHealth <= 0 ? false : true;
      let playerData: IPlayerResult = {
        playerId: plyr.playerId,
        playerName: plyr.playerName,
        sessionId: plyr.sessionId,
        winner: isWinner,
      };
      playingPlayer.push(playerData);
    });
    this.room.io.emit(
      ServerEvents.PLAYER_WINNER,
      JSON.stringify(playingPlayer)
    );
    setTimeout(() => {
      this.startNextRound();
    }, 5000);
  }
  onPlayerJoin(client: Socket) {
    try {
    } catch (error) {
      console.log("===player error====", error);
    }
  }
  checkTimeOverWinner() {
    try {
      const players = Array.from(
        this.room.state.playerManager!.playerList.values()
      );
      players.sort((a, b) => a.currentHealth - b.currentHealth);
      const loser = players[0]; // Player with the lowest health
      const winner = players[players.length - 1]; // Player with the highest health
      this.declareWinner(winner, loser);
      clearInterval(this.roundTimeOut);
    } catch (error) {}
  }
  async startNextRound() {
    try {
      console.log("New Round Start");

      this.room.state.playerManager!.playerList.forEach((plyr: Player) => {
        plyr.currentHealth = 20;
      });
      let playersData = await this.getPlayerData();
      this.room.io.emit(
        ServerEvents.NEW_ROUND_START,
        JSON.stringify(playersData)
      );
      this.isRoundStart = true;
      this.roundTimeOut = setTimeout(() => {
        this.checkTimeOverWinner();
      }, 30000);
    } catch (error) {}
  }

  async getPlayerData(): Promise<IPlayerData[]> {
    return new Promise<IPlayerData[]>(async (resolve, reject) => {
      try {
        let playingPlayer: IPlayerData[] = [];
        this.room.state.playerManager!.playerList.forEach((plyr: Player) => {
          let playerData: IPlayerData = {
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
            characterName: plyr.characterName,
            roomType: plyr.roomType,
          };
          playingPlayer.push(playerData);
          resolve(playingPlayer);
        });
      } catch (error) {
        console.error("Error adding player:", error);
        reject(error);
      }
    });
  }
}
