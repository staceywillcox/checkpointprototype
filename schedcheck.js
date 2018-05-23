
  var firebase = require('firebase-admin');  
  var serviceAccount = require("./checkpoint-service-key.json");

  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://checkpoint-85d60.firebaseio.com'
  });


  const nodemailer = require('nodemailer');
  const express = require('express');
  const APP_NAME = 'Checkpoint App';
  var mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'checkpointappalert@gmail.com',
        pass: 'vicmddn352'
    },
  });

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
          //console.log(name);

          var userNameRef = firebase.database().ref('users').child(userId).child('name');

          userNameRef.once("value")
          .then(function(snapshot){
            var userName = snapshot.child('name').val();
            //console.log(userName);
                    
            var tracksRef = firebase.database().ref('users').child(userId).child('tracks').limitToLast(1);


            tracksRef.once("value")
            .then(function(snapshot){
              snapshot.forEach(function(childSnapshot){
                var key = childSnapshot.key;
                var trackName = childSnapshot.child('track').val();
                var trackTime = childSnapshot.child('time').val();
                var trackStartTime = childSnapshot.child('starttime').val();
                var trackEndTime = childSnapshot.child('endtime').val();
                var trackStartDate = childSnapshot.child('startdate').val();
                var trackEndDate = childSnapshot.child('enddate').val();
                var trackHistory = childSnapshot.child('history').val();
                var trackid = childSnapshot.child('trackid').val();
        
                    
                checkStatus();
                checkForNewTrack();

                // Sends a new track email to the emergency contact.
                function sendTrackEmail() {
                  const mailOptions = {
                    from: `${APP_NAME} <noreply@firebase.com>`,
                    to: `${email}`,
                  };

                  mailOptions.subject = `${APP_NAME} Track Message!`;
                  mailOptions.text = `Hey ${name}! You are ${userName}'s emergency contact on the ${APP_NAME}. ${name} recently created a new track with the following information.

                       Track Name: ${trackName}
                       Track Duration: ${trackTime}
                       Start Time: ${trackStartTime} on ${trackStartDate}
                       End Time:  ${trackEndTime} on ${trackEndDate}
                       Previous track history: ${trackHistory}

                       To view ${userName}'s current track on a map please use the unique ID ${trackid} on Checkpoint Guest Login page.

                  You will receive a confirmation email when ${userName} checks in safely or an alert email if they do not check in on time. `;
                  return mailTransport.sendMail(mailOptions).then(() => {
                    return console.log('New track email sent to emergency contact');
                  });
                }//end sendtrackemail

                // Sends a new track email to the emergency contact.
                function sendEmergencyEmail() {
                  const mailOptions = {
                    from: `${APP_NAME} <noreply@firebase.com>`,
                    to: `${email}`,
                  };

                  mailOptions.subject = `${APP_NAME} Track Message!`;
                  mailOptions.text = `Hey ${name}! You are ${userName}'s emergency contact on the ${APP_NAME}. ${name} failed to check in by their estimated time of arrival. If you cannot make contact with ${userName} then please contact the emergency services and provide them with the following information.

                       Track Name: ${trackName}
                       Track Duration: ${trackTime}
                       Start Time: ${trackStartTime} on ${trackStartDate}
                       End Time:  ${trackEndTime} on ${trackEndDate}
                       Previous track history: ${trackHistory}`;
                  return mailTransport.sendMail(mailOptions).then(() => {
                    return console.log('Emergency email sent to emergency contact');
                  });
                }//end sendemergencyemail


                //Safe status email
                function sendSafeEmail() {
                  const mailOptions = {
                    from: `${APP_NAME} <noreply@firebase.com>`,
                    to: `${email}`,
                  };

                  mailOptions.subject = `${APP_NAME} Alert Message!`;
                  mailOptions.text = `Hey ${name}! You are ${userName}'s emergency contact on the ${APP_NAME}. ${userName} recently checked in as safe. No need to worry.`;
                  return mailTransport.sendMail(mailOptions).then(() => {
                    return console.log('Status update sent to emergency contact');
                  });
                }//end sendSafeEmail

                      // Needing help status email
                function sendUpdateEmail() {
                  const mailOptions = {
                    from: `${APP_NAME} <noreply@firebase.com>`,
                    to: `${email}`,
                  };
                  mailOptions.subject = `${APP_NAME} Alert Message!`;
                  mailOptions.text = `Hey ${name}! You are ${userName}'s emergency contact on the ${APP_NAME}. ${userName} recently checked in as needing help. Please review the track information from the previous email and contact the emergency services if ${userName} is unreachable.`;
                  return mailTransport.sendMail(mailOptions).then(() => {
                    return console.log('Status update sent to emergency contact');
                  });
                }//end sendUpdateEmail

                //Needing longer
                function sendLongerEmail() {
                  const mailOptions = {
                    from: `${APP_NAME} <noreply@firebase.com>`,
                    to: `${email}`,
                  };

                  // The user subscribed to the newsletter.
                  mailOptions.subject = `${APP_NAME} Alert Message!`;
                  mailOptions.text = `Hey ${name}! You are ${userName}'s emergency contact on the ${APP_NAME}. ${userName} recently checked in to say she is taking longer than expected. Her new estimated time of arrival is mm:hh dd/mm/yyyy. An update email will be sent to you when she checks in again or if she doesn't check in by her estimated time of arrival.`;
                  return mailTransport.sendMail(mailOptions).then(() => {
                    return console.log('Status update sent to emergency contact');
                  });
                }// end sendLongerEmail


                //SEND AN EMAIL IF A NEW TRACK IS CREATED HERE
                function checkForNewTrack(){
                  var trackCheckedRef = firebase.database().ref('users').child(userId).child('trackChecked');
                  trackCheckedRef.once('value')
                  .then(function(snapshot){
                    var trackChecked = snapshot.child('trackChecked').val();
                    console.log("The track has been checked: " +trackChecked);
                    
                    if(trackChecked == 'false'){
                      sendTrackEmail();
                      trackCheckedRef.update({
                        trackChecked:'true',
                        emailSent:'false'
                      });
                    }
                    else{
                      console.log("no new tracks");
                    }
                  });//end snapshot function
                }//end checkForNewTrack



                function checkStatus(){
                  // var checkstatus = firebase.database().ref('status');
                  var checkstatus = firebase.database().ref('users').child(userId).child('status');
                  checkstatus.once("value")
                  .then(function(snapshot){
                    snapshot.forEach(function(childSnapshot){
                      var key = childSnapshot.key;
                      var childData = childSnapshot.val();
                      console.log("Current status: "+ childData);

                      //check countdown
                      var trackEndTime = firebase.database().ref('users').child(userId).child('tracks').limitToLast(1);
                      trackEndTime.on("child_added", function(snapshot) {
                        var track = snapshot.val();
                        var endDateRef = track.enddate;
                        var endTimeRef = track.endtime;
                        var timeTillRef = track.timetill;
                        // console.log(endDateRef);
                        // console.log(timeTillRef);

                        //TRYING TO FIGURE OUT THE DATE AND TIMERS
                        var countDownDate = new Date(endDateRef + " "+endTimeRef+":00").getTime();
                        var time = countDownDate;
                        var sendMessage = (time) - (-timeTillRef*1000);
                        // console.log(time);
                        // console.log(sendMessage);

                        if(childData){
                          var emailSentRef = firebase.database().ref('users').child(userId).child('trackChecked');

                          emailSentRef.once("value")
                          .then(function(snapshot){
                            var emailSent = snapshot.child("emailSent").val();

                            if(childData == "Safe"){
                              if(emailSent == 'false'){
                                sendSafeEmail();
                                console.log("Safe Email was sent");
                                emailSentRef.update({
                                  emailSent:'true'
                                });
                              } 
                              else{
                                console.log('No more emails need to be sent');

                              }
                            }//end if safe
                            else{
                              console.log("The status was not 'safe'");

                              var x = setInterval(function() {
                                var now = new Date().getTime();
                                var time2 = now;
                                var distance = sendMessage - now;

                                // If the count down is over, write some text 
                                if (distance < 0) {

                                    if(emailSent == 'false'){
                                      clearInterval(x);
                                      sendEmergencyEmail();
                                      console.log(emailSent);

                                      emailSentRef.update({
                                        emailSent:'true'
                                      });
                                      console.log("Emergency message sent");
                                    } //end if
                                  
                                    else{

                                    }//end else
                                
                                }//end if distance 

                                else{
                                
                                }

                              });//setinterval end
                            }//else end
                          

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
                          }
                        });
                        }// if childdata end

                      });//end trackEndTime snapshot
                    });//end snapshot foreach
                  });//end checkstatus snapshot
                }//end checkstatus function
              });//end snapshot.forEach  
            });//end tracksRef snapshot
          });//end username ref snapshot
        });//end emergency email snapshot
      }); //end  listUsersResult.users.forEach
    });  //end function(listUsersResult)
  }//end list all users
   
listAllUsers();






