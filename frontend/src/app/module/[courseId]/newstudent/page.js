"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";

export default function AddStudentsPage() {
  const { courseId } = useParams();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    isLoading,
    isError,
    data: students,
  } = useFetch(
    `http://localhost/online/backend/controlers/newstudent.php?courseId=${courseId}`
  );

  useEffect(() => {
    if (students) {
      const filtered = students.filter((student) => {
        const fullName = `${student.name} ${student.firstsurname} ${
          student.secondsurname || ""
        }`;
        return fullName.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleAddStudent = async (userId) => {
    if (!confirm("¿Seguro que quieres añadir a este estudiante al curso?"))
      return;

    try {
      const response = await fetch(
        `http://localhost/online/backend/controlers/newstudent.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, userId }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al añadir al estudiante");
      }

      alert("Estudiante añadido correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading)
    return <p className="text-gray-500">Cargando estudiantes...</p>;
  if (isError)
    return <p className="text-red-500">Error al cargar los estudiantes</p>;

  return (
    <main>
      <div className="container mx-auto px-4 py-8 min-h-screen pt-32">
        <h2 className="text-2xl uppercase font-bold mb-6">
          Añadir estudiantes al curso
        </h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="grid grid-cols-1 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="p-4 border rounded-lg shadow bg-white flex justify-between items-center"
            >
              <div className="flex items-center">
                <Image
                  src={student.profile_picture || "/default-profile.png"}
                  alt={`${student.name} ${student.firstsurname}`}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {student.name} {student.firstsurname}{" "}
                    {student.secondsurname || ""}
                  </h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleAddStudent(student.id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Añadir
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
