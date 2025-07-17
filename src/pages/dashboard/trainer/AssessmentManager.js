// src/pages/dashboard/trainer/AssessmentManager.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, getDocs, query, orderBy, where, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { HourglassSplit, Check2Square, Person, JournalCheck } from 'react-bootstrap-icons';
import StatusModal from '../../../components/common/StatusModal';

// --- NEW: A modal for viewing and grading a submission ---
const GradingModal = ({ isOpen, onClose, submission, onGradeSubmit, isSubmitting }) => {
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (submission) {
            setGrade(submission.grade || '');
            setFeedback(submission.feedback || '');
        }
    }, [submission]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onGradeSubmit(submission.id, { grade, feedback });
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">Grade Submission</h5>
                                <button type="button" className="btn-close" onClick={onClose}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Student:</strong> {submission.studentName}</p>
                                <p><strong>Assignment:</strong> {submission.assignmentTitle}</p>
                                <p><strong>Submission:</strong> <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer">View Submission</a></p>
                                <hr/>
                                <div className="mb-3">
                                    <label htmlFor="grade" className="form-label">Grade (e.g., 85/100, Pass)</label>
                                    <input type="text" id="grade" className="form-control" value={grade} onChange={(e) => setGrade(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="feedback" className="form-label">Feedback</label>
                                    <textarea id="feedback" className="form-control" rows="4" value={feedback} onChange={(e) => setFeedback(e.target.value)} required></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Submit Grade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};


const AssessmentManager = () => {
    const { courseId } = useParams();
    const { db, auth } = useFirebase();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const fetchSubmissions = useCallback(async () => {
        if (!auth || !auth.currentUser || !db) return;
        setLoading(true);
        setError(null);
        try {
            // This assumes submissions are stored in a top-level collection.
            // A more scalable approach might be a subcollection under each course.
            const submissionsRef = collection(db, "assignmentSubmissions");
            const q = query(submissionsRef, where("courseId", "==", courseId), orderBy("submittedAt", "desc"));
            const querySnapshot = await getDocs(q);
            const allSubmissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubmissions(allSubmissions);
        } catch (err) {
            console.error("Error fetching submissions:", err);
            setError("Failed to load student submissions.");
        } finally {
            setLoading(false);
        }
    }, [auth, db, courseId]);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        fetchSubmissions();
    }, [fetchSubmissions]);

    const handleGradeSubmit = async (submissionId, gradeData) => {
        setIsSubmitting(true);
        const submissionDocRef = doc(db, "assignmentSubmissions", submissionId);
        try {
            await updateDoc(submissionDocRef, {
                ...gradeData,
                status: 'Graded',
                gradedAt: serverTimestamp(),
            });
            setSelectedSubmission(null);
            fetchSubmissions(); // Refresh the list
            setModalContent({ status: 'success', title: 'Grade Submitted!', message: 'The student has been notified of their grade and feedback.' });
        } catch (error) {
            console.error("Error updating submission:", error);
            setModalContent({ status: 'error', title: 'Update Failed', message: 'There was an error saving the grade.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <Helmet>
                <title>Assessment Manager | Trainer Dashboard</title>
            </Helmet>

            <div className="dashboard-page-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <p className="text-muted mb-0">Classroom Tools</p>
                        <h3 className="fw-bold">Assessment Manager</h3>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5"><HourglassSplit size={40} className="text-primary" /><p className="mt-2 text-muted">Loading submissions...</p></div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : submissions.length > 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Assignment</th>
                                            <th>Submitted At</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map(sub => (
                                            <tr key={sub.id}>
                                                <td className="fw-bold">{sub.studentName || 'N/A'}</td>
                                                <td>{sub.assignmentTitle || 'Assignment'}</td>
                                                <td className="text-muted">{sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                                                <td>
                                                    <span className={`badge ${sub.status === 'Graded' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {sub.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary" onClick={() => setSelectedSubmission(sub)}>
                                                        View & Grade
                                                    </button>
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
                        <JournalCheck size={50} className="text-muted mb-3" />
                        <h4 className="fw-bold">No Submissions Yet</h4>
                        <p className="text-muted">When students submit assignments for this course, they will appear here for you to review and grade.</p>
                    </div>
                )}
            </div>

            <GradingModal 
                isOpen={!!selectedSubmission}
                onClose={() => setSelectedSubmission(null)}
                submission={selectedSubmission}
                onSave={handleGradeSubmit}
                isSubmitting={isSubmitting}
            />

            {modalContent && (
                <>
                    <StatusModal status={modalContent.status} title={modalContent.title} message={modalContent.message} onClose={() => setModalContent(null)} />
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </DashboardLayout>
    );
};

export default AssessmentManager;
