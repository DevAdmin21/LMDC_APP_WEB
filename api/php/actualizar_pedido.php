<?php
ob_clean();
header('Content-Type: application/json');
require_once "Conexion.php";

$id_pedido = isset($_POST['id_pedido']) ? $_POST['id_pedido'] : null;
$id_repartidor = isset($_POST['id_repartidor']) ? $_POST['id_repartidor'] : null;
$accion = isset($_POST['accion']) ? $_POST['accion'] : '';

try {
    $bd = Conexion::getInstance()->getConnection();

    if ($accion === "aceptar") {
        // Asignamos al repartidor y cambiamos estado
        $sql = "UPDATE pedidos SET id_repartidor = ?, estado = 'EN CAMINO' WHERE id_pedidos = ?";
        $stmt = $bd->prepare($sql);
        $stmt->execute([$id_repartidor, $id_pedido]);
    } else if ($accion === "entregar") {
        // Marcamos como entregado
        $sql = "UPDATE pedidos SET estado = 'ENTREGADO' WHERE id_pedidos = ?";
        $stmt = $bd->prepare($sql);
        $stmt->execute([$id_pedido]);
    }

    echo json_encode(["status" => "success"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}