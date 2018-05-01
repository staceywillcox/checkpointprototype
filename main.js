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
 
  const txtName = document.getElementById('txtName');
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignup = document.getElementById('btnSignup');
  const btnLogout = document.getElementById('btnLogout');
  const subscribeButton = document.getElementById('subscribe');
  const unsubscribeButton = document.getElementById('unsubscribe');

  const FIREBASE_DATABASE = firebase.database();
  const FIREBASE_AUTH = firebase.auth();
  const messaging = firebase.messaging();

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
// END LOGIN

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
//END SIGN UP

//LOGOUT
btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();
});
//END LOGOUT

//Database reference
  var rootRef = firebase.database().ref();

//Add realtime listener
 firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      checkSubscription();
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




// RETRIEVING STATUS
  var messagesRef = firebase.database().ref('users').child(userId).child('tracks');
  var useridRef = firebase.database().ref('users').child(userId);
  var checkstatus = useridRef.child('status');

  checkstatus.once("value")
  .then(function(snapshot){
    snapshot.forEach(function(childSnapshot){
      var key = childSnapshot.key;
      var childData = childSnapshot.val();
         console.log(childData);
        document.getElementById("newstatus").innerHTML = "Status: "+ childData;
    });
  });
        
 // SUBMITTING DATA TO THE TRACKS DATABASE

// listen for form submit
  document.getElementById('trackForm').addEventListener('submit', submitForm);
  var helpstatus = useridRef.child('helpstatus');
  var longerstatus = useridRef.child('longerstatus');
  var safestatus = useridRef.child('safestatus');
//SUBMIT FORM
  function submitForm(e){

  e.preventDefault();

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

  //Show alert
  document.querySelector('.alert').style.display = 'block';


  //Hide alert after 3 seconds
  setTimeout(function(){
  document.querySelector('.alert').style.display = 'none';  
  },3000);

//UPDATE STATUS TO NO STATUS ON NEW TRACK ADDED
      checkstatus.update({
      'status':'no status'
    })
   helpstatus.remove();
   longerstatus.remove();
   safestatus.remove();
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

function saveMessage(track, time, startTime, startDate, endTime, endDate, timetill, history, contact, timestamp){
  var newMessageRef = messagesRef.push();
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
    timestamp: timestamp
  });
}
//END

//SET STATUS OF CHECK IN
 document.getElementById('status').addEventListener('submit', submitStatusForm);

 function submitStatusForm(e){
  e.preventDefault();

  var status = useridRef.child('status');

    if(document.getElementById('longer').checked){
       var longerstatus = useridRef.child('longerstatus');
    longerstatus.update({
      'status':'Need longer'
    });
    status.update({
      'status':'Need longer'
    });
  }

    if(document.getElementById('help').checked){
       var helpstatus = useridRef.child('helpstatus');
    helpstatus.update({
      'status':'Need Help'
    });
    status.update({
      'status':'Need help'
    });
  }

    if(document.getElementById('checkedin').checked){
       var safestatus = useridRef.child('safestatus');
    safestatus.update({
      'status':'Safe'
    });
    status.update({
      'status':'Safe'
    });
  }

 }
//END
  


  



//PROFILE PAGE MY INFO
//SAVE NAME TO DATA BASE
// Reference messages collection
  var myNameRef = firebase.database().ref('users').child(userId).child('name');

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
  var newNameRef = myNameRef.push();
  newNameRef.set({
    name:txtName,
 
  });

}
//END

//RETRIEVE NAME FROM DATABASE
  var myNameRef = firebase.database().ref('users').child(userId).child('name');
  document.getElementById("myuserName").innerHTML = "Name: ";
  myNameRef.on("child_added", function(snapshot) {
    var myname = snapshot.val();
  document.getElementById("myuserName").innerHTML = "Name: "+myname.name;

  });



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


  //save message
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
  newcontactRef.set({
  name: contactName,
  email:contactEmail

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

  document.getElementById("user_data").innerHTML = "Track: " + newPost.track + "<br>Time: " +newPost.time + "<br>Start: " +newPost.startdate + " at "+newPost.starttime + "<br>End: " +newPost.enddate + " at " +newPost.endtime + "<br>History: " +newPost.history + "<br>Contact: " +newPost.contact ;
    var messagesRef = firebase.database().ref('users').child(userId).child('tracks');
    var checkstatus = useridRef.child('status');
});
//END CURRENT TRACK


// PAST TRACKS LIST
  tracksRef.orderByChild('track').limitToFirst(100).on("child_added", function(snapshot) {
    var data = snapshot.val();
     $("#pastuserdata").append("<br><ul><li>Track: " + data.track + "</li><li>Time: "+ data.time+"</li><li>Start: "+ data.startdate +" at "+data.starttime+"</li><li>End: "+ data.enddate + " at "+ data.endtime+"</li><li>History: "+ data.history+"</li><li>Contact: "+ data.contact+"</li></ul><br>"); 
  });    
//END PAST TRACKS LIST


contactsRef.on("child_added", function(snapshot) {
  var newContact = snapshot.val();

$("#existingcontacts").append("<br><ul><li>Name: " + newContact.name + "</li><li>Email: "+ newContact.email+"</li></ul><br>"); 
});
//
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
//END CHECKIN PAGE

// NEW TRIP PAGE
mytripbutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.remove('hide');
  mytrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.add('hide');
  settingspage.classList.add('hide');    
});
//END TRIP PAGE

// WEATHER PAGE
weatherbutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.add('hide');
  mytrippage.classList.add('hide');
  weatherpage.classList.remove('hide');
  profilepage.classList.add('hide');
  settingspage.classList.add('hide');    
});
//END WEATHER PAGE

// PROFILE PAGE
profilebutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.add('hide');
  mytrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.remove('hide');
  settingspage.classList.add('hide');    
});
//END PROFILE PAGE

// SETTINGS PAGE
settingsbutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.add('hide');
  mytrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.add('hide');
  settingspage.classList.remove('hide');    
});
//END SETTINGS PAGE
//END GOING BETWEEN PAGES BUTTONS


//ACCORDION FOR PROFILE PAGE 

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

var acc2 = document.getElementsByClassName("accordionnewtrip");
var a;

for (a = 0; a < acc2.length; a++) {
    acc2[a].addEventListener("click", function() {
        this.classList.toggle("active");
        var panelnewtrip = this.nextElementSibling;
        if (panelnewtrip.style.display === "block") {
            panelnewtrip.style.display = "none";
        } else {
            panelnewtrip.style.display = "block";
        }
    });
}
//END OF ACCORDION FOR PROFILE PAGE


//TRYING TO FIGURE OUT THE DATE AND TIMERS
var countDownDate = new Date("Sep 5, 2018 15:37:25").getTime();
var time = countDownDate/1000;
console.log(time);

var x = setInterval(function() {
  var now = new Date().getTime();
  var time2 = now/1000;
  var distance = countDownDate - now;
});

var today = new Date();
var timestamp = today.valueOf();
console.log(timestamp/1000)

//END OF DATE AND TIME 

// AUTO COMPLETE EMERGENCY CONTACT
function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });

  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      });
}
var emergencycontacts = ["Stacey Willcox","Sandra Son","Kerryn Song","Cheryl Willcox","Noa Bigger"];

autocomplete(document.getElementById("contact"), emergencycontacts);

//END OF AUTOCOMPLETE


