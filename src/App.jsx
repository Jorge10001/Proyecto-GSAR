const { useEffect, useMemo, useState } = React;

const STORAGE_KEYS = {
  usuarios: "gsar_usuarios",
  sesion: "gsar_sesion",
  solicitudes: "gsar_solicitudes",
  mensajes: "gsar_mensajes",
};

const seedUsuarios = [
  {
    id: "USR-001",
    nombre: "Administrador Talento Humano",
    correo: "admin@uleam.edu.ec",
    password: "Admin123",
    rol: "admin",
    cargo: "Analista de Talento Humano",
    departamento: "Talento Humano",
    estado: "Activo",
  },
  {
    id: "USR-002",
    nombre: "Dixon Zambrano",
    correo: "empleado@uleam.edu.ec",
    password: "Empleado123",
    rol: "empleado",
    cargo: "Asistente Administrativo",
    departamento: "Facultad de Ciencias Informáticas",
    estado: "Activo",
  },
];

const tiposSolicitud = ["Ascenso", "Recategorización"];
const estadosSolicitud = ["Pendiente", "En revisión", "Aprobada", "Rechazada"];

function readJSON(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getInitialRoute() {
  return window.location.hash.replace("#", "") || "/login";
}

function routeTo(path) {
  window.location.hash = path;
}

function today() {
  return new Date().toLocaleDateString("es-EC", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateInstitutionalEmail(value) {
  return /^[^\s@]+@uleam\.edu\.ec$/i.test(value);
}

function FieldError({ message }) {
  return message ? <small className="field-error">{message}</small> : null;
}

function StatusBadge({ value }) {
  const normalized = value.toLowerCase().replace(" ", "-");
  return <span className={`status-badge ${normalized}`}>{value}</span>;
}

function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(getInitialRoute);
  const [usuarios, setUsuarios] = useState(() => readJSON(STORAGE_KEYS.usuarios, seedUsuarios));
  const [solicitudes, setSolicitudes] = useState(() => readJSON(STORAGE_KEYS.solicitudes, []));
  const [mensajes, setMensajes] = useState(() => readJSON(STORAGE_KEYS.mensajes, []));
  const [sesion, setSesion] = useState(() => readJSON(STORAGE_KEYS.sesion, null));

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.usuarios)) {
      writeJSON(STORAGE_KEYS.usuarios, seedUsuarios);
    }

    const onHashChange = () => setRoute(getInitialRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function persistUsuarios(next) {
    setUsuarios(next);
    writeJSON(STORAGE_KEYS.usuarios, next);
  }

  function persistSolicitudes(next) {
    setSolicitudes(next);
    writeJSON(STORAGE_KEYS.solicitudes, next);
  }

  function persistMensajes(next) {
    setMensajes(next);
    writeJSON(STORAGE_KEYS.mensajes, next);
  }

  function login(usuario) {
    setSesion(usuario);
    writeJSON(STORAGE_KEYS.sesion, usuario);
    routeTo(usuario.rol === "admin" ? "/admin/inicio" : "/empleado/inicio");
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.sesion);
    setSesion(null);
    routeTo("/login");
  }

  if (!sesion || route === "/login") {
    return <Login usuarios={usuarios} onLogin={login} />;
  }

  if (sesion.rol === "admin") {
    return (
      <AdminShell sesion={sesion} route={route} logout={logout}>
        <AdminRouter
          route={route}
          usuarios={usuarios}
          solicitudes={solicitudes}
          mensajes={mensajes}
          setUsuarios={persistUsuarios}
          setSolicitudes={persistSolicitudes}
          setMensajes={persistMensajes}
        />
      </AdminShell>
    );
  }

  return (
    <EmployeeShell sesion={sesion} route={route} logout={logout}>
      <EmployeeRouter
        route={route}
        sesion={sesion}
        solicitudes={solicitudes}
        mensajes={mensajes}
        setSolicitudes={persistSolicitudes}
        setMensajes={persistMensajes}
      />
    </EmployeeShell>
  );
}

