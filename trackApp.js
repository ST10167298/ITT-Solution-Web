// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, set, ref, get, update } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

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
    let appointments = {}; // To store appointment dates from Firestore

    // Fetch all appointments from Firestore
    async function fetchAppointments() {
        const querySnapshot = await getDocs(collection(db, "clinicDB"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = new Date(data.year, data.month - 1, parseInt(doc.id.split("-")[2]));
            appointments[doc.id] = true;
        });
    }

    // Render Calendar
    async function renderCalendar(month, year) {
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

        // Fill in the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const li = document.createElement('li');
            li.textContent = i;

            const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

            // Highlight dates with appointments
            if (appointments[dateString]) {
                li.classList.add('appointment');
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

    // Fetch appointments and render the calendar
    await fetchAppointments();
    renderCalendar(currentMonth, currentYear);
});
