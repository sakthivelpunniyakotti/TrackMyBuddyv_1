//firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getDatabase, set, ref,get, child  } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

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
const databaseref=ref(database)
const auth= getAuth(app);

let activeAccount=0;


 

let lock=document.querySelector("#lock");
let unlock=document.querySelector("#unlock");
let passwordInput=document.querySelector("#password");
let submitButton=document.querySelector(".submit-button");
let firstName=document.querySelector("#first-name");
let lastName=document.querySelector("#last-name");
let mailId=document.querySelector("#mail-id");
let confirmPassword=document.querySelector("#confirm-password");
let reloadPage=document.querySelector(".reload")

//reload
reloadPage.addEventListener("click",(e)=>{
    window.location.reload();
})

lock.addEventListener("click",(e)=>{
   unlock.style.display="block";
   e.target.style.display="none";
   passwordInput.type="text";
   confirmPassword.type="text"

})

unlock.addEventListener("click",(e)=>{
    lock.style.display="block";
    e.target.style.display="none";
    passwordInput.type="password";
})

submitButton.addEventListener("click",(e)=>{
    //initial validation
    let fName=firstName.value
    let lName=lastName.value
    let mName=mailId.value
    let pName=passwordInput.value
    let cpName=confirmPassword.value
    console.log(fName);
    console.log(fName.length);
    console.log(typeof(fName))
    if((fName.length<=0|| lName.length<=0 || mName.length<=0 || pName.length<=0 || cpName<=0  )) {
            alert("pls enter valid input!")
            return 
    }
    else{
        let mailValidationStr=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(mailId.value.match(mailValidationStr)){
           console.log("mail valided");
           if(confirmPassword.value===passwordInput.value){
            console.log("confirm password matched")
            if(cpName.length>=6){
                createUserWithEmailAndPassword(auth, mName, cpName)
               .then(function(credentials){
                console.log(credentials)
                let currentDate= new Date().toLocaleString();
                // console.log(currentDate.toString());
                //storing data in the fairebase
                set(ref(database, "UserData/"+credentials.user.uid),{
                    dbFirstName: fName,
                    dbLastName: lName,
                    dbMailId: mName,
                    billBoardMsg: "Nothing to show",
                    lastUpdated: currentDate,
                    logins: activeAccount
                })
                console.log("data stored successfully")
                

                get(child(databaseref,"UserData/"+credentials.user.uid)).then((snapshot)=>{
                    if(snapshot.exits){
                        window.location.href="buddyLogin"
                    }    
                    else{
                        window.location.href="index"
                    }          
                }).catch(((err)=>{
                    alert(err)
                }))
                console.log("after buddy login")
                alert("successfully created")
               })
               .catch(function(err){
                let error=err.code;
                let errMsg=err.message;
                 
                alert(errMsg);
               })
            }
            else{
                alert("Password must be more than 6 characters.")
            }
           }
           else{
            alert("Password don't match. Pls check the password")
             passwordInput.autofocus;
           }
        }
        else{
            alert("pls enter valide mail Id!")
            mailId.autofocus;
            return ;
        }
    }
    
    console.log(passwordInput.value,typeof(firstName.value))
    if((passwordInput.value==="RC") && firstName.value==="Admin" ){
        console.log(passwordInput.value,typeof(firstName.value))

        createButton.style.display="block";
        e.target.style.display="none"
        createButton.style.transform="rotate(360deg)";
        createButton.style.transition="transform 1s"
    }
})

