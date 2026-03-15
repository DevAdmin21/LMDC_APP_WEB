<?php
// Importamos tus librerías para mantener la consistencia
require_once __DIR__ . "/lib/devuelveJson.php";
require_once 'Conexion.php'; 

// 1. Iniciamos sesión al principio para poder guardar datos
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['correo'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';

    try {
        $pdo = Conexion::getInstance()->getConnection();

        // Agregamos id_usuario a la consulta para identificarlo en la sesión
        $sql = "SELECT u.id_usuario, u.correo, u.contrasena, 
                       COALESCE(t.rol, 'CLIENTE') AS rol_usuario
                FROM usuario u
                LEFT JOIN trabajador t ON u.id_trabajador = t.id_trabajador
                WHERE u.correo = :correo";
                
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':correo', $correo);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            // Verificamos contraseña
            if ($contrasena === $usuario['contrasena'] || password_verify($contrasena, $usuario['contrasena'])) {
                
                // 2. AQUÍ INICIA LA MAGIA: Guardamos en la superglobal $_SESSION
                $_SESSION['id_usuario'] = $usuario['id_usuario'];
                $_SESSION['correo'] = $usuario['correo'];
                $_SESSION['rol'] = strtolower($usuario['rol_usuario']);

                // 3. Respondemos usando tu función devuelveJson
                devuelveJson([
                    "exito" => true,
                    "usuario" => [
                        "correo" => $_SESSION['correo'],
                        "rol" => $_SESSION['rol']
                    ]
                ]);
                exit;
            }
        }
        
        // Si llegamos aquí, las credenciales fallaron
        http_response_code(401);
        devuelveJson(["exito" => false, "mensaje" => "Credenciales incorrectas"]);

    } catch (Exception $e) {
        http_response_code(500);
        devuelveJson(["exito" => false, "mensaje" => "Error: " . $e->getMessage()]);
    }
}
?>