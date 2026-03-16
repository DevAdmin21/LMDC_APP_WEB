<?php
require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/lib/devuelveJson.php";
require_once __DIR__ . "/lib/recibeTexto.php";

session_start();

// 1. Validar seguridad: ¿Está logueado?
if (!isset($_SESSION['id_usuario'])) {
    devuelveJson(["exito" => false, "mensaje" => "Sesión no autorizada."]);
    exit;
}

// 2. Recibir datos del formulario (usando tus nombres de la BD)
$id_trabajador = recibeTexto("id_trabajador");
$nombre        = recibeTexto("nombre");
$apellido_p    = recibeTexto("apellido_p");
$telefono      = recibeTexto("telefono");
$rol           = recibeTexto("rol");
$fecha_cont    = recibeTexto("fecha_contratacion");

// 3. Validar que no vengan vacíos los campos obligatorios
if (!$id_trabajador || !$nombre || !$apellido_p || !$telefono) {
    devuelveJson(["exito" => false, "mensaje" => "Faltan campos obligatorios por llenar."]);
    exit;
}

try {
    $pdo = Conexion::getInstance()->getConnection();

    // 4. Preparar el UPDATE
    // IMPORTANTE: Verifica si tu tabla es 'trabajador' o 'trabajadores'
    // Según tu error anterior, cámbialo al nombre correcto que veas en phpMyAdmin
    $sql = "UPDATE trabajador SET 
                nombre = :nom, 
                apellido_p = :ap, 
                telefono = :tel, 
                rol = :rol, 
                fecha_contratacion = :fecha 
            WHERE id_trabajador = :id";

    $stmt = $pdo->prepare($sql);
    
    $resultado = $stmt->execute([
        ":nom"   => $nombre,
        ":ap"    => $apellido_p,
        ":tel"   => $telefono,
        ":rol"   => $rol,
        ":fecha" => $fecha_cont,
        ":id"    => $id_trabajador
    ]);

    if ($resultado) {
        devuelveJson([
            "exito" => true, 
            "mensaje" => "Los datos de {$nombre} se han actualizado correctamente."
        ]);
    } else {
        devuelveJson(["exito" => false, "mensaje" => "No se realizaron cambios."]);
    }

} catch (Exception $e) {
    // Manejo de errores detallado
    devuelveJson([
        "exito" => false, 
        "mensaje" => "Error al actualizar: " . $e->getMessage()
    ]);
}