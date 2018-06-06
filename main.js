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


  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

  //Get elements
 
  const txtName = document.getElementById('txtName');
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const txtEmailLogin = document.getElementById('txtEmailLogin');
  const txtPasswordLogin = document.getElementById('txtPasswordLogin');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignup = document.getElementById('btnSignup');
  const btnLogout = document.getElementById('btnLogout');


  const FIREBASE_DATABASE = firebase.database();
  const FIREBASE_AUTH = firebase.auth();
  const messaging = firebase.messaging();

var contactInputName;
var inputName;
var inputEmail;

  // LOGIN

  btnLogin.addEventListener('click', e =>{
    //get email and pass
    const email = txtEmailLogin.value;
    const pass = txtPasswordLogin.value;
    const auth = firebase.auth();
    //Sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => alert(e.message))
    .then(function(user){
      //alert(user.uid)
    });
  });
// END LOGIN

// SIGN UP
  btnSignup.addEventListener('click', e =>{
    //get email and pass
    const name = txtName.value;
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign in
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => alert(e.message));
  });
//END SIGN UP

//LOGOUT
btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();
  checkinpage.classList.add('hide');
  mytrippage.classList.add('hide');
  newtrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.add('hide');
  settingspage.classList.add('hide'); 
  location.reload();
});
//END LOGOUT

//Database reference
  var rootRef = firebase.database().ref();

//Add realtime listener
 firebase.auth().onAuthStateChanged(user => {
    if(user){

      newtrippage.classList.remove('hide');
      loginpage.classList.add('hide');
      console.log("User " + user.uid + " is logged in with " + user.email);
      var userId = user.uid;
      var userEmail = user.email;
      var txtName2 = document.getElementById('txtName2').value;
      var myNameRef = firebase.database().ref('users').child(userId);
      
      //If a user already exists then console log but if the user is new then add it to the database



      rootRef.child('users').child(userId).once("value", function(snapshot){
        var ifExists = snapshot.exists();
        if(ifExists){
          console.log('already in system')
        } else{
          rootRef.child('users').child(userId).push({id: userId, email: userEmail});

            myNameRef.set({
             name:txtName2,
 
            });
        }
      })

      var user = firebase.auth().currentUser;
      if (user != null){

 
      footer.classList.remove('hide');


// RETRIEVING STATUS
  var tracksRef = firebase.database().ref('users').child(userId).child('tracks');
  var useridRef = firebase.database().ref('users').child(userId);
  var checkstatus = useridRef.child('status');
  var trackChecked = useridRef.child('trackChecked');

//Displays late status option if user is late and normal check in if they are not


  var contactsRef = firebase.database().ref('users').child(userId).child('emergencycontacts');
//DATALIST OF EMERGENCY CONTACTS FOR NEW TRIP PAGE
  contactsRef.once("value")
  .then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var key = childSnapshot.key;
      var newContact = childSnapshot.val();
      console.log(newContact);
      $("#contact").append("<option>" + newContact.name + "</option>"); 
    });
  });




// contactsRef.once("value", function(snapshot) {
//   var newContact = snapshot.val();

// $("#contact123").append("<option>" + newContact.name + "</option>"); 
// });

// END DATALIST



//Shows current status
  checkstatus.once("value")
  .then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
         console.log(childData);
        document.getElementById("newstatus").innerHTML = "<b>Status:</b> "+ childData;
    });
  });

//Shows changed status without page reload
  checkstatus.on("child_changed", function(snapshot) {
    var status = snapshot.val();
  document.getElementById("newstatus").innerHTML = "<b>Status:</b> "+ status;

  });
 // SUBMITTING DATA TO THE TRACKS DATABASE

// listen for form submit
  document.getElementById('trackForm').addEventListener('submit', submitForm);




