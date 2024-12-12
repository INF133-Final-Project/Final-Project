import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * firebaseConfig.js - This file configures and initializes Firebase services for the application.
 *
 * Features:
 * - Uses environment variables to securely define Firebase configuration details.
 * - Initializes the Firebase app with the provided configuration.
 * - Exports Firebase Authentication (`auth`) for user authentication.
 * - Exports Firestore (`db`) for real-time database operations.
 * - Ensures secure and modular integration of Firebase into the application.
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize the Firebase app with the configuration object
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication and Firestore services for use in other parts of the app
export const auth = getAuth(app); // Firebase Authentication instance
export const db = getFirestore(app); // Firestore database instance
