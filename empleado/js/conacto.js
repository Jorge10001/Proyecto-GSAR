document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactoForm");
    const contenedorHistorial = document.getElementById("historialMensajes");
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioSesion"));

    // 1. Validar Sesión y Sidebar
    if (!usuarioActual) {
        window.location.href = "../../index.html";
        return;
    }

    document.getElementById("user-side-name").textContent = usuarioActual.nombre;
    document.getElementById("user-side-role").textContent = usuarioActual.rol.toUpperCase();

    // 2. Función para renderizar el historial del usuario actual
    function renderHistorial() {
        const todosLosMensajes = JSON.parse(localStorage.getItem("mensajesULEAM")) || [];
        
        // Filtro de seguridad: Solo mensajes de este usuario
        const misMensajes = todosLosMensajes.filter(m => m.correo === usuarioActual.correo);
        
        if (misMensajes.length === 0) {
            contenedorHistorial.innerHTML = '<p class="empty-state">No tiene consultas previas.</p>';
            return;
        }

        // Mostramos el último mensaje arriba
        contenedorHistorial.innerHTML = misMensajes.reverse().map(m => `
            <div class="message-item">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h4>${m.asunto}</h4>
                    <small style="color: #64748b;">${m.fecha}</small>
                </div>
                <p>${m.mensaje}</p>
                <span class="status-pill ${m.estado.toLowerCase()}">${m.estado}</span>
            </div>
        `).join('');
    }

    // 3. Evento de Envío
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const nuevoMensaje = {
                id: Date.now(),
                nombre: usuarioActual.nombre,
                correo: usuarioActual.correo, // Importante para el filtro
                asunto: document.getElementById("asunto").value,
                mensaje: document.getElementById("mensaje").value,
                fecha: new Date().toLocaleDateString('es-ES'),
                estado: "Pendiente"
            };

            const mensajes = JSON.parse(localStorage.getItem("mensajesULEAM")) || [];
            mensajes.push(nuevoMensaje);
            localStorage.setItem("mensajesULEAM", JSON.stringify(mensajes));

            alert("Mensaje enviado con éxito. Revisaremos su consulta pronto.");
            form.reset();
            renderHistorial();
        });
    }

    // 4. Cerrar Sesión
    document.getElementById("btnLogout").addEventListener("click", function() {
        if(confirm("¿Desea cerrar su sesión?")) {
            localStorage.removeItem("usuarioSesion");
            window.location.href = "../../index.html";
        }
    });

    // Carga inicial
    renderHistorial();
});