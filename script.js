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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Signup Function
function verifySignup(e) {
  e.preventDefault();
  var fullName = document.getElementById("name").value;
  var surname = document.getElementById("surname").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmPassword").value;

  // Password validation
  if (password.length < 4) {
    alert("Password must be at least 9 characters long.");
  } else if (password !== confirmPassword) {
    alert("Passwords do not match.");
  } else {
    save(fullName, surname, email, password, confirmPassword);
    document.getElementById('submit-sign').reset();
    //redirect
    window.location.href = "trackApp.html";
  }
}

//function to save to database
const save = (fullName, surname, email, password, confirmPassword) => {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      var userId = user.uid;
      db.collection("users").doc(userId).set({
        Name: fullName,
        Surname: surname,
        Email: email,
        Password: password,
        confirmPassword: confirmPassword,
      });
    })
    .catch((error) => {
      console.error("Error signing up: ", error);
    });
}
document.getElementById('loginButton')?.addEventListener('click', verifyLogin);

// Login Function
function verifyLogin() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      var userId = user.uid;
      db.collection("users").doc(userId).get().then((doc) => {
        if (doc.exists) {
          var userData = doc.data();
          var name = userData.name;
          var surname = userData.surname;
          alert("Login successful! Name: " + name + ", Surname: " + surname);
          window.location.href = "trackApp.html"; // Redirect after login
        } else {
          console.error("No user data found");
        }
      });
    })
    .catch((error) => {
      //console.error("Error logging in: ", error);
      alert("Invalid email or password!");
    });
}


