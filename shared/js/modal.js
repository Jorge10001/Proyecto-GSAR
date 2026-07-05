const Modal = {
    abrir: function(titulo, contenido) {
        const div = document.createElement("div");
        div.className = "modal-overlay";
        div.innerHTML = `
            <div class="modal-card">
                <h3>${titulo}</h3>
                <div class="modal-body">${contenido}</div>
                <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
            </div>
        `;
        document.body.appendChild(div);
    }
};