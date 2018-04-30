


// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBL1Q2Ct8zdwWCwvAPODTS70uY6-fEpTOw",
    authDomain: "checkpoint-85d60.firebaseapp.com",
    databaseURL: "https://checkpoint-85d60.firebaseio.com",
    projectId: "checkpoint-85d60",
    storageBucket: "checkpoint-85d60.appspot.com",
    messagingSenderId: "317796910275"
  };
  // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.


  firebase.initializeApp(config);

  var messagesRef = firebase.database().ref('users').child(userId).child('tracks');
  var checkstatus = messagesRef.child('status');


  messagesRef.on("child_added", function(snapshot, prevChildKey) {
    var val = snapshot.val();

    if(messagesRef.orderByChild("status").equalTo("checkedin").on("child_added")){
        console.log("checkedin");
        var checkedin = true ;
  }     if(messagesRef.orderByChild("status").equalTo("Taking longer").on("child_added")){
        console.log("Taking longer");
        var longer = true ;
  } if(messagesRef.orderByChild("status").equalTo("help").on("child_added")){
        console.log("Need Help");
        import {sendTrackEmail}
        var help = true ;

  }


  


  });



