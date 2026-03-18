document.addEventListener("DOMContentLoaded", () => {
    fetch('api/consultar_perfil.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error de sesión:", data.error);
                return;
            }

            // Mapeo de datos
            const nombre = data.nombre || "Usuario";
            const apP = data.apellido_p || "";
            const apM = data.apellido_m || "";
            const telefono = (data.telefono && data.telefono !== "0") ? data.telefono : "No registrado";

            // Renderizar en el HTML
            const elNombre = document.getElementById("cliente-nombre");
            const elCorreo = document.getElementById("info-correo");
            const elTelefono = document.getElementById("info-telefono");

            if (elNombre) elNombre.textContent = `¡BIENVENIDO/A ${nombre} ${apP} ${apM}!`.toUpperCase();
            if (elCorreo) elCorreo.textContent = data.correo || "---";
            if (elTelefono) elTelefono.textContent = telefono;
        })
        .catch(err => console.error("Error al obtener datos:", err));
});