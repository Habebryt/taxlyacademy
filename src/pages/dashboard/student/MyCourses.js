// src/pages/dashboard/student/MyCourses.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import the main dashboard layout and other necessary components
import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext'; // Use the central Firebase context
import { collection, query, where, getDocs } from "firebase/firestore";
import { Mortarboard, HourglassSplit, ArrowRight } from 'react-bootstrap-icons';

// A reusable card component to display an enrolled course
const EnrolledCourseCard = ({ course }) => (
    <div className="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
        <div className="card h-100 shadow-sm">
            {/* In a real app, you would have course-specific images */}
            <img src={`/images/course-placeholder.jpg`} className="card-img-top" alt={course.courseTitle} />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{course.courseTitle}</h5>
                <p className={`badge ${course.enrollmentType === 'Certificate' ? 'bg-success' : 'bg-info'}`}>
                    {course.enrollmentType === 'Certificate' ? 'Certificate Track' : 'Free Enrollment'}
                </p>
                <p className="card-text small text-muted">Enrolled on: {new Date(course.enrolledAt.seconds * 1000).toLocaleDateString()}</p>
                {/* --- FIX: Link to the course player using the Firestore ID --- */}
                <Link to={`/courses/${course.firestoreId}/learn`} className="btn btn-primary mt-auto">
                    Start Learning <ArrowRight className="ms-1" />
                </Link>
            </div>
        </div>
    </div>
);


const MyCourses = () => {
    // --- FIX: Get authStatus to manage loading state correctly ---
    const { db, auth, authStatus } = useFirebase();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchEnrolledCourses = async () => {
            // --- FIX: Only proceed if authentication is successful ---
            if (authStatus !== 'success' || !auth.currentUser) {
                // If auth is still pending, we wait. If it fails, we stop.
                if(authStatus === 'pending') {
                    setTimeout(fetchEnrolledCourses, 200); // Check again shortly
                } else {
                    setLoading(false); // Stop loading if auth fails or user is logged out
                }
                return;
            }
            
            setLoading(true);
            try {
                const userId = auth.currentUser.uid;

                // Create queries for both free and paid enrollments for the current user
                const freeQuery = query(collection(db, "freeEnrollments"), where("userId", "==", userId));
                const certQuery = query(collection(db, "certificateEnrollments"), where("userId", "==", userId));

                // Fetch documents from both collections
                const [freeSnapshot, certSnapshot] = await Promise.all([
                    getDocs(freeQuery),
                    getDocs(certQuery)
                ]);

                const freeCourses = freeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), enrollmentType: 'Free' }));
                const certCourses = certSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), enrollmentType: 'Certificate' }));

                // Combine and de-duplicate the courses
                const allCoursesMap = new Map();
                freeCourses.forEach(course => allCoursesMap.set(course.courseId, course));
                certCourses.forEach(course => allCoursesMap.set(course.courseId, course));

                // --- NEW: Fetch the firestoreId for each enrolled course ---
                const coursesWithFirestoreId = await Promise.all(
                    Array.from(allCoursesMap.values()).map(async (enrollment) => {
                        const courseQuery = query(collection(db, "courses"), where("id", "==", enrollment.courseId));
                        const courseSnapshot = await getDocs(courseQuery);
                        const firestoreId = !courseSnapshot.empty ? courseSnapshot.docs[0].id : null;
                        return { ...enrollment, firestoreId };
                    })
                );

                setEnrolledCourses(coursesWithFirestoreId);

            } catch (error) {
                console.error("Error fetching enrolled courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [authStatus, auth, db]); // Depend on authStatus

    return (
        <DashboardLayout>
            <Helmet>
                <title>My Courses | Taxly Academy Dashboard</title>
            </Helmet>

            <div className="dashboard-page-content">
                <h3 className="fw-bold mb-4">My Enrolled Courses</h3>

                {loading ? (
                    <div className="text-center py-5">
                        <HourglassSplit size={40} className="text-primary" />
                        <p className="mt-2 text-muted">Loading your courses...</p>
                    </div>
                ) : enrolledCourses.length > 0 ? (
                    <div className="row">
                        {enrolledCourses.map(course => (
                            <EnrolledCourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 border bg-light rounded">
                        <Mortarboard size={50} className="text-muted mb-3" />
                        <h4 className="fw-bold">You haven't enrolled in any courses yet.</h4>
                        <p className="text-muted">Start your learning journey by exploring our course catalog.</p>
                        <Link to="/courses" className="btn btn-primary mt-3">
                            Explore Courses
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyCourses;
