document.addEventListener("DOMContentLoaded", () => {
    const solicitudes = Storage.get(Storage.KEYS.SOLICITUDES) || [];
    const tbody = document.getElementById("tablaGestion");

    if (!tbody) return; // Validación de seguridad
    tbody.innerHTML = ""; 

    solicitudes.forEach((sol, index) => {
        tbody.innerHTML += `
            <tr>
                <td>#${sol.id || index + 1}</td>
                <td>
                    <div class="user-cell">
                        <i class="fa-solid fa-circle-user"></i>
                        <span>${sol.solicitante || 'Empleado'}</span>
                    </div>
                </td>
                <td>${sol.tipo}</td>
                <td>${Helpers.formatearFecha(sol.fecha)}</td>
                <td>
                    <span class="status-badge status-${sol.estado.toLowerCase()}">
                        <i class="fa-solid ${getIcon(sol.estado)}"></i> ${sol.estado}
                    </span>
                </td>
                <td>
                    <button class="btn-review" onclick="irARevisar(${index})">
                        <i class="fa-solid fa-magnifying-glass"></i> Revisar
                    </button>
                </td>
            </tr>
        `;
    });
});

function getIcon(estado) {
    const iconos = { "Pendiente": "fa-clock", "Aprobada": "fa-circle-check", "Rechazada": "fa-circle-xmark" };
    return iconos[estado] || "fa-question";
}

// Función que realiza la navegación
function irARevisar(index) {
    localStorage.setItem("idRevision", index);
    window.location.href = "revision.html";
}