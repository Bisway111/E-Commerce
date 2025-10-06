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

if(rotate){
    rotate.addEventListener("click",()=>{
console.log("arrow clicked");
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
                            <td><input type="feild" placeholder="Enter Discription" ></td>
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
    addProduct.addEventListener("click",()=>{
        console.log("add product clicked")
        const rows = document.querySelectorAll("#product-table tbody tr");
        let product=[];

        rows.forEach((row)=>{
          const inputs = row.querySelectorAll("input");
          product.push({
            image: inputs[0].value,
            productName: inputs[1].value,
            brandName: inputs[2].value,
            category: inputs[3].value,
            Discription: inputs[4].value,
            Price: inputs[5].value
          })
        })
        alert("Product added");
        console.log(product);
    })
}

const addAdmin = document.querySelector("#add-new-admin");
if(addAdmin){
    addAdmin.addEventListener("click",()=>{
        const adminEmail = document.querySelector("#add-admin input").value;
        const adminRole = document.querySelector("#user-role").value;
        if(adminEmail!=="" && adminRole){
            alert(`${adminEmail} is now a ${adminRole}`);
        }else{
            alert("Invalid Request");
        }
        
       

    })
}
