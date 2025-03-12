<?php
class DBConexion {
    public static function connection() {
        $connection = new mysqli("localhost", "root", "", "OnlineEducation");

        if ($connection->connect_errno) {
            die("Error de conexión a MySQL: " . $connection->connect_error);
        }
        $connection->set_charset("utf8");
        return $connection;
    }
}
?>
