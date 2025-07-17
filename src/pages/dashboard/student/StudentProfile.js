// src/pages/dashboard/student/StudentProfile.js

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { PersonCircle, HourglassSplit, PencilSquare, XCircle, CheckCircle } from 'react-bootstrap-icons';
import StatusModal from '../../../components/common/StatusModal';

const StudentProfile = () => {
    const { db, auth } = useFirebase();
    
    // --- NEW: State to manage edit mode ---
    const [isEditing, setIsEditing] = useState(false);
    
    // State for the profile data being edited
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        bio: '',
    });
    // --- NEW: State to hold the original, unchanged profile data ---
    const [originalProfile, setOriginalProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchUserProfile = async () => {
            if (!auth || !auth.currentUser) {
                setTimeout(fetchUserProfile, 100);
                return;
            }
            setLoading(true);
            try {
                const userId = auth.currentUser.uid;
                const userDocRef = doc(db, "users", userId);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfile(data);
                    setOriginalProfile(data); // Save the original data
                } else {
                    const initialData = { email: auth.currentUser.email || '', fullName: auth.currentUser.displayName || '' };
                    setProfile(initialData);
                    setOriginalProfile(initialData);
                    console.log("No profile found. Creating a new one.");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [auth, db]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setProfile(originalProfile); // Revert any changes
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) {
            alert("You must be logged in to update your profile.");
            return;
        }
        setIsSubmitting(true);
        try {
            const userId = auth.currentUser.uid;
            const userDocRef = doc(db, "users", userId);

            await setDoc(userDocRef, {
                ...profile,
                updatedAt: serverTimestamp()
            }, { merge: true });
            
            setOriginalProfile(profile); // Update the original profile to the new saved state
            setIsEditing(false); // Exit edit mode
            setModalContent({ status: 'success', title: 'Profile Updated', message: 'Your information has been saved successfully.' });
        } catch (error) {
            console.error("Error updating profile:", error);
            setModalContent({ status: 'error', title: 'Update Failed', message: 'There was an error saving your profile. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setModalContent(null);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="text-center py-5">
                    <HourglassSplit size={40} className="text-primary" />
                    <p className="mt-2 text-muted">Loading your profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Helmet>
                <title>My Profile | Taxly Academy Dashboard</title>
            </Helmet>

            <div className="dashboard-page-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">My Profile</h3>
                    {!isEditing && (
                        <button className="btn btn-primary" onClick={handleEditClick}>
                            <PencilSquare className="me-2" /> Edit Profile
                        </button>
                    )}
                </div>
                <div className="card shadow-sm">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-4">
                            <PersonCircle size={60} className="text-muted me-3" />
                            <div>
                                <h4 className="fw-bold mb-0">{profile.fullName || 'New Student'}</h4>
                                <p className="text-muted mb-0">{profile.email}</p>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" className="form-control" value={profile.fullName} onChange={handleChange} disabled={!isEditing} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input type="email" id="email" name="email" className="form-control" value={profile.email} onChange={handleChange} disabled />
                                </div>
                            </div>
                             <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" className="form-control" value={profile.phone || ''} onChange={handleChange} disabled={!isEditing} />
                                </div>
                                 <div className="col-md-6 mb-3">
                                    <label htmlFor="linkedin" className="form-label">LinkedIn Profile</label>
                                    <input type="url" id="linkedin" name="linkedin" className="form-control" value={profile.linkedin || ''} onChange={handleChange} disabled={!isEditing} />
                                </div>
                            </div>
                             <div className="mb-3">
                                <label htmlFor="portfolio" className="form-label">Portfolio/Website URL</label>
                                <input type="url" id="portfolio" name="portfolio" className="form-control" value={profile.portfolio || ''} onChange={handleChange} disabled={!isEditing} />
                            </div>
                             <div className="mb-3">
                                <label htmlFor="bio" className="form-label">Your Bio</label>
                                <textarea id="bio" name="bio" className="form-control" rows="4" value={profile.bio || ''} onChange={handleChange} placeholder="Tell us a bit about yourself..." disabled={!isEditing}></textarea>
                            </div>
                            
                            {/* --- NEW: Show Save/Cancel buttons only in edit mode --- */}
                            {isEditing && (
                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelClick} disabled={isSubmitting}>
                                        <XCircle className="me-2" /> Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : <><CheckCircle className="me-2" /> Save Changes</>}
                                    </button>
                                </div>
                            )}
                        </form>
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

export default StudentProfile;
