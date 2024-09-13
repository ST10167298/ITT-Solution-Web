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

document.addEventListener('DOMContentLoaded', function () {
  const illnessSelect = document.getElementById('illness');
  const timeInput = document.getElementById('time');
  const fileNoInput = document.getElementById('FileNo');
  const appointmentInfo = document.getElementById('appointmentInfo');
  const scheduleBtn = document.getElementById('schedule-btn');
  
  // Calendar elements
  const currentMonthElement = document.querySelector('.calendar header h3');
  const datesContainer = document.querySelector('.dates');
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let currentDate = new Date();
  
  // Calculate number of days to add based on illness selection
  function getDaysToAdd(selectedIllness) {
    let daysToAdd = 0;

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
      default:
        alert("Please select a valid illness.");
    }

    return daysToAdd;
  }

  // Automatically calculate the next appointment date based on today's date
  function getAppointmentDate() {
    const selectedIllness = illnessSelect.value;
    const daysToAdd = getDaysToAdd(selectedIllness);
    
    const today = new Date(); // Current date
    today.setDate(today.getDate() + daysToAdd); // Add days based on illness

    const appointmentDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    return appointmentDate;
  }

  // Update appointment details in the UI
  function updateAppointmentDetails() {
    const appointmentDate = getAppointmentDate();
    const selectedIllness = illnessSelect.value;
    const selectedTime = timeInput.value;
    
    appointmentInfo.innerHTML = `
      <strong>Illness:</strong> ${selectedIllness} <br>
      <strong>Next Appointment Date:</strong> ${appointmentDate} <br>
      <strong>Time:</strong> ${selectedTime} <br>
    `;
  }

  // Save appointment to Firebase
  async function scheduleAppointment() {
    const selectedIllness = illnessSelect.value;
    const selectedTime = timeInput.value;
    const fileNo = fileNoInput.value;

    if (!fileNo || !selectedTime || !selectedIllness) {
      alert("Please enter a file number, select an illness, and select a time.");
      return;
    }

    const appointmentDate = getAppointmentDate();

    const appointmentData = {
      illness: selectedIllness,
      appointmentDate: appointmentDate,
      time: selectedTime,
    };

    const ref = doc(db, "clinicDB", fileNo);

    try {
      await setDoc(ref, appointmentData);
      alert("Appointment scheduled successfully!");
      updateAppointmentDetails();
    } catch (error) {
      console.error("Error saving appointment to Firebase:", error);
      alert("Failed to schedule appointment.");
    }
  }

  // Generate Calendar
  function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update header with current month and year
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;

    // Get first day of the month and number of days in the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Clear previous dates
    datesContainer.innerHTML = '';

    // Generate the empty spaces for the first day offset
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement('li');
      emptyCell.classList.add('inactive');
      datesContainer.appendChild(emptyCell);
    }

    // Generate the actual dates for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateCell = document.createElement('li');
      dateCell.textContent = i;

      // Highlight today’s date
      if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
        dateCell.classList.add('today');
      }

      datesContainer.appendChild(dateCell);
    }
  }

  // Initialize calendar for the current month
  generateCalendar();

  // Navigation for next and previous months
  document.getElementById('next').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
  });

  document.getElementById('prev').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
  });

  // Schedule appointment on button click
  scheduleBtn.addEventListener('click', scheduleAppointment);
});
