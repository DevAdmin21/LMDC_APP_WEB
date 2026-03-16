<?php
require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/lib/devuelveJson.php";
session_start();

// Verificar sesión
if (!isset($_SESSION['id_usuario'])) {
    devuelveJson(["exito" => false, "mensaje" => "Sesión no iniciada"]);
    exit;
}

try {
    $pdo = Conexion::getInstance()->getConnection();
    
   
    $sql = "SELECT t.id_trabajador, t.nombre, t.apellido_p, t.telefono, t.rol, t.fecha_contratacion 
            FROM usuario u
            INNER JOIN trabajador t ON u.id_trabajador = t.id_trabajador
            WHERE u.id_usuario = :id_usuario";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id_usuario' => $_SESSION['id_usuario']]);
    $datos = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($datos) {
        devuelveJson(["exito" => true, "datos" => $datos]);
    } else {
        devuelveJson(["exito" => false, "mensaje" => "Este usuario no tiene un perfil de trabajador asignado."]);
    }
} catch (PDOException $e) {

    devuelveJson(["exito" => false, "mensaje" => "Error de SQL: " . $e->getMessage()]);
}