import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/EventDetail.css';

// Mock data; in real apps, fetch by event ID
const eventData = {
  1: {
    title: "Virtual Assistant Bootcamp",
    date: "August 20, 2025",
    location: "Online (Zoom)",
    description: "This 3-day virtual bootcamp helps you kickstart your career as a Virtual Assistant. You’ll learn admin tools, productivity hacks, email management, and how to land your first client.",
    image: "/images/va-bootcamp.jpg"
  },
  2: {
    title: "Compliance for Startups Webinar",
    date: "September 5, 2025",
    location: "Zoom",
    description: "Understand CAC, tax filing, NDPR, and other startup compliance essentials in Africa.",
    image: "/images/compliance-webinar.jpg"
  }
};

const EventDetail = () => {
  const { id } = useParams();
  const event = eventData[id];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  if (!event) return <p className="text-center mt-5">Event not found.</p>;

  return (
    <section className="event-detail-section py-5">
      <div className="container">
        <div className="row align-items-center mb-4">
          <div className="col-md-6" data-aos="fade-right">
            <img src={event.image} alt={event.title} className="img-fluid rounded shadow" />
          </div>
          <div className="col-md-6" data-aos="fade-left">
            <h2>{event.title}</h2>
            <p className="text-muted"><strong>{event.date}</strong> | {event.location}</p>
            <p>{event.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetail;
