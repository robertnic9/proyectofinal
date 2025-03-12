"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function StudentsPage() {
  const { courseId } = useParams(); 
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `http://localhost/online/backend/controlers/getstudents.php?courseId=${courseId}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener los estudiantes");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  const handleRemoveStudent = async (userId) => {
    if (!confirm("¿Seguro que quieres eliminar a este estudiante del curso?"))
      return;

    try {
      const response = await fetch(
        `http://localhost/online/backend/controlers/removestudents.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, userId }),
          credentials :'include'
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar al estudiante");
      }

      setStudents((prevStudents) =>
        prevStudents.filter((s) => s.id !== userId)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-gray-500">Cargando estudiantes...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (students.length === 0)
    return <p className="text-yellow-500">No hay estudiantes inscritos.</p>;

  return (
    <main>
      <div className="container mx-auto px-4 py-8 min-h-screen pt-32">
        <h2 className="text-2xl uppercase font-bold mb-6">Estudiantes inscritos</h2>
        <div className="grid grid-cols-1  gap-6">
          {students.map((student) => (
            <div
                    key={student.id}
                    className="p-4 border rounded-lg shadow bg-white flex justify-between items-center"
                >
                <div className="flex items-center">
                <Image
                    src={student.profile_picture || "/media/sinfoto.webp"}
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
                onClick={() => handleRemoveStudent(student.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center mt-10">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            ⬅ Volver
          </button>
        </div>
      </div>
    </main>
  );
}
