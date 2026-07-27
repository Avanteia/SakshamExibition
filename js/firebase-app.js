// ============================================================
// सक्षम — SAKSHAM  |  Firebase bridge
//
// Loaded as a <script type="module">. Bridges the Firebase v10
// modular SDK (loaded straight from Google's CDN, no build step)
// to plain window.* functions so the classic scripts (script.js,
// admin.js) can call it without themselves being modules.
//
// This apiKey/config is NOT a secret — it only identifies the
// Firebase project. Real protection is enforced by Firestore
// Security Rules (see README notes in admin.html), which must
// allow public "create" on /registrations but restrict "read" to
// signed-in admins only.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut,
  setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdrUGVUM7li_3wEujiKg1juUCR28m1DJo",
  authDomain: "saksham-97c47.firebaseapp.com",
  projectId: "saksham-97c47",
  storageBucket: "saksham-97c47.firebasestorage.app",
  messagingSenderId: "288293889711",
  appId: "1:288293889711:web:3263bef705a4830472165a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});

// The admin login form only ever shows "Vrunda" as the username —
// Firebase Auth needs an email-shaped identifier under the hood.
const ADMIN_EMAIL = "vrunda@saksham-admin.local";

// ---- Public: called from the registration form on contact.html ----
window.saveRegistrationToFirebase = function (data) {
  return addDoc(collection(db, "registrations"), {
    ...data,
    createdAt: serverTimestamp()
  });
};

// ---- Admin: called from admin.html ----
window.sakshamAdminAuth = {
  login(username, password) {
    const email = username.trim().toLowerCase() === "vrunda" ? ADMIN_EMAIL : username.trim();
    return signInWithEmailAndPassword(auth, email, password);
  },
  logout() {
    return signOut(auth);
  },
  onState(callback) {
    return onAuthStateChanged(auth, callback);
  }
};

window.sakshamFetchRegistrations = async function () {
  const q = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const rows = [];
  snap.forEach(docSnap => rows.push({ id: docSnap.id, ...docSnap.data() }));
  return rows;
};
