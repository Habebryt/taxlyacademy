import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, signInWithCustomToken } from "firebase/auth";

// Create the context
const FirebaseContext = createContext(null);

// Create a custom hook for easy access to the context
export const useFirebase = () => useContext(FirebaseContext);

// The Provider component that will wrap your entire application
export const FirebaseProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState('pending');
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [appId, setAppId] = useState(null);

  useEffect(() => {
    // This effect runs only once when the app loads
    const initializeAndAuth = async () => {
      try {
        const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');
        
        if (firebaseConfig.apiKey) {
          const app = initializeApp(firebaseConfig);
          const firestoreDb = getFirestore(app);
          const firebaseAuth = getAuth(app);
          
          setDb(firestoreDb);
          setAuth(firebaseAuth);
          setAppId(firebaseConfig.appId || 'default-app-id');

          // --- FIX: Add a more robust check for the custom token ---
          // eslint-disable-next-line no-undef
          const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

          // A valid JWT must be a string with three parts separated by dots.
          if (token && typeof token === 'string' && token.split('.').length === 3) {
            console.log("Valid custom token found, attempting to sign in...");
            await signInWithCustomToken(firebaseAuth, token);
          } else {
            console.log("No valid custom token, signing in anonymously...");
            await signInAnonymously(firebaseAuth);
          }
        
          console.log("Firebase connection and authentication successful!");
          setAuthStatus('success');
        } else {
          throw new Error("Firebase config is missing.");
        }
      } catch (error) {
        console.error("Firebase initialization or authentication failed:", error);
        setAuthStatus('failed');
      }
    };

    initializeAndAuth();
  }, []);

  // The value provided to all children components
  const value = { db, auth, appId, authStatus };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};