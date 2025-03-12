<?php
include './ddbb/DBConexion.php';

session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];
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
    
    try {
        $db = DBConexion::connection();
        $stmt = $db->prepare("SELECT * FROM user WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        //if($user['password'] == $password){ // Para cadena de texto sin hash en entorno desarrolo
        if ($user && password_verify($password, $user['password'])) { //Hash 
            $_SESSION['user_id'] = $user['id'];
            session_regenerate_id(true); // Mejora la seguridad de la sesión
            
            $response = [
                'status' => 'success',
                'message' => 'Inicio de sesión exitoso',
            ];
        } else {
            $response = [
                'status' => 'error',
                'message' => 'Credenciales incorrectas.'
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