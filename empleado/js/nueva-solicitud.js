document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formSolicitud");
    const usuario = JSON.parse(localStorage.getItem("usuarioSesion"));

    // 1. Validar sesión y mostrar datos del usuario
    if (!usuario) {
        window.location.href = "../../index.html";
        return;
    }

    // Llenar datos en el sidebar y en la tarjeta de información
    document.getElementById("user-side-name").textContent = usuario.nombre;
    document.getElementById("user-side-role").textContent = usuario.rol.toUpperCase();

    const infoGrid = document.getElementById("info-solicitante");
    infoGrid.innerHTML = `
        <div><label>Solicitante</label><p>${usuario.nombre}</p></div>
        <div><label>Cargo Actual</label><p>${usuario.rol === 'admin' ? 'Administrador' : 'Empleado'}</p></div>
        <div><label>Departamento</label><p>Personal ULEAM</p></div>
        <div><label>Correo</label><p>${usuario.correo}</p></div>
    `;

    // 2. Lógica de Envío de Formulario
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Obtener solicitudes existentes
            const solicitudes = JSON.parse(localStorage.getItem("solicitudesULEAM")) || [];

            // Crear objeto de solicitud
            const nuevaSolicitud = {
                id: "SOL-" + Math.floor(Math.random() * 1000000),
                solicitante: usuario.nombre,
                correo: usuario.correo,
                tipo: document.getElementById("tipo").value,
                cargoSolicitado: document.getElementById("cargoSolicitado").value,
                justificacion: document.getElementById("justificacion").value,
                evidencia: document.getElementById("evidencia").value,
                fecha: new Date().toLocaleDateString('es-ES', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                }),
                estado: "Pendiente"
            };

            // Guardar en la lista global
            solicitudes.push(nuevaSolicitud);
            localStorage.setItem("solicitudesULEAM", JSON.stringify(solicitudes));

            alert("¡Solicitud enviada con éxito a Talento Humano!");
            window.location.href = "mis-solicitudes.html";
        });
    }

    // 3. Botón de Cerrar Sesión
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", function() {
            if (confirm("¿Desea cerrar su sesión?")) {
                if (typeof Auth !== 'undefined') {
                    Auth.cerrarSesion();
                } else {
                    localStorage.removeItem("usuarioSesion");
                    window.location.href = "../../index.html";
                }
            }
        });
    }
});