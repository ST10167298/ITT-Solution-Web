// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
    let illnesses = document.getElementById('illnesses');
    let timeInput = document.getElementById('time');
    let scheduleBtn = document.getElementById('scheduleBtn');
    let timeError = document.getElementById('timeError');
    let appointmentDetails = document.getElementById('appointmentDetails');
    let datesContainer = document.querySelector(".dates");
    let monthYear = document.getElementById("monthYear");
    let prevBtn = document.getElementById("prev");
    let nextBtn = document.getElementById("next");

    let selectedHour = 0;
    let selectedMin = 0;
    let daysToAdd = 30;
    let appointments = {}; // To store appointments
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Illness selection logic
    illnesses.addEventListener('change', function() {
        const selectedIllness = this.value;
        switch (selectedIllness) {
            case "HIV/AIDS":
                daysToAdd = 25;
                break;
            case "Hypertension":
                daysToAdd = 40;
                break;
            case "Heart Disease":
                daysToAdd = 30;
                break;
            case "Diabetes":
                daysToAdd = 30;
                break;
            case "Epilepsy":
                daysToAdd = 21;
                break;
            case "Arthritis":
                daysToAdd = 60;
                break;
            case "TB":
                daysToAdd = 60;
                break;
        }
    });

    // Time validation logic
    timeInput.addEventListener('input', () => {
        const timeValue = timeInput.value;
        if (timeValue) {
            const [hour, min] = timeValue.split(":").map(Number);
            selectedHour = hour;
            selectedMin = min;

            if (validateTime(selectedHour, selectedMin)) {
                timeError.style.display = 'none'; // Hide error message
                timeInput.setCustomValidity(''); // Clear any previous custom validity message
            } else {
                timeError.style.display = 'block'; // Show error message
                timeInput.setCustomValidity('Please select a valid time between 07:00 and 17:00 in 20-minute intervals.'); // Custom validity message
            }
        }
    });

    // Schedule appointment logic
    scheduleBtn.addEventListener('click', async () => {
        const calendar = new Date();
        calendar.setDate(calendar.getDate() + daysToAdd);

        const dayOfWeek = calendar.getDay();
        if (dayOfWeek === 6) {
            calendar.setDate(calendar.getDate() + 2);
        } else if (dayOfWeek === 0) {
            calendar.setDate(calendar.getDate() + 1);
        }

        calendar.setHours(selectedHour);
        calendar.setMinutes(selectedMin);

        const selectedDate = calendar.toISOString().split("T")[0];
        const selectedTime = `${selectedHour}:${selectedMin.toString().padStart(2, '0')}`;
        const selectedMonth = calendar.getMonth() + 1; // Months are zero-indexed
        const selectedYear = calendar.getFullYear();

        if (appointments[selectedDate] === selectedTime) {
            alert("This time slot is already booked. Please select a different time.");
            return;
        }

        appointments[selectedDate] = selectedTime;
        appointmentDetails.innerHTML = `Scheduled Appointment:<br> ${calendar.toDateString()} <br>Time: ${selectedTime}`;

        // Save appointment to Firestore
        try {
            await setDoc(doc(db, "appointment", selectedDate), {
                time: selectedTime,
                month: selectedMonth,
                year: selectedYear
            });
            console.log("Appointment saved to Firestore.");
        } catch (error) {
            console.error("Error adding appointment: ", error);
        }

        // Update Calendar View to the month of the scheduled appointment
        currentMonth = calendar.getMonth();
        currentYear = calendar.getFullYear();
        renderCalendar(currentMonth, currentYear);
    });

    // Function to validate if the time is within the allowed range and in 20-minute intervals
    function validateTime(hour, minute) {
        const isWithinTimeRange = hour >= 7 && hour <= 17;
        const isIn20MinuteInterval = minute % 20 === 0;

        if (hour === 17 && minute !== 0) {
            return false;
        }
        return isWithinTimeRange && isIn20MinuteInterval;
    }

    // Calendar Navigation
    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Render Calendar
    async function renderCalendar(month, year) {
        datesContainer.innerHTML = ''; // Clear existing dates
        const firstDay = new Date(year, month).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

        for (let i = 0; i < firstDay; i++) {
            const li = document.createElement('li');
            li.classList.add('inactive');
            datesContainer.appendChild(li);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const li = document.createElement('li');
            li.textContent = i;
            const date = new Date(year, month, i);

            // Check if this date is the same as the scheduled appointment
            const dateString = date.toISOString().split("T")[0];
            if (appointments[dateString]) {
                li.classList.add('appointment');
            }

            if (date.toDateString() === new Date().toDateString()) {
                li.classList.add('today');
            }

            datesContainer.appendChild(li);
        }
    }

    // Initialize Calendar
    renderCalendar(currentMonth, currentYear);
});