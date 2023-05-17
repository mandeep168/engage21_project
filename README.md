# engage21_project

## Video Conferencing Web Application

Site is live at https://engage21-clone-project.herokuapp.com/

![image](https://user-images.githubusercontent.com/64517334/125493326-797a1c0d-d03c-46ee-a078-6e1855b4b847.png)



## Technologies used
<b>socket.io</b><br>
Socket.IO is a JavaScript library for realtime web applications. It enables realtime, bi-directional communication between web clients and servers. It has two parts: a client-side library that runs in the browser, and a server-side library for Node.
<br>

<b>peerjs</b><br>
PeerJS takes the implementation of WebRTC in your browser and wraps a simple, consistent, and elegant API around it. It is used for setting up the video and data connection
<br>

<b>Nodejs</b><br>
Nodejs is used for creating backend APIs
<br>

<b>Express</b><br>
For writing the logic in backend
<br>

<b>ejs</b><br>
for injecting data into the HTML template at the client-side like roomID and produce the final HTML.
<br>

<b>Javascript</b><br>
For making the web pages interactive, by event listeners 
<br>

<b>CSS</b><br>
for styling the application
<br>

<b>uuid</b><br>
For generating dynamic room ids
<br>

<b>mongoose</b><br>
Used for connecting application to mongodb cluster for storing messages
<br>

<b>cors</b><br>
“CORS” stands for Cross-Origin Resource Sharing. It allows you to make requests from one website to another website in the browser, which is normally prohibited by another browser policy<br>

For icons I have used www.fontawesome.com

## Steps to run the project locally

* Clone the project in a folder<br>
* Go to the folder containing <b><i>package.json</i></b> file<br>
* Open terminal in that folder and run <b><i>npm install </i></b> then <br>
* run the command <b><i>nodemon server.js</i></b> and <b><i>open localhost:5001</i></b> in the browser (Google chrome is recommended)
