// src/pages/dashboard/trainer/MyStudents.js

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { PeopleFill, HourglassSplit } from 'react-bootstrap-icons';

const MyStudents = () => {
    const { db, auth } = useFirebase();
    const [allEnrollments, setAllEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchAllEnrollments = async () => {
            if (!auth || !auth.currentUser) {
                // Wait for authentication to be ready
                setTimeout(fetchAllEnrollments, 100);
                return;
            }
            
            setLoading(true);
            try {
                // In a real app, you might filter this by `trainerId` associated with the course.
                // For now, we will fetch all enrollments for an admin/support view.
                const freeEnrollmentsRef = collection(db, "freeEnrollments");
                const certEnrollmentsRef = collection(db, "certificateEnrollments");

                const [freeSnapshot, certSnapshot] = await Promise.all([
                    getDocs(query(freeEnrollmentsRef, orderBy("enrolledAt", "desc"))),
                    getDocs(query(certEnrollmentsRef, orderBy("enrolledAt", "desc")))
                ]);

                const freeEnrollments = freeSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    enrollmentType: 'Free Access'
                }));

                const certEnrollments = certSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    enrollmentType: 'Certificate'
                }));

                // Combine both lists
                const combinedEnrollments = [...freeEnrollments, ...certEnrollments];

                // Sort the combined list by date
                combinedEnrollments.sort((a, b) => {
                    const dateA = a.enrolledAt?.seconds || 0;
                    const dateB = b.enrolledAt?.seconds || 0;
                    return dateB - dateA;
                });

                setAllEnrollments(combinedEnrollments);

            } catch (error) {
                console.error("Error fetching enrollments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllEnrollments();
    }, [auth, db]);

    return (
        <DashboardLayout>
            <Helmet>
                <title>Student Enrollments | Trainer Dashboard</title>
            </Helmet>

            <div className="dashboard-page-content">
                <h3 className="fw-bold mb-4">Student Enrollments</h3>

                {loading ? (
                    <div className="text-center py-5">
                        <HourglassSplit size={40} className="text-primary" />
                        <p className="mt-2 text-muted">Loading enrollment data...</p>
                    </div>
                ) : allEnrollments.length > 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Student Name</th>
                                            <th>Email</th>
                                            <th>Course Title</th>
                                            <th>Enrollment Type</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allEnrollments.map(enrollment => (
                                            <tr key={enrollment.id}>
                                                <td>{enrollment.fullName}</td>
                                                <td>{enrollment.email}</td>
                                                <td>{enrollment.courseTitle}</td>
                                                <td>
                                                    <span className={`badge ${enrollment.enrollmentType === 'Certificate' ? 'bg-success-subtle text-success-emphasis' : 'bg-info-subtle text-info-emphasis'}`}>
                                                        {enrollment.enrollmentType}
                                                    </span>
                                                </td>
                                                <td className="text-muted">
                                                    {enrollment.enrolledAt ? new Date(enrollment.enrolledAt.seconds * 1000).toLocaleDateString() : 'N/A'}
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
                        <PeopleFill size={50} className="text-muted mb-3" />
                        <h4 className="fw-bold">No Students Have Enrolled Yet</h4>
                        <p className="text-muted">As students enroll in courses, their information will appear here.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyStudents;
