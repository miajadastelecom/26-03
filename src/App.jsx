import { useState, useMemo, useEffect } from "react"; 
import { initializeApp } from "firebase/app"; 
import { getFirestore, collection, onSnapshot, updateDoc, doc, setDoc } from "firebase/firestore";

// Configuración Firebase [6]
const firebaseConfig = { 
  apiKey: "AIzaSyAdfYXNZBGHHCbgCIsobZoIdFPLVtAIcB0", 
  authDomain: "ticket2603.firebaseapp.com", 
  projectId: "ticket2603", 
  storageBucket: "ticket2603.firebasestorage.app", 
  messagingSenderId: "610654398369", 
  appId: "1:610654398369:web:006288839a1a94e6fd0de0" 
}; 
const firebaseApp = initializeApp(firebaseConfig); 
const db = getFirestore(firebaseApp);

// ─── DATOS ──────────────────────────────────────────────────────────────────── [7-9]
const EMPRESAS = [ 
  { id: 0, nombre: "Dirección General", color: "#94A3B8", inicial: "DG" }, 
  { id: 1, nombre: "Energía de Miajadas", color: "#E53E3E", inicial: "EM" }, 
  { id: 2, nombre: "Miajadas Telecom", color: "#D4A017", inicial: "MT" }, 
  { id: 3, nombre: "Laura Otero Instalaciones", color: "#2B6CB0", inicial: "LI" }, 
  { id: 4, nombre: "Zaqaru", color: "#805AD5", inicial: "ZQ" }, 
  { id: 5, nombre: "Laura Otero", color: "#276749", inicial: "LO" }, 
  { id: 6, nombre: "Comercial", color: "#E53E3E", inicial: "CO" }, 
];

