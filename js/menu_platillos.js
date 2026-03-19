import { recibeJson } from "../api/js/lib/recibeJson.js";
import { muestraError } from "../api/js/lib/muestraError.js";
import { ProblemDetailsError } from "../api/js/lib/ProblemDetailsError.js";


document.addEventListener("DOMContentLoaded", function () {

    const botones = document.querySelectorAll(".categorias button");
    const categoriasHome = document.querySelectorAll(".categoria-item");
    const inicioCategorias = document.getElementById("inicio-categorias");
    const galeriaPrincipal = document.getElementById("galeria-principal");

    // ======================
    // BOTONES DE GALERÍA
    // ======================
    botones.forEach(btn => {
        btn.addEventListener("click", () => {

            botones.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const categoria = btn.textContent === "Todos" ? "todos" : btn.textContent;

            cargarPlatillos(categoria);
        });
    });

    // ======================
    // PANTALLA INICIAL
    // ======================
    categoriasHome.forEach(cat => {
        cat.addEventListener("click", () => {

            const categoria = cat.getAttribute("data-categoria");

            inicioCategorias.style.display = "none";
            galeriaPrincipal.style.display = "block";

            cargarPlatillos(categoria);

            // Activar botón correspondiente
            document.querySelectorAll(".categorias button").forEach(b => b.classList.remove("active"));

            const btnGaleria = Array.from(document.querySelectorAll(".categorias button"))
                .find(b => b.textContent.toLowerCase() === categoria.toLowerCase());

            if (btnGaleria) btnGaleria.classList.add("active");
        });
    });

    // ======================
    // MODAL
    // ======================
    const modal = document.getElementById("modal");
    const cerrarBtn = modal.querySelector(".cerrar");

    cerrarBtn.addEventListener("click", cerrarModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) cerrarModal(); });

});

// ======================
// CARGAR DESDE BACKEND
// ======================
async function cargarPlatillos(categoria = "todos") {
    try {

        const url = `api/php/visualizar_menu.php?categoria=${encodeURIComponent(categoria)}`;

        const res = await recibeJson(url);
        const data = await res.json();

        if (!res.ok) {
            throw new ProblemDetailsError(data);
        }

        mostrarPlatillos(data.platillos || []);

    } catch (error) {
        muestraError(error);
    }
}

// ======================
// MOSTRAR PLATILLOS
// ======================
function mostrarPlatillos(lista) {

    const contenedor = document.getElementById("contenedor-menu");
    contenedor.innerHTML = "";

    lista.forEach(p => {

        const item = document.createElement("div");
        item.classList.add("galeria__item");

        item.innerHTML = `
            <img src="${p.imagen}" class="galeria__img">
            <p class="galeria__texto">${p.nombre}</p>
            <p style="font-weight:bold">$${p.precio}</p>
        `;

        contenedor.appendChild(item);

        item.addEventListener("click", () => abrirModal(p));
    });
}

// ======================
// MODAL
// ======================
function abrirModal(platillo) {

    document.getElementById("modal-imagen").src = platillo.imagen;
    document.getElementById("modal-nombre").textContent = platillo.nombre;
    document.getElementById("modal-descripcion").textContent = platillo.descripcion;
    document.getElementById("modal-precio").textContent = "$" + platillo.precio;

    document.getElementById("modal").style.display = "flex";

    const btnAgregar = document.getElementById("agregar-carrito");

    btnAgregar.onclick = () => {

        let carrito = JSON.parse(localStorage.getItem("carrito_caos")) || [];

        carrito.push({
            id: platillo.id_platillo || Date.now(),
            nombre: platillo.nombre,
            precio: parseFloat(platillo.precio),
            imagen: platillo.imagen
        });

        localStorage.setItem("carrito_caos", JSON.stringify(carrito));

        alert(`${platillo.nombre} agregado al carrito!`);
        cerrarModal();
    };
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

// ======================
// FUNCIÓN GLOBAL
// ======================
function filtrarCategoria(categoria){
    cargarPlatillos(categoria);
}

// DESPUÉS de declararla
window.filtrarCategoria = filtrarCategoria;