//SUBMIT FORM
  function submitForm(e){

  //e.preventDefault();

//get values
  var track = getInputVal('track');
  var time = getInputVal('time');
  var startTime = getInputVal('startTime');
  var startDate = getInputVal('startDate');
  var endTime = getInputVal('endTime');
  var endDate = getInputVal('endDate');
  var history = getInputVal('history');
  var contact = getInputVal('contact');
  var timetill = getInputVal('messagetime');
  var timestamp = Date.now();

  //save message
  saveMessage(track, time, startTime, startDate, endTime, endDate, timetill, history, contact, timestamp);



//UPDATE TRACKCHECKED
      trackChecked.update({
      trackChecked:'false',
      emailSent: 'false'
    });
//END 
//UPDATE STATUS TO NO STATUS ON NEW TRACK ADDED
      checkstatus.update({
      status:'no status'
    });


    var lateCheckIn = useridRef.child('lateCheckIn');

    lateCheckIn.update({
      status:'false',
      lateEmailSent:'false'
    });


//END     

  //Clear form
  document.getElementById('trackForm').reset();
}
//END SUBMIT FORM

//function to get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

//Save message to firebase

var tracksRef = firebase.database().ref('paths');
var saveChosenContact = firebase.database().ref('users').child(userId);

function saveMessage(track, time, startTime, startDate, endTime, endDate, timetill, history, contact, timestamp){
  var newMessageRef = tracksRef.push();
  newMessageRef.set({
    track:track,
    time:time,
    startdate:startDate,
    enddate:endDate,
    starttime:startTime,
    endtime:endTime,
    timetill:timetill,
    history:history,
    contact:contact,
    timestamp: timestamp,
    trackid:" "
  });


}
//END



      //CONTACT CODE
      var contactsRef = firebase.database().ref('users').child(userId).child('emergencycontacts');
      var selectedContactRef = firebase.database().ref('users').child(userId).child('selectedContact');

           contactsRef.once("value")
      .then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          var key = childSnapshot.key;
          var newContact = childSnapshot.val();

          // var contactValue = document.getElementById('contact').value;

        });
          var selectedContactData = firebase.database().ref('users').child(userId).child('emergencycontacts').child(contactInputName);
          console.log(contactInputName);
          selectedContactData.once("value", function(snapshot) {
            var selectedContactValue = snapshot.val();
            inputName = selectedContactValue.name;
            inputEmail = selectedContactValue.email;
            console.log(inputName + " " + inputEmail);

            
          
        });
              saveChosenContact.child('chosenContact').set({
                name: inputName,
                email: inputEmail

              });
      });

      // END CONTACT CODE


//SET STATUS OF CHECK IN
 document.getElementById('status').addEventListener('submit', submitStatusForm);

 function submitStatusForm(e){
  e.preventDefault();

  var status = useridRef.child('status');


    if(document.getElementById('checkedin').checked){
 

    status.update({
      'status':'Safe'
    });
  }

    if(document.getElementById('lateChecked').checked){
        var lateCheckIn = useridRef.child('lateCheckIn');

    lateCheckIn.update({
      'status':'true'
    });
  }

 }
//END
  


  



//PROFILE PAGE MY INFO
//SAVE NAME TO DATA BASE
// Reference messages collection
  var myNameRef = firebase.database().ref('users').child(userId);

// listen for form submit
  document.getElementById('myName').addEventListener('submit', submitnameForm);

//SUBMIT FORM
  function submitnameForm(e){

  e.preventDefault();
//get values
  var txtName = getnameInputVal('txtName');


  //save message
  saveNameMessage(txtName);
    //Clear form
  document.getElementById('myName').reset();
}
//END SUBMIT FORM

//function to get form values
function getnameInputVal(id){
  return document.getElementById(id).value;
}

//Save message to firebase

function saveNameMessage(txtName){
  myNameRef.set({
    name:txtName,
 
  });

}
//END

//RETRIEVE NAME FROM DATABASE
  var myNameRef = firebase.database().ref('users').child(userId).child('name');
    myNameRef.once("value", function(snapshot) {
    var myname = snapshot.val();
  document.getElementById("myuserName").innerHTML = "<b>Name:</b> "+ myname.name;

  });
  document.getElementById("myuserName").innerHTML = "<b>Name:</b> ";
  myNameRef.on("child_changed", function(snapshot) {
    var myname = snapshot.val();
  document.getElementById("myuserName").innerHTML = "<b>Name:</b> "+myname;

  });
//END

