import{auth,db,authStateListener} from "./firebase-config.js";
import { 
    doc,
    serverTimestamp,
    getDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    collection

  } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import{deleteUser,reauthenticateWithCredential,EmailAuthProvider} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import{uploadPriflePicture,deleteProfileImage} from "./profile-storage.js";

import { showLoader,hideLoader } from "../popUpScript.js";

// Fecting User Data
const proname = document.querySelector("#pro-name");
const proemail = document.querySelector("#pro-email");
const prophone = document.querySelector("#pro-phone");
const progender = document.querySelector("#pro-gender");
const proaddress = document.querySelector("#pro-address");
const propincode = document.querySelector("#pro-pincode");
const proimage = document.querySelector("#logo");


authStateListener(async (user)=>{


if(user){
  try{
    const userRef = doc(db,"users",user.uid);
    const userData = await getDoc(userRef);
    if(userData.exists()){
    const data = userData.data();
      const roles = data.role;
      proimage.style.backgroundImage = data.profileImage ? `url(${data.profileImage})` : `url("IMAGE/profile-photo .jpg")`;
      

      (roles==="admin" || roles==="editor") ? proname.textContent = `${roles} - ${data.name}` : proname.textContent = data.name;
  
      proemail.textContent = data.email;
    
      prophone.textContent = data.phone ?? " Update Phone Number !";

      progender.textContent = data.gender ?? " Update Gender !";
     
   
      proaddress.textContent = data.address ?? " Update Address !";
      propincode.textContent = data.pincode ?? " Update pincode !";

      
      
      
    }else{
      return null;
    }
  }catch(error){
    return null;
  }
}

})


// Update user data

const editProfile = document.querySelector("#okay-popup");
const formpop = document.querySelector("#profile-popup");
const fileImage = document.querySelector("#profile-popup #file-popup");
const popPhoto = document.querySelector(".photo-popup-img");
let file;
           
// Fecting image file from edit page
if(fileImage){
fileImage.addEventListener("change",()=>{
    file = fileImage.files[0];
    
    if(file){
      popPhoto.style.backgroundImage = `url(${URL.createObjectURL(file)})`;    
    }
})
}
        // Triggering  the edit page
if(formpop){
formpop.addEventListener("submit",async(e)=>{
    e.preventDefault();
    showLoader();
    const user = auth.currentUser;

    if(!user){
        alert("User Not Logged In !");
        hideLoader();
        return;
    }
const editname = document.querySelector("#nameEdit").value;
// const editemail = document.querySelector("#emailEdit").value;
// const editpassword = document.querySelector("#passwordEdit").value;
const editphone = document.querySelector("#phoneEdit").value;
const editgender = document.querySelector('input[name="gender"]:checked')?.value || null;
const editaddress = document.querySelector("#addressEdit").value;
const editpincode = document.querySelector("#pincodeEdit").value;

  try{
    
    const userRef = doc(db,"users",user.uid);
    const updateData = {
      updatedAt: serverTimestamp()
    }
    if(editname && editname !="")updateData.name = editname;
    if(editphone && editphone !="")updateData.phone = editphone;
    if(editgender && editgender != null)updateData.gender = editgender;
    if(editaddress && editaddress != "")updateData.address = editaddress;
    if(editpincode && editpincode != "")updateData.pincode = editpincode;

    await updateDoc(userRef,updateData );

    let url;
    if(file){
      url = await uploadPriflePicture(file);
    }
     formpop.classList.remove("active");
     

     if(editname && editname !="")proname.textContent = editname;
     if(editphone && editphone !="")prophone.textContent = editphone;
     if(editgender && editgender != null)progender.textContent = editgender;
     if(editaddress && editaddress != "")proaddress.textContent = editaddress;
     if(editpincode && editpincode != "")propincode.textContent = editpincode;
     if(url)proimage.style.backgroundImage = `url(${url})`;
     document.body.style.overflow = "auto";
    hideLoader();
    // alert("✅ Profile updated successfully!");
    formpop.reset();
    
  }catch(error){
    alert("❌" +error);
  }


})
}

//Delete

const Userdelete = document.querySelector("#deleteaccount");
if(Userdelete){
    Userdelete.addEventListener("click",async()=>{
      showLoader();
      document.body.style.overflow = "hidden";
      const user = auth.currentUser;
  if(user){
    try{
      const password = prompt("For Deletion of your accoutn enter password:");
      const id = user.uid;
      
      await deleteAccount(user,password);
      await deleteDoc(doc(db,"users",id));
      const userref = doc(db,"users",id);
      const snap = await getDoc(userref);
      if(snap.exists() && snap.data().profileImage) await deleteProfileImage(id);
      document.body.style.overflow = "auto";
      hideLoader();
      alert("✅ Deletion successfull");
      window.location.href= "index.html";
    }
    catch(error){
      hideLoader();
      alert(error);
    }
  }
  
    })
}
 
// re-auth for deletion of the account 
 
async function deleteAccount(user,password) {

  try{
if(!user){
 throw new Error("User Not Registered!");
  }else{
const credential = EmailAuthProvider.credential(user.email,password);
await reauthenticateWithCredential(user,credential);
await deleteUser(user);
  }
  }catch(error){
throw error;
  }
  
  
}

//contact 

const contactbtn = document.querySelector("#contact-button");
if(contactbtn){
contactbtn.addEventListener("click", async () => {
    const contactSubInput = document.querySelector("#contact-sub");
    const contactNameInput = document.querySelector("#contact-name");
    const contactEmailInput = document.querySelector("#contact-email");
    const contactDetailsInput = document.querySelector("#contact-detail");

    const contactsub = contactSubInput.value.trim();
    const contactName = contactNameInput.value.trim();
    const contactEmail = contactEmailInput.value.trim();
    const contactDetails = contactDetailsInput.value.trim();

    if (contactsub && contactName && contactEmail && contactDetails) {
        try {
            const contactRef = collection(db, "contacts");
          const result=  await addDoc(contactRef, {
                name: contactName,
                email: contactEmail,
                subject: contactsub,
                detail: contactDetails,
                timestamp: new Date()
            });
            
            alert(`Hello ${contactName}, we will contact you soon at ${contactEmail}!`);
            
            contactSubInput.value = "";
            contactNameInput.value = "";
            contactEmailInput.value = "";
            contactDetailsInput.value = "";

        } catch (error) {
            console.error("Error adding contact:", error);
            alert("Failed to send your message. Check console for errors.");
        }
    } else {
        alert("Fill the full form");
    }
});
}