function Login({ usuarios, onLogin }) {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!validateEmail(form.correo)) nextErrors.correo = "Ingrese un correo válido.";
    if (form.password.length < 6) nextErrors.password = "La contraseña debe tener mínimo 6 caracteres.";

    const usuario = usuarios.find(
      (item) =>
        item.correo.toLowerCase() === form.correo.toLowerCase().trim() &&
        item.password === form.password &&
        item.estado === "Activo"
    );

    if (!usuario && Object.keys(nextErrors).length === 0) {
      nextErrors.general = "Credenciales incorrectas o usuario inactivo.";
    }

    setErrors(nextErrors);
    if (usuario && Object.keys(nextErrors).length === 0) onLogin(usuario);
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="brand-block">
          <img src="assets/logos/uleam-logo-png_seeklogo-315386.png" alt="Logo ULEAM" />
          <div>
            <p>ULEAM</p>
            <h1>GSAR</h1>
          </div>
        </div>
        <form className="login-form" onSubmit={submit} noValidate>
          <h2>Sistema de acceso</h2>
          <p>Gestión de solicitudes de ascenso y recategorización.</p>
          {errors.general && <div className="form-alert">{errors.general}</div>}
          <label>
            Correo institucional
            <input
              type="email"
              value={form.correo}
              placeholder="admin@uleam.edu.ec"
              onChange={(event) => setForm({ ...form, correo: event.target.value })}
            />
            <FieldError message={errors.correo} />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={form.password}
              placeholder="Mínimo 6 caracteres"
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <FieldError message={errors.password} />
          </label>
          <button className="primary-button" type="submit">
            <i className="fa-solid fa-right-to-bracket"></i>
            Iniciar sesión
          </button>
        </form>
      </section>
    </main>
  );
}

