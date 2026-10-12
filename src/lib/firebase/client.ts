import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig, isFirebaseConfigured } from "./config";

let app: FirebaseApp | null = null;

export function firebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!app) app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function db(): Firestore | null {
  const a = firebaseApp();
  return a ? getFirestore(a) : null;
}

export function auth(): Auth | null {
  const a = firebaseApp();
  return a ? getAuth(a) : null;
}
