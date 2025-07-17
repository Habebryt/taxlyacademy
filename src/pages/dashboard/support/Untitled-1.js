// src/pages/dashboard/support/SupportDashboard.js

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Envelope, PersonBadge, Building, Bank, Mortarboard, HourglassSplit, Briefcase } from 'react-bootstrap-icons';

// A reusable component to display a list of inquiries
const InquiryList = ({ title, inquiries, loading }) => (
    <div>
        <h4 className="fw-bold mb-3">{title}</h4>
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
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquiries.map(item => (
                            <tr key={item.id}>
                                <td>{item.fullName || item.contactPerson || item.companyName || item.agencyName || item.schoolName || item.universityName}</td>
                                <td><a href={`mailto:${item.email || item.workEmail || item.officialEmail || item.schoolEmail || item.contactEmail}`}>{item.email || item.workEmail || item.officialEmail || item.schoolEmail || item.contactEmail}</a></td>
                                <td className="text-muted small">{item.submittedAt ? new Date(item.submittedAt.seconds * 1000).toLocaleString() : 'N/A'}</td>
                                <td><button className="btn btn-sm btn-outline-secondary" onClick={() => alert(item.message || item.teachingExperience)}>View Message</button></td>
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
        contact: [],
        trainer: [],
        business: [],
        government: [],
        school: [],
        university: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchAllInquiries = async () => {
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
                    return { [key]: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
                });

                const results = await Promise.all(fetchPromises);
                const allData = results.reduce((acc, current) => ({ ...acc, ...current }), {});
                setInquiries(allData);

            } catch (error) {
                console.error("Error fetching inquiries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllInquiries();
    }, [auth, db]);

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
                                <div className="tab-pane fade show active" id="contact"><InquiryList title="General Contact Messages" inquiries={inquiries.contact} loading={loading} /></div>
                                <div className="tab-pane fade" id="trainer"><InquiryList title="Trainer Applications" inquiries={inquiries.trainer} loading={loading} /></div>
                                <div className="tab-pane fade" id="business"><InquiryList title="Business Partnership Inquiries" inquiries={inquiries.business} loading={loading} /></div>
                                <div className="tab-pane fade" id="university"><InquiryList title="University Partnership Inquiries" inquiries={inquiries.university} loading={loading} /></div>
                                <div className="tab-pane fade" id="school"><InquiryList title="School Partnership Inquiries" inquiries={inquiries.school} loading={loading} /></div>
                                <div className="tab-pane fade" id="government"><InquiryList title="Government Partnership Inquiries" inquiries={inquiries.government} loading={loading} /></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default SupportDashboard;
