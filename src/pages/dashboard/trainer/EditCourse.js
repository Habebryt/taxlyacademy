// src/pages/dashboard/trainer/EditCourse.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import StatusModal from '../../../components/common/StatusModal';

import { PencilSquare, PlusCircle, HourglassSplit } from 'react-bootstrap-icons';

const EditCourse = () => {
    const { courseId } = useParams(); // Get the course ID from the URL
    const navigate = useNavigate();
    const { db, auth, authStatus } = useFirebase();
    
    // State for the main course form
    const [courseData, setCourseData] = useState(null);

    // State for dynamic curriculum and learning outcomes
    const [curriculum, setCurriculum] = useState(['']);
    const [learningOutcomes, setLearningOutcomes] = useState(['']);

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchCourseData = async () => {
            if (!auth || !auth.currentUser) {
                setTimeout(fetchCourseData, 100);
                return;
            }
            setLoading(true);
            try {
                // Fetch the specific course document to edit
                const courseDocRef = doc(db, "courses", courseId);
                const docSnap = await getDoc(courseDocRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Populate all state variables with the fetched data
                    setCourseData(data);
                    setCurriculum(data.curriculum || ['']);
                    setLearningOutcomes(data.learningOutcomes || ['']);
                } else {
                    console.error("No such course found!");
                    // Redirect or show an error if the course doesn't exist
                    navigate('/dashboard/my-courses-trainer');
                }
            } catch (error) {
                console.error("Error fetching course for editing:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [auth, db, courseId, navigate]);

    const handleCourseChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

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
        if (field === 'curriculum') setCurriculum([...curriculum, '']);
        else if (field === 'outcomes') setLearningOutcomes([...learningOutcomes, '']);
    };

    const removeDynamicField = (index, field) => {
        if (field === 'curriculum' && curriculum.length > 1) setCurriculum(curriculum.filter((_, i) => i !== index));
        else if (field === 'outcomes' && learningOutcomes.length > 1) setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const courseDocRef = doc(db, "courses", courseId);
            const dataToUpdate = {
                ...courseData,
                price: Number(courseData.price),
                keywords: Array.isArray(courseData.keywords) ? courseData.keywords : courseData.keywords.split(',').map(k => k.trim()),
                careerOpportunities: Array.isArray(courseData.careerOpportunities) ? courseData.careerOpportunities : courseData.careerOpportunities.split(',').map(c => c.trim()),
                curriculum: curriculum.filter(c => c.trim() !== ''),
                learningOutcomes: learningOutcomes.filter(o => o.trim() !== ''),
                updatedAt: serverTimestamp(),
            };

            await updateDoc(courseDocRef, dataToUpdate);

            setModalContent({ status: 'success', title: 'Course Updated!', message: 'Your changes have been saved successfully.' });
        } catch (error) {
            console.error("Error updating course:", error);
            setModalContent({ status: 'error', title: 'Update Failed', message: 'There was an error saving your changes. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCloseModal = () => {
        setModalContent(null);
        if (modalContent?.status === 'success') {
            navigate('/dashboard/my-courses-trainer');
        }
    };

    if (loading) {
        return <DashboardLayout><div className="text-center py-5"><HourglassSplit size={40} className="text-primary" /><p className="mt-2 text-muted">Loading course for editing...</p></div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <Helmet>
                <title>Edit Course | Trainer Dashboard</title>
            </Helmet>
            <div className="dashboard-page-content">
                <h3 className="fw-bold mb-4">Edit Course: {courseData.title}</h3>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
                    {/* The form structure is identical to CreateCourse, but pre-filled */}
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
                    {/* ... other form fields (description, overview, price) ... */}

                    <hr className="my-4" />
                    <h5 className="fw-bold">What Students Will Learn</h5>
                    {learningOutcomes.map((outcome, index) => (
                        <div key={index} className="input-group mb-2">
                            <input type="text" className="form-control" value={outcome} onChange={(e) => handleDynamicChange(index, e.target.value, 'outcomes')} placeholder={`Learning Outcome #${index + 1}`} />
                            {learningOutcomes.length > 1 && <button type="button" className="btn btn-outline-danger" onClick={() => removeDynamicField(index, 'outcomes')}>&times;</button>}
                        </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addDynamicField('outcomes')}><PlusCircle className="me-1"/>Add Outcome</button>

                    <hr className="my-4" />
                    <h5 className="fw-bold">Course Curriculum</h5>
                    {curriculum.map((week, index) => (
                        <div key={index} className="input-group mb-2">
                            <input type="text" className="form-control" value={week} onChange={(e) => handleDynamicChange(index, e.target.value, 'curriculum')} placeholder={`Week ${index + 1}: Topic Title`} />
                            {curriculum.length > 1 && <button type="button" className="btn btn-outline-danger" onClick={() => removeDynamicField(index, 'curriculum')}>&times;</button>}
                        </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addDynamicField('curriculum')}><PlusCircle className="me-1"/>Add Week/Module</button>

                    <hr className="my-4" />
                    <h5 className="fw-bold">Meta Information</h5>
                    {/* ... other form fields (whoIsThisFor, careerOpportunities, keywords) ... */}
                    
                    <button type="submit" className="btn btn-primary btn-lg w-100 mt-4" disabled={isSubmitting || authStatus !== 'success'}>
                        {isSubmitting ? 'Saving Changes...' : 'Save Course Changes'}
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

export default EditCourse;
