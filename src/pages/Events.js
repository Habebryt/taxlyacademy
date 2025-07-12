import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import EventCard from "../components/EventCard";
import "../styles/Events.css";
import AOS from "aos";
import "aos/dist/aos.css";

const upcomingEvents = [
  {
    id: 1,
    title: "Virtual Assistant Bootcamp",
    date: "August 20, 2025",
    location: "Online",
    description:
      "A 3-day live training to launch your career as a virtual assistant.",
    image: "/images/va-bootcamp.jpg",
  },
  {
    id: 2,
    title: "Compliance for Startups Webinar",
    date: "September 5, 2025",
    location: "Zoom",
    description:
      "Understand African business regulations with experts from Taxly.",
    image: "/images/compliance-webinar.jpg",
  },
];

const pastEvents = [
  {
    id: 3,
    title: "Remote Work Readiness Workshop",
    date: "May 12, 2025",
    location: "Online",
    description:
      "We trained over 100 attendees on tools and tips for remote work.",
    image: "/images/remote-readiness.jpg",
  },
  {
    id: 4,
    title: "Tax for Freelancers",
    date: "March 3, 2025",
    location: "Online",
    description:
      "Our tax experts hosted a live Q&A with freelancers across Africa.",
    image: "/images/freelance-tax.jpg",
  },
];

const Events = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Helmet>
        <title>Events | Taxly Academy</title>
        <meta
          name="description"
          content="Join our upcoming webinars, training sessions, and networking events for virtual professionals."
        />
        <meta property="og:title" content="Events | Taxly Academy" />
        <meta
          property="og:description"
          content="Stay informed about the latest training and community events."
        />
      </Helmet>

      <Hero
        backgroundImage="/images/events-banner.jpg"
        title="Our Events & Trainings"
        subtitle="Join workshops, webinars, and live sessions to boost your virtual skills."
        ctaText="Explore Events"
      />

      <section className="event-section py-5">
        <div className="container">
          <h2 className="mb-4" data-aos="fade-up">
            Upcoming Events
          </h2>
          <div className="row">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <h2 className="mt-5 mb-4" data-aos="fade-up">
            Past Events
          </h2>
          <div className="row">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;
