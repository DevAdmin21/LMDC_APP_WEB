<?php

require_once __DIR__ . "/lib/recibeTexto.php";
require_once __DIR__ . "/lib/devuelveJson.php";
require_once __DIR__ . "/registrarUsuario.php";

//Recibir todos los datos del formulario
$datos = [
    "nombre" => recibeTexto("nombre"),
    "apellidoPaterno" => recibeTexto("apellidoPaterno"),
    "apellidoMaterno" => recibeTexto("apellidoMaterno"),
    "telefono" => recibeTexto("telefono"),
    "codigoPostal" => recibeTexto("codigoPostal"),
    "calle" => recibeTexto("calle"),
    "numeroExterior" => recibeTexto("numeroExterior"),
    "numeroInterior" => recibeTexto("numeroInterior"),
    "correo" => recibeTexto("correo"),
    "contrasena" => recibeTexto("contrasena"),
    "confirmarContrasena" => recibeTexto("confirmarContrasena")
];

//Validar que los campos obligatorios no estén vacíos
$faltantes = [];
foreach ($datos as $campo => $valor) {
    //Definimos qué campos pueden ser opcionales
    $esOpcional = ($campo === "apellidoMaterno" || $campo === "numeroInterior");
    
    if (!$esOpcional && ($valor === null || trim($valor) === "")) {
        $faltantes[] = $campo;
    }
}

if (count($faltantes) > 0) {
    devuelveJson("Faltan los siguientes campos obligatorios: " . implode(", ", $faltantes));
    exit;
}

if (strlen($datos["contrasena"]) < 8) {
    devuelveJson("La contraseña debe tener al menos 8 caracteres.");
    exit;
}

if ($datos["contrasena"] !== $datos["confirmarContrasena"]) {
    devuelveJson("Las contraseñas no coinciden.");
    exit;
}

try {
    if (registrarUsuario($datos)) {
        //Devolvemos el objeto JSON que el JS espera para hacer el redirect
        devuelveJson([
            "exito" => true,
            "mensaje" => "Registro procesado para: {$datos['nombre']} {$datos['apellidoPaterno']}"
        ]);
    }
} catch (Exception $e) {
    // Manejo de errores de base de datos
    if ($e->getCode() == 23000) {
        devuelveJson("El correo electrónico ya está registrado.");
    } else {
        devuelveJson("Error en el servidor: " . $e->getMessage());
    }
}