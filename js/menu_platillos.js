import { enviaJsonRecibeJson } from "../api/js/lib/enviaJsonRecibeJson.js";
import { muestraError } from "../api/js/lib/muestraError.js";
import { ProblemDetailsError } from "../api/js/lib/ProblemDetailsError.js";

document.addEventListener("DOMContentLoaded", () => {

    const inicio = document.getElementById("inicio-categorias");
    const galeria = document.getElementById("galeria-principal");

    // ======================
    // CLICK GLOBAL (TODO)
    // ======================
    document.addEventListener("click", (e) => {

        // CLICK EN TARJETAS INICIALES
        const catHome = e.target.closest(".categoria-item");
        if (catHome) {
            const categoria = catHome.dataset.categoria;

            inicio.style.display = "none";
            galeria.style.display = "block";

            activarBoton(categoria);
            cargarPlatillos(categoria);
        }

        // CLICK EN BOTONES
        const btn = e.target.closest(".categorias button");
        if (btn) {
            const categoria = btn.textContent.trim();

            activarBoton(categoria);
            cargarPlatillos(categoria === "Todos" ? "todos" : categoria);
        }

    });

    // ======================
    // MODAL
    // ======================
    const modal = document.getElementById("modal");

    modal.querySelector(".cerrar").onclick = cerrarModal;
    modal.onclick = (e) => { if (e.target === modal) cerrarModal(); };

});


// ======================
// ACTIVAR BOTÓN
// ======================
function activarBoton(categoria){
    document.querySelectorAll(".categorias button").forEach(b => {
        b.classList.toggle(
            "active",
            b.textContent.toLowerCase() === categoria.toLowerCase()
        );
    });
}


// ======================
// API (JSON)
// ======================
async function cargarPlatillos(categoria = "todos") {
    try {

        const res = await enviaJsonRecibeJson(
            "api/php/visualizar_menu.php",
            { categoria },
            "POST"
        );

        const data = await res.json();

        if (!res.ok) throw new ProblemDetailsError(data);

        mostrarPlatillos(data.platillos || []);

    } catch (error) {
        muestraError(error);
    }
}


// ======================
// RENDER
// ======================
function mostrarPlatillos(lista){

    const contenedor = document.getElementById("contenedor-menu");
    contenedor.innerHTML = "";

    lista.forEach(p => {

       

        contenedor.innerHTML += `
        <div class="galeria__item" onclick='abrirModal(${JSON.stringify(p)})'>
            <img src="${p.imagen}" class="galeria__img">
            <p class="galeria__texto">${p.nombre}</p>
            <p style="font-weight:bold">$${p.precio}</p>
        </div>
        `;
    });
}


// ======================
// MODAL
// ======================
window.abrirModal = function(platillo){

    document.getElementById("modal-imagen").src = platillo.imagen;
    document.getElementById("modal-nombre").textContent = platillo.nombre;
    document.getElementById("modal-descripcion").textContent = platillo.descripcion;
    document.getElementById("modal-precio").textContent = "$" + platillo.precio;

    document.getElementById("modal").style.display = "flex";

    document.getElementById("agregar-carrito").onclick = () => {

        let carrito = JSON.parse(localStorage.getItem("carrito_caos")) || [];

        carrito.push({
            id: platillo.id_platillo || Date.now(),
            nombre: platillo.nombre,
            precio: parseFloat(platillo.precio),
            imagen: platillo.imagen
        });

        localStorage.setItem("carrito_caos", JSON.stringify(carrito));

        alert("Agregado al carrito");
        cerrarModal();
    };
}

function cerrarModal(){
    document.getElementById("modal").style.display = "none";
}