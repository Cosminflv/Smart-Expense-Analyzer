import React from "react";
import "./WelcomeCard.css";
import humanImage from "../../assets/boy.png";

export function WelcomeCard(): React.ReactElement {
  const storedUser = localStorage.getItem("currentUser");
  const username = storedUser
    ? JSON.parse(storedUser).username
    : "there";

  return (
    <div className="welcome-card">
      <div className="welcome-text-content">
        <h2 className="welcome-heading">
          Welcome back, {username}!
        </h2>
        <p className="welcome-subtext">
          Here’s a quick overview of your finances today.
        </p>
      </div>

      <div className="welcome-image-container">
        <img
          src={humanImage}
          alt="Waving human character"
          className="welcome-human-image"
        />
      </div>
    </div>
  );
}
