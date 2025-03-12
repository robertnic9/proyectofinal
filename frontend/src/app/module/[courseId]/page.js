"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import useFetch from "../../../hooks/useFetch";

export default function CourseIdPage({ params }) {
  // Desenvolvemos `params` usando React.use()
  const resolvedParams = React.use(params);
  const { courseId } = resolvedParams;
  
  const [modules, setModules] = useState([]);
  const [accessError, setAccessError] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherMenuOpen, setTeacherMenuOpen] = useState(false);

  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const [moduleFormData, setModuleFormData] = useState({ name: "" });
  const [lessonFormData, setLessonFormData] = useState({
    name: "",
    details: "",
    video_url: "",
  });

  const router = useRouter();

  // Verificar acceso antes de cargar los módulos
  const {
    isLoading: isAccessLoading,
    isError: isAccessError,
    data: accessData,
  } = useFetch(
    courseId
      ? `http://localhost/online/backend/controlers/checkacess.php?courseId=${courseId}`
      : null
  );


  useEffect(() => {
    if (!isAccessLoading && !isAccessError && accessData) {
      if (!accessData.hascourse) {
        setAccessError(true);
        toast.error(
          "No tienes acceso a este curso. Serás redirigido a la página principal en 3 segundos."
        );
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setIsTeacher(accessData.isTeacher);
      }
    } else if (isAccessError) {
      setAccessError(true);
    }
  }, [isAccessLoading, isAccessError, accessData, router]);

  // Cargar módulos solo si el usuario tiene acceso
  const {
    isLoading: isModulesLoading,
    isError: isModulesError,
    data: modulesData,
  } = useFetch(
    courseId && !accessError
      ? `http://localhost/online/backend/controlers/getmodules.php?courseId=${courseId}`
      : null
  );

  useEffect(() => {
    if (!isModulesLoading && !isModulesError && modulesData) {
      setModules(modulesData);
    }
  }, [isModulesLoading, isModulesError, modulesData]);

  // Función para recargar los módulos después de una actualización
  const reloadModules = async () => {
    try {
      const response = await fetch(
        `http://localhost/online/backend/controlers/getmodules.php?courseId=${courseId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error("Error al recargar los módulos:", error);
      toast.error("Error al recargar los módulos");
    }
  };

  // Función para manejar el clic en el botón desplegable
  const toggleLessons = (moduleId) => {
    setModules((prevModules) =>
      prevModules.map((mod) =>
        mod.id === moduleId ? { ...mod, showLessons: !mod.showLessons } : mod
      )
    );
  };

  // Manejadores para formularios
  const handleModuleChange = (e) => {
    setModuleFormData({ ...moduleFormData, [e.target.name]: e.target.value });
  };

  const handleLessonChange = (e) => {
    setLessonFormData({ ...lessonFormData, [e.target.name]: e.target.value });
  };

  // Función para crear un nuevo módulo
  const newModule = () => {
    setModuleFormData({ name: "" });
    setShowModuleModal(true);
  };

  // Función para abrir modal de nueva lección
  const newLesson = (moduleId) => {
    setCurrentModuleId(moduleId);
    setLessonFormData({ name: "", details: "", video_url: "" });
    setShowLessonModal(true);
  };

  // Función para enviar el formulario de nuevo módulo
  const handleModuleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/online/backend/controlers/inserts/insertmodule.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...moduleFormData,
            courseId: courseId,
          }),
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Módulo creado con éxito");
        reloadModules();
        setModuleFormData({ name: "" });
        setShowModuleModal(false);
      } else {
        toast.error(result.message || "Error al crear el módulo");
      }
    } catch (error) {
      console.error("Error al crear el módulo:", error);
      toast.error("Error al conectar con el servidor");
    }
  };

  // Función para enviar el formulario de nueva lección
  const handleLessonSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/online/backend/controlers/inserts/insertlesson.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...lessonFormData,
            moduleId: currentModuleId,
          }),
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Lección creada con éxito");
        reloadModules();
        setLessonFormData({ name: "", details: "", video_url: "" });
        setShowLessonModal(false);
      } else {
        toast.error(result.message || "Error al crear la lección");
      }
    } catch (error) {
      console.error("Error al crear la lección:", error);
      toast.error("Error al conectar con el servidor");
    }
  };

  const answerQuizes = () => {
    router.push(`/module/${courseId}/quiz`);
  };

  if (isAccessLoading || isModulesLoading) {
    return (
      <main>
        <ToastContainer position="top-center" autoClose={3000} />
        <div className="container mx-auto pt-20 px-16 flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Cargando...</h2>
          </div>
        </div>
      </main>
    );
  }

  if (accessError) {
    return (
      <main>
        <ToastContainer position="top-center" autoClose={3000} />
        <div className="container mx-auto pt-20 px-16 h-screen flex justify-center items-center">
          <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="text-2xl font-bold mb-2">Error de acceso</h2>
            <p>No tienes acceso a este curso.</p>
            <p>Serás redirigido a la página principal en 3 segundos...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="container mx-auto pt-40 mb-40 md:px-16 min-h-screen relative">
        <h1 className="text-5xl uppercase font-bold text-center my-8">
          Módulos del Curso {courseId}
        </h1>

        {modules.map((mod) => (
          <div key={mod.id} className="bg-white shadow-md rounded-md p-6 mb-4">
            <div className="flex space-y-4 flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-xl font-semibold">{mod.name}</h2>
                <p className="text-gray-600">Módulo {mod.number}</p>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => toggleLessons(mod.id)}
              >
                {mod.showLessons
                  ? "▲ Ocultar Lecciones"
                  : "▼ Mostrar Lecciones"}
              </button>
            </div>
            {mod.showLessons && (
              <div className="mt-4">
                {mod.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-gray-100 p-4 rounded-md mb-2 flex flex-col space-y-4 md:flex-row md:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">
                        {lesson.number}) {lesson.name}
                      </h3>
                      <p className="text-gray-600">{lesson.details}</p>
                    </div>
                    <a
                      href={lesson.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold px-2 rounded flex items-center"
                    >
                      Ir al Video
                    </a>
                  </div>
                ))}

                {isTeacher && (
                  <div className="bg-gray-100 p-4 rounded-md mb-2 flex justify-center flex-col items-center">
                    <p className="font-bold mb-4">Añadir una nueva lección</p>
                    <button
                      onClick={() => newLesson(mod.id)}
                      className="bg-gray-500 hover:bg-gray-700 text-white px-2 rounded flex py-4 text-center"
                    >
                      Crear una nueva lección
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isTeacher && (
          <div className="bg-white shadow-md rounded-md p-6 mb-4 flex justify-center flex-col items-center">
            <h1 className="font-bold mb-4">Crear nuevo módulo</h1>
            <button
              onClick={newModule}
              className="bg-gray-500 hover:bg-gray-700 text-white px-2 rounded flex py-4 text-center"
            >
              Crear nuevo módulo
            </button>
          </div>
        )}
      </div>

      {/* Menú flotante para estudiante */}
      {!isTeacher && (
        <div className="fixed bottom-12 right-10">
          <button
            onClick={answerQuizes}
            className="px-2 py-5 bg-green-600 rounded-3xl text-white"
          >
            Contestar cuestionarios
          </button>
        </div>
      )}

      {/* Menú flotante para profesores */}
      {isTeacher && (
        <div className="fixed bottom-12 right-10">
          <button
            onClick={() => setTeacherMenuOpen(!teacherMenuOpen)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
          >
            {teacherMenuOpen ? "✕" : "🛠️"}
          </button>

          {teacherMenuOpen && (
            <div className="absolute bottom-16 right-0 bg-white shadow-lg rounded-md overflow-hidden w-48">
              <a
                href={`/module/${courseId}/students`}
                className="block py-2 px-4 hover:bg-gray-100 text-gray-800 border-b"
              >
                Ver alumnos
              </a>
              <a
                href={`/module/${courseId}/newstudent`}
                className="block py-2 px-4 hover:bg-gray-100 text-gray-800 border-b"
              >
                Añadir alumnos
              </a>
              <a
                href={`/module/${courseId}/quizcreate`}
                className="block py-2 px-4 hover:bg-gray-100 text-gray-800"
              >
                Crear Cuestionario
              </a>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear nuevo módulo */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[70vh] relative">
            <button
              onClick={() => setShowModuleModal(false)}
              className="absolute top-4 right-4 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl mb-4">Crear Nuevo Módulo</h2>
            <form onSubmit={handleModuleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Nombre del módulo
                </label>
                <input
                  type="text"
                  name="name"
                  value={moduleFormData.name}
                  onChange={handleModuleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Guardar Módulo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para crear nueva lección */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[70vh] relative">
            <button
              onClick={() => setShowLessonModal(false)}
              className="absolute top-4 right-4 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl mb-4">Crear Nueva Lección</h2>
            <form onSubmit={handleLessonSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Nombre de la lección
                </label>
                <input
                  type="text"
                  name="name"
                  value={lessonFormData.name}
                  onChange={handleLessonChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Detalles</label>
                <textarea
                  name="details"
                  value={lessonFormData.details}
                  onChange={handleLessonChange}
                  className="w-full p-2 border rounded"
                  rows="2"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  URL del video
                </label>
                <input
                  type="url"
                  name="video_url"
                  value={lessonFormData.video_url}
                  onChange={handleLessonChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Guardar Lección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
