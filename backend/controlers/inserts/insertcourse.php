<?php
require_once "../../ddbb/DBConexion.php";


// Obtener y validar datos de entrada
$input = json_decode(file_get_contents("php://input"), true);
if (empty($input["title"]) || empty($input["description"]) ||
    empty($input["image"]) || empty($input["teacher_id"])) {
    exit(json_encode([
        "success" => false, 
        "message" => "Faltan datos requeridos para crear el curso"
    ]));
}

// Conectar a la base de datos
$db = DBConexion::connection();

// Sanitizar los datos de entrada
$title = trim($input["title"]);
$description = trim($input["description"]);
$image = trim($input["image"]);
$teacher_id = intval($input["teacher_id"]);

// Verificar que el usuario sea un profesor válido
$stmt = $db->prepare("SELECT id FROM user WHERE id = ? AND role = 'teacher'");
$stmt->bind_param("i", $teacher_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $stmt->close();
    exit(json_encode([
        "success" => false, 
        "message" => "ID de profesor no válido"
    ]));
}
$stmt->close();

// Insertar el nuevo curso
$stmt = $db->prepare("INSERT INTO course (name, description,  url_image,  teacher_id) 
                     VALUES (?, ?, ?, ?)");
$stmt->bind_param("sssi", $title, $description, $image,  $teacher_id);
$success = $stmt->execute();

if ($success) {
    $course_id = $db->insert_id;
    $stmt->close();
    
    echo json_encode([
        "success" => true,
        "message" => "Curso creado correctamente",
        "course_id" => $course_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al crear el curso: " . $db->error
    ]);
}
?>