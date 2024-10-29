// Import the necessary Firebase SDKs 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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

// Ensure only authorized users can access this page
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Check the user's role
        const userRef = ref(database, `users/${user.uid}`);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.role === "admin") {
                    loadCombinedData();
                } else {
                    alert('Access denied: You are not an admin.');
                    window.location.href = 'home.html';
                }
            } else {
                alert('User data not found.');
                window.location.href = 'home.html';
            }
        }).catch((error) => {
            alert('Error fetching user data: ' + error.message);
            window.location.href = 'home.html';
        });
    } else {
        window.location.href = 'home.html';
    }
});

function loadCombinedData() {
    const usersRef = ref(database, 'users/');
    const userProfileRef = ref(database, 'userProfile/');
    const appointmentsRef = ref(database, 'appointments/');

    Promise.all([get(usersRef), get(userProfileRef), get(appointmentsRef)])
        .then(([usersSnapshot, userProfileSnapshot, appointmentsSnapshot]) => {
            if (usersSnapshot.exists() && userProfileSnapshot.exists() && appointmentsSnapshot.exists()) {
                const users = usersSnapshot.val();
                const userProfiles = userProfileSnapshot.val();
                const appointments = appointmentsSnapshot.val();

                const combinedTableBody = document.getElementById('combinedTable').querySelector('tbody');
                combinedTableBody.innerHTML = '';

                Object.keys(users).forEach(uid => {
                    const user = users[uid];

                    if (user.role === "admin") return;

                    const userProfile = userProfiles[uid] || {};
                    const appointment = appointments[uid] || {};

                    const row = combinedTableBody.insertRow();

                    row.insertCell(0).textContent = user.IDNumb || '';
                    row.insertCell(1).textContent = user.email || '';
                    row.insertCell(2).textContent = userProfile.phone || '';
                    row.insertCell(3).textContent = userProfile.illnesses || '';
                    row.insertCell(4).textContent = appointment.selectedDate || '';
                    row.insertCell(5).textContent = appointment.time || '';

                    const statusCell = row.insertCell(6);
                    const statusSelect = document.createElement('select');
                    ["Pending", "Attended"].forEach(status => {
                        const option = document.createElement('option');
                        option.value = status;
                        option.textContent = status;
                        if (appointment.status === status) option.selected = true;
                        statusSelect.appendChild(option);
                    });
                    statusCell.appendChild(statusSelect);

                    const actionCell = row.insertCell(7);
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update Status';
                    updateButton.onclick = () => updateAppointmentStatus(uid, statusSelect.value);
                    actionCell.appendChild(updateButton);
                });
            } else {
                alert('No user, user profile, or appointment data found.');
            }
        })
        .catch((error) => {
            alert('Failed to load data: ' + error.message);
        });
}

// Define the updateAppointmentStatus function
function updateAppointmentStatus(uid, newStatus) {
    const appointmentRef = ref(database, `appointments/${uid}`);
    update(appointmentRef, { status: newStatus })
        .then(() => {
            alert('Appointment status updated successfully.');
        })
        .catch((error) => {
            alert('Failed to update appointment status: ' + error.message);
        });
}

// Logout function
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn?.addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.removeItem('newUserId');
        alert('Logged out successfully');
        window.location.href = 'home.html';
    }).catch((error) => {
        alert('Error logging out: ' + error.message);
    });
});
