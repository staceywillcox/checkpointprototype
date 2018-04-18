// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBL1Q2Ct8zdwWCwvAPODTS70uY6-fEpTOw",
    authDomain: "checkpoint-85d60.firebaseapp.com",
    databaseURL: "https://checkpoint-85d60.firebaseio.com",
    projectId: "checkpoint-85d60",
    storageBucket: "checkpoint-85d60.appspot.com",
    messagingSenderId: "317796910275"
  };
  firebase.initializeApp(config);

  //Get elements
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
      btnLogout.classList.remove('hide');
      newtrip.classList.remove('hide');
      loginpage.classList.add('hide');


      var user = firebase.auth().currentUser;
      if (user != null){
        document.getElementById("user_para").innerHTML = "Welcome User: " ;
      }
    } else {
      console.log('not logged in');
      btnLogout.classList.add('hide');
      newtrip.classList.add('hide');
      loginpage.classList.remove('hide');
      user_data.classList.add('hide'); 
    }
 });

var rootRef = firebase.database().ref();
var tracksRef = rootRef.child("tracks");
tracksRef.once("value", function(snapshot) {
  snapshot.forEach(function(child) {
    console.log(child.key+": "+child.val());
  });
});

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

  newtrip.classList.add('hide');
  user_data.classList.remove('hide'); 

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






  



