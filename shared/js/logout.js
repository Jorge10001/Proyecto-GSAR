document.addEventListener("DOMContentLoaded", () => {
    const btnSalir = document.getElementById("btnCerrarSesion");

    if (btnSalir) {
        btnSalir.onclick = function() {
            // Usamos confirm que es un método del objeto window (Semana 5)
            if (confirm("¿Desea finalizar su sesión en el sistema?")) {
                
                // Eliminamos solo las llaves de sesión
                localStorage.removeItem("usuarioActivo");
                localStorage.removeItem("rolActivo");

                // Redirección a la raíz del proyecto
                window.location.href = "../../index.html";
            }
        };
    }
});