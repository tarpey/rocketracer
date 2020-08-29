import * as fb from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebase = fb.initializeApp({
  apiKey: "AIzaSyBGSAF5H4hTT34hCx7o-Y_zwrZS0RkrkVQ",
  authDomain: "racing-a762e.firebaseapp.com",
  databaseURL: "https://racing-a762e.firebaseio.com",
  projectId: "racing-a762e",
  storageBucket: "racing-a762e.appspot.com",
  messagingSenderId: "928823915837",
  appId: "1:928823915837:web:eac4b5f5c5736a0937c154",
  measurementId: "G-6G43M2LF4D",
});

export default firebase;
