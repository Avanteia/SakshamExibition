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
// Security Rules, which must allow public "create" on
// /registrations and /stallBookings but restrict "read"/"delete"
// to signed-in admins only.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc,
  query, orderBy, serverTimestamp, runTransaction, where
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

// ---- Public: competition registration (contact.html) ----
window.saveRegistrationToFirebase = function (data) {
  return addDoc(collection(db, "registrations"), {
    ...data,
    createdAt: serverTimestamp()
  });
};

// ---- Public: stall booking (contact.html) ----
// Split across two collections on purpose:
//   stallBookings/{hallType-stallNumber} — a PII-free marker doc. Public can
//     create + read it (that's how the picker checks availability without
//     ever exposing anyone's phone/business name to a random visitor).
//   stallDetails/{autoId} — the real booking record (business, phone, fee,
//     payment ref, Aadhar/FSSAI if applicable). Public can only create it;
//     only a signed-in admin can read or delete it.
// Both writes happen in one transaction, so two people can never win the
// same stall even if they submit at the exact same moment.
window.bookStallInFirebase = async function (data) {
  const stallId = `${data.hallType}-${data.stallNumber}`;
  const markerRef = doc(db, "stallBookings", stallId);
  const detailRef = doc(collection(db, "stallDetails"));
  await runTransaction(db, async (tx) => {
    const existing = await tx.get(markerRef);
    if (existing.exists()) {
      throw new Error("STALL_ALREADY_BOOKED");
    }
    tx.set(markerRef, { hallType: data.hallType, stallNumber: data.stallNumber, createdAt: serverTimestamp() });
    tx.set(detailRef, { ...data, createdAt: serverTimestamp() });
  });
  return detailRef.id;
};

// Returns just the booked stall numbers for a hall, so the picker can
// disable them. Reads only the PII-free marker collection.
window.fetchBookedStallNumbers = async function (hallType) {
  const q = query(collection(db, "stallBookings"), where("hallType", "==", hallType));
  const snap = await getDocs(q);
  const numbers = [];
  snap.forEach(docSnap => numbers.push(docSnap.data().stallNumber));
  return numbers;
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

window.sakshamFetchStallBookings = async function () {
  const q = query(collection(db, "stallDetails"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const rows = [];
  snap.forEach(docSnap => rows.push({ id: docSnap.id, ...docSnap.data() }));
  return rows;
};

window.sakshamDeleteRegistration = function (id) {
  return deleteDoc(doc(db, "registrations", id));
};

// Deletes the detail record AND frees the stall by removing its marker,
// so the stall becomes bookable again.
window.sakshamDeleteStallBooking = async function (detailId, hallType, stallNumber) {
  await deleteDoc(doc(db, "stallDetails", detailId));
  if (hallType && stallNumber) {
    await deleteDoc(doc(db, "stallBookings", `${hallType}-${stallNumber}`));
  }
};
