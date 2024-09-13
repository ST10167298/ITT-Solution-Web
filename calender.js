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

document.addEventListener('DOMContentLoaded', function () {
  const illnessSelect = document.getElementById('illness');
  const timeInput = document.getElementById('time');
  const appointmentInfo = document.getElementById('appointmentInfo');
  const scheduleBtn = document.getElementById('schedule-btn');
  const fileNoInput = document.getElementById('FileNo');
  const daysOptionSelect = document.getElementById('days-option'); 

  const calendarEl = document.querySelector('.calendar');
  const monthHeader = calendarEl.querySelector('h3');
  const datesEl = calendarEl.querySelector('.dates');

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDate = null;

  // Function to calculate next appointment date based on user-selected days option
  function getNextAppointmentDate(selectedDate) {
    const selectedDays = parseInt(daysOptionSelect.value); // Get selected days from dropdown
    const nextAppointment = new Date(currentYear, currentMonth, selectedDate);
    nextAppointment.setDate(nextAppointment.getDate() + selectedDays); // Add the selected days

    const nextDay = nextAppointment.getDate();
    const nextMonth = nextAppointment.getMonth() + 1; // Months are zero-indexed
    const nextYear = nextAppointment.getFullYear();

    return `${nextDay}/${nextMonth}/${nextYear}`;
  }

  function renderCalendar() {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0);

    datesEl.innerHTML = '';

    for (let i = firstDayOfMonth.getDay() - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth.getDate() - i;
      const li = document.createElement('li');
      li.classList.add('inactive');
      li.textContent = day;
      datesEl.appendChild(li);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const li = document.createElement('li');
      li.textContent = i;
      if (selectedDate && i === selectedDate) {
        li.classList.add('selected');
      }
      li.addEventListener('click', function () {
        selectedDate = i;
        renderCalendar();
        // Show appointment details when a date is selected
        updateAppointmentDetails(); 
      });
      datesEl.appendChild(li);
    }

    monthHeader.textContent = `${today.toLocaleString('default', { month: 'long' })} ${currentYear}`;
  }

  function updateCalendar() {
    today = new Date(currentYear, currentMonth, 1);
    renderCalendar();
  }

  function updateAppointmentDetails() {
    const selectedIllness = illnessSelect.value;
    const selectedTime = timeInput.value;
    const selectedDateDisplay = selectedDate ? `${selectedDate}/${currentMonth + 1}/${currentYear}` : 'Not selected';
    const nextAppointmentDate = selectedDate ? getNextAppointmentDate(selectedDate) : 'Not scheduled';

    // Display both selected date and next appointment date
    appointmentInfo.innerHTML = `
      <strong>Illness:</strong> ${selectedIllness} <br>
      <strong>Time:</strong> ${selectedTime}
      <strong>Current Appointment Date:</strong> ${selectedDateDisplay} <br>
      <strong>Next Appointment Date:</strong> ${nextAppointmentDate} <br>
      
    `;
  }

  async function scheduleAppointment() {
    console.log("Scheduling appointment...");

    const selectedIllness = illnessSelect.value;
    const selectedTime = timeInput.value;
    const fileNo = fileNoInput.value;

    // Log values to check inputs
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    console.log("File Number:", fileNo);

    if (!selectedDate || !selectedTime || !fileNo) {
      alert("Please select a date, time, and enter a file number for your appointment.");
      return;
    }

    const appointmentDate = `${selectedDate}/${currentMonth + 1}/${currentYear}`;
    // Get the next appointment date
    const nextAppointmentDate = getNextAppointmentDate(selectedDate); 

    const appointmentData = {
      illness: selectedIllness,
      appointmentDate: appointmentDate,
      // Store the next appointment date in the database
      nextAppointmentDate: nextAppointmentDate, 
      time: selectedTime,
    };

    console.log("Appointment Data:", appointmentData);

    const ref = doc(db, "clinicDB", fileNo); 

    try {
      await setDoc(ref, appointmentData);
      alert("Appointment scheduled successfully.");
      // Display both the selected date and the next appointment date
      appointmentInfo.innerHTML = `
        <strong>Illness:</strong> ${selectedIllness} <br>
         <strong>Time:</strong> ${selectedTime}
        <strong>Current Appointment Date:</strong> ${appointmentDate} <br>
        <strong>Next Appointment Date:</strong> ${nextAppointmentDate} <br>
       
      `;
    } catch (error) {
      console.error("Error scheduling appointment:", error);
    }
  }

  scheduleBtn.addEventListener('click', scheduleAppointment);

  renderCalendar();

  document.getElementById('prev').addEventListener('click', function () {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear -= 1;
    } else {
      currentMonth -= 1;
    }
    updateCalendar();
  });

  document.getElementById('next').addEventListener('click', function () {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear += 1;
    } else {
      currentMonth += 1;
    }
    updateCalendar();
  });
});
