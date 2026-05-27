document.addEventListener("DOMContentLoaded", function() {
    const listaSolicitudes = document.getElementById("lista-solicitudes");
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioSesion"));
    const todasLasSolicitudes = JSON.parse(localStorage.getItem("solicitudesULEAM")) || [];

    // 1. Validar Sesión
    if (!usuarioActual) {
        window.location.href = "../../index.html";
        return;
    }

    // Llenar sidebar
    document.getElementById("user-side-name").textContent = usuarioActual.nombre;
    document.getElementById("user-side-role").textContent = usuarioActual.rol.toUpperCase();

    // 2. Filtrar solicitudes del usuario
    const misSolicitudes = todasLasSolicitudes.filter(s => s.correo === usuarioActual.correo);

    // 3. Renderizar Tarjetas
    if (misSolicitudes.length === 0) {
        listaSolicitudes.innerHTML = `
            <div class="solicitud-card" style="text-align:center; padding: 40px;">
                <p style="color: #64748b;">Aún no has registrado ninguna solicitud de ascenso o recategorización.</p>
            </div>`;
        return;
    }

    // Invertimos para que la más reciente aparezca arriba
    misSolicitudes.reverse().forEach(s => {
        const estadoClase = s.estado.toLowerCase().replace(/\s+/g, '-');
        
        listaSolicitudes.innerHTML += `
            <div class="solicitud-card">
                <div class="card-body">
                    <div class="card-main">
                        <p><strong>${s.tipo}: ${s.cargoSolicitado}</strong></p>
                        <span class="tag">${s.tipo}</span>
                    </div>
                    <div class="card-footer">
                        <span><i class="fa-regular fa-calendar"></i> ${s.fecha}</span>
                        <div class="status-actions">
                            <span class="status-pill ${estadoClase}">
                                <i class="fa-regular fa-circle-dot"></i> ${s.estado}
                            </span>
                            <button class="btn-link" onclick="verDetalles('${s.id}')">Ver detalles <i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // 4. Lógica de Cerrar Sesión
    document.getElementById("btnLogout").addEventListener("click", function() {
        if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            if (typeof Auth !== 'undefined') {
                Auth.cerrarSesion();
            } else {
                localStorage.removeItem("usuarioSesion");
                window.location.href = "../../index.html";
            }
        }
    });
});

// Función para ver detalles (opcional para expandir en el futuro)
function verDetalles(id) {
    console.log("Consultando detalles de: " + id);
}