//RETREIVE TIME FROM DATABASE
var trackEndTime = firebase.database().ref('users').child(userId).child('tracks').limitToLast(1);
trackEndTime.on("child_added", function(snapshot) {
  var track = snapshot.val();
  var endDateRef = track.enddate;
  var endTimeRef = track.endtime;
  var timeTillRef = track.timetill;
  console.log(endDateRef);
  console.log(timeTillRef);


//TRYING TO FIGURE OUT THE DATE AND TIMERS
var countDownDate = new Date(endDateRef + " "+endTimeRef+":00").getTime();
var time = countDownDate;
var sendMessage = (time) - (-timeTillRef*1000);
console.log(time);
console.log(sendMessage);


var x = setInterval(function() {
  var now = new Date().getTime();

  var time2 = now;
  var distance = sendMessage - now;


    
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="demo"
    document.getElementById("demo").innerHTML = days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";
    document.getElementById("demo2").innerHTML ="Time Remaining: "+ days + "d " + hours + "h "
    + minutes + "m " + seconds + "s ";
  //console.log(distance);

      // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "Emergency Message has been sent if you did not check in";
          var lateCheckIn = useridRef.child('lateCheckIn');
            latecheckin.classList.remove('hide');
            ontime.classList.add('hide');
    }
      else{
            latecheckin.classList.add('hide');
            ontime.classList.remove('hide');
          }
});

var today = new Date();
var timestamp = today.valueOf();
console.log(timestamp)
});
//END OF DATE AND TIME 


// SUBMITTING DATA TO THE CONTACTS DATABASE

// Reference messages collection
  var contactsRef = firebase.database().ref('users').child(userId).child('emergencycontacts');

// listen for form submit
  document.getElementById('contactsForm').addEventListener('submit', submitContactsForm);

//SUBMIT FORM
  function submitContactsForm(e){

  e.preventDefault();
//get values
  var contactName = getInputVal('contactName');
  var contactEmail = getInputVal('contactEmail');


  //save contact
  saveContact(contactName, contactEmail);

  //Clear form
  document.getElementById('contactsForm').reset();
}
//END SUBMIT FORM

//function to get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

//Save message to firebase

function saveContact(contactName, contactEmail){
  var newcontactRef = contactsRef.push();
  contactsRef.child(contactName).set({
  name: contactName,
  email:contactEmail

  });
}
      }
    } else {
      console.log('not logged in');

      footer.classList.add('hide');
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
  contactInputName = newPost.contact;
  document.getElementById("user_data").innerHTML = "<b>Track:</b> " + newPost.track + "<br><b>Time:</b> " +newPost.time + "<br><b>Start:</b> " +newPost.startdate + " at "+newPost.starttime + "<br><b>End:</b> " +newPost.enddate + " at " +newPost.endtime + "<br><b>History:</b> " +newPost.history + "<br><b>Contact:</b> " +newPost.contact +"<br><b>Track ID:</b> " + newPost.trackid;
    var tracksRef = firebase.database().ref('users').child(userId).child('tracks');
    var checkstatus = useridRef.child('status');
});
//END CURRENT TRACK


// PAST TRACKS LIST
  tracksRef.orderByChild('track').limitToFirst(100).on("child_added", function(snapshot) {
    var data = snapshot.val();
     $("#pastuserdata").append("<br><ul><li><b>Track:</b> " + data.track + "</li><li><b>Time:</b> "+ data.time+"</li><li><b>Start:</b> "+ data.startdate +" at "+data.starttime+"</li><li><b>End:</b> "+ data.enddate + " at "+ data.endtime+"</li><li><b>History:</b> "+ data.history+"</li><li><b>Contact:</b> "+ data.contact+"</li><li><b>Track ID:</b> "+data.trackid+"</li></ul><br>"); 
  });    
//END PAST TRACKS LIST


contactsRef.on("child_added", function(snapshot) {
  var newContact = snapshot.val();

$("#existingcontacts").append("<br><ul><li><b>Name:</b> " + newContact.name + "</li><li><b>Email:</b> "+ newContact.email+"</li></ul><br>"); 
});

// CLEAR TRACK HISTORY
var tracksRef = firebase.database().ref('users').child(userId).child('tracks');
  clearHistory.addEventListener('click', e =>{
    tracksRef.remove();

      //Show alert
  document.querySelector('.alert').style.display = 'block';


  //Hide alert after 3 seconds
  setTimeout(function(){
  document.querySelector('.alert').style.display = 'none';  
  },3000);

  location.reload();
  });

//
});





//END