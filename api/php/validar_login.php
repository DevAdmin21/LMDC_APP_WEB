<?php
header('Content-Type: application/json');
require_once 'Conexion.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['correo'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';

    try {
        $pdo = Conexion::getInstance()->getConnection();

        // Cruzamos datos: si id_trabajador es NULL, es CLIENTE automáticamente
        $sql = "SELECT u.correo, u.contrasena, 
                       COALESCE(t.rol, 'CLIENTE') AS rol_usuario
                FROM usuario u
                LEFT JOIN trabajador t ON u.id_trabajador = t.id_trabajador
                WHERE u.correo = :correo";
                
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':correo', $correo);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            if ($contrasena === $usuario['contrasena'] || password_verify($contrasena, $usuario['contrasena'])) {
                echo json_encode([
                    "exito" => true,
                    "usuario" => [
                        "correo" => $usuario['correo'],
                        "rol" => strtolower($usuario['rol_usuario'])
                    ]
                ]);
                exit;
            }
        }
        
        echo json_encode(["exito" => false, "mensaje" => "Credenciales incorrectas"]);

    } catch (Exception $e) {
        echo json_encode(["exito" => false, "mensaje" => "Error: " . $e->getMessage()]);
    }
}
?>