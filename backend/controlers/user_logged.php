<?php

session_start();
require_once "../ddbb/DBConexion.php";
require_once "../models/userModel.php";

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'No hay sesión de usuario']);
    exit;
}

$userId = $_SESSION['user_id'];

$db = DBConexion::connection();
$stmt = $db->prepare("SELECT * FROM user WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $user = new User($row);
    
    echo json_encode([
        'id' => $user->getId(),
        'name' => $user->getName(),
        'firstsurname' => $user->getFirstSurname(),
        'secondsurname' => $user->getSecondSurname(),
        'email' => $user->getEmail(),
        'role' => $user->getRole(),
        'biography' => $user->getBiography(),
        'profile_picture' => $user ->getProfilePicture()
    ]);
} else {
    echo json_encode(['error' => 'Usuario no encontrado']);
}
?>