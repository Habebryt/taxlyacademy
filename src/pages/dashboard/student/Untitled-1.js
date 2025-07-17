// src/pages/dashboard/student/CoursePlayer.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import the main dashboard layout and other necessary components
import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { getDocs, collection, query, where } from "firebase/firestore";

// Import icons for a more visual layout
import { PlayCircle, CheckCircleFill, LockFill, HourglassSplit } from 'react-bootstrap-icons';

// --- Placeholder for Video Player ---
// In a real app, you would use a library like React Player (for Vimeo/YouTube)
// or a custom player for self-hosted videos.
const VideoPlayer = ({ videoUrl, lessonTitle }) => (
    <div className="video-player-wrapper bg-dark rounded shadow-sm">
        <div className="p-3">
            <h4 className="text-white">{lessonTitle}</h4>
        </div>
        <div className="player-placeholder d-flex align-items-center justify-content-center">
            {/* This is a placeholder icon. You would embed your video component here. */}
            <PlayCircle size={80} className="text-white-50" />
        </div>
        <div className="p-3">
             <p className="text-muted small">Video content for this lesson will be available here.</p>
        </div>
    </div>
);


const CoursePlayer = () => {
    const { id: courseId } = useParams();
    const { db } = useFirebase();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeLesson, setActiveLesson] = useState(0); // Index of the active lesson

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchCourse = async () => {
            if (!db) {
                // Wait for the database connection to be ready
                setTimeout(fetchCourse, 100);
                return;
            }
            setLoading(true);
            try {
                // We fetch the course data from the `courses` collection in Firestore.
                // In a real app with many courses, you might query by a unique course slug.
                // For now, we'll assume the `id` field in our `COURSES` data file matches a field in Firestore.
                const coursesRef = collection(db, "courses");
                const q = query(coursesRef, where("id", "==", courseId));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("Course not found. It may not have been created by a trainer yet.");
                } else {
                    // Assuming the course ID is unique, there should only be one result
                    const courseData = querySnapshot.docs[0].data();
                    setCourse({ firestoreId: querySnapshot.docs[0].id, ...courseData });
                }
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("Failed to load course data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [db, courseId]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="text-center py-5">
                    <HourglassSplit size={40} className="text-primary" />
                    <p className="mt-2 text-muted">Loading your course...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="alert alert-danger">{error}</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Helmet>
                <title>{course.title} | Taxly Academy</title>
            </Helmet>

            <div className="dashboard-page-content">
                <div className="row g-4">
                    {/* Main Content: Video Player */}
                    <div className="col-lg-8">
                        <VideoPlayer lessonTitle={course.curriculum[activeLesson]} />
                        <div className="mt-4 p-4 bg-white rounded shadow-sm">
                            <h3 className="fw-bold">{course.curriculum[activeLesson]}</h3>
                            <p className="text-muted">Welcome to this lesson. Here you will find notes, resources, and assignments related to the video content.</p>
                            {/* In a real app, you would render lesson-specific content here */}
                        </div>
                    </div>

                    {/* Sidebar: Curriculum */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-header fw-bold">{course.title} - Curriculum</div>
                            <ul className="list-group list-group-flush">
                                {course.curriculum.map((lesson, index) => (
                                    <li 
                                        key={index}
                                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${activeLesson === index ? 'active' : ''}`}
                                        onClick={() => setActiveLesson(index)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <div className="fw-bold">{`Module ${index + 1}`}</div>
                                            <span className="small">{lesson}</span>
                                        </div>
                                        {/* In a real app, you would track completion status from the database */}
                                        {index < activeLesson ? <CheckCircleFill className="text-success" /> : <LockFill className="text-muted" />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CoursePlayer;
