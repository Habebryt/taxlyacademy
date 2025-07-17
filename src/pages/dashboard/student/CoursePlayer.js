// src/pages/dashboard/student/CoursePlayer.js

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { getDoc, getDocs, collection, query, where, doc, setDoc, addDoc, serverTimestamp, orderBy } from "firebase/firestore";

import { PlayCircle, CheckCircleFill, LockFill, HourglassSplit, ChatDots, Pen, Book, CloudArrowUp } from 'react-bootstrap-icons';
import '../../../styles/CoursePlayer.css'; // Import the new styles

// --- Reusable Sub-Components for the Course Player ---

const VideoPlayer = ({ lessonTitle }) => (
    <div className="video-player-wrapper bg-dark rounded shadow-sm">
        <div className="player-placeholder d-flex align-items-center justify-content-center flex-column">
            <PlayCircle size={80} className="text-white-50" />
            <h4 className="text-white mt-3 text-center px-3">{lessonTitle}</h4>
            <p className="text-muted small">(Video player placeholder)</p>
        </div>
    </div>
);

const LessonContentTabs = ({ course, activeLessonIndex, notes, setNotes, comments, onNoteSave, onCommentSubmit, isSubmitting, courseId, isLessonCompleted }) => {
    const [activeTab, setActiveTab] = useState('notes');

    return (
        <div className="mt-4">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                        <Book className="me-2"/>Lesson Notes
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'notepad' ? 'active' : ''}`} onClick={() => setActiveTab('notepad')}>
                        <Pen className="me-2"/>My Private Notepad
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'discussion' ? 'active' : ''}`} onClick={() => setActiveTab('discussion')}>
                        <ChatDots className="me-2"/>Discussion
                    </button>
                </li>
            </ul>
            <div className="card card-body border-top-0">
                {activeTab === 'notes' && (
                    <div>
                        <h5 className="fw-bold">Lesson Notes from Trainer</h5>
                        <p>This is where notes from the trainer for "{course.curriculum[activeLessonIndex]}" would appear. These could include key takeaways, links to resources, or downloadable materials.</p>
                        
                        {/* --- NEW: Assignment Submission Button --- */}
                        {!isLessonCompleted && (
                             <div className="mt-4 p-3 bg-light rounded border">
                                <h6 className="fw-bold">Assignment</h6>
                                <p className="small text-muted">Ready to submit your work for this module? Click the button below.</p>
                                <Link to={`/dashboard/submit-assignment/${courseId}/${activeLessonIndex}`} className="btn btn-info">
                                    <CloudArrowUp className="me-2" /> Submit Your Assignment
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'notepad' && <NotesPanel notes={notes} setNotes={setNotes} onSave={onNoteSave} isSaving={isSubmitting} />}
                {activeTab === 'discussion' && <DiscussionPanel comments={comments} onSubmit={onCommentSubmit} isSubmitting={isSubmitting} />}
            </div>
        </div>
    );
};

const NotesPanel = ({ notes, setNotes, onSave, isSaving }) => (
    <div>
        <h5 className="fw-bold">My Private Notepad</h5>
        <p className="small text-muted">Your notes are saved automatically and are only visible to you.</p>
        <textarea 
            className="form-control notes-panel" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Jot down your thoughts, questions, and ideas here..."
        ></textarea>
        <button className="btn btn-primary mt-2" onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Notes'}
        </button>
    </div>
);

const DiscussionPanel = ({ comments, onSubmit, isSubmitting }) => {
    const [newComment, setNewComment] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onSubmit(newComment);
            setNewComment('');
        }
    };
    return (
        <div>
            <h5 className="fw-bold">Discussion</h5>
            <div className="discussion-thread mb-3" style={{maxHeight: '300px', overflowY: 'auto'}}>
                {comments.length > 0 ? comments.map(comment => (
                    <div key={comment.id} className="comment">
                        <p className="mb-1">{comment.text}</p>
                        <small className="text-muted">by {comment.authorName || 'Student'} on {new Date(comment.createdAt.seconds * 1000).toLocaleString()}</small>
                    </div>
                )) : <p className="text-muted">No comments yet. Be the first to start the discussion!</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <textarea className="form-control" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Ask a question or share your thoughts..." required></textarea>
                <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
};


// --- Main Course Player Component ---

const CoursePlayer = () => {
    const { id: courseId } = useParams();
    const { db, auth, appId } = useFirebase();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeLessonIndex, setActiveLessonIndex] = useState(0);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [notes, setNotes] = useState('');
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userId = useMemo(() => auth?.currentUser?.uid, [auth]);

    // Fetch all necessary data on component mount
    useEffect(() => {
        if (!userId || !db) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const coursesRef = collection(db, "courses");
                const q = query(coursesRef, where("id", "==", courseId));
                const courseSnapshot = await getDocs(q);
                if (courseSnapshot.empty) throw new Error("Course not found.");
                const courseData = courseSnapshot.docs[0].data();
                setCourse({ firestoreId: courseSnapshot.docs[0].id, ...courseData });

                const progressDocRef = doc(db, `artifacts/${appId}/users/${userId}/courseProgress`, courseId);
                const progressSnap = await getDoc(progressDocRef);
                if (progressSnap.exists()) {
                    setCompletedLessons(progressSnap.data().completedLessons || []);
                }
            } catch (err) {
                console.error("Error fetching initial data:", err);
                setError("Failed to load course data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [db, userId, courseId, appId]);

    // Fetch notes and comments whenever the active lesson changes
    useEffect(() => {
        if (!userId || !db || !course) return;

        const fetchLessonData = async () => {
            const noteDocRef = doc(db, `artifacts/${appId}/users/${userId}/notes/${courseId}/lesson`, `${activeLessonIndex}`);
            const noteSnap = await getDoc(noteDocRef);
            setNotes(noteSnap.exists() ? noteSnap.data().content : '');

            const commentsRef = collection(db, `courses/${course.firestoreId}/lessons/${activeLessonIndex}/comments`);
            const q = query(commentsRef, orderBy("createdAt", "asc"));
            const commentsSnapshot = await getDocs(q);
            setComments(commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchLessonData();
    }, [userId, db, course, activeLessonIndex, appId]);

    const handleSaveNote = async () => {
        setIsSubmitting(true);
        const noteDocRef = doc(db, `artifacts/${appId}/users/${userId}/notes/${courseId}/lesson`, `${activeLessonIndex}`);
        try {
            await setDoc(noteDocRef, { content: notes, updatedAt: serverTimestamp() }, { merge: true });
            alert("Note saved!");
        } catch (err) {
            console.error("Error saving note:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddComment = async (text) => {
        setIsSubmitting(true);
        const commentsRef = collection(db, `courses/${course.firestoreId}/lessons/${activeLessonIndex}/comments`);
        try {
            await addDoc(commentsRef, {
                text,
                authorId: userId,
                authorName: auth.currentUser.displayName || "Anonymous Student",
                createdAt: serverTimestamp(),
            });
            const q = query(commentsRef, orderBy("createdAt", "asc"));
            const commentsSnapshot = await getDocs(q);
            setComments(commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
            console.error("Error adding comment:", err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleMarkComplete = async () => {
        const newCompleted = [...new Set([...completedLessons, activeLessonIndex])];
        const progressDocRef = doc(db, `artifacts/${appId}/users/${userId}/courseProgress`, courseId);
        try {
            await setDoc(progressDocRef, { completedLessons: newCompleted }, { merge: true });
            setCompletedLessons(newCompleted);
            if (activeLessonIndex < course.curriculum.length - 1) {
                setActiveLessonIndex(activeLessonIndex + 1);
            }
        } catch (err) {
            console.error("Error marking lesson complete:", err);
        }
    };

    if (loading) {
        return <DashboardLayout><div className="text-center py-5"><HourglassSplit size={40} className="text-primary" /><p className="mt-2 text-muted">Loading your course...</p></div></DashboardLayout>;
    }
    if (error) {
        return <DashboardLayout><div className="alert alert-danger">{error}</div></DashboardLayout>;
    }

    const isLessonCompleted = completedLessons.includes(activeLessonIndex);

    return (
        <DashboardLayout>
            <Helmet><title>{course.title} | Taxly Academy</title></Helmet>
            <div className="dashboard-page-content">
                <div className="row g-4">
                    <div className="col-lg-8">
                        <VideoPlayer lessonTitle={course.curriculum[activeLessonIndex]} />
                        <LessonContentTabs 
                            course={course} 
                            activeLessonIndex={activeLessonIndex} 
                            notes={notes} 
                            setNotes={setNotes} 
                            comments={comments}
                            onNoteSave={handleSaveNote}
                            onCommentSubmit={handleAddComment}
                            isSubmitting={isSubmitting}
                            courseId={courseId}
                            isLessonCompleted={isLessonCompleted}
                        />
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm curriculum-sidebar">
                            <div className="card-header fw-bold">{course.title} - Curriculum</div>
                            <div className="list-group list-group-flush">
                                {course.curriculum.map((lesson, index) => {
                                    const isCompleted = completedLessons.includes(index);
                                    const isLocked = index > 0 && !completedLessons.includes(index - 1);
                                    const isActive = activeLessonIndex === index;
                                    
                                    return (
                                        <div 
                                            key={index}
                                            className={`list-group-item list-group-item-action ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                                            onClick={() => !isLocked && setActiveLessonIndex(index)}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <div className="fw-bold lesson-title">{`Module ${index + 1}`}</div>
                                                    <span className="small">{lesson}</span>
                                                </div>
                                                {isLocked ? <LockFill /> : isCompleted && <CheckCircleFill className="text-success" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="card-footer">
                                {!isLessonCompleted && (
                                    <button className="btn btn-success w-100" onClick={handleMarkComplete}>
                                        <CheckCircleFill className="me-2" />Mark as Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CoursePlayer;
