<?php
header('Content-Type: application/json');
require_once '../../ddbb/DBConexion.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Acceso no autorizado']);
    exit;
}

$courseId = $_GET['courseId'] ?? null;
if (!$courseId) {
    echo json_encode(['error' => 'Falta el ID del curso']);
    exit;
}

$db = DBConexion::connection();
$sql = "SELECT id, name, number, min_pass_score FROM quiz WHERE course_id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("i", $courseId);
$stmt->execute();
$result = $stmt->get_result();

$quizzes = [];
while ($row = $result->fetch_assoc()) {
    $quizzes[] = $row;
}

echo json_encode($quizzes);
?>