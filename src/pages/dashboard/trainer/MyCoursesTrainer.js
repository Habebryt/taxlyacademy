// src/pages/dashboard/trainer/MyCoursesTrainer.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Book, HourglassSplit, PlusCircle, PencilSquare, People } from 'react-bootstrap-icons';

const MyCoursesTrainer = () => {
    const { db, auth, appId } = useFirebase(); // Get appId from context
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchTrainerCourses = async () => {
            if (!auth || !auth.currentUser) {
                // Wait for authentication to be ready
                setTimeout(fetchTrainerCourses, 100);
                return;
            }
            
            setLoading(true);
            try {
                const trainerId = auth.currentUser.uid;
                // --- FIX: Use the correct, structured path to fetch courses ---
                const coursesRef = collection(db, `courses`);
                
                const q = query(coursesRef, where("trainerId", "==", trainerId), orderBy("createdAt", "desc"));

                const querySnapshot = await getDocs(q);
                // The document ID is needed for the edit link, so we save it.
                const trainerCourses = querySnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
                setCourses(trainerCourses);

            } catch (error) {
                console.error("Error fetching trainer courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainerCourses();
    }, [auth, db, appId]);

    return (
        <DashboardLayout>
            <Helmet>
                <title>My Courses | Trainer Dashboard</title>
            </Helmet>

            <div className="dashboard-page-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">My Courses</h3>
                    <Link to="/dashboard/create-course" className="btn btn-primary d-flex align-items-center">
                        <PlusCircle className="me-2" /> Create New Course
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <HourglassSplit size={40} className="text-primary" />
                        <p className="mt-2 text-muted">Loading your courses...</p>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Course Title</th>
                                            <th>Price (Base)</th>
                                            <th>Duration</th>
                                            <th>Date Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(course => (
                                            <tr key={course.firestoreId}>
                                                <td className="fw-bold">{course.title}</td>
                                                <td>₦{course.price.toLocaleString()}</td>
                                                <td>{course.duration}</td>
                                                <td className="text-muted">
                                                    {course.createdAt ? new Date(course.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td>
                                                    {/* --- FIX: Use the Firestore document ID for the edit link --- */}
                                                    <Link to={`/dashboard/edit-course/${course.firestoreId}`} className="btn btn-sm btn-outline-secondary me-2" title="Edit Course Details">
                                                        <PencilSquare />
                                                    </Link>
                                                    {/* --- FIX: Use the course's URL-friendly ID for the classroom link --- */}
                                                    <Link to={`/dashboard/classroom-manager/${course.id}`} className="btn btn-sm btn-outline-info" title="View Students & Submissions">
                                                        <People />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-5 border bg-light rounded">
                        <Book size={50} className="text-muted mb-3" />
                        <h4 className="fw-bold">You haven't created any courses yet.</h4>
                        <p className="text-muted">Click the button above to create your first course and start sharing your knowledge.</p>
                        <Link to="/dashboard/create-course" className="btn btn-primary mt-3">
                            Create Your First Course
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyCoursesTrainer;
