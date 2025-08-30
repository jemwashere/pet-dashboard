const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // serve your index.html + js

let inventory = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send current inventory to new client
  socket.emit("updateInventory", inventory);

  // When someone adds stock
  socket.on("addStock", (item) => {
    inventory.push(item);
    io.emit("updateInventory", inventory); // broadcast to everyone
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
