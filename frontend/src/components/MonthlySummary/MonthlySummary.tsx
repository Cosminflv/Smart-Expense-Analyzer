import React, { useState } from 'react';

import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { CourseCard, type CourseCardProps } from '../courseCard/courseCard';

const mockCourses: CourseCardProps[] = [
  {
    imageUrl: 'https://png.pngtree.com/png-vector/20221118/ourmid/pngtree-flat-style-audit-icon-with-result-report-on-white-background-vector-png-image_41384148.jpg', 
    title: 'Company Overview',
    author: 'by HR Team',
    progress: 30,
  }, 
    {
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/102/102649.png', 
    title: 'IT Security Basics',
    author: 'by IT Department',
    progress: 50,
  },
 {
    imageUrl: 'https://img.freepik.com/premium-vector/process-icon_1134231-32251.jpg', 
    title: 'Internal Tools Training',
    author: 'by IT Support',
    progress: 10,
  },
];

export function MonthlySummary(): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstCard = currentIndex === 0;
    const newIndex = isFirstCard ? mockCourses.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastCard = currentIndex === mockCourses.length - 1;
    const newIndex = isLastCard ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="course-carousel-container">
      <CourseCard {...mockCourses[currentIndex]} />

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