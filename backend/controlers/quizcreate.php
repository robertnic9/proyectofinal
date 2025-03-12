<?php
header('Content-Type: application/json');
require_once '../ddbb/DBConexion.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Acceso no autorizado']);
    exit;
}

// Obtener los datos del cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Validar los datos recibidos
if (
    !isset($data['courseId']) ||
    !isset($data['name']) ||
    !isset($data['number']) ||
    !isset($data['minPassScore']) ||
    !isset($data['questions']) ||
    !is_array($data['questions'])
) {
    echo json_encode(['error' => 'Datos incompletos o incorrectos']);
    exit;
}

$courseId = $data['courseId'];
$quizName = $data['name'];
$quizNumber = $data['number'];
$minPassScore = $data['minPassScore'];
$isPassRequired = $data['isPassRequired'] ?? false; // Opcional, por defecto false
$questions = $data['questions'];

$db = DBConexion::connection();

// Iniciar una transacción para asegurar la integridad de los datos
$db->begin_transaction();

try {
    // Insertar el quiz en la tabla `quiz`
    $sqlQuiz = "INSERT INTO quiz (course_id, name, number, min_pass_score, is_pass_required)
                VALUES (?, ?, ?, ?, ?)";
    $stmtQuiz = $db->prepare($sqlQuiz);
    $stmtQuiz->bind_param("isiis", $courseId, $quizName, $quizNumber, $minPassScore, $isPassRequired);
    $stmtQuiz->execute();
    $quizId = $stmtQuiz->insert_id; // Obtener el ID del quiz insertado

    // Insertar las preguntas en la tabla `quiz_question`
    foreach ($questions as $question) {
        if (!isset($question['questionTitle']) || !is_array($question['answers'])) {
            throw new Exception('Datos de pregunta incompletos o incorrectos');
        }

        $sqlQuestion = "INSERT INTO quiz_question (quiz_id, question_title)
                        VALUES (?, ?)";
        $stmtQuestion = $db->prepare($sqlQuestion);
        $stmtQuestion->bind_param("is", $quizId, $question['questionTitle']);
        $stmtQuestion->execute();
        $questionId = $stmtQuestion->insert_id; // Obtener el ID de la pregunta insertada

        // Insertar las respuestas en la tabla `quiz_answer`
        foreach ($question['answers'] as $answer) {
            if (!isset($answer['answerText']) || !isset($answer['isCorrect'])) {
                throw new Exception('Datos de respuesta incompletos o incorrectos');
            }

            $sqlAnswer = "INSERT INTO quiz_answer (question_id, answer_text, is_correct)
                          VALUES (?, ?, ?)";
            $stmtAnswer = $db->prepare($sqlAnswer);
            $stmtAnswer->bind_param("isi", $questionId, $answer['answerText'], $answer['isCorrect']);
            $stmtAnswer->execute();
        }
    }

    // Confirmar la transacción
    $db->commit();
    echo json_encode(['success' => 'Quiz creado exitosamente']);
} catch (Exception $e) {
    // Revertir la transacción en caso de error
    $db->rollback();
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    // Cerrar la conexión
    $db->close();
}
?>