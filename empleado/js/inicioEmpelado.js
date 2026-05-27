document.addEventListener("DOMContentLoaded", function() {
    // 1. Obtener datos de sesión
    const usuario = JSON.parse(localStorage.getItem("usuarioSesion"));
    
    if (usuario) {
        document.getElementById("nombre-display").textContent = usuario.nombre;
        document.getElementById("user-side-name").textContent = usuario.nombre;
        document.getElementById("user-side-role").textContent = usuario.rol.toUpperCase();
    } else {
        // Si no hay usuario, redirigir al login por seguridad
        window.location.href = "../../index.html";
    }

    // 2. Cargar solicitudes (Asegúrate de que el nombre coincida con el que usa el Admin)
    const solicitudes = JSON.parse(localStorage.getItem("solicitudesULEAM")) || [];
    const misSolicitudes = solicitudes.filter(s => s.correo === usuario.correo);
    
    document.getElementById("solic-count").textContent = misSolicitudes.length;

    const lastType = document.getElementById("last-solic-type");
    const lastStatus = document.getElementById("last-solic-status");

    if (misSolicitudes.length > 0) {
        const ultima = misSolicitudes[misSolicitudes.length - 1];
        lastType.textContent = `${ultima.tipo} a ${ultima.cargoSolicitado}`;
        lastStatus.textContent = "Estado: " + ultima.estado;
        
        // Limpiar clases previas y poner la nueva
        lastStatus.className = "status-badge"; 
        lastStatus.classList.add(`status-${ultima.estado.toLowerCase().replace(" ", "-")}`);
    } else {
        lastType.textContent = "No hay trámites recientes";
        lastStatus.style.display = "none";
    }

    // 3. Botón de Cerrar Sesión ÚNICO
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", function() {
            if (confirm("¿Estás seguro que deseas cerrar tu sesión?")) {
                // Si usas el objeto Auth que definimos antes:
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