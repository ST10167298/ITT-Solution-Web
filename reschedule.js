// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", () => {
    const originalDateSelect = document.getElementById('originalDate');
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

    // Populate originalDateSelect with available appointment dates from the database
    async function loadOriginalDates() {
        try {
            const q = query(collection(db, "clinicDB"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = new Date(doc.id).toDateString();
                originalDateSelect.appendChild(option);
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
        const originalDate = originalDateSelect.value;
        const newDate = newDateInput.value;
        const newTime = newTimeInput.value;

        if (!originalDate || !newDate || !newTime) {
            errorMessage.textContent = "Please select all required fields.";
            errorMessage.style.display = 'block';
            return;
        }

        const newDateTime = new Date(`${newDate}T${newTime}`);
        const newDateString = newDateTime.toISOString().split("T")[0];
        const newTimeString = `${newDateTime.getHours()}:${newDateTime.getMinutes().toString().padStart(2, '0')}`;

        try {
            // Check if the new date and time are already booked
            const q = query(collection(db, "clinicDB"), where("date", "==", newDateString), where("time", "==", newTimeString));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                errorMessage.textContent = "The selected time slot is already booked. Please choose another time.";
                errorMessage.style.display = 'block';
                return;
            }

            // Check if there is an appointment on the original date to update
            const originalAppointment = doc(db, "clinicDB", originalDate);
            const originalDoc = await getDoc(originalAppointment);

            if (!originalDoc.exists()) {
                errorMessage.textContent = "Original appointment not found.";
                errorMessage.style.display = 'block';
                return;
            }

            // Update the appointment in the database
            await setDoc(doc(db, "clinicDB", originalDate), {
                date: newDateString,
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
