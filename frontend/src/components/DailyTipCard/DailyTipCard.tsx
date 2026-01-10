import React from 'react';
import './DailyTipCard.css';
import { TfiLightBulb } from 'react-icons/tfi';

export function DailyTipCard(): React.ReactElement {
  return (
    <div className="daily-tip-card-container">
      <div className="tip-text-content">
        <h3 className="tip-heading">Daily finance tip</h3>
        <p className="tip-description">
          Track small expenses — they add up faster than you think.
        </p>
        <button className="tip-button">Upload bank statement</button>
      </div>

      <div className="tip-image-container">
        <TfiLightBulb className="tip-icon" />
      </div>
    </div>
  );
}
