"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const RandomRoom_1 = require("./src/rooms/RandomRoom");
const PlayWithFriendsRoom_1 = require("./src/rooms/PlayWithFriendsRoom");
const ChallengeRoom_1 = require("./src/rooms/ChallengeRoom");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
    transports: ["polling", "websocket"], // Enable both transports
});
const PORT = process.env.PORT || 3000;
// Dictionary to store room instances by type
const roomInstances = {
    Random: [],
    PlayWithFriends: [],
    Challenge: [],
};
// Room class mapping
const ROOM_CLASSES = {
    Random: RandomRoom_1.RandomRoom,
    PlayWithFriends: PlayWithFriendsRoom_1.PlayWithFriendsRoom,
    Challenge: ChallengeRoom_1.ChallengeRoom,
};
// Function to define and join a game room
function defineGameRoom(socket, roomType) {
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
        const playerCount = room.state.playerManager.playerList.size;
        console.log(`Room type: ${roomType}, Current player count: ${playerCount} for room ${i}`);
        if (playerCount < 2) {
            roomInstance = room; // Assign this room to the variable
            break; // Stop the loop and use this room
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
io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);
    // Listen for 'joinRoom' event to join a specific game room
    socket.on("joinRoom", (roomType) => {
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
