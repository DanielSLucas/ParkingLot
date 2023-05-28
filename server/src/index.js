const http = require("node:http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3333;
let parkingSpots = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
  console.log("Socket: ", socket.id);

  socket.emit("parking-spots", parkingSpots)

  socket.on("parking-spots", (data) => {
    parkingSpots = data;
    
    socket.broadcast.emit("parking-spots", parkingSpots)
  })

  socket.on("parking-spot-updated", (parkingSpot) => {
    const spotIndex = parkingSpots.findIndex(spot => spot.id === parkingSpot.id);
    parkingSpots[spotIndex] = parkingSpot;

    socket.broadcast.emit("parking-spot-updated", parkingSpot);
  })

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
