<?php
header('Content-Type: application/json'); // Specify JSON response type

require_once '../ddbb/DBConexion.php'; // Include database connection

$db = DBConexion::connection();

// Check if user is logged in via session
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Query to get favorite courses with teacher information
$sql = "SELECT c.*, u.name as teachername, u.firstsurname, u.profile_picture 
        FROM user_favorite_course f 
        INNER JOIN course c ON f.course_id = c.id 
        INNER JOIN user u ON c.teacher_id = u.id 
        WHERE f.user_id = $user_id
        ORDER BY f.added_datetime DESC";

$result = $db->query($sql);

$favoriteCourses = [];

while ($row = $result->fetch_assoc()) {
    $favoriteCourses[] = $row; 
}

echo json_encode($favoriteCourses);
?>