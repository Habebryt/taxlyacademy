import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/EventCard.css';

const EventCard = ({ event }) => {
  return (
    <div className="col-md-6 mb-4" data-aos="fade-up">
      <div className="card h-100 shadow-sm">
        <img src={event.image} alt={event.title} className="card-img-top" loading="lazy"/>
        <div className="card-body">
          <h5 className="card-title">{event.title}</h5>
          <p className="card-text text-muted"><strong>{event.date}</strong> • {event.location}</p>
          <p className="card-text">{event.description}</p>
          <Link to={`/events/${event.id}`} className="btn btn-outline-primary mt-2">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
