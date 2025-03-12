"use client";
import { CourseCard } from "./course-card";
import { useEffect, useState, useLayoutEffect, useRef } from "react";

export function CourseCarrousel() {
  const [courses, setCourses] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [maxPosition, setMaxPosition] = useState(0);
  const carouselRef = useRef(null);
  const itemWidth = 400; // Width of each item in pixels

  useEffect(() => {
    fetch("http://localhost/online/backend/controlers/cursoinfo.php")
      .then((response) => response.json())
      .then((coursesData) => {
        setCourses(coursesData);
        // Calculate max position based on number of courses
        if (carouselRef.current) {
          const containerWidth = carouselRef.current.clientWidth;
          const visibleItems = Math.floor(containerWidth / itemWidth);
          setMaxPosition(Math.max(0, coursesData.length - visibleItems));
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  // Recalculate max position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.clientWidth;
        const visibleItems = Math.floor(containerWidth / itemWidth);
        setMaxPosition(Math.max(0, courses.length - visibleItems));

        // Ensure current position is not out of bounds after resize
        setCurrentPosition((prev) =>
          Math.min(prev, Math.max(0, courses.length - visibleItems))
        );
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [courses.length]);

  // Use layout effect to ensure DOM updates before browser paint
  useLayoutEffect(() => {
    if (carouselRef.current) {
      // Force a browser reflow to ensure smooth transitions
      const containerWidth = carouselRef.current.clientWidth;
      const visibleItems = Math.floor(containerWidth / itemWidth);
      setMaxPosition(Math.max(0, courses.length - visibleItems));
    }
  }, [currentPosition, courses.length]);

  const handlePrevious = () => {
    setCurrentPosition((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentPosition((prev) => (prev < maxPosition ? prev + 1 : maxPosition));
  };

  return (
    <div className="relative my-20">
      <h2 className="text-6xl text-center uppercase underline font-bold my-6">Nuestros Cursos</h2>

      <div className="relative pl-8">
        {/* Container with left margin and visual cue on right */}
        <div ref={carouselRef} className="relative overflow-hidden">
          {/* Carrusel de cursos */}
          <div
            className="flex flex-row pl-12 pr-4 py-6 space-x-10"
            style={{
              transform: `translateX(-${currentPosition * itemWidth}px)`,
              transition: "transform 0.5s ease-in-out",
              willChange: "transform", // Performance optimization
            }}
          >
            {courses.map((curso, index) => (
              <div key={index} className="w-96 mx-0">
                <CourseCard course={curso} />
              </div>
            ))}
          </div>
        </div>

        {/* Botones de navegación en los laterales */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          <div className="w-full flex justify-between pointer-events-auto">
            <button
              onClick={handlePrevious}
              className="bg-white text-gray-800 rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:bg-gray-100 focus:outline-none z-10"
              disabled={currentPosition === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="bg-white text-gray-800 rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:bg-gray-100 focus:outline-none z-10"
              disabled={currentPosition >= maxPosition}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Visual indicator that shows there's more content */}
        {currentPosition < maxPosition && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
}
