<?php

require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/lib/devuelveJson.php";

try {

$bd = Conexion::getInstance()->getConnection();

$sql = "SELECT 
p.nombre,
p.precio,
p.imagen,
p.descripcion,
c.nombre AS categoria
FROM platillo p
JOIN categoria_platillos c
ON p.id_categoria = c.id_categoria
WHERE p.disponibilidad = 1";

$stmt = $bd->query($sql);

$platillos = $stmt->fetchAll(PDO::FETCH_ASSOC);

devuelveJson([
"platillos" => $platillos
]);

} catch (Throwable $e) {

devuelveJson([
"status" => 500,
"title" => "Error",
"detail" => $e->getMessage()
]);

}