<?php
header('Content-Type: application/json');
require_once '../ddbb/DBConexion.php';

session_start();
if (!isset($_SESSION['user_id']) ) {
    echo json_encode(['error' => 'Acceso no autorizado']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$courseId = $data['courseId'] ?? null;
$userId = $data['userId'] ?? null;

if (!$courseId || !$userId) {
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

$db = DBConexion::connection();
$sql = "DELETE FROM enrolment WHERE course_id = ? AND user_id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("ii", $courseId, $userId);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Estudiante eliminado']);
} else {
    echo json_encode(['error' => 'No se pudo eliminar']);
}
?>
