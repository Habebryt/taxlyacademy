// src/pages/dashboard/corporate/CorporateDashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

import DashboardLayout from '../common/DashboardLayout';
import StatCard from '../common/StatCard';
import { useFirebase } from '../../../context/FirebaseContext';
import { collection, query, where, getDocs } from "firebase/firestore";
import { PeopleFill, Briefcase, Mortarboard, HourglassSplit } from 'react-bootstrap-icons';

const CorporateDashboard = () => {
    const { db, auth } = useFirebase();
    
    // In a real app, the partner's ID and type would come from their auth profile.
    // We'll simulate it here for demonstration.
    const partnerId = "simulated_partner_id";
    const partnerType = "Business"; // Could be 'University', 'Government', etc.
    const partnerName = "Example Corp";

    const [stats, setStats] = useState({
        enrolledMembers: 0,
        jobsPosted: 0,
        activeCourses: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const fetchPartnerData = async () => {
            if (!auth || !auth.currentUser) {
                setTimeout(fetchPartnerData, 100);
                return;
            }
            
            setLoading(true);
            try {
                // This is a placeholder for fetching real partner-specific data.
                // For example, you might query an 'enrollments' collection where `partnerId` matches.
                // For now, we'll use simulated data.
                const simulatedData = {
                    enrolledMembers: 27,
                    jobsPosted: 5,
                    activeCourses: 3,
                };
                setStats(simulatedData);

            } catch (error) {
                console.error("Error fetching partner data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPartnerData();
    }, [auth, db]);

    return (
        <DashboardLayout>
            <Helmet>
                <title>Partner Dashboard | Taxly Academy</title>
            </Helmet>

            <div className="dashboard-page-content">
                 {/* The welcome header in a real app would show the partner's name */}
                <div className="welcome-header">
                    <h2 className="fw-bold mb-0">Welcome, {partnerName}!</h2>
                    <p className="text-muted">Here's an overview of your partnership with us.</p>
                </div>

                {/* --- Stats Section --- */}
                <div className="row mb-4">
                    <div className="col-md-6 col-lg-4 mb-4">
                        <StatCard 
                            icon={<PeopleFill size={24} />}
                            title="Enrolled Members"
                            value={stats.enrolledMembers}
                            loading={loading}
                        />
                    </div>
                     <div className="col-md-6 col-lg-4 mb-4">
                        <StatCard 
                            icon={<Briefcase size={24} />}
                            title="Active Job Postings"
                            value={stats.jobsPosted}
                            loading={loading}
                        />
                    </div>
                     <div className="col-md-6 col-lg-4 mb-4">
                        <StatCard 
                            icon={<Mortarboard size={24} />}
                            title="Corporate Courses"
                            value={stats.activeCourses}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* --- Main Content Area --- */}
                <div className="text-center py-5 border bg-light rounded">
                    <h4 className="fw-bold">More Features Coming Soon</h4>
                    <p className="text-muted">We are actively developing new tools to help you manage your partnership, track your team's progress, and discover new talent.</p>
                    <Link to="/contact" className="btn btn-primary mt-3">
                        Contact Your Partnership Manager
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CorporateDashboard;
