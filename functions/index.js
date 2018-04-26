

// // var functions = require('firebase-functions');
// // const admin = require('firebase-admin');
// // admin.initializeApp();

// // exports.sendNotification = functions.database.ref('/notification/{notificationId}').onCreate((snapshot) => {



// //   // Setup notification
// //   const NOTIFICATION_SNAPSHOT = snapshot.val();
// //   const payload = {
// //     notification: {
// //       title: `New Message from ${NOTIFICATION_SNAPSHOT.child('user').val()}!`,
// //       body: NOTIFICATION_SNAPSHOT.child('message').val(),
// //       click_action: `https://${functions.config().firebase.authDomain}`
// //     }
// //   };
// //   console.info(payload);
// // });




// WELCOME EMAIL
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');




var mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'checkpointappalert@gmail.com',
    pass: 'vicmddn352'
  },
});

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Checkpoint App';

// [START sendWelcomeEmail]
/**
 * Sends a welcome email to new user.
 */
// [START onCreateTrigger]
exports.sendTrackEmail = functions.database.ref('/users/{userId}/tracks/{trackId}').onCreate((snapshot) => {
// [END onCreateTrigger]
  // [START eventAttributes]

  const snappy = snapshot.val();
  console.log(snappy); 
  

  // [END eventAttributes]

  return sendTrackEmail();
});
// [END sendWelcomeEmail]




// Sends a welcome email to the given user.
function sendTrackEmail() {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: 'kiwimade.sw@gmail.com',
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `You created a new track in ${APP_NAME}!`;
  mailOptions.text = `Hey Stacey! You made a new track in ${APP_NAME}. You are going on the track.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('New welcome email sent to Stacey');
  });
}

