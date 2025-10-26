import{auth,db,authStateListener} from "./firebase-config.js";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { showLoader,hideLoader } from "../popUpScript.js";
import { congrats} from "../popUpScript.js";
const cartTableBody = document.querySelector("#cart tbody");
const subtotalEl = document.querySelector("#subtotal table tr:nth-child(1) td:nth-child(2)");
const totalEl = document.querySelector("#subtotal table tr:nth-child(3) td:nth-child(2)");
const proceedCheckOutBtn = document.querySelector("#proceed-check-out");
let totalAmount = 0;
authStateListener(async(user)=>{
    if(user){
        const cartRef = collection(db, "users", user.uid, "cart");
        onSnapshot(cartRef,(snapShot)=>{
            const items = snapShot.docs.map((d)=>({id: d.id, name: d.data().name, image: d.data().image, price: d.data().price, quantity: d.data().quantity}));
            renderCart(items);
        });
    }else{
        cartTableBody.innerHTML=`
        <tr>
           <td colspan = "6" style=" text-align:center; padding:20px; font-size:18px;">
           🔒 Please <a href="login.html" style="color:blue; text-decoration: none;">log in<a> to view your cart.
           <td>
        <tr>`;
        proceedCheckOutBtn.disabled = true;
        proceedCheckOutBtn.classList.remove("active");
        subtotalEl.textContent = "$0.00";
        totalEl.textContent = "$0.00";
    }
});

function renderCart(items){
    let subtotal = 0;
    cartTableBody.innerHTML="";

    if(items.length===0){
         cartTableBody.innerHTML=`
        <tr>
           <td colspan = "6" style=" text-align:center; padding:20px; font-size:18px; color:rgba(255, 0, 0, 0.6);">
            🛒 Your cart is Empty ! 
           <td>
        <tr>`;
        proceedCheckOutBtn.classList.remove("active");
        proceedCheckOutBtn.disabled = true;
        subtotalEl.textContent = "$0.00";
        totalEl.textContent = "$0.00";
        return;
    }

    items.forEach((item) => {
        const itemSubtotal = Number(item.price)* Number(item.quantity);
       subtotal += Number(itemSubtotal);
       
       const row = document.createElement("tr");
       row.innerHTML=`
       <td><i class="fa-regular fa-circle-xmark remove" style=" color:rgba(255, 0, 0, 0.6); cursor: pointer;" data-id="${item.id}"></i></td>
       <td><div class="cart-row-img" style="background-image:url(${item.image});"></div></td>
       <td>${item.name}</td>
       <td>$${Number(item.price).toFixed(2)}</td>
       <td><input type="number" min="1" value="${item.quantity}" class="qty-input" data-id="${item.id}"></td>
       <td>$${itemSubtotal.toFixed(2)}</td>
       `
       cartTableBody.appendChild(row);

        
    });
    proceedCheckOutBtn.classList.add("active");
    proceedCheckOutBtn.disabled = false;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalAmount = subtotal.toFixed(2);

}

if(cartTableBody){
cartTableBody.addEventListener("click",async(e)=>{

    const removeBtn = e.target.closest(".remove");
    if(!removeBtn)return;

    const id = removeBtn.dataset.id;
    const user = auth.currentUser;
    if(!user) return alert("Please log in to modify your cart !");
    await deleteDoc(doc(db, "users", user.uid, "cart", id));
});
}

if(cartTableBody){
    cartTableBody.addEventListener("click",async(e)=>{
 
        const qtyInput = e.target.closest(".qty-input");

        if(!qtyInput)return;

        const id = qtyInput.dataset.id;
        let newQty = parseInt(qtyInput.value);

        if(newQty<1){
            newQty = 1;
            qtyInput.value=1;
            return alert("Quantity must be at least 1");
        }

        const user = auth.currentUser;
        if(!user)return alert("⚠️ Please log in to modify your cart.");

        await updateDoc(doc(db, "users", user.uid, "cart", id), {quantity: newQty});
    })
}


//Making proceed check out button working


