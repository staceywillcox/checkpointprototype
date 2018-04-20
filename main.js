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

  // Add login event

  btnLogin.addEventListener('click', e =>{
    //get email and pass
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign in
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message))
    .then(function(user){
      alert(user.uid)
    });
  });

  btnSignup.addEventListener('click', e =>{
    //get email and pass
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    //Sign in
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  });




btnLogout.addEventListener('click', e => {
  firebase.auth().signOut();

});

//Add realtime listener
 firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      console.log(firebaseUser);
      // btnLogout.classList.remove('hide');
      newtrippage.classList.remove('hide');
      loginpage.classList.add('hide');


      var user = firebase.auth().currentUser;
      if (user != null){

      }
    } else {
      console.log('not logged in');
      // btnLogout.classList.add('hide');
      newtrippage.classList.add('hide');
      loginpage.classList.remove('hide');
      mytrippage.classList.add('hide'); 
    }
 });

// MY TRIP PAGE
var rootRef = firebase.database().ref();
var tracksRef = rootRef.child("tracks");


tracksRef.on("child_added", function(snapshot, prevChildKey) {
  var newPost = snapshot.val();
  console.log("Track: " + newPost.track);
  console.log("Time: " + newPost.time);
  console.log("Start: " + newPost.start);
  console.log("End: " + newPost.end);
  console.log("History: " + newPost.history);
  console.log("Contact: " + newPost.contact);        
  console.log("Previous Post ID: " + prevChildKey);
  document.getElementById("user_data").innerHTML = "Track: " + newPost.track + "<br>Time: " +newPost.time + "<br>Start: " +newPost.start + "<br>End: " +newPost.end + "<br>History: " +newPost.history + "<br>Contact: " +newPost.contact; 
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

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
  // Reference messages collection
  var messagesRef = firebase.database().ref('tracks');

// listen for form submit
document.getElementById('contactForm').addEventListener('submit', submitForm);

//Submit form
function submitForm(e){

	e.preventDefault();
//get values
	var track = getInputVal('track');
	var time = getInputVal('time');
	var start = getInputVal('start');
	var end = getInputVal('end');
	var history = getInputVal('history');
	var contact = getInputVal('contact');
	var timestamp = Date.now();


	//save message
	saveMessage(track, time, start, end, history, contact, timestamp);

	//Show alert
	document.querySelector('.alert').style.display = 'block';

  newtrippage.classList.add('hide');
  mytrippage.classList.remove('hide'); 

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

function saveMessage(track, time, start, end, history, contact, timestamp){
	var newMessageRef = messagesRef.push();
	newMessageRef.set({
		track:track,
		time:time,
		start:start,
		end:end, 
		history:history,
		contact:contact,
		timestamp: timestamp

	});
}









  



