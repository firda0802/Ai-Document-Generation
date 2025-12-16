import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDV6gc3t5e-9Alg_pl0CXNxzVdO5rLN30Q",
  authDomain: "document-gen-ai.firebaseapp.com",
  databaseURL: "https://document-gen-ai-default-rtdb.firebaseio.com",
  projectId: "document-gen-ai",
  storageBucket: "document-gen-ai.firebasestorage.app",
  messagingSenderId: "818204957612",
  appId: "1:818204957612:web:e2e4dabd276db98147b809",
  measurementId: "G-ZCJS5Z3CJP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Configure Google provider with Drive/Docs scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/documents');
googleProvider.addScope('https://www.googleapis.com/auth/presentations');
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');

export const githubProvider = new GithubAuthProvider();
