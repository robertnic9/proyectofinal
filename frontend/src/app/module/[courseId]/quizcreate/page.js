"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function CreateQuiz() {
  const { courseId } = useParams();
  const [quizName, setQuizName] = useState("");
  const [quizNumber, setQuizNumber] = useState(1);
  const [minPassScore, setMinPassScore] = useState(70);
  const [isPassRequired, setIsPassRequired] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        questionTitle: "",
        answers: [
          { id: 1, answerText: "", isCorrect: false },
          { id: 2, answerText: "", isCorrect: false },
        ],
      },
    ]);
  };

  const handleRemoveQuestion = (questionId) => {
    const updatedQuestions = questions.filter(
      (question) => question.id !== questionId
    );
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (questionId, field, value) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId ? { ...question, [field]: value } : question
    );
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (questionId, answerId, field, value) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.map((answer) =>
              answer.id === answerId ? { ...answer, [field]: value } : answer
            ),
          }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const handleAddAnswer = (questionId) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            answers: [
              ...question.answers,
              {
                id: question.answers.length + 1,
                answerText: "",
                isCorrect: false,
              },
            ],
          }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const handleRemoveAnswer = (questionId, answerId) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            answers: question.answers.filter(
              (answer) => answer.id !== answerId
            ),
          }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizName || !quizNumber || !minPassScore) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (questions.length === 0) {
      toast.error("Debes agregar al menos una pregunta.");
      return;
    }

    for (const question of questions) {
      if (!question.questionTitle || question.answers.length < 2) {
        toast.error(
          "Cada pregunta debe tener un título y al menos dos respuestas."
        );
        return;
      }

      const correctAnswers = question.answers.filter(
        (answer) => answer.isCorrect
      );
      if (correctAnswers.length === 0) {
        toast.error(
          "Cada pregunta debe tener al menos una respuesta correcta."
        );
        return;
      }
    }

    const quizData = {
      courseId,
      name: quizName,
      number: quizNumber,
      minPassScore,
      isPassRequired,
      questions,
    };

    try {
      const response = await fetch(
        "http://localhost/online/backend/controlers/quizcreate.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear el quiz");
      }

      toast.success("Quiz creado exitosamente");
      // Resetear el formulario después de un envío exitoso
      setQuizName("");
      setQuizNumber(1);
      setMinPassScore(70);
      setIsPassRequired(false);
      setQuestions([]);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <main>
      <div className="container mx-auto px-4 py-8 min-h-screen pt-32">
        <h2 className="text-2xl uppercase font-bold mb-6">Crear Nuevo Quiz</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Quiz
            </label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número del Quiz
            </label>
            <input
              type="number"
              value={quizNumber}
              onChange={(e) => setQuizNumber(parseInt(e.target.value))}
              min="1"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Puntaje Mínimo para Aprobar (%)
            </label>
            <input
              type="number"
              value={minPassScore}
              onChange={(e) => setMinPassScore(parseInt(e.target.value))}
              min="1"
              max="100"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ¿Es obligatorio aprobar este quiz?
            </label>
            <input
              type="checkbox"
              checked={isPassRequired}
              onChange={(e) => setIsPassRequired(e.target.checked)}
              className="ml-2"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Agregar Pregunta
            </button>
          </div>
          {questions.map((question) => (
            <div
              key={question.id}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Pregunta {question.id}
                </h3>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(question.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Título de la Pregunta
                </label>
                <input
                  type="text"
                  value={question.questionTitle}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.id,
                      "questionTitle",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              {question.answers.map((answer) => (
                <div key={answer.id} className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Respuesta
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={answer.answerText}
                      onChange={(e) =>
                        handleAnswerChange(
                          question.id,
                          answer.id,
                          "answerText",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <input
                      type="checkbox"
                      checked={answer.isCorrect}
                      onChange={(e) =>
                        handleAnswerChange(
                          question.id,
                          answer.id,
                          "isCorrect",
                          e.target.checked
                        )
                      }
                      className="ml-2"
                    />
                    <span className="text-sm">Correcta</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAnswer(question.id, answer.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddAnswer(question.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Agregar Respuesta
              </button>
            </div>
          ))}
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Crear Quiz
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
