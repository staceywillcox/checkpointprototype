

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



exports.sendTrackEmail = functions.database.ref('/users/{userId}/tracks/{trackId}').onCreate((snapshot) => {


  return sendTrackEmail();
});


// Sends a welcome email to the given user.
function sendTrackEmail() {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: 'kiwimade.sw@gmail.com',
  };

  mailOptions.subject = `${APP_NAME} Alert Message!`;
  mailOptions.text = `Hey! You are Stacey's emergency contact on the ${APP_NAME}. Stacey recently created a new track with the following information.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('New track email sent to emergency contact');
  });
}



exports.sendUpdateEmail = functions.database.ref('/users/{userId}/tracks/status').onUpdate((snapshot) => {


  return sendUpdateEmail();

});



// Sends a welcome email to the given user.
function sendUpdateEmail() {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: 'kiwimade.sw@gmail.com',
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `${APP_NAME} Track Message!`;
  mailOptions.text = `Hey! You are Stacey's emergency contact on the ${APP_NAME}. Stacey recently checked in as needing help. Please review the track information from the previous email and contact the emergency services if Stacey is unreachable.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Status update sent to emergency contact');
  });
}


