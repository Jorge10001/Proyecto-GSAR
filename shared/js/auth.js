const Auth = {
    iniciarSesion: function(usuario) {
        Storage.save(Storage.KEYS.SESION, usuario);
        window.location.href = usuario.rol === "admin" 
            ? "../../admin/html/index.html" 
            : "../../empleado/html/index.html";
    },
    
    cerrarSesion: function() {
        Storage.remove(Storage.KEYS.SESION);
        window.location.href = "../../index.html";
    }
};