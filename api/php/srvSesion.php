<?php
require_once __DIR__ . "/lib/devuelveJson.php";

// Reanudamos la sesión existente
session_start();

if (isset($_SESSION['id_usuario'])) {
    devuelveJson([
        "logeado" => true,
        "correo" => $_SESSION['correo'],
        "rol" => $_SESSION['rol']
    ]);
} else {
    // Si no hay sesión, avisamos al JS para que redirija
    devuelveJson(["logeado" => false]);
}