<?php
header('Content-Type: application/json');
require_once '../../ddbb/DBConexion.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Acceso no autorizado']);
    exit;
}

$quizId = $_GET['quizId'] ?? null;
if (!$quizId) {
    echo json_encode(['error' => 'Falta el ID del quiz']);
    exit;
}

$db = DBConexion::connection();

// Obtener el quiz
$sqlQuiz = "SELECT id, name, number, min_pass_score FROM quiz WHERE id = ?";
$stmtQuiz = $db->prepare($sqlQuiz);
$stmtQuiz->bind_param("i", $quizId);
$stmtQuiz->execute();
$quiz = $stmtQuiz->get_result()->fetch_assoc();

if (!$quiz) {
    echo json_encode(['error' => 'Quiz no encontrado']);
    exit;
}

// Obtener las preguntas y respuestas
$sqlQuestions = "SELECT id, question_title FROM quiz_question WHERE quiz_id = ?";
$stmtQuestions = $db->prepare($sqlQuestions);
$stmtQuestions->bind_param("i", $quizId);
$stmtQuestions->execute();
$questions = $stmtQuestions->get_result()->fetch_all(MYSQLI_ASSOC);

foreach ($questions as &$question) {
    $sqlAnswers = "SELECT id, answer_text, is_correct FROM quiz_answer WHERE question_id = ?";
    $stmtAnswers = $db->prepare($sqlAnswers);
    $stmtAnswers->bind_param("i", $question['id']);
    $stmtAnswers->execute();
    $question['answers'] = $stmtAnswers->get_result()->fetch_all(MYSQLI_ASSOC);
}

$quiz['questions'] = $questions;

echo json_encode($quiz);
?>