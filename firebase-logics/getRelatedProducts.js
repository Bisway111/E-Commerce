import{db,authStateListener} from "./firebase-config.js";
import{collection, query, where, limit, getDocs, getDoc, updateDoc, setDoc, serverTimestamp,doc,increment} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

export async function getRelatedProducts(category,excludeId) {

    if(!category)return [];

    const q = query(collection(db,"products"),where("category","==",category),limit(4));
    const snap = await getDocs(q);

    const related =[];
    snap.forEach((doc) => {
        if(doc.id !== excludeId){
            const data = doc.data();
            related.push({
                id: doc.id,
                productName: data.productName,
                brand: data.brand,
                price: data.price,
                image: data.image,
                category: data.category,
                createdAt: data.createdAt

            })
        }
        
    });
    return related;
    
}

export async function getSmallProducts(category){
    if(!category)return [];

    const q = query(collection(db,"products"),where("category","==",category),limit(5));
    const snap = await getDocs(q);

    return snap;
}

//add to cart
export async function addToCart(data,q){
    return new Promise((resolve, reject) => {
    authStateListener(async (user)=>{
      try{
        if(user){
        const cartRef = doc(db,"users",user.uid,"cart",data.id);
        const cartSnap = await getDoc(cartRef);
     
        if(cartSnap.exists()){
            await updateDoc(cartRef,{quantity: increment(q)});
        }else{
            const p = data.data();
            await setDoc(cartRef,{
                image: p.image,
                name: p.productName,
                price: p.price,
                quantity: q,
                brand: p.brand,
                description: p.description,
                addedAt: serverTimestamp()
            });
        }
           resolve(" Product add to cart! ")
      }else{
        resolve("⚠️ Please Log in or Sign up for add to cart! ");
      }
    }catch(error){
      reject("❌ Failed to add product to cart!");
    }
    });
});
}