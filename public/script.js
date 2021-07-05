const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");

myVideo.muted = true;

showChat.addEventListener("click", () => {
  let chatDisplay = document.querySelector(".main__right").style.display;

  if(chatDisplay==="flex" ){
      document.querySelector(".main__right").style.display = "none";
       document.querySelector(".main__left").style.flex = "1";
  }else{
      document.querySelector(".main__right").style.display = "flex";
      document.querySelector(".main__right").style.flex = "0.3";
       document.querySelector(".main__left").style.flex = "0.7";
  }
});

let user = prompt("Enter your name");
while(user==='' || user === null){
  user = prompt("Enter your name again");
}

var peer = new Peer();

let peers = {}
let myVideoStream;
// var promise = navigator.mediaDevices.getDisplayMedia({
//     audio: true,
//     video: true,
//   });

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    // console.log(peers);
    addVideoStream(myVideo, stream,user,0);
    // console.log(user);
    let name;
    peer.on('connection', (conn) => {
      conn.on('open', ()=>{
        conn.on('data', (data)=>{
          console.log(data);
          name=data;
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
        f_answer+=1;
       // console.log(f_answer);
      if(f_answer%2==0)  addVideoStream(video, userVideoStream, peers[call.peer].name,call.peer);
      });
      call.on('close', () => {
      // video.remove();
     // userLeft(call.peer);
      delete peers[call.peer];
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

  });

    socket.on("user-connected", (userId, userName) => {
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
  let join_permission=confirm("Let ${userName} join?");

  if(join_permission) call.on("stream", (userVideoStream) => {
    // console.log("user called");
    f_call+=1;
    if(f_call%2==0){ 

      addVideoStream(video, userVideoStream,userName,call.peer);}
  });
  call.on('close', () => {
      // video.remove();
     // userLeft(userId);
      delete peers[userId];
  })},1000);
};

socket.on('user-disconnected', (peerId,name) => {
  console.log("user disconnected", name);
  userLeft(peerId);
  if (peers[peerId].call) peers[peerId].call.close()
  delete peers[peerId];
})

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user);
  peers[id]={'call':peer,'name':user};
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});


const addVideoStream = (video, stream, userName,peerId) => {
  console.log(userName);
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();

    let container = document.createElement('div');
    container.classList.add("container");
    container.setAttribute('id', peerId);
    let name = document.createElement('div');
    name.classList.add("overlayText");
    let p = document.createElement('p');
    p.setAttribute('id', 'topText');
    p.innerHTML = userName;
    name.append(p);
    container.append(video);
    console.log(container.innerHTML);
    let v = container.hasChildNodes();
    console.log(v);
    container.append(name);
   
    if(v) videoGrid.append(container);

  });
};

const userLeft = (peerId) =>{
  let toRemove = document.getElementById(peerId);
  toRemove.remove();
};


let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");


//sending message to the room
send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

//enabling enter key for sending the message
text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
const endCall = document.querySelector("#endCall");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    muteButton.style.backgroundColor = '#f6484a';
    muteButton.innerHTML = `<i class="fas fa-microphone-alt-slash"></i>`;
    muteButton.title = 'mute';
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    muteButton.style.backgroundColor = '#546e7a';
    muteButton.innerHTML = `<i class="fas fa-microphone-alt"></i>`;
    muteButton.title = 'unmute';
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;

    //icon
    stopVideo.style.backgroundColor = '#f6484a';
    stopVideo.innerHTML = `<i class="fas fa-video-slash"></i>`;
    stopVideo.title="video off";
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    stopVideo.style.backgroundColor = '#546e7a';
    stopVideo.innerHTML = `<i class="fas fa-video"></i>`;
    stopVideo.title="video on";
  }
});

inviteButton.addEventListener("click", (e) => {
   var inviteLink = document.body.appendChild(document.createElement("input"));
   inviteLink.value = window.location.href;
  inviteLink.focus();
  inviteLink.select();
  document.execCommand('copy');
  inviteLink.parentNode.removeChild(inviteLink);
  alert('invite link is copied!');

});



//for show participants
const participants = document.getElementById('participants');
participants.addEventListener("click", (e) => {
  list.innerHTML = '';
  for(const key in peers){
    let entry = document.createElement('li');
    entry.innerHTML = peers[key].name;
     list.appendChild(entry);
  }
  let index = document.getElementById("users-list").style.zIndex;
 if(index === '-1')  {
  document.getElementById("users-list").style.zIndex = '5000';
 }
});

document.addEventListener('mouseup', function(e) {
    var container = document.getElementById('users-list');
    if (!container.contains(e.target) && container.style.zIndex!=='-1') {
        container.style.zIndex = '-1';
    }
});

//for end call button
endCall.addEventListener('click', (e) => {
 let endcall = confirm("Do you want to leave this call?");
 if(endcall){
  window.location.href = '/';
 }
});

function time(){
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("timer").innerHTML = h + ":" + m + ":" + s;
  setTimeout(time,1000);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}