function AdminShell({ sesion, route, logout, children }) {
  const links = [
    ["/admin/inicio", "fa-gauge", "Inicio"],
    ["/admin/solicitudes", "fa-clipboard-list", "Solicitudes"],
    ["/admin/usuarios", "fa-users", "Usuarios"],
    ["/admin/mensajes", "fa-envelope", "Mensajes"],
    ["/admin/json", "fa-code", "JSON"],
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-title">
          <strong>GSAR</strong>
          <span>Talento Humano</span>
        </div>
        <div className="profile-box">
          <p>{sesion.nombre}</p>
          <span>{sesion.cargo}</span>
        </div>
        <nav>
          {links.map(([path, icon, label]) => (
            <button key={path} className={route === path ? "active" : ""} onClick={() => routeTo(path)}>
              <i className={`fa-solid ${icon}`}></i>
              {label}
            </button>
          ))}
        </nav>
        <button className="logout-button" onClick={logout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          Cerrar sesión
        </button>
      </aside>
      <section className="workspace">{children}</section>
    </div>
  );
}

function EmployeeShell({ sesion, route, logout, children }) {
  const links = [
    ["/empleado/inicio", "fa-house", "Inicio"],
    ["/empleado/requisitos", "fa-file-lines", "Requisitos"],
    ["/empleado/nueva", "fa-plus-circle", "Nueva solicitud"],
    ["/empleado/mis-solicitudes", "fa-list-check", "Mis solicitudes"],
    ["/empleado/contacto", "fa-envelope", "Contacto"],
  ];

  return (
    <div className="employee-layout">
      <header className="topbar">
        <div className="topbar-brand">
          <strong>ULEAM</strong>
          <span>GSAR</span>
        </div>
        <nav>
          {links.map(([path, icon, label]) => (
            <button key={path} className={route === path ? "active" : ""} onClick={() => routeTo(path)}>
              <i className={`fa-solid ${icon}`}></i>
              {label}
            </button>
          ))}
        </nav>
        <button className="logout-button compact" onClick={logout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          Salir
        </button>
      </header>
      <main className="employee-main">
        <div className="session-strip">
          <span>{sesion.nombre}</span>
          <strong>{sesion.departamento}</strong>
        </div>
        {children}
      </main>
    </div>
  );
}

function AdminRouter(props) {
  if (props.route === "/admin/solicitudes") return <AdminSolicitudes {...props} />;
  if (props.route.startsWith("/admin/revision/")) return <RevisionSolicitud {...props} />;
  if (props.route === "/admin/usuarios") return <Usuarios {...props} />;
  if (props.route === "/admin/mensajes") return <AdminMensajes {...props} />;
  if (props.route === "/admin/json") return <JsonPanel {...props} />;
  return <AdminInicio {...props} />;
}

function EmployeeRouter(props) {
  if (props.route === "/empleado/requisitos") return <Requisitos />;
  if (props.route === "/empleado/nueva") return <NuevaSolicitud {...props} />;
  if (props.route === "/empleado/mis-solicitudes") return <MisSolicitudes {...props} />;
  if (props.route === "/empleado/contacto") return <Contacto {...props} />;
  return <EmpleadoInicio {...props} />;
}

function AdminInicio({ usuarios, solicitudes, mensajes }) {
  const pendientes = solicitudes.filter((item) => item.estado === "Pendiente").length;
  const aprobadas = solicitudes.filter((item) => item.estado === "Aprobada").length;

  return (
    <>
      <PageHeader title="Panel administrativo" text="Control del proceso de ascensos y recategorizaciones." />
      <section className="metric-grid">
        <Metric icon="fa-users" label="Usuarios" value={usuarios.length} />
        <Metric icon="fa-clock" label="Pendientes" value={pendientes} />
        <Metric icon="fa-circle-check" label="Aprobadas" value={aprobadas} />
        <Metric icon="fa-envelope" label="Mensajes" value={mensajes.length} />
      </section>
      <section className="content-band">
        <h2>Flujo del sistema</h2>
        <div className="process-grid">
          <span>1. Registro de usuarios</span>
          <span>2. Envío de solicitud</span>
          <span>3. Revisión documental</span>
          <span>4. Resolución final</span>
        </div>
      </section>
    </>
  );
}

function EmpleadoInicio({ sesion, solicitudes }) {
  const misSolicitudes = solicitudes.filter((item) => item.correo === sesion.correo);
  const ultima = misSolicitudes[misSolicitudes.length - 1];

  return (
    <>
      <PageHeader title="Portal del empleado" text="Presente y consulte sus solicitudes institucionales." />
      <section className="metric-grid">
        <Metric icon="fa-file-signature" label="Mis solicitudes" value={misSolicitudes.length} />
        <Metric icon="fa-user-tie" label="Cargo actual" value={sesion.cargo} />
        <Metric icon="fa-building" label="Departamento" value={sesion.departamento} />
      </section>
      <section className="content-band">
        <h2>Último movimiento</h2>
        {ultima ? (
          <div className="detail-row">
            <span>{ultima.tipo}</span>
            <strong>{ultima.cargoSolicitado}</strong>
            <StatusBadge value={ultima.estado} />
          </div>
        ) : (
          <EmptyState title="Aún no hay solicitudes" text="Cree una solicitud para iniciar el proceso." />
        )}
      </section>
    </>
  );
}

function PageHeader({ title, text }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </header>
  );
}

function Metric({ icon, label, value }) {
  return (
    <article className="metric">
      <i className={`fa-solid ${icon}`}></i>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function NuevaSolicitud({ sesion, solicitudes, setSolicitudes }) {
  const [form, setForm] = useState({
    tipo: "Ascenso",
    cargoSolicitado: "",
    justificacion: "",
    evidencia: "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!form.cargoSolicitado.trim() || form.cargoSolicitado.trim().length < 5) {
      nextErrors.cargoSolicitado = "Ingrese el cargo o categoría solicitada.";
    }
    if (form.justificacion.trim().length < 30) {
      nextErrors.justificacion = "La justificación debe tener mínimo 30 caracteres.";
    }
    if (!/^https?:\/\/.+\..+/.test(form.evidencia.trim())) {
      nextErrors.evidencia = "Ingrese un enlace válido de documentos.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const nuevaSolicitud = {
      id: uid("SOL"),
      solicitante: sesion.nombre,
      correo: sesion.correo,
      cargoActual: sesion.cargo,
      departamento: sesion.departamento,
      tipo: form.tipo,
      cargoSolicitado: form.cargoSolicitado.trim(),
      justificacion: form.justificacion.trim(),
      evidencia: form.evidencia.trim(),
      fecha: today(),
      estado: "Pendiente",
    };

    setSolicitudes([...solicitudes, nuevaSolicitud]);
    setForm({ tipo: "Ascenso", cargoSolicitado: "", justificacion: "", evidencia: "" });
    setSaved(true);
  }

  return (
    <>
      <PageHeader title="Nueva solicitud" text="Complete la información y adjunte el enlace de evidencias." />
      <section className="form-surface">
        {saved && <div className="success-alert">Solicitud registrada correctamente en localStorage.</div>}
        <div className="applicant-grid">
          <div>
            <span>Solicitante</span>
            <strong>{sesion.nombre}</strong>
          </div>
          <div>
            <span>Correo</span>
            <strong>{sesion.correo}</strong>
          </div>
          <div>
            <span>Cargo actual</span>
            <strong>{sesion.cargo}</strong>
          </div>
        </div>
        <form className="data-form" onSubmit={submit} noValidate>
          <label>
            Tipo de solicitud
            <select value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value })}>
              {tiposSolicitud.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </label>
          <label>
            Cargo o categoría solicitada
            <input
              value={form.cargoSolicitado}
              placeholder="Ej: Analista de Sistemas SP5"
              onChange={(event) => setForm({ ...form, cargoSolicitado: event.target.value })}
            />
            <FieldError message={errors.cargoSolicitado} />
          </label>
          <label>
            Justificación
            <textarea
              rows="5"
              value={form.justificacion}
              placeholder="Describa méritos, experiencia, formación y logros relevantes."
              onChange={(event) => setForm({ ...form, justificacion: event.target.value })}
            />
            <FieldError message={errors.justificacion} />
          </label>
          <label>
            Enlace de evidencias
            <input
              value={form.evidencia}
              placeholder="https://drive.google.com/..."
              onChange={(event) => setForm({ ...form, evidencia: event.target.value })}
            />
            <FieldError message={errors.evidencia} />
          </label>
          <button className="primary-button" type="submit">
            <i className="fa-solid fa-paper-plane"></i>
            Enviar solicitud
          </button>
        </form>
      </section>
    </>
  );
}

function MisSolicitudes({ sesion, solicitudes }) {
  const misSolicitudes = solicitudes.filter((item) => item.correo === sesion.correo).reverse();

  return (
    <>
      <PageHeader title="Mis solicitudes" text="Seguimiento de procesos enviados a Talento Humano." />
      <section className="list-stack">
        {misSolicitudes.length === 0 ? (
          <EmptyState title="Sin registros" text="No tiene solicitudes guardadas todavía." />
        ) : (
          misSolicitudes.map((item) => (
            <article className="request-item" key={item.id}>
              <div>
                <span>{item.id} · {item.fecha}</span>
                <h3>{item.tipo}: {item.cargoSolicitado}</h3>
                <p>{item.justificacion}</p>
              </div>
              <StatusBadge value={item.estado} />
            </article>
          ))
        )}
      </section>
    </>
  );
}

function Requisitos() {
  return (
    <>
      <PageHeader title="Requisitos" text="Documentos sugeridos para respaldar la solicitud." />
      <section className="content-band">
        <div className="requirements-grid">
          <Requirement icon="fa-id-card" title="Datos personales" text="Información institucional actualizada y cargo vigente." />
          <Requirement icon="fa-graduation-cap" title="Formación" text="Títulos, certificados y cursos relacionados con el cargo." />
          <Requirement icon="fa-briefcase" title="Experiencia" text="Funciones, responsabilidades y evidencias de desempeño." />
          <Requirement icon="fa-link" title="Repositorio" text="Enlace público o compartido con permisos de lectura." />
        </div>
      </section>
    </>
  );
}

function Requirement({ icon, title, text }) {
  return (
    <article className="requirement">
      <i className={`fa-solid ${icon}`}></i>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Contacto({ sesion, mensajes, setMensajes }) {
  const [form, setForm] = useState({ asunto: "", texto: "" });
  const [errors, setErrors] = useState({});
  const misMensajes = mensajes.filter((item) => item.correo === sesion.correo).reverse();

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (form.asunto.trim().length < 5) nextErrors.asunto = "El asunto debe tener mínimo 5 caracteres.";
    if (form.texto.trim().length < 15) nextErrors.texto = "El mensaje debe tener mínimo 15 caracteres.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setMensajes([
      ...mensajes,
      {
        id: uid("MSG"),
        remitente: sesion.nombre,
        correo: sesion.correo,
        asunto: form.asunto.trim(),
        texto: form.texto.trim(),
        fecha: today(),
        estado: "Pendiente",
      },
    ]);
    setForm({ asunto: "", texto: "" });
  }

  return (
    <>
      <PageHeader title="Contacto" text="Envíe consultas a Talento Humano y revise su historial." />
      <section className="two-column">
        <form className="form-surface data-form" onSubmit={submit} noValidate>
          <label>
            Asunto
            <input value={form.asunto} onChange={(event) => setForm({ ...form, asunto: event.target.value })} />
            <FieldError message={errors.asunto} />
          </label>
          <label>
            Mensaje
            <textarea rows="6" value={form.texto} onChange={(event) => setForm({ ...form, texto: event.target.value })} />
            <FieldError message={errors.texto} />
          </label>
          <button className="primary-button" type="submit">
            <i className="fa-solid fa-envelope"></i>
            Enviar mensaje
          </button>
        </form>
        <section className="content-band">
          <h2>Historial</h2>
          {misMensajes.length === 0 ? (
            <EmptyState title="Sin mensajes" text="Sus consultas aparecerán en esta sección." />
          ) : (
            <div className="message-list">
              {misMensajes.map((item) => (
                <article key={item.id}>
                  <strong>{item.asunto}</strong>
                  <span>{item.fecha}</span>
                  <p>{item.texto}</p>
                  <StatusBadge value={item.estado} />
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </>
  );
}

function AdminSolicitudes({ solicitudes }) {
  return (
    <>
      <PageHeader title="Gestión de solicitudes" text="Revise, filtre y procese solicitudes registradas." />
      <section className="table-shell">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Empleado</th>
              <th>Proceso</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.length === 0 ? (
              <tr><td colSpan="6">No hay solicitudes registradas.</td></tr>
            ) : (
              solicitudes.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.solicitante}</td>
                  <td>{item.tipo}</td>
                  <td>{item.fecha}</td>
                  <td><StatusBadge value={item.estado} /></td>
                  <td>
                    <button className="icon-button" title="Revisar solicitud" onClick={() => routeTo(`/admin/revision/${item.id}`)}>
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

function RevisionSolicitud({ route, solicitudes, setSolicitudes }) {
  const id = route.split("/").pop();
  const solicitud = solicitudes.find((item) => item.id === id);
  const [observacion, setObservacion] = useState("");

  if (!solicitud) {
    return (
      <>
        <PageHeader title="Solicitud no encontrada" text="El registro ya no existe en el almacenamiento local." />
        <button className="secondary-button" onClick={() => routeTo("/admin/solicitudes")}>Volver</button>
      </>
    );
  }

  function updateEstado(estado) {
    const next = solicitudes.map((item) =>
      item.id === solicitud.id ? { ...item, estado, observacion, fechaRevision: today() } : item
    );
    setSolicitudes(next);
    routeTo("/admin/solicitudes");
  }

  return (
    <>
      <PageHeader title="Revisión de solicitud" text="Validación administrativa de evidencia y justificación." />
      <section className="review-panel">
        <button className="secondary-button" onClick={() => routeTo("/admin/solicitudes")}>
          <i className="fa-solid fa-arrow-left"></i>
          Volver
        </button>
        <div className="review-header">
          <div>
            <h2>{solicitud.solicitante}</h2>
            <p>{solicitud.correo}</p>
          </div>
          <StatusBadge value={solicitud.estado} />
        </div>
        <div className="review-grid">
          <span><strong>Cargo actual</strong>{solicitud.cargoActual}</span>
          <span><strong>Cargo solicitado</strong>{solicitud.cargoSolicitado}</span>
          <span><strong>Tipo</strong>{solicitud.tipo}</span>
          <span><strong>Fecha</strong>{solicitud.fecha}</span>
        </div>
        <div className="evidence-box">
          <strong>Justificación</strong>
          <p>{solicitud.justificacion}</p>
          <a href={solicitud.evidencia} target="_blank" rel="noreferrer">Abrir evidencias</a>
        </div>
        <label className="observation-field">
          Observación de revisión
          <textarea rows="4" value={observacion} onChange={(event) => setObservacion(event.target.value)} />
        </label>
        <div className="action-row">
          <button className="danger-button" onClick={() => updateEstado("Rechazada")}>Rechazar</button>
          <button className="warning-button" onClick={() => updateEstado("En revisión")}>Dejar en revisión</button>
          <button className="success-button" onClick={() => updateEstado("Aprobada")}>Aprobar</button>
        </div>
      </section>
    </>
  );
}

function Usuarios({ usuarios, setUsuarios }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    cargo: "",
    departamento: "",
    estado: "Activo",
    rol: "empleado",
    password: "Password123",
  });
  const [errors, setErrors] = useState({});

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (form.nombre.trim().length < 6) nextErrors.nombre = "Ingrese nombre y apellido.";
    if (!validateInstitutionalEmail(form.correo)) nextErrors.correo = "Use un correo @uleam.edu.ec.";
    if (usuarios.some((item) => item.correo.toLowerCase() === form.correo.toLowerCase())) {
      nextErrors.correo = "Este correo ya está registrado.";
    }
    if (form.cargo.trim().length < 3) nextErrors.cargo = "Ingrese un cargo válido.";
    if (form.departamento.trim().length < 3) nextErrors.departamento = "Ingrese el departamento.";
    if (form.password.length < 6) nextErrors.password = "La contraseña debe tener mínimo 6 caracteres.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setUsuarios([...usuarios, { ...form, id: uid("USR") }]);
    setForm({ nombre: "", correo: "", cargo: "", departamento: "", estado: "Activo", rol: "empleado", password: "Password123" });
  }

  return (
    <>
      <PageHeader title="Gestión de usuarios" text="Registro de empleados y administradores del sistema." />
      <section className="form-surface">
        <form className="data-form grid-form" onSubmit={submit} noValidate>
          <FormInput label="Nombre completo" value={form.nombre} error={errors.nombre} onChange={(value) => setForm({ ...form, nombre: value })} />
          <FormInput label="Correo institucional" value={form.correo} error={errors.correo} onChange={(value) => setForm({ ...form, correo: value })} />
          <FormInput label="Cargo" value={form.cargo} error={errors.cargo} onChange={(value) => setForm({ ...form, cargo: value })} />
          <FormInput label="Departamento" value={form.departamento} error={errors.departamento} onChange={(value) => setForm({ ...form, departamento: value })} />
          <label>
            Estado
            <select value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value })}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </label>
          <label>
            Rol
            <select value={form.rol} onChange={(event) => setForm({ ...form, rol: event.target.value })}>
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
          <FormInput label="Contraseña temporal" value={form.password} error={errors.password} onChange={(value) => setForm({ ...form, password: value })} />
          <button className="primary-button" type="submit">
            <i className="fa-solid fa-user-plus"></i>
            Crear usuario
          </button>
        </form>
      </section>
      <section className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Cargo</th>
              <th>Departamento</th>
              <th>Estado</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.correo}</td>
                <td>{item.cargo}</td>
                <td>{item.departamento}</td>
                <td>{item.estado}</td>
                <td><StatusBadge value={item.rol === "admin" ? "Administrador" : "Empleado"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function FormInput({ label, value, error, onChange }) {
  return (
    <label>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
      <FieldError message={error} />
    </label>
  );
}

function AdminMensajes({ mensajes, setMensajes }) {
  function responder(id) {
    setMensajes(mensajes.map((item) => (item.id === id ? { ...item, estado: "Respondido" } : item)));
  }

  return (
    <>
      <PageHeader title="Mensajes" text="Consultas recibidas desde el portal del empleado." />
      <section className="list-stack">
        {mensajes.length === 0 ? (
          <EmptyState title="Sin mensajes" text="No hay consultas registradas." />
        ) : (
          mensajes.map((item) => (
            <article className="message-row" key={item.id}>
              <div>
                <span>{item.fecha} · {item.remitente}</span>
                <h3>{item.asunto}</h3>
                <p>{item.texto}</p>
              </div>
              <div>
                <StatusBadge value={item.estado} />
                <button className="secondary-button" onClick={() => responder(item.id)}>Marcar respondido</button>
              </div>
            </article>
          ))
        )}
      </section>
    </>
  );
}

function JsonPanel({ usuarios, solicitudes, mensajes }) {
  const payload = useMemo(() => JSON.stringify({ usuarios, solicitudes, mensajes }, null, 2), [usuarios, solicitudes, mensajes]);

  function downloadJSON() {
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gsar-datos.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader title="Datos JSON" text="Representación semiestructurada de la información guardada en localStorage." />
      <section className="json-panel">
        <div className="json-actions">
          <button className="primary-button" onClick={downloadJSON}>
            <i className="fa-solid fa-download"></i>
            Descargar JSON
          </button>
        </div>
        <pre>{payload}</pre>
      </section>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
