import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/services/firebase.js";

export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// Creates the /users/{uid} doc if missing. Uses merge:true so two
// concurrent sign-ins can't race each other (was a bug earlier, hit it
// while testing Google popup on slow network).
async function ensureUserDoc(user, displayName) {
  const ref = doc(db, "users", user.uid);
  await setDoc(
    ref,
    {
      email: user.email ?? "",
      displayName: displayName ?? user.displayName ?? "",
      streak: 0,
      longestStreak: 0,
      lastStudiedAt: null,
      theme: "light",
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function signUpWithEmail({ email, password, displayName }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  await ensureUserDoc(cred.user, displayName);
  return cred.user;
}

export async function signInWithEmail({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export async function signInWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  await ensureUserDoc(cred.user);
  return cred.user;
}

export function signOut() {
  return fbSignOut(auth);
}

export function mapAuthError(code) {
  const map = {
    "auth/invalid-email": "That email address looks invalid.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Please use at least 6 characters.",
    "auth/invalid-credential": "Wrong email or password.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Wrong email or password.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error — please try again.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
}
