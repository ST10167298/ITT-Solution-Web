// Import Firebase SDK 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "clinic-1f6c8.firebaseapp.com",
  projectId: "clinic-1f6c8",
  storageBucket: "clinic-1f6c8.appspot.com",
  messagingSenderId: "455289222957",
  appId: "1:455289222957:web:1725d776c536db1b5185a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', function () {

    const form = document.querySelector('form');
    const updateBtn = document.getElementById('Updbtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Event listener for form submission
    updateBtn.addEventListener('click', async function (e) {
        e.preventDefault();  // Prevent default form submission

        if (validateForm()) {
            const selectedIllnesses = Array.from(document.getElementById('illnesses').selectedOptions)
            .map(option => option.value);
        
            console.log('Selected illnesses:', selectedIllnesses);  // For testing purposes

            // Save form data to Firestore
            const fileNo = document.getElementById('IDNumb').value;  // Assuming ID Number as File No.
            const ref = doc(db, "clinicDB", fileNo);

            try {
                await setDoc(ref, {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    IDNumb: fileNo,
                    dob: document.getElementById('dob').value,
                    gender: document.getElementById('gender').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zip: document.getElementById('zip').value,
                    allergies: document.getElementById('allergies').value,
                    conditions: document.getElementById('conditions').value,
                    illnesses: selectedIllnesses,  // Save selected illnesses
                    medications: document.getElementById('medications').value,
                    kinName: document.getElementById('kinName').value,
                    relationship: document.getElementById('relationship').value,
                    kinPhone: document.getElementById('kinPhone').value,
                    kinEmail: document.getElementById('kinEmail').value
                });

                alert("Data successfully submitted!");
                
            } catch (error) {
                alert("Failed to submit data: " + error.message);
            }
        } else {
            alert('Please fill in all required fields!');
        }
    });

    // Event listener for form cancellation
    cancelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to cancel? All data will be cleared.')) {
            form.reset();
        }
    });

    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = ['firstName', 'lastName', 'IDNumb', 'dob', 'gender', 'email', 'phone', 'address', 'city', 'state', 'zip', 'kinName', 'relationship', 'kinPhone'];

        requiredFields.forEach(function (field) {
            const input = document.getElementById(field);
            if (!input.value) {
                isValid = false;
                input.style.border = '2px solid red';  // Highlight empty fields
            } else {
                input.style.border = '';  // Reset border
            }
        });

        return isValid;
    }
});
