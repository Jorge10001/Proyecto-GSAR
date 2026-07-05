document.addEventListener("DOMContentLoaded", function() {
    const listaSolicitudes = document.getElementById("lista-solicitudes");
    const usuarioActual = JSON.parse(localStorage.getItem(Storage.KEYS.SESION));
    const todasLasSolicitudes = Storage.get(Storage.KEYS.SOLICITUDES);

    if (!usuarioActual) {
        window.location.href = "../../index.html";
        return;
    }

    const misSolicitudes = todasLasSolicitudes.filter(s => s.correo === usuarioActual.correo);

    if (misSolicitudes.length === 0) {
        listaSolicitudes.innerHTML = `<p style="padding:20px;">No tienes solicitudes.</p>`;
        return;
    }

    listaSolicitudes.innerHTML = misSolicitudes.reverse().map(s => `
        <div class="solicitud-card">
            <p><strong>${s.tipo}: ${s.cargoSolicitado}</strong></p>
            <span class="status-pill ${s.estado.toLowerCase()}">${s.estado}</span>
        </div>
    `).join('');

    // Cerrar sesión corregido
    document.getElementById("btnCerrarSesion").addEventListener("click", function() {
        Storage.remove(Storage.KEYS.SESION);
        window.location.href = "../../index.html";
    });
});