//firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, get, set, update, remove, ref, child } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvdAGJIOWai0iYgBBq5qloGy6-VZJIC1E",
    authDomain: "ip-tracker-de1c0.firebaseapp.com",
    projectId: "ip-tracker-de1c0",
    storageBucket: "ip-tracker-de1c0.appspot.com",
    messagingSenderId: "41099800178",
    appId: "1:41099800178:web:a6b47c097bf9627d5b9ceb"
  };
  
  
  
  //initialize Firebase
  const trackerApp = initializeApp(firebaseConfig);
  const trackerDatabase=getDatabase(); 
  const trackerdbref= ref(trackerDatabase);
  
  //page on load
  window.addEventListener("load",()=>{
    if(localStorage.getItem("user-login-creds")!==null){
        console.log(localStorage.getItem("user-login-creds"))
get(child(trackerdbref,"UserData/"+localStorage.getItem("user-login-creds"))).then((snapshot)=>{
    noticeFromBuddy.value=`${snapshot.val().billBoardMsg} from ${snapshot.val().dbFirstName} last updated on ${snapshot.val().lastUpdated}`
    console.log(snapshot.val().billBoardMsg)
    console.log(noticeFromBuddy.value)
}).catch(((err)=>{
    alert(err)
}))
    }
    else{
        confirm("Seems like this was your first time or you cleared your cache.")
    }
  })

//reload button
let reloadButton=document.querySelector("#reload-button");

console.log(reloadButton)
reloadButton.addEventListener("click",(e)=>{
    window.location.reload();

})

let mapContainer=document.querySelector(".map-container");
let roomJoinButton=document.querySelector("#room-button");
let roomCodeInput=document.querySelector("#room-input")
let roomContainer=document.querySelector(".room-container");
let findMe=document.querySelector("#find-me");
let myBuddy=document.querySelector("#find-my-buddy");
let findMeContainer=document.querySelector(".find-me-container");
console.log(roomCodeInput.value,"outside");
let trackerNoticeButton=document.querySelector("#notice-board-message-button");
let messageBox=document.querySelector("#message-box");
let noticeFromBuddy=document.querySelector("#notice-from-buddy");
let uidForTracker=localStorage.getItem("user-login-creds") || "";

//map variable
let map=L.map("map");
let lat,lng,zoomLevel=15;
let entryOk=zoomLevel;
let compare;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: zoomLevel,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let customIcon=L.icon({
    iconUrl: "./img/pin.png",
    iconSize: [50,50]
})
let currentPointer;
navigator.geolocation.getCurrentPosition(currentPosition,err);
function currentPosition (pos){
    
    lat=pos.coords.latitude;
    lng=pos.coords.longitude;
    map.setView([lat,lng],zoomLevel);
    L.marker([lat,lng],{
    title: "You are here",
    icon: customIcon
 }).addTo(map);
currentPointer=  L.circle([lat,lng]).addTo(map);
    findMe.addEventListener("click",(e)=>{
        map.fitBounds(currentPointer.getBounds())
    })
    
}
map.addEventListener("zoom",()=>{
    console.log("triggered")
    console.log(map.getZoom());
    compare=map.getZoom()
})



//buddy status
let buddyStatus=document.querySelector("#buddy-status")

// notice board
let count=0
trackerNoticeButton.addEventListener("click",(e)=>{
    if(uidForTracker.length>3){
        
        get(child(trackerdbref,"UserData/"+uidForTracker)).then((snapshot)=>{
            noticeFromBuddy.value=`${snapshot.val().billBoardMsg} from ${snapshot.val().dbFirstName} last updated on ${snapshot.val().lastUpdated}`
            console.log(snapshot.val().billBoardMsg)
        }).catch(((err)=>{
            alert(err)
        }))
    }
    else{
        alert("May be you cleared your cache or this will be your first time.")
    }
    console.log(messageBox.style.zIndex)
    console.log(typeof(messageBox.style.zIndex))
        messageBox.style.zIndex="150"
        count++
        console.log(count)
        if(count>1){
            count=0
            messageBox.style.zIndex="-5"
        }
        
})


