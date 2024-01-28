//firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, get, set, update, remove, ref, child } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

let userId,activeAccounts;
window.addEventListener("load",()=>{
    let redirectLoginCredentials=(localStorage.getItem("login-credentials"));
    let redirectUserInfo=(localStorage.getItem("user-info"));
    let redirectUserCreds=(localStorage.getItem("user-creds"));
    
    if((redirectLoginCredentials || redirectUserCreds || redirectUserInfo) == null){
        window.location.href="buddylogin"
    }
    else{
         userId=localStorage.getItem("login-credentials")
         get(child(buddydbref,"UserData/"+userId)).then((snapshot)=>{
            activeAccounts= snapshot.val().logins;
            console.log(snapshot.val().logins)
        })
    }
    
})



window.addEventListener("beforeunload",(e)=>{
    console.log(activeAccounts)
    console.log(e.returnValue)
  e.returnValue
    if(true){
        console.log(e.returnValue)
        update(ref(buddyDatabase, "UserData/"+userId),{
            logins: --activeAccounts
        })
        console.log("before unload event triggered")
        localStorage.removeItem("login-credentials")
        localStorage.removeItem("user-info")
        localStorage.removeItem("user-creds")
        console.log("triggered offline event")

    }

})



let ipConfirmCancelButton= document.querySelector(".ip-confirm-button-cancel");
let ipAddressContainer=document.querySelector(".ipAdd-container");
let confirmContainer=document.querySelector(".confirm-container")
let ipAddShareButton=document.querySelector("#ip-add")
let confirmShareButton=document.querySelector("#confirm-share-button")
let buddyRoomId=document.querySelector("#room-id")
let buddyFindMe=document.querySelector("#buddy-location-find-me");
//login-info
let loginInfo=document.querySelector("#login-info");
let loginInfoBox=document.querySelector("#login-info-box");
let loginInfoCancelButton=document.querySelector("#login-info-cancel-button");
let userUid=(localStorage.getItem("login-credentials"));
let userName=document.querySelector("#user-name");
let lastUpdatedOn=document.querySelector("#last-updated");
let adminName=document.querySelector("#admin-name");
let noticeBoardMessage=document.querySelector("#notice-board-message");

//page visibility
let buddyStatus




const firebaseConfig = {
    apiKey: "AIzaSyCvdAGJIOWai0iYgBBq5qloGy6-VZJIC1E",
    authDomain: "ip-tracker-de1c0.firebaseapp.com",
    projectId: "ip-tracker-de1c0",
    storageBucket: "ip-tracker-de1c0.appspot.com",
    messagingSenderId: "41099800178",
    appId: "1:41099800178:web:a6b47c097bf9627d5b9ceb"
  };

  //initialize Firebase
const buddyApp = initializeApp(firebaseConfig);
const buddyDatabase=getDatabase();
const buddydbref= ref(buddyDatabase)

console.log(userUid)
noticeBoardUpdation();
function noticeBoardUpdation(){

    get(child(buddydbref,"UserData/"+userUid)).then((snapshot)=>{
        userName.textContent=`User Name is ${ snapshot.val().dbFirstName}`
        lastUpdatedOn.textContent=`Last updated on ${snapshot.val().lastUpdated}`
        adminName.textContent=`Edited by ${snapshot.val().dbFirstName}`
        if(snapshot.val().billBoardMsg.length<=0){
            noticeBoardMessage.value="Nothing to show !!!"
        }
        else{

            noticeBoardMessage.value=snapshot.val().billBoardMsg
        }

})
.catch(function(err){
    let error=err.code;
    let errMsg=err.message;
     
    alert(errMsg);
   })
}




//notice board data
let noticeBoardMsg=document.querySelector("#notice-board");
let noticeBoardButton=document.querySelector("#notice-board-button");
let noticeBoard=document.querySelector("#notice-board");
let noticeBoardCancelButton=document.querySelector("#notice-board-cancel-button");
let noticeMessage=document.createElement("p");
let loginInfoContainerBox=document.querySelector("#login-info-box");
let billBoardMsg=document.querySelector("#bill-board-msg");
let billBoardSendButton=document.querySelector("#message-button");

// let roomCode="RedCarpet"
let randomNumber=0;
let locationArr=[]
let authorize=false;
let zoomIn=true;

//firebase data
let userCreds= JSON.parse(localStorage.getItem("user-creds"));
let userInfo= JSON.parse(localStorage.getItem("user-info"));

//notice board message


console.log(userInfo,"use-info in map page")
let roomCode=userInfo.loginFirstName;
console.log("room code"+roomCode)
//bill board
billBoardSendButton.addEventListener("click",()=>{
    console.log(billBoardMsg.value)
    update(ref(buddyDatabase,"UserData/"+userUid),{
        dbFirstName: userInfo.loginFirstName,
        billBoardMsg: billBoardMsg.value,
        lastUpdated: (new Date().toLocaleString()).toString()
    })
     noticeBoardUpdation();
     loginInfoBox.style.zIndex="-1"




})


