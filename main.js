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

  // Reference messages collection
  var messagesRef = firebase.database().ref('messages');

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


console.log=contactForm





