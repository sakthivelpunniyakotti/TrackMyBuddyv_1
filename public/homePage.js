let devInfoButton= document.querySelector("#developer-info-button");
let infoCard=document.querySelector(".info-card");
let cancelButton=document.querySelector("#cancel-button");
let centerBox=document.querySelector(".center-box");
let horizontalScroll=document.querySelector(".horizontal-scroll");
let createOneButton=document.querySelector("#create-one-button");
let signUpButton=document.querySelector("#sign-up");
let loginButton=document.querySelector("#login");
let loginCancelButton=document.querySelector("#login-cancel");

devInfoButton.addEventListener("click",(e)=>{
        infoCard.style.zIndex="4"
        infoCard.style.transform="rotate(360deg)"
        centerBox.style.transform="rotate(0deg)"
        infoCard.style.transition="transform 1s"
        console.log("successfull")
})

cancelButton.addEventListener("click",(e)=>{
   infoCard.style.zIndex="-1"
   centerBox.style.transform="rotate(360deg)"
   infoCard.style.transform="rotate(0deg)"
   centerBox.style.transition="transform 1s"
})

createOneButton.addEventListener("click",(e)=>{
        horizontalScroll.style.zIndex="5";
        signUpButton.style.transform="translateX(170px)";
        loginButton.style.transform="translateX(-170px)";
        signUpButton.style.transition="transform 1s"
        loginButton.style.transition="transform 1s"

})

loginCancelButton.addEventListener("click",(e)=>{
        horizontalScroll.style.zIndex="-1";
        signUpButton.style.transform="translateX(10px)";
        loginButton.style.transform="translateX(10px)";
        signUpButton.style.transition="transform 1s"
        loginButton.style.transition="transform 1s"
})

signUpButton.addEventListener("click",()=>{
        horizontalScroll.style.zIndex="-1";
        signUpButton.style.transform="translateX(10px)";
        loginButton.style.transform="translateX(10px)";
       
})

loginButton.addEventListener("click",()=>{
        horizontalScroll.style.zIndex="-1";
        signUpButton.style.transform="translateX(10px)";
        loginButton.style.transform="translateX(10px)";
})




