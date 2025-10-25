import{auth,db,authStateListener,googleAuthProvider} from "./firebase-config.js";
import{
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    sendPasswordResetEmail
}from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { setDoc, getDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { showLoader,hideLoader } from "../popUpScript.js";

 // Sign Up

  const signUp = document.querySelector("#sign-Up");

  if(signUp){
signUp.addEventListener("submit",async(e)=>{
  e.preventDefault();
  showLoader();
  document.body.style.overflow = "hidden";
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
    lastLoginAt: serverTimestamp()
  
  });
hideLoader();
document.body.style.overflow = "auto";
alert(`✅ Sign up: ${name}`);

  
  signUp.reset();
  window.location.href= "index.html";

  }catch(firstoreError){

  await user.delete();
  hideLoader();
  document.body.style.overflow = "auto";
  throw new Error("Firestore save faild ,auth canceled")
  }
  
  }
  catch(error){
    hideLoader();
    document.body.style.overflow = "auto";
  alert(`❌ Error: ${error.message}`);
  
  
  }
    })
  }

//Login with google 
const googleAuth = document.querySelector("#login-with-google");
if(googleAuth){
  googleAuth.addEventListener("click",async()=>{
    showLoader();
    document.body.style.overflow = "hidden";
    try{
      const result = await signInWithPopup(auth,googleAuthProvider);
      const user = result.user;
      alert("✅ Login with Google, "+user.displayName);
      const userref = doc(db,"users",user.uid);
      const userdata = await getDoc(userref);
      
      //check if user is already exists

      if(!userdata.exists()){
         await setDoc(doc(db,"users",user.uid),{
        name: user.displayName,
        email: user.email,
        role: "user",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      })
      }
      hideLoader();
      document.body.style.overflow = "auto";
      window.location.href= "index.html";

    }catch(error){
     alert(error);
     hideLoader();
     document.body.style.overflow = "auto";
    }
  })
}

  
//   Log in 

  const logIn =document.querySelector(".login-form");

  if(logIn){
  logIn.addEventListener("submit",(e)=>{
  e.preventDefault();
  showLoader();
  document.body.style.overflow = "hidden";
    const email = document.querySelector("#login-details-email").value;
    const password = document.querySelector("#login-details-password").value;

    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
      alert(`✅ Logged In :${userCredential.user.email}`);
      logIn.reset();
      hideLoader();
      document.body.style.overflow = "auto";
      window.location.href= "index.html";
    })
    .catch((error)=>{
      alert(`❌ Error: ${error.message}`)
      hideLoader();
      document.body.style.overflow = "auto";
    })
    

  })
}

// Forgot password 
const forgotbtn = document.querySelector("#login-with-forgot");
if(forgotbtn){
  forgotbtn.addEventListener("click",async()=>{
    showLoader();
    document.body.style.overflow = "hidden";
       const Email =  prompt("Enter you registered email: ");
       if(!Email){
        alert("Please enter your email!");
        hideLoader();
        document.body.style.overflow = "auto";
        return ;
       }else{
        try{
          await sendPasswordResetEmail(auth,Email);
          hideLoader();
          alert("✅ Password reset email sent. Please check your inbox!");
        }catch(error){
        alert(error);
        hideLoader();
        document.body.style.overflow = "auto";
        }
       }
  })
}

// LogOut

const logout = document.querySelector("#logout");

if(logout){
logout.addEventListener("click",()=>{
  showLoader();
  document.body.style.overflow = "hidden";
  signOut(auth)
  .then(()=>{
    alert(`✅ User logged out `);
    hideLoader();
    window.location.href= "index.html";
  })
  .catch((error)=>{
    hideLoader();
    document.body.style.overflow = "auto";
alert(`❌ Error: ${error.message}`)
  })
})
}


// Auth listener 
const profileLink = document.querySelector("#profile-link");
if(profileLink){
authStateListener((user) =>{
  profileLink.addEventListener("click",async(e)=>{
    e.preventDefault();
    if(user){
    const Token = await user.getIdTokenResult();
     const Admin = Token.claims.admin;
     const Editor = Token.claims.editor;
     
     if(Admin || Editor){
      
      window.location.href= "admin.html";

    }else if(user){

        window.location.href= "profile.html";
    }
    } else{
      
        window.location.href= "login.html";
    }
    
  })
  

})
}