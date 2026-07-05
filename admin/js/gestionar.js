document.addEventListener("DOMContentLoaded", function() {
    renderizarSolicitudes();

    const btnLogout = document.getElementById("btnCerrarSesion");
    if (btnLogout) {
        btnLogout.addEventListener("click", function() {
            if (confirm("¿Desea cerrar su sesión?")) {
                Storage.remove(Storage.KEYS.SESION);
                window.location.href = "../../index.html";
            }
        });
    }
});

// Función para capturar el ID y redirigir a la revisión
function abrirRevision(id) {
    localStorage.setItem("idRevision", id);
    window.location.href = "revision.html";
}

function renderizarSolicitudes() {
    const tbody = document.getElementById("tabla-solicitudes");
    const solicitudes = Storage.get(Storage.KEYS.SOLICITUDES);

    if (solicitudes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay solicitudes registradas.</td></tr>`;
        return;
    }

    tbody.innerHTML = solicitudes.map(s => `
        <tr>
            <td>${s.id}</td>
            <td>${s.solicitante}</td>
            <td>${s.tipo}</td>
            <td>${s.fecha}</td>
            <td><span class="status-badge ${s.estado.toLowerCase()}">${s.estado}</span></td>
            <td>
                <button onclick="abrirRevision('${s.id}')" class="btn-accion">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}