const USUARIOS = [ 
  { id: 0, nombre: "Miguel Manzano", empresaId: 0, rol: "director" }, 
  { id: 1, nombre: "Ángel Fernández", empresaId: 1, rol: "encargado" }, 
  { id: 2, nombre: "Jose Manuel Fuentes", empresaId: 1, rol: "trabajador" }, 
  { id: 3, nombre: "María Manzano", empresaId: 1, rol: "trabajador" }, 
  { id: 4, nombre: "Valentín Pérez", empresaId: 2, rol: "encargado" }, 
  { id: 5, nombre: "Esther Albalá", empresaId: 2, rol: "trabajador" }, 
  { id: 6, nombre: "Aitor Garrido", empresaId: 2, rol: "trabajador" }, 
  { id: 7, nombre: "Carlos Cintero", empresaId: 2, rol: "trabajador" }, 
  { id: 8, nombre: "Javier Acedo", empresaId: 2, rol: "trabajador" }, 
  { id: 9, nombre: "Sara Márquez", empresaId: 2, rol: "trabajador" }, 
  { id: 10, nombre: "Miguel Calvo", empresaId: 3, rol: "encargado" }, 
  { id: 11, nombre: "Juan Antonio Fuentes", empresaId: 3, rol: "trabajador" }, 
  { id: 12, nombre: "Jaime Naranjo", empresaId: 3, rol: "trabajador" }, 
  { id: 13, nombre: "Jose Luis Saavedra", empresaId: 3, rol: "trabajador" }, 
  { id: 14, nombre: "Carlos P. Pajuelo", empresaId: 3, rol: "trabajador" }, 
  { id: 15, nombre: "Oscar García", empresaId: 3, rol: "trabajador" }, 
  { id: 16, nombre: "Francisco Javier Llanos", empresaId: 3, rol: "trabajador" }, 
  { id: 17, nombre: "Borja Llanos", empresaId: 3, rol: "trabajador" }, 
  { id: 18, nombre: "Luis Collado", empresaId: 3, rol: "trabajador" }, 
  { id: 19, nombre: "Félix Loro", empresaId: 3, rol: "trabajador" }, 
  { id: 20, nombre: "Ekaitz Pereira", empresaId: 3, rol: "trabajador" }, 
  { id: 21, nombre: "Jairo Miguel", empresaId: 3, rol: "trabajador" }, 
  { id: 22, nombre: "Andrés Medina", empresaId: 3, rol: "trabajador" }, 
  { id: 23, nombre: "Francisco Babiano", empresaId: 3, rol: "trabajador" }, 
  { id: 24, nombre: "Guillermo Méndez", empresaId: 3, rol: "trabajador" }, 
  { id: 25, nombre: "Antonio Díaz", empresaId: 3, rol: "trabajador" }, 
  { id: 26, nombre: "Manolo Lobo", empresaId: 3, rol: "trabajador" }, 
  { id: 27, nombre: "David López", empresaId: 3, rol: "trabajador" }, 
  { id: 28, nombre: "Pedro Solis", empresaId: 4, rol: "encargado" }, 
  { id: 29, nombre: "Alberto Solis", empresaId: 4, rol: "trabajador" }, 
  { id: 30, nombre: "Jorge Martínez", empresaId: 4, rol: "trabajador" }, 
  { id: 31, nombre: "Alberto Masa", empresaId: 4, rol: "trabajador" }, 
  { id: 32, nombre: "Antonio Vellarino", empresaId: 4, rol: "trabajador" }, 
  { id: 33, nombre: "Francisco Sánchez", empresaId: 4, rol: "trabajador" }, 
  { id: 34, nombre: "Jose Antonio Viegas", empresaId: 5, rol: "encargado" }, 
  { id: 35, nombre: "Belén García", empresaId: 5, rol: "trabajador" }, 
  { id: 36, nombre: "Antonio Vellarino", empresaId: 5, rol: "trabajador" }, 
  { id: 37, nombre: "Vicente Manzano", empresaId: 5, rol: "trabajador" }, 
  { id: 38, nombre: "Jesús Salazar", empresaId: 6, rol: "trabajador" }, 
  { id: 39, nombre: "Yolanda Jiménez", empresaId: 6, rol: "trabajador" }, 
  { id: 40, nombre: "Laura Hernández", empresaId: 6, rol: "trabajador" }, 
  { id: 41, nombre: "Iratxe Plaza", empresaId: 6, rol: "trabajador" }, 
];

const PRIORIDADES = ["Baja", "Media", "Alta", "Urgente"]; 
const PRIORIDAD_COLORES = { Baja: "#38A169", Media: "#D4A017", Alta: "#DD6B20", Urgente: "#E53E3E" }; 
const ESTADOS = ["Pendiente", "Asignado", "En progreso", "Completado", "Cancelado"]; 
const ESTADO_COLORES = { Pendiente: "#718096", Asignado: "#3182CE", "En progreso": "#D4A017", Completado: "#38A169", Cancelado: "#E53E3E" };

const PINS_DEFAULT = {}; 
for (let i = 0; i <= 41; i++) { PINS_DEFAULT[i] = "1234"; }

// Funciones Auxiliares [10]
function genId() { return Date.now() + Math.random(); } 
function fmtFecha(iso) { return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }); }

function ticketToFirestore(t) { 
  return { ...t, imagenes: JSON.stringify(t.imagenes || []), comentarios: JSON.stringify(t.comentarios || []) }; 
} 
function ticketFromFirestore(t) { 
  return { ...t, imagenes: typeof t.imagenes === "string" ? JSON.parse(t.imagenes) : (t.imagenes || []), comentarios: typeof t.comentarios === "string" ? JSON.parse(t.comentarios) : (t.comentarios || []) }; 
}

