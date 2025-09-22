import{auth,db,authStateListener} from "./firebase-config.js";
import { 
    doc,
    setDoc,
    serverTimestamp,
    getDoc,
    updateDoc,
    deleteDoc 

  } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import{deleteUser} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


// Fecting User Data
const proname = document.querySelector("#pro-name");
const proemail = document.querySelector("#pro-email");
const prophone = document.querySelector("#pro-phone");
const progender = document.querySelector("#pro-gender");
const proaddress = document.querySelector("#pro-address");

authStateListener(async (user)=>{

if(user){
  try{
    const userRef = doc(db,"users",user.uid);
    const userData = await getDoc(userRef);
    if(userData.exists()){
    const data = userData.data();
      proname.textContent = data.name;
  
      proemail.textContent = data.email;
    
      prophone.textContent = data.phone;

      progender.textContent = data.gender ?? " Update Gender !";
     
   
      proaddress.textContent = data.address ?? " Update Address !";
      
      
      
    }else{
      return null;
    }
  }catch(error){
    console.log(error);
    return null;
  }
}

})


// Update user data

const editProfile = document.querySelector("#okay-popup");
const formpop = document.querySelector("#profile-popup");
if(editProfile){
editProfile.addEventListener("click",async(e)=>{
    e.preventDefault();
    const user = auth.currentUser;
    if(!user){
        alert("User Not Logged In !");
        return;
    }
const editname = document.querySelector("#nameEdit").value;
// const editemail = document.querySelector("#emailEdit").value;
// const editpassword = document.querySelector("#passwordEdit").value;
const editphone = document.querySelector("#phoneEdit").value;
const editgender = document.querySelector('input[name="gender"]:checked')?.value || null;
const editaddress = document.querySelector("#addressEdit").value;

  try{
    const userRef = doc(db,"users",user.uid);
    await updateDoc(userRef,{
    name: editname ,
    phone: editphone,
    gender: editgender,
    address: editaddress,
    updatedAt: serverTimestamp()

    })
     formpop.classList.remove("active");

     proname.textContent = editname;
     prophone.textContent = editphone;
     progender.textContent = editgender;
     proaddress.textContent = editaddress;

    alert("✅ Profile updated successfully!");
  }catch(error){
    alert("❌" +error);
  }


})
}

//Delete
const Userdelete = document.querySelector("#deleteaccount");
if(Userdelete){
    Userdelete.addEventListener("click",async()=>{
        const user = auth.currentUser;
  console.log("Delte is clicked");
  if(user){
    try{

      await deleteDoc(doc(db,"users",user.uid));

      await deleteUser(user);
      alert("✅ Deletion successfull");
      window.location.href= "index.html";
    }
    catch(error){
alert(error);
    }
  }
  
    })
}
  

