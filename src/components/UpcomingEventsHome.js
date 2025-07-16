import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/UpcomingEventsHome.css';

import EVENTS from '../data/events';

import { Calendar, GeoAlt, ArrowRightCircle } from 'react-bootstrap-icons';

const UpcomingEventsHome = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const nextTwoEvents = useMemo(() => {
    const now = new Date();
    
    const upcoming = EVENTS.filter(event => new Date(event.date) > now);

    const sortedUpcoming = upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

    return sortedUpcoming.slice(0, 2);
  }, []);

  if (nextTwoEvents.length === 0) {
    return null;
  }

  return (
    <section className="upcoming-events-section py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title" data-aos="fade-up">Upcoming Events</h2>
          <p className="section-subtitle text-muted" data-aos="fade-up" data-aos-delay="100">
            Join our live sessions to learn from industry experts and connect with the community.
          </p>
        </div>

        <div className="row justify-content-center">
          {nextTwoEvents.map((event, index) => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                
            });
            const formattedDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' });

            return (
              <div className="col-lg-5 col-md-6 mb-4" key={event.id} data-aos="fade-up" data-aos-delay={index * 150}>
                <div className="event-home-card card h-100 shadow-sm text-center text-md-start">
                  <div className="card-body d-md-flex align-items-center">
                    <div className="event-date-box text-primary me-md-4 mb-3 mb-md-0">
                      <div className="fs-1 fw-bold">{formattedDate.split(' ')[1]}</div>
                      <div className="fs-6 text-uppercase">{formattedDate.split(' ')[0]}</div>
                      <div className="small text-muted">{formattedDay}</div>
                    </div>
                    <div className="event-details">
                      <span className="badge bg-primary-subtle text-primary-emphasis mb-2">{event.type}</span>
                      <h5 className="fw-bold">{event.title}</h5>
                      <p className="text-muted small mb-3">
                        <GeoAlt className="me-1" /> {event.location}
                      </p>
                      <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm">
                        Learn More & Register
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {EVENTS.length > 2 && (
             <div className="text-center mt-4" data-aos="fade-up">
                <Link to="/events" className="btn btn-lg btn-primary">
                    View All Events <ArrowRightCircle className="ms-2" />
                </Link>
            </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEventsHome;