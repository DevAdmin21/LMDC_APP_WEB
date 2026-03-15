import { recibeJson } from "./lib/recibeJson.js";
import { consume } from "./lib/consume.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const respuesta = await consume(recibeJson("api/php/srvSesion.php"));
        const sesion = await respuesta.json();

        if (sesion.logeado) {
            actualizarInterfazUsuario(sesion);
        }
    } catch (error) {
        console.log("Navegación en modo invitado.");
    }
});

/**
 * @param {any} sesion 
 */
function actualizarInterfazUsuario(sesion) {
    const contenedorMenu = document.getElementById("menu-desplegable");
    
    /** @type {HTMLAnchorElement | null} */
    const enlaceLogin = document.querySelector(".navegacion__enlace--inicio");

    if (enlaceLogin && contenedorMenu) {
        // 1. Transformar el botón de login en Logout
        enlaceLogin.textContent = "Cerrar Sesión";
        enlaceLogin.href = "#"; 
        enlaceLogin.addEventListener("click", cerrarSesion);

        // 2. Crear fragmento para los nuevos elementos (Mejora el rendimiento)
        const fragmento = document.createDocumentFragment();

        // --- Elemento Carrito ---
        const liCarrito = document.createElement("li");
        liCarrito.className = "navegacion__item";
        liCarrito.innerHTML = `
            <a href="carrito.html" class="navegacion__enlace" title="Mi Carrito">
                <i class="fa-solid fa-cart-shopping"></i>
            </a>
        `;
        fragmento.appendChild(liCarrito);

        // --- Elemento Perfil ---
        const liPerfil = document.createElement("li");
        liPerfil.className = "navegacion__item";
        liPerfil.innerHTML = `
            <a href="Perfil.html" class="navegacion__enlace" title="Mi Perfil">
                <i class="fa-solid fa-user"></i> Perfil
            </a>
        `;
        fragmento.appendChild(liPerfil);

        // 3. Insertar todo antes del <li> de Iniciar/Cerrar Sesión
        const liPadreLogin = enlaceLogin.parentElement;
        if (liPadreLogin) {
            contenedorMenu.insertBefore(fragmento, liPadreLogin);
        }
    }
}

/**
 * @param {Event} e
 */
async function cerrarSesion(e) {
    e.preventDefault();
    if (confirm("¿Seguro que deseas salir de La Madre Del Caos?")) {
        try {
            await fetch("api/php/logout.php");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    }
}