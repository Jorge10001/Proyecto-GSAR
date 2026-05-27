(function() {
    const sesion = JSON.parse(localStorage.getItem(Storage.KEYS.SESION));
    if (!sesion) {
        window.location.href = "../../index.html";
    }
})();