import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "clinic-1f6c8.firebaseapp.com",
    projectId: "clinic-1f6c8",
    storageBucket: "clinic-1f6c8.appspot.com",
    messagingSenderId: "455289222957",
    appId: "1:455289222957:web:1725d776c536db1b5185a4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('submit-sign').addEventListener('submit', async (e) => {
    e.preventDefault();

    const IDNumb = document.getElementById('IDNumb').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;

    try {
        await setDoc(doc(db, "clinicDB", IDNumb), {
            IDNumb,
            firstName,
            lastName,
            email
        });

        // Save the ID in localStorage for the profile page
        localStorage.setItem('newUserId', IDNumb);
        alert("User successfully registered!");

        // Redirect to the profile page
        window.location.href = "profiles.html";

    } catch (error) {
        alert("Error saving data: " + error.message);
    }
});