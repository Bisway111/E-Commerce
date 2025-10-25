 import { ref, uploadBytes, getDownloadURL,deleteObject } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";
 import {doc,updateDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
 import{ storage,auth,db} from "./firebase-config.js"

 //Uploading image in firebase storage;
 export async function uploadPriflePicture(file) {
const user = auth.currentUser;
try{
 if(!user){
    throw new Error("❌Not Logged In");
 }else{
    const storageURL = ref(storage,`profilePicture/${user.uid}/profile.jpg`);
    await uploadBytes(storageURL,file);

   const url =  await getDownloadURL(storageURL);

   const userref = doc(db,"users",user.uid);
   await updateDoc(userref,{
    profileImage: url
   })

   return url;
 }

}catch(error){
    alert(error);
    throw error;
}

    
 }

// Delete image from firebase storage 

export async function deleteProfileImage(id){
   if(!id){
throw new Error("Not log in");
   }else{
      try{
         const storageRef = ref(storage,`profilePicture/${id}/profile.jpg`) ;
         if(storageRef.exists()){
await deleteObject(storageRef);
         
         }else{
            return;
         }
         
      }catch(error){
alert(error);
throw error;
      }
   }
}