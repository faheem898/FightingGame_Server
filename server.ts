import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { RandomRoom } from "./src/rooms/RandomRoom";
import { PlayWithFriendsRoom } from "./src/rooms/PlayWithFriendsRoom";
import { ChallengeRoom } from "./src/rooms/ChallengeRoom";
import { ClientEvents, ServerEvents } from "./src/Constant";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Or specify your client domain here
    methods: ["GET", "POST"]
  },
});

const PORT = process.env.PORT || 3000;

// Dictionary to store room instances by type
const roomInstances: Record<string, Array<any>> = {
  Random: [],
  PlayWithFriends: [],
  Challenge: [],
};

// Room class mapping
const ROOM_CLASSES: Record<string, any> = {
  Random: RandomRoom,
  PlayWithFriends: PlayWithFriendsRoom,
  Challenge: ChallengeRoom,
};

// Function to define and join a game room
function defineGameRoom(socket: Socket, roomType: string) {
  // Check if room type is valid
  if (!ROOM_CLASSES[roomType]) {
    console.log(`Invalid room type: ${roomType}`);
    socket.emit("error", { message: "Invalid room type" });
    return;
  }

  // Try to find an existing room with less than 2 players
  let roomInstance = null;
  for (let i = 0; i < roomInstances[roomType].length; i++) {
    let room = roomInstances[roomType][i];
    const playerCount = room.state.playerManager!.playerList.size;
    console.log(`Room type: ${roomType}, Current player count: ${playerCount} for room ${i}`);

    if (playerCount < 2) {
      roomInstance = room;  // Assign this room to the variable
      break;  // Stop the loop and use this room
    }
  }

  // If no room with less than 2 players, create a new one
  if (!roomInstance) {
    const RoomClass = ROOM_CLASSES[roomType];
    roomInstance = new RoomClass(io); // Create a new room instance
    roomInstances[roomType].push(roomInstance); // Add it to the array of room instances
    console.log(`New room created for type: ${roomType}. Current player count: 0.`);
  }

  // Register events for the room and add the player
  roomInstance.registerEvents(socket);

  // Join the room in socket.io (to allow broadcasting in the room)
  socket.join(roomType);
  console.log(`Player ${socket.id} joined room: ${roomType}`);

  // Notify other players in the room that a new player has joined
  socket.to(roomType).emit("newPlayer", { playerId: socket.id });

  // Emit a message to the player that they have successfully joined the room
  socket.emit("roomJoined", { roomType, playerId: socket.id });
}



// Handle incoming socket connections
io.on("connection", (socket: Socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Listen for 'joinRoom' event to join a specific game room
  socket.on("joinRoom", (roomType: string) => {
    defineGameRoom(socket, roomType);
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    // Optionally, handle player removal from room on disconnect
    for (const roomType in roomInstances) {
      if (roomInstances[roomType]) {
        // roomInstances[roomType].removePlayer(socket);
      }
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
