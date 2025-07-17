// src/pages/dashboard/trainer/ClassroomManager.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { People, HourglassSplit, CheckCircleFill } from 'react-bootstrap-icons';

const ClassroomManager = () => {
    const { courseId } = useParams();
    const { db, auth, appId } = useFirebase();

    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClassroomData = useCallback(async () => {
        if (!auth || !auth.currentUser || !db) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Course Details
            const courseDocRef = doc(db, "courses", courseId);
            const courseSnap = await getDoc(courseDocRef);
            if (!courseSnap.exists()) {
                throw new Error("Course not found.");
            }
            const courseData = courseSnap.data();
            setCourse(courseData);

            // 2. Fetch all enrollments for this specific course
            const freeEnrollmentsRef = collection(db, "freeEnrollments");
            const certEnrollmentsRef = collection(db, "certificateEnrollments");

            const qFree = query(freeEnrollmentsRef, where("courseId", "==", courseData.id));
            const qCert = query(certEnrollmentsRef, where("courseId", "==", courseData.id));

            const [freeSnapshot, certSnapshot] = await Promise.all([
                getDocs(qFree),
                getDocs(qCert)
            ]);

            const freeStudents = freeSnapshot.docs.map(doc => ({ ...doc.data(), enrollmentType: 'Free' }));
            const certStudents = certSnapshot.docs.map(doc => ({ ...doc.data(), enrollmentType: 'Certificate' }));

            const allStudents = [...freeStudents, ...certStudents];

            // 3. For each student, fetch their progress
            const studentProgressPromises = allStudents.map(async (student) => {
                const progressDocRef = doc(db, `artifacts/${appId}/users/${student.userId}/courseProgress`, courseData.id);
                const progressSnap = await getDoc(progressDocRef);
                const completedLessons = progressSnap.exists() ? progressSnap.data().completedLessons || [] : [];
                return {
                    ...student,
                    progress: Math.round((completedLessons.length / courseData.curriculum.length) * 100),
                    completedCount: completedLessons.length
                };
            });

            const studentsWithProgress = await Promise.all(studentProgressPromises);
            setStudents(studentsWithProgress);

        } catch (err) {
            console.error("Error fetching classroom data:", err);
            setError("Failed to load classroom data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [auth, db, courseId, appId]);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        fetchClassroomData();
    }, [fetchClassroomData]);

    if (loading) {
        return <DashboardLayout><div className="text-center py-5"><HourglassSplit size={40} className="text-primary" /><p className="mt-2 text-muted">Loading Classroom...</p></div></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div className="alert alert-danger">{error}</div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <Helmet>
                <title>Classroom Manager | {course?.title}</title>
            </Helmet>

            <div className="dashboard-page-content">
                <div className="mb-4">
                    <p className="text-muted mb-0">Classroom Manager</p>
                    <h3 className="fw-bold">{course.title}</h3>
                </div>

                {students.length > 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Enrolled Students ({students.length})</h5>
                            {/* Future feature: Button to send announcement */}
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Student Name</th>
                                            <th>Email</th>
                                            <th>Enrollment Type</th>
                                            <th>Progress</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr key={index}>
                                                <td className="fw-bold">{student.fullName}</td>
                                                <td>{student.email}</td>
                                                <td>
                                                    <span className={`badge ${student.enrollmentType === 'Certificate' ? 'bg-success-subtle text-success-emphasis' : 'bg-info-subtle text-info-emphasis'}`}>
                                                        {student.enrollmentType}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="progress" style={{ height: '20px' }}>
                                                        <div 
                                                            className="progress-bar" 
                                                            role="progressbar" 
                                                            style={{ width: `${student.progress}%` }} 
                                                            aria-valuenow={student.progress} 
                                                            aria-valuemin="0" 
                                                            aria-valuemax="100"
                                                        >
                                                            {student.progress}%
                                                        </div>
                                                    </div>
                                                    <small className="text-muted">{student.completedCount} of {course.curriculum.length} lessons complete</small>
                                                </td>
                                                <td>
                                                    {/* Future feature: Link to view student's submissions */}
                                                    <button className="btn btn-sm btn-outline-secondary">View Details</button>
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
                        <People size={50} className="text-muted mb-3" />
                        <h4 className="fw-bold">No Students Have Enrolled in this Course Yet</h4>
                        <p className="text-muted">Once students enroll, you can track their progress and manage your classroom here.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ClassroomManager;
