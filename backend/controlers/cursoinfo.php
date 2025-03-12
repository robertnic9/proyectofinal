<?php
header('Content-Type: application/json'); // Especifica que la respuesta es JSON

require_once '../ddbb/DBConexion.php'; // Asegúrate de incluir la conexión a la base de datos

$db = DBConexion::connection();

$sql = "SELECT c.*, u.name as teachername, u.firstsurname, u.profile_picture 
        FROM course c 
        INNER JOIN user u ON c.teacher_id = u.id";

$result = $db->query($sql);

$cursos = [];

while ($row = $result->fetch_assoc()) {
    $cursos[] = $row; 
}

echo json_encode($cursos); 
?>
