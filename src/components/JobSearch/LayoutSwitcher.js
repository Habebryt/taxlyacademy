import React from 'react';

const LayoutSwitcher = ({ currentView, onViewChange }) => {
  return (
    <div className="d-flex justify-content-end align-items-center mb-4">
      <span className="me-2 text-muted">View:</span>
      <div className="btn-group">
        <button
          title="4-Column Grid"
          className={`btn btn-sm ${currentView === 'grid-4' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => onViewChange('grid-4')}
        >
          4
        </button>
        <button
          title="3-Column Grid"
          className={`btn btn-sm ${currentView === 'grid-3' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => onViewChange('grid-3')}
        >
          3
        </button>
        <button
          title="2-Column Grid"
          className={`btn btn-sm ${currentView === 'grid-2' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => onViewChange('grid-2')}
        >
          2
        </button>
        <button
          title="Table View"
          className={`btn btn-sm ${currentView === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => onViewChange('table')}
        >
          List
        </button>
      </div>
    </div>
  );
};

export default LayoutSwitcher;