// Imports
import { auth, db } from "../firebase/firebase.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM Elements
const form = document.getElementById("loginForm");
const googleBtn = document.getElementById("googleSignIn");
const provider = new GoogleAuthProvider();

// Popup Message Function
function showPopupMessage(message, bgColor = "#4caf50") {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.background = bgColor;
  popup.style.color = "#fff";
  popup.style.padding = "15px 30px";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  popup.style.zIndex = "9999";
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2500);
}

// Email/Password Login
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showPopupMessage("✅ Login successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2500);
  } catch (error) {
    showPopupMessage("❌ " + error.message, "#f44336");
    console.error(error);
  }
});

// Google Sign-In
googleBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
      });
    }

    showPopupMessage("✅ Google sign-in successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2500);
  } catch (error) {
    showPopupMessage("❌ Google sign-in failed: " + error.message, "#f44336");
    console.error(error);
  }
});
