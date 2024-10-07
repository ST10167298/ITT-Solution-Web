// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore(app);
const auth = getAuth(app);

// Function to display messages
function showMessage(message, divId) {
    const displayMessage = document.getElementById(divId);
    displayMessage.style.display = "block";
    displayMessage.innerHTML = message;
    displayMessage.style.opacity = 1;
}

// ------------------- USER AUTHENTICATION ------------------- //
// Form declarations
const signUpButton = document.querySelector('.HBtn');
const loginButton = document.getElementById('login-btn');

// User sign-up function
signUpButton?.addEventListener('click', (event) => {
    event.preventDefault();
    const IDNumb =  document.getElementById('IDNumb').value;;
 const password = document.getElementById('password').value;
 const email = document.getElementById('email').value;
    
    const fullName = document.getElementById('firstName').value;
    const surname = document.getElementById('lastName').value;

    // Firebase function to create a user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {IDNumb, email, fullName, surname, password };

            // Store user data in Firestore
            setDoc(doc(db, "clinicDB", IDNumb), userData)
                .then(() => {
                    showMessage('Account Created Successfully', 'registerMessage');
                    window.location.href = 'home.html';
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

// User login function
loginButton.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Firebase sign-in function
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = 'DashBoard1.html';
        })
        .catch((error) => {
            showMessage('Login failed: ' + error.message, 'loginMessage');
        });


//----------------------SCHEDULE APPOINTMENT----------------------------//


});

