import React from 'react';
import './WelcomeCard.css'; // The CSS file remains the same

// Replace 'your-human-image.png' with the actual path to your downloaded Flaticon PNG
// Make sure you have a .d.ts file or a bundler rule to handle image imports
import humanImage from '../../assets/boy.png'; 

export function WelcomeCard(): React.ReactElement {
  return (
    <div className="welcome-card">
      <div className="welcome-text-content">
        <h2 className="welcome-heading">Welcome back, Cosbos!</h2>
        <p className="welcome-subtext"> Here’s a quick overview of your finances today.</p>
      </div>
      <div className="welcome-image-container">
        <img src={humanImage} alt="Waving human character" className="welcome-human-image" />
      </div>
    </div>
  );
}