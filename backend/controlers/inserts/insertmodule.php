<?php
require_once "../../ddbb/DBConexion.php";
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
if (empty($input["courseId"]) || empty($input["name"])) {
    exit(json_encode(["success" => false, "message" => "Faltan datos"]));
}

$db = DBConexion::connection();
$courseId = intval($input["courseId"]);
$name = trim($input["name"]);

// Obtener el próximo número
$number = $db->query("SELECT COALESCE(MAX(number), 0) + 1 FROM module WHERE course_id = $courseId")
             ->fetch_row()[0];

// Insertar el módulo
$stmt = $db->prepare("INSERT INTO module (course_id, name, number) VALUES (?, ?, ?)");
$stmt->bind_param("isi", $courseId, $name, $number);
$success = $stmt->execute();
$stmt->close();

echo json_encode([
    "success" => $success,
    "message" => $success ? "Módulo agregado correctamente" : "Error al agregar el módulo",
]);
?>
