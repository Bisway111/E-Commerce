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
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
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
    pass: "jbqa ukkk pclf blgf"
  }
});

   //send email for user create 
   exports.sendWelcomeEmail =  onDocumentCreated("users/{userId}", async (event) => {
  const user = event.data.data();
  if (!user || !user.email) return;
 console.log("from sendWelcomeEmail",user);
    const mailOptions={
      from: "EUROCLOTH <singhabis190@gmail.com>",
      to: user.email,
      subject: "🎉 Welcome to EUROCLOTH — We're Glad to Have You!",
      html:`
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 40px 0;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background-color: #222831; color: #ffffff; text-align: center; padding: 25px;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to <span style="color: #00adb5;">EUROCLOTH</span></h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px 25px; color: #333333;">
        <h2 style="font-size: 22px;">Hi ${user.name || "there"} 👋,</h2>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for joining <strong>EUROCLOTH</strong> — your one-stop destination for the latest trends and premium fashion.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          We’re thrilled to have you on board. Explore our new arrivals, enjoy exclusive offers, and experience effortless shopping.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://myeurocloth.shop/" 
             style="background-color: #00adb5; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
             Start Shopping
          </a>
        </div>

        <p style="font-size: 14px; color: #555;">
          Have questions? Our support team is here to help — just reply to this email anytime.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #eeeeee; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} EUROCLOTH. All rights reserved.<br>
        <a href="https://myeurocloth.shop/" style="color: #00adb5; text-decoration: none;">Visit our website</a>
      </div>

    </div>
  </div>
  `
    };
    console.log("from sendWelcomeEmail hello1");
     try{
        await transporter.sendMail(mailOptions);
      }catch(error){
       console.error("Error sending welcome email:", error);
      }

   });
   // send email for order confirm
   exports.sendOrderConfirmEmail = onDocumentCreated("users/{userId}/orders/{orderId}", async (event) => {
  const order = event.data.data();
  console.log("from sendOrderConfirmEmail",order)
    const mailOptions ={
       from: "EUROCLOTH <singhabis190@gmail.com>",
       to: order.email,
       subject: `🛍️ Order #${event.params.orderId || ""} Confirmation — Thank You for Shopping with Us!`,
       html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 40px 0;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background-color: #222831; color: #ffffff; text-align: center; padding: 25px;">
        <h1 style="margin: 0; font-size: 26px;">Order Confirmation</h1>
        <p style="margin: 5px 0 0; color: #00adb5;">Order #${event.params.orderId || "N/A"}</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px 25px; color: #333333;">
        <h2 style="font-size: 22px;">Hi ${order.name || "Valued Customer"},</h2>

        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for shopping with <strong>EUROCLOTH</strong>! Your order has been successfully confirmed and is now being processed.
        </p>

        <div style="background-color: #f1f1f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 15px;">
            <strong>Order Number:</strong> #${event.params.orderId || "N/A"}<br>
            <strong>Status:</strong> Confirmed ✅<br>
            <strong>Estimated Delivery:</strong> Within 5–7 business days
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          We’ll notify you once your order has been shipped. Meanwhile, you can check your order details in your account anytime.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://myeurocloth.shop/profile.html" 
             style="background-color: #00adb5; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
             View My Order
          </a>
        </div>

        <p style="font-size: 14px; color: #555;">
          Need help? Our support team is here 24/7 — just reply to this email or visit our Help Center.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #eeeeee; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} EUROCLOTH. All rights reserved.<br>
        <a href="https://myeurocloth.shop/" style="color: #00adb5; text-decoration: none;">Visit our website</a>
      </div>

    </div>
  </div>
  `
    };
    console.log("from sendOrderConfirmEmail hello2");
    try{
      await transporter.sendMail(mailOptions);
    }catch(error){
      console.log("Error sending order email:",error)
    }
    
   });
  // send email for contact
   exports.sendContactEmail =onDocumentCreated("contacts/{contactId}", async (event) => {
  const contact = event.data.data();
  console.log("from sendContactEmail",contact)
  if (!contact || !contact.email) return;

    const mailOptions={
       from: "EUROCLOTH <singhabis190@gmail.com>",
       to: contact.email,
       subject: "📩 We’ve Received Your Message — Our Team Will Get Back Soon",
       html:  `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 40px 0;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background-color: #222831; color: #ffffff; text-align: center; padding: 25px;">
        <h1 style="margin: 0; font-size: 26px;">We’ve Got Your Message!</h1>
        <p style="margin: 5px 0 0; color: #00adb5;">EUROCLOTH Support Team</p>
      </div>

      <!-- Body -->
      <div style="padding: 30px 25px; color: #333333;">
        <h2 style="font-size: 22px;">Hello ${contact.name || "Valued Customer"},</h2>

        <p style="font-size: 16px; line-height: 1.6;">
          Thank you for reaching out to <strong>EUROCLOTH</strong>. We’ve successfully received your message and our support team is reviewing it.
        </p>

        <div style="background-color: #f1f1f1; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 15px;">
            <strong>Subject:</strong> ${contact.subject || "Customer Inquiry"}<br>
            <strong>Message:</strong> ${contact.detail || "N/A"}
          </p>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">
          You can expect a reply from our team within <strong>24–48 hours</strong>.  
          We appreciate your patience and will do our best to resolve your query quickly.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://myeurocloth.shop/" 
             style="background-color: #00adb5; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
             Visit Help Center
          </a>
        </div>

        <p style="font-size: 14px; color: #555;">
          If your issue is urgent, please contact our support line at 
          <a href="mailto:support@eurocloth.com" style="color: #00adb5; text-decoration: none;">support@eurocloth.com</a>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #eeeeee; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} EUROCLOTH. All rights reserved.<br>
        <a href="https://myeurocloth.shop/" style="color: #00adb5; text-decoration: none;">Visit our website</a>
      </div>

    </div>
  </div>
  `
    };
    console.log("from sendContactEmail hello3");
    try{
      await transporter.sendMail(mailOptions);

    }catch(error){
      console.error("Error sending contact email:", error);
    }
   });