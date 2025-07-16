import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/EventDetail.css';
import Hero from '../components/Hero';
import { Calendar, GeoAlt, Mic } from 'react-bootstrap-icons';

// Import the single source of truth for event data
import EVENTS from '../data/events';

const EventDetail = () => {
  const { id } = useParams();
  const event = EVENTS.find(e => e.id === parseInt(id));

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  if (!event) return <div className="container text-center py-5"><h2>Event not found.</h2><Link to="/events" className="btn btn-primary mt-3">Back to Events</Link></div>;

  const isPast = new Date(event.date) < new Date();
  const formattedDate = new Date(event.date).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  return (
    <>
    <Helmet>
        <title>{event.title} | Taxly Academy Events</title>
        <meta name="description" content={event.summary} />
    </Helmet>
    <Hero
        backgroundImage={event.image}
        title={event.title}
        subtitle={event.type}
    />
    <section className="event-detail-section py-5">
      <div className="container">
        <div className="row">
            <div className="col-lg-8" data-aos="fade-up">
                <h2 className="fw-bold">{event.title}</h2>
                <div className="d-flex flex-wrap text-muted mb-4">
                    <p className="me-4"><Calendar className="me-2"/>{formattedDate}</p>
                    <p><GeoAlt className="me-2"/>{event.location}</p>
                </div>
                <p className="lead">{event.fullDescription}</p>

                {event.speakers && (
                    <>
                        <h3 className="mt-5 mb-3">Speakers</h3>
                        {event.speakers.map((speaker, idx) => (
                            <div key={idx} className="d-flex align-items-center mb-3">
                                <Mic size={24} className="text-primary me-3"/>
                                <div>
                                    <h6 className="mb-0 fw-bold">{speaker.name}</h6>
                                    <p className="mb-0 text-muted">{speaker.title}</p>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="col-lg-4" data-aos="fade-left" data-aos-delay="200">
                <div className="card shadow-sm sticky-top" style={{top: '120px'}}>
                    <div className="card-body text-center">
                        <h4 className="card-title">{isPast ? 'Event Archive' : 'Register Now'}</h4>
                        <p className="text-muted">{isPast ? 'This event has concluded. You can view the recording below.' : 'Secure your spot for this event. It\'s free!'}</p>
                        <a 
                            href={isPast ? event.recordingLink : event.registrationLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`btn btn-lg w-100 ${isPast ? 'btn-secondary' : 'btn-primary'}`}
                        >
                            {isPast ? 'Watch Recording' : 'Register for Free'}
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default EventDetail;