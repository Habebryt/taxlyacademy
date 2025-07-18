// src/context/FirebaseContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";

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
  // --- NEW: State to hold the current user object ---
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
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

          // --- NEW: onAuthStateChanged listener ---
          // This is the key to maintaining a live session. It runs whenever
          // the user's login state changes (login, logout, or page refresh).
          onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
              // User is signed in.
              setCurrentUser(user);
              setAuthStatus('success');
              console.log("Firebase user is signed in:", user.uid);
            } else {
              // User is signed out.
              setCurrentUser(null);
              setAuthStatus('loggedOut');
              console.log("Firebase user is signed out.");
            }
          });

        } else {
          throw new Error("Firebase config is missing.");
        }
      } catch (error) {
        console.error("Firebase initialization failed:", error);
        setAuthStatus('failed');
      }
    };

    initializeAndAuth();
  }, []); // Empty dependency array ensures this runs only once

  // The value provided to all children components, now including the user
  const value = { db, auth, appId, authStatus, currentUser };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
