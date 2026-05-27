// Para adminGuard.js
(function() {
    const sesion = JSON.parse(localStorage.getItem(Storage.KEYS.SESION));
    if (!sesion || sesion.rol !== "admin") {
        alert("Acceso denegado: Se requieren privilegios de Administrador.");
        window.location.href = "../../index.html";
    }
})();