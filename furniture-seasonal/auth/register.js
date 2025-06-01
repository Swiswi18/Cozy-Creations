import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDca4RVawfpo3fOhZO6DYScG3XfSUj_J-o",
  authDomain: "cozycreation-4a0f9.firebaseapp.com",
  projectId: "cozycreation-4a0f9",
  storageBucket: "cozycreation-4a0f9.appspot.com",
  messagingSenderId: "811119939318",
  appId: "1:811119939318:web:7f0309075279e8153b66d7",
  measurementId: "G-V7RFK8RZWR",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

const form = document.getElementById("registerForm");
const profileImageInput = document.getElementById("profileImage");
const themeSelect = document.getElementById("theme");
const googleBtn = document.getElementById("googleSignUpBtn");
const registerBtn = form.querySelector('button[type="submit"]');

async function uploadProfileImage(file, userId) {
  if (!file) return null;
  const storageRef = ref(storage, `profileImages/${userId}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

async function saveUserData(user, theme, photoURL = "") {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    displayName: user.displayName || "",
    theme,
    photoURL,
  });
}

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
  popup.style.fontWeight = "bold";
  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 2500);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value.trim();
  const theme = themeSelect.value;
  const file = profileImageInput.files[0];

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const photoURL = await uploadProfileImage(file, user.uid);

    if (photoURL) {
      await updateProfile(user, { photoURL });
    }

    await saveUserData(user, theme, photoURL || "");

    // ✅ Show success popup
    showPopupMessage("🎉 Registration successful! Redirecting to login...");

    // ✅ Disable button & update text
    registerBtn.disabled = true;
    registerBtn.textContent = "✔️ Registered!";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);
  } catch (error) {
    showPopupMessage("❌ " + error.message, "#f44336");
    console.error(error);
  }
});

// Google Sign-Up
googleBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await saveUserData(user, "light", user.photoURL || "");
    }

    showPopupMessage("🎉 Signed in with Google! Redirecting...");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  } catch (error) {
    showPopupMessage("❌ Google sign-in failed: " + error.message, "#f44336");
    console.error(error);
  }
});
