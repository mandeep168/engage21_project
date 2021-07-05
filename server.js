const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ['POST','GET']
  }
});

// app.use("/peerjs", peerServer);
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("homePage");
});

app.get("/engage", (req, res) => {
  res.redirect(`engage/${uuidv4()}`);
});

app.get("/engage/:room", (req, res) => {
  res.render("dashboard", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId,userName);
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId, userName);
    })
  });
});

server.listen(process.env.PORT || 5001);