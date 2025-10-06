const formpop = document.querySelector("#profile-popup");
const cross = document.querySelector(".fa-xmark");
const newsletterbutton = document.querySelector("#newLetter button");
let successpop = document.querySelector(".success-popUp");
const editbtn = document.querySelector("#edit");
const newLetterEmail = document.querySelector("#newLetter-email");
const emailOutput = document.querySelector("#email-output");
//newsletter button

function createSuccessPopUp(){
  if(!successpop){
   successpop = document.createElement("div");
   successpop.className ="success-popUp";
   successpop.innerHTML= `<h2>Success</h2> 
   <img src="IMAGE/tick.webp" alt="">`;
   document.body.appendChild(successpop);
  }
  
}


if(newsletterbutton){
newsletterbutton.addEventListener("click",(e)=>{
  createSuccessPopUp();
  if(newLetterEmail.checkValidity() && newLetterEmail.value !=="")  {
    newLetterEmail.value ="";
    document.querySelector(".success-popUp").classList.add("active");
    

    setTimeout(()=>{
     document.querySelector(".success-popUp").classList.remove("active");
    },1000);
}else{
  emailOutput.textContent =`Enter a valid email`;
  setTimeout(()=>{
     emailOutput.textContent =``;
    },1000)
}
    
})
} 



//edit page


if(editbtn){
editbtn.addEventListener("click",()=>{  
formpop.classList.add("active");
document.body.style.overflow = "hidden";
})
}

if(cross){
cross.addEventListener("click",()=>{
formpop.classList.remove("active");
document.body.style.overflow = "auto";
}) 
}

//create loader
function createLoader(){
  if(document.querySelector("#loader"))return ;
  const loaderLayOver = document.createElement("div");
  loaderLayOver.id = "loader";
  loaderLayOver.className ="loader-overlay";
  loaderLayOver.innerHTML= `<div class="loader"></div>`;

  document.body.appendChild(loaderLayOver);
}
//Show the loader
export function showLoader(){
  createLoader();
  document.querySelector("#loader").style.visibility = "visible";
  document.body.style.overflow = "hidden";
}
//Hide the loader
export function hideLoader(){
  const loader = document.querySelector("#loader");
  if(loader){
    loader.style.visibility = "hidden";
    document.body.style.overflow = "auto";
  }
}