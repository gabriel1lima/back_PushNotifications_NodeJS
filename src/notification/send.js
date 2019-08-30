var admin = require('firebase-admin');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pushnotifications-aec76.firebaseio.com"
});

// This registration token comes from the client FCM SDKs.
var registrationToken = '';

var payload = {
  notification: {
    title: "Account Deposit",
    body: "A deposit to your savings account has just cleared.",
    tag: "abc"
  },
  data: {
    account: "Savings",
    balance: "$3020.25",
    img: "https://media-cdn.tripadvisor.com/media/photo-s/0c/4c/88/16/img-20160728-wa0004-largejpg.jpg"
  }
};

var options = {
  priority: "high",
};


// Send a message to the device corresponding to the provided
// registration token.

function send(todo){
    payload.notification.title = todo.title;
    payload.notification.body = todo.author;

    admin.messaging().sendToDevice(registrationToken, payload, options)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
}
module.exports = send