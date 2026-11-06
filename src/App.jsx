
import { useEffect, useState } from "react";
import "./App.css";

const API = "https://apiuisilvictor.somee.com";

const usuarioVacio = {
  idUsuario: 0,
  correo: "",
  contrasena: "",
  idRol: 0,
  nombre: "",
  apellido1: "",
  apellido2: "",
  fechaNac: "",
  genero: "",
  telefono: "",
  direccion: ""
};

function App() {
  const [logueado, setLogueado] = useState(false);
  const [correoLogin, setCorreoLogin] = useState("");
  const [contrasenaLogin, setContrasenaLogin] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(usuarioVacio);
  const [modo, setModo] = useState("");
  const [busquedaId, setBusquedaId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function peticion(ruta, metodo = "GET", datos = null) {
    const opciones = {
      method: metodo,
      headers: { "Content-Type": "application/json" }
    };

    if (datos !== null) {
      opciones.body = JSON.stringify(datos);
    }

    const respuesta = await fetch(`${API}${ruta}`, opciones);
    const resultado = await respuesta.json();

    if (!respuesta.ok || resultado.ok === false) {
      throw new Error(resultado.mensaje || "Ocurrió un error en la operación.");
    }

    return resultado;
  }

  async function iniciarSesion(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const resultado = await peticion("/api/InicioSesion", "POST", {
        Correo: correoLogin,
        Contrasena: contrasenaLogin
      });

      if (resultado.ok) {
        setLogueado(true);
        setMensaje("Bienvenido. Inicio de sesión exitoso.");
        await cargarUsuarios();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function cargarUsuarios() {
    setError("");

    try {
      const resultado = await peticion("/api/Usuarios");
      setUsuarios(resultado.valorRetorno || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function buscarUsuario(e) {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!busquedaId || Number(busquedaId) <= 0) {
      setError("Escribe un ID válido.");
      return;
    }

    try {
      const resultado = await peticion(
        "/api/Usuarios/ObtenerUsuarioPorId",
        "POST",
        { IdUsuario: Number(busquedaId) }
      );

      const encontrado = resultado.valorRetorno;

      if (encontrado) {
        setUsuarios(Array.isArray(encontrado) ? encontrado : [encontrado]);
        setMensaje("Usuario encontrado.");
      } else {
        setUsuarios([]);
        setError("No se encontró el usuario.");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function abrirNuevo() {
    setUsuario({ ...usuarioVacio });
    setModo("crear");
    setMensaje("");
    setError("");
  }

  function abrirEditar(u) {
    setUsuario({
      ...u,
      fechaNac: u.fechaNac ? u.fechaNac.substring(0, 10) : "",
      contrasena: ""
    });
    setModo("editar");
    setMensaje("");
    setError("");
  }

  function cambiarCampo(e) {
    const { name, value } = e.target;
    setUsuario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function guardarUsuario(e) {
    e.preventDefault();
    setError("");
    setMensaje("");

    const datos = {
      IdUsuario: Number(usuario.idUsuario) || 0,
      Correo: usuario.correo.trim(),
      Contrasena: usuario.contrasena || null,
      FechaCreacion: new Date().toISOString(),
      IdRol: Number(usuario.idRol),
      Nombre: usuario.nombre.trim(),
      Apellido1: usuario.apellido1.trim(),
      Apellido2: usuario.apellido2.trim(),
      FechaNac: usuario.fechaNac || null,
      Genero: usuario.genero,
      Telefono: usuario.telefono.trim(),
      Direccion: usuario.direccion.trim()
    };

    if (
      !datos.Correo ||
      !datos.Nombre ||
      !datos.Apellido1 ||
      !datos.FechaNac ||
      !datos.Genero ||
      !datos.Telefono ||
      !datos.Direccion
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (modo === "crear" && !datos.Contrasena) {
      setError("La contraseña es obligatoria para crear un usuario.");
      return;
    }

    try {
      const resultado = await peticion(
        "/api/Usuarios",
        modo === "crear" ? "POST" : "PUT",
        datos
      );

      setMensaje(resultado.mensaje || "Operación realizada correctamente.");
      setModo("");
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

  async function eliminarUsuario(id) {
    if (!window.confirm(`¿Seguro que deseas eliminar al usuario ${id}?`)) {
      return;
    }

    setError("");
    setMensaje("");

    try {
      const resultado = await peticion("/api/Usuarios", "DELETE", {
        IdUsuario: Number(id)
      });

      setMensaje(resultado.mensaje || "Usuario eliminado correctamente.");
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

  function cerrarSesion() {
    setLogueado(false);
    setCorreoLogin("");
    setContrasenaLogin("");
    setUsuarios([]);
    setMensaje("");
    setError("");
  }

  useEffect(() => {
    if (logueado) cargarUsuarios();
  }, [logueado]);

  if (!logueado) {
    return (
      <main className="login-page">
        <form className="login-card" onSubmit={iniciarSesion}>
          <h1>UISIL</h1>
          <p className="subtitulo">Administración de usuarios</p>

          <label>Correo</label>
          <input
            type="text"
            value={correoLogin}
            onChange={(e) => setCorreoLogin(e.target.value)}
            required
            placeholder="Ingresa tu correo"
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={contrasenaLogin}
            onChange={(e) => setContrasenaLogin(e.target.value)}
            required
            placeholder="Ingresa tu contraseña"
          />

          {error && <p className="mensaje error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="encabezado">
        <div>
          <h1>Panel de administración</h1>
          <p>Gestión de usuarios UISIL</p>
        </div>
        <button className="secundario" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      {mensaje && <p className="mensaje exito">{mensaje}</p>}
      {error && <p className="mensaje error">{error}</p>}

      <section className="panel">
        <div className="acciones">
          <h2>Usuarios registrados</h2>
          <button onClick={abrirNuevo}>+ Agregar usuario</button>
        </div>

        <form className="busqueda" onSubmit={buscarUsuario}>
          <input
            type="number"
            min="1"
            placeholder="Buscar por ID"
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
          />
          <button type="submit">Buscar</button>
          <button type="button" className="secundario" onClick={cargarUsuarios}>
            Ver todos
          </button>
        </form>

        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre completo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.idUsuario}>
                  <td>{u.idUsuario}</td>
                  <td>{`${u.nombre || ""} ${u.apellido1 || ""} ${u.apellido2 || ""}`}</td>
                  <td>{u.correo}</td>
                  <td>{u.nombreRol || "Sin rol"}</td>
                  <td>{u.telefono}</td>
                  <td className="acciones-tabla">
                    <button className="editar" onClick={() => abrirEditar(u)}>
                      Editar
                    </button>
                    <button
                      className="eliminar"
                      onClick={() => eliminarUsuario(u.idUsuario)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="6" className="vacio">
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modo && (
        <div className="modal-fondo">
          <form className="modal" onSubmit={guardarUsuario}>
            <h2>{modo === "crear" ? "Agregar usuario" : "Actualizar usuario"}</h2>

            {modo === "editar" && (
              <div className="campo">
                <label>ID de usuario</label>
                <input value={usuario.idUsuario} disabled />
              </div>
            )}

            <div className="form-grid">
              <div className="campo">
                <label>Correo *</label>
                <input name="correo" value={usuario.correo} onChange={cambiarCampo} required />
              </div>

              <div className="campo">
                <label>Contraseña {modo === "crear" ? "*" : "(opcional)"}</label>
                <input
                  name="contrasena"
                  type="password"
                  value={usuario.contrasena}
                  onChange={cambiarCampo}
                  required={modo === "crear"}
                />
              </div>

              <div className="campo">
                <label>Nombre *</label>
                <input name="nombre" value={usuario.nombre || ""} onChange={cambiarCampo} required />
              </div>

              <div className="campo">
                <label>Primer apellido *</label>
                <input name="apellido1" value={usuario.apellido1 || ""} onChange={cambiarCampo} required />
              </div>

              <div className="campo">
                <label>Segundo apellido</label>
                <input name="apellido2" value={usuario.apellido2 || ""} onChange={cambiarCampo} />
              </div>

              <div className="campo">
                <label>Fecha de nacimiento *</label>
                <input type="date" name="fechaNac" value={usuario.fechaNac || ""} onChange={cambiarCampo} required />
              </div>

              <div className="campo">
                <label>Género *</label>
                <select name="genero" value={usuario.genero || ""} onChange={cambiarCampo} required>
                  <option value="">Selecciona</option>
                  <option>Masculino</option>
                  <option>Femenino</option>
                  <option>No binario</option>
                  <option>Prefiero no indicarlo</option>
                </select>
              </div>

              <div className="campo">
                <label>Teléfono *</label>
                <input name="telefono" value={usuario.telefono || ""} onChange={cambiarCampo} required />
              </div>

              <div className="campo">
                <label>Dirección *</label>
                <input name="direccion" value={usuario.direccion || ""} onChange={cambiarCampo} required />
              </div>

              <div className="campo">
                <label>ID del rol</label>
                <input type="number" name="idRol" value={usuario.idRol ?? 0} onChange={cambiarCampo} />
              </div>
            </div>

            <p className="nota">* Campos obligatorios.</p>

            <div className="botones-modal">
              <button type="submit">Guardar</button>
              <button type="button" className="secundario" onClick={() => setModo("")}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default App;
