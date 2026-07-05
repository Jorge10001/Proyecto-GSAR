document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("lista-mensajes");
    
    // Obtención segura de mensajes mediante el objeto Storage centralizado
    const mensajes = Storage.get(Storage.KEYS.MENSAJES) || [];

    if (mensajes.length === 0) {
        contenedor.innerHTML = "<p>No hay mensajes nuevos en la bandeja.</p>";
        return;
    }

    contenedor.innerHTML = mensajes.map(msg => `
        <div class="card" style="margin-bottom: 15px; padding: 20px;">
            <h4 style="color: #0d3b66; margin-bottom: 5px;">Asunto: ${msg.asunto}</h4>
            <p style="font-size: 13px; color: #4a5568; margin-bottom: 10px;">De: ${msg.remitente}</p>
            <p style="margin: 10px 0;">${msg.texto}</p>
            <button class="btn-action" onclick="alert('Respuesta enviada a ${msg.remitente}')">
                <i class="fa-solid fa-reply"></i> Responder
            </button>
        </div>
    `).join('');
});