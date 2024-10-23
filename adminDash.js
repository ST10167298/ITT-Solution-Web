// Import the necessary Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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
        loadCombinedData();
    } else {
        alert('You must be logged in as an admin to view this page');
        window.location.href = 'AdminLogin.html'; // Redirect to login if not logged in
    }
});

// Load and join user data and appointments data
function loadCombinedData() {
    const userRef = ref(database, 'userProfile');
    const appointmentsRef = ref(database, 'appointments');

    Promise.all([get(userRef), get(appointmentsRef)])
        .then(([userSnapshot, appointmentsSnapshot]) => {
            if (userSnapshot.exists() && appointmentsSnapshot.exists()) {
                const users = userSnapshot.val();
                const appointments = appointmentsSnapshot.val();

                // Create a map of appointments by ID number for quick lookup
                const appointmentsMap = {};
                Object.values(appointments).forEach(appointment => {
                    appointmentsMap[appointment.IDNumb] = appointment;
                });

                const combinedTableBody = document.getElementById('combinedTable').querySelector('tbody');
                combinedTableBody.innerHTML = ''; // Clear the table before adding new rows

                // Iterate through users and match with appointments
                Object.values(users).forEach(user => {
                    const row = combinedTableBody.insertRow();

                    row.insertCell(0).textContent = user.IDNumb || '';
                    row.insertCell(1).textContent = user.email || '';
                    row.insertCell(2).textContent = user.phone || '';
                    row.insertCell(3).textContent = user.illnesses || '';

                    // Find matching appointment by ID number
                    const appointment = appointmentsMap[user.IDNumb];
                    row.insertCell(4).textContent = appointment ? appointment.selectedDate : '';
                    row.insertCell(5).textContent = appointment ? appointment.time : '';
                    // Add dropdown for appointment status
                    const statusCell = row.insertCell(6);
                    const statusSelect = document.createElement('select');
                    const statuses = ["Pending", "Attended"];
                    
                    statuses.forEach(status => {
                        const option = document.createElement('option');
                        option.value = status;
                        option.textContent = status;
                        if (appointment && appointment.status === status) {
                            option.selected = true;
                        }
                        statusSelect.appendChild(option);
                    });

                    statusCell.appendChild(statusSelect);

                    // Add a button in the Action column to update the status
                    const actionCell = row.insertCell(7);
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update Status';
                    updateButton.onclick = () => updateAppointmentStatus(user.IDNumb, statusSelect.value);
                    actionCell.appendChild(updateButton);
                });
            } else {
                alert('No user or appointment data found.');
            }
        })
        .catch((error) => {
            alert('Failed to load data: ' + error.message);
        });
}
// Update appointment status in the database
function updateAppointmentStatus(appointmentID, newStatus) {
    const appointmentRef = ref(database, 'appointments/' + appointmentID); // Correct path to the specific appointment

    // Make sure to use the correct Firebase `update` method
    const updates = {
        status: newStatus
    };

    // Use update method from Firebase
    update(appointmentRef, updates)
        .then(() => {
            alert('Appointment status updated successfully');
        })
        .catch((error) => {
            alert('Failed to update status: ' + error.message);
        });
}