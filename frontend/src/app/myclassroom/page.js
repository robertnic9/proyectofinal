'use client';

import { useState, useEffect } from "react";
import CourseFavorites from "@/components/course-favorites";
import MisCursos from "@/components/miscursos";

export default function MyCoursesPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!user || !user.id) {
    return (
      <main>
        <div className="flex justify-center items-center h-[80vh]">
          <p className="text-gray-500 font-bold text-lg">
            Inicia sesión para poder ver esta página.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="pt-32">
        <CourseFavorites />
        <MisCursos />
      </div>
    </main>
  );
}
