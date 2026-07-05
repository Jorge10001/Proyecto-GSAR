document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactoForm");
    const contenedorHistorial = document.getElementById("historialMensajes");
    const usuarioActual = JSON.parse(localStorage.getItem(Storage.KEYS.SESION));

    if (!usuarioActual) {
        window.location.href = "../../index.html";
        return;
    }

    // 2. Función para renderizar el historial
    function renderHistorial() {
        const todosLosMensajes = Storage.get(Storage.KEYS.MENSAJES);
        
        // Filtramos por el correo del usuario
        const misMensajes = todosLosMensajes.filter(m => m.correo === usuarioActual.correo);
        
        if (misMensajes.length === 0) {
            contenedorHistorial.innerHTML = '<p class="empty-state">No tiene consultas previas.</p>';
            return;
        }

        contenedorHistorial.innerHTML = misMensajes.reverse().map(m => `
            <div class="message-item" style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <div style="display: flex; justify-content: space-between;">
                    <strong>${m.asunto}</strong>
                    <small>${m.fecha}</small>
                </div>
                <p>${m.texto}</p> <span class="status-pill">${m.estado}</span>
            </div>
        `).join('');
    }

    // 3. Envío de Formulario
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const mensajes = Storage.get(Storage.KEYS.MENSAJES);
            
            const nuevoMensaje = {
                id: Date.now(),
                remitente: usuarioActual.nombre, // Cambiado para coincidir con mensajes.js
                correo: usuarioActual.correo,
                asunto: document.getElementById("asunto").value,
                texto: document.getElementById("mensaje").value, // Cambiado a 'texto'
                fecha: new Date().toLocaleDateString('es-ES'),
                estado: "Pendiente"
            };

            mensajes.push(nuevoMensaje);
            Storage.save(Storage.KEYS.MENSAJES, mensajes);

            alert("Mensaje enviado con éxito.");
            form.reset();
            renderHistorial();
        });
    }

    // 4. Cerrar Sesión (ID corregido)
    const btnLogout = document.getElementById("btnCerrarSesion");
    if(btnLogout) {
        btnLogout.addEventListener("click", function() {
            if(confirm("¿Desea cerrar su sesión?")) {
                Storage.remove(Storage.KEYS.SESION);
                window.location.href = "../../index.html";
            }
        });
    }

    renderHistorial();
});