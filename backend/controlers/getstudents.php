<?php
header('Content-Type: application/json');
require_once '../ddbb/DBConexion.php';

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
$sql = "SELECT u.id, u.name, u.firstsurname, u.email, u.profile_picture FROM enrolment e
        INNER JOIN user u ON e.user_id = u.id
        WHERE e.course_id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("i", $courseId);
$stmt->execute();
$result = $stmt->get_result();

$students = [];
while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

echo json_encode($students);
?>
