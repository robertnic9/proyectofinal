<?php
header('Content-Type: application/json');
require_once '../../ddbb/DBConexion.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Acceso no autorizado']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (
    !isset($data['quizId']) ||
    !isset($data['courseId']) ||
    !isset($data['answers']) ||
    !is_array($data['answers'])
) {
    echo json_encode(['error' => 'Datos incompletos o incorrectos']);
    exit;
}

$quizId = $data['quizId'];
$courseId = $data['courseId'];
$answers = $data['answers'];
$userId = $_SESSION['user_id']; // Obtener el ID del usuario desde la sesión

$db = DBConexion::connection();

// Obtener las respuestas correctas del quiz
$sqlCorrectAnswers = "SELECT qa.id, qa.question_id
                      FROM quiz_answer qa
                      INNER JOIN quiz_question qq ON qa.question_id = qq.id
                      WHERE qq.quiz_id = ? AND qa.is_correct = 1";
$stmtCorrectAnswers = $db->prepare($sqlCorrectAnswers);
$stmtCorrectAnswers->bind_param("i", $quizId);
$stmtCorrectAnswers->execute();
$correctAnswers = $stmtCorrectAnswers->get_result()->fetch_all(MYSQLI_ASSOC);

// Calcular el puntaje
$totalQuestions = count($correctAnswers);
$correctCount = 0;

foreach ($answers as $questionId => $answerId) {
    foreach ($correctAnswers as $correctAnswer) {
        if ($correctAnswer['question_id'] == $questionId && $correctAnswer['id'] == $answerId) {
            $correctCount++;
            break;
        }
    }
}

$score = ($totalQuestions > 0) ? round(($correctCount / $totalQuestions) * 100) : 0;

// Guardar el resultado en la tabla user_quiz_attempt
$sqlInsertAttempt = "INSERT INTO user_quiz_attempt (user_id, quiz_id, score_achieved)
                     VALUES (?, ?, ?)";
$stmtInsertAttempt = $db->prepare($sqlInsertAttempt);
$stmtInsertAttempt->bind_param("iii", $userId, $quizId, $score);
$stmtInsertAttempt->execute();

// Verificar si la inserción fue exitosa
if ($stmtInsertAttempt->affected_rows > 0) {
    echo json_encode(['score' => $score]);
} else {
    echo json_encode(['error' => 'Error al guardar el intento del quiz']);
}

$db->close();
?>