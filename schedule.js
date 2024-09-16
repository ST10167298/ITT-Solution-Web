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

  const currentMonthElement = document.querySelector('.calendar header h3');
  const datesContainer = document.querySelector('.dates');
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let currentDate = new Date();

  function getDaysToAdd(selectedIllness) {
    let daysToAdd = 0;
    switch (selectedIllness) {
      case "HIV/AIDS": daysToAdd = 25; break;
      case "Hypertension": daysToAdd = 40; break;
      case "Heart Disease": daysToAdd = 30; break;
      case "Diabetes": daysToAdd = 30; break;
      case "Epilepsy": daysToAdd = 21; break;
      case "Arthritis": daysToAdd = 60; break;
      case "TB": daysToAdd = 60; break;
    }
    return daysToAdd;
  }

  function getAppointmentDate() {
    const selectedIllness = illnessSelect.value;
    const daysToAdd = getDaysToAdd(selectedIllness);
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    const appointmentDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    return appointmentDate;
  }

  function updateAppointmentDetails() {
    const appointmentDate = getAppointmentDate();
    const selectedIllness = illnessSelect.value;
    const selectedTime = timeInput.value;
    appointmentInfo.innerHTML = 
      `<strong>Illness:</strong> ${selectedIllness} <br>
      <strong>Next Appointment Date:</strong> ${appointmentDate} <br>
      <strong>Time:</strong> ${selectedTime} <br>`;
  }

  function isValidTime(selectedTime) {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startTime = 7 * 60;  // 7:00 AM in minutes
    const endTime = 17 * 60;   // 5:00 PM in minutes
    return totalMinutes >= startTime && totalMinutes <= endTime && (totalMinutes % 20 === 0);
  }

  function populateTimeOptions() {
    const startTime = 7 * 60;  // 7:00 AM in minutes
    const endTime = 17 * 60;   // 5:00 PM in minutes

    for (let minutes = startTime; minutes <= endTime; minutes += 20) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      const option = document.createElement('option');
      option.value = formattedTime;
      option.textContent = formattedTime;
      timeInput.appendChild(option);
    }
  }

  async function scheduleAppointment() {
    const selectedIllness = illnessSelect.value;
    const selectedTime = timeInput.value;
    const fileNo = fileNoInput.value;

    if (!fileNo || !selectedTime || !selectedIllness) {
      alert("Please enter a file number, select an illness, and select a time.");
      return;
    }

    if (!isValidTime(selectedTime)) {
      alert("Please select a time between 7:00 AM and 5:00 PM in 20-minute intervals.");
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

  function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    datesContainer.innerHTML = '';

    // Add empty (inactive) days at the beginning
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement('li');
      emptyCell.classList.add('inactive');
      datesContainer.appendChild(emptyCell);
    }

    // Add the actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateCell = document.createElement('li');
      dateCell.textContent = i;

      const date = new Date(year, month, i);
      const dayOfWeek = date.getDay();

      // Mark weekends as inactive
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        dateCell.classList.add('inactive');
      } else {
        // Mark today
        if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
          dateCell.classList.add('today');
        }

        // Add click event for selectable days
        dateCell.addEventListener('click', () => {
          alert(`You selected ${i}/${month + 1}/${year}`);
        });
      }

      datesContainer.appendChild(dateCell);
    }
  }

  // Populate time options on page load
  populateTimeOptions();

  generateCalendar();
  document.getElementById('next').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();
  });
  document.getElementById('prev').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();
  });

  scheduleBtn.addEventListener('click', scheduleAppointment);
});
