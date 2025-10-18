import{auth,db,authStateListener} from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
   orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const featureContainer = document.querySelectorAll("#product1 .pro-container")[0];
const newArraivalContainer = document.querySelectorAll("#product1 .pro-container")[1];

async function loadRandomProducts() {

    try{
       const productSnap = await getDocs(collection(db,"products"));
       const products = [];
       
       productSnap.forEach((doc)=> {
        products.push({id: doc.id, name: doc.data().productName, brand: doc.data().brand, price: doc.data().price, image: doc.data().image});
       });
       

       if(products.length===0){
        featureContainer.innerHTML = `<p>No products available.</p>`;
        newArraivalContainer.innerHTML = `<p>No products available.</p>`;
        return;
       }
      
       //shuffle randomly
       const shuffled = products.sort(()=> Math.random()-0.5);

       const featureProduts = shuffled.slice(0,8);
       const newArraivalProducts = shuffled.slice(8,16);
       
       renderProducts(featureContainer,featureProduts);
      
       renderProducts(newArraivalContainer,newArraivalProducts);
       
    }catch(error){
        alert(error);
        
    }
    
}

function renderProducts(container, products){
    container.innerHTML="";
    products.forEach((p)=>{
        
        const productDiv = document.createElement("div");
        productDiv.classList.add("pro");
        productDiv.innerHTML=`<img src="${p.image}" alt="${p.name}">
                  <div class="des">
                     <span>${p.brand || "Unknown"}</span>
                     <h5>${p.name}</h5>
                        <div class="star">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>$${p.price}</h4>
                  </div>
                  <a href="#"><i class="fa-solid fa-cart-shopping cart"></i></a>`;

                  productDiv.addEventListener("click",()=>{
                    window.location.href = `sproduct.html?id=${p.id}`;
                  });
                  container.appendChild(productDiv);
    });
}

loadRandomProducts();