import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";


var firebaseConfig = {
    apiKey: "AIzaSyCLjzbqEzGPT1VFtL3Ce1EMRmEQAjJirts",
    authDomain: "react-slack-clone-9f417.firebaseapp.com",
    databaseURL: "https://react-slack-clone-9f417.firebaseio.com",
    projectId: "react-slack-clone-9f417",
    storageBucket: "react-slack-clone-9f417.appspot.com",
    messagingSenderId: "727358299203",
    appId: "1:727358299203:web:a7c2bd52bb3fbe6e1848f6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;