// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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

document.addEventListener("DOMContentLoaded", async () => {
    const datesContainer = document.querySelector(".dates");
    const monthYear = document.getElementById("monthYear");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let appointments = {}; // To store appointment dates from Firebase

    const newUserId = localStorage.getItem('newUserId');
    document.getElementById('IDNumb').innerHTML = newUserId;

    // Fetch all appointments from Firebase Realtime Database
    async function fetchAppointments() {
        try {
            const snapshot = await get(ref(database, 'appointments/'));
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const appointmentId = childSnapshot.key;
                    const appointmentData = childSnapshot.val();
                    const appointmentDate = new Date(appointmentData.selectedDate).toISOString().split('T')[0];
                    appointments[appointmentDate] = true; // Mark this date as having an appointment
                });
            } else {
                console.log("No appointments found.");
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    }

    // Calculate specific future appointment dates based on daysToAdd
    function predictFutureAppointments(daysToAdd) {
        const futureAppointments = {};
        const today = new Date();

        // Loop through the existing appointments
        for (const date in appointments) {
            const appointmentDate = new Date(date);
            // Calculate the future date
            const futureDate = new Date(appointmentDate);
            futureDate.setDate(futureDate.getDate() + daysToAdd);
            futureAppointments[futureDate.toISOString().split('T')[0]] = true; // Mark predicted future appointment
        }

        return futureAppointments;
    }

    // Render Calendar
    async function renderCalendar(month, year, daysToAdd = 0) {
        datesContainer.innerHTML = ''; // Clear existing dates
        const firstDay = new Date(year, month).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;

        // Empty slots before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const li = document.createElement('li');
            li.classList.add('inactive');
            datesContainer.appendChild(li);
        }

        // Highlight existing and future predicted appointments
        const futureAppointments = predictFutureAppointments(daysToAdd);

        // Fill in the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const li = document.createElement('li');
            li.textContent = i;

            const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

            // Highlight dates with existing appointments
            if (appointments[dateString]) {
                li.classList.add('appointment');
                li.title = "You have an appointment on this day"; // Optional: Add a tooltip
            }

            // Highlight only the specific predicted appointment dates
            if (futureAppointments[dateString]) {
                li.classList.add('predicted');
                li.title = "Predicted appointment date"; // Optional: Add a tooltip for predicted dates
            }

            if (new Date().toDateString() === new Date(year, month, i).toDateString()) {
                li.classList.add('today');
            }

            datesContainer.appendChild(li);
        }
    }

    // Calendar Navigation
    prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear, 30); // Adjust daysToAdd here
    });

    nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear, 30); // Adjust daysToAdd here
    });

    // Fetch appointments and render the calendar
    await fetchAppointments();
    renderCalendar(currentMonth, currentYear, 30); // Adjust daysToAdd here
});
