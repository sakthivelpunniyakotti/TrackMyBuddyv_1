const express = require("express");
const { Socket } = require("socket.io");
const app= express();
const path=require("path");

const http=require("http").Server(app);
const PORT = process.env.PORT || 8080;

//attaching http server to the socket.io
const io= require("socket.io")(http);

//buddy location data
let buddyLocationArr=[]

app.set("views",path.join(__dirname,"views"))
app.set("view-engine", "ejs")



app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
  res.render("index.ejs")
})

app.get("/index",(req,res)=>{
  res.render("index.ejs")
})

app.get("/buddylogin",(req,res)=>{
  res.render("buddyLogin.ejs")
})

app.get("/signUp",(req,res)=>{
  res.render("signUp.ejs")
})

app.get("/buddy",(req,res)=>{
    res.render("buddy.ejs")
  })

  app.get("/tracker",(req,res)=>{
    res.render("tracker.ejs")
  })

//creating connection
io.on("connection",(socket)=>{
    // console.log(socket.id)
    console.log("New User connected")
    
    socket.on("join-room",(roomCode)=>{
       console.log("join room is  working", roomCode)
      socket.join(roomCode)
    })


    socket.on("disconnect",()=>{
      
        console.log("User disconnected")
       
    })

    socket.on("user-disconnected",(userStatus)=>{
      console.log("user disconnected received successfully")
      socket.emit("buddy-status",userStatus)
      socket.emit("buddy-status",userStatus[0])
      socket.emit("buddy-status",userStatus[1])
     io.to(userStatus[1]).emit("buddy-status",userStatus)

      console.log("triggered buddy status", userStatus)
    })

    socket.on("buddyLocation",(location)=>{
        buddyLocationArr=[...location]
        console.log(location[0],location[1],"locationdata")
        io.to(location[2]).emit("buddyLocation",buddyLocationArr)
        console.log("data send to ",location[2])
      })
      
    socket.emit("serverMsg","i am from server")
   
})

http.listen(PORT,()=>{
    console.log("listening on the port "+PORT)
})







