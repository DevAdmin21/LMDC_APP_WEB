<?php
// Le decimos al navegador que le vamos a responder con un JSON
header('Content-Type: application/json');

// Traemos tu archivo de conexión
require_once 'Conexion.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibimos los datos del JS
    $correo = $_POST['correo'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';

    try {
        $pdo = Conexion::getInstance()->getConnection();

        // Buscamos al usuario y cruzamos datos con 'trabajador' para sacar el rol
        $sql = "SELECT u.correo, u.contrasena, t.rol 
                FROM usuario u 
                INNER JOIN trabajador t ON u.id_trabajador = t.id_trabajador 
                WHERE u.correo = :correo";
                
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':correo', $correo);
        $stmt->execute();
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario) {
            // Validamos la contraseña (soportando texto plano o hash según las notas de tu profe)
            if ($contrasena === $usuario['contrasena'] || password_verify($contrasena, $usuario['contrasena'])) {
                
                // Si todo está bien, le mandamos el éxito al JavaScript
                echo json_encode([
                    "exito" => true,
                    "usuario" => [
                        "correo" => $usuario['correo'],
                        "rol" => strtolower($usuario['rol']) // Lo pasamos a minúsculas
                    ]
                ]);
                exit;
            }
        }
        
        // Si el usuario no existe o la contraseña está mal
        echo json_encode(["exito" => false, "mensaje" => "Credenciales incorrectas"]);

    } catch (Exception $e) {
        echo json_encode(["exito" => false, "mensaje" => "Error de base de datos: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["exito" => false, "mensaje" => "Método no permitido"]);
}
?>