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



  //reference to the database
  var db = firebase.database().ref("clinic");

  //
  document.getElementById('submit-sign').addEventListener('submit', verifySignup)


// Signup Function
function verifySignup(e) {

    e.preventDefault();
    
    var fullName = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;
    var email = document.getElementById("emailSignup").value;
    var idNumber = document.getElementById("IDNumb").value;
    var fileNumber = document.getElementById("fileNo").value;
    var address = document.getElementById("address").value;
    var illness = document.getElementById("illness").value;
    var gender = document.getElementById("gender").value;
    var password = document.getElementById("passwordSignup").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    


    // do validation for details 
    if(fullName.length < 3){

        alert("Invalid First Name");
        

    }else{

        //calling function to save details
        save(fullName, surname,  email, idNumber, fileNumber, address, illness, gender, password, confirmPassword );

        //clear form
        document.getElementById('submit-sign').reset()
    }
}

//finction to save to database
const save = (fullName, surname,  email, idNumber, fileNumber, address, illness, gender, password, confirmPassword ) =>{

    //database instance variable
    var save = db.push();

    //set values to database
    save.set({

        Name: fullName,
        Surname: surname,
        Email: email,
        ID: idNumber,
        FileNumber: fileNumber,
        Address: address,
        Illness: illness,
        Gender: gender,
        Password: password,
        confirmPassword: confirmPassword
    })

}
//redo this method
// Login Function

function verifyLogin() {
    var email = document.getElementById("emailLogin").value;
    var password = document.getElementById("passwordLogin").value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Login successful!");
            window.location.href = "trackApp.html"; // Redirect after login
        })
        .catch((error) => {
            console.error("Error logging in: ", error);
            alert("Invalid email or password!");
        });

}