// Estilos Base [11]
const inp = { fontFamily: "inherit", fontSize: 13, background: "#1A2235", border: "1px solid #2E3A55", borderRadius: 6, padding: "9px 12px", color: "#E2E8F0", outline: "none", width: "100%", boxSizing: "border-box" };
const btnS = { fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer" };

// Componentes Base [12, 13]
function Badge({ texto, color, small }) { 
  return ( <span style={{ background: color + "22", color, border: `1px solid ${color}55`, borderRadius: 4, padding: small ? "1px 7px" : "3px 10px", fontSize: small ? 10 : 11, fontWeight: 700 }}> {texto} </span> ); 
}

function Avatar({ nombre, color, size = 32 }) { 
  const ini = nombre.split(" ").map(p => p).slice(0, 2).join("").toUpperCase(); 
  return ( <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 800 }}> {ini} </div> ); 
}

// ─── MODAL CREAR TICKET ─────────────────────────────────────────────────────── [1, 13]
function ModalCrearTicket({ usuarioActual, onClose, onCrear }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDesc] = useState("");
  const [empresasDestino, setEmps] = useState([]);

  const submit = () => {
    if (titulo.trim().length === 0 || empresasDestino.length === 0) return;
    onCrear({
      id: genId(),
      titulo: titulo.trim(),
      descripcion,
      prioridad: "Media",
      categoria: "Otro",
      empresasDestino,
      empresaOrigenId: usuarioActual.empresaId,
      creadoPor: usuarioActual.id,
      estado: "Pendiente",
      vistoPorTrabajador: false, // <-- NUEVO: Estado de confirmación inicial
      asignacionesPorEmpresa: {},
      fecha: new Date().toISOString(),
      comentarios: [],
      imagenes: [],
    });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#111827", padding: 28, borderRadius: 14, width: "100%", maxWidth: 500 }}>
        <h2 style={{ color: "#fff", marginBottom: 20 }}>Nuevo Ticket</h2>
        <input style={inp} placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          {EMPRESAS.filter(e => e.id !== 0).map(e => (
            <button key={e.id} onClick={() => setEmps([e.id])} style={{ ...btnS, background: empresasDestino.includes(e.id) ? e.color : "#1A2235", color: "#fff" }}>{e.nombre}</button>
          ))}
        </div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ ...btnS, background: "transparent", color: "#64748B" }}>Cancelar</button>
          <button onClick={submit} style={{ ...btnS, background: "#3182CE", color: "#fff" }}>Crear Ticket</button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL DETALLE ──────────────────────────────────────────────────────────── [3, 14]
function ModalDetalle({ ticket, usuarioActual, onClose, onActualizar }) {
  const [seleccionados, setSelecs] = useState((ticket.asignacionesPorEmpresa || {})[usuarioActual.empresaId] || []);
  const todosAsignadosIds = Object.values(ticket.asignacionesPorEmpresa || {}).flat();
  const esAsignado = todosAsignadosIds.includes(usuarioActual.id);

  // NUEVA GESTIÓN: Doble Tick Verde cuando el trabajador asignado abre el ticket
  useEffect(() => {
    if (esAsignado && !ticket.vistoPorTrabajador) {
      onActualizar({ ...ticket, vistoPorTrabajador: true });
    }
  }, [ticket.id, esAsignado, ticket.vistoPorTrabajador]);

  const asignar = () => {
    const nuevas = { ...ticket.asignacionesPorEmpresa, [usuarioActual.empresaId]: seleccionados };
    onActualizar({ ...ticket, asignacionesPorEmpresa: nuevas, estado: "Asignado" });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#111827", padding: 28, borderRadius: 14, width: "100%", maxWidth: 600 }}>
        <h2 style={{ color: "#fff" }}>{ticket.titulo}</h2>
        <p style={{ color: "#94A3B8" }}>{ticket.descripcion}</p>
        {usuarioActual.rol === "encargado" && (
          <div>
            <h4 style={{ color: "#fff" }}>Asignar Trabajadores</h4>
            {USUARIOS.filter(u => u.empresaId === usuarioActual.empresaId && u.rol === "trabajador").map(u => (
              <label key={u.id} style={{ display: "block", color: "#E2E8F0", marginBottom: 5 }}>
                <input type="checkbox" checked={seleccionados.includes(u.id)} onChange={() => setSelecs(prev => prev.includes(u.id) ? prev.filter(x => x !== u.id) : [...prev, u.id])} /> {u.nombre}
              </label>
            ))}
            <button onClick={asignar} style={{ ...btnS, background: "#38A169", color: "#fff", marginTop: 10 }}>Guardar Asignación</button>
          </div>
        )}
        <button onClick={onClose} style={{ ...btnS, background: "#E53E3E", color: "#fff", marginTop: 20 }}>Cerrar</button>
      </div>
    </div>
  );
}

