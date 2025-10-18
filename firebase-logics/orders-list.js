import{auth,db,authStateListener} from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
   orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const orderContainer = document.querySelector("#add-div-product");
 authStateListener(async(user)=>{
    if(!user)return;

    const orderRef = query(collection(db, "users", user.uid, "orders"),orderBy("orderDate","desc"));
    const snapShot = await getDocs(orderRef);
    // if(snapShot.empty()){
    //     orderContainer.innerHTML = "No product found..";
    // }

    orderContainer.innerHTML = "";//clear static html;

    snapShot.forEach((docSnap) => {
        const order = docSnap.data();
    const productNames = order.items.map(p =>`<h3>${p.name}</h3>`).join("");

     const orderDate = order.orderDate.toDate();
    const formatted = orderDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
    });

    const orderDiv = document.createElement("div");
    orderDiv.classList .add("order-div-product-inner");
    orderDiv.innerHTML=`<div class="inner-orders">
    <div id="product-progress"><span></span><p>${order.status || "Progress"}</p></div>
    ${productNames}
    <h3>Total - $${order.totalAmount}</h3>
    </div>
    <h3 id="order-date">Order on - ${formatted}</h3>`;

    orderDiv.addEventListener("click",()=>{
        window.location.href = `orders.html?orderId=${docSnap.id}`
    });
     orderContainer.appendChild(orderDiv);
     orderContainer.appendChild(document.createElement("hr"));
    });
 });