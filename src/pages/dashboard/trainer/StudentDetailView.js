// src/pages/dashboard/trainer/StudentDetailView.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { PersonCircle, Mortarboard, JournalCheck, CheckCircleFill, XCircle, HourglassSplit } from 'react-bootstrap-icons';

const StudentDetailView = () => {
    const { courseId, userId } = useParams(); // Get both IDs from the URL
    const { db, auth, appId } = useFirebase();

    const [student, setStudent] = useState(null);
    const [course, setCourse] = useState(null);
    const [progress, setProgress] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!auth || !auth.currentUser || !db) return;
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Student Profile
            const userDocRef = doc(db, "users", userId);
            const userSnap = await getDoc(userDocRef);
            if (!userSnap.exists()) throw new Error("Student profile not found.");
            setStudent(userSnap.data());

            // 2. Fetch Course Details
            const coursesRef = collection(db, "courses");
            const qCourse = query(coursesRef, where("id", "==", courseId));
            const courseSnap = await getDocs(qCourse);
            if (courseSnap.empty) throw new Error("Course not found.");
            setCourse(courseSnap.docs[0].data());

            // 3. Fetch Student's Progress in this Course
            const progressDocRef = doc(db, `artifacts/${appId}/users/${userId}/courseProgress`, courseId);
            const progressSnap = await getDoc(progressDocRef);
            setProgress(progressSnap.exists() ? progressSnap.data() : { completedLessons: [] });

            // 4. Fetch Student's Submissions for this Course
            const submissionsRef = collection(db, "assignmentSubmissions");
            const qSubmissions = query(submissionsRef, where("userId", "==", userId), where("courseId", "==", courseId));
            const submissionsSnap = await getDocs(qSubmissions);
            setSubmissions(submissionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        } catch (err) {
            console.error("Error fetching student detail data:", err);
            setError("Failed to load student data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [auth, db, courseId, userId, appId]);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <DashboardLayout><div className="text-center py-5"><HourglassSplit size={40} className="text-primary" /><p className="mt-2 text-muted">Loading Student Details...</p></div></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div className="alert alert-danger">{error}</div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <Helmet>
                <title>Student Details | {student?.fullName}</title>
            </Helmet>

            <div className="dashboard-page-content">
                <div className="d-flex align-items-center mb-4">
                    <PersonCircle size={60} className="text-muted me-3" />
                    <div>
                        <h3 className="fw-bold mb-0">{student.fullName}</h3>
                        <p className="text-muted mb-0">Progress for: <strong>{course.title}</strong></p>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Column: Progress */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Course Progress</h5>
                                <span className="fw-bold">{Math.round(((progress?.completedLessons?.length || 0) / course.curriculum.length) * 100)}% Complete</span>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    {course.curriculum.map((lesson, index) => {
                                        const isCompleted = progress.completedLessons.includes(index);
                                        return (
                                            <li key={index} className="list-group-item d-flex align-items-center">
                                                {isCompleted ? <CheckCircleFill className="text-success me-2" /> : <XCircle className="text-muted me-2" />}
                                                {`Module ${index + 1}: ${lesson}`}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Submissions */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm h-100">
                            <div className="card-header">
                                <h5 className="mb-0">Assignment Submissions</h5>
                            </div>
                            <div className="card-body">
                                {submissions.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <tbody>
                                                {submissions.map(sub => (
                                                    <tr key={sub.id}>
                                                        <td>{sub.assignmentTitle}</td>
                                                        <td>
                                                            <span className={`badge ${sub.status === 'Graded' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                                {sub.status || 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <Link to={`/dashboard/assessment-manager/${courseId}`} className="btn btn-sm btn-outline-primary">
                                                                Grade
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted">No assignments submitted for this course yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDetailView;
