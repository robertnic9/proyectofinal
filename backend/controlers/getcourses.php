<?php
header('Content-Type: application/json');
require_once '../ddbb/DBConexion.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$db = DBConexion::connection();
$user_id = $_SESSION['user_id'];

// Obtener el rol del usuario
$sqlRole = "SELECT role FROM user WHERE id = ?";
$stmt = $db->prepare($sqlRole);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$resultRole = $stmt->get_result();

if ($resultRole->num_rows === 0) {
    echo json_encode(['error' => 'User not found']);
    exit;
}

$userRole = $resultRole->fetch_assoc()['role'];
$stmt->close();

if ($userRole === 'teacher') {
    // Si es profesor, obtener los cursos que enseña
    $sql = "SELECT c.*, u.name as teachername, u.firstsurname, u.profile_picture 
            FROM course c 
            INNER JOIN user u ON c.teacher_id = u.id 
            WHERE c.teacher_id = ?";
} else {
    // Si es estudiante, obtener los cursos en los que está inscrito
    $sql = "SELECT c.*, u.name as teachername, u.firstsurname, u.profile_picture 
            FROM enrolment e 
            INNER JOIN course c ON e.course_id = c.id 
            INNER JOIN user u ON c.teacher_id = u.id 
            WHERE e.user_id = ?";
}

$stmt = $db->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$courses = [];
while ($row = $result->fetch_assoc()) {
    $courses[] = $row;
}

$stmt->close();
echo json_encode($courses);
?>
