"use client";

import { useState, useEffect } from "react";
import { CourseCard } from "./course-card";

export default function MisCursos() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost/online/backend/controlers/getcourses.php",{
            credentials : 'include'
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        console.log("Fetched courses:", data);

        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading courses...</div>
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

  if (courses.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>No se ha encontrado nigun curso</p>
        <p>Dile a tu professor que te inscriba!! O Crea uno si eres professor !!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl uppercase font-bold mb-6">Tus cursos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  space-x-10">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
