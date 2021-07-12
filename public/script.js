const socket = io("/");

const myVideo = document.createElement("video");

myVideo.muted = true;

let user;
if(sessionStorage.getItem("user")) {
  user = sessionStorage.getItem("user");
}else{
  window.location.href=`/chat/${ROOM_ID}`;
}


 let peer = new Peer();

let peers = {}
let myVideoStream;
// const mypeerId = peer.id;

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream,user,0);
    peer.on('connection', (conn) => {
      conn.on('open', ()=>{
        conn.on('data', (data)=>{
          console.log(data);
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
     document.querySelector('#notify').innerHTML = `${userName} joined`;
     document.querySelector('#notify').style.zIndex = '5000';
     setTimeout(()=>{
      document.querySelector('#notify').style.zIndex = -1;
      },3000);

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
  call.on("stream", (userVideoStream) => {
    f_call+=1;
    if(f_call%2==0) addVideoStream(video, userVideoStream,userName,call.peer);

  });
  call.on('close', () => {
      delete peers[userId];
  })},1000);
};

socket.on('user-disconnected', (peerId,name) => {
  document.querySelector('#notify').innerHTML = `${name} left`;
     document.querySelector('#notify').style.zIndex = '5000';
     setTimeout(()=>{
      document.querySelector('#notify').style.zIndex = -1;
      },3000);
  userLeft(peerId);
  if (peers[peerId].call) peers[peerId].call.close()
  delete peers[peerId];
})

//2
peer.on("open", (id) => {
  socket.emit("join-video-call", ROOM_ID, id, user);
  peers[id]={'call':peer,'name':user};
});

let messages = document.querySelector(".messages");


socket.on("createMessage", (message, userName, time) => {
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





socket.on("notify", ( userName) => {
  if(document.querySelector(".main__right").style.display !== "flex"){
    document.querySelector("#chat-dot").style.zIndex = '5000';
  }
  document.querySelector('#notify').innerHTML = `new message from ${userName}`;
  document.querySelector('#notify').style.zIndex = '5000';
  setTimeout(()=>{document.querySelector('#notify').style.zIndex = -1;},3000)

});




//socket call back going to other participants 
socket.on('user-raised-hand', (userId, userName) =>{
  console.log("raised hand someone")
  if(userId!==peer.id){
    console.log(userName);
   let hand =  document.getElementById(userId);
   let raise = hand.querySelector('i');

    if(hand.style.borderColor==='yellow') {
      hand.style.border = 'none';
      raise.style.zIndex = '-1';
    }
    else{
      hand.style.border = "2px solid yellow";
      raise.style.zIndex = '1';
    }
  }
});
