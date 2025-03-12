<?php
header('Content-Type: application/json');
require_once '../ddbb/DBConexion.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Acceso no autorizado']);
    exit;
}

$db = DBConexion::connection();

// Handling GET request (fetching student data)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $courseId = $_GET['courseId'] ?? null;
    
    if (!$courseId) {
        echo json_encode(['error' => 'Falta el ID del curso']);
        exit;
    }

    // SQL query to fetch students who are not already enrolled in the course
    $sql = "
        SELECT u.id, u.name, u.firstsurname, u.secondsurname, u.email, u.profile_picture
        FROM user u
        LEFT JOIN enrolment e ON u.id = e.user_id AND e.course_id = ?
        WHERE u.role = 'student' AND e.user_id IS NULL
    ";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("i", $courseId);
    $stmt->execute();
    $result = $stmt->get_result();

    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    echo json_encode($students);

// Handling POST request (inserting data into the enrolment table)
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $courseId = $data['courseId'] ?? null;
    $userId = $data['userId'] ?? null;

    if (!$courseId || !$userId) {
        echo json_encode(['error' => 'Falta el ID del curso o del usuario']);
        exit;
    }

    // Check if the student is already enrolled
    $sql_check = "SELECT id FROM enrolment WHERE course_id = ? AND user_id = ?";
    $stmt_check = $db->prepare($sql_check);
    $stmt_check->bind_param("ii", $courseId, $userId);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        echo json_encode(['error' => 'El estudiante ya está matriculado en este curso']);
        exit;
    }

    // Insert student into enrolment table
    $sql = "INSERT INTO enrolment (course_id, user_id) VALUES (?, ?)";
    $stmt = $db->prepare($sql);
    $stmt->bind_param("ii", $courseId, $userId);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'Estudiante añadido correctamente']);
    } else {
        echo json_encode(['error' => 'Error al añadir al estudiante']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>
