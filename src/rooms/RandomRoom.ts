import { ClientEvents, ServerEvents } from "../Constant";
import { GameState } from "../MifrensRoom/GameState";
import { Player } from "../MifrensRoom/Player";
import { BaseRoom } from "./BaseRoom";
import { Socket } from "socket.io";

export class RandomRoom extends BaseRoom {
  maxClients: number = 2; // Limit to 2 players per room
  state: GameState;

  constructor(io: any) {
    super();
    this.io = io;
    this.maxClients = 2; // Ensure that no more than 2 players can join
    this.state = new GameState();
    this.state.gameManager!.room = this;
  }

  // Register event listeners
  registerEvents(socket: Socket) {
    console.log("Registering events for room");
    socket.on(ClientEvents.DISCONNECT, (reason) => this.onLeave(socket, false));
    socket.on(ClientEvents.JOIN, (data) => this.onJoin(socket, data));
    socket.on(ClientEvents.PLAYER_POSITION, (data) =>
      this.updatePlayerPosition(socket, data)
    );
    socket.on(ClientEvents.PLAYER_ANIMATION, (data) =>
      this.updatePlayerAnimation(socket, data)
    );
    socket.on(ClientEvents.LEAVE, (data) => this.onLeave(socket, true));
  }

  // Handle when a player joins the room
  async onJoin(client: Socket, options?: any) {
    try {
      options = JSON.parse(options);
      if (this.state.playerManager!.playerList.size >= this.maxClients) {
        return;
      }
      console.log("Player: ", this.state.playerManager!.playerList);
      // Add the player to the room
      const player = await this.state.playerManager!.addPlayer(
        client,
        options,
        this
      );

      // Prepare and send the updated player list
      let playerList: any[] = [];
      this.state.playerManager!.playerList.forEach((plyr: Player) => {
        playerList.push({
          sessionId: plyr.sessionId,
          playerName: plyr.playerName,
        });
      });

      // Emit the updated player list to all players in the room
      //this.io.emit(ServerEvents.ON_JOIN, { playerList });
      //console.log("Player List : ",this.state.playerManager!.playerList)
      // Start the game and handle player join logic
      if (this.state.playerManager!.playerList.size === this.maxClients) {
        this.state.gameManager!.onGameStart(client);
        this.state.gameManager!.onPlayerJoin(client);
      }
    } catch (err) {
      // If an error occurs, notify the player
      //client.emit(ServerEvents.ALERT_MESSAGE, { message: "Failed to join room" });
      console.error("Error while joining room:", err);
    }
  }
  updatePlayerPosition(client: Socket, data: any) {
    try {
      data = JSON.parse(data);
      const player = this.state.playerManager!.getPlayerWithSessionId(
        client.data?.playerId
      ) as Player;
      if (player) {
        this.state.gameManager?.updatePlayerPosition(client, data);
      }
    } catch (error) {
      console.log("Position Changed");
    }
  }
  updatePlayerAnimation(client: Socket, data: any) {
    try {
      data = JSON.parse(data);
      const player = this.state.playerManager!.getPlayerWithSessionId(
        client.data?.playerId
      ) as Player;
      if (player) {
        this.state.gameManager?.updatePlayerAnimation(client, data);
      }
    } catch (error) {
      console.log("Position Changed");
    }
  }

  // Handle when a player leaves the room
  async onLeave(client: Socket, consented: boolean) {
    try {
      const player = this.state.playerManager!.getPlayerWithSessionId(
        client?.data?.playerId
      );
      if (player) {
        player.isLeave = true;
        // Optionally, remove player from the manager and cleanup room
        //await this.state.playerManager!.removePlayer(player.sessionId, this);
        if (this.state.playerManager!.playerList.size === 0) {
          this.onDispose(); // Dispose the room if no players are left
        }
      }
    } catch (error) {
      console.error("Error while leaving room:", error);
    }
  }

  // Cleanup resources when the room is disposed
  async onDispose() {
    try {
      console.log("Disposing RandomRoom...");
      // Reset or cleanup game data if needed
      // this.state.gameManager!.resetGamePlayData();
    } catch (err) {
      console.error("Error during room disposal:", err);
    }
  }
}
