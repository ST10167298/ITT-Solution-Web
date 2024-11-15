 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
 import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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
 
     // Function to extract DOB from ID number
     function extractDOBFromID(IDNumb) {
        const year = IDNumb.substring(0, 2);
        const month = IDNumb.substring(2, 4);
        const day = IDNumb.substring(4, 6);
        
        // Determine century (assuming ID is in YYMMDD format and valid for 1900-2099)
        const currentYear = new Date().getFullYear() % 100;
        const birthYear = parseInt(year, 10) > currentYear ? `19${year}` : `20${year}`;
    
        // Format date as YYYY-MM-DD
        return `${birthYear}-${month}-${day}`;
    }

 // Toggle password visibility
 const togglePassword = document.getElementById('togglePassword');
 const password = document.getElementById('password');
 const confirmpassword = document.getElementById('confirm-password');
 
 togglePassword?.addEventListener('click', function () {
     const passwordType = password.getAttribute('type') === 'password' ? 'text' : 'password';
     const confirmPasswordType = confirmpassword.getAttribute('type') === 'password' ? 'text' : 'password';
     password.setAttribute('type', passwordType);
     confirmpassword.setAttribute('type', confirmPasswordType);
 
     this.querySelector('i').classList.toggle('fa-eye');
     this.querySelector('i').classList.toggle('fa-eye-slash');
 });
 
 // Get elements
 const submitData = document.getElementById('submitData');
 const LoginBtn = document.getElementById('LoginBtn');
 const saveBtn = document.getElementById('saveBtn');
 const Updatebtn = document.getElementById('Updatebtn');
 
 // Register new user
 submitData?.addEventListener('click', (e) => {
     e.preventDefault();
     const IDNumb = document.getElementById('IDNumb').value;
     const name = document.getElementById('name').value;
     const surname = document.getElementById('surname').value;
     const email = document.getElementById('email').value;
     const password = document.getElementById('password').value;
     const confirmPassword = document.getElementById('confirm-password').value;
     const role = 'user'; // This will automatically set the role to "user"
    
     const errorDiv = document.getElementById('password-error');
 
        // Check if IDNumb is valid
     if (!/^\d{13}$/.test(IDNumb)) { // Adjust the regex pattern to your IDNumb requirements
         alert('Please enter a valid 13-digit ID number.');
        return;
    }


     if (password !== confirmPassword) {
         errorDiv.textContent = 'Passwords do not match. Please try again.';
         errorDiv.style.display = 'block';
         return;
     } else {
         errorDiv.style.display = 'none';
     }

 
 // Automatically extract DOB from ID number
 const dob = extractDOBFromID(IDNumb);

     createUserWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
             const user = userCredential.user;
             localStorage.setItem('newUserId', user.uid);  // Set newUserId here
 
             return set(ref(database, 'users/' + user.uid), {
                 IDNumb,
                 name,
                 surname,
                 email,
                 dob,  // Save DOB here
                 role, 
                 password
             });
         })
         .then(() => {
             alert('User created successfully');
             window.location.href = 'home.html';
         })
         .catch((error) => {
             alert('Error: ' + error.message);
         });
     });
 
 
 // Sign in user
 LoginBtn?.addEventListener('click', (e) => {
     e.preventDefault();
 
     const email = document.getElementById('email').value;
     const password = document.getElementById('password').value;
 
     signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
             const user = userCredential.user;
             localStorage.setItem('newUserId', user.uid);  // Set newUserId here
 
             return get(ref(database, 'users/' + user.uid));
         })
         .then((snapshot) => {
             if (snapshot.exists()) {
                 const foundUser = snapshot.val();
 
                 if (foundUser.role === 'admin') {
                     alert('Admin logged in successfully');
                     window.location.href = 'admin.html';
                 } else {
                     alert('User logged in successfully');
                     window.location.href = 'profiles.html';
                 }
             } else {
                 alert('No matching user found');
             }
         })
         .catch((error) => {
             alert('Error signing in: ' + error.message);
         });
 
     });
 // Retrieve user data on the profile page
 document.addEventListener('DOMContentLoaded', () => {
     if (window.location.pathname.includes('profiles.html')) {
         const newUserId = localStorage.getItem('newUserId');
         console.log("Retrieved newUserId from localStorage:", newUserId);  // Debugging line
         
         if (newUserId) {
             get(ref(database, 'users/' + newUserId))
                 .then((snapshot) => {
                     console.log("Snapshot data:", snapshot.val());  // Debugging line
                     if (snapshot.exists()) {
                         const userData = snapshot.val();
                         // Set textContent of each <span> element
                         document.getElementById('IDNumb').textContent = userData.IDNumb || '';
                         document.getElementById('name').textContent = userData.name || '';
                         document.getElementById('surname').textContent = userData.surname || '';
                         document.getElementById('email').textContent = userData.email || '';
                         document.getElementById('dob').textContent = userData.dob || '';  
                
                     } else {
                         console.log("No data found at path 'users/" + newUserId + "'");  // Debugging line
                         alert("No user data found.");
                     }
                 })
                 .catch((error) => {
                     console.error("Error retrieving user data:", error.message);  // Debugging line
                     alert("Error retrieving user data: " + error.message);
                 });
         } else {
             alert("User ID not found in local storage.");
         }
     }
 });
 
 
 // Save user data
 saveBtn?.addEventListener('click', async function (e) {
    e.preventDefault();

    const userId = localStorage.getItem('newUserId');
    if (!userId) {
        alert('User ID not found in local storage.');
        return;
    }

    const selectedIllnesses = Array.from(document.querySelectorAll('input[name="illnesses"]:checked')).map(checkbox => checkbox.value);
    const IDNumb = localStorage.getItem('IDNumb') || '';
    const email = document.getElementById('email')?.value || '';
    const dob = document.getElementById('dob')?.value || '';
    const gender = document.getElementById('gender')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const address = document.getElementById('address')?.value || '';
    const city = document.getElementById('city')?.value || '';
    const state = document.getElementById('state')?.value || '';
    const zip = document.getElementById('zip')?.value || '';
    const allergies = document.getElementById('allergies')?.value || '';
    const conditions = document.getElementById('conditions')?.value || '';
    //const medications = document.getElementById('medications')?.value || '';
    const kinName = document.getElementById('kinName')?.value || '';
    const relationship = document.getElementById('relationship')?.value || '';
    const kinPhone = document.getElementById('kinPhone')?.value || '';
    const kinEmail = document.getElementById('kinEmail')?.value || '';

    try {
        await set(ref(database, 'userProfile/' + userId), {
            IDNumb,
            email,
            dob,
            gender,
            phone,
            address,
            city,
            state,
            zip,
            allergies,
            conditions,
            illnesses: selectedIllnesses,
            medications,
            kinName,
            relationship,
            kinPhone,
            kinEmail,
        });
        alert('Data successfully saved!');
    } catch (error) {
        alert('Failed to save data: ' + error.message);
    }
});

 
 // Update user data
 Updatebtn?.addEventListener('click', async function (e) {
     e.preventDefault();
 
     const userId = localStorage.getItem('newUserId');  // Retrieve userId from localStorage
     if (!userId) {
         alert('User ID not found in local storage.');
         return;
     }
 
     const selectedIllnesses = Array.from(document.querySelectorAll('input[name="illnesses"]:checked')).map(checkbox => checkbox.value);
     const IDNumb = localStorage.getItem('IDNumb');
     const phone = document.getElementById('phone').value;
     const address = document.getElementById('address').value;
     const city = document.getElementById('city').value;
     const state = document.getElementById('state').value;
     const zip = document.getElementById('zip').value;
     const allergies = document.getElementById('allergies').value;
     const kinName = document.getElementById('kinName').value;
     const relationship = document.getElementById('relationship').value;
     const kinPhone = document.getElementById('kinPhone').value;
     const kinEmail = document.getElementById('kinEmail').value;
 
     try {
         await update(ref(database, 'userProfile/' + userId), {
             
             phone,
             address,
             city,
             state,
             zip,
             allergies,
             illnesses: selectedIllnesses,
             kinName,
             relationship,
             kinPhone,
             kinEmail,
         });
         alert('Data successfully updated!');
     } catch (error) {
         alert('Failed to update data: ' + error.message);
     }
 });
 

 
 // Logout function
 const logoutBtn = document.getElementById('logoutBtn');
 logoutBtn?.addEventListener('click', () => {
     signOut(auth).then(() => {
         localStorage.removeItem('newUserId');
         alert('Logged out successfully');
         window.location.href = 'home.html';
     }).catch((error) => {
         alert('Error logging out: ' + error.message);
     });
 });