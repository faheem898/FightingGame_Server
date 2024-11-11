import { Socket } from "socket.io";
import { Player } from "../Player";
import { RandomRoom } from "../../rooms/RandomRoom";

export class PlayerManager {
    playerList: Map<string, Player> = new Map();

    getPlayerWithSessionId(playerId: string) {
        return this.playerList.get(playerId);
    }
    addPlayer(client: Socket, options: any, room: RandomRoom): Promise<Player> {
        return new Promise<Player>(async (resolve, reject) => {
            try {
                console.log("Player Data",options)
                room.state.totalClientsConnected++;
                const player = new Player(client, options,room, this.playerList);
                player.placeId=(this.playerList.size).toString();
                console.log("Player Data",player);
                this.playerList.set(player.playerId, player);
                room.state.playerManager = this;
                console.log("Player Data",this.playerList);
                resolve(player);
    
            } catch (error) {
                console.error("Error adding player:", error);
                reject(error);
            }
        });
    }
    
}