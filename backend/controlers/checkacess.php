<?php
session_start();
require_once '../models/courseModel.php';
require_once '../models/enrolementModel.php';
header('Content-Type: application/json');

$courseId = isset($_GET['courseId']) ? intval($_GET['courseId']) : 0;

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'No hay sesión de usuario']);
    exit;
}

$userId = $_SESSION['user_id'];

$isTeacher = Course::isTeacher($userId, $courseId);
$hasCourse = $isTeacher ? true : Enrolment::hasCourse($userId, $courseId);

if ($courseId <= 0) {
    echo json_encode(["error" => "courseId inválido"]);
    exit;
}

echo json_encode([
    'isTeacher' => $isTeacher,
    'hascourse' => $hasCourse,
]);
?>