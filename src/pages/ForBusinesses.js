import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '../components/Hero';
import { Briefcase, People, ArrowRepeat } from 'react-bootstrap-icons';

const ForBusinesses = () => {
    useEffect(() => { AOS.init({ duration: 1000, once: true }); }, []);
    return (
        <>
            <Helmet>
                <title>For Businesses | Taxly Academy</title>
                <meta name="description" content="Upskill your team or hire pre-vetted virtual professionals trained by Taxly Academy." />
            </Helmet>
            <Hero
                backgroundImage="/images/business-banner.jpg"
                title="Supercharge Your Workforce"
                subtitle="Custom Training and Talent Sourcing for Modern Businesses"
            />
            <section className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6" data-aos="fade-right">
                            <h2 className="display-5 fw-bold mb-3">Stop Searching. Start Building.</h2>
                            <p className="text-muted fs-5">Finding reliable, skilled, and affordable back-office talent is one of the biggest challenges for growing businesses. Taxly Academy solves this problem by providing a direct pipeline to pre-vetted, job-ready virtual professionals trained on the exact tools and workflows you use.</p>
                        </div>
                        <div className="col-lg-6" data-aos="fade-left">
                           <img src="/images/business-team.jpg" alt="A professional business team" className="img-fluid rounded shadow-lg" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="section-title" data-aos="fade-up">Our Corporate Solutions</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><People size={40} /></div>
                                <h4 className="fw-bold">Hire Our Graduates</h4>
                                <p>Gain direct access to our pool of certified graduates for roles like Virtual Assistant, Social Media Manager, Bookkeeper, and more.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><ArrowRepeat size={40} /></div>
                                <h4 className="fw-bold">Upskill Your Team</h4>
                                <p>Enroll your existing staff in our specialized courses to boost their productivity and proficiency with modern virtual tools.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="400">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><Briefcase size={40} /></div>
                                <h4 className="fw-bold">Custom Training</h4>
                                <p>We can develop and deliver bespoke training programs tailored to your company's specific software, workflows, and culture.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
             <section className="py-5">
                <div className="container">
                     <h2 className="text-center mb-5" data-aos="fade-up">Partner With Us</h2>
                    <div className="row justify-content-center">
                        <div className="col-lg-8" data-aos="fade-up">
                            <div className="p-4 p-md-5 bg-white rounded shadow">
                                <form>
                                    <div className="row">
                                        <div className="col-md-6 mb-3"><input type="text" className="form-control" placeholder="Company Name" required /></div>
                                        <div className="col-md-6 mb-3"><input type="text" className="form-control" placeholder="Your Name" required /></div>
                                    </div>
                                    <div className="mb-3"><input type="email" className="form-control" placeholder="Work Email" required /></div>
                                    <div className="mb-3">
                                        <select className="form-select">
                                            <option>I'm interested in hiring graduates</option>
                                            <option>I'm interested in upskilling my team</option>
                                            <option>I'm interested in custom training</option>
                                        </select>
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

export default ForBusinesses;
