
const videoGrid = document.getElementById("video-grid");
const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
const participants = document.getElementById('participants');
const endCall = document.querySelector("#endCall");
const showChat = document.querySelector("#showChat");
const text = document.querySelector("#chat_message");
const send = document.getElementById("send");
const handRaise = document.querySelector('#raiseHand');


//function to display time in the meet
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


// function to add zeros in front to single digit numbers
function checkTime(i) {
  if (i < 10) {i = "0" + i}; 
  return i;
}



//event listener for mute button
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


//event listener for video buttton
stopVideo.addEventListener("click", () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
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


//event listener for chat button
showChat.addEventListener("click", () => {
  let chatDisplay = document.querySelector(".main__right").style.display;

  if(chatDisplay==="flex" ){
      document.querySelector(".main__right").style.display = "none";
       document.querySelector(".main__left").style.flex = "1";
        document.querySelector("#chat-dot").style.zIndex = '-1';
  }else{
      document.querySelector(".main__right").style.display = "flex";
      document.querySelector(".main__right").style.flex = "0.3";
      document.querySelector(".main__left").style.flex = "0.7";
      document.querySelector("#chat-dot").style.zIndex = '-1';
  }
});


//event listener for the invite button
inviteButton.addEventListener("click", (e) => {
   var inviteLink = document.body.appendChild(document.createElement("input"));
   inviteLink.value = window.location.href;
  inviteLink.focus();
  inviteLink.select();
  document.execCommand('copy');
  inviteLink.parentNode.removeChild(inviteLink);
  alert('invite link has been copied!');


});



//for show participants
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
   // else {
   //  document.getElementById("users-list").style.zIndex = '-1';
   // }
});

//clicking ouside the participants box we can make it disapear
document.addEventListener('mouseup', function(e) {
    var container = document.getElementById('users-list');
    if (!container.contains(e.target) && container.style.zIndex!=='-1') {
        container.style.zIndex = '-1';
    }
});


//add 2 event listeners for raising and lowering hands

//Event listener for raising hand
handRaise.addEventListener("click", (e)=>{  
  let hand_cont = document.getElementById('0');
  let hand_icon = hand_cont.querySelector('i');
  if(handRaise.style.color === 'yellow')  { 
   handRaise.style.color = 'white';
   handRaise.title='raise hand';
   hand_icon.style.zIndex = '-1';
  }
  else{
   handRaise.style.color = 'yellow';
   handRaise.title='lower hand';
   hand_icon.style.zIndex = '1';

  }
  socket.emit('raise-hand');
  
});

//for end call button
endCall.addEventListener('click', (e) => {
 let endcall = confirm("Do you want to leave this call?");
 if(endcall){
  window.location.href = `/chat/${ROOM_ID}`;
 }
});

//adding user video to the room
const addVideoStream = (video, stream, userName,peerId) => {
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
    
    let i = document.createElement('i');
    i.classList.add("fas");
    i.classList.add("fa-hand-paper");
    i.classList.add("hand");
    container.append(video);
    container.append(i);
    container.append(name);
    videoGrid.append(container);

  });
};

// for removing the video if user left the meet
const userLeft = (peerId) =>{
  let toRemove = document.getElementById(peerId);
  toRemove.remove();
};





//sending message to the room
send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value, document.querySelector('#timer').innerHTML);
    text.value = "";
  }
});


//enabling enter key for sending the message
text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value, document.querySelector('#timer').innerHTML);
    text.value = "";
  }
});


