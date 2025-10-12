import {loadPage} from "../pagination.js";

const nextBtn = document.querySelector("#next-page");
const prevBtn = document.querySelector("#prev-page");

let currentPage = 1;
let hasNext=true;

nextBtn.addEventListener("click",async()=>{
    if(hasNext){
        currentPage++;
        await loadPage(true);
    }
});

prevBtn.addEventListener("click",async()=>{
    if(currentPage>1){
        currentPage--;
        await loadPage(false);

    }
});

document.addEventListener("pageLoaded",(e)=>{
const {currentPage:page, hasNext:next} = e.detail;

hasNext=next;

if(!hasNext){
    nextBtn.disabled = true;
    nextBtn.style.visibility="hidden";
}else{
    nextBtn.disabled = false;
    nextBtn.style.visibility="visible";
}

if(page ===1){
    prevBtn.disabled = true;
    prevBtn.style.visibility="hidden";
}else{
    prevBtn.disabled = false;
    prevBtn.style.visibility="visible";
}
})