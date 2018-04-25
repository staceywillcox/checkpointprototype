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


  //Get elements
  const messaging = firebase.messaging();
  const txtName = document.getElementById('txtName');
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignup = document.getElementById('btnSignup');
  const btnLogout = document.getElementById('btnLogout');
  const subscribeButton = document.getElementById('subscribe');
  const unsubscribeButton = document.getElementById('unsubscribe');
  const sendNotificationForm = document.getElementById('send-notification-form');

  const FIREBASE_DATABASE = firebase.database();
  const FIREBASE_AUTH = firebase.auth();


//SUBSCRIPTION CODE
  messaging.onTokenRefresh(handleTokenRefresh);

subscribeButton.addEventListener('click', e =>{

    messaging.requestPermission()
    .then(()=> handleTokenRefresh())
    .then(() => checkSubscription())
    .catch((err) => console.log("user didn't give permission"));
})


function handleTokenRefresh(){
  return messaging.getToken()
      .then((token) => {

      FIREBASE_DATABASE.ref('/tokens').push({
        token: token,
        uid: FIREBASE_AUTH.currentUser.uid
      });

    });

}  

unsubscribeButton.addEventListener('click', e =>{
  messaging.getToken()
   .then((token) => messaging.deleteToken(token))
   .then(() => FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid)
    .once('value'))
   .then((snapshot) => {
    console.log(snapshot.val());
    const key = Object.keys(snapshot.val())[0];
    return FIREBASE_DATABASE.ref('/tokens').child(key).remove();
   })
   .then(() => checkSubscription())
   .catch((err) => console.log("unsubscribe failed"));
})

function checkSubscription(){
  FIREBASE_DATABASE.ref('/tokens').orderByChild('uid').equalTo(FIREBASE_AUTH.currentUser.uid).once('value')
  .then((snapshot) => {
    if (snapshot.val()){
      unsubscribeButton.classList.remove('hide');
      subscribeButton.classList.add('hide');
    } else{
      unsubscribeButton.classList.add('hide');
      subscribeButton.classList.remove('hide');
    }
  });

}
// END OF SUB CODE

//NOTIFICATION MESSAGE CODE
sendNotificationForm.addEventListener('submit', sendNotification);

function sendNotification(e){
  e.preventDefault();
  const notificationMessage = document.getElementById('notification-message').value;

  FIREBASE_DATABASE.ref("/notification")
  .push({
    user:FIREBASE_AUTH.currentUser.email,
    message: notificationMessage,

  }).then(() =>{
     document.getElementById('notification-message').value = "";
  })
  }


// END NOTIFICATION MESSAGE CODE

  // LOGIN

  btnLogin.addEventListener('click', e =>{
    //get email and pass
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message))
    .then(function(user){
      //alert(user.uid)
    });
  });

// SIGN UP
  btnSignup.addEventListener('click', e =>{
    //get email and pass
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign in
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  });


//LOGOUT
btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();

});

//Database reference
  var rootRef = firebase.database().ref();

