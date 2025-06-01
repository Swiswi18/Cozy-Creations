import { auth, db } from "../firebase/firebase.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// DOM Elements
const emailField = document.getElementById("email");
const displayNameField = document.getElementById("displayName");
const updateBtn = document.getElementById("updateBtn");
const logoutBtn = document.getElementById("logoutBtn");
const profileImage = document.getElementById("profileImage");
const previewImage = document.getElementById("previewImage");
const storage = getStorage();

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../auth/login.html";
    return;
  }

  // Display email and fetch profile
  emailField.value = user.email;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    displayNameField.value = data.displayName || "";
  }

  updateBtn.addEventListener("click", async () => {
    const newName = displayNameField.value;

    // Update Auth profile
    await updateProfile(user, { displayName: newName });

    // Update Firestore profile
    await updateDoc(userRef, { displayName: newName });

    alert("Profile updated!");
  });

  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "../auth/login.html";
  });
});

// Load existing image
if (user.photoURL) {
  previewImage.src = user.photoURL;
}

// Handle image upload
profileImage.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const storageRef = ref(storage, `profileImages/${user.uid}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // Update auth + Firestore
  await updateProfile(user, { photoURL: url });
  await updateDoc(doc(db, "users", user.uid), { photoURL: url });

  previewImage.src = url;
});
