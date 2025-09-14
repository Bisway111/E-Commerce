const mainImg = document.querySelector("#MainImg");
const smallImg = document.querySelectorAll(".small-img-col img");
const products = document.querySelectorAll(".pro");
const brandName = document.querySelector(".single-pro-deatils span");
const productName = document.querySelector(".single-pro-deatils h4");
const Star = document.querySelector(".single-pro-deatils star");
const price = document.querySelector(".single-pro-deatils h2");

////Set Image on Sproducts Main product

//adding small img to main img when click
smallImg.forEach((img)=>{
    img.addEventListener("click",()=>{
    mainImg.src = img.src;
})
})


//adding img from other page to sproduct main img 
products.forEach((product)=>{
    product.addEventListener("click",()=>{
    const img = product.querySelector("img");
    const probrandName = product.querySelector("span");
    const proName = product.querySelector("h5");
    const proStar = product.querySelector(".star"); 
    const proPrice = product.querySelector("h4");
  
    const imgURL = encodeURIComponent(img.src) ;//Use it when wants to use URL path to get data (It's called Query Parameter)
    const probrandNameURL = encodeURIComponent(probrandName.textContent);
    const proNameURL = encodeURIComponent(proName.textContent);
    const proStarURL = encodeURIComponent(proStar.textContent); 
    const proPriceURL = encodeURIComponent(proPrice.textContent);
// localStorage.setItem("SelectImg",img.src); // Use it when wants to use browsers storage

    window.location.href = `sproduct.html?img=${imgURL}&brandName=${probrandNameURL}&proName=${proNameURL}&stars=${proStarURL}&price=${proPriceURL}`;

    })
})

window.addEventListener("DOMContentLoaded",()=>{

   //const storedIMG = localStorage.getItem("SelectImg");// Use it when wants to use browsers storage

  const fistSImg = document.querySelector(".small-img-col img");

  
   const param = new URLSearchParams(window.location.search);//Use it when wants to use URL path to get data (It's called Query Parameter)
   const sImg = param.get("img");
   const sbrandName = param.get("brandName");
   const sproductName = param.get("proName");
   const sStar = param.get("stars");
   const sprice = param.get("price");

   

   if(sImg && mainImg){
    mainImg.src = sImg;
    fistSImg.src =  mainImg.src ;
   }
   
   if(sbrandName && brandName){
    brandName.textContent = sbrandName;
   }
   if(sproductName  && productName){
    productName.textContent = sproductName;
   }
    if(sproductName  && productName){
    productName.textContent = sproductName;
   }
   if(sStar && Star){
   Star.textContent = sStar;
   }
   if(sprice && price){
    price.textContent = sprice;
   }
     if(mainImg){
   fistSImg.src =  mainImg.src ;
   }

})
