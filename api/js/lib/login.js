class ValidadorSesion {
    static instancia;

    constructor() {
        if (ValidadorSesion.instancia) {
            return ValidadorSesion.instancia;
        }
        ValidadorSesion.instancia = this;
    }

    async iniciar(correo, contrasena) {
        try {
            const datosEnvio = new FormData();
            datosEnvio.append("correo", correo);
            datosEnvio.append("contrasena", contrasena);

            const respuesta = await fetch("api/php/validar_login.php", { 
                method: 'POST', 
                body: datosEnvio 
            });
            
            const resultado = await respuesta.json();

            if (resultado.exito) {
                const rol = resultado.usuario.rol;

                const rutas = {
                    'repartidor': 'vista_repartidor.html',
                    'cobrador': 'menu_sesion.html',
                    'cliente': 'Perfil.html',
                    'administrador': 'admin_panel.html'
                };

                window.location.href = rutas[rol] || 'index.html';
            } else {
                alert(resultado.mensaje);
            }

        } catch (error) {
            console.error("Error en la conexión:", error);
            alert("Hubo un error al conectar con el servidor.");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    /** @type {HTMLFormElement | null} */
    const formulario = document.querySelector("#formulario-login");

    if (formulario) {
        formulario.addEventListener("submit", function(evento) {
            evento.preventDefault();

            // Al haber definido el tipo arriba con JSDoc, 
            // 'this' o 'formulario' ya son aceptados por FormData
            const data = new FormData(formulario);
            const correo = data.get("correo");
            const contrasena = data.get("contrasena");

            if (correo && contrasena) {
                const validador = new ValidadorSesion();
                // Convertimos a string para asegurar que el valor sea el correcto
                validador.iniciar(correo.toString(), contrasena.toString());
            }
        });
    }
});