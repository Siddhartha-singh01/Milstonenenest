import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBFScpj_uL7D7B5W_yotUZobpQxZvUuTOQ",
    authDomain: "milstonenest.firebaseapp.com",
    projectId: "milstonenest",
    storageBucket: "milstonenest.firebasestorage.app",
    messagingSenderId: "507969308816",
    appId: "1:507969308816:web:8be9e4ca817342db63b015",
    measurementId: "G-HT93PRM44H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
