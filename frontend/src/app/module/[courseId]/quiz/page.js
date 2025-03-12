"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useFetch from "@/hooks/useFetch";
export default function QuizListPage() {
  const { courseId } = useParams();
  const {
    isLoading,
    isError,
    data: quizzes,
  } = useFetch(
    `http://localhost/online/backend/controlers/quiz/getquizes.php?courseId=${courseId}`
  );

  if (isLoading) return <p className="text-gray-500">Cargando quizzes...</p>;
  if (isError)
    return <p className="text-red-500">Error al cargar los quizzes</p>;

  return (
    <main>
      <div className="container mx-auto px-4 py-8 min-h-screen pt-32">
        <h2 className="text-2xl uppercase font-bold mb-6">
          Quizzes Disponibles
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-4 border rounded-lg shadow bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{quiz.name}</h3>
                <p className="text-sm text-gray-500">
                  Número del Quiz: {quiz.number}
                </p>
                <p className="text-sm text-gray-500">
                  Puntaje Mínimo: {quiz.min_pass_score}%
                </p>
              </div>
              <Link
                href={`/module/${courseId}/quiz/${quiz.id}`}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Contestar Quiz
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
