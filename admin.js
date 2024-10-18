// Import Firebase SDKs  
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', (event) => {
    // ------------------- ADMIN LOGIN ------------------- //
    const adminLoginButton = document.getElementById('admin-login-btn');

    if (adminLoginButton) {
        adminLoginButton.addEventListener('click', (event) => {
            event.preventDefault();

            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;

            // Firebase sign-in function for admin
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    window.location.href = 'AdminDashBoard.html';
                    loadAdminData(); // Ensure loadAdminData is called after redirection
                })
                .catch((error) => {
                    showMessage('Admin login failed: ' + error.message, 'adminLoginMessage');
                });
        });
    } 
});
// ------------------- LOAD ADMIN DATA ------------------- //
function loadAdminData() {
    // Fetch all appointments for the admin from clinicDB collection
    const clinicCollectionRef = collection(db, "clinicDB"); // Use collection reference

    getDocs(clinicCollectionRef)
        .then((querySnapshot) => {
            const appointmentTable = document.getElementById('appointmentTable'); // Make sure this element exists on AdminDashBoard.html
            
            querySnapshot.forEach((docSnap) => {
                const appointment = docSnap.data(); // Access the document data
                
                // Create a new row for each appointment
                const row = appointmentTable.insertRow();
                
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                const cell5 = row.insertCell(4);
                const cell6 = row.insertCell(5);
                
                // Populate the row cells with the appointment data
                cell1.textContent = appointment.IDNumb;
                cell2.textContent = appointment.email;
                cell3.textContent = appointment.phone;
                cell4.textContent = appointment.selectedIllness;
                cell5.textContent = appointment.appointmentDetails;
                cell6.textContent = appointment.selectedTime;
            });
        })
        .catch((error) => {
            showMessage('Error fetching appointments: ' + error.message, 'adminMessage');
        });
}