//login-info data
loginInfo.addEventListener("click",(e)=>{
      noticeBoard.style.zIndex="-1";
      loginInfoBox.style.zIndex="100"
})

loginInfoCancelButton.addEventListener("click",(e)=>{
    loginInfoBox.style.zIndex="-1"
})

//server data
let serverUrl=`${window.location.protocol === "http:" ? "ws" : "wss"}://${window.location.host}`;
const socket=io(serverUrl);


//map data
let lat,lng;




ipConfirmCancelButton.addEventListener("click",(e)=>{
      confirmContainer.style.zIndex="-1"
})

ipAddShareButton.addEventListener("click",(e)=>{
    confirmContainer.style.zIndex="6"
    //for custome room code
    // if(roomCode.length>=9){
    //     roomCode=userInfo.loginFirstName;
    // }
    // randomNumber=(Math.random()*1000).toFixed(0);
    // roomCode+=randomNumber;
    buddyRoomId.textContent=roomCode
    console.log(roomCode)
})

buddyFindMe.addEventListener("click",(e)=>{
    console.log("find me triggered without geolocation api")
    navigator.geolocation.getCurrentPosition(findMe,err,{
        enableHighAccuracy:true
    });
    console.log("find me completed")
})

confirmShareButton.addEventListener("click",(e)=>{
    confirmContainer.style.zIndex="-1"
    authorize=true
    zoomIn=true;
    socket.emit("join-room",(roomCode))
    navigator.geolocation.watchPosition(success,err,{
        enableHighAccuracy: true
    });

    
    
})

//map data
let map=L.map("map");
let zoomLevel=15;
let buddyLat=10,buddyLng=79.9397959
window.addEventListener("load",(e)=>{
    navigator.geolocation.getCurrentPosition(findMe,err,{
        enableHighAccuracy:true
    });
    
})
map.setView([buddyLat,buddyLng],zoomLevel);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: zoomLevel,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let customIcon=L.icon({
    iconUrl: "./img/pin.png",
    iconSize: [50,50]
})



let markerPoint,pointer,enter=0;
function success(pos){
    console.log("triggered")
    //buddy to server
    socket.on("connect",()=>{
        console.log(socket.id)
        console.log("connected")
    })

    document.addEventListener("visibilitychange",()=>{
        buddyStatus=document.hidden
        console.log(buddyStatus)
        socket.emit("user-disconnected",[buddyStatus,roomCode])
         console.log("user disconnected is triggered")
    })

    window.addEventListener("offline",()=>{
        buddyStatus=true
        socket.emit("user-disconnected",buddyStatus)
        console.log("user disconnected is triggered")

    })
    
 

    lat=pos.coords.latitude;
    lng=pos.coords.longitude;
    if(authorize==true){
        console.log(buddyStatus)
        socket.emit("buddyLocation",([lat,lng,roomCode,userUid,buddyStatus]))
        console.log("buddy joined in",roomCode)
        console.log("Buddy's location is transmitted successfully")
    }
    
     if(enter>0){
        map.removeLayer(markerPoint)
        map.removeLayer(pointer)
        console.log("pointer removed")
     }
     markerPoint= L.marker([lat,lng],{
        title: "You are here",
        icon: customIcon
    }).addTo(map);
    enter++;
     pointer= L.circle([lat,lng]).addTo(map);
     
     if(zoomIn){
        map.fitBounds(pointer.getBounds());
        zoomIn=false;
     }

     map.fitBounds(pointer.getBounds());

     buddyFindMe.addEventListener("click",(e)=>{
        map.fitBounds(pointer.getBounds());
     })
       
}


function err(){
    if(err.code===1){
                alert("Allow geo location access")
            }
            else{
                alert("Something went gone. Check your connection")
            }
}

function findMe(pos){
 
        console.log("triggered in findme")
        //find me
        
        lat=pos.coords.latitude;
        lng=pos.coords.longitude;
        
         if(enter>0){
            map.removeLayer(markerPoint)
            map.removeLayer(pointer)
            console.log("pointer removed")
         }
         markerPoint= L.marker([lat,lng],{
            title: "You are here",
            icon: customIcon
        }).addTo(map);
        enter++;
         pointer= L.circle([lat,lng]).addTo(map);
         map.fitBounds(pointer.getBounds())
}

//notice board
noticeBoardButton.addEventListener("click",(e)=>{
        loginInfoBox.style.zIndex="-1"
        noticeBoard.style.zIndex="100";
        console.log(userInfo)
})

noticeBoardCancelButton.addEventListener("click",(e)=>{
        noticeBoard.style.zIndex="-1";
})










