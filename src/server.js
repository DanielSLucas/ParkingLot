const http = require("node:http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3333;

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
  console.log("Socket: ", socket.id);

  socket.on("sensors", (data) => {
    console.log("Received!", data);
  })

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
