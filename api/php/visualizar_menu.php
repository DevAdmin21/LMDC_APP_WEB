<?php

require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/lib/devuelveJson.php";
require_once __DIR__ . "/lib/recibeJson.php";

$pdo = Conexion::getInstance()->getConnection(); //PDO

// RECIBE JSON
$datos = recibeJson();

$categoria = $datos->categoria ?? null;

$sql = "SELECT 
    p.id_platillo,
    p.nombre,
    p.precio,
    p.imagen,
    p.descripcion,
    c.nombre AS categoria
    FROM platillo p
    JOIN categoria_platillos c 
    ON p.id_categoria = c.id_categoria
    WHERE p.disponibilidad = 1";

$params = [];

if ($categoria && $categoria !== "todos") {
    $sql .= " AND c.nombre = :categoria";
    $params[":categoria"] = $categoria;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

$lista = $stmt->fetchAll(PDO::FETCH_ASSOC);

devuelveJson([
 "platillos" => $lista
]);