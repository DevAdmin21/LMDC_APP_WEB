<?php
// 1. Limpieza total de salida
ob_clean(); 
error_reporting(0); 
header('Content-Type: application/json; charset=utf-8');

require_once "Conexion.php";

$id_rep = isset($_GET['id_rep']) ? intval($_GET['id_rep']) : 0;

try {
    $bd = Conexion::getInstance()->getConnection();

    // Consultar Pedidos Disponibles (id_repartidor es NULL)
    $sqlDisp = "SELECT p.id_pedidos, p.monto, p.fecha, d.calle, d.num_ext, d.colonia, d.referencias, 
                       c.nombre as cliente_nombre 
                FROM pedidos p 
                JOIN direccion d ON p.id_direccion = d.id_direccion 
                JOIN cliente c ON d.id_cliente = c.id_cliente 
                WHERE p.id_repartidor IS NULL AND p.estado = 'PENDIENTE'
                ORDER BY p.fecha DESC";
    
    $stmtDisp = $bd->prepare($sqlDisp);
    $stmtDisp->execute();
    $disponibles = $stmtDisp->fetchAll(PDO::FETCH_ASSOC);

    // Consultar Mi Entrega Actual (Asignado a mí y EN CAMINO)
    $mi_entrega = [];
    if ($id_rep > 0) {
        $sqlMio = "SELECT p.id_pedidos, p.monto, p.fecha, d.calle, d.num_ext, d.colonia, d.referencias, 
                          c.nombre as cliente_nombre, c.telefono 
                   FROM pedidos p 
                   JOIN direccion d ON p.id_direccion = d.id_direccion 
                   JOIN cliente c ON d.id_cliente = c.id_cliente 
                   WHERE p.id_repartidor = ? AND p.estado = 'EN CAMINO'";
        
        $stmtMio = $bd->prepare($sqlMio);
        $stmtMio->execute([$id_rep]);
        $mi_entrega = $stmtMio->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode([
        "status" => "success",
        "disponibles" => $disponibles,
        "mi_entrega" => $mi_entrega
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}