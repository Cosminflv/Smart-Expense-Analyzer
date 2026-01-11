import React, { useState } from 'react';
import './DashboardHeader.css';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';

export function DashboardHeader(): React.ReactElement {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="dashboard-header-container">
      <div className="header-top-row"></div>

      <div className="header-stats-row">
        <div className="stat-card">
          <span className="stat-number">128</span>
          <span className="stat-label">
            Transactions
            <br />
            this month
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-number">7</span>
          <span className="stat-label">
            Categories
            <br />
            used
          </span>
        </div>
      </div>
    </div>
  );
}
