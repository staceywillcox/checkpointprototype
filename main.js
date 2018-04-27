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
  const sendNotificationForm = document.getElementById('send-notification-form');

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

//NOTIFICATION MESSAGE CODE
sendNotificationForm.addEventListener('submit', sendNotification);

function sendNotification(e){
  e.preventDefault();
  const notificationMessage = document.getElementById('notification-message').value;

  FIREBASE_DATABASE.ref("/notification")
  .push({
    user:FIREBASE_AUTH.currentUser.email,
    message: notificationMessage,

  })
  .then(() =>{
     document.getElementById('notification-message').value = "";
  })
  .catch(() => {
    console.log("error sending notification")
  });
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
  // var start = getInputVal('start');
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

 // var d = new Date(date);
 // console.log(d);

 //    var x = document.getElementById("myDate").value;
 //    document.getElementById("pastuserdata").innerHTML = x;
 //    console.log(x)
  //save message
  saveMessage(track, time, timetill, history, contact, timestamp);

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

function saveMessage(track, time, timetill, history, contact, timestamp){
  var newMessageRef = messagesRef.push();
  newMessageRef.set({
    track:track,
    time:time,
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

  document.getElementById("user_data").innerHTML = "Track: " + newPost.track + "<br>Time: " +newPost.time + "<br>Start: " +newPost.start + "<br>End: " +newPost.end + "<br>History: " +newPost.history + "<br>Contact: " +newPost.contact ;
});



// PAST TRACK
    
  tracksRef.orderByChild('track').limitToFirst(100).on("child_added", function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    $("#pastuserdata").append("<br><ul><li>Track: " + data.track + "</li><li>Time: "+ data.time+"</li><li>Start: "+ data.start+"</li><li>End: "+ data.end+"</li><li>History: "+ data.history+"</li><li>Contact: "+ data.contact+"</li></ul><br>");

    // document.getElementById("pastuserdata").innerHTML = "Track: " + data.track + "<br>Time: " +data.time + "<br>Start: " +data.start + "<br>End: " +data.end + "<br>History: " +data.history + "<br>Contact: " +data.contact;   

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

var acc = document.getElementsByClassName("accordionnewtrip");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panelnewtrip = this.nextElementSibling;
        if (panelnewtrip.style.display === "block") {
            panelnewtrip.style.display = "none";
        } else {
            panelnewtrip.style.display = "block";
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
  var distance = countDownDate - now;

});


var today = new Date();
var timestamp = today.valueOf();
console.log(timestamp/1000)

// END

// Auto complete text input
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      });
}

/*An array containing all the country names in the world:*/
var countries = ["Stacey Willcox","Sandra Son","Kerryn Song","Cheryl Willcox","Noa Bigger"];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), countries);