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
const functions = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
 
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

//Automatic email sending 
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "singhabis190@gmail.com",
    pass:"onvn oqvj zlsg wtkg"
  }
});

   //send email for user create 
   exports.sendWelcomeEmail = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context)=>{
    const user =snap.data;
    if(!user || !user.email)return;

    const mailOptions={
      from: "EUROCLOTH<singhabis190@gmail.com>",
      to: user.email,
      subject: "Welcome to Our EUROCLOTH Website!",
      html:`<h1>Hello ${user.name || "User"}!</h1>
      <p>Thank you for creating an account on our website.</p>`
    };
     try{
        await transporter.sendMail(mailOptions);
      }catch(error){
       console.error("Error sending welcome email:", error);
      }

   });
   // send email for order confirm
   exports.sendOrderConfirmEmail = functions.firestore
  .document("users/{userId}/orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data;
    if(!order || !order.email) return;

    const mailOptions ={
       from: "EUROCLOTH<singhabis190@gmail.com>",
       to: order.email,
       subject: `Order #${order.id || ""} Confirmation`,
       html: `<h1>Thank you for your order!</h1>
           <p>Order #${order.id || ""} has been confirmed and you will get this order in some days.Thank you for choosing as.</p>`,
    };
    try{
      await transporter.sendMail(mailOptions);
    }catch(error){
      console.log("Error sending order email:",error)
    }
    
   });
  // send email for contact
   exports.sendContactEmail = functions.firestore
  .document("contacts/{contactId}")
  .onCreate(async (snap, context)  => {
    const contact = snap.data;
    if(!contact || !contact.email)return ;
    const mailOptions={
       from: "EUROCLOTH<singhabis190@gmail.com>",
       to: contact.email,
       subject: "We Received your Message",
       html: `<h1>Hello ${contact.name || "User"}!</h1>
           <p>Thank you for contacting us. We will try to resolve your query.</p>`,
    };
    try{
      await transporter.sendMail(mailOptions);

    }catch(error){
      console.error("Error sending contact email:", error);
    }
   });