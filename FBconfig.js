import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQknY-O0YMVbWk2xWRaovfenqCTuUx3JE",
  authDomain: "flashh-a5aea.firebaseapp.com",
  projectId: "flashh-a5aea",
  storageBucket: "flashh-a5aea.appspot.com",
  messagingSenderId: "44892140568 ",
  appId: "1:44892140568:android:5a5830e9fe2bf3ef4eff6d"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
export { db };
