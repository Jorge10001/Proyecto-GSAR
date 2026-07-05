# GSAR - Sistema de Gestión de Solicitudes de Ascenso y Recategorización

Proyecto web desarrollado con React para gestionar solicitudes institucionales entre empleados y el área de Talento Humano.

## Tecnologías usadas

- React 18 mediante CDN.
- Babel Standalone para ejecutar JSX sin instalar Node.js.
- JavaScript, HTML y CSS.
- JSON como formato semiestructurado de intercambio y exportación de datos.
- localStorage como almacenamiento del lado del cliente.
- Font Awesome para iconografía.

## Funcionalidades principales

- Inicio de sesión por rol: administrador o empleado.
- Portal de empleado con requisitos, nueva solicitud, historial y contacto.
- Validación de campos en formularios de login, solicitudes, mensajes y usuarios.
- Panel administrativo con métricas, gestión de usuarios, revisión de solicitudes y mensajes.
- Cambio de estado de solicitudes: Pendiente, En revisión, Aprobada y Rechazada.
- Visualización y descarga de los datos en formato JSON.

## Usuarios de prueba

- Administrador: `admin@uleam.edu.ec` / `Admin123`
- Empleado: `empleado@uleam.edu.ec` / `Empleado123`

## Ejecución local

Abra `index.html` en un navegador con conexión a internet para cargar React, Babel y Font Awesome desde CDN.

## Publicación

El proyecto puede publicarse en un hosting gratuito como GitHub Pages, Netlify o Vercel. Al ser una versión estática, basta con subir la carpeta completa del proyecto y definir `index.html` como archivo inicial.

## Relación con la guía y rúbrica

- Framework/librería: React.
- Librerías: ReactDOM, Babel Standalone y Font Awesome.
- JSON: datos serializados en localStorage y exportación `gsar-datos.json`.
- Almacenamiento local: usuarios, sesión, solicitudes y mensajes.
- Validaciones: correo, contraseña, campos obligatorios, enlaces y longitudes mínimas.
- Documentación: este archivo resume propósito, tecnologías, usuarios, ejecución y publicación.
