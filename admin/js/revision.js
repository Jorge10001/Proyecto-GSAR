document.addEventListener("DOMContentLoaded", () => {
    const id = localStorage.getItem("idRevision");
    // Obtenemos del storage centralizado
    const solicitudes = Storage.get(Storage.KEYS.SOLICITUDES);
    const sol = solicitudes[id];

    if (!sol) {
        alert("Solicitud no encontrada");
        window.location.href = "gestionar.html";
        return;
    }

    // Rellenar información
    document.getElementById("nombreEmpleado").textContent = sol.usuario;
    document.getElementById("cargoActual").textContent = sol.cargoActual || "N/A";
    document.getElementById("cargoSolicitado").textContent = sol.cargoSolicitado || "N/A";
    document.getElementById("tipoSolicitud").textContent = sol.tipo;
    document.getElementById("fechaSolicitud").textContent = sol.fecha;
    document.getElementById("justificacionText").textContent = sol.justificacion;
});

function cambiarEstado(nuevoEstado) {
    const id = localStorage.getItem("idRevision");
    let solicitudes = Storage.get(Storage.KEYS.SOLICITUDES);
    
    // Actualizar el objeto
    solicitudes[id].estado = nuevoEstado;
    
    // Guardar en el Storage centralizado
    Storage.save(Storage.KEYS.SOLICITUDES, solicitudes);
    
    alert("Solicitud " + nuevoEstado + " correctamente.");
    window.location.href = "gestionar.html";
}