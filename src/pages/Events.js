import React, { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import EventCard from "../components/EventCard";
import "../styles/Events.css";
import AOS from "aos";
import "aos/dist/aos.css";
import EVENTS from '../data/events';

const Events = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];
    const sortedEvents = [...EVENTS].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedEvents.forEach(event => {
      if (new Date(event.date) > now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });
    return { upcomingEvents: upcoming.reverse(), pastEvents: past };
  }, []);

  return (
    <>
      <Helmet>
        <title>Events | Taxly Academy</title>
        <meta name="description" content="Join our upcoming webinars, training sessions, and networking events for virtual professionals." />
      </Helmet>

      <Hero
        backgroundImage="/images/events-banner.jpg"
        title="Our Events & Trainings"
        subtitle="Join workshops, webinars, and live sessions to boost your virtual skills."
      />

      <section className="event-section py-5">
        <div className="container">
          <h2 className="mb-4" data-aos="fade-up">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="row">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-muted" data-aos="fade-up">No upcoming events scheduled at the moment. Please check back soon!</p>
          )}

          <h2 className="mt-5 mb-4" data-aos="fade-up">Past Events</h2>
          {pastEvents.length > 0 ? (
            <div className="row">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} isPast={true} />
              ))}
            </div>
          ) : (
             <p className="text-muted" data-aos="fade-up">No past events to show.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Events;