import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, GeoAlt} from 'react-bootstrap-icons';
import '../styles/EventCard.css';

const EventCard = ({ event, isPast = false }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="col-md-6 mb-4" data-aos="fade-up">
      {/* The entire card is now a clickable link */}
      <Link to={`/events/${event.id}`} className="event-card-link">
        <div className={`card h-100 shadow-sm event-card ${isPast ? 'past-event' : ''}`}>
          <img src={event.image} alt={event.title} className="card-img-top" loading="lazy"/>
          <div className="card-body d-flex flex-column">
            <div className="mb-2">
                <span className="badge bg-primary me-2">{event.type}</span>
                {isPast && <span className="badge bg-secondary">Archived</span>}
            </div>
            <h5 className="card-title fw-bold">{event.title}</h5>
            <div className="card-text text-muted small mb-2">
                <p className="mb-1"><Calendar className="me-2"/>{formattedDate}</p>
                <p className="mb-0"><GeoAlt className="me-2"/>{event.location}</p>
            </div>
            <p className="card-text flex-grow-1">{event.summary}</p>
            {/* The button provides a clear, secondary call to action */}
            <div className="mt-auto btn btn-outline-primary">
              {isPast ? 'View Recording & Details' : 'View Event & Register'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;