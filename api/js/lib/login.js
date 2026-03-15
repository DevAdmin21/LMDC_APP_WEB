// Definimos nuestra clase con el patrón Singleton
class ValidadorSesion {
    static instancia;

    constructor() {
        // Si ya existe una instancia de esta clase, retornamos esa misma para mantener una única sesión.
        if (ValidadorSesion.instancia) {
            return ValidadorSesion.instancia;
        }
        
        // Si no existe, la creamos y la guardamos en esta propiedad.
        ValidadorSesion.instancia = this;
    }

    // Método asíncrono para conectar con PHP y validar
    async iniciar(correo, contrasena) {
        console.log("Consultando la base de datos real a través de PHP...");

        try {
            // 1. Empaquetamos los datos exactamente como un formulario
            const formData = new FormData();
            formData.append("correo", correo);
            formData.append("contrasena", contrasena);

            // 2. Usamos Fetch apuntando a nuestro nuevo archivo PHP
            const respuesta = await fetch("api/php/validar_login.php", { 
                method: 'POST', 
                body: formData 
            });
            
            // 3. Recibimos la respuesta de PHP en formato JSON
            const datos = await respuesta.json();

            // 4. Verificamos si el PHP nos dio luz verde
            if (datos.exito) {
                console.log("¡Éxito! Rol detectado: " + datos.usuario.rol);

                // Redirigimos según el rol
                if (datos.usuario.rol === "administrador") {
                    window.location.href = "menu_sesion.html"; 
                } else if (datos.usuario.rol === "repartidor") {
                    window.location.href = "vista_repartidor.html"; // Asegúrate de que este archivo HTML exista
                }
            } else {
                console.error("Error: " + datos.mensaje);
                alert("Datos incorrectos. Verifica tu correo y contraseña."); 
            }

        } catch (error) {
            console.error("Hubo un problema con la petición al servidor: ", error);
            alert("Error de conexión con el servidor.");
        }
    }
}

// Esperamos a que todo el HTML cargue antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formulario-login");

    // Validamos que el formulario exista
    if (formulario) {
        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault(); // Evita que la página se recargue

            // Obtenemos los elementos y le decimos al editor de VS Code que son inputs
            const inputCorreo = /** @type {HTMLInputElement} */ (document.getElementById("correo"));
            const inputContrasena = /** @type {HTMLInputElement} */ (document.getElementById("contrasena"));

            // Validamos que los inputs existan en el HTML
            if (inputCorreo && inputContrasena) {
                const correoIngresado = inputCorreo.value;
                const contrasenaIngresada = inputContrasena.value;

                // Instanciamos nuestro Singleton
                const validador = new ValidadorSesion();
                
                // Ejecutamos el método pasándole los datos
                validador.iniciar(correoIngresado, contrasenaIngresada);
            }
        });
    }
});