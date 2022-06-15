import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage"
const fire = firebase.initializeApp({
    apiKey: "AIzaSyBFxwvshqNQG8hKdo2g-hpo9FJ09s7iHE0",
    authDomain: "mesenger-78201.firebaseapp.com",
    projectId: "mesenger-78201",
    storageBucket: "mesenger-78201.appspot.com",
    messagingSenderId: "743112840012",
    appId: "1:743112840012:web:f1e03b8068642bec69f5e9",
  });
  
  const auth = firebase.auth();
  const db = fire.firestore();
  const storage = firebase.storage(fire)
  export { auth, db, storage }