// ENTER CODE FROM FIREBASE RIGHT BELOW HERE!
// Initialize Firebase
var config = {
apiKey: "AIzaSyAKuFRSn6TVx0qTrZlJLz4xZPfbWovzMis",
authDomain: "rcn-dev-ed04f.firebaseapp.com",
databaseURL: "https://rcn-dev-ed04f.firebaseio.com",
projectId: "rcn-dev-ed04f",
storageBucket: "rcn-dev-ed04f.appspot.com",
};
firebase.initializeApp(config);
// ENTER CODE FROM FIREBASE RIGHT ABOVE HERE!

// Firebase auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
