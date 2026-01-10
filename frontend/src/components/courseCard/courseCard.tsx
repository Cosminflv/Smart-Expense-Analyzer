import React from 'react';
import './courseCard.css';

export interface CourseCardProps {
  imageUrl: string;
  title: string;
  author: string;
  progress: number; // % din bugetul lunar
}

export function CourseCard({
  imageUrl,
  title,
  author,
  progress,
}: CourseCardProps): React.ReactElement {
  const progressStyle = {
    '--progress-value': `${progress}%`,
  } as React.CSSProperties;

  return (
    <div className="course-card">
      <img src={imageUrl} alt={title} className="course-icon" />

      <div className="course-info">
        <span className="course-title">{title}</span>
        <span className="course-author">{author}</span>
      </div>

      <div className="progress-circle" style={progressStyle}>
        <div className="progress-inner-circle">
          <span className="progress-text">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
