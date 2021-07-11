const socket = io("/");

// sessionStorage.setItem("name", "gagandeep kaur");
let user;
if(sessionStorage.getItem("user")){
  user = sessionStorage.getItem("user")
}
else{
  user = prompt("Enter your name");
  while(user === '' || user === null){
    user = prompt("Enter your name again");
  }
  sessionStorage.setItem("user", user);
}
var peer = new Peer();

peer.on("open", (id) => {
  console.log("room joined!!!")
  socket.emit("join-chat", ROOM_ID, id, user);
 // peers[id]={'call':peer,'name':user};
});

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

socket.on("createMessage", (message, userName,time) => {
  console.log("Haan message created!");
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
      <div class="msg">
        <b>${
          userName
        } </b>
         <b class="time-in-message">${time}</b>
         </div>
        <span>${message}</span>
    </div>`;
});





//sending message to the room
send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("chat", text.value, document.querySelector('#timer').innerHTML);
    text.value = "";
  }
});

//enabling enter key for sending the message
text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("chat", text.value, document.querySelector('#timer').innerHTML);
    text.value = "";
  }
});
let joinMeet = document.querySelector('#meet-join');

joinMeet.addEventListener("click", (e) => {
   window.location.href = `/engage/${ROOM_ID}`;
   chatPage=1;
});


//leave-chat
let chatLeave = document.querySelector('#leave-chat');

chatLeave.addEventListener("click", (e) => {
   let leaveChat = confirm("Do you want to leave this chat?");
 if(leaveChat){
  sessionStorage.clear();
  window.location.href = '/';
 }
});

//timer
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
