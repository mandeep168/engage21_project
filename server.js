const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");

const mongoose = require('mongoose');

const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ['POST','GET']
  }
});


// mandeep
// IMlqesbPNlRXD7cd


const MONGOURI = 
"mongodb+srv://mandeep:IMlqesbPNlRXD7cd@cluster0.vmtk4.mongodb.net/chat?retryWrites=true&w=majority";

// mongodb://localhost/chat
mongoose.connect(MONGOURI, (err) => {
  if(err){
    console.log("ERRor",err);
  }else{
    console.log('Connected to mongodb successfully!');
  }
});


//document structure
const chatSchema = new mongoose.Schema({
  name: String,
  msg: String,
  created: String
});


app.use(express.static("public"));
app.set("view engine", "ejs");


//render homepage
app.get("/", (req, res) => {
   res.render("homePage");
});

  let id;
  let Chat;


app.get('/chat', (req, res) => {
    id=uuidv4();
   res.redirect(`chat/${id}`);
});

   let Result;

app.get('/chat/:room', (req, res) => {
    id=req.params.room;

    Chat = mongoose.model(id, chatSchema);
  
   Chat.find({}, (err, result) => {
    if(err) return handleError(err);
    else{
       res.render("meetChat", { msgs: result, roomId: id});
    }
   });

   
});


// rendering video call page with sending the required collection's documents as array
app.get("/engage/:room", (req, res) => {
  id = req.params.room;

  //if that collection is not yet created 
  Chat = mongoose.model(id, chatSchema);
  Chat.find({}, (err, result) => {
    if(err) return handleError(err);
    else{
       res.render("dashboard", { msgs: result, roomId: id});
    }
   });
});


io.on("connection", (socket) => {
  socket.on("join-chat", (roomId, userId, userName) => {
     socket.join(roomId);

     socket.on("chat", (message, time) => {
        let newMsg = new Chat({name:userName, msg: message, created: time});
        newMsg.save((err)=>{
          if(err) throw err;
          io.to(roomId).emit("createMessage", message, userName, time);
        });
        
      });
   });

  socket.on("join-video-call", (roomId, userId, userName) => {
      socket.join(roomId);

      socket.to(roomId).emit("user-connected", userId,userName);
      socket.on("message", (message, time) => {
        let newMsg = new Chat({name:userName, msg: message, created: time});
        newMsg.save((err)=>{
          if(err) throw err;
          io.to(roomId).emit("createMessage", message, userName, time);
        });
        
      });
      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId, userName);
      })
  });

});


server.listen(process.env.PORT || 5001);