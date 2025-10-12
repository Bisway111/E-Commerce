import{auth,db,storage} from "./firebase-config.js";
import { ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";
import { 
    addDoc,
    serverTimestamp,
    collection
  } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
  

  export async function createProducts(rows) {

    const user = auth.currentUser;
    if(!user){
       return  new Error("⚠️ User not log in!");
    }
    try{

     const idToken = await user.getIdTokenResult();
     const isAdmin = idToken.claims.admin;
     
     if(isAdmin){
        
         for(const row of rows){
           
            const inputs = row.querySelectorAll("input");
            
            const file = inputs[0].files[0];
         
            let imgUrl ="";
          
            if(file){
                const storageRef = ref(storage,`products/${Date.now()}_${Math.floor(Math.random()*10000)}.jpg`);
                await uploadBytes(storageRef,file);
                imgUrl = await getDownloadURL(storageRef);
            }
            await addDoc(collection(db,"products"),{
                image: imgUrl,
                productName: inputs[1].value,
                brand: inputs[2].value,
                category: inputs[3].value,
                description: inputs[4].value,
                price: inputs[5].value,
                createdAt: serverTimestamp()
            });
         }
         return("✅ All products added successfully!");
     }else{
         return new Error("❌ Only admins can add products!");
     }

    }catch(error){
     throw new Error(error);
    }
    
  }