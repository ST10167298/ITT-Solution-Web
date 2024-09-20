// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
const auth = getAuth(app);

// Function to display messages
function showMessage(message, divId) {
    const displayMessage = document.getElementById(divId);
    displayMessage.style.display = "block";
    displayMessage.innerHTML = message;
    displayMessage.style.opacity = 1;
}

// ------------------- USER AUTHENTICATION ------------------- //
// Form declarations
const signUpButton = document.querySelector('.HBtn');
const loginButton = document.getElementById('login-btn');

// User sign-up function
signUpButton?.addEventListener('click', (event) => {
    event.preventDefault();
<<<<<<< HEAD
    const IDNumb =  document.getElementById('IDNumb').value;;
=======

>>>>>>> 2d5ac969bd8e206613c3ab22369a08ac809d504d
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;

    // Firebase function to create a user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = { email, fullName, surname };

            // Store user data in Firestore
            setDoc(doc(db, "clinicDB", user.uid), userData)
                .then(() => {
                    showMessage('Account Created Successfully', 'registerMessage');
                    window.location.href = 'home.html';
                })
                .catch((error) => {
                    showMessage('Error writing to database: ' + error.message, 'registerMessage');
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists!', 'registerMessage');
            } else {
                showMessage('Unable to create user: ' + error.message, 'registerMessage');
            }
        });
});

// User login function
loginButton?.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Firebase sign-in function
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            showMessage('Login failed: ' + error.message, 'loginMessage');
        });
});

// ------------------ PROFILE MANAGEMENT -------------------- //
// References for profile form fields
const Name = document.getElementById("name");
const Surname = document.getElementById("surname");
const Email = document.getElementById("email");
const IDNO = document.getElementById("IDNumb");
<<<<<<< HEAD
=======
const FileNo = document.getElementById("fileNo");
>>>>>>> 2d5ac969bd8e206613c3ab22369a08ac809d504d
const Address = document.getElementById("address");
const Illness = document.getElementById("illness");
const GenBox = document.getElementById("Genbox");

const insBtn = document.getElementById("insbtn");
const SelBtn = document.getElementById("Selbtn");
const UpdBtn = document.getElementById("Updbtn");
const DelBtn = document.getElementById("Delbtn");

// ---------- ADD DOCUMENT TO FIRESTORE ------------------- //
async function AddDocument_AutoID() {
<<<<<<< HEAD
    const ref = doc(db, "clinicDB", IDNumb.value);
=======
    const ref = doc(db, "clinicDB", FileNo.value);
>>>>>>> 2d5ac969bd8e206613c3ab22369a08ac809d504d

    try {
        await setDoc(ref, {
            pName: Name.value,
            pSurname: Surname.value,
            pEmail: Email.value,
            pIDNO: IDNO.value,
<<<<<<< HEAD
=======
            pFileNo: FileNo.value,
>>>>>>> 2d5ac969bd8e206613c3ab22369a08ac809d504d
            pAddress: Address.value,
            pIllness: Illness.value,
            Gender: GenBox.value
        });
        alert("Data added successfully");
    } catch (error) {
        alert("Unsuccessful operation, error: " + error);
    }
}

// ---------- GET DOCUMENT FROM FIRESTORE ------------------- //
async function GetADocument() {
<<<<<<< HEAD
    const ref = doc(db, "clinicDB", IDNumb.value);
=======
    const ref = doc(db, "clinicDB", FileNo.value);
>>>>>>> 2d5ac969bd8e206613c3ab22369a08ac809d504d

    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
        Name.value = docSnap.data().pName;
        Surname.value = docSnap.data().pSurname;
        Email.value = docSnap.data().pEmail;
        IDNO.value = docSnap.data().pIDNO;
<<<<<<< HEAD
=======
        FileNo.value = docSnap.data().pFileNo;
>>>>>>> 2d5ac969bd8e206613c3ab22369a08ac809d504d
        Address.value = docSnap.data().pAddress;
        Illness.value = docSnap.data().pIllness;
        GenBox.value = docSnap.data().Gender;
    } else {
        alert("No such document exists!");
    }
}

// ---------- UPDATE DOCUMENT IN FIRESTORE ------------------- //
async function UpdateFieldsInADocument() {
<<<<<<< HEAD
    const ref = doc(db, "clinicDB", IDNumb.value);
=======
    const ref = doc(db, "clinicDB", FileNo.value);
>>>>>>> 2d5ac969bd8e206613c3ab22369a08ac809d504d

    try {
        await updateDoc(ref, {
            pName: Name.value,
            pSurname: Surname.value,
            pEmail: Email.value,
            pIDNO: IDNO.value,
<<<<<<< HEAD
=======
            pFileNo: FileNo.value,
>>>>>>> 2d5ac969bd8e206613c3ab22369a08ac809d504d
            pAddress: Address.value,
            pIllness: Illness.value,
            Gender: GenBox.value
        });
        alert("Document updated successfully.");
    } catch (error) {
        alert("Failed to update document. Error: " + error.message);
    }
}

// ---------- DELETE DOCUMENT FROM FIRESTORE ------------------- //
async function DeleteDocument() {
<<<<<<< HEAD
    const ref = doc(db, "clinicDB", IDNumb.value);
=======
    const ref = doc(db, "clinicDB", FileNo.value);
>>>>>>> 2d5ac969bd8e206613c3ab22369a08ac809d504d

    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) {
        alert("Document doesn't exist");
        return;
    }

    try {
        await deleteDoc(ref);
        alert("Data deleted successfully");
    } catch (error) {
        alert("Unsuccessful operation, error: " + error);
    }
}

