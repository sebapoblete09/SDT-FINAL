// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXHzd6NpkMdqJiG9kOqToy296K82qxDB0",
  authDomain: "sabores-de-la-tierra-81626.firebaseapp.com",
  projectId: "sabores-de-la-tierra-81626",
  storageBucket: "sabores-de-la-tierra-81626.appspot.com",
  messagingSenderId: "61837473412",
  appId: "1:61837473412:web:9f7e083ff67ed1db0174d1",
  measurementId: "G-2E1731SPH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export {app, auth, db };