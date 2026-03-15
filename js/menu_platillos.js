let platillos = [];

document.addEventListener("DOMContentLoaded", function () {

    // ======================
    // Cargar platillos desde API
    // ======================
    fetch("api/php/visualizar_menu.php")
    .then(res => res.json())
    .then(data => {
        platillos = data.platillos || data; 
    })
    .catch(error => console.log(error));

    // ======================
    // Botones de categoría en la galería
    // ======================
    const botones = document.querySelectorAll(".categorias button");
    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            botones.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const categoria = btn.textContent === "Todos" ? "todos" : btn.textContent;
            filtrarCategoria(categoria);
        });
    });

    // ======================
    // Pantalla inicial de selección de categoría
    // ======================
    const categoriasHome = document.querySelectorAll(".categoria-item");
    const inicioCategorias = document.getElementById("inicio-categorias");
    const galeriaPrincipal = document.getElementById("galeria-principal");

    categoriasHome.forEach(cat => {
        cat.addEventListener("click", () => {
            const categoria = cat.getAttribute("data-categoria");
            inicioCategorias.style.display = "none";  
            galeriaPrincipal.style.display = "block"; 
            filtrarCategoria(categoria);

            document.querySelectorAll(".categorias button").forEach(b => b.classList.remove("active"));
            const btnGaleria = Array.from(document.querySelectorAll(".categorias button"))
                .find(b => b.textContent === cat.querySelector("h2").textContent);
            if(btnGaleria) btnGaleria.classList.add("active");
        });
    });

    // ======================
    // Modal del platillo
    // ======================
    const modal = document.getElementById("modal");
    const cerrarBtn = modal.querySelector(".cerrar");

    cerrarBtn.addEventListener("click", cerrarModal);
    modal.addEventListener("click", (e) => { if(e.target === modal) cerrarModal(); });

});

// ======================
// Funciones
// ======================

function mostrarPlatillos(lista){
    const contenedor = document.getElementById("contenedor-menu");
    contenedor.innerHTML = "";

    lista.forEach(p => {
        if(p.imagen && p.precio){
            const item = document.createElement("div");
            item.classList.add("galeria__item");
            item.innerHTML = `
                <img src="${p.imagen}" class="galeria__img">
                <p class="galeria__texto">${p.nombre}</p>
                <p style="font-weight:bold">$${p.precio}</p>
            `;
            contenedor.appendChild(item);
            item.addEventListener("click", () => abrirModal(p));
        }
    });
}

function filtrarCategoria(categoria){
    if(categoria === "todos"){
        mostrarPlatillos(platillos);
        return;
    }
    const filtrados = platillos.filter(p => p.categoria === categoria);
    mostrarPlatillos(filtrados);
}

// FUNCIÓN CORREGIDA
function abrirModal(platillo){
    document.getElementById("modal-imagen").src = platillo.imagen;
    document.getElementById("modal-nombre").textContent = platillo.nombre;
    document.getElementById("modal-descripcion").textContent = platillo.descripcion;
    document.getElementById("modal-precio").textContent = "$" + platillo.precio;
    document.getElementById("modal").style.display = "flex";

    const btnAgregar = document.getElementById("agregar-carrito");
    
    // Definimos una única vez la acción del botón
    btnAgregar.onclick = () => {
        // 1. Obtener el carrito actual
        let carrito = JSON.parse(localStorage.getItem("carrito_caos")) || [];

        // 2. Añadir el nuevo platillo
        carrito.push({
            id: platillo.id_platillo || Date.now(),
            nombre: platillo.nombre,
            precio: parseFloat(platillo.precio),
            imagen: platillo.imagen
        });

        // 3. Guardar en localStorage
        localStorage.setItem("carrito_caos", JSON.stringify(carrito));

        alert(`${platillo.nombre} agregado al carrito!`);
        cerrarModal();
    };
}

function cerrarModal(){
    document.getElementById("modal").style.display = "none";
}