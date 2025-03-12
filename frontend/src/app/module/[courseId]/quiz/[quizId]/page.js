"use client";
import React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";

export default function QuizAnswerPage({params}) {

  const resolvedParams = React.use(params);
  const { courseId, quizId } = resolvedParams;

  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const {
    isLoading,
    isError,
    data: quiz,
  } = useFetch(
    `http://localhost/online/backend/controlers/quiz/getquiz.php?quizId=${quizId}`
  );

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/online/backend/controlers/quiz/submitquiz.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId,
            courseId,
            answers,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar el quiz");
      }

      const result = await response.json();
      alert(`Quiz enviado. Puntaje: ${result.score}%`);
      router.push(`/module/${courseId}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.log(error.message);
    }
  };

  if (isLoading) return <p className="text-gray-500">Cargando quiz...</p>;
  if (isError) return <p className="text-red-500">Error al cargar el quiz</p>;

  return (
    <main>
      <div className="container mx-auto px-4 py-8 min-h-screen pt-32">
        <h2 className="text-2xl uppercase font-bold mb-6">{quiz.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {quiz.questions.map((question) => (
            <div
              key={question.id}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <h3 className="text-lg font-semibold mb-4">
                {question.question_title}
              </h3>
              <div className="space-y-2">
                {question.answers.map((answer) => (
                  <div key={answer.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`answer-${answer.id}`}
                      name={`question-${question.id}`}
                      value={answer.id}
                      onChange={() =>
                        handleAnswerChange(question.id, answer.id)
                      }
                      className="mr-2"
                    />
                    <label htmlFor={`answer-${answer.id}`} className="text-sm">
                      {answer.answer_text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Enviar Quiz
          </button>
        </form>
      </div>
    </main>
  );
}
