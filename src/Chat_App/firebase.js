// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth , sendPasswordResetEmail} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHi91QSMc6OghgPMOqglxfZ-zmc2TG0tY",
  authDomain: "samvada-chattingapp.firebaseapp.com",
  projectId: "samvada-chattingapp",
  storageBucket: "samvada-chattingapp.appspot.com",
  messagingSenderId: "816166852",
  appId: "1:816166852:web:c66ddb7e906be12eee9691",
  measurementId: "G-7TV6GH5TDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);
const db = getFirestore(app);
const storage=getStorage(app);
// const firestore = firestore(app);
export const sendResetPasswordEmail = (email) => {
  return sendPasswordResetEmail(auth, email);
};
export {auth,db,storage};