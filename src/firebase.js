// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW2VRQ52ux8vOlsvlQsATuNPA_yeeHpIE",
  authDomain: "realtor-clone-react-e9534.firebaseapp.com",
  projectId: "realtor-clone-react-e9534",
  storageBucket: "realtor-clone-react-e9534.appspot.com",
  messagingSenderId: "129012549946",
  appId: "1:129012549946:web:4ab31dc5934da69aece803"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();