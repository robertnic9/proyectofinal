<?php
require_once "../../ddbb/DBConexion.php";
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
if (empty($input["moduleId"]) || empty($input["name"]) || empty($input["video_url"]) || empty($input["details"])) {
    exit(json_encode(["success" => false, "message" => "Faltan datos obligatorios"]));
}

$db = DBConexion::connection();
$module_id = intval($input["moduleId"]);
$name = trim($input["name"]);
$video_url = trim($input["video_url"]);
$lesson_details = trim($input["details"]);

// Obtener el curso al que pertenece el módulo
$courseQuery = $db->query("SELECT course_id FROM module WHERE id = $module_id");
$course = $courseQuery->fetch_assoc();
if (!$course) {
    exit(json_encode(["success" => false, "message" => "El módulo no existe"]));
}
$course_id = $course["course_id"];

// Obtener el próximo número dentro del módulo
$numberQuery = $db->query("SELECT COALESCE(MAX(number), 0) + 1 FROM lesson WHERE module_id = $module_id");
$number = $numberQuery->fetch_row()[0];

// Obtener el próximo course_order dentro del mismo curso
$courseOrderQuery = $db->query("SELECT COALESCE(MAX(course_order), 0) + 1 FROM lesson 
                                WHERE module_id IN (SELECT id FROM module WHERE course_id = $course_id)");
$course_order = $courseOrderQuery->fetch_row()[0];

// Mover las lecciones dentro del mismo curso para hacer espacio
$db->query("UPDATE lesson SET course_order = course_order + 1 
            WHERE module_id IN (SELECT id FROM module WHERE course_id = $course_id) 
            AND course_order >= $course_order");

// Insertar la nueva lección
$stmt = $db->prepare("INSERT INTO lesson (module_id, name, number, course_order, video_url, lesson_details) 
                      VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("isiiss", $module_id, $name, $number, $course_order, $video_url, $lesson_details);
$success = $stmt->execute();
$stmt->close();

echo json_encode([
    "success" => $success,
    "message" => $success ? "Lección agregada correctamente" : "Error al agregar la lección",
    "number" => $number,
    "course_order" => $course_order
]);
?>
