

// Para empleadoGuard.js
(function() {
    const sesion = JSON.parse(localStorage.getItem(Storage.KEYS.SESION));
    if (!sesion || sesion.rol !== "empleado") {
        alert("Acceso denegado: Área exclusiva para empleados.");
        window.location.href = "../../index.html";
    }
})();