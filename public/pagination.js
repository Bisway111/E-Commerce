import { getProducts } from "./firebase-logics/fetchProducts.js";


const productContainer = document.querySelector("#product-container");

// let currentPage=1;

export async function loadPage(next=true, currentPage) {
    
    
   if(productContainer)productContainer.innerHTML= "<p>Loading protucts..<p>";
    const products = await getProducts(next);
     
    if(products.length===0){
        productContainer.innerHTML= "<p>No more protucts found.<p>";
        document.dispatchEvent(new CustomEvent("pageLoaded",{detail:{currentPage, hasNext:false}}));
        return ;
    }
   renderProducts(products);
    
    document.dispatchEvent(new CustomEvent("pageLoaded",{detail:{currentPage, hasNext:products.length>=16}}));
}


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

loadPage(true,1);