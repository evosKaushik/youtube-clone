import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlwHnam9jmZ7S-RvuxM7oLvqmN4ghmnsc",
  authDomain: "clone-3fcb8.firebaseapp.com",
  projectId: "clone-3fcb8",
  storageBucket: "clone-3fcb8.firebasestorage.app",
  messagingSenderId: "858593514991",
  appId: "1:858593514991:web:ceaa0b38c9e705b5f2521a",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };