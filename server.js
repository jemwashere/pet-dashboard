const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server); // attach socket.io

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static("public"));

// Route for index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// 🔥 Socket.IO events (sync changes between users)
io.on("connection", (socket) => {
  console.log("✅ A user connected");

  socket.on("addPet", (pet) => {
    io.emit("newPet", pet); // broadcast to everyone
  });

  socket.on("deletePet", (name) => {
    io.emit("deletePet", name);
  });

  socket.on("restockPet", ({ name, newStock }) => {
    io.emit("restockPet", { name, newStock });
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
