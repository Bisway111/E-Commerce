const bar = document.querySelector("#bar");
const nav = document.querySelector("#navbar");
const cenncel = document.querySelector("#close");
const sbtn = document.querySelector("#shopBtn");


//// making shope working to redirect to shop page 
//first check if true then run otherwise it give a erron and rest of the code will not run and that make hamburgernot working 
if(sbtn){

sbtn.addEventListener("click",()=>{
window.location.href = "shope.html";
})
}


//// Hambuger Creation 
//Add Active to navbar
bar.addEventListener("click",()=>{
nav.classList.add("active");

})

//Remove Active from navbar
cenncel.addEventListener("click",()=>{
    nav.classList.remove("active");
})

