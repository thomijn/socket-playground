const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join_room", (hash) => {
    socket.join(hash);
  });

  socket.on("touched_other", async ({ touched, hash }) => {
    const ids = await io.in(hash).allSockets();

    const other = [...ids].filter((id) => id !== socket.id);
    console.log([...ids]);
    if (other.length === 1) {
      io.to(other[0]).emit("receive_other", touched);
    }
  });
});

server.listen(8000, () => {
  console.log("listening on *:8000");
});
