// src/pages/Login.js

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Login.css'; // Create this new CSS file for specific styles

// --- NEW: Import Firebase services ---
import { useFirebase } from '../context/FirebaseContext';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Import icons
import { Google, Person, Briefcase } from 'react-bootstrap-icons';

// --- A small component for the dynamic welcome messages ---
const WelcomeMessage = ({ view }) => {
    if (view === 'login') {
        return {
            title: 'Welcome Back!',
            message: 'Sign in to access your dashboard and continue your journey.'
        };
    }
    if (view === 'registerStudent') {
        return {
            title: 'Start Your Learning Journey',
            message: 'Join our community of learners and gain skills for the global market.'
        };
    }
    if (view === 'registerTrainer') {
        return {
            title: 'Shape the Future of Learning',
            message: 'Become a trainer and empower the next generation of virtual professionals.'
        };
    }
    return {};
};

const Login = () => {
    const { auth, db } = useFirebase();
    const navigate = useNavigate();

    // State to manage views: 'login', 'registerStudent', 'registerTrainer'
    const [view, setView] = useState('login');
    
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- NEW: Helper function to redirect user based on their role ---
    const redirectUserByRole = (userRole) => {
        console.log("Redirecting user with role:", userRole);
        switch (userRole) {
            case 'trainer':
                navigate('/dashboard/trainer');
                break;
            case 'support':
                navigate('/dashboard/support');
                break;
            case 'corporate':
                navigate('/dashboard/corporate');
                break;
            case 'student':
            default:
                navigate('/dashboard/my-courses');
                break;
        }
    };

    const saveUserToFirestore = async (user, fullName, role) => {
        if (!db || !user) return;
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            fullName: fullName || user.displayName,
            email: user.email,
            createdAt: serverTimestamp(),
            role: role // Assign the correct role
        }, { merge: true });
    };

    const handleGoogleSignIn = async () => {
        if (!auth) return;
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Check if the user already exists in our database
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                // If user exists, redirect them based on their existing role
                redirectUserByRole(docSnap.data().role);
            } else {
                // If it's a new user, save them with a default 'student' role
                await saveUserToFirestore(user, user.displayName, 'student');
                redirectUserByRole('student');
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            setError("Could not sign in with Google. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth) return;
        setIsProcessing(true);
        setError('');

        if (view.startsWith('register')) {
            const role = view === 'registerStudent' ? 'student' : 'trainer';
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;
                await saveUserToFirestore(user, formData.fullName, role);
                redirectUserByRole(role);
            } catch (error) {
                setError(error.message);
            }
        } else { // Login view
            try {
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;
                
                // --- FIX: Fetch the user's role from Firestore after login ---
                const userDocRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    redirectUserByRole(docSnap.data().role);
                } else {
                    // This is an edge case, but we can default to student
                    console.warn("User logged in but has no profile in Firestore. Defaulting to student.");
                    redirectUserByRole('student');
                }
            } catch (error) {
                setError("Invalid email or password. Please try again.");
            }
        }
        setIsProcessing(false);
    };

    const { title, message } = WelcomeMessage({ view });

    const wrapperStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${process.env.PUBLIC_URL + (view === 'login' ? '/images/login-bg.jpg' : view === 'registerStudent' ? '/images/student-bg.jpg' : '/images/trainer-bg.jpg')})`
    };

    return (
        <>
            <Helmet>
                <title>{view === 'login' ? 'Login' : 'Register'} | Taxly Academy</title>
            </Helmet>
            <div className="login-page-wrapper" style={wrapperStyle}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8" data-aos="fade-up">
                            <div className="login-form-container">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold">{title}</h2>
                                    <p className="text-muted">{message}</p>
                                </div>
                                
                                {view !== 'login' && (
                                    <ul className="nav nav-pills nav-fill mb-4">
                                        <li className="nav-item">
                                            <button className={`nav-link ${view === 'registerStudent' ? 'active' : ''}`} onClick={() => setView('registerStudent')}>
                                                <Person className="me-2"/> As a Student
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button className={`nav-link ${view === 'registerTrainer' ? 'active' : ''}`} onClick={() => setView('registerTrainer')}>
                                                <Briefcase className="me-2"/> As a Trainer
                                            </button>
                                        </li>
                                    </ul>
                                )}

                                <button onClick={handleGoogleSignIn} className="btn btn-light border w-100 mb-3 d-flex align-items-center justify-content-center">
                                    <Google className="me-2" size={20} /> Continue with Google
                                </button>
                                
                                <div className="divider-text my-4"><span>OR</span></div>

                                <form onSubmit={handleSubmit}>
                                    {view !== 'login' && (
                                        <div className="mb-3">
                                            <label htmlFor="fullName" className="form-label">Full Name</label>
                                            <input type="text" id="fullName" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} required />
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email Address</label>
                                        <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" id="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                                    </div>

                                    {error && <p className="text-danger small">{error}</p>}

                                    <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={isProcessing}>
                                        {isProcessing ? 'Processing...' : (view === 'login' ? 'Login' : 'Create Account')}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <p className="text-muted">
                                        {view === 'login' ? "Don't have an account?" : 'Already have an account?'}
                                        <button className="btn btn-link" onClick={() => setView(view === 'login' ? 'registerStudent' : 'login')}>
                                            {view === 'login' ? 'Register now' : 'Login here'}
                                        </button>
                                    </p>
                                </div>
                                <div className="text-center mt-2 border-top pt-3">
                                    <p className="text-muted small">
                                        Are you a business, school, or government agency?
                                        <Link to="/for-businesses" className="ms-1">Partner with us.</Link>
                                        <br />
                                        <Link to="/" className="ms-1 text-warning">Back Home</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
