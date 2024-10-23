import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, set, ref, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your web app's Firebase configuration
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

document.addEventListener('DOMContentLoaded', () => {
    const adminSignUpBtn = document.getElementById('adminSignUpBtn');
    const adminLoginBtn = document.getElementById('adminLoginBtn');

    if (adminSignUpBtn) {
        // Admin signup functionality
        adminSignUpBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const adminEmail = document.getElementById('adminEmail').value;
            const adminPassword = document.getElementById('adminPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
           
            if (adminPassword !== confirmPassword) {
                document.getElementById('error').textContent = "Passwords do not match.";
                document.getElementById('error').style.display = 'block';
                return;
            }

            createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
                .then((userCredential) => {
                    const user = userCredential.user;

                    // Store the new admin in the database
                    return set(ref(database, 'ClinicAdmin/' + user.uid), {
                        adminEmail,
                        adminPassword
                    });
                })
                .then(() => {
                    // Data saved successfully!
                    alert('Admin created successfully');
        
                    // Redirect to home page
                    window.location.href = 'AdminLogin.html';
                })
                .catch((error) => {
                    alert('Error: ' + error.message);
                });
        });  // <- Closing this event listener properly
    }

    if (adminLoginBtn) {
        // Admin login functionality
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    const adminRef = ref(database, 'ClinicAdmin/' + user.uid);
                    return get(adminRef);
                })
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        alert('Admin logged in successfully');
                        window.location.href = 'AdminDashboard.html';
                    } 
                })
                .catch((error) => {
                    document.getElementById('admin-error').textContent = error.message;
                    document.getElementById('admin-error').style.display = 'block';
                });
        });
    }
});

//-------------------------LOAD DATA-----------------------//