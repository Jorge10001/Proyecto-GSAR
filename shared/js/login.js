document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // 1. Validación básica de campos vacíos
    if (!email || !password) {
        alert("Por favor, rellene todos los campos.");
        return;
    }

    // 2. Validación de formato de correo (opcional pero recomendado)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, ingrese un formato de correo electrónico válido.");
        return;
    }

    // 3. Obtener los usuarios y buscar
    const usuarios = Storage.get(Storage.KEYS.USUARIOS) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
        Storage.save(Storage.KEYS.SESION, usuario);
        
        // Redirección
        if (usuario.rol === "admin") {
            window.location.href = "../../admin/html/index.html"; 
        } else {
            window.location.href = "../../empleado/html/index.html";
        }
    } else {
        // Validación de credenciales erróneas
        alert("Usuario o contraseña incorrectos.");
    }
});