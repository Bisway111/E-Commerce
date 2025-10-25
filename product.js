import { getSingleProduct } from "./firebase-logics/getSingleProduct.js";
import { getRelatedProducts, getSmallProducts, addToCart} from "./firebase-logics/getRelatedProducts.js";
import { showLoader,hideLoader, adding } from "./popUpScript.js";

const productContainer = document.querySelector(".pro-container");
const featureProductName = document.querySelector("#featured-product-category");
const mainImg = document.querySelector("#big-img");
const smallImg = document.querySelectorAll(".small-img-col");
const category = document.querySelector(".single-pro-deatils h6");
const brandName = document.querySelector(".single-pro-deatils #brandName");
const productName = document.querySelector(".single-pro-deatils h4");
// const Star = document.querySelector(".single-pro-deatils star");
const price = document.querySelector(".single-pro-deatils h2");
const description = document.querySelector(".single-pro-deatils #descriptions");

////Set Image on Sproducts Main product

//adding small img to main img when click
smallImg.forEach((img)=>{
    img.addEventListener("click",()=>{
    const style = window.getComputedStyle(img);
     mainImg.style.backgroundImage = style.backgroundImage;
})
})


//adding img from other page to sproduct main img 
// products.forEach((product)=>{
//     product.addEventListener("click",()=>{
//     console.log("pro is clicked");
//     const img = product.querySelector("img");
//     const probrandName = product.querySelector("span");
//     const proName = product.querySelector("h5");
//     const proStar = product.querySelector(".star"); 
//     const proPrice = product.querySelector("h4");
  
//     const imgURL = encodeURIComponent(img.src) ;//Use it when wants to use URL path to get data (It's called Query Parameter)
//     const probrandNameURL = encodeURIComponent(probrandName.textContent);
//     const proNameURL = encodeURIComponent(proName.textContent);
//     const proStarURL = encodeURIComponent(proStar.textContent); 
//     const proPriceURL = encodeURIComponent(proPrice.textContent);
// // localStorage.setItem("SelectImg",img.src); // Use it when wants to use browsers storage

//     window.location.href = `sproduct.html?img=${imgURL}&brandName=${probrandNameURL}&proName=${proNameURL}&stars=${proStarURL}&price=${proPriceURL}`;

//     })
// })

window.addEventListener("DOMContentLoaded",async()=>{

   //const storedIMG = localStorage.getItem("SelectImg");// Use it when wants to use browsers storage
try{
  const fistSImg = document.querySelector(".small-img-col:nth-child(1)");
  const param = new URLSearchParams(window.location.search);//Use it when wants to use URL path to get data (It's called Query Parameter)
  const id = param.get("id");
  if(id){ 
    const product = await getSingleProduct(id);
      let data ;
   if(product){ 
    const data = product.data();
    if(data){
    mainImg.style.backgroundImage = `url("${data.image}")`;
    fistSImg.style.backgroundImage = `url("${data.image}")`;
    brandName.textContent = data.brand;
    productName.textContent = data.productName;
    category.textContent = data.category;
    price.textContent = `$${data.price}`;
    description.textContent = data.description;
    if(data.category!=="")featureProductName.textContent = data.category;


   if(data.category!=="") {
    const loadRelatedProducts = await getSmallProducts(data.category);
      renderSmallProdusts(loadRelatedProducts,id);
   }
   if(data.category!==""){
    const relatedProducts = await getRelatedProducts(data.category, id);
    renderProducts(relatedProducts);
     }
    }
   }
    }
   }catch(error){
    
    alert(error);
    }
});

function renderProducts(products){
    productContainer.innerHTML="";
    products.forEach((p) => {
        const div = document.createElement("div");
        div.classList.add("pro");
        div.innerHTML=`<div class="div-img" style="background-image:url(${p.image});"></div>
                  <div class="des">
                     <span>${p.brand || "Unknown"}</span>
                     <h5>${p.productName}</h5>
                        <div class="star">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>$${p.price}</h4>
                  </div>
                  <a href="#"><i class="fa-solid fa-cart-shopping cart"></i></a>`;
        div.addEventListener("click",()=>{
            window.location.href = `sproduct.html?id=${p.id}`;
        })
        productContainer.appendChild(div);
        
    });
}

function renderSmallProdusts( products,id){
    let i=1;
    products.forEach((doc)=>{
        if(doc.id !== id && i<4){
            const data = doc.data();
            smallImg[i].style.backgroundImage = `url("${data.image}")`;
            smallImg[i].addEventListener("click",()=>{
                window.location.href = `sproduct.html?id=${doc.id}`; 
            });
        }
        i++;

    });
}


   //add to cart
  
  const addCart = document.querySelector("#add-to-cart");
  if(addCart){
  addCart.addEventListener("click",async()=>{
    showLoader();
   const param = new URLSearchParams(window.location.search);//Use it when wants to use URL path to get data (It's called Query Parameter)
   const id = param.get("id");
   try{
  if(id){ 
    const product = await getSingleProduct(id);
    const quantity = parseInt(document.querySelector("#quantity").value)||1;
    const  result = await addToCart(product,quantity);
    hideLoader();
    adding();
}
   }catch(error){
     alert(error);
   }
   
   });  
  }