//Add realtime listener
 firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      checkSubscription();
      console.log(firebaseUser);
      // btnLogout.classList.remove('hide');
      newtrippage.classList.remove('hide');
      loginpage.classList.add('hide');
      console.log("User " + firebaseUser.uid + " is logged in with " + firebaseUser.email);
      var userId = firebaseUser.uid;
      var userEmail = firebaseUser.email;

      
      //If a user already exists then console log but if the user is new then add it to the database
      rootRef.child('users').child(userId).once("value", function(snapshot){
        var ifExists = snapshot.exists();
        if(ifExists){
          console.log('already in system')
        } else{
          rootRef.child('users').child(userId).push({id: userId, email: userEmail});
        }
      })

      var user = firebase.auth().currentUser;
      if (user != null){

// SUBMITTING DATA TO THE TRACKS DATABASE

  // Reference messages collection
  var messagesRef = firebase.database().ref('users').child(userId).child('tracks');

// listen for form submit
  document.getElementById('contactForm').addEventListener('submit', submitForm);

//Submit form
  function submitForm(e){

  e.preventDefault();
//get values
  var track = getInputVal('track');
  var time = getInputVal('time');
  var start = getInputVal('start');
  //var endinput = getInputVal('end');
  // var endoutput = endinput;
  var date = getInputVal('myDate');
  // var month = getInputVal('month');
  // var day = getInputVal('day');
  // var year = getInputVal('year');
  // var hours = getInputVal('hours');
  // var minutes = getInputVal('minutes');
  var history = getInputVal('history');
  var contact = getInputVal('contact');
  var timetill = getInputVal('messagetime')
  var timestamp = Date.now();

 var d = new Date(date);
 console.log(d);

    var x = document.getElementById("myDate").value;
    document.getElementById("pastuserdata").innerHTML = x;
    console.log(x)
  //save message
  saveMessage(track, time, start, timetill, history, contact, timestamp);

  //Show alert
  document.querySelector('.alert').style.display = 'block';


  //Hide alert after 3 seconds
  setTimeout(function(){
  document.querySelector('.alert').style.display = 'none';  
  },3000);

  //Clear form
  document.getElementById('contactForm').reset();
}


//function to get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

//Save message to firebase

function saveMessage(track, time, start, timetill, history, contact, timestamp){
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    track:track,
    time:time,
    start:start,  
    timetill:timetill,
    history:history,
    contact:contact,
    timestamp: timestamp

  });

}
      }
    } else {
      console.log('not logged in');
      // btnLogout.classList.add('hide');
      newtrippage.classList.add('hide');
      loginpage.classList.remove('hide');
      mytrippage.classList.add('hide'); 
    }





//RETRIEVING TRACKS DATA FROM DATABASE
// MY TRIP PAGE

var tracksRef = firebase.database().ref('users').child(userId).child('tracks');

// CURRENT TRACK
tracksRef.on("child_added", function(snapshot, prevChildKey) {
  var newPost = snapshot.val();
  // console.log("Track: " + newPost.track);
  // console.log("Time: " + newPost.time);
  // console.log("Start: " + newPost.start);
  // console.log("End: " + newPost.end);
  // console.log("History: " + newPost.history);
  // console.log("Contact: " + newPost.contact);     

 

  document.getElementById("user_data").innerHTML = "Track: " + newPost.track + "<br>Time: " +newPost.time + "<br>Start: " +newPost.start + "<br>End: " +newPost.end + "<br>History: " +newPost.history + "<br>Contact: " +newPost.contact ;
});



// PAST TRACK
    
  tracksRef.orderByChild('track').limitToFirst(3).on("child_added", function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    document.getElementById("pastuserdata").innerHTML = "Track: " + data.track + "<br>Time: " +data.time + "<br>Start: " +data.start + "<br>End: " +data.end + "<br>History: " +data.history + "<br>Contact: " +data.contact;   

    // document.getElementById("pastuserdata").innerHTML = data.timetill  ;
});    



});



// GOING BETWEEN PAGES

// CHECKIN PAGE
checkinbutton.addEventListener('click', e => {
  checkinpage.classList.remove('hide');
  mytrippage.classList.add('hide');
  newtrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.add('hide');
  settingspage.classList.add('hide');    
});

// NEW TRIP PAGE
mytripbutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.remove('hide');
  mytrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.add('hide');
  settingspage.classList.add('hide');    
});

// WEATHER PAGE
weatherbutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.add('hide');
  mytrippage.classList.add('hide');
  weatherpage.classList.remove('hide');
  profilepage.classList.add('hide');
  settingspage.classList.add('hide');    
});

// PROFILE PAGE
profilebutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.add('hide');
  mytrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.remove('hide');
  settingspage.classList.add('hide');    
});

// SETTINGS PAGE
settingsbutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.add('hide');
  mytrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.add('hide');
  settingspage.classList.remove('hide');    
});


//Accordian code for profile page list menu

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}




// TRYING TO FIGURE OUT THE DATE AND TIMERS
var countDownDate = new Date("Sep 5, 2018 15:37:25").getTime();
var time = countDownDate/1000;
console.log(time);

var x = setInterval(function() {
  var now = new Date().getTime();
  var time2 = now/1000;
  //console.log(time2);
  var distance = countDownDate - now;
  //console.log(distance);
});


var today = new Date();
var timestamp = today.valueOf();
console.log(timestamp/1000)

// END

