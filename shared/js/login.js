document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // 1. Obtener los usuarios desde el almacenamiento
    const usuarios = Storage.get(Storage.KEYS.USUARIOS);
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        // 2. Guardar la sesión del usuario logueado
        Storage.save(Storage.KEYS.SESION, usuario);

        // 3. Redirección lógica basada en el rol
        if (usuario.rol === "admin") {
            window.location.href = "../../admin/html/index.html"; 
        } else {
            window.location.href = "../../empleado/html/index.html";
        }
    } else {
        alert("Credenciales incorrectas.");
    }
});