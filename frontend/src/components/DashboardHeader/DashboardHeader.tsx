import React, { useState } from 'react';
import './DashboardHeader.css';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import userAvatar from '../../assets/user-avatar.png';

interface FeedbackItem {
  type: 'warning' | 'info' | 'success';
  message: string;
  date: string;
}

const feedbackData: FeedbackItem[] = [
  {
    type: 'warning',
    message: 'You have not completed the "IT Security Basics" quiz.',
    date: 'Nov 10, 2025'
  },
  {
    type: 'info',
    message: 'You have only spent 2 hours learning this week.',
    date: 'Nov 9, 2025'
  },
  {
    type: 'success',
    message: 'You completed the "Company Overview" module. Great job!',
    date: 'Nov 8, 2025'
  }
];

export function DashboardHeader(): React.ReactElement {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="dashboard-header-container">
      <div className="header-top-row">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>

        <div className="user-controls">
          <div style={{ position: 'relative' }}>
            <button className="notification-button" onClick={toggleNotifications}>
              <FiBell className="bell-icon" />
              <span className="notification-badge"></span>
            </button>

            {/* Dropdown feedback */}
            {showNotifications && (
              <div className="notification-dropdown">
                {feedbackData.map((item, idx) => (
                  <div key={idx} className={`notification-item ${item.type}`}>
                    <div className="notification-date">{item.date}</div>
                    <div className="notification-message">{item.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-section">
            <img src={userAvatar} alt="User Avatar" className="profile-avatar" />
            <FiChevronDown className="profile-arrow" />
          </div>
        </div>
      </div>

      {/* Stat cards rămân la fel */}
      <div className="header-stats-row">
        <div className="stat-card">
          <span className="stat-number">11</span>
          <span className="stat-label">
            Courses
            <br />
            completed
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-number">4</span>
          <span className="stat-label">
            Courses
            <br />
            in progress
          </span>
        </div>
      </div>
    </div>
  );
}
