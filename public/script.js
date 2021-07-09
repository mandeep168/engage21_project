const socket = io("/");


 // socket.emit("join-room");

const myVideo = document.createElement("video");


myVideo.muted = true;

let user = prompt("Enter your name");
while(user === '' || user === null){
  user = prompt("Enter your name again");
}

// console.log(peer);
//1
 let peer = new Peer();

let peers = {}
let myVideoStream;
// var promise = navigator.mediaDevices.getDisplayMedia({
//     audio: true,
//     video: true,
//   });


// let stream = navigator.mediaDevices.getUserMedia({audio:true,video:true});

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    // console.log(peers);
    console.log("My video added!!!")
    addVideoStream(myVideo, stream,user,0);
    // console.log(user);
    // let name;
    peer.on('connection', (conn) => {
      conn.on('open', ()=>{
        conn.on('data', (data)=>{
          console.log(data);
          // name=data;
          // if(peers[conn.peer]!==undefined) 
           peers[conn.peer] = {'call':conn,'name':data};
        });
      });
    });
    let f_answer =0 ;
    peer.on("call", (call) => {
      call.answer(stream);
     // peers[call.peer] = {'call':call};
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        console.log("ansewered")
        f_answer+=1;
      if(f_answer%2==0)   addVideoStream(video, userVideoStream, peers[call.peer].name,call.peer);
      });
      call.on('close', () => {
      delete peers[call.peer];
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

  });

    socket.on("user-connected", (userId, userName) => {
      console.log("user connected", userName);
      connectToNewUser(userId, stream, userName);
    });
  });

const connectToNewUser = (userId, stream, userName) => {
  const conn = peer.connect(userId);
  conn.on('open', ()=>{
    conn.send(user);
  });
  setTimeout(()=>{const call = peer.call(userId, stream);
  peers[call.peer] = {'call':call,'name':userName};
  const video = document.createElement("video");
  let f_call=0;
  // let join_permission = confirm("Let ${userName} join?");

  // if(join_permission) 
  call.on("stream", (userVideoStream) => {
    console.log("user called");
    f_call+=1;
    if(f_call%2==0) addVideoStream(video, userVideoStream,userName,call.peer);

  });
  call.on('close', () => {
      // video.remove();
     // userLeft(userId);
      delete peers[userId];
  })},3000);
};

socket.on('user-disconnected', (peerId,name) => {
  console.log("user disconnected", name);
  userLeft(peerId);
  if (peers[peerId].call) peers[peerId].call.close()
  delete peers[peerId];
})

//2
peer.on("open", (id) => {
  console.log("room joined!!!")
  socket.emit("join-room", ROOM_ID, id, user);
  console.log('yes');
  peers[id]={'call':peer,'name':user};
});

let messages = document.querySelector(".messages");


socket.on("createMessage", (message, userName, time) => {
  console.log('message showed');
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
      <div class="msg">
        <b>${
          userName
        } </b>
        <b class="time-in-message">${time}</b></div>
        <span>${message}</span>
    </div>`;
});








