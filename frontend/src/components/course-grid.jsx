"use client";
import { CourseCard } from "./course-card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter para la navegación

export function CoursesGrid() {
  const [courses, setCourses] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    description: "",
    image: "",
    teacher_id: "",
  });
  const [resultMessage, setResultMessage] = useState(null);
  const [resultSuccess, setResultSuccess] = useState(null);

  const router = useRouter(); // Usa useRouter para la navegación

  // Obtenemos la información del usuario al cargar el componente
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role === "teacher") {
        setIsTeacher(true);
        // Pre-establecemos el teacher_id para el nuevo curso
        setNewCourseData((prev) => ({ ...prev, teacher_id: user.id }));
      }
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost/online/backend/controlers/cursoinfo.php")
      .then((response) => response.json())
      .then((coursesData) => {
        setCourses(coursesData);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleNewCourseChange = (e) => {
    setNewCourseData({ ...newCourseData, [e.target.name]: e.target.value });
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/online/backend/controlers/inserts/insertcourse.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCourseData),
          credentials: "include",
        }
      );

      const result = await response.json();
      setResultSuccess(result.success);
      setResultMessage(result.message);

      if (result.success) {
        // Si fue exitoso, cerramos el modal y actualizamos la lista de cursos
        setShowCreateModal(false);

        // Reiniciamos el formulario
        setNewCourseData({
          title: "",
          description: "",
          image: "",
          teacher_id: newCourseData.teacher_id, // Mantenemos el ID del profesor
        });

        // Refrescamos la lista de cursos
        fetch("http://localhost/online/backend/controlers/cursoinfo.php")
          .then((response) => response.json())
          .then((coursesData) => {
            setCourses(coursesData);
          });
      }
    } catch (error) {
      console.error("Error al crear el curso:", error);
      setResultSuccess(false);
      setResultMessage("Error al conectar con el servidor");
    }
  };

  // Función para redirigir a la página de eliminación de cursos
  const handleDeleteCourses = () => {
    router.push("/courses/delete"); 
  };

  return (
    <div className="container mx-auto sm:px-4 pt-36 relative">
      <h2 className="text-5xl text-center uppercase font-bold mb-8">
        Nuestros Cursos
      </h2>
      {/* Mensaje de resultado */}
      {resultMessage && (
        <div
          className={`text-center p-3 mb-4 rounded ${
            resultSuccess
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {resultMessage}
        </div>
      )}

      {/* Sección para crear curso (solo para profesores) */}
      {isTeacher && (
        <div className="bg-white shadow-md rounded-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Área de profesor</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-lime-700 text-white rounded-md hover:bg-lime-800 transition"
            >
              Crear un nuevo curso
            </button>
          </div>
        </div>
      )}

      {/* Grid de cursos responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((curso, index) => (
          <div key={index} className="flex justify-center">
            <CourseCard course={curso} />
          </div>
        ))}
      </div>

      {/* Modal para crear nuevo curso */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl mb-4">Crear Nuevo Curso</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del curso
                </label>
                <input
                  type="text"
                  name="title"
                  value={newCourseData.title}
                  onChange={handleNewCourseChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={newCourseData.description}
                  onChange={handleNewCourseChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de la imagen
                </label>
                <input
                  type="text"
                  name="image"
                  value={newCourseData.image}
                  onChange={handleNewCourseChange}
                  className="w-full p-2 border rounded"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-lime-700 text-white rounded-md hover:bg-lime-800 transition"
                >
                  Crear Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
