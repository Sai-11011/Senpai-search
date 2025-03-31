
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAXgGqmDaXo3XmS0DQ0BEyk9qn5doJzTiE",
    authDomain: "project-project-project-f23ad.firebaseapp.com",
    projectId: "project-project-project-f23ad",
    storageBucket: "project-project-project-f23ad.firebasestorage.app",
    messagingSenderId: "1009753654120",
    appId: "1:1009753654120:web:340c657d882eb3fa728cdd",
    measurementId: "G-W98G8PS969"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Reg = document.getElementById("register");
const log = document.getElementById("login");

async function register() {
    const userEmail = document.getElementById("Email").value;
    const userName = document.getElementById("Rusername").value;
    const Pass = document.getElementById("Rpassword").value;
    const Rpass = document.getElementById("Repassword").value;

    if (userEmail && userName && Pass && Rpass) {
        if (Pass === Rpass) {
            try {
                await addDoc(collection(db, 'userData'), {
                    Email: userEmail.toLowerCase(),
                    Name: userName,
                    Password: Pass
                });
                document.getElementById("registerMessage").innerText = "Registration successful!";
            } catch (error) {
                document.getElementById("registerErrorMessage").innerText = "Error: " + error.message;
            }
        } else {
            document.getElementById("registerErrorMessage").innerText = "Passwords do not match.";
        }
    } else {
        alert("Please enter your data");
    }
}

async function login() {
    const userName = document.getElementById("username").value;
    const Pass = document.getElementById("password").value;

    if (!userName || !Pass) {
        alert("Please enter both username and password.");
        return; 
    }

    const q = query(collection(db, 'userData'), where('Name', '==', userName));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        document.getElementById("loginErrorMessage").innerText = "User  not found.";
        return;
    }

    querySnapshot.forEach(doc => {
        if (doc.data().Password === Pass) {
            localStorage.setItem('loggedInUser ', JSON.stringify({ username: userName }));

            window.location.href = "/"; 
        } else {
            document.getElementById("loginErrorMessage").innerText = "Incorrect password.";
        }
    });
}

Reg.addEventListener("click", register);
log.addEventListener("click", login);