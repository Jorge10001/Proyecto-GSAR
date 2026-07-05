document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formSolicitud");
    const usuario = JSON.parse(localStorage.getItem(Storage.KEYS.SESION));

    if (!usuario) {
        window.location.href = "../../index.html";
        return;
    }

    // Llenar datos de info
    const infoGrid = document.getElementById("info-solicitante");
    if (infoGrid) {
        infoGrid.innerHTML = `
            <div><label>Solicitante</label><p>${usuario.nombre}</p></div>
            <div><label>Correo</label><p>${usuario.correo}</p></div>
        `;
    }

    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const solicitudes = Storage.get(Storage.KEYS.SOLICITUDES);

            const nuevaSolicitud = {
                id: "SOL-" + Math.floor(Math.random() * 1000000),
                solicitante: usuario.nombre,
                correo: usuario.correo,
                tipo: document.getElementById("tipo").value,
                cargoSolicitado: document.getElementById("cargoSolicitado").value,
                justificacion: document.getElementById("justificacion").value,
                evidencia: document.getElementById("evidencia").value,
                fecha: new Date().toLocaleDateString('es-ES'),
                estado: "Pendiente"
            };

            solicitudes.push(nuevaSolicitud);
            Storage.save(Storage.KEYS.SOLICITUDES, solicitudes);

            alert("¡Solicitud enviada con éxito!");
            window.location.href = "mis-solicitudes.html";
        });
    }

    // Botón Cerrar Sesión corregido
    const btnLogout = document.getElementById("btnCerrarSesion");
    if (btnLogout) {
        btnLogout.addEventListener("click", function() {
            if (confirm("¿Cerrar sesión?")) {
                Storage.remove(Storage.KEYS.SESION);
                window.location.href = "../../index.html";
            }
        });
    }
});