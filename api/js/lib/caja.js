document.addEventListener("DOMContentLoaded", () => {
    // 1. Capturamos los elementos y le decimos al editor exactamente qué tipo de etiquetas son
    const selector = /** @type {HTMLSelectElement} */ (document.getElementById("selector-productos"));
    const btnAgregar = /** @type {HTMLButtonElement} */ (document.getElementById("btn-agregar"));
    const listaCuenta = /** @type {HTMLUListElement} */ (document.getElementById("lista-cuenta"));
    const checkRecipiente = /** @type {HTMLInputElement} */ (document.getElementById("check-recipiente"));
    const montoTotal = /** @type {HTMLSpanElement} */ (document.getElementById("monto-total"));
    const btnCobrar = /** @type {HTMLButtonElement} */ (document.getElementById("btn-cobrar"));

    // 2. Validamos que todos los elementos existan en el HTML para quitar el error "possibly null"
    if (selector && btnAgregar && listaCuenta && checkRecipiente && montoTotal && btnCobrar) {
        
        let productosDisponibles = [];
        let carrito = [];

        // Ahora lee directo de tu base de datos mediante PHP
        async function cargarProductos() {
            try {
                const respuesta = await fetch("api/php/obtener_productos.php");
                productosDisponibles = await respuesta.json();

                if (productosDisponibles.error) {
                    console.error(productosDisponibles.error);
                    return;
                }

                productosDisponibles.forEach(producto => {
                    const opcion = document.createElement("option");
                    opcion.value = producto.id;
                    opcion.textContent = `${producto.nombre} - $${producto.precio.toFixed(2)}`;
                    selector.appendChild(opcion);
                });
            } catch (error) {
                console.error("Error de conexión al cargar el menú:", error);
            }
        }

        function actualizarCuenta() {
            listaCuenta.innerHTML = "";
            let subtotal = 0;

            carrito.forEach((item, index) => {
                subtotal += item.precio;
                
                const li = document.createElement("li");
                li.textContent = `${item.nombre} ........... $${item.precio.toFixed(2)}`;
                
                // Botón de borrar serio
                const btnQuitar = document.createElement("button");
                btnQuitar.textContent = "Quitar";
                btnQuitar.className = "btn-quitar";
                btnQuitar.onclick = () => {
                    carrito.splice(index, 1);
                    actualizarCuenta();
                };

                li.appendChild(btnQuitar);
                listaCuenta.appendChild(li);
            });

            let totalFinal = subtotal;
            if (checkRecipiente.checked) {
                const descuento = subtotal * 0.20;
                totalFinal = subtotal - descuento;
            }

            montoTotal.textContent = totalFinal.toFixed(2);
        }

        btnAgregar.addEventListener("click", () => {
            const idSeleccionado = parseInt(selector.value);
            if (!idSeleccionado) return;

            const productoAgregado = productosDisponibles.find(p => p.id === idSeleccionado);
            
            if (productoAgregado) {
                carrito.push(productoAgregado);
                actualizarCuenta();
            }
        });

        checkRecipiente.addEventListener("change", actualizarCuenta);

        btnCobrar.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("No hay productos registrados para cobrar.");
                return;
            }

            const total = montoTotal.textContent;
            
            alert(`Cobro procesado exitosamente.\n\nTotal: $${total}\n\nLa venta ha sido registrada en el sistema.`);
            
            carrito = [];
            checkRecipiente.checked = false;
            selector.value = ""; 
            actualizarCuenta();
        });

        cargarProductos();
    }
});