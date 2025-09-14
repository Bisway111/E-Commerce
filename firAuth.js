
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
  import {firestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCzAMvYi9wpqP60OvmB2HtL_aVKlyaGswQ",
    authDomain: "login-for-cb89e.firebaseapp.com",
    projectId: "login-for-cb89e",
    storageBucket: "login-for-cb89e.firebasestorage.app",
    messagingSenderId: "63282794682",
    appId: "1:63282794682:web:75b22df44e09bfeec0b283"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
