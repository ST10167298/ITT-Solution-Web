// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, set, ref, get, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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

    const employeeNumber = document.getElementById('employeeNumber').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
   const logoutBtn = document.getElementById('logoutBtn').value;

    // Load user data on profile page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin.html')) {
        const newUserId = localStorage.getItem('newUserId');

        if (newUserId) {
            const userRef = ref(database, 'users/' + newUserId);
            get(userRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();

                        document.getElementById('name').textContent = userData.name;
                        document.getElementById('surname').textContent = userData.surname;
                        document.getElementById('email').textContent = userData.email;
                        document.getElementById('employeeNumber').textContent = userData.employeeNumber;
                    } else {
                        alert('User data not found.');
                    }
                })
                .catch((error) => {
                    alert('Error retrieving user data: ' + error.message);
                });
        } else {
            alert('User ID not found in local storage.');
        }
    }
});



// Logout function
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            localStorage.removeItem('newUserId');
            alert('Logged out successfully');
            window.location.href = 'home.html';
        })
        .catch((error) => {
            alert('Error logging out: ' + error.message);
        });
});
