import {setUserRole} from "./firebase-logics/createRole.js";
import{createProducts} from "./firebase-logics/createProducts.js";
import { showLoader,hideLoader } from "./popUpScript.js";
const bar = document.querySelector("#bar");
const nav = document.querySelector("#navbar");
const cenncel = document.querySelector("#close");
const sbtn = document.querySelector("#shopBtn");


//// making shope working to redirect to shop page 
//first check if true then run otherwise it give a erron and rest of the code will not run and that make hamburger not working 
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

////making arrow working (for a arrow the class name should be arrow-rotate. it's globle here)
const rotate = document.querySelector(".arrow-rotate");
const content = document.querySelector("#add-div-product");
const addsDiv = document.querySelector("#add-div-start");

if(addsDiv){
    addsDiv.addEventListener("click",()=>{

if(content.style.maxHeight){
    content.style.maxHeight = null;
    content.classList.remove("open");
    rotate.classList.remove("rotate");
}else{
    content.style.maxHeight = content.scrollHeight+"px";
    content.classList.add("open");
    rotate.classList.add("rotate");
}
 })
}
//making add row 
const addRow = document.querySelector("#add-row");
if(addRow){
    addRow.addEventListener("click",()=>{
      const table = document.querySelector("#product-table").getElementsByTagName('tbody')[0];
      const newRow = table.insertRow();
      newRow.innerHTML=`<td><i class="fa-regular fa-circle-xmark deleteRow"></i></td>
                            <td><input type="file"></td>
                            <td><input type="text" placeholder="Enter Product Name"></td>
                            <td><input type="text" placeholder="Enter Brand Name"></td>
                            <td><input type="text" placeholder="Enter Category"></td>
                            <td><input type="feild" placeholder="Enter Description" ></td>
                            <td><input type="number" placeholder="Enter Price"></td>` ;

         //Adjust the height after a row added
          content.style.maxHeight = content.scrollHeight+"px";                  
    })
}

//making delete row
const tablebody = document.querySelector("#product-table tbody");

if(tablebody){
tablebody.addEventListener("click",(e)=>{
        if(e.target.classList.contains("deleteRow")){
        const row = e.target.closest("tr");
        row.remove();
        }
        const rows = document.querySelectorAll("#product-table tbody tr");
        if(rows.length === 0){
            //Auto close if no row remain
            content.style.maxHeight = null;
            content.classList.remove("open");
            rotate.classList.remove("rotate");
        }else{
            content.style.maxHeight = content.scrollHeight+"px";
        }
    })
  
}
//making add product
const addProduct = document.querySelector("#add-product");

if(addProduct){
    addProduct.addEventListener("click",async()=>{
      showLoader();
      document.body.style.overflow = "hidden";
        const rows = document.querySelectorAll("#product-table tbody tr");
        try{
            if(rows.length!==0){
                  const result =  await createProducts(rows);
                  alert(result);
                  hideLoader();
                  document.body.style.overflow = "auto";
                  
            }else{
                alert("⚠️ No products to add!");
                hideLoader();
                document.body.style.overflow = "auto";
            }

        }catch(error){
          alert(error);
          hideLoader();
          document.body.style.overflow = "auto";
        }

       
        
    })
}

//making admin

const addAdmin = document.querySelector("#add-new-admin");
if(addAdmin){
    addAdmin.addEventListener("click",async(e)=>{     
    e.preventDefault();
    showLoader();
    document.body.style.overflow = "hidden";
 
        const adminEmail = document.querySelector("#add-admin input").value.trim();
        const adminRole = document.querySelector("#user-role").value;
       try{
        if(adminEmail && /\S+@\S+\.\S+/.test(adminEmail) && adminRole){
           const result = await setUserRole(adminEmail , adminRole );
           alert(result.data.message);
           hideLoader();
        }else{
            alert("Invalid Input");
            hideLoader();
            document.body.style.overflow = "auto";
        }    
       }catch(error){
        alert( error);
        hideLoader();
        document.body.style.overflow = "auto";
       }
        
    })
}

//contact 