// ─── TARJETA TICKET ─────────────────────────────────────────────────────────── [4]
function TarjetaTicket({ ticket, onClick }) {
  const empOrigen = EMPRESAS.find(e => e.id === ticket.empresaOrigenId);
  
  return (
    <div onClick={onClick} style={{ background: "#111827", border: "1px solid #1E293B", borderRadius: 10, padding: "16px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Badge texto={ticket.estado} color={ESTADO_COLORES[ticket.estado]} small />
        <h4 style={{ margin: "8px 0 4px", color: "#E2E8F0" }}>{ticket.titulo}</h4>
        <span style={{ fontSize: 11, color: "#64748B" }}>{empOrigen?.nombre} • {fmtFecha(ticket.fecha)}</span>
      </div>
      
      {/* NUEVA GESTIÓN DE TICKS [Basado en requerimientos] */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {ticket.vistoPorTrabajador ? (
          <span title="Visto por trabajador" style={{ color: "#38A169", fontWeight: "bold", fontSize: 18 }}>✓✓</span>
        ) : ticket.estado !== "Pendiente" ? (
          <span title="Asignado" style={{ color: "#718096", fontSize: 18 }}>✓✓</span>
        ) : (
          <span title="Enviado" style={{ color: "#718096", fontSize: 18 }}>✓</span>
        )}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ──────────────────────────────────────────────────────────── [15]
export default function App() {
  const [tickets, setTickets] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [logueado, setLogueado] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tickets"), (snap) => {
      setTickets(snap.docs.map(d => ticketFromFirestore(d.data())).sort((a,b) => b.fecha.localeCompare(a.fecha)));
    });
    return () => unsub();
  }, []);

  const crearTicket = (t) => setDoc(doc(db, "tickets", String(t.id)), ticketToFirestore(t));
  const actualizarTicket = (t) => setDoc(doc(db, "tickets", String(t.id)), ticketToFirestore(t));

  if (!logueado) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0F1C", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button onClick={() => { setLogueado(true); setUsuarioId(1); }} style={{ ...btnS, background: "#3182CE", color: "#fff", padding: "15px 30px" }}>Entrar (Demo Encargado)</button>
        <button onClick={() => { setLogueado(true); setUsuarioId(2); }} style={{ ...btnS, background: "#38A169", color: "#fff", padding: "15px 30px", marginLeft: 10 }}>Entrar (Demo Trabajador)</button>
      </div>
    );
  }

  const usuario = USUARIOS.find(u => u.id === usuarioId);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0F1C", padding: 20, fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
          <h1 style={{ color: "#fff" }}>Panel de Tickets</h1>
          <button onClick={() => setModalCrear(true)} style={{ ...btnS, background: "#3182CE", color: "#fff" }}>+ Nuevo Ticket</button>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tickets.map(t => (
            <TarjetaTicket key={t.id} ticket={t} onClick={() => setDetalle(t)} />
          ))}
        </div>
      </div>

      {modalCrear && <ModalCrearTicket usuarioActual={usuario} onClose={() => setModalCrear(false)} onCrear={crearTicket} />}
      {detalle && <ModalDetalle ticket={detalle} usuarioActual={usuario} onClose={() => setDetalle(null)} onActualizar={actualizarTicket} />}
    </div>
  );
}
