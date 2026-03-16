<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'Conexion.php';

try {
    $pdo = Conexion::getInstance()->getConnection();
    
    // Consultamos los platillos que estén disponibles en tu BD
    $sql = "SELECT id_platillo as id, nombre, precio FROM platillo WHERE disponibilidad = 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertimos los precios a formato numérico para que JS pueda sumarlos
    foreach ($productos as &$p) {
        $p['precio'] = (float)$p['precio'];
    }

    echo json_encode($productos);
} catch (Exception $e) {
    echo json_encode(["error" => "Error al obtener menú: " . $e->getMessage()]);
}
?>