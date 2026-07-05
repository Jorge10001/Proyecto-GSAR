document.addEventListener("DOMContentLoaded", () => {
    const id = localStorage.getItem("idRevision");
    const solicitudes = Storage.get(Storage.KEYS.SOLICITUDES);
    
    // BUSCAR: Usamos find en lugar de acceso directo por índice
    const sol = solicitudes.find(s => s.id === id);

    if (!sol) {
        alert("Solicitud no encontrada");
        window.location.href = "gestionar.html";
        return;
    }

    // Rellenar información
    document.getElementById("nombreEmpleado").textContent = sol.solicitante; // Ojo: en tu nueva-solicitud.js guardaste como 'solicitante'
    document.getElementById("emailEmpleado").textContent = sol.correo;
    document.getElementById("cargoActual").textContent = sol.cargoActual || "N/A";
    document.getElementById("cargoSolicitado").textContent = sol.cargoSolicitado || "N/A";
    document.getElementById("tipoSolicitud").textContent = sol.tipo;
    document.getElementById("fechaSolicitud").textContent = sol.fecha;
    document.getElementById("justificacionText").textContent = sol.justificacion;
});

function cambiarEstado(nuevoEstado) {
    const id = localStorage.getItem("idRevision");
    let solicitudes = Storage.get(Storage.KEYS.SOLICITUDES);
    
    // ENCONTRAR Y ACTUALIZAR: Buscamos el índice para actualizar el elemento en el array original
    const index = solicitudes.findIndex(s => s.id === id);
    
    if (index !== -1) {
        solicitudes[index].estado = nuevoEstado;
        Storage.save(Storage.KEYS.SOLICITUDES, solicitudes);
        alert("Solicitud " + nuevoEstado + " correctamente.");
        window.location.href = "gestionar.html";
    }
}