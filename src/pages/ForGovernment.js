import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '../components/Hero';
import { Bank, People, Award } from 'react-bootstrap-icons';

const ForGovernment = () => {
    useEffect(() => { AOS.init({ duration: 1000, once: true }); }, []);
    return (
        <>
            <Helmet>
                <title>For Government | Taxly Academy</title>
                <meta name="description" content="Partner with Taxly Academy to drive digital transformation and workforce development in the public sector." />
            </Helmet>
            <Hero
                backgroundImage="/images/government-banner.jpg"
                title="Digital Transformation for the Public Sector"
                subtitle="Building a More Efficient and Job-Ready Populace Through Digital Skills"
            />
            <section className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6" data-aos="fade-right">
                            <h2 className="display-5 fw-bold mb-3">Modernizing Public Service Delivery</h2>
                            <p className="text-muted fs-5">Taxly Academy partners with government agencies and parastatals to deliver large-scale digital upskilling programs. Our mission is to enhance public sector efficiency, promote youth employment, and support national digital transformation agendas.</p>
                        </div>
                        <div className="col-lg-6" data-aos="fade-left">
                           <img src="/images/public-sector.jpg" alt="A government building" className="img-fluid rounded shadow-lg" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="section-title" data-aos="fade-up">Our Government Partnership Programs</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><People size={40} /></div>
                                <h4 className="fw-bold">Youth Employment Schemes</h4>
                                <p>Collaborate on national youth initiatives by providing our virtual assistant and digital skills training as a pathway to employment.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><Bank size={40} /></div>
                                <h4 className="fw-bold">Civil Service Upskilling</h4>
                                <p>Deploy our courses across ministries and departments to improve digital literacy and prepare civil servants for modern, remote-first workflows.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="400">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><Award size={40} /></div>
                                <h4 className="fw-bold">National Certification Standards</h4>
                                <p>Work with us to establish and roll out recognized national certifications for virtual professional skills, boosting your country's talent profile.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
             <section className="py-5">
                <div className="container">
                     <h2 className="text-center mb-5" data-aos="fade-up">Contact for Government Partnerships</h2>
                    <div className="row justify-content-center">
                        <div className="col-lg-8" data-aos="fade-up">
                            <div className="p-4 p-md-5 bg-white rounded shadow">
                                <form>
                                    <div className="row">
                                        <div className="col-md-6 mb-3"><input type="text" className="form-control" placeholder="Ministry/Agency Name" required /></div>
                                        <div className="col-md-6 mb-3"><input type="text" className="form-control" placeholder="Contact Person's Name" required /></div>
                                    </div>
                                    <div className="mb-3"><input type="email" className="form-control" placeholder="Official Email Address" required /></div>
                                    <div className="mb-3">
                                        <textarea className="form-control" rows="4" placeholder="Please describe your area of interest (e.g., Youth training, Civil service upskilling)..."></textarea>
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

export default ForGovernment;
