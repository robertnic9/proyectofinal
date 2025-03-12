<?php
session_start();

header('Content-Type: application/json');

require_once '../ddbb/DBConexion.php'; 

$db = DBConexion::connection();

// Obtener el courseId desde la URL
$courseId = isset($_GET['courseId']) ? intval($_GET['courseId']) : 0;

if ($courseId <= 0) {
    echo json_encode(["error" => "courseId inválido"]);
    exit;
}

// Consulta para obtener módulos y sus lecciones
$stmt = $db->prepare("
    SELECT 
        m.id AS module_id,
        m.name AS module_name,
        m.number AS module_number,
        l.id AS lesson_id,
        l.name AS lesson_name,
        l.number AS lesson_number,
        l.lesson_details AS lesson_details,
        l.video_url AS video_url
    FROM module m
    LEFT JOIN lesson l ON m.id = l.module_id
    WHERE m.course_id = ?
    ORDER BY m.number, l.number
");

$stmt->bind_param('i', $courseId);
$stmt->execute();
$result = $stmt->get_result();

$modules = [];
while ($row = $result->fetch_assoc()) {
    $moduleId = $row['module_id'];

    // Si el módulo no existe en el array, lo añadimos
    if (!isset($modules[$moduleId])) {
        $modules[$moduleId] = [
            'id' => $moduleId,
            'name' => $row['module_name'],
            'number' => $row['module_number'],
            'lessons' => [],
        ];
    }

    // Añadimos la lección al módulo correspondiente
    $modules[$moduleId]['lessons'][] = [
        'id' => $row['lesson_id'],
        'name' => $row['lesson_name'],
        'number' => $row['lesson_number'],
        'details' => $row['lesson_details'],
        'video_url' => $row['video_url']
    ];
}

// Convertimos el array asociativo en uno indexado
$modules = array_values($modules);

echo json_encode($modules);
?>