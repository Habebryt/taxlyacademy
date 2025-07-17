// src/pages/dashboard/student/SubmitAssignment.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import StatusModal from '../../../components/common/StatusModal';
import { CloudArrowUp, HourglassSplit } from 'react-bootstrap-icons';

const SubmitAssignment = () => {
    const { courseId, lessonIndex } = useParams();
    const { db, auth, appId } = useFirebase();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [formData, setFormData] = useState({ submissionLink: '', comments: '' });
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchCourseInfo = async () => {
            if (!db) return;
            setLoading(true);
            try {
                const coursesRef = collection(db, "courses");
                const q = query(coursesRef, where("id", "==", courseId));
                const courseSnapshot = await getDocs(q);
                if (!courseSnapshot.empty) {
                    setCourse(courseSnapshot.docs[0].data());
                } else {
                    console.error("Course not found");
                }
            } catch (error) {
                console.error("Error fetching course info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseInfo();
    }, [db, courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!db || !auth.currentUser) {
            alert("You must be logged in to submit an assignment.");
            return;
        }
        setIsSubmitting(true);
        try {
            const userId = auth.currentUser.uid;
            const submissionsRef = collection(db, "assignmentSubmissions");

            await addDoc(submissionsRef, {
                userId,
                studentName: auth.currentUser.displayName || "Anonymous Student",
                courseId: courseId,
                courseTitle: course.title,
                lessonIndex: parseInt(lessonIndex),
                assignmentTitle: course.curriculum[lessonIndex],
                submissionLink: formData.submissionLink,
                studentComments: formData.comments,
                status: 'Pending',
                submittedAt: serverTimestamp(),
            });

            setModalContent({ status: 'success', title: 'Assignment Submitted!', message: 'Your work has been sent to the trainer for review.' });
        } catch (error) {
            console.error("Error submitting assignment:", error);
            setModalContent({ status: 'error', title: 'Submission Failed', message: 'There was an error submitting your assignment. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setModalContent(null);
        // Redirect back to the course player after successful submission
        if (modalContent?.status === 'success') {
            navigate(`/courses/${courseId}/learn`);
        }
    };

    if (loading) {
        return <DashboardLayout><div className="text-center py-5"><HourglassSplit size={40} className="text-primary" /><p className="mt-2 text-muted">Loading Assignment...</p></div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <Helmet>
                <title>Submit Assignment | {course?.title}</title>
            </Helmet>
            <div className="dashboard-page-content">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="text-center mb-4">
                            <p className="text-muted mb-0">Submitting assignment for:</p>
                            <h3 className="fw-bold">{course?.title}</h3>
                            <h5 className="text-primary">{`Module ${parseInt(lessonIndex) + 1}: ${course?.curriculum[lessonIndex]}`}</h5>
                        </div>
                        <div className="card shadow-sm">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="submissionLink" className="form-label">Link to Your Work</label>
                                        <input 
                                            type="url" 
                                            id="submissionLink" 
                                            name="submissionLink" 
                                            className="form-control" 
                                            value={formData.submissionLink} 
                                            onChange={handleChange}
                                            placeholder="e.g., Google Docs, GitHub, Figma link" 
                                            required 
                                            disabled={isSubmitting}
                                        />
                                        <div className="form-text">Please ensure your link is publicly accessible or shared with your trainer.</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="comments" className="form-label">Comments for Your Trainer (Optional)</label>
                                        <textarea 
                                            id="comments" 
                                            name="comments" 
                                            className="form-control" 
                                            rows="4" 
                                            value={formData.comments} 
                                            onChange={handleChange}
                                            placeholder="Is there anything specific you want your trainer to look at?"
                                            disabled={isSubmitting}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit Assignment for Review'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modalContent && (
                <>
                    <StatusModal status={modalContent.status} title={modalContent.title} message={modalContent.message} onClose={handleCloseModal} />
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </DashboardLayout>
    );
};

export default SubmitAssignment;