const paymentSection = document.querySelector("#check-out-section");
const amount = document.querySelector(".check-out p");
if(proceedCheckOutBtn){
  proceedCheckOutBtn.addEventListener("click",()=>{
    amount.textContent = `Total- $${totalAmount}`;
    paymentSection.classList.add("active");  
  })
}
// Making cencel check out button working
const cencelCheckOutBtn = document.querySelector("#cencel-check-out");
if(cencelCheckOutBtn){
  cencelCheckOutBtn.addEventListener("click",()=>{
    paymentSection.classList.remove("active");
  })
}

//making payment radio button working for showing the payment fiealds

const paymentMethod = document.querySelectorAll('#payment-box input[type="radio"]');
const placeCheckOut = document.querySelector("#place-check-out");
const cardDetails = document.querySelector("#card-details");
const upiDetails = document.querySelector("#upi-details");
if(paymentMethod){
  paymentMethod.forEach((input)=>{
    input.addEventListener("click",()=>{
      

       placeCheckOut.disabled = true;
      cardDetails.classList.remove("active");
      upiDetails.classList.remove("active");
      placeCheckOut.classList.remove("active");

      if(input.value == "COD"){
        placeCheckOut.classList.add("active");
        placeCheckOut.disabled = false;
        
      }else if(input.value == "Card"){
       
        cardDetails.classList.add("active");

      }else{
         
         upiDetails.classList.add("active");

      }
    })
  })
}

document.querySelectorAll("#card-details input").forEach((input)=>{
  input.addEventListener("input",cardInputs);
});

document.querySelectorAll("#upi-details input").forEach((input)=>{
  input.addEventListener("input",upiInputs);
});


function cardInputs(){
  const cardNumber = document.querySelector("#card-number").value.trim();
  const cardHolderName = document.querySelector("#card-holder-name").value.trim();
  const cardDate = document.querySelector("#ex-date").value.trim();
  const cardCvv = document.querySelector("#cvv").value.trim();

  if(cardNumber && cardHolderName  && cardDate  && cardCvv ){
    placeCheckOut.classList.add("active");
    placeCheckOut.disabled = false;

  }
}
     
function upiInputs(){
const upiId = document.querySelector("#upiId").value.trim();
if(upiId){
  placeCheckOut.classList.add("active");
  placeCheckOut.disabled = false;
}
}

//making place order button working and saving order in firestore
if(placeCheckOut){
  placeCheckOut.addEventListener("click",async()=>{
    showLoader();
    const user = auth.currentUser;
    if(!user) {
        alert("Please log in to place an order!");
        paymentSection.classList.remove("active");
        hideLoader();
        return;
    } 
    const userRef = doc(db,"users",user.uid);
    const userData = await getDoc(userRef);
    try{
       const cartRef = collection(db, "users", user.uid, "cart");
       const cartSnap = await getDocs(cartRef);
       if(cartSnap.empty){
        alert("Your cart is empty!");
        paymentSection.classList.remove("active");
        hideLoader();
        return;

       }
       const cartItems = cartSnap.docs.map((doc)=>({
        id:doc.id,
        image: doc.data().image,
        name: doc.data().name,
        brand: doc.data().brand,
        price: doc.data().price,
        quantity: doc.data().quantity,
        description: doc.data().description
       }));

        await addDoc(collection(db, "users", user.uid, "orders"),{items: cartItems, email: userData.data().email, paymentMethod: getSelectedPaymentMethod(), orderDate: serverTimestamp(), status: "Processing", totalAmount: cartItems.reduce((sum, item)=> sum+item.price * item.quantity,0)});
       for(const item of cartSnap.docs){
        await deleteDoc(doc(db, "users", user.uid, "cart", item.id));
       }
       
        hideLoader();
        congrats();
       paymentSection.classList.remove("active");

    }catch(error){
        console.error("❌ Error placing order:", error);
      alert("Failed to place your order. Please try again.");
      hideLoader();
      paymentSection.classList.remove("active");
    }
  })
}

function getSelectedPaymentMethod(){
    const selected = document.querySelector('#payment-box input[type="radio"]:checked').value;
    return selected;
}