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
    message: 'You have exceeded your food budget for this month.',
    date: 'Jan 10, 2026',
  },
  {
    type: 'info',
    message: 'You spent 120 € on groceries this week.',
    date: 'Jan 9, 2026',
  },
  {
    type: 'success',
    message: 'Great job! You stayed within your monthly budget.',
    date: 'Jan 8, 2026',
  },
];

export function DashboardHeader(): React.ReactElement {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <div className="dashboard-header-container">
      <div className="header-top-row">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search transactions..." />
        </div>

        <div className="user-controls">
          <div style={{ position: 'relative' }}>
            <button
              className="notification-button"
              onClick={toggleNotifications}
            >
              <FiBell className="bell-icon" />
              <span className="notification-badge"></span>
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                {feedbackData.map((item, idx) => (
                  <div
                    key={idx}
                    className={`notification-item ${item.type}`}
                  >
                    <div className="notification-date">{item.date}</div>
                    <div className="notification-message">
                      {item.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="profile-section">
            <img
              src={userAvatar}
              alt="User Avatar"
              className="profile-avatar"
            />
            <FiChevronDown className="profile-arrow" />
          </div>
        </div>
      </div>

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
