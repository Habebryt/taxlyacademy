// src/pages/dashboard/common/StatCard.js

import React from 'react';
import { Spinner } from 'react-bootstrap-icons';

/**
 * A reusable card for displaying a single statistic on a dashboard.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.icon - The icon to display on the card.
 * @param {string} props.title - The title or label for the statistic.
 * @param {string|number} props.value - The value of the statistic.
 * @param {boolean} props.loading - Indicates if the data for the card is still loading.
 */
const StatCard = ({ icon, title, value, loading }) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="stat-icon-wrapper text-primary bg-primary-subtle me-3">
            {icon}
          </div>
          <div>
            <h6 className="card-title text-muted mb-1">{title}</h6>
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <h4 className="card-text fw-bold mb-0">{value}</h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
