const Storage = {
    KEYS: {
        USUARIOS: "usuariosULEAM",
        SESION: "usuarioSesion",
        SOLICITUDES: "solicitudesULEAM",
        MENSAJES: "mensajesULEAM"
    },
    get: (key) => JSON.parse(localStorage.getItem(key)) || [],
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    remove: (key) => localStorage.removeItem(key)
};