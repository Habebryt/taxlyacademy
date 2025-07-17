import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, signInWithCustomToken } from "firebase/auth";

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState('pending');
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [appId, setAppId] = useState(null);

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

          
          // eslint-disable-next-line no-undef
          const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

          
          if (token && typeof token === 'string' && token.split('.').length === 3) {
           
            await signInWithCustomToken(firebaseAuth, token);
          } else {
            
            await signInAnonymously(firebaseAuth);
          }
        
          
          setAuthStatus('success');
        } else {
          throw new Error("Firebase config is missing.");
        }
      } catch (error) {
       
        setAuthStatus('failed');
      }
    };

    initializeAndAuth();
  }, []);

  
  const value = { db, auth, appId, authStatus };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};