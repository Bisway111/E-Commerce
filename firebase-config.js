console.log("firebase hello");
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged ,
    deleteUser

  } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

  import { getFirestore,
    doc,
    setDoc,
    serverTimestamp,
    getDoc,
    updateDoc,
    deleteDoc 

  } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

  import { getStorage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
    const firebaseConfig = {
    apiKey: "AIzaSyCzRLe3i8v_K1JACe5EPYeNU7MDzc7qntE",
    authDomain: "e-commerce-38c45.firebaseapp.com",
    projectId: "e-commerce-38c45",
    storageBucket: "e-commerce-38c45.firebasestorage.app",
    messagingSenderId: "857351949700",
    appId: "1:857351949700:web:13fdeb0408c6f98eab61d1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);

  

 




// Auth state lisener

export function authStateListener(callback){
  onAuthStateChanged(auth,callback); 

}








