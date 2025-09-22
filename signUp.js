import{auth,db,authStateListener} from "./firebase-config.js";
import{
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
}from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

 // Sign Up

  const signUp = document.querySelector("#sign-Up");

  if(signUp){
signUp.addEventListener("submit",async(e)=>{
  e.preventDefault();
  
  const email = document.querySelector("#signup-email").value;
  const password = document.querySelector("#signup-password").value;
  const name = document.querySelector("#signup-name").value;
  const phone = document.querySelector("#signup-phone").value;
  
  try{
          //Create user in firebase
  const userCredential = await createUserWithEmailAndPassword(auth,email,password);
  const user = userCredential.user;
  
  try{
  await setDoc(doc(db,"users",user.uid),{
    name: name,
    email: email,
    phone: phone,
    role: "user",
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  
  });

  alert(`✅ Sign up: ${userCredential.user.name}`);

  
  signUp.reset();
  window.location.href= "index.html";

  }catch(firstoreError){

  await user.delete();
  throw new Error("Firestore save faild ,auth canceled")
  }
  
  }
  catch(error){
  alert(`❌ Error: ${error.message}`);
  console.log("Error"+error.message)
  
  }
    })
  }

  
//   Log in 

  const logIn =document.querySelector(".login-form");

  if(logIn){
  logIn.addEventListener("submit",(e)=>{
  e.preventDefault();
  console.log()
    const email = document.querySelector("#login-details-email").value;
    const password = document.querySelector("#login-details-password").value;

    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
      alert(`✅ Logged In :${userCredential.user.email}`);
      console.log(`✅ Logged In :${userCredential.user.email}`);
      logIn.reset();
      window.location.href= "index.html";
    })
    .catch((error)=>{
      alert(`❌ Error: ${error.message}`)
      console.log("Error");
    })
    

  })
}

// LogOut

const logout = document.querySelector("#logout");

if(logout){
logout.addEventListener("click",()=>{
  signOut(auth)
  .then(()=>{
    alert(`✅ User logged out `);
    window.location.href= "index.html";
  })
  .catch((error)=>{
alert(`❌ Error: ${error.message}`)
  })
})
}


// Auth listener 
const profileLink = document.querySelector("#profile-link");
if(profileLink){
authStateListener((user) =>{
  profileLink.addEventListener("click",(e)=>{
    e.preventDefault();
    if(user){
        window.location.href= "profile.html";
    }else{
        window.location.href= "login.html";
    }
  })
  

})
}