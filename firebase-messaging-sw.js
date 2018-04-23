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

  messaging.usePublicVapidKey("BB173CWetvv1kW6BTaQn8RiwwqmqW1ZjHoNvWDZnjvXWxvowzhdDZALB-50dBMuJG2w0Vk1x-LR5twmTKWxt5w0")

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

 messaging.getToken().then(function(currentToken) {
    if (currentToken) {
      sendTokenToServer(currentToken);
      updateUIForPushEnabled(currentToken);
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
      updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }
  }).catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  });
}

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function() {
  messaging.getToken().then(function(refreshedToken) {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the
    // app server.
    setTokenSentToServer(false);
    // Send Instance ID token to app server.
    sendTokenToServer(refreshedToken);
    // ...
  }).catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
    showToken('Unable to retrieve refreshed token ', err);
  });
});

messaging.onMessage(function(payload){
	console.log('onMessage: ', payload );
})