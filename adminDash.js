// Import the necessary Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your Firebase configuration
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

// Ensure only admin can access this page
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Load data only if admin is logged in
        loadUserData();
        //loadIllnessesData();
        loadAppointmentsData();
    } else {
        alert('You must be logged in as an admin to view this page');
        window.location.href = 'AdminLogin.html'; // Redirect to login if not logged in
    }
});

// Load user data
function loadUserData() {
    const userRef = ref(database, 'userProfile');
    
    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const users = snapshot.val();
                const userTableBody = document.getElementById('userTable').querySelector('tbody');
                userTableBody.innerHTML = ''; // Clear table before appending new rows

                Object.values(users).forEach((user) => {
                    const row = userTableBody.insertRow();
                    row.insertCell(0).textContent = user.IDNumb || '';
                    row.insertCell(1).textContent = user.email || '';
                    row.insertCell(2).textContent = user.phone || '';
                    row.insertCell(3).textContent = user.illnesses || '';
                    row.insertCell(4).textContent = user.appointmentDate || '';
                    row.insertCell(5).textContent = user.time || '';
                    row.insertCell(6).textContent = user.appointmentStatus || '';
                });
            } else {
                alert('No user data found');
            }
        })
        .catch((error) => {
            alert('Failed to load user data: ' + error.message);
        });
}

// Load illnesses data


// Load appointments data
function loadAppointmentsData() {
    const appointmentsRef = ref(database, 'appointments');
    
    get(appointmentsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const appointments = snapshot.val();
                const appointmentsList = document.getElementById('appointmentsList');
                appointmentsList.innerHTML = ''; // Clear the list

                Object.values(appointments).forEach((appointment) => {
                    const li = document.createElement('li');
                    li.textContent = `Appointment with ${appointment.name} on ${appointment.date} at ${appointment.time}`;
                   
                    appointmentsList.appendChild(li);
                });
            } else {
                alert('No appointments data found');
            }
        })
        .catch((error) => {
            alert('Failed to load appointments data: ' + error.message);
        });
}
