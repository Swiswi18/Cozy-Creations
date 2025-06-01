import { auth, db } from "../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("requestForm");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../auth/login.html";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const type = document.getElementById("type").value;
    const subject = document.getElementById("subject").value;
    const details = document.getElementById("details").value;

    await addDoc(collection(db, "requests"), {
      userId: user.uid,
      email: user.email,
      type,
      subject,
      details,
      createdAt: serverTimestamp()
    });

    alert("Your request has been submitted!");
    form.reset();
  });
});
