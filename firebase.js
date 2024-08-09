// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbYoB_4i0i7wgA0yBlz3MQyOAsLfy2nfQ",
  authDomain: "inventory-management-f0a37.firebaseapp.com",
  projectId: "inventory-management-f0a37",
  storageBucket: "inventory-management-f0a37.appspot.com",
  messagingSenderId: "827831513455",
  appId: "1:827831513455:web:6acababedeb9c9f150b89a",
  measurementId: "G-P3EB3H30MP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export{firestore};