<?php
header('Content-Type: application/json');
require_once '../ddbb/DBConexion.php';

$db = DBConexion::connection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Obtener la lista de cursos favoritos de un usuario
    $courseId = intval($_GET['courseId']);
    $userId = intval($_GET['userId']);

    if (!isset($courseId)) {
        exit (json_encode(['error' => 'Falta courseID']));
    }

    if(!isset($userId)){
        exit (json_encode(['status' => false]));
    }
    

    $sql = "select * from user_favorite_course f where f.user_id = ? and f.course_id = ?;";
    
    $stmt = $db->prepare($sql);
    $stmt->bind_param('ii',$userId, $courseId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result ->num_rows > 0){
        $stmt -> close();
        exit(json_encode(['status' => true]));
    } else{
        exit(json_encode(['status' => false]));
    }

} elseif ($method === 'POST') {
    // Agregar un curso a favoritos
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['userId']) || !isset($data['courseId'])) {
        echo json_encode(['error' => 'Faltan parámetros']);
        exit;
    }

    $userId = intval($data['userId']);
    $courseId = intval($data['courseId']);

    $sql = "INSERT INTO user_favorite_course (user_id, course_id) VALUES (?, ?)";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('ii', $userId, $courseId);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => 'Curso agregado a favoritos']);
    } else {
        echo json_encode(['error' => 'No se pudo agregar']);
    }
} elseif ($method === 'DELETE') {
    // Eliminar un curso de favoritos
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['userId']) || !isset($data['courseId'])) {
        echo json_encode(['error' => 'Faltan parámetros']);
        exit;
    }

    $userId = intval($data['userId']);
    $courseId = intval($data['courseId']);

    $sql = "DELETE FROM user_favorite_course WHERE user_id = ? AND course_id = ?";
    $stmt = $db->prepare($sql);
    $stmt->bind_param('ii', $userId, $courseId);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'Curso eliminado de favoritos']);
    } else {
        echo json_encode(['error' => 'No se pudo eliminar']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>
