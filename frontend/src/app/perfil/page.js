"use client";

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useFetch from "@/hooks/useFetch"; // Asegúrate de que la ruta sea correcta

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [student, setStudent] = useState(false);
  const [progress, setProgress] = useState([]);
  const [courses, setCourses] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    firstsurname: user.firstsurname,
    secondsurname: user.secondsurname,
    email: user.email,
    biografy: user.biografy || "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Hook personalizado para obtener el progreso del estudiante y los cursos
  const {
    isLoading: isLoadingProgress,
    isError: isErrorProgress,
    data: progressData,
  } = useFetch(`http://localhost/online/backend/controlers/checkprogress.php`);

  useEffect(() => {
    if (progressData) {
      setProgress(progressData.progress);
      setCourses(progressData.courses);
    }
  }, [progressData]);

  // Verificar si el usuario es un estudiante
  useEffect(() => {
    if (user.role === "student") {
      setStudent(true);
    }
  }, [user.role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/online/backend/controlers/changeprofileinfo.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setShowModal(false);
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/online/backend/controlers/changeprofilepassword.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: passwordData.newPassword }),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setShowPasswordModal(false);
    } catch (error) {
      toast.error("Error al cambiar la contraseña");
    }
  };

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="pt-24 pb-24 flex gap-4 mx-auto w-[80%] justify-center">
        <div className="flex-col gap-10 bg-white p-12 w-[80vh] min-h-[95vh] shadow-2xl text-xl rounded-xl">
          <img
            src={user.profile_picture}
            className="w-80 h-72 bg-cover mb-8"
            alt={user.name}
          />
          <div className="flex-col space-y-4 mb-14">
            <p className="font-bold">Nombre:</p>
            <h3>
              {user.name} {user.firstsurname} {user.secondsurname}
            </h3>
            <p className="font-bold">Email:</p>
            <h3>{user.email}</h3>
            <p className="font-bold">Rol:</p>
            <h3 className="capitalize">{user.role}</h3>
            <p className="font-bold">Biografía:</p>
            <h3>{user.biography || "Todavía no hay descripción"}</h3>
          </div>
          <div className="flex justify-center mt-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-2 text-white py-4 rounded-md bg-lime-900"
            >
              Cambiar información
            </button>
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-blue-500"
            >
              Cambiar contraseña
            </button>
          </div>
        </div>
        {student && (
          <div className="flex-col gap-10 bg-white p-8 w-[70vh] min-h-[95vh] shadow-2xl text-xl rounded-xl">
            <h1 className="text-2xl mb-4">Progreso</h1>
            {isLoadingProgress ? (
              <p>Cargando progreso...</p>
            ) : isErrorProgress ? (
              <p className="text-red-500">Error al cargar el progreso</p>
            ) : (
              <>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 mb-4 rounded-lg bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">{course.name}</h3>
                        <span
                          className={`text-sm ${
                            course.completion_percentage === 100
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {course.completion_percentage === 100
                            ? "Completado"
                            : "No completado"}
                        </span>
                      </div>
                      {/* Nuevo párrafo con la información de quizzes completados */}
                      <p className="text-sm text-gray-600 mt-2">
                        Quizzes completados: {course.completed_quizzes} de{" "}
                        {course.total_quizzes}
                      </p>
                      {/* Barra de progreso */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{ width: `${course.completion_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <h2 className="text-2xl mb-4">Quizzes Completados</h2>
                  {progress.map((quiz) => (
                    <div
                      key={quiz.id}
                      className={`p-4 mb-4 rounded-lg ${
                        quiz.score_achieved >= quiz.min_pass_score
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <h3 className="font-bold">{quiz.quiz_name}</h3>
                      <p>Puntaje: {quiz.score_achieved}%</p>
                      <p>
                        Estado:{" "}
                        {quiz.score_achieved >= quiz.min_pass_score
                          ? "Aprobado"
                          : "Suspendido"}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[40vw] relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl mb-4">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border"
              />
              <input
                type="text"
                name="firstsurname"
                value={formData.firstsurname}
                onChange={handleChange}
                className="w-full p-2 border"
              />
              <input
                type="text"
                name="secondsurname"
                value={formData.secondsurname}
                onChange={handleChange}
                className="w-full p-2 border"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border"
              />
              <textarea
                name="biografy"
                value={formData.biografy}
                onChange={handleChange}
                className="w-full p-2 border"
              />
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[40vw] relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl mb-4">Cambiar Contraseña</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                name="newPassword"
                placeholder="Nueva contraseña"
                onChange={handlePasswordChange}
                className="w-full p-2 border"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repetir contraseña"
                onChange={handlePasswordChange}
                className="w-full p-2 border"
              />
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Guardar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
