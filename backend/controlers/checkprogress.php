<?php
header('Content-Type: application/json');
require_once '../ddbb/DBConexion.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Acceso no autorizado']);
    exit;
}

$userId = $_SESSION['user_id'] ?? null;

$db = DBConexion::connection();

// Obtener los cursos del alumno
$sqlCourses = "SELECT c.*, u.name as teachername, u.firstsurname, u.profile_picture 
               FROM enrolment e 
               INNER JOIN course c ON e.course_id = c.id 
               INNER JOIN user u ON c.teacher_id = u.id 
               WHERE e.user_id = ?";
$stmtCourses = $db->prepare($sqlCourses);
$stmtCourses->bind_param("i", $userId);
$stmtCourses->execute();
$resultCourses = $stmtCourses->get_result();

$courses = [];
while ($row = $resultCourses->fetch_assoc()) {
    $courses[] = $row;
}

// Obtener el número de quizzes por curso y verificar si el alumno los ha completado
foreach ($courses as &$course) {
    $courseId = $course['id'];

    // Obtener el número total de quizzes por curso
    $sqlQuizzes = "SELECT COUNT(*) as total_quizzes FROM quiz WHERE course_id = ?";
    $stmtQuizzes = $db->prepare($sqlQuizzes);
    $stmtQuizzes->bind_param("i", $courseId);
    $stmtQuizzes->execute();
    $resultQuizzes = $stmtQuizzes->get_result();
    $rowQuizzes = $resultQuizzes->fetch_assoc();
    $course['total_quizzes'] = $rowQuizzes['total_quizzes'];

    // Obtener el número de quizzes completados por el alumno
    $sqlCompletedQuizzes = "SELECT COUNT(DISTINCT quiz_id) as completed_quizzes 
                            FROM user_quiz_attempt 
                            WHERE user_id = ? AND quiz_id IN (SELECT id FROM quiz WHERE course_id = ?)";
    $stmtCompletedQuizzes = $db->prepare($sqlCompletedQuizzes);
    $stmtCompletedQuizzes->bind_param("ii", $userId, $courseId);
    $stmtCompletedQuizzes->execute();
    $resultCompletedQuizzes = $stmtCompletedQuizzes->get_result();
    $rowCompletedQuizzes = $resultCompletedQuizzes->fetch_assoc();
    $course['completed_quizzes'] = $rowCompletedQuizzes['completed_quizzes'];

    // Calcular el porcentaje de finalización
    $course['completion_percentage'] = $course['total_quizzes'] > 0 
        ? ($course['completed_quizzes'] / $course['total_quizzes']) * 100 
        : 0;
}

// Obtener el progreso del estudiante (quizzes completados)
$sqlProgress = "SELECT q.name AS quiz_name, uqa.score_achieved, q.min_pass_score
                FROM user_quiz_attempt uqa
                INNER JOIN quiz q ON uqa.quiz_id = q.id
                WHERE uqa.user_id = ?";
$stmtProgress = $db->prepare($sqlProgress);
$stmtProgress->bind_param("i", $userId);
$stmtProgress->execute();
$resultProgress = $stmtProgress->get_result();

$progress = [];
while ($row = $resultProgress->fetch_assoc()) {
    $progress[] = $row;
}

echo json_encode([
    'courses' => $courses,
    'progress' => $progress
]);
?>