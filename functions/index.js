/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

 const {onCall,HttpsError} = require("firebase-functions/v2/https");

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
 
admin.initializeApp();


setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


//  exports.helloWorld = onRequest((request, response) => {
  
//   response.send("Hello from Firebase!");
// });

//creating admin //
exports.setUserRoleByEmail = onCall(async(request)=>{

if(!request.auth || !request.auth.token.admin){
  throw new Error("Permission denied: Only Admin can assign roles");
}

const email = request.data.email;
const role = request.data.role;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    throw new HttpsError("invalid-argument", "Invalid email format."+email);
  }

  if (!role) {
    throw new HttpsError("invalid-argument", "Role is required."+role);
  }


try{
const userRecord = await admin.auth().getUserByEmail(email);
const uid = userRecord.uid;

const claim = {[role]:true};
await admin.auth().setCustomUserClaims(uid,claim);

await admin.firestore().collection("users").doc(uid).set({role}, { merge: true });

return { message:`✅ Role ${role} assigned to ${email}`};

}catch(error){

throw new HttpsError("internal", "User not found or cannot assign role: " + error.message);
}


})