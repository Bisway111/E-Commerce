import{doc,getDoc} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import{db} from "./firebase-config.js";

export async function getSingleProduct(id) {
    const docRef = doc(db,"products",id);
    const snap =await getDoc(docRef);

    if(!snap.exists())return null;
      return snap;
    
}