import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBS38LOwTz_rhp0xZyGF7WBhYNPh887KSU",
    authDomain: "chatapp-e9fa3.firebaseapp.com",
    projectId: "chatapp-e9fa3",
    storageBucket: "chatapp-e9fa3.appspot.com",
    messagingSenderId: "232549271290",
    appId: "1:232549271290:web:2e5beb4a29afe30f3beb43"
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };