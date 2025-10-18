import{auth,db,authStateListener} from "./firebase-config.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const orderPage = document.querySelector("#order-page");
const invoiceTable = document.querySelector("#invoice table tbody");
const totalValue = document.querySelector("#total-value");
const customerName = document.querySelector("#customer-details-name");
const customerAddress = document.querySelector("#customer-details-address");
const customerPincode = document.querySelector("#customer-details-pincode");
const customerEmail = document.querySelector("#customer-details-email");
const customerPhone = document.querySelector("#customer-details-phone");
const customerDate = document.querySelector("#customer-details-date");
const customerPayment = document.querySelector("#customer-details-payment");
function getOrderId(){
    const params = new URLSearchParams(window.location.search);
    return params.get("orderId");
}

authStateListener(async(user)=>{
    if(!user)return;
    const orderId = getOrderId();
    if(!orderId)return alert("⚠️ No order found !");

    const orderRef = doc(db, "users", user.uid, "orders",orderId);
    const orderSnap = await getDoc(orderRef);

    if(!orderSnap.exists()){
        orderPage.innerHTML= "<h3>No order found</h3>";
        return;
    }

    const order = orderSnap.data();
    const orderDate = order.orderDate.toDate();
    const formatted = orderDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
   });
    orderPage.innerHTML = "";
    orderPage.innerHTML = `<div id="progess-date">
                   <div id="product-progress"><span></span><p>${order.status}</p></div>
                   <h3 id="order-date">Order on - ${formatted}</h3>
                </div>`
    order.items.forEach((p) => {
        orderPage.innerHTML +=` <div class="order">
                    <img src="${p.image}" alt="${p.name}">
                    <h3>${p.brand}</h3>
                    <h3>${p.name}</h3>
                    <h3>price-$${p.price}</h3>
                    <h3>Quantity-${p.quantity}</h3>
                    <h3>${p.description ||""}</h3>
                     <hr>
                </div>`;
        
    }); 
    customerPayment.textContent= order.paymentMethod;
    customerDate.textContent= formatted;

    invoiceTable.innerHTML="";
    order.items.forEach((p)=>{
        invoiceTable.innerHTML+=`
        <tr>
        <td>${p.name}</td>
        <td>${p.quantity}</td>
        <td>$${p.price}</td>
      </tr>`;
    });
    totalValue.textContent= `Total - $${order.totalAmount}`;

    const userRef = doc(db,"users",user.uid);
    const userInfo = await getDoc(userRef);
    customerName.textContent = userInfo.data().name;
    customerAddress.textContent= userInfo.data().address;
    customerPhone.textContent= userInfo.data().phone;
    customerPincode.textContent= userInfo.data().pincode;
    customerEmail.textContent= userInfo.data().email;

})