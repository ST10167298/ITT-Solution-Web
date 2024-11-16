// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXrso01jzfE02Z4lJCcTPTjvH56BXA0co",
    authDomain: "wilproject-b88e2.firebaseapp.com",
    databaseURL: "https://wilproject-b88e2-default-rtdb.firebaseio.com",
    projectId: "wilproject-b88e2",
    storageBucket: "wilproject-b88e2.appspot.com",
    messagingSenderId: "910653707810",
    appId: "1:910653707810:web:9c2943b3c268f6a9b21c7b",
    measurementId: "G-55LEEY309H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);

// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');

togglePassword?.addEventListener('click', function () {
    const passwordType = password.getAttribute('type') === 'password' ? 'text' : 'password';
    const confirmPasswordType = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', passwordType);
    confirmPassword.setAttribute('type', confirmPasswordType);

    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

// Get elements
const submitData = document.getElementById('submitData');

// Admin Registration
submitData?.addEventListener('click', (e) => {
    e.preventDefault();
    const employeeNumber = document.getElementById('employeeNumber').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = 'admin'; // This will automatically set the role to "user"
    const errorDiv = document.getElementById('password-error');

     // Regular expression to validate the Employee Number format (CA-####)
     const employeeNumberPattern = /^CA-\d{4}$/;
     if (!employeeNumberPattern.test(employeeNumber)) {
         alert('Employee Number must follow the format CA-####.');
         return;
     }

    // Validate password match
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match. Please try again.';
        errorDiv.style.display = 'block';
        return;
    } else {
        errorDiv.style.display = 'none';
    }

    // Create the admin user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('newUserId', user.uid);  // Set newUserId here
 
            // Save user info to Firebase Database with 'admin' role
            return set(ref(database, 'users/' + user.uid), {
                employeeNumber,
                name,
                surname,
                email,
                role,  // Set role to 'admin'
                password
            });
        })
        .then(() => {
            alert('Admin registered successfully');
            window.location.href = 'admin.html';  // Redirect to admin dashboard or login page
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});