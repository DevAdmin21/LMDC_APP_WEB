<?php
require_once __DIR__ . "/lib/manejaErrores.php";
require_once __DIR__ . "/lib/devuelveJson.php";
require_once __DIR__ . "/lib/BAD_REQUEST.php";
require_once __DIR__ . "/lib/ProblemDetailsException.php";

$input = json_decode(file_get_contents('php://input'), true);

// Validación exhaustiva basada en lmdc.sql
$campos_obligatorios = ['calle', 'numero', 'colonia', 'municipio', 'cp', 'estado'];

foreach ($campos_obligatorios as $campo) {
    if (empty($input[$campo])) {
        throw new ProblemDetailsException([
            "status" => BAD_REQUEST,
            "title" => "Campo faltante",
            "detail" => "El campo '$campo' es necesario para el envío.",
            "type" => "/errors/campo-faltante.html"
        ]);
    }
}

// Validación específica para CP
if (!preg_match('/^[0-9]{5}$/', $input['cp'])) {
    throw new ProblemDetailsException([
        "status" => BAD_REQUEST,
        "title" => "CP Inválido",
        "detail" => "El código postal debe tener 5 dígitos.",
        "type" => "/errors/cp-invalido.html"
    ]);
}

devuelveJson([
    "exito" => true,
    "mensaje" => "Dirección lista para el pedido.",
    "datos" => $input
]);