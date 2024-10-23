// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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

document.addEventListener("DOMContentLoaded", () => {
    const selectedDate = document.getElementById('selectedDate');
    const newDateInput = document.getElementById('newDate');
    const newTimeInput = document.getElementById('newTime');
    const rescheduleBtn = document.getElementById('rescheduleBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const appointmentDetails = document.getElementById('appointmentDetails');
    const appointmentInfo = document.getElementById('appointmentInfo');
    const timeError = document.getElementById('timeError');

    let selectedHour = 0;
    let selectedMin = 0;

    const newUserId = localStorage.getItem('newUserId');
//alert(newUserId);
document.getElementById('IDNumb').innerHTML=newUserId;
    // Populate originalDateSelect with available appointment dates from the database
    async function loadOriginalDates() {
        try {
            const snapshot = await get(ref(database, 'appointments/'));
            snapshot.forEach((childSnapshot) => {
                const appointmentId = childSnapshot.key;
                const appointmentData = childSnapshot.val();
                const option = document.createElement('option');
                option.value = appointmentId;
                option.textContent = new Date(appointmentData.selectedDate).toDateString(); // Assuming appointment data contains a 'date'
                selectedDate.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading original dates: ", error);
        }
    }

    // Time validation logic
    function validateTime(hour, minute) {
        const isWithinTimeRange = hour >= 15 && hour <= 17;
        const isIn20MinuteInterval = minute % 20 === 0;

        if (hour === 17 && minute !== 0) {
            return false;
        }
        return isWithinTimeRange && isIn20MinuteInterval;
    }

    newTimeInput.addEventListener('input', () => {
        const timeValue = newTimeInput.value;
        if (timeValue) {
            const [hour, min] = timeValue.split(":").map(Number);
            selectedHour = hour;
            selectedMin = min;

            if (validateTime(selectedHour, selectedMin)) {
                timeError.style.display = 'none'; // Hide error message
                newTimeInput.setCustomValidity(''); // Clear any previous custom validity message
            } else {
                timeError.style.display = 'block'; // Show error message
                newTimeInput.setCustomValidity('Please select a valid time between 15:00 and 17:00 in 20-minute intervals.'); // Custom validity message
            }
        }
    });

    // Handle rescheduling
    rescheduleBtn.addEventListener('click', async () => {
        const originalDateId = originalDateSelect.value;
        const newDate = newDateInput.value;
        const newTime = newTimeInput.value;

        if (!originalDateId || !newDate || !newTime) {
            errorMessage.textContent = "Please select all required fields.";
            errorMessage.style.display = 'block';
            return;
        }

        const newDateTime = new Date(`${newDate}T${newTime}`);
        const newDateString = newDateTime.toISOString().split("T")[0];
        const newTimeString = `${newDateTime.getHours()}:${newDateTime.getMinutes().toString().padStart(2, '0')}`;

        try {
            // Check if the new date and time are already booked
            const snapshot = await get(ref(database, 'appointments/'));
            let isBooked = false;
            snapshot.forEach((childSnapshot) => {
                const appointmentData = childSnapshot.val();
                if (appointmentData.date === newDateString && appointmentData.time === newTimeString) {
                    isBooked = true;
                }
            });

            if (isBooked) {
                errorMessage.textContent = "The selected time slot is already booked. Please choose another time.";
                errorMessage.style.display = 'block';
                return;
            }

            // Check if there is an appointment on the original date to update
            const originalAppointmentRef = ref(database, `appointments/${originalDateId}`);
            const originalDoc = await get(originalAppointmentRef);

            if (!originalDoc.exists()) {
                errorMessage.textContent = "Original appointment not found.";
                errorMessage.style.display = 'block';
                return;
            }

            // Update the appointment in the database
            await set(originalAppointmentRef, {
                selectedDate: newDateString,
                time: newTimeString
            });

            // Show success message and updated details
            successMessage.textContent = "Appointment rescheduled successfully.";
            successMessage.style.display = 'block';
            appointmentDetails.style.display = 'block';

            appointmentInfo.innerHTML = `New Appointment Date:<br> ${newDate} <br> Time: ${newTime}`;
        } catch (error) {
            console.error("Error rescheduling appointment: ", error);
            errorMessage.textContent = "Error rescheduling appointment. Please try again.";
            errorMessage.style.display = 'block';
        }
    });

    // Load original appointment dates
    loadOriginalDates();
});
