// src/pages/dashboard/trainer/TrainerDashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import StatCard from '../common/StatCard'; // Import the new StatCard component
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Book, PeopleFill, HourglassSplit } from 'react-bootstrap-icons';

const TrainerDashboard = () => {
    const { db, auth } = useFirebase();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ totalStudents: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchTrainerData = async () => {
            if (!auth || !auth.currentUser) {
                setTimeout(fetchTrainerData, 100);
                return;
            }
            
            setLoading(true);
            try {
                const trainerId = auth.currentUser.uid;

                // 1. Fetch courses created by this trainer
                const coursesRef = collection(db, "courses");
                const q = query(coursesRef, where("trainerId", "==", trainerId), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const trainerCourses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(trainerCourses);

                // 2. Fetch all enrollments to calculate total students (for simplicity)
                // In a larger app, you might only fetch students for this trainer's courses.
                const freeEnrollmentsRef = collection(db, "freeEnrollments");
                const certEnrollmentsRef = collection(db, "certificateEnrollments");
                const [freeSnapshot, certSnapshot] = await Promise.all([
                    getDocs(freeEnrollmentsRef),
                    getDocs(certEnrollmentsRef)
                ]);
                const totalStudents = freeSnapshot.size + certSnapshot.size;
                setStats({ totalStudents });

            } catch (error) {
                console.error("Error fetching trainer data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainerData();
    }, [auth, db]);

    return (
        <DashboardLayout>
            <Helmet>
                <title>Trainer Dashboard | Taxly Academy</title>
            </Helmet>

            <div className="dashboard-page-content">
                {/* --- Stats Section --- */}
                <div className="row mb-4">
                    <div className="col-md-6 col-lg-4 mb-4">
                        <StatCard 
                            icon={<Book size={24} />}
                            title="My Courses"
                            value={courses.length}
                            loading={loading}
                        />
                    </div>
                     <div className="col-md-6 col-lg-4 mb-4">
                        <StatCard 
                            icon={<PeopleFill size={24} />}
                            title="Total Students"
                            value={stats.totalStudents}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* --- My Courses List Section --- */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">My Created Courses</h3>
                     <Link to="/dashboard/create-course" className="btn btn-primary">Create New Course</Link>
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
                                            <th>Price (NGN)</th>
                                            <th>Duration</th>
                                            <th>Date Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(course => (
                                            <tr key={course.id}>
                                                <td className="fw-bold">{course.title}</td>
                                                <td>₦{course.price.toLocaleString()}</td>
                                                <td>{course.duration}</td>
                                                <td className="text-muted">
                                                    {course.createdAt ? new Date(course.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
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
                        <p className="text-muted">Click the button below to create your first course and start sharing your knowledge.</p>
                        <Link to="/dashboard/create-course" className="btn btn-primary mt-3">
                            Create Your First Course
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default TrainerDashboard;
