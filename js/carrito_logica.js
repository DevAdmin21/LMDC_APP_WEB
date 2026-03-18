document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar el contenido inicial del carrito al abrir la página
    renderizarCarrito();

    // 2. Referencias a elementos del DOM
    const btnFinalizar = document.getElementById("btn-finalizar-compra");
    const modalDir = document.getElementById("modal-direccion");
    const btnCerrarModal = document.getElementById("cerrar-modal-dir");
    const btnNuevaDir = document.getElementById("btn-nueva-direccion");
    const btnUsarPerfil = document.getElementById("btn-usar-perfil");
    const formNuevaDir = document.getElementById("form-nueva-direccion");
    const opcionesDir = document.getElementById("opciones-direccion");

    // --- FLUJO PASO 1: ABRIR MODAL DE DIRECCIÓN ---
    if (btnFinalizar) {
        // IMPORTANTE: Se eliminó el listener anterior que hacía redirección directa
        btnFinalizar.addEventListener("click", (e) => {
            e.preventDefault(); 
            
            const carrito = JSON.parse(localStorage.getItem("carrito_caos")) || [];
            if (carrito.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }

            // Mostramos el modal de dirección
            if (modalDir) {
                modalDir.style.display = "flex";
            }
        });
    }

    // Cerrar modal con la X
    if (btnCerrarModal) {
        btnCerrarModal.onclick = () => {
            modalDir.style.display = "none";
        };
    }

    // Botón para desplegar el formulario de nueva dirección
    if (btnNuevaDir) {
        btnNuevaDir.addEventListener("click", () => {
            opcionesDir.style.display = "none";
            formNuevaDir.style.display = "block";
        });
    }

    // Botón para usar dirección de perfil
    if (btnUsarPerfil) {
        btnUsarPerfil.addEventListener("click", () => {
            // Aquí podrías validar contra la sesión si el usuario tiene dirección
            localStorage.setItem("direccion_final", JSON.stringify({ tipo: "perfil" }));
            activarPasarelaPago();
        });
    }

    // --- FLUJO PASO 2: VALIDACIÓN JSON DE NUEVA DIRECCIÓN ---
    if (formNuevaDir) {
        formNuevaDir.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Recolectamos todos los campos necesarios para la tabla 'direccion' de lmdc.sql
            const datos = {
                calle: document.getElementById("dir_calle").value,
                numero: document.getElementById("dir_numero")?.value || "S/N",
                colonia: document.getElementById("dir_colonia").value,
                municipio: document.getElementById("dir_municipio")?.value || "Nezahualcóyotl",
                cp: document.getElementById("dir_cp")?.value || "57000",
                estado: document.getElementById("dir_estado")?.value || "Estado de México"
            };

            try {
                // Validación contra el servidor usando formato JSON
                const response = await fetch("api/php/validar_direccion.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(datos)
                });

                const resultado = await response.json();

                if (response.ok && resultado.exito) {
                    // Guardamos la dirección confirmada para el registro final del pedido
                    localStorage.setItem("direccion_final", JSON.stringify(datos));
                    activarPasarelaPago();
                } else {
                    // Manejo de errores con ProblemDetails
                    alert("Error: " + (resultado.title || "Datos de dirección inválidos"));
                }
            } catch (error) {
                console.error("Error en comunicación con el servidor:", error);
                alert("No se pudo conectar con el servicio de validación.");
            }
        });
    }
});

// --- RENDERIZADO DINÁMICO DE LA TABLA ---
function renderizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const contenedorVacio = document.getElementById("contenedor-carrito-vacio");
    const tablaContenedor = document.getElementById("tabla-contenedor");
    const totalTexto = document.getElementById("total-precio");

    let carrito = JSON.parse(localStorage.getItem("carrito_caos")) || [];

    if (carrito.length === 0) {
        if(contenedorVacio) contenedorVacio.style.display = "block";
        if(tablaContenedor) tablaContenedor.style.display = "none";
        return;
    }

    if(contenedorVacio) contenedorVacio.style.display = "none";
    if(tablaContenedor) tablaContenedor.style.display = "block";
    lista.innerHTML = "";

    let totalCalculado = 0;

    carrito.forEach((producto, indice) => {
        const fila = document.createElement("tr");
        const cantidad = producto.cantidad || 1;
        const subtotal = producto.precio * cantidad;
        totalCalculado += subtotal;

        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${cantidad}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarProducto(${indice})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        lista.appendChild(fila);
    });

    if(totalTexto) totalTexto.textContent = `$${totalCalculado.toFixed(2)}`;
}

// Función global para eliminar productos desde el icono de basura
window.eliminarProducto = function(indice) {
    let carrito = JSON.parse(localStorage.getItem("carrito_caos")) || [];
    carrito.splice(indice, 1);
    localStorage.setItem("carrito_caos", JSON.stringify(carrito));
    renderizarCarrito();
};

// --- ACTIVACIÓN DE PASARELA ---
function activarPasarelaPago() {
    const modalDir = document.getElementById("modal-direccion");
    const btnFinalizar = document.getElementById("btn-finalizar-compra");
    const paypalCont = document.getElementById("paypal-button-container");

    // Cerramos el modal de dirección
    if(modalDir) modalDir.style.display = "none";
    
    // Ocultamos el botón original de finalizar para evitar clics duplicados
    if(btnFinalizar) btnFinalizar.style.display = "none";
    
    // Mostramos y cargamos los botones inteligentes de PayPal
    if(paypalCont) {
        paypalCont.style.display = "block";
        inicializarPaypal();
    }
}

function inicializarPaypal() {
    const totalTexto = document.getElementById("total-precio").textContent.replace('$', '');
    
    // Limpiamos el contenedor por si acaso
    const container = document.getElementById("paypal-button-container");
    container.innerHTML = "";

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: totalTexto }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Pago exitoso. Procesando registro de pedido para ' + details.payer.name.given_name);
                
                // Aquí se debe llamar a registrar_pedido.php en el siguiente paso
                localStorage.removeItem("carrito_caos");
                localStorage.removeItem("direccion_final");
                window.location.href = "index.html";
            });
        }
    }).render('#paypal-button-container');
}