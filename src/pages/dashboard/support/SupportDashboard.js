// src/pages/dashboard/support/SupportDashboard.js

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, getDocs, query, orderBy, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Envelope, PersonBadge, Building, Bank, Mortarboard, HourglassSplit, Briefcase } from 'react-bootstrap-icons';
import StatusModal from '../../../components/common/StatusModal';

// --- NEW: A modal for viewing and managing an inquiry ---
const InquiryDetailModal = ({ isOpen, onClose, inquiry, onStatusChange, isUpdating }) => {
    // --- FIX: Hooks must be called at the top level, before any conditional returns ---
    const [status, setStatus] = useState(inquiry?.status || 'New');

    // This effect updates the local state when a new inquiry is selected
    useEffect(() => {
        if (inquiry) {
            setStatus(inquiry.status || 'New');
        }
    }, [inquiry]);

    if (!isOpen || !inquiry) return null;

    const handleSave = () => {
        onStatusChange(inquiry.id, inquiry.type, status);
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Inquiry Details</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <p><strong>From:</strong> {inquiry.fullName || inquiry.contactPerson || 'N/A'}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${inquiry.email || inquiry.workEmail}`}>{inquiry.email || inquiry.workEmail}</a></p>
                            <p><strong>Submitted:</strong> {inquiry.submittedAt ? new Date(inquiry.submittedAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
                            <hr/>
                            <p><strong>Message:</strong></p>
                            <p className="bg-light p-2 rounded">{inquiry.message || inquiry.teachingExperience || 'No message provided.'}</p>
                            <hr/>
                             <div className="mb-3">
                                <label htmlFor="status" className="form-label fw-bold">Update Status</label>
                                <select id="status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option>New</option>
                                    <option>Contacted</option>
                                    <option>In Progress</option>
                                    <option>Resolved</option>
                                    <option>Archived</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isUpdating}>
                                {isUpdating ? 'Saving...' : 'Save Status'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};


// A reusable component to display a list of inquiries
const InquiryList = ({ title, inquiries, loading, onSelectInquiry }) => (
    <div>
        <h4 className="fw-bold mb-3">{title} ({inquiries.length})</h4>
        {loading ? (
            <p>Loading inquiries...</p>
        ) : inquiries.length > 0 ? (
            <div className="table-responsive">
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>Name / Org</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquiries.map(item => (
                            <tr key={item.id}>
                                <td>{item.fullName || item.contactPerson || item.companyName || item.agencyName || item.schoolName || item.universityName}</td>
                                <td><a href={`mailto:${item.email || item.workEmail || item.officialEmail || item.schoolEmail || item.contactEmail}`}>{item.email || item.workEmail || item.officialEmail || item.schoolEmail || item.contactEmail}</a></td>
                                <td className="text-muted small">{item.submittedAt ? new Date(item.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                                <td><span className="badge bg-info text-dark">{item.status || 'New'}</span></td>
                                <td><button className="btn btn-sm btn-outline-secondary" onClick={() => onSelectInquiry(item)}>View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="text-muted">No inquiries in this category.</p>
        )}
    </div>
);


const SupportDashboard = () => {
    const { db, auth } = useFirebase();
    const [inquiries, setInquiries] = useState({
        contact: [], trainer: [], business: [], government: [], school: [], university: [],
    });
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const fetchAllInquiries = useCallback(async () => {
        if (!auth || !auth.currentUser) {
            setTimeout(fetchAllInquiries, 100);
            return;
        }
        setLoading(true);
        try {
            const inquiryTypes = {
                contact: "contactSubmissions",
                trainer: "trainerApplications",
                business: "businessInquiries",
                government: "governmentInquiries",
                school: "schoolInquiries",
                university: "universityInquiries",
            };

            const fetchPromises = Object.entries(inquiryTypes).map(async ([key, collectionName]) => {
                const q = query(collection(db, collectionName), orderBy("submittedAt", "desc"));
                const snapshot = await getDocs(q);
                // Add the 'type' to each inquiry object to know which collection it came from
                return { [key]: snapshot.docs.map(doc => ({ id: doc.id, type: collectionName, ...doc.data() })) };
            });

            const results = await Promise.all(fetchPromises);
            const allData = results.reduce((acc, current) => ({ ...acc, ...current }), {});
            setInquiries(allData);

        } catch (error) {
            console.error("Error fetching inquiries:", error);
        } finally {
            setLoading(false);
        }
    }, [auth, db]);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        fetchAllInquiries();
    }, [fetchAllInquiries]);

    const handleStatusChange = async (inquiryId, inquiryType, newStatus) => {
        setIsUpdating(true);
        const docRef = doc(db, inquiryType, inquiryId);
        try {
            await updateDoc(docRef, {
                status: newStatus,
                lastUpdated: serverTimestamp(),
            });
            setSelectedInquiry(null); // Close the modal
            fetchAllInquiries(); // Refresh the list
            setModalContent({ status: 'success', title: 'Status Updated', message: 'The inquiry status has been saved.' });
        } catch (error) {
            console.error("Error updating status:", error);
            setModalContent({ status: 'error', title: 'Update Failed', message: 'Could not save the new status.' });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <DashboardLayout>
            <Helmet>
                <title>Support Dashboard | Taxly Academy</title>
            </Helmet>

            <div className="dashboard-page-content">
                <h3 className="fw-bold mb-4">Support & Partnership Inquiries</h3>

                {loading ? (
                    <div className="text-center py-5">
                        <HourglassSplit size={40} className="text-primary" />
                        <p className="mt-2 text-muted">Loading all inquiries...</p>
                    </div>
                ) : (
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <ul className="nav nav-tabs card-header-tabs">
                                <li className="nav-item"><a className="nav-link active" data-bs-toggle="tab" href="#contact"><Envelope className="me-2"/>Contact Form</a></li>
                                <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#trainer"><PersonBadge className="me-2"/>Trainer Apps</a></li>
                                <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#business"><Briefcase className="me-2"/>Businesses</a></li>
                                <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#university"><Mortarboard className="me-2"/>Universities</a></li>
                                <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#school"><Building className="me-2"/>Schools</a></li>
                                <li className="nav-item"><a className="nav-link" data-bs-toggle="tab" href="#government"><Bank className="me-2"/>Government</a></li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content p-2">
                                <div className="tab-pane fade show active" id="contact"><InquiryList title="General Contact Messages" inquiries={inquiries.contact} loading={loading} onSelectInquiry={setSelectedInquiry} /></div>
                                <div className="tab-pane fade" id="trainer"><InquiryList title="Trainer Applications" inquiries={inquiries.trainer} loading={loading} onSelectInquiry={setSelectedInquiry} /></div>
                                <div className="tab-pane fade" id="business"><InquiryList title="Business Partnership Inquiries" inquiries={inquiries.business} loading={loading} onSelectInquiry={setSelectedInquiry} /></div>
                                <div className="tab-pane fade" id="university"><InquiryList title="University Partnership Inquiries" inquiries={inquiries.university} loading={loading} onSelectInquiry={setSelectedInquiry} /></div>
                                <div className="tab-pane fade" id="school"><InquiryList title="School Partnership Inquiries" inquiries={inquiries.school} loading={loading} onSelectInquiry={setSelectedInquiry} /></div>
                                <div className="tab-pane fade" id="government"><InquiryList title="Government Partnership Inquiries" inquiries={inquiries.government} loading={loading} onSelectInquiry={setSelectedInquiry} /></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <InquiryDetailModal
                isOpen={!!selectedInquiry}
                onClose={() => setSelectedInquiry(null)}
                inquiry={selectedInquiry}
                onStatusChange={handleStatusChange}
                isUpdating={isUpdating}
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

export default SupportDashboard;
