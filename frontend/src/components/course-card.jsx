import Image from "next/image";
import { FollowerPointerCard } from "./ui/following-pointer";
import Link from "next/link";
import { useState, useEffect } from "react";

export function CourseCard({ course }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserId(user.id);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId && course?.id) {
      fetch(
        `http://localhost/online/backend/controlers/userfavorites.php?courseId=${course.id}&userId=${userId}`,
        {
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Favorite status:", data.status);
          setIsFavorite(data.status);
        })
        .catch((err) => console.error("Error al obtener favoritos", err));
    }
  }, [userId, course?.id]); 

  const toggleFavorite = async () => {
    if (!userId) return alert("Debes iniciar sesión para agregar a favoritos");
    setLoading(true);

    try {
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch(
        "http://localhost/online/backend/controlers/userfavorites.php",
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, courseId: course.id }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar favoritos");

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error en la petición:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    console.error("Error: No se recibió el objeto course en CourseCard");
    return <div>Error: Datos del curso no disponibles</div>;
  }

  return (
    <div className="w-[24rem] my-12 z-10 mx-auto shadow-lg">
      <FollowerPointerCard
        title={
          <TitleComponent
            title={`${course.teachername} ${course.firstsurname}`}
            avatar={course.profile_picture}
          />
        }
      >
        <div className="relative w-180 overflow-hidden h-full rounded-2xl transition duration-200 group bg-white hover:shadow-xl border border-zinc-100">
          <div className="w-full h-60 aspect-w-16 aspect-h-10 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
            <Image
              src={course.url_image}
              alt={course.name}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200"
            />
          </div>
          <div className="p-4">
            <h2 className="font-bold my-4 text-lg text-zinc-700">
              {course.name}
            </h2>
            <h2 className="font-normal my-4 text-sm text-zinc-500">
              {course.description}
            </h2>
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`z-10 px-4 py-2 font-bold rounded-xl text-xs transition ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                {loading
                  ? "Cargando..."
                  : isFavorite
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"}
              </button>
              <Link
                href={`/module/${course.id}`}
                className="relative z-10 px-6 py-2 bg-black text-white font-bold rounded-xl block text-xs"
              >
                Ver curso
              </Link>
            </div>
          </div>
        </div>
      </FollowerPointerCard>
    </div>
  );
}

const TitleComponent = ({ title, avatar }) => (
  <div className="flex space-x-2 items-center">
    <Image
      src={avatar}
      height={20}
      width={20}
      alt="instructor"
      className="rounded-full border-2 border-white"
    />
    <p>{title}</p>
  </div>
);
