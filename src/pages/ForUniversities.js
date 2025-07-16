import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '../components/Hero';
import { Mortarboard, Briefcase, PatchCheckFill } from 'react-bootstrap-icons';

const ForUniversities = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <>
            <Helmet>
                <title>For Universities | Taxly Academy</title>
                <meta name="description" content="Partner with Taxly Academy to bridge the gap between academia and the global digital workforce." />
            </Helmet>
            <Hero
                backgroundImage="/images/university-banner.jpg"
                title="Partner with Taxly Academy"
                subtitle="Empower Your Students with Job-Ready Virtual Skills"
            />

            <section className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6" data-aos="fade-right">
                            <h2 className="display-5 fw-bold mb-3">Bridge the Gap Between Degree and Career</h2>
                            <p className="text-muted fs-5">In today's fast-evolving job market, a degree is just the beginning. Employers are seeking graduates who possess not only theoretical knowledge but also practical, tool-based skills. Taxly Academy partners with universities to integrate our industry-validated virtual skills training directly into your ecosystem.</p>
                            <p className="text-muted">We help you produce graduates who are not just qualified, but immediately employable in the global digital economy.</p>
                        </div>
                        <div className="col-lg-6" data-aos="fade-left">
                            <img src="/images/university-collaboration.jpg" alt="University students collaborating" className="img-fluid rounded shadow-lg" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="section-title" data-aos="fade-up">Our Partnership Models</h2>
                    <p className="section-subtitle mb-5 text-muted" data-aos="fade-up" data-aos-delay="100">Flexible solutions to fit your institution's needs.</p>
                    <div className="row">
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><Mortarboard size={40} /></div>
                                <h4 className="fw-bold">Curriculum Integration</h4>
                                <p>Embed our specialized modules as elective courses or credit-bearing programs within your existing departments (e.g., Business, IT, Communications).</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><PatchCheckFill size={40} /></div>
                                <h4 className="fw-bold">Co-Branded Certifications</h4>
                                <p>Offer dual-logo certificates that combine your university's academic prestige with our industry-recognized skills validation, boosting graduate employability.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="400">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><Briefcase size={40} /></div>
                                <h4 className="fw-bold">Internship & Job Portals</h4>
                                <p>Provide your students with exclusive access to our job board, connecting them directly with remote internship and entry-level opportunities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                     <h2 className="text-center mb-5" data-aos="fade-up">Become a Partner Institution</h2>
                    <div className="row justify-content-center">
                        <div className="col-lg-8" data-aos="fade-up">
                            <div className="p-4 p-md-5 bg-white rounded shadow">
                                <form>
                                    <div className="row">
                                        <div className="col-md-6 mb-3"><input type="text" className="form-control" placeholder="University Name" required /></div>
                                        <div className="col-md-6 mb-3"><input type="text" className="form-control" placeholder="Contact Person" required /></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3"><input type="email" className="form-control" placeholder="Contact Email" required /></div>
                                        <div className="col-md-6 mb-3"><input type="tel" className="form-control" placeholder="Contact Phone" required /></div>
                                    </div>
                                    <div className="mb-3">
                                        <textarea className="form-control" rows="4" placeholder="Briefly describe your interest or proposed area of partnership..."></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Submit Inquiry</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ForUniversities;
