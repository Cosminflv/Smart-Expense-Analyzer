import React from 'react';
import { FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './EmptyDashboardState.css';

export function EmptyDashboardState(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="empty-dashboard-wrapper">
      <div className="empty-dashboard-card">
        <div className="empty-icon">
          <FiUpload />
        </div>

        <h2 className="empty-title">
          No expenses yet
        </h2>

        <p className="empty-description">
          Upload your bank statement and we’ll automatically analyze
          your spending, categories and monthly trends.
        </p>

        <button
          className="primary-button"
          onClick={() => navigate("/upload")}
        >
          Upload bank statement
        </button>
      </div>
    </div>
  );
}
