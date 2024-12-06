import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// firebase configuration using environment variables, reference: https://firebase.google.com/docs/reference/js
const dbconfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// init Firebase
const app = initializeApp(dbconfig);

// init Firebase services
const auth = getAuth(app);      // For Firebase Authentication
const db = getFirestore(app);   // For Firestore Database
const storage = getStorage(app); // For Firebase Storage

// init google Auth Provider setup
const googleProvider = new GoogleAuthProvider();

// export initialized services and provider
export { app, auth, db, storage, googleProvider };
