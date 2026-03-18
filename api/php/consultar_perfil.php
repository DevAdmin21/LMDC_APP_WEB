<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

// Importamos tu clase Singleton
require_once 'Conexion.php'; 

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(["error" => "Sesión no activa"]);
    exit;
}

try {
    $pdo = Conexion::getInstance()->getConnection();
    $id_usuario = $_SESSION['id_usuario'];

    // SQL que une usuario con cliente para sacar el teléfono y nombres
    $sql = "SELECT u.correo, c.nombre, c.apellido_p, c.apellido_m, c.telefono 
            FROM usuario u
            INNER JOIN cliente c ON u.id_cliente = c.id_cliente
            WHERE u.id_usuario = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id_usuario]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($resultado);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}