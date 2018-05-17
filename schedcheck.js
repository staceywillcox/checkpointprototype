
var firebase = require('firebase-admin');  

var serviceAccount = require("./checkpoint-service-key.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://checkpoint-85d60.firebaseio.com'
});


const nodemailer = require('nodemailer');
const express = require('express');



function listAllUsers(nextPageToken) {
  // List batch of users, 1000 at a time.
  firebase.auth().listUsers(1000, nextPageToken)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
        var userId = userRecord.uid;
        console.log("user id", userRecord.uid);
  

var emergencyemail = firebase.database().ref('users').child(userId).child('emergencycontacts').child("contact");

          emergencyemail.once("value")
          .then(function(snapshot){
              var email = snapshot.child('email').val();
              var name = snapshot.child('name').val();
                 console.log(name);
 checkStatus();

const APP_NAME = 'Checkpoint App';

//Safe status email
    function sendSafeEmail() {
      const mailOptions = {
        from: `${APP_NAME} <noreply@firebase.com>`,
        to: `${email}`,
      };

      mailOptions.subject = `${APP_NAME} Track Message!`;
      mailOptions.text = `Hey ${name}! You are Stacey's emergency contact on the ${APP_NAME}. Stacey recently checked in as safe. No need to worry.`;
      return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('Status update sent to emergency contact');
      });
    }

    // Needing help status email
    function sendUpdateEmail() {
      const mailOptions = {
        from: `${APP_NAME} <noreply@firebase.com>`,
        to: `${email}`,
      };
      mailOptions.subject = `${APP_NAME} Track Message!`;
      mailOptions.text = `Hey! You are Stacey's emergency contact on the ${APP_NAME}. Stacey recently checked in as needing help. Please review the track information from the previous email and contact the emergency services if Stacey is unreachable.`;
      return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('Status update sent to emergency contact');
      });
    }

    //Needing longer
    function sendLongerEmail() {
      const mailOptions = {
        from: `${APP_NAME} <noreply@firebase.com>`,
        to: `${email}`,
      };

      // The user subscribed to the newsletter.
      mailOptions.subject = `${APP_NAME} Track Message!`;
      mailOptions.text = `Hey! You are Stacey's emergency contact on the ${APP_NAME}. Stacey recently checked in to say she is taking longer than expected. Her new estimated time of arrival is mm:hh dd/mm/yyyy. An update email will be sent to you when she checks in again or if she doesn't check in by her estimated time of arrival.`;
      return mailTransport.sendMail(mailOptions).then(() => {
        return console.log('Status update sent to emergency contact');
      });
    }

        function checkStatus(){
          // var checkstatus = firebase.database().ref('status');
          var checkstatus = firebase.database().ref('users').child(userId).child('status');
          checkstatus.once("value")
          .then(function(snapshot){
            snapshot.forEach(function(childSnapshot){
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
                 console.log(childData);
                  if(childData){
                      if(childData == "Safe"){
                        sendSafeEmail();
                        console.log("Safe Email was sent");
                      }
                      else{
                        console.log("The status was not 'safe'");
                        //Do something
                      }

                      if(childData == "Need longer"){
                        sendLongerEmail();
                        console.log("Need Longer Email was sent");
                      }
                      else{
                        console.log("The status was not 'longer'");
                      }

                      if(childData == "Need help"){
                        sendUpdateEmail();
                        console.log("Help Email was sent");
                      }
                      else{
                        console.log("The status was not 'help'");
                        //Do something
                      }
                  }
            });
          });
        }

           });   
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken)
      }
    })
    .catch(function(error) {
      console.log("Error listing users:", error);
    });
}
// Start listing users from the beginning, 1000 at a time.
listAllUsers();



var mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'checkpointappalert@gmail.com',
    pass: 'vicmddn352'
  },
});


