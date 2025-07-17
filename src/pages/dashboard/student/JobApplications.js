import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import the main dashboard layout and other necessary components
import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { Briefcase, HourglassSplit, PlusCircle, PencilSquare } from 'react-bootstrap-icons';

// --- A component to render a styled status badge ---
const StatusBadge = ({ status }) => {
    const statusStyles = {
        Applied: { backgroundColor: '#cfe2ff', color: '#0d6efd' },
        Interviewing: { backgroundColor: '#fff3cd', color: '#ffc107' },
        Offer: { backgroundColor: '#d1e7dd', color: '#198754' },
        Rejected: { backgroundColor: '#f8d7da', color: '#dc3545' },
        Default: { backgroundColor: '#e9ecef', color: '#6c757d' }
    };
    const style = statusStyles[status] || statusStyles.Default;
    return <span className="badge" style={{ ...style, padding: '0.5em 0.75em' }}>{status}</span>;
};

// --- Add/Edit Application Modal ---
// By adding the `export` keyword, we can now import and use this modal on other pages.
export const ApplicationModal = ({ isOpen, onClose, onSave, application, isSubmitting }) => {
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        jobUrl: '',
        status: 'Applied',
        cvLink: '',
        coverLetterLink: '',
        notes: ''
    });

    useEffect(() => {
        // If an existing application is passed, populate the form for editing
        if (application) {
            setFormData({
                jobTitle: application.jobTitle || '',
                company: application.company || '',
                jobUrl: application.jobUrl || '',
                status: application.status || 'Applied',
                cvLink: application.cvLink || '',
                coverLetterLink: application.coverLetterLink || '',
                notes: application.notes || ''
            });
        } else {
            // Reset for a new application
            setFormData({ jobTitle: '', company: '', jobUrl: '', status: 'Applied', cvLink: '', coverLetterLink: '', notes: '' });
        }
    }, [application, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, application?.id); // Pass the ID if we are editing
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{application ? 'Edit Application Details' : 'Add New Application'}</h5>
                                <button type="button" className="btn-close" onClick={onClose} disabled={isSubmitting}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="jobTitle" className="form-label">Job Title</label>
                                        <input type="text" id="jobTitle" name="jobTitle" className="form-control" value={formData.jobTitle} onChange={handleChange} required disabled={isSubmitting} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="company" className="form-label">Company Name</label>
                                        <input type="text" id="company" name="company" className="form-control" value={formData.company} onChange={handleChange} required disabled={isSubmitting} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="jobUrl" className="form-label">Job Posting URL</label>
                                    <input type="url" id="jobUrl" name="jobUrl" className="form-control" value={formData.jobUrl} onChange={handleChange} required disabled={isSubmitting} />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="cvLink" className="form-label">Link to CV Used (Optional)</label>
                                        <input type="url" id="cvLink" name="cvLink" className="form-control" value={formData.cvLink} onChange={handleChange} placeholder="e.g., Google Drive link" disabled={isSubmitting} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="coverLetterLink" className="form-label">Link to Cover Letter (Optional)</label>
                                        <input type="url" id="coverLetterLink" name="coverLetterLink" className="form-control" value={formData.coverLetterLink} onChange={handleChange} disabled={isSubmitting} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="notes" className="form-label">Personal Notes</label>
                                    <textarea id="notes" name="notes" className="form-control" rows="4" value={formData.notes} onChange={handleChange} placeholder="e.g., Contact person, key requirements, follow-up dates..." disabled={isSubmitting}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Application'}
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

const JobApplications = () => {
    const { db, auth, appId } = useFirebase();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchApplications = async () => {
        if (!auth || !auth.currentUser) {
            setTimeout(fetchApplications, 200);
            return;
        }
        setLoading(true);
        try {
            const userId = auth.currentUser.uid;
            const applicationsRef = collection(db, `artifacts/${appId}/users/${userId}/jobApplications`);
            const q = query(applicationsRef, orderBy("appliedAt", "desc"));
            const querySnapshot = await getDocs(q);
            const userApplications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplications(userApplications);
        } catch (error) {
            console.error("Error fetching job applications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        fetchApplications();
    }, [auth, db]);

    const handleSaveApplication = async (formData, applicationId) => {
        setIsSubmitting(true);
        const userId = auth.currentUser.uid;
        const collectionPath = `users/${userId}/jobApplications`;

        try {
            if (applicationId) {
                // Editing an existing application
                const docRef = doc(db, collectionPath, applicationId);
                await updateDoc(docRef, formData);
            } else {
                // Adding a new application
                await addDoc(collection(db, collectionPath), {
                    ...formData,
                    appliedAt: serverTimestamp(),
                });
            }
            setIsModalOpen(false);
            setEditingApplication(null);
            fetchApplications(); // Refresh the list
        } catch (error) {
            console.error("Error saving application:", error);
            alert("Failed to save application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, `jobApplications`, applicationId);
        try {
            await updateDoc(docRef, { status: newStatus });
            // Update the state locally for an instant UI update
            setApplications(prev => prev.map(app => 
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    return (
        <DashboardLayout>
            <Helmet>
                <title>My Job Applications | Taxly Academy Dashboard</title>
            </Helmet>

            <div className="dashboard-page-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">My Job Applications</h3>
                    <button className="btn btn-primary d-flex align-items-center" onClick={() => { setEditingApplication(null); setIsModalOpen(true); }}>
                        <PlusCircle className="me-2" /> Add Application
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <HourglassSplit size={40} className="text-primary" />
                        <p className="mt-2 text-muted">Loading your applications...</p>
                    </div>
                ) : applications.length > 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Job Title</th>
                                            <th>Company</th>
                                            <th>Date Applied</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(app => (
                                            <tr key={app.id}>
                                                <td>
                                                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="fw-bold text-decoration-none">{app.jobTitle}</a>
                                                </td>
                                                <td className="text-muted">{app.company}</td>
                                                <td className="text-muted">
                                                    {app.appliedAt ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td>
                                                    <select 
                                                        className="form-select form-select-sm" 
                                                        value={app.status} 
                                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                    >
                                                        <option>Applied</option>
                                                        <option>Interviewing</option>
                                                        <option>Offer</option>
                                                        <option>Rejected</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditingApplication(app); setIsModalOpen(true); }}>
                                                        <PencilSquare />
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
                        <Briefcase size={50} className="text-muted mb-3" />
                        <h4 className="fw-bold">Track Your First Application</h4>
                        <p className="text-muted">Click the "Add Application" button to log the jobs you've applied for.</p>
                        <button className="btn btn-primary mt-3" onClick={() => setIsModalOpen(true)}>
                            Add Your First Application
                        </button>
                    </div>
                )}
            </div>
            
            <ApplicationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveApplication}
                application={editingApplication}
                isSubmitting={isSubmitting}
            />
        </DashboardLayout>
    );
};

export default JobApplications;
