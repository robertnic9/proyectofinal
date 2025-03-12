<?php
include './ddbb/DBConexion.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $name = $_POST['name'];
    $firstsurname = $_POST['firstsurname'];
    $secondsurname = isset($_POST['secondsurname']) ? $_POST['secondsurname'] : null;
    $email = $_POST['email'];
    $password = $_POST['password'];
    $role = $_POST['role'];
    $biography = isset($_POST['biography']) ? $_POST['biography'] : null;
    $profile_picture = '/media/sinfoto.webp';
    
    $response = array();
    
    // Validar el formato del correo electrónico
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response = [
            'status' => 'error',
            'message' => 'Formato de correo electrónico inválido.'
        ];
        echo json_encode($response);
        exit();
    }
    
    // Validar campos obligatorios
    if (empty($name) || empty($firstsurname) || empty($email) || empty($password) || empty($role)) {
        $response = [
            'status' => 'error',
            'message' => 'Todos los campos obligatorios deben ser completados.'
        ];
        echo json_encode($response);
        exit();
    }
     
    try {
        $db = DBConexion::connection();
        
        // Verificar si el email ya existe
        $checkStmt = $db->prepare("SELECT id FROM user WHERE email = ?");
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            $response = [
                'status' => 'error',
                'message' => 'Este correo electrónico ya está registrado.'
            ];
            echo json_encode($response);
            $checkStmt->close();
            $db->close();
            exit();
        }
        $checkStmt->close();
        
        // Hash de la contraseña
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insertar nuevo usuario
        $stmt = $db->prepare("INSERT INTO user (name, firstsurname, secondsurname, email, password, role, biography, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssssss", $name, $firstsurname, $secondsurname, $email, $hashed_password, $role, $biography, $profile_picture);
        
        if ($stmt->execute()) {
            $response = [
                'status' => 'success',
                'message' => 'Usuario registrado correctamente.',
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Error al registrar usuario: ' . $stmt->error
            ];
        }
        
        $stmt->close();
        $db->close();
        
        echo json_encode($response);
        exit();
        
    } catch (Exception $e) {
        $response = [
            'status' => 'error',
            'message' => 'Error en la base de datos: ' . $e->getMessage()
        ];
        echo json_encode($response);
        exit();
    }
} else {
    $response = [
        'status' => 'error',
        'message' => 'Método de solicitud no válido.'
    ];
    echo json_encode($response);
    exit();
}
?>