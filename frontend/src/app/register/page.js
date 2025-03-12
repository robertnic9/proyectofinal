"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    firstsurname: "",
    secondsurname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    biography: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key !== "confirmPassword") {
          // Don't send confirmPassword to server
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch(
        "http://localhost:80/online/backend/register.php",
        {
          method: "POST",
          body: submitData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error en la conexión con el servidor");
      }

      const data = await response.json();

      if (data.status === "success") {
        setSuccess(data.message);
        setTimeout(router.push('/login'),5000);
      } else {
        // Mostrar mensaje de error
        setError(data.message || "Error desconocido");
      }
    } catch (err) {
      setError("Error de conexión: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
            <div>
                <h2 className="mt-6 mb-6 text-center text-3xl font-extrabold text-gray-900">
                Crear cuenta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?
                <Link
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    Iniciar sesión
                </Link>
                </p>
            </div>

            {error && (
                <div
                className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
                >
                <span className="block sm:inline">{error}</span>
                </div>
            )}

            {success && (
                <div
                className="bg-red-50 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
                >
                <span className="block sm:inline">{success}</span>
                </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className=" relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Nombre"
                />
                <input
                    id="firstsurname"
                    name="firstsurname"
                    type="text"
                    required
                    value={formData.firstsurname}
                    onChange={handleChange}
                    className=" relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Primer apellido"
                />
                <input
                    id="secondsurname"
                    name="secondsurname"
                    type="text"
                    value={formData.secondsurname}
                    onChange={handleChange}
                    className=" relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Segundo apellido (opcional)"
                />
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className=" relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Correo electrónico"
                />
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className=" relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Contraseña"
                />
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className=" relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirmar contraseña"
                />
                <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                >
                    <option value="student">Estudiante</option>
                    <option value="teacher">Profesor</option>
                </select>
                <textarea
                    id="biography"
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Biografía (opcional)"
                    rows="3"
                ></textarea>
                </div>
                <div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    loading
                        ? "bg-indigo-400"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {loading ? (
                        <svg
                        className="animate-spin h-5 w-5 text-indigo-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                        </svg>
                    ) : (
                        <svg
                        className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                        <path
                            fillRule="evenodd"
                            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                            clipRule="evenodd"
                        />
                        </svg>
                    )}
                    </span>
                    {loading ? "Registrando..." : "Registrarse"}
                </button>
                </div>
            </form>
            </div>
        </div>
    </main>
  );
}
