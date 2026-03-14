<?php
require_once __DIR__ . "/Conexion.php";

function registrarUsuario($datos) {
    try {
        $pdo = Conexion::getInstance()->getConnection();
        $pdo->beginTransaction();

        // 1. Insertar en la tabla 'cliente'
        $sqlC = "INSERT INTO cliente (nombre, apellido_p, apellido_m, correo, telefono) 
                 VALUES (:nom, :ap, :am, :cor, :tel)";
        $stC = $pdo->prepare($sqlC);
        $stC->execute([
            ":nom" => $datos["nombre"],
            ":ap"  => $datos["apellidoPaterno"],
            ":am"  => $datos["apellidoMaterno"],
            ":cor" => $datos["correo"],
            ":tel" => $datos["telefono"]
        ]);

        $id_cliente = $pdo->lastInsertId();

        // 2. Insertar en la tabla 'direccion'
        // Se quitaron las columnas que daban error (entidad, colonia, referencias)
        $sqlD = "INSERT INTO direccion (calle, num_int, num_ext, municipio, codigo_postal, id_cliente) 
                 VALUES (:calle, :ni, :ne, :mun, :cp, :id_cli)";
        $stD = $pdo->prepare($sqlD);
        $stD->execute([
            ":calle" => $datos["calle"],
            ":ni"    => (int)$datos["numeroInterior"],
            ":ne"    => (int)$datos["numeroExterior"],
            ":mun"   => "Nezahualcóyotl", 
            ":cp"    => (int)$datos["codigoPostal"],
            ":id_cli" => $id_cliente
        ]);

        // 3. Insertar en la tabla 'usuario'
        $passHash = password_hash($datos["contrasena"], PASSWORD_BCRYPT);
        $sqlU = "INSERT INTO usuario (correo, contrasena, id_cliente) 
                 VALUES (:cor, :pass, :id_cli)";
        $stU = $pdo->prepare($sqlU);
        $stU->execute([
            ":cor"    => $datos["correo"],
            ":pass"   => $passHash,
            ":id_cli" => $id_cliente
        ]);

        $pdo->commit();
        return true;

    } catch (Exception $e) {
        if (isset($pdo) && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}