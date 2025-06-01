// firebase/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDca4RVawfpo3fOhZO6DYScG3XfSUj_J-o",
  authDomain: "cozycreation-4a0f9.firebaseapp.com",
  projectId: "cozycreation-4a0f9",
  storageBucket: "cozycreation-4a0f9.firebasestorage.app",
  messagingSenderId: "811119939318",
  appId: "1:811119939318:web:7f0309075279e8153b66d7",
  measurementId: "G-V7RFK8RZWR"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
