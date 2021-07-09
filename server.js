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
// //mongodb+srv://mandeep:<password>@cluster0.vmtk4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

// mongodb://localhost/chat
mongoose.connect(MONGOURI, (err) => {
  if(err){
    console.log("ERRor",err);
  }else{
    console.log('Connected to mongodb successfully!');
  }
});

 // mongoose.connect(MONGOURI);
 //  // .then(() => console.log("MongoDB connected"))
 //  // .catch((err) => console.log(err));


//document 
const chatSchema = new mongoose.Schema({
  name: String,
  msg: String,
  created: String
});



// app.use("/peerjs", peerServer);
app.use(express.static("public"));
app.set("view engine", "ejs");

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
  // id='defaa0dd-bf58-4f5a-983c-777a9591595bs';

    Chat = mongoose.model(id, chatSchema);
  
 
   Chat.find({}, (err, result) => {
    if(err) return handleError(err);
    else{
     // console.log(result);
      // console.log(result.length);
      Result=result;
      console.log(Result);
      // let i=0;
      // while(i<result.length){
      //   console.log(result[i].name, result[i].msg);
      //   i+=1;
      // }
       res.render("meetChat", { msgs: result, roomId: id});

    }
   });

   
});

app.get("/engage", (req, res) => {
  
  console.log("good to go");

  res.redirect(`engage/${id}`);
});


app.get("/engage/:room", (req, res) => {
  id = req.params.room;
      Chat = mongoose.model(id, chatSchema);
  Chat.find({}, (err, result) => {
    if(err) return handleError(err);
    else{
     // console.log(result);
      // console.log(result.length);
      // Result=result;
      console.log(result);
      // let i=0;
      // while(i<result.length){
      //   console.log(result[i].name, result[i].msg);
      //   i+=1;
      // }
       res.render("dashboard", { msgs: result, roomId: id});

    }
   });

   // res.render("dashboard", { msgs : Result, roomId: req.params.room });
});


io.on("connection", (socket) => {
  socket.on("join", (roomId, userId, userName) => {
    console.log("joined");
     socket.join(roomId);



   socket.on("chat", (message, time) => {
      let newMsg = new Chat({name:userName, msg: message, created: time});
      newMsg.save((err)=>{
        if(err) throw err;
        io.to(roomId).emit("createMessage", message, userName, time);
      });
      
    });
   });
  socket.on("join-room", (roomId, userId, userName) => {
    console.log("please");
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