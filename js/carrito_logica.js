document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();

    const btnFinalizar = document.getElementById("btn-finalizar-compra");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            alert("¡Gracias por tu pedido! En breve un repartidor se pondrá en contacto.");
            localStorage.removeItem("carrito_caos"); // Limpiar después de "comprar"
            window.location.href = "index.html";
        });
    }
});

function renderizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const contenedorVacio = document.getElementById("contenedor-carrito-vacio");
    const tablaContenedor = document.getElementById("tabla-contenedor");
    const totalTexto = document.getElementById("total-precio");

    let carrito = JSON.parse(localStorage.getItem("carrito_caos")) || [];

    if (carrito.length === 0) {
        contenedorVacio.style.display = "block";
        tablaContenedor.style.display = "none";
        return;
    }

    contenedorVacio.style.display = "none";
    tablaContenedor.style.display = "block";
    lista.innerHTML = "";

    let totalCalculado = 0;

    carrito.forEach((producto, indice) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>1</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>
                <button class="btn-eliminar" data-indice="${indice}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        lista.appendChild(fila);
        totalCalculado += producto.precio;
    });

    totalTexto.textContent = `$${totalCalculado.toFixed(2)}`;

    // Asignar eventos de eliminación
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = e.currentTarget.getAttribute("data-indice");
            eliminarProducto(idx);
        });
    });
}

function eliminarProducto(indice) {
    let carrito = JSON.parse(localStorage.getItem("carrito_caos")) || [];
    carrito.splice(indice, 1); // Quitar el elemento del arreglo
    localStorage.setItem("carrito_caos", JSON.stringify(carrito));
    renderizarCarrito(); // Recargar la tabla
}