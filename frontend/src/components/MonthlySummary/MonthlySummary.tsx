import React, { useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { CourseCard, type CourseCardProps } from '../courseCard/courseCard';

// Mock data – sumar lunar financiar
const monthlySummaries: CourseCardProps[] = [
  {
    imageUrl: '/icons/january.png',
    title: 'January 2026',
    author: 'Spent: 1,250 €',
    progress: 62, // % din buget
  },
  {
    imageUrl: '/icons/february.png',
    title: 'February 2026',
    author: 'Spent: 980 €',
    progress: 49,
  },
  {
    imageUrl: '/icons/march.png',
    title: 'March 2026',
    author: 'Spent: 1,430 €',
    progress: 71,
  },
];

export function MonthlySummary(): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? monthlySummaries.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === monthlySummaries.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="course-carousel-container">
      <CourseCard {...monthlySummaries[currentIndex]} />

      <div className="nav-arrows">
        <button className="nav-button" onClick={goToPrevious}>
          <FiArrowLeft />
        </button>
        <button className="nav-button" onClick={goToNext}>
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
