// src/pages/dashboard/trainer/CreateCourse.js

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import StatusModal from '../../../components/common/StatusModal'; // Assuming this component exists

import { Book, PlusCircle, CloudArrowUp } from 'react-bootstrap-icons';

const CreateCourse = () => {
    const { db, auth, appId, authStatus } = useFirebase();
    
    // State for the main course form
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        overview: '',
        duration: '',
        price: 0,
        keywords: '',
        whoIsThisFor: '',
        careerOpportunities: '',
    });

    // State for dynamic curriculum and learning outcomes
    const [curriculum, setCurriculum] = useState(['']);
    const [learningOutcomes, setLearningOutcomes] = useState(['']);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const handleCourseChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

    // --- Handlers for dynamic fields ---
    const handleDynamicChange = (index, value, field) => {
        if (field === 'curriculum') {
            const newCurriculum = [...curriculum];
            newCurriculum[index] = value;
            setCurriculum(newCurriculum);
        } else if (field === 'outcomes') {
            const newOutcomes = [...learningOutcomes];
            newOutcomes[index] = value;
            setLearningOutcomes(newOutcomes);
        }
    };

    const addDynamicField = (field) => {
        if (field === 'curriculum') {
            setCurriculum([...curriculum, '']);
        } else if (field === 'outcomes') {
            setLearningOutcomes([...learningOutcomes, '']);
        }
    };

    const removeDynamicField = (index, field) => {
        if (field === 'curriculum' && curriculum.length > 1) {
            setCurriculum(curriculum.filter((_, i) => i !== index));
        } else if (field === 'outcomes' && learningOutcomes.length > 1) {
            setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (authStatus !== 'success' || !db || !auth.currentUser) {
            setModalContent({ status: 'error', title: 'Submission Failed', message: 'Could not connect to the database. Please refresh and try again.' });
            return;
        }
        setIsSubmitting(true);

        try {
            const trainerId = auth.currentUser.uid;
            const coursesCollectionRef = collection(db, "courses"); // Saving to a top-level 'courses' collection

            const dataToSubmit = {
                ...courseData,
                price: Number(courseData.price), // Ensure price is a number
                keywords: courseData.keywords.split(',').map(k => k.trim()),
                careerOpportunities: courseData.careerOpportunities.split(',').map(c => c.trim()),
                curriculum: curriculum.filter(c => c.trim() !== ''),
                learningOutcomes: learningOutcomes.filter(o => o.trim() !== ''),
                trainerId,
                createdAt: serverTimestamp(),
            };

            await addDoc(coursesCollectionRef, dataToSubmit);

            setModalContent({ status: 'success', title: 'Course Created!', message: 'Your new course has been successfully saved to the database.' });
            // Reset form (optional)
            
        } catch (error) {
            console.error("Error creating course:", error);
            setModalContent({ status: 'error', title: 'Creation Failed', message: 'There was an error saving your course. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCloseModal = () => {
        setModalContent(null);
    };

    return (
        <DashboardLayout>
            <Helmet>
                <title>Create New Course | Trainer Dashboard</title>
            </Helmet>
            <div className="dashboard-page-content">
                <h3 className="fw-bold mb-4">Create a New Course</h3>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
                    {/* Basic Course Info */}
                    <div className="row">
                        <div className="col-md-8 mb-3">
                            <label htmlFor="title" className="form-label">Course Title</label>
                            <input type="text" id="title" name="title" className="form-control" value={courseData.title} onChange={handleCourseChange} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="duration" className="form-label">Duration (e.g., 6 Weeks)</label>
                            <input type="text" id="duration" name="duration" className="form-control" value={courseData.duration} onChange={handleCourseChange} required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Short Description (for course cards)</label>
                        <textarea id="description" name="description" className="form-control" value={courseData.description} onChange={handleCourseChange} rows="2" required></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="overview" className="form-label">Full Overview (for details page)</label>
                        <textarea id="overview" name="overview" className="form-control" value={courseData.overview} onChange={handleCourseChange} rows="4" required></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Base Price (NGN) - Certificate fee will be 10% of this</label>
                        <input type="number" id="price" name="price" className="form-control" value={courseData.price} onChange={handleCourseChange} required />
                    </div>

                    <hr className="my-4" />

                    {/* Learning Outcomes */}
                    <h5 className="fw-bold">What Students Will Learn</h5>
                    {learningOutcomes.map((outcome, index) => (
                        <div key={index} className="input-group mb-2">
                            <input type="text" className="form-control" value={outcome} onChange={(e) => handleDynamicChange(index, e.target.value, 'outcomes')} placeholder={`Learning Outcome #${index + 1}`} />
                            {learningOutcomes.length > 1 && <button type="button" className="btn btn-outline-danger" onClick={() => removeDynamicField(index, 'outcomes')}>&times;</button>}
                        </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addDynamicField('outcomes')}><PlusCircle className="me-1"/>Add Outcome</button>

                    <hr className="my-4" />

                    {/* Curriculum */}
                    <h5 className="fw-bold">Course Curriculum</h5>
                    {curriculum.map((week, index) => (
                        <div key={index} className="input-group mb-2">
                            <input type="text" className="form-control" value={week} onChange={(e) => handleDynamicChange(index, e.target.value, 'curriculum')} placeholder={`Week ${index + 1}: Topic Title`} />
                            {curriculum.length > 1 && <button type="button" className="btn btn-outline-danger" onClick={() => removeDynamicField(index, 'curriculum')}>&times;</button>}
                        </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addDynamicField('curriculum')}><PlusCircle className="me-1"/>Add Week/Module</button>

                    <hr className="my-4" />

                    {/* Meta Information */}
                    <h5 className="fw-bold">Meta Information</h5>
                     <div className="mb-3">
                        <label htmlFor="whoIsThisFor" className="form-label">Who is this course for?</label>
                        <textarea id="whoIsThisFor" name="whoIsThisFor" className="form-control" value={courseData.whoIsThisFor} onChange={handleCourseChange} rows="2" required></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="careerOpportunities" className="form-label">Career Opportunities (comma-separated)</label>
                        <input type="text" id="careerOpportunities" name="careerOpportunities" className="form-control" value={courseData.careerOpportunities} onChange={handleCourseChange} placeholder="e.g., Social Media Manager, Content Strategist" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="keywords" className="form-label">Keywords for AI Matching (comma-separated)</label>
                        <input type="text" id="keywords" name="keywords" className="form-control" value={courseData.keywords} onChange={handleCourseChange} placeholder="e.g., social media, marketing, content" required />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-100 mt-4" disabled={isSubmitting || authStatus !== 'success'}>
                        {isSubmitting ? 'Saving Course...' : 'Create Course'}
                    </button>
                </form>
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

export default CreateCourse;
