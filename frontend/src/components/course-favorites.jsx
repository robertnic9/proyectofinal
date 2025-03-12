"use client";

import { CourseCard } from "./course-card";
import { useState, useEffect } from "react";

export default function CourseFavorites() {
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost/online/backend/controlers/getfavorites.php",
          {
            credentials: "include",
          }
        );

        const data = await response.json();
        setFavoriteCourses(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching favorite courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteCourses();
  }, []);
  console.log(favoriteCourses);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading your favorite courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  if (favoriteCourses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-6">TUS FAVORITOS</h2>
        <div className="font-bold ml-8 text-xl">
          <p>No tienes nigun curso en favoritos</p>
          <p>Añade un curso en favoritos para que salga!!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-6">TUS FAVORITOS</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 space-x-10">
        {favoriteCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
