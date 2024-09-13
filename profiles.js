  
  // Import the functions you need from the SDKs you need
  import { initializeApp } from"https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
  import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
    const db = getFirestore();

    //----------references-----------------------//
    let Name = document.getElementById("name");
    let Surname = document.getElementById("surname");
    let Email = document.getElementById("email");
    let IDNO = document.getElementById("IDNumb");
    let FileNo = document.getElementById("fileNo");
    let Address = document.getElementById("address");
    let Illness = document.getElementById("illness");
    let GenBox = document.getElementById("Genbox");

    let insBtn = document.getElementById("insbtn");
    let SelBtn = document.getElementById("Selbtn");
    let UpdBtn = document.getElementById("Updbtn");
    let DelBtn = document.getElementById("Delbtn");

    //----------ADDING DOCUMENT-----------------------//
    async function AddDocument_AutoID() {
        if (!FileNo.value) {
            alert("Please enter the File Number.");
            return;
        }
        var ref = doc(db, "clinicDB", FileNo.value); 

        try {
            await setDoc(ref, {
                pName: Name.value,
                pSurname: Surname.value,
                pEmail: Email.value,
                pIDNO: IDNO.value, 
                pFileNo: FileNo.value,
                pAddress: Address.value,
                pIllness: Illness.value, 
                Gender: GenBox.value,
            });
            alert("Data added successfully");
        } catch (error) {
            alert("Unsuccessful operation, error: " + error);
        }
    }
    //----------GET DOC FROM FS-----------------------//
    async function GetADocument() {
        if (!FileNo.value) {
            alert("Please enter the File Number.");
            return;
        }
        
        var ref = doc(db, "clinicDB", FileNo.value);

        const docSnap = await getDoc(ref);  

        if (docSnap.exists()) {
            Name.value = docSnap.data().pName;
            Surname.value = docSnap.data().pSurname;
            Email.value = docSnap.data().pEmail; 
            IDNO.value = docSnap.data().pIDNO;
            FileNo.value = docSnap.data().pFileNo;
            Address.value = docSnap.data().pAddress;
            Illness.value = docSnap.data().pIllness; 
            GenBox.value = docSnap.data().Gender;
        } else {
            alert("No such document exists!");
        }
    }
    
    //----------UPDATING DOC-----------------------//
    async function UpdateFieldsInADocument() {
        if (!FileNo.value) {
            alert("Please enter the File Number.");
            return;
        }

        var ref = doc(db, "clinicDB", FileNo.value);

        try {
            await updateDoc(ref, {
                pName: Name.value,
                pSurname: Surname.value,
                pEmail: Email.value,
                pIDNO: IDNO.value,
                pFileNo: FileNo.value,
                pAddress: Address.value,
                pIllness: Illness.value,
                Gender: GenBox.value,
            });
            alert("Document updated successfully.");
        } catch (error) {
            alert("Failed to update document. Error: " + error.message);
        }
    }

    //----------DELETING DOC-----------------------//
    async function DeleteDocument() {
        if (!FileNo.value) {
            alert("Please enter the File Number.");
            return;
        }

        var ref = doc(db, "clinicDB", FileNo.value);

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

    //----------ASSIGNING EVENTS TO BUTTONS-----------------------//
    insBtn.addEventListener("click", AddDocument_AutoID);
    SelBtn.addEventListener("click", GetADocument);  
    UpdBtn.addEventListener("click", UpdateFieldsInADocument);  
    DelBtn.addEventListener("click", DeleteDocument); 
