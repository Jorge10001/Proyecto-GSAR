document.addEventListener("DOMContentLoaded", function() {
    // 1. Obtener datos de sesión
    const usuario = JSON.parse(localStorage.getItem("usuarioSesion"));
    
    if (!usuario) {
        window.location.href = "../../index.html";
        return;
    }

    // 2. Inyectar datos del usuario dinámicamente
    document.getElementById("nombre-display").textContent = usuario.nombre;
    
    // Aquí es donde se asignan el cargo y departamento guardados en el objeto usuario
    document.getElementById("rol-display").textContent = `${usuario.cargo || 'Empleado'} | ${usuario.departamento || 'Sin departamento'}`;
    document.getElementById("depto-display").textContent = usuario.departamento || "N/A";

    // 3. Cargar solicitudes
    const solicitudes = JSON.parse(localStorage.getItem("solicitudesULEAM")) || [];
    const misSolicitudes = solicitudes.filter(s => s.correo === usuario.correo);
    
    const lastType = document.getElementById("last-solic-type");
    const lastStatus = document.getElementById("last-solic-status");

    if (misSolicitudes.length > 0) {
        const ultima = misSolicitudes[misSolicitudes.length - 1];
        lastType.textContent = `${ultima.tipo} a ${ultima.cargoSolicitado}`;
        lastStatus.textContent = "Estado: " + ultima.estado;
        
        // Limpiar clases previas y aplicar la clase dinámica basada en el estado
        lastStatus.className = "status-badge"; 
        lastStatus.classList.add(`status-${ultima.estado.toLowerCase().replace(" ", "-")}`);
    } else {
        lastType.textContent = "No hay trámites recientes";
        lastStatus.style.display = "none";
    }
});