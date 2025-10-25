import{auth} from "./firebase-config.js";
import{getFunctions, httpsCallable,connectFunctionsEmulator  } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-functions.js";;


const functions = getFunctions();


// creating admin by calling setUserRoleByEmail function from backend 
export async function setUserRole(email,role) {
    try{
        const setRole = httpsCallable(functions,"setUserRoleByEmail");
        const result = await setRole({email,role});
        return result;
    }catch(error){
       return new Error(error);
        
    }
  
}


