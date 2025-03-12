<?php
require_once "../ddbb/DBConexion.php";
$db = DBConexion::connection();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

session_start();
$user_id = $_SESSION['user_id']; 

$sql = "UPDATE user SET name = ?, firstsurname = ?, secondsurname = ?, email = ?, biography = ? WHERE id = ?";
$stmt = $db->prepare($sql);
$stmt->bind_param("sssssi", $data['name'], $data['firstsurname'], $data['secondsurname'], $data['email'], $data['biografy'], $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Perfil actualizado"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar"]);
}

$stmt->close();
?>
