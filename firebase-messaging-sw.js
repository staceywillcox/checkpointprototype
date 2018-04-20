importScripts("https://www.gstatic.com/firebasejs/4.12.1/firebase-main.js");
importScripts("https://www.gstatic.com/firebasejs/4.12.1/firebase-messaging.js");

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

  const messaging = firebase.messaging();

  messaging.requestPermission()
.then(function(){
  console.log('Have Permission');
  return messaging.getToken();
})

.then (function(token){
console.log(token)

})


.catch(function(err){
  console.log('Error Occured.');

})

messaging.onMessage(function(payload){
	console.log('onMessage: ', payload );
})