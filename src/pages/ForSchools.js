import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '../components/Hero';
import { Book, Mortarboard, ShieldCheck } from 'react-bootstrap-icons';

const ForSchools = () => {
    useEffect(() => { AOS.init({ duration: 1000, once: true }); }, []);
    return (
        <>
            <Helmet>
                <title>For Secondary Schools | Taxly Academy</title>
                <meta name="description" content="Prepare your students for the future of work with Taxly Academy's digital skills programs for secondary schools." />
            </Helmet>
            <Hero
                backgroundImage="/images/school-banner.jpg"
                title="Prepare Students for the Future, Today"
                subtitle="Introduce Practical Digital and Vocational Skills in Your School"
            />
            <section className="py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6" data-aos="fade-right">
                            <h2 className="display-5 fw-bold mb-3">Beyond the Traditional Curriculum</h2>
                            <p className="text-muted fs-5">In a world where digital literacy is paramount, it's essential to equip students with practical skills that complement their academic learning. Taxly Academy offers programs designed specifically for secondary school students to give them a head start in the digital world.</p>
                        </div>
                        <div className="col-lg-6" data-aos="fade-left">
                           <img src="/images/teen-students.jpg" alt="Young students learning on laptops" className="img-fluid rounded shadow-lg" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <h2 className="section-title" data-aos="fade-up">Our Programs for Schools</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><Book size={40} /></div>
                                <h4 className="fw-bold">Digital Literacy Clubs</h4>
                                <p>We provide the curriculum and support to help you launch an after-school Digital Skills or Virtual Assistant club.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><Mortarboard size={40} /></div>
                                <h4 className="fw-bold">Holiday Bootcamps</h4>
                                <p>Offer our intensive, week-long virtual bootcamps during school holidays to teach students valuable vocational skills.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="400">
                            <div className="icon-box p-4 h-100">
                                <div className="icon-box-icon text-primary mb-3"><ShieldCheck size={40} /></div>
                                <h4 className="fw-bold">Teacher Training</h4>
                                <p>We can train your ICT teachers to deliver our foundational digital skills curriculum directly to your students.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
             <section className="py-5">
                <div className="container">
                     <h2 className="text-center mb-5" data-aos="fade-up">Partner With Our Academy</h2>
                    <div className="row justify-content-center">
                        <div className="col-lg-8" data-aos="fade-up">
                            <div className="p-4 p-md-5 bg-white rounded shadow">
                                <form>
                                    <div className="row">
                                        <div className="col-md-6 mb-3"><input type="text" className="form-control" placeholder="School Name" required /></div>
                                        <div className="col-md-6 mb-3"><input type="text" className="form-control" placeholder="Your Name / Title" required /></div>
                                    </div>
                                    <div className="mb-3"><input type="email" className="form-control" placeholder="School or Work Email" required /></div>
                                    <div className="mb-3">
                                        <textarea className="form-control" rows="4" placeholder="How would you like to partner with us?"></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Send Partnership Inquiry</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ForSchools;
