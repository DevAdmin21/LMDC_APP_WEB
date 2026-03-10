<?php

require_once __DIR__ . "/lib/recibeTexto.php";
require_once __DIR__ . "/lib/devuelveJson.php";

// Datos personales
$nombre = recibeTexto("nombre");
$apellidoPaterno = recibeTexto("apellidoPaterno");
$apellidoMaterno = recibeTexto("apellidoMaterno");

// Contacto y ubicación
$telefono = recibeTexto("telefono");
$codigoPostal = recibeTexto("codigoPostal");
$calle = recibeTexto("calle");
$numeroExterior = recibeTexto("numeroExterior");
$numeroInterior = recibeTexto("numeroInterior");

// Credenciales
$correo = recibeTexto("correo");
$contrasena = recibeTexto("contrasena");
$confirmarContrasena = recibeTexto("confirmarContrasena");

if($contrasena == $confirmarContrasena){
    $resultado = "Registro procesado para: {$nombre} {$apellidoPaterno} ({$correo})";
    devuelveJson($resultado);
}else{
    $resultado = "Las contraseñas no coinciden";
    devuelveJson($resultado);
}