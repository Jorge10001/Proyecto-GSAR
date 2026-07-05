document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formUsuario");
    renderizarUsuarios();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Crear objeto usuario con los nuevos campos
        const nuevoUser = {
            nombre: document.getElementById("nombreUsuario").value,
            email: document.getElementById("emailUsuario").value,
            cargo: document.getElementById("cargoUsuario").value,
            departamento: document.getElementById("deptoUsuario").value,
            estado: document.getElementById("estadoUsuario").value,
            rol: document.getElementById("rolUsuario").value,
            password: "Password123" // Contraseña temporal
        };

        // Obtener lista, agregar y guardar vía Storage
        const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
        usuarios.push(nuevoUser);
        Storage.save(Storage.KEYS.USUARIOS, usuarios);
        
        alert("Usuario creado correctamente con la clave temporal: Password123");
        form.reset();
        renderizarUsuarios();
    });
});

function renderizarUsuarios() {
    const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
    const tbody = document.getElementById("tabla-usuarios");
    
    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td>${u.cargo}</td>
            <td>${u.departamento}</td>
            <td>${u.estado}</td>
            <td><span class="status-badge ${u.rol}">${u.rol}</span></td>
        </tr>
    `).join('');
}