// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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

document.addEventListener("DOMContentLoaded", () => {
    const selectedDateElement = document.getElementById('selectedDate');
    const newDateInput = document.getElementById('newDate');
    const newTimeInput = document.getElementById('newTime');
    const rescheduleBtn = document.getElementById('rescheduleBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const appointmentDetails = document.getElementById('appointmentDetails');
    const appointmentInfo = document.getElementById('appointmentInfo');
    const timeError = document.getElementById('timeError');

    const newUserId = localStorage.getItem('newUserId');
    document.getElementById('IDNumb').textContent = newUserId;

    // Load original appointment details
    async function loadOriginalAppointment() {
        try {
            const snapshot = await get(ref(database, `appointments/${newUserId}`));
            if (snapshot.exists()) {
                const appointmentData = snapshot.val();
                selectedDateElement.textContent = appointmentData.selectedDate || '';
                setMinMaxDate(appointmentData.selectedDate);
            } else {
                console.error("No appointments found for this user.");
            }
        } catch (error) {
            console.error("Error loading appointments:", error);
        }
    }

    function setMinMaxDate(selectedDate) {
        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setDate(selectedDateObj.getDate() + 1); // Minimum is one day after original
        const minDate = selectedDateObj.toISOString().split('T')[0];

        selectedDateObj.setDate(selectedDateObj.getDate() + 1); // Maximum is two days after
        const maxDate = selectedDateObj.toISOString().split('T')[0];

        newDateInput.setAttribute('min', minDate);
        newDateInput.setAttribute('max', maxDate);
    }

    // Validate time input
    newTimeInput.addEventListener('input', () => {
        const [hour, minute] = newTimeInput.value.split(':').map(Number);
        if (validateTime(hour, minute)) {
            timeError.style.display = 'none';
            newTimeInput.setCustomValidity('');
        } else {
            timeError.style.display = 'block';
            newTimeInput.setCustomValidity("Please select a valid time between 15:00 and 17:00 in 20-minute intervals.");
        }
    });

    function validateTime(hour, minute) {
        return (hour === 15 || hour === 16 || (hour === 17 && minute === 0)) && minute % 20 === 0;
    }

    // Reschedule appointment
    rescheduleBtn.addEventListener('click', async () => {
        const originalDate = selectedDateElement.textContent;
        const newDate = newDateInput.value;
        const newTime = newTimeInput.value;

        if (!originalDate || !newDate || !newTime) {
            errorMessage.textContent = "Please select all required fields.";
            errorMessage.style.display = 'block';
            return;
        }

        const newDateTime = `${newDate}T${newTime}`;
        const newDateObj = new Date(newDateTime);
        const newDateString = newDateObj.toISOString().split('T')[0];
        const newTimeString = newDateObj.toTimeString().slice(0, 5);

        try {
            await update(ref(database, `appointments/${newUserId}`), {
                selectedDate: newDateString,
                time: newTimeString
            });

            errorMessage.style.display = 'none';
            successMessage.textContent = "Appointment rescheduled successfully.";
            successMessage.style.display = 'block';
            appointmentDetails.style.display = 'block';
            appointmentInfo.innerHTML = `New Appointment Date:<br>${newDateString}<br>Time: ${newTimeString}`;
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
            errorMessage.textContent = "Error rescheduling appointment. Please try again.";
            errorMessage.style.display = 'block';
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        signOut(auth).then(() => {
            localStorage.removeItem('newUserId');
            alert("Logged out successfully.");
            window.location.href = 'home.html';
        }).catch((error) => {
            alert("Error logging out: " + error.message);
        });
    });

    // Load initial data
    loadOriginalAppointment();
});


    // Logout function
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', () => {
        signOut(auth).then(() => {
            localStorage.removeItem('newUserId'); // Clear IDNumb from localStorage
            alert('Logged out successfully');
            window.location.href = 'home.html'; // Redirect to login page
        }).catch((error) => {
            alert('Error logging out: ' + error.message);
        });
    });
