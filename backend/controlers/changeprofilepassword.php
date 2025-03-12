<?php
require_once "../ddbb/DBConexion.php";
$db = DBConexion::connection();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['password'])) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

session_start();
$user_id = $_SESSION['user_id']; 

$hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);

$sql = "UPDATE user SET password = ? WHERE id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("si", $hashed_password, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Contraseña actualizada"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar"]);
}

$stmt->close();
?>
