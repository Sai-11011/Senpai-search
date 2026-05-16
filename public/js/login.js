
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Fetch Firebase config from server (config is loaded from Vercel env vars, never hardcoded)
let firebaseConfig = {};
let app, db, auth;

async function initializeFirebase() {
    try {
        const response = await fetch('/api/firebase-config');
        firebaseConfig = await response.json();
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
            throw new Error('Invalid Firebase config from server');
        }
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        enableUI();
    } catch (error) {
        console.error('Failed to load Firebase config:', error);
        alert('Error: Firebase configuration not available. Please try again later.');
        disableUI();
    }
}

function disableUI() {
    const disableIfExists = id => { const el = document.getElementById(id); if (el) el.disabled = true; };
    disableIfExists('register');
    disableIfExists('login');
    disableIfExists('googleSignIn');
    disableIfExists('forgotPassword');
}

function enableUI() {
    const enableIfExists = id => { const el = document.getElementById(id); if (el) el.disabled = false; };
    enableIfExists('register');
    enableIfExists('login');
    enableIfExists('googleSignIn');
    enableIfExists('forgotPassword');
}

// Initialize Firebase on page load
initializeFirebase();

const Reg = document.getElementById("register");
const log = document.getElementById("login");

async function register() {
    if (!app) {
        alert('Firebase not initialized. Please refresh the page.');
        return;
    }
    const userEmail = document.getElementById("Email").value;
    const userName = document.getElementById("Rusername").value;
    const Pass = document.getElementById("Rpassword").value;
    const Rpass = document.getElementById("Repassword").value;

    if (userEmail && userName && Pass && Rpass) {
        if (Pass === Rpass) {
            try {
                // Use Firebase Authentication to create the user (prevents duplicate emails)
                const userCredential = await createUserWithEmailAndPassword(auth, userEmail.toLowerCase(), Pass);
                const uid = userCredential.user.uid;
                // Save profile data in Firestore under the user's uid (do NOT store passwords)
                await setDoc(doc(db, 'userData', uid), {
                    uid,
                    Email: userEmail.toLowerCase(),
                    Name: userName
                });
                document.getElementById("registerMessage").innerText = "Registration successful! You can now log in.";
            } catch (error) {
                document.getElementById("registerErrorMessage").innerText = "Error creating account: " + error.message;
            }
        } else {
            document.getElementById("registerErrorMessage").innerText = "Passwords do not match.";
        }
    } else {
        alert("Please enter your data");
    }
}

async function login() {
    if (!app) {
        alert('Firebase not initialized. Please refresh the page.');
        return;
    }
    const userEmail = document.getElementById("email").value.trim().toLowerCase();
    const Pass = document.getElementById("password").value;

    document.getElementById("loginErrorMessage").innerText = '';

    if (!userEmail || !Pass) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, Pass);
        const uid = userCredential.user.uid;
        // Load profile from Firestore
        const profileDoc = await getDocs(query(collection(db, 'userData'), where('uid', '==', uid)));
        let profile = null;
        if (!profileDoc.empty) profile = profileDoc.docs[0].data();
        // Save minimal info to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify({ email: userEmail, name: profile ? profile.Name : '' }));
        console.log('Login successful — redirecting to home.html');
        window.location.href = 'home.html';
    } catch (error) {
        document.getElementById("loginErrorMessage").innerText = "Login error: " + error.message;
    }
}

// Google sign-in handler
const googleBtn = document.getElementById('googleSignIn');
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        if (!app) {
            alert('Firebase not initialized. Please refresh the page.');
            return;
        }
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const uid = user.uid;
            // Ensure a profile document exists
            const profileRef = doc(db, 'userData', uid);
            await setDoc(profileRef, {
                uid,
                Email: user.email ? user.email.toLowerCase() : '',
                Name: user.displayName || ''
            }, { merge: true });
            localStorage.setItem('loggedInUser', JSON.stringify({ email: user.email, name: user.displayName }));
            window.location.href = 'home.html';
        } catch (error) {
            document.getElementById("loginErrorMessage").innerText = "Google sign-in error: " + error.message;
        }
    });
}

// Forgot password handler
const forgotBtn = document.getElementById('forgotPassword');
if (forgotBtn) {
    forgotBtn.addEventListener('click', async () => {
        if (!app) {
            alert('Firebase not initialized. Please refresh the page.');
            return;
        }
        const email = prompt('Enter the email address for your account:');
        if (!email) return;
        try {
            await sendPasswordResetEmail(auth, email.trim().toLowerCase());
            alert('Password reset email sent. Check your inbox.');
        } catch (err) {
            document.getElementById("loginErrorMessage").innerText = 'Reset error: ' + err.message;
        }
    });
}

Reg.addEventListener("click", register);
log.addEventListener("click", login);
