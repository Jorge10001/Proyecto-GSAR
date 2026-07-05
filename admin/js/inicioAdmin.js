document.addEventListener("DOMContentLoaded", () => {
    const solicitudes = Storage.get(Storage.KEYS.SOLICITUDES) || [];
    const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
    
    // Inyectar contadores
    document.getElementById("totalUsuarios").textContent = usuarios.length;
    document.getElementById("totalPendientes").textContent = solicitudes.filter(s => s.estado === "Pendiente").length;
    document.getElementById("totalAprobadas").textContent = solicitudes.filter(s => s.estado === "Aprobada").length;
    document.getElementById("totalRechazadas").textContent = solicitudes.filter(s => s.estado === "Rechazada").length;
    
    // Renderizar gráfico
    const ctx = document.getElementById('chartSolicitudes').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
            datasets: [{
                data: [
                    solicitudes.filter(s => s.estado === "Pendiente").length,
                    solicitudes.filter(s => s.estado === "Aprobada").length,
                    solicitudes.filter(s => s.estado === "Rechazada").length
                ],
                backgroundColor: ['#f59e0b', '#10b981', '#ef4444']
            }]
        }
    });
});