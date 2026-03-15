import { recibeJson } from "./recibeJson.js";
import { consume } from "./consume.js";

/**
 * Valida la sesión actual contra el servidor.
 * @param {string[]} rolesPermitidos - Lista de roles que pueden ver la página. 
 * Si se deja vacío, solo verifica que esté logeado.
 */
export async function autorizar(rolesPermitidos = []) {
    try {
        // Consultamos al servicio PHP usando tu librería
        const respuesta = await consume(recibeJson("api/php/srvSesion.php"));
        const sesion = await respuesta.json();

        // 1. Si no hay sesión iniciada, todos fuera al index/login
        if (!sesion.logeado) {
            window.location.href = "index.html";
            return null;
        }

        // 2. Si hay sesión, pero la página pide roles específicos (ej. solo repartidor)
        if (rolesPermitidos.length > 0) {
            if (!rolesPermitidos.includes(sesion.rol)) {
                // El usuario está logeado pero no tiene permiso para ESTA página
                console.warn(`Acceso denegado para el rol: ${sesion.rol}`);
                
                // Redirigir a su propia área según su rol para que no se pierda
                const homePorRol = {
                    'cliente': 'inicio_cliente.html',
                    'repartidor': 'vista_repartidor.html',
                    'cobrador': 'menu_sesion.html',
                    'administrador': 'admin_panel.html'
                };
                
                window.location.href = homePorRol[sesion.rol] || 'index.html';
                return null;
            }
        }

        // 3. Si todo está bien, retornamos la sesión para usar los datos (correo, etc.)
        return sesion;

    } catch (error) {
        // Tu sistema de muestraError.js capturará esto si el servidor falla
        throw error;
    }
}