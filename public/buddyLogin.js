//firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getDatabase, get,update, ref, child } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

let loginCredentials;

//firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvdAGJIOWai0iYgBBq5qloGy6-VZJIC1E",
    authDomain: "ip-tracker-de1c0.firebaseapp.com",
    projectId: "ip-tracker-de1c0",
    storageBucket: "ip-tracker-de1c0.appspot.com",
    messagingSenderId: "41099800178",
    appId: "1:41099800178:web:a6b47c097bf9627d5b9ceb"
  };

//initialize Firebase
const app = initializeApp(firebaseConfig);
const database=getDatabase();
const auth= getAuth(app);
const dbref= ref(database)

let allowedLogin=3;
let activeAccounts;

let lock=document.querySelector("#lock");
let unlock=document.querySelector("#unlock");
let passwordInput=document.querySelector("#password");
let submitButton=document.querySelector(".submit-button");
let createButton=document.querySelector(".create-button");
let reload=document.querySelector(".reload");
let mail=document.querySelector("#user-name");

//reload 
reload.addEventListener("click",(e)=>{
    window.location.reload();
})


lock.addEventListener("click",(e)=>{
   unlock.style.display="block";
   e.target.style.display="none";
   passwordInput.type="text";

})

unlock.addEventListener("click",(e)=>{
    lock.style.display="block";
    e.target.style.display="none";
    passwordInput.type="password";
})

submitButton.addEventListener("click",(e)=>{
    gateWay(e);
})

document.body.addEventListener("keydown",(e)=>{
    
    if(e.key==="Enter"){
        gateWay(e);
    }
})

createButton.addEventListener("click",(e)=>{
           e.target.style.display="none";
        

})

function gateWay (e){
    console.log(passwordInput.value,mail.value)
    //initial validation
    let eName=mail.value;
    let pName=passwordInput.value;
    if(eName<=0 || pName <=0){
        alert("input field shouldn't be empty")
        return 
    }
    else{

        signInWithEmailAndPassword(auth,eName,pName)
        .then((Credential)=>{
            console.log(Credential)
            createButton.style.display="block";
            e.target.style.display="none"
            createButton.style.transform="rotate(360deg)";
            createButton.style.transition="transform 1s";

            // get(child(dbref,"UserData/"+Credential.user.uid)).then((snapshot)=>{
            //     activeAccounts=snapshot.val().logins
            //     console.log(activeAccounts)
            // })
        
            // setInterval(() => {
                
            //     if(typeof(activeAccounts)===typeof(3)){
            //         update(ref(database, "UserData/"+Credential.user.uid),{
            //             logins: activeAccounts++
            //         })
            //        clearInterval();
            //     }
            // }, 1500);

            get(child(dbref,"UserData/"+Credential.user.uid)).then((snapshot)=>{
                console.log(Credential.user.uid)
                activeAccounts=snapshot.val().logins
                console.log(activeAccounts)
                localStorage.setItem("login-credentials",(Credential.user.uid))

             //    if(snapshot.exits){
                    localStorage.setItem("user-info",JSON.stringify({
                        loginFirstName: snapshot.val().dbFirstName,
                        loginLastName: snapshot.val().dbLastName,
                        LoginMailId: snapshot.val().dbMailId
                    }))
                   
                    update(ref(database, "UserData/"+Credential.user.uid),{
                        logins: ++activeAccounts
                    })
                    console.log(activeAccounts)
                    console.log("checking before snapshot")
                localStorage.setItem("user-creds", JSON.stringify(Credential.user));
                console.log(localStorage.getItem("user-info"))
                if(snapshot.val().logins<allowedLogin){
                    window.location.href="buddy"
                }
                else{
                    alert(`Only allow ${allowedLogin} login as default`)
                    let userId=localStorage.getItem("login-credentials")
                     update(ref(database, "UserData/"+userId),{
                       logins: --activeAccounts
                       })
                    window.location.href="index"

                }
                // }
                //  else{
                //     alert("User data still not stored!!! Pls wait for few minutes")
                //     window.location.href="index"

                //  }

            })
        })
        .catch((error)=>{
            alert(error)
        })
       
    }
}