// ---------- ASSIGNING EVENTS TO BUTTONS ------------------- //
insBtn.addEventListener("click", AddDocument_AutoID);
SelBtn.addEventListener("click", GetADocument);
UpdBtn.addEventListener("click", UpdateFieldsInADocument);
DelBtn.addEventListener("click", DeleteDocument);

// ------------------ APPOINTMENT SCHEDULING ------------------ //
document.addEventListener("DOMContentLoaded", async () => {
    // UI Element References
    const illnesses = document.getElementById('illnesses');
    const timeInput = document.getElementById('time');
    const scheduleBtn = document.getElementById('scheduleBtn');
    const timeError = document.getElementById('timeError');
    const appointmentDetails = document.getElementById('appointmentDetails');
    const datesContainer = document.querySelector(".dates");
    const monthYear = document.getElementById("monthYear");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const originalDateSelect = document.getElementById('originalDate');
    const newDateInput = document.getElementById('newDate');
    const newTimeInput = document.getElementById('newTime');
    const rescheduleBtn = document.getElementById('rescheduleBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    let selectedHour = 0;
    let selectedMin = 0;
    let daysToAdd = 30;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let appointments = {}; // Stores appointment dates

    // Fetch appointments from Firestore and render the calendar
    async function fetchAppointments() {
        const querySnapshot = await getDocs(collection(db, "clinicDB"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = new Date(data.year, data.month - 1, parseInt(doc.id.split("-")[2]));
            appointments[doc.id] = true;
        });
        renderCalendar(currentMonth, currentYear);
    }

    // Render Calendar for the selected month and year
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

    // Illness selection to set the number of days to add to current date
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

    // Time validation for scheduling
    timeInput.addEventListener('input', () => {
        const timeValue = timeInput.value;
        if (timeValue) {
            const [hour, min] = timeValue.split(":").map(Number);
            selectedHour = hour;
            selectedMin = min;

            if (validateTime(selectedHour, selectedMin)) {
                timeError.style.display = 'none';
                timeInput.setCustomValidity('');
            } else {
                timeError.style.display = 'block';
                timeInput.setCustomValidity('Please select a valid time between 07:00 and 17:00 in 20-minute intervals.');
            }
        }
    });

    // Validate time is between 07:00 and 17:00 in 20-minute intervals
    function validateTime(hour, minute) {
        const isWithinTimeRange = hour >= 7 && hour <= 17;
        const isIn20MinuteInterval = minute % 20 === 0;

        if (hour === 17 && minute !== 0) {
            return false;
        }
        return isWithinTimeRange && isIn20MinuteInterval;
    }

    // Calendar navigation
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

        const selectedDate = calendar.toISOString().split("T")[0];
        const selectedTime = `${selectedHour}:${selectedMin.toString().padStart(2, '0')}`;

        // Save appointment to Firestore
        try {
            await setDoc(doc(db, "clinicDB", selectedDate), {
                time: selectedTime,
                month: currentMonth + 1,
                year: currentYear
            });
            console.log("Appointment saved.");
        } catch (error) {
            console.error("Error adding appointment:", error);
        }

        renderCalendar(currentMonth, currentYear);
    });

    // Fetch and display original appointment dates for rescheduling
    try {
        const querySnapshot = await getDocs(collection(db, "clinicDB"));
        querySnapshot.forEach(doc => {
            const dateOption = document.createElement('option');
            dateOption.value = doc.id;
            dateOption.textContent = doc.id;
            originalDateSelect.appendChild(dateOption);
        });
    } catch (error) {
        errorMessage.textContent = "Failed to load available dates.";
        errorMessage.style.display = 'block';
    }

    // Reschedule appointment logic
    rescheduleBtn.addEventListener('click', async () => {
        const originalDate = originalDateSelect.value;
        const newDate = newDateInput.value;
        const newTime = newTimeInput.value;

        if (!originalDate || !newDate || !newTime) {
            errorMessage.textContent = "Please fill out all fields.";
            errorMessage.style.display = 'block';
            return;
        }

        const originalDateObj = new Date(originalDate);
        const newDateObj = new Date(newDate);
        const newTimeObj = new Date(`1970-01-01T${newTime}:00`);
        const maxNewDate = new Date(originalDateObj);
        maxNewDate.setDate(maxNewDate.getDate() + 3);

        const minTime = new Date("1970-01-01T15:00:00");
        const maxTime = new Date("1970-01-01T17:00:00");

        if (newDateObj > maxNewDate || newDateObj < originalDateObj || newTimeObj < minTime || newTimeObj > maxTime) {
            errorMessage.textContent = "Please choose a valid date and time.";
            errorMessage.style.display = 'block';
            return;
        }

        try {
            await setDoc(doc(db, "clinicDB", newDate), { time: newTime });
            successMessage.textContent = "Appointment rescheduled successfully!";
            successMessage.style.display = 'block';
        } catch (error) {
            errorMessage.textContent = "Error rescheduling appointment.";
            errorMessage.style.display = 'block';
        }
    });

    // Initialize calendar and appointments
    await fetchAppointments();
});
