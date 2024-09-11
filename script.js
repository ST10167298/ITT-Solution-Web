import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuXoW02N61qOyypMF7LTPC6sGo_Aesj3E",
  authDomain: "clinic-1f6c8.firebaseapp.com",
  databaseURL: "https://clinic-1f6c8-default-rtdb.firebaseio.com",
  projectId: "clinic-1f6c8",
  storageBucket: "clinic-1f6c8.appspot.com",
  messagingSenderId: "455289222957",
  appId: "1:455289222957:web:1725d776c536db1b5185a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getFirestore();

// Function to display messages
function showMessage(message, divId) {
    const displayMessage = document.getElementById(divId);
    displayMessage.style.display = "block";
    displayMessage.innerHTML = message;
    displayMessage.style.opacity = 1;
    
}

// Form declarations
const signUpButton = document.querySelector('.HBtn');
const loginButton = document.getElementById('login-btn');

// Onclick function for user to create account
signUpButton?.addEventListener('click', (event) => {
    event.preventDefault();
    
    // Fetching the user input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;

    // Firebase function to create a user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Data to store in Firestore
            const userData = {
                email: email,
                fullName: fullName,
                surname: surname
            };

            // Store user data in Firestore
            const docRef = doc(database, "clinicDB", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    showMessage('Account Created Successfully', 'registerMessage');
                    window.location.href = 'home.html'; // Redirect to login page
                })
                .catch((error) => {
                    showMessage('Error writing to database: ' + error.message, 'registerMessage');
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists!', 'registerMessage');
            } else {
                showMessage('Unable to create user: ' + error.message, 'registerMessage');
            }
        });
});

// Onclick function for user login (add this if needed for login page)
loginButton?.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Firebase sign in function
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successful login
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        })
        .catch((error) => {
            showMessage('Login failed: ' + error.message, 'loginMessage');
        });
});
