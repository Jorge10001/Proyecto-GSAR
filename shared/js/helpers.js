const Helpers = {
    formatearFecha: (date) => new Date(date).toLocaleDateString('es-EC'),
    generarID: () => "ID-" + Date.now(),
    notificar: (msg) => alert(msg)
};