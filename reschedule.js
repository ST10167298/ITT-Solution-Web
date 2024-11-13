// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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
    console.log('New User ID:', newUserId);
  
//alert(newUserId);
document.getElementById('IDNumb').innerHTML=newUserId;
    // Populate originalDateSelect with available appointment dates from the database
    async function loadOriginalDates() {
        const newUserId = localStorage.getItem('newUserId'); // Get logged-in user's IDNumb
    
        try {
            const snapshot = await get(ref(database, 'appointments/'));
            snapshot.forEach((childSnapshot) => {
                const appointmentData = childSnapshot.val();
                
                // Check if the appointment belongs to the logged-in user
                if (appointmentData.IDNumb === newUserId) {
                    const option = document.createElement('option');
                    option.value = childSnapshot.key;
                    option.textContent = new Date(appointmentData.selectedDate).toDateString(); // Format the date
                    selectedDate.appendChild(option);
                }
            });
        } catch (error) {
            console.error("Error loading original dates: ", error);
        }
    }

    function setMinMaxDate(selectedDate) {
        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setDate(selectedDateObj.getDate() + 2); // Add one day
        const minDate = selectedDateObj.toISOString().split('T')[0];

        selectedDateObj.setDate(selectedDateObj.getDate() + 2); // Add another day for max date
        const maxDate = selectedDateObj.toISOString().split('T')[0];

        newDateInput.setAttribute('min', minDate);
        newDateInput.setAttribute('max', maxDate);
    }

    selectedDate.addEventListener('change', (event) => {
        const selectedDateValue = event.target.value;
        setMinMaxDate(selectedDateValue);
    });

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
    const originalDateId = selectedDate.value;
    const newDate = newDateInput.value;
    const newTime = newTimeInput.value;

    if (!originalDateId || !newDate || !newTime) {
        errorMessage.textContent = "Please select all required fields.";
        errorMessage.style.display = 'block';
        return;
    }

    const selectedDateValue = selectedDate.options[selectedDate.selectedIndex].textContent;
    const originalDate = new Date(selectedDateValue);
    const newDateValue = new Date(newDate);

    // Calculate the difference in days between the original date and new date
    const differenceInTime = newDateValue - originalDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert from milliseconds to days

    if (differenceInDays !== 1 && differenceInDays !== 2) {
        errorMessage.textContent = "The new date must be 1 or 2 days after the original date.";
        errorMessage.style.display = 'block';
        return;
    }

    const newDateTime = new Date(`${newDate}T${newTime}`);
    const newDateString = newDateTime.toISOString().split("T")[0];
    const newTimeString = `${newDateTime.getHours()}:${newDateTime.getMinutes().toString().padStart(2, '0')}`;

    console.log(`newDateString: ${newDateString}, newTimeString: ${newTimeString}`);

    try {
        const snapshot = await get(ref(database, 'appointments/'));
        let isBooked = false;
        snapshot.forEach((childSnapshot) => {
            const appointmentData = childSnapshot.val();
            console.log('Checking appointmentData:', appointmentData);

            if (appointmentData.selectedDate === newDateString && appointmentData.time === newTimeString) {
                isBooked = true;
            }
        });

        if (isBooked) {
            errorMessage.textContent = "The selected time slot is already booked. Please choose another time.";
            errorMessage.style.display = 'block';
            return;
        }

        const originalAppointmentRef = ref(database, `appointments/${originalDateId}`);
        const originalDoc = await get(originalAppointmentRef);

        if (!originalDoc.exists()) {
            errorMessage.textContent = "Original appointment not found.";
            errorMessage.style.display = 'block';
            return;
        }

        await update(originalAppointmentRef, {
            selectedDate: newDateString,
            time: newTimeString
        });
        // Clear any error message since rescheduling was successful
        errorMessage.style.display = 'none';
        errorMessage.textContent = "";
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
