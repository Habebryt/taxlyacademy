// src/context/CourseContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirebase } from './FirebaseContext'; // We need this to get the database connection
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// 1. Create the context
const CourseContext = createContext(null);

// 2. Create a custom hook for easy access to the course data
export const useCourses = () => useContext(CourseContext);

// 3. Create the Provider component that will fetch and hold the data
export const CourseProvider = ({ children }) => {
  const { db } = useFirebase(); // Get the initialized Firestore instance
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function will run once to fetch all courses from the database
    const fetchCourses = async () => {
      if (!db) {
        // Wait for the database connection to be ready
        setTimeout(fetchCourses, 100);
        return;
      }

      try {
        console.log("Fetching courses from Firestore...");
        const coursesCollectionRef = collection(db, "courses");
        const q = query(coursesCollectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const coursesData = querySnapshot.docs.map(doc => ({
          firestoreId: doc.id, // Keep the unique Firestore ID
          ...doc.data()
        }));
        
        setCourses(coursesData);
        console.log("Successfully fetched and set courses:", coursesData);

      } catch (error) {
        console.error("Error fetching courses from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [db]); // This effect depends on the db connection being ready

  // The value provided to all children components
  const value = { courses, loading };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};
