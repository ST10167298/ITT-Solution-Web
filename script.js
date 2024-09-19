import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, setDoc, doc,  } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

import{
    doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField

}
from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";


const db = getFirestore();


// Your web app's Firebase configuration
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
const auth = getAuth();
const database = getFirestore();

// Function to display messages
function showMessage(message, divId) {
    const displayMessage = document.getElementById(divId);
    displayMessage.style.display = "block";
    displayMessage.innerHTML = message;
    displayMessage.style.opacity = 1; 
}

// Form declarations
const signUpButton = document.querySelector('.HBtn');
const loginButton = document.getElementById('login-btn');

// Onclick function for user to create account
signUpButton?.addEventListener('click', (event) => {
    event.preventDefault();
    
    // Fetching the user input values
    const
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;

    // Firebase function to create a user with email and password
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Data to store in Firestore
            const userData = {
                email: email,
                fullName: fullName,
                surname: surname
            };

            // Store user data in Firestore
            const docRef = doc(database, "clinicDB", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    showMessage('Account Created Successfully', 'registerMessage');
                    window.location.href = 'home.html'; // Redirect to login page
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

// Onclick function for user login (add this if needed for login page)
loginButton?.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Firebase sign in function
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Successful login
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        })
        .catch((error) => {
            showMessage('Login failed: ' + error.message, 'loginMessage');
        });
})

//---------------PROFILE PAGE---------------------//
//----------references-----------------------//

 let Name = document.getElementById("name");
 let Surname = document.getElementById("surname");
 let Email = document.getElementById("email");
 let IDNO = document.getElementById("IDNumb");
 let Address = document.getElementById("address");
 let Illness = document.getElementById("illness");
 let GenBox = document.getElementById("Genbox");
 
 let insBtn = document.getElementById("insbtn");
 let SelBtn = document.getElementById("Selbtn");
 let UpdBtn = document.getElementById("Updbtn");
 let DelBtn = document.getElementById("Delbtn");


//----------ADDING DOCUMENT-----------------------//

async function AddDocument_AutoID() {

// Create a document reference with a custom document ID (RollNo.value)
var ref = doc(db, "clinicDB", IDNumb.value);

const defRec = await setDoc(
ref, {
    pName: Name.value,
    pSurname: Surname.value,
    pEmail: Email.value,
    pIDNO: IDNO.value, 
    pFileNo: FileNo.value,
    pAddress: Address.value,
    pIllness: Illness.value, 
    Gender: GenBox.value,
})
.then(() => {
alert("data added successfully");
})
.catch((error) => {
alert("unsuccessful operation, error: " + error);
});

}


//----------GET DOC FROM FS-------------------only takes even nos for rollno----//
async function GetADocument() {
var ref = doc(db, "TheStudentsList", RollNo.value); 
const docSnap = await getDoc(ref);  

if (docSnap.exists()) {
NameBox.value = docSnap.data().NameOfStd;
SecBox.value = docSnap.data().Section;
TimeBox.value = docSnap.data().Time; 
GenBox.value = docSnap.data().Gender;
selectedDate = docSnap.data().SelectedDate;
selectedDateDisplay.textContent = `Selected Date: ${selectedDate || 'None'}`;
  
} else {
alert("No such document exists!");
}
}

//----------UPDATING DOC-----------------------//

async function UpdateFieldsInADocument() {
if (!selectedDate) {
        alert("Please select a date first.");
        return;
    }

// Create a document reference with a custom document ID (RollNo.value)
var ref = doc(db, "TheStudentsList", RollNo.value);

await updateDoc(
ref, {
    NameOfStd: NameBox.value,
    Section: SecBox.value,
    Time: TimeBox.value,
    Gender: GenBox.value,
    SelectedDate: selectedDate
})
.then(() => {
alert("updated successfully");
})
.catch((error) => {
alert("unsuccessful operation, error: " + error);
});
}

//----------DELETING DOC-----------------------//
async function DeleteDocument() {
var ref = doc(db, "TheStudentsList", RollNo.value); 
const docSnap = await getDoc(ref);
if (!docSnap.exists()) {
alert("doc doesn't exist");
return;
} 

await deleteDoc(ref)
.then(() => {
alert("data deleted successfully"); 
selectedDateDisplay.textContent = "Selected Date: None";
})
.catch((error) => {
alert("unsuccessful operation, error: " + error);
});
}

//----------ASSIGNING EVENTS TO BUTTONS-----------------------//
insBtn.addEventListener("click", AddDocument_AutoID);
SelBtn.addEventListener("click", GetADocument);  
UpdBtn.addEventListener("click", UpdateFieldsInADocument);  
DelBtn.addEventListener("click", DeleteDocument); 























);
