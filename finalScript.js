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


// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const password = document.getElementById('password');
const confirmpassword = document.getElementById('confirm-password');

togglePassword?.addEventListener('click', function () {
    // Toggle the type attribute of the password and confirm password fields
    const passwordType = password.getAttribute('type') === 'password' ? 'text' : 'password';
    const confirmPasswordType = confirmpassword.getAttribute('type') === 'password' ? 'text' : 'password';
    
    password.setAttribute('type', passwordType);
    confirmpassword.setAttribute('type', confirmPasswordType);

    // Toggle the eye icon
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
    e.preventDefault(); // Prevent form submission

    const IDNumb = document.getElementById('IDNumb').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const role = document.getElementById('role').value; // Get selected role

    const errorDiv = document.getElementById('password-error');

    // Check if passwords match
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match. Please try again.'; // Update the error message
        errorDiv.style.display = 'block'; // Show the error message
        return; // Exit the function early to prevent user registration
    } else {
        errorDiv.style.display = 'none'; // Hide the error message
    }
    // Register user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save user data to the database
            return set(ref(database, 'users/' + IDNumb), {
                IDNumb,
                name,
                surname,
                email,
                password,
                role
            });
        })
        .then(() => {
            // Data saved successfully!
            alert('User created successfully');

            // Store IDNumb in localStorage
            localStorage.setItem('newUserId', IDNumb);

            // Redirect to home page
            window.location.href = 'home.html';
        })
        .catch((error) => {
           // alert('Error: ' + error.message);
        });
});

// Sign in user
LoginBtn?.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userRef = ref(database, 'users');

            // Query the database for the user's IDNumb
            get(ref(database, 'users')).then((snapshot) => {
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    let foundUser = null;

                    // Iterate through users and find the matching email
                    Object.values(users).forEach((userData) => {
                        if (userData.email === email) {
                            foundUser = userData;
                        }
                    });

                    if (foundUser) {
                        // Store IDNumb in localStorage
                        localStorage.setItem('newUserId', foundUser.IDNumb);

                          // Redirect based on role
                          if (foundUser.role === 'admin') {
                            alert('Admin logged in successfully');
                            window.location.href = 'admin.html'; // Redirect to admin dashboard
                        } else {
                            alert('User logged in successfully');
                            window.location.href = 'profiles.html'; // Redirect to user dashboard
                        }
                    }
                       else {
                     //   alert('No matching user found');
                    }
                } else {
                   // alert('No users found');
                }
            });
        })
        .catch((error) => {
            alert('Error signing in: ' + error.message);
        });
});

//------------Retrieve user data on the profile page-----------------//
//------------Retrieve user data on the profile page-----------------//
document.addEventListener('DOMContentLoaded', () => {
    // Check if the current page is profiles.html
    if (window.location.pathname.includes('profiles.html')) {
        const newUserId = localStorage.getItem('newUserId');

        if (newUserId) {
            const userRef = ref(database, 'users/' + newUserId);

            get(userRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();

                        // Display user data on profile page
                        document.getElementById('name').textContent = userData.name;
                        document.getElementById('surname').textContent = userData.surname;
                        document.getElementById('email').textContent = userData.email;
                        document.getElementById('IDNumb').textContent = userData.IDNumb;
                    } else {
                      //  alert("No user data found.");
                    }
                })
                .catch((error) => {
                    alert("Error retrieving user data: " + error.message);
                });
        } else {
           // alert("No user ID found in local storage.");
        }
    }
});

//-------------------------------------------- SAVE USER DATA ---------------------------------\\
// Save button event listener
saveBtn?.addEventListener('click', async function (e) {
    e.preventDefault();  // Prevent form submission

    // Get the selected illnesses from the checkboxes
    const selectedIllnesses = Array.from(document.querySelectorAll('input[name="illnesses"]:checked'))
        .map(checkbox => checkbox.value);

    const IDNumb = document.getElementById('IDNumb').innerText;
    const email = document.getElementById('email').innerText;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const allergies = document.getElementById('allergies').value;
    const conditions = document.getElementById('conditions').value;
    const medications = document.getElementById('medications').value;
    const kinName = document.getElementById('kinName').value;
    const relationship = document.getElementById('relationship').value;
    const kinPhone = document.getElementById('kinPhone').value;
    const kinEmail = document.getElementById('kinEmail').value;

    try {
        // Save user data to Firebase Realtime Database
        await set(ref(database, 'userProfile/' + IDNumb), {
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
            illnesses: selectedIllnesses, // Store selected illnesses
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


//-------------------------------------------- UPDATE USER DATA ---------------------------------\\
Updatebtn?.addEventListener('click', async function (e) {
    e.preventDefault();  // Prevent form submission

    const IDNumb = document.getElementById('IDNumb').textContent.trim();

    // Get the selected illnesses from the checkboxes
    const selectedIllnesses = Array.from(document.querySelectorAll('input[name="illnesses"]:checked'))
        .map(checkbox => checkbox.value);

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
        // Update user data in Firebase Realtime Database
        await update(ref(database, 'userProfile/' + IDNumb), {
            phone,
            address,
            city,
            state,
            zip,
            allergies,
            illnesses: selectedIllnesses, // Update selected illnesses
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
            localStorage.removeItem('newUserId'); // Clear IDNumb from localStorage
            alert('Logged out successfully');
            window.location.href = 'home.html'; // Redirect to login page
        }).catch((error) => {
            alert('Error logging out: ' + error.message);
        });
    });
