
importScripts("https://www.gstatic.com/firebasejs/4.12.1/firebase.js");
importScripts("https://www.gstatic.com/firebasejs/4.12.1/firebase-app.js");
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
  // The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.


  firebase.initializeApp(config);
  firebase.messaging();

  // usePublicVapidKey("BB173CWetvv1kW6BTaQn8RiwwqmqW1ZjHoNvWDZnjvXWxvowzhdDZALB-50dBMuJG2w0Vk1x-LR5twmTKWxt5w0")

  

