import React from 'react';
import './DailyTipCard.css';
import { TfiLightBulb } from "react-icons/tfi";

export function DailyTipCard(): React.ReactElement {
  return (
    <div className="daily-tip-card-container">
      
      <div className="tip-text-content">
        <h3 className="tip-heading">Daily Learning Tip</h3>
        <p className="tip-description">
          A small effort each day leads to big results.
        </p>
        <button className="tip-button">Start a course</button>
      </div>

      <div className="tip-image-container">
        <TfiLightBulb className="tip-icon" />
      </div>
    </div>
  );
}