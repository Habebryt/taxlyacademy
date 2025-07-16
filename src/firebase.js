import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Read the configuration from your .env file
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');

// Declare variables to hold the Firebase services
let app, db, auth, appId;

// Initialize Firebase only if the config is valid
if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  appId = firebaseConfig.appId || 'default-app-id'; // Get the appId from the config
} else {
  // Log an error if the configuration is missing
  console.error("Firebase config is missing or invalid. Please check your .env file and ensure you have restarted the development server.");
}

// Export the initialized services for use in other components
export { db, auth, appId };