//server data
let serverUrl=`${window.location.protocol === "http:" ? "ws" : "wss"}://${window.location.host}`;
const socket=io(serverUrl);

roomJoinButton.addEventListener("click",(e)=>{
       if(true){
           roomContainer.style.zIndex="-1"
           mapContainer.style.zIndex="6"
           findMeContainer.style.zIndex="10"
           socket.emit("join-room",(roomCodeInput.value))
           console.log(roomCodeInput.value)
           console.log("tracker joined in", roomCodeInput.value)



socket.on("connect",()=>{
    console.log("tracker is connected")
})

socket.on("buddy-status",(userStatus)=>{
    console.log("received user status in tracker", userStatus)
    if(userStatus[0]){
        buddyStatus.textContent="Offline"
        console.log(buddyStatus+"Offline")
    }
    else{
        buddyStatus.textContent="Online"
        console.log(buddyStatus+"Online")
    }
})

    
socket.on("serverMsg",(msg)=>{
    console.log(msg)
}) 


let rec=0
let pointer,markerPoint,enter=0;
socket.on("buddyLocation",(buddyLocationArr)=>{
console.log(rec++,"rec")
console.log(buddyLocationArr[3],"user uid")
uidForTracker=buddyLocationArr[3];
localStorage.setItem("user-login-creds",uidForTracker)
if(compare!==zoomLevel){
    console.log("compare triggered")
    entryOk=compare;
}
get(child(trackerdbref,"UserData/"+buddyLocationArr[3])).then((snapshot)=>{
    noticeFromBuddy.value=`${snapshot.val().billBoardMsg} by ${snapshot.val().dbFirstName}`
    console.log(snapshot.val().billBoardMsg)
}).catch(((err)=>{
    alert(err)
}))

console.log(map.getZoom());


//map data

// L.control.getPosition();
// map.setView([buddyLocationArr[0],buddyLocationArr[1]],zoomLevel);

// //zoomIn
// let zoomIn=document.querySelector(".leaflet-control-zoom-in leaflet-disabled");
// zoomIn.addEventListener("click",(e)=>{
//     console.log("zoomed")
// })


//your location data
navigator.geolocation.watchPosition(success,err);

//marker

if(enter>0){
    map.removeLayer(markerPoint)
    map.removeLayer(pointer)
    console.log("pointer removed")
 }

markerPoint=L.marker([buddyLocationArr[0],buddyLocationArr[1]],{
    title: "buddy is here",
    icon: customIcon
 }).addTo(map);
 pointer= L.circle([buddyLocationArr[0],buddyLocationArr[1]]).addTo(map);
if(entryOk==zoomLevel){
    console.log("entry ok");
    console.log("--> entry ok", entryOk," --> zoom level", zoomLevel,"--> compare", compare)
    map.fitBounds(pointer.getBounds())
    entryOk=zoomLevel
}

enter++
myBuddy.addEventListener("click",(e)=>{
    map.fitBounds(pointer.getBounds())
    entryOk=zoomLevel;

})

})

}
})

let trackerMarkerPoint,trackerPointer,trackerEnter=0
function success(pos){
    
    lat=pos.coords.latitude;
    lng=pos.coords.longitude;
    
    let customIcon=L.icon({
        iconUrl: "./img/pin.png",
        iconSize: [50,50]
    
    })

    if(trackerEnter>0){
        map.removeLayer(trackerMarkerPoint)
        map.removeLayer(trackerPointer)
        console.log("pointer removed")
     }

  trackerMarkerPoint=  L.marker([lat,lng],{
       title: "You are here",
       icon: customIcon
    }).addTo(map);
  trackerPointer=  L.circle([lat,lng]).addTo(map);
  trackerEnter++
  //find me 
  findMe.addEventListener("click",(e)=>{
    // entryOk=zoomLevel; by commenting this line will eliminate the auto focus to buddy location.
    map.fitBounds(trackerPointer.getBounds())
    entryOk=zoomLevel+1;
  })
}

//


//

function err(){
    if(err.code===1){
                alert("Allow geo location access")
            }
            else{
                alert("Something went gone. Check your connection")
            }
}



