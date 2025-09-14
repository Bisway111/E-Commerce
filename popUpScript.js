const popPhoto = document.querySelector(".photo-popup-img");
const fileImage = document.querySelector("#profile-popup #file-popup");
const formpop = document.querySelector("#profile-popup");
const cross = document.querySelector(".fa-xmark");
const newsletterbutton = document.querySelector("#newLetter button");
let successpop = document.querySelector(".success-popUp");
const editbtn = document.querySelector(".profile-details button");
const newLetterEmail = document.querySelector("#newLetter-email");
const emailOutput = document.querySelector("#email-output");
//newsletter button
(()=>{
  if(!successpop){
   successpop = document.createElement("div");
   successpop.className ="success-popUp";
   successpop.innerHTML= `<h2>Success</h2> 
   <img src="IMAGE/tick.webp" alt="">`;
   document.body.appendChild(successpop);
  }
  
})()




newsletterbutton.addEventListener("click",(e)=>{
  if(newLetterEmail.checkValidity() && newLetterEmail.value !=="")  {
    newLetterEmail.value ="";
    successpop.classList.add("active");

    setTimeout(()=>{
      successpop.classList.remove("active");
    },1000);
}else{
  emailOutput.textContent =`Enter a valid email`;
  setTimeout(()=>{
     emailOutput.textContent =``;
    },1000)
}
    
})
  



//edit page
if(fileImage){
fileImage.addEventListener("change",()=>{
    const file = fileImage.files[0];
    
    if(file){
        console.log(file.name);
      popPhoto.style.backgroundImage = `url(${URL.createObjectURL(file)} )`;
        
    }
})
}
if(editbtn){
editbtn.addEventListener("click",()=>{  
formpop.classList.add("active");
})
}

if(cross){
cross.addEventListener("click",()=>{
formpop.classList.remove("active");
}) 
}