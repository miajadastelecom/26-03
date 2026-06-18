import { useState, useMemo, useEffect } from "react";

// Dark/Light mode — módulo nivel para acceso global
const getDM = () => { try { return localStorage.getItem("theme") !== "light"; } catch { return true; } };
let __darkMode = getDM();
const darkMode = __darkMode;
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";

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

// ─── DATOS ────────────────────────────────────────────────────────────────────
const EMPRESAS = [
  { id: 0, nombre: "Dirección General",         color: darkMode ? "#94A3B8" : "#334155", inicial: "DG" },
  { id: 1, nombre: "Energía de Miajadas",        color: "#E53E3E", inicial: "EM" },
  { id: 2, nombre: "Miajadas Telecom",           color: "#D4A017", inicial: "MT" },
  { id: 3, nombre: "Laura Otero Instalaciones",  color: "#2B6CB0", inicial: "LI" },
  { id: 4, nombre: "Zaqaru",                     color: "#805AD5", inicial: "ZQ" },
  { id: 5, nombre: "Laura Otero",                color: "#276749", inicial: "LO" },
  { id: 6, nombre: "Comercial",                  color: "#E53E3E", inicial: "CO" },
];

const USUARIOS = [
  { id: 0,  nombre: "Miguel Manzano",          empresaId: 0, rol: "director"   },
  // Energía de Miajadas
  { id: 1,  nombre: "Ángel Fernández",          empresaId: 1, rol: "encargado"  },
  { id: 2,  nombre: "Jose Manuel Fuentes",      empresaId: 1, rol: "trabajador" },
  { id: 3,  nombre: "María Manzano",            empresaId: 1, rol: "trabajador" },
  // Miajadas Telecom
  { id: 4,  nombre: "Valentín Pérez",           empresaId: 2, rol: "encargado"  },
  { id: 5,  nombre: "Esther Albalá",            empresaId: 2, rol: "trabajador" },
  { id: 6,  nombre: "Aitor Garrido",            empresaId: 2, rol: "trabajador" },
  { id: 7,  nombre: "Carlos Cintero",           empresaId: 2, rol: "trabajador" },
  { id: 8,  nombre: "Javier Acedo",             empresaId: 2, rol: "trabajador" },
  { id: 9,  nombre: "Sara Márquez",             empresaId: 2, rol: "administrador" },
  // Laura Otero Instalaciones
  { id: 10, nombre: "Miguel Calvo",             empresaId: 3, rol: "encargado"  },
  { id: 11, nombre: "Juan Antonio Fuentes",     empresaId: 3, rol: "trabajador" },
  { id: 12, nombre: "Jaime Naranjo",            empresaId: 3, rol: "trabajador" },
  { id: 13, nombre: "Jose Luis Saavedra",       empresaId: 3, rol: "trabajador" },
  { id: 14, nombre: "Carlos P. Pajuelo",        empresaId: 3, rol: "trabajador" },
  { id: 15, nombre: "Oscar García",             empresaId: 3, rol: "trabajador" },
  { id: 16, nombre: "Francisco Javier Llanos",  empresaId: 3, rol: "trabajador" },
  { id: 17, nombre: "Borja Llanos",             empresaId: 3, rol: "trabajador" },
  { id: 18, nombre: "Luis Collado",             empresaId: 3, rol: "trabajador" },
  { id: 19, nombre: "Félix Loro",               empresaId: 3, rol: "trabajador" },
  { id: 20, nombre: "Ekaitz Pereira",           empresaId: 3, rol: "trabajador" },
  { id: 21, nombre: "Jairo Miguel",             empresaId: 3, rol: "trabajador" },
  { id: 22, nombre: "Andrés Medina",            empresaId: 3, rol: "trabajador" },
  { id: 23, nombre: "Francisco Babiano",        empresaId: 3, rol: "trabajador" },
  { id: 24, nombre: "Guillermo Méndez",         empresaId: 3, rol: "trabajador" },
  { id: 25, nombre: "Antonio Díaz",             empresaId: 3, rol: "trabajador" },
  { id: 26, nombre: "Manolo Lobo",              empresaId: 3, rol: "trabajador" },
  { id: 27, nombre: "David López",              empresaId: 3, rol: "trabajador" },
  // Zaqaru
  { id: 28, nombre: "Pedro Solis",              empresaId: 4, rol: "encargado"  },
  { id: 29, nombre: "Alberto Solis",            empresaId: 4, rol: "trabajador" },
  { id: 30, nombre: "Jorge Martínez",           empresaId: 4, rol: "trabajador" },
  { id: 31, nombre: "Alberto Masa",             empresaId: 4, rol: "trabajador" },
  { id: 32, nombre: "Antonio Vellarino",        empresaId: 4, rol: "trabajador" },
  { id: 33, nombre: "Francisco Sánchez",        empresaId: 4, rol: "trabajador" },
  // Laura Otero
  { id: 34, nombre: "Jose Antonio Viegas",      empresaId: 5, rol: "encargado"  },
  { id: 35, nombre: "Belén García",             empresaId: 5, rol: "trabajador" },
  { id: 36, nombre: "Antonio Vellarino",        empresaId: 5, rol: "trabajador" },
  { id: 37, nombre: "Vicente Manzano",          empresaId: 5, rol: "trabajador" },
  // Comercial (sin encargado — asignación directa)
  { id: 38, nombre: "Jesús Salazar",            empresaId: 6, rol: "trabajador" },
  { id: 39, nombre: "Yolanda Jiménez",          empresaId: 6, rol: "trabajador" },
  { id: 40, nombre: "Laura Hernández",          empresaId: 6, rol: "trabajador" },
  { id: 41, nombre: "Iratxe Plaza",             empresaId: 6, rol: "trabajador" },
];

const PRIORIDADES = ["Baja", "Media", "Alta", "Urgente"];
const PRIORIDAD_COLORES = { Baja: "#38A169", Media: "#D4A017", Alta: "#DD6B20", Urgente: "#E53E3E" };
const CATEGORIAS = ["Electricidad", "Fontanería", "Telecomunicaciones", "Contabilidad", "Legal", "Mantenimiento", "Instalaciones", "Administración", "Otro"];
const ESTADOS = ["Pendiente", "Asignado", "En progreso", "Completado", "Cancelado"];

// ── Carga config desde Firestore al iniciar ──
const loadConfig = async () => {
  try {
    const { getDocs, collection: col } = await import("firebase/firestore");
    const snap = await getDocs(col(db, "config"));
    snap.docs.forEach(d => {
      try {
        const val = JSON.parse(d.data().value);
        if (d.id === "categorias" && Array.isArray(val) && val.length > 0) {
          CATEGORIAS.length = 0; val.forEach(v => CATEGORIAS.push(v));
        }
        if (d.id === "estados" && Array.isArray(val) && val.length > 0) {
          ESTADOS.length = 0; val.forEach(v => ESTADOS.push(v));
        }
        if (d.id === "empresas" && Array.isArray(val) && val.length > 0) {
          EMPRESAS.length = 0; val.forEach(v => EMPRESAS.push(v));
        }
        if (d.id === "usuarios" && Array.isArray(val) && val.length > 0) {
          USUARIOS.length = 0; val.forEach(v => USUARIOS.push(v));
        }
      } catch {}
    });
  } catch {}
};
loadConfig();
const ESTADO_COLORES = { Pendiente: "#718096", Asignado: "#3182CE", "En progreso": "#D4A017", Completado: "#38A169", Cancelado: "#E53E3E" };

// PINs por defecto (4 dígitos) — clave: userId, valor: pin string
const PINS_DEFAULT = {};
for (const u of [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41]) {
  PINS_DEFAULT[u] = "1234";
}

function genId() { return Date.now() + Math.random(); }
function fmtFecha(iso) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

// Firestore no acepta arrays con objetos anidados complejos
// Serializamos imagenes y comentarios como strings JSON
function ticketToFirestore(t) {
  return {
    ...t,
    imagenes:              JSON.stringify(t.imagenes   || []),
    comentarios:           JSON.stringify(t.comentarios|| []),
    completadoPorEmpresa:  JSON.stringify(t.completadoPorEmpresa || {}),
    fechaLimite:           t.fechaLimite ?? null,
  };
}
function ticketFromFirestore(t) {
  return {
    ...t,
    imagenes:             typeof t.imagenes    === "string" ? JSON.parse(t.imagenes)    : (t.imagenes    || []),
    comentarios:          typeof t.comentarios === "string" ? JSON.parse(t.comentarios) : (t.comentarios || []),
    completadoPorEmpresa: typeof t.completadoPorEmpresa === "string" ? JSON.parse(t.completadoPorEmpresa) : (t.completadoPorEmpresa || {}),
    fechaLimite:          t.fechaLimite ?? null,
  };
}

// ─── ESTILOS BASE ─────────────────────────────────────────────────────────────
const inp    = { fontFamily: "inherit", fontSize: 13, background: darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 6, padding: "9px 12px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none", width: "100%", boxSizing: "border-box" };
const btnS   = { fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer" };
const labelS = { display: "block", color: darkMode ? "#64748B" : "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 5 };

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
function Badge({ texto, color, small }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}55`, borderRadius: 4, padding: small ? "1px 7px" : "3px 10px", fontSize: small ? 10 : 11, fontWeight: 700, letterSpacing: ".3px", whiteSpace: "nowrap" }}>
      {texto}
    </span>
  );
}

function Avatar({ nombre, color, size = 32 }) {
  const ini = nombre.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 800, flexShrink: 0 }}>
      {ini}
    </div>
  );
}

function EmpresaTag({ empresaId }) {
  const emp = EMPRESAS.find(e => e.id === empresaId);
  if (!emp) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: emp.color + "18", color: emp.color, border: `1px solid ${emp.color}40`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: emp.color, display: "inline-block" }} />
      {emp.nombre}
    </span>
  );
}

// ─── MODAL CREAR TICKET ───────────────────────────────────────────────────────
function ModalCrearTicket({ usuarioActual, onClose, onCrear }) {
  const darkMode = __darkMode;
  const [titulo, setTitulo]         = useState("");
  const [descripcion, setDesc]      = useState("");
  const [prioridad, setPrioridad]   = useState("Media");
  const [categoria, setCategoria]   = useState("Otro");
  const [imagenes, setImagenes]     = useState([]);
  const [empresasDestino, setEmps]  = useState([]);
  const [comercialAsignados, setComercialAsignados] = useState([]);
  const [origenId, setOrigenId]     = useState(usuarioActual.empresaId > 0 ? usuarioActual.empresaId : 1);
  const [fechaInicio,  setFechaInicio]  = useState("");
  const [horaInicio,   setHoraInicio]   = useState("");
  const [duracion,     setDuracion]     = useState("");
  const [fechaLimite,  setFechaLimite]  = useState("");
  const [ubicacion, setUbicacion]     = useState("");
  const [geoLoading, setGeoLoading]   = useState(false);
  const [geoError, setGeoError]       = useState("");
  const [acopio, setAcopio]           = useState(null); // null=sin responder, true=Sí, false=No
  const [materiales, setMateriales]   = useState("");

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setGeoError("Tu navegador no soporta geolocalización.");
      return;
    }
    setGeoLoading(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "es", "User-Agent": "TicketApp/1.0" } }
          );
          const data = await res.json();
          setUbicacion(data.display_name || `${latitude}, ${longitude}`);
        } catch {
          setGeoError("No se pudo obtener la dirección. Intenta de nuevo.");
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === 1) setGeoError("Permiso denegado. Actívalo en tu navegador.");
        else if (err.code === 2) setGeoError("No se pudo detectar tu posición.");
        else setGeoError("Tiempo de espera agotado. Intenta de nuevo.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const empColor = EMPRESAS.find(e => e.id === (usuarioActual.empresaId > 0 ? usuarioActual.empresaId : 1))?.color || "#94A3B8";
  const disponibles = EMPRESAS.filter(e => e.id !== 0);
  const puedeCrear  = titulo.trim().length > 0 && empresasDestino.length > 0;

  const toggleEmp = (id) => {
    setEmps(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (id === 6 && !next.includes(6)) setComercialAsignados([]);
      return next;
    });
  };

  const handleImagenes = (e) => {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = ev => setImagenes(prev => [...prev, { nombre: f.name, dataUrl: ev.target.result }]);
      r.readAsDataURL(f);
    });
  };

  const submit = () => {
    if (!puedeCrear) return;
    const asignacionesPorEmpresa = {};
    empresasDestino.forEach(id => { asignacionesPorEmpresa[id] = id === 6 ? comercialAsignados : []; });
    const tieneAsignadosComercial = empresasDestino.includes(6) && comercialAsignados.length > 0;
    onCrear({
      id: genId(), titulo: titulo.trim(), descripcion, prioridad, categoria,
      empresasDestino,
      empresaOrigenId: usuarioActual.rol === "director" ? origenId : usuarioActual.empresaId,
      creadoPor: usuarioActual.id,
      estado: tieneAsignadosComercial ? "Asignado" : "Pendiente",
      asignacionesPorEmpresa,
      fecha: new Date().toISOString(),
      fechaAsignacion: tieneAsignadosComercial ? new Date().toISOString() : null,
      fechaInicio: fechaInicio || null,
      horaInicio:  horaInicio  || null,
      duracion:    duracion    || null,
      fechaLimite: fechaLimite || null,
      ubicacion: ubicacion.trim() || null,
      comentarios: [], imagenes,
      acopio: acopio,
      materiales: acopio === true ? materiales.trim() : null,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" className="modal-overlay" style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
      <div className="modal-box" style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 14, width: "100%", maxWidth: 560, padding: 28, boxShadow: "0 24px 80px #0008", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: darkMode ? "#E2E8F0" : "#0F172A" }}>✉️ Nuevo Ticket</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: darkMode ? "#64748B" : "#475569", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelS}>Título *</label>
            <input style={inp} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="¿Qué necesitas?" />
          </div>
          <div>
            <label style={labelS}>Descripción</label>
            <textarea style={{ ...inp, resize: "vertical", minHeight: 80 }} value={descripcion} onChange={e => setDesc(e.target.value)} placeholder="Explica con más detalle..." />
          </div>

          {/* FECHA Y HORA DE INICIO */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelS}>Fecha de inicio</label>
              <input type="date" style={{ ...inp, colorScheme: "dark" }} value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
            </div>
            <div>
              <label style={labelS}>Hora de inicio</label>
              <input type="time" style={{ ...inp, colorScheme: "dark" }} value={horaInicio} onChange={e => setHoraInicio(e.target.value)} />
            </div>
          </div>

          {/* FECHA LÍMITE */}
          <div>
            <label style={labelS}>📅 Fecha límite de resolución</label>
            <input
              type="date"
              style={{ ...inp, colorScheme: "dark", borderColor: fechaLimite ? "#E53E3E88" : undefined }}
              value={fechaLimite}
              onChange={e => setFechaLimite(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
            {fechaLimite && (
              <p style={{ margin: "4px 0 0", color: "#E53E3E", fontSize: 11 }}>
                ⚠️ Si el ticket no se completa antes de esta fecha, aparecerá como urgente en la lista.
              </p>
            )}
          </div>

          {/* UBICACIÓN */}
          <div>
            <label style={labelS}>Ubicación</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>📍</span>
                <input style={{ ...inp, paddingLeft: 34 }} value={ubicacion} onChange={e => { setUbicacion(e.target.value); setGeoError(""); }} placeholder="Calle, número, ciudad..." />
              </div>
              <button
                type="button"
                onClick={obtenerUbicacion}
                disabled={geoLoading}
                title="Usar mi ubicación actual"
                style={{ ...btnS, background: geoLoading ? "#1E293B" : darkMode ? "#1A2235" : "#F8FAFC", color: geoLoading ? "#475569" : "#94A3B8", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", flexShrink: 0, padding: "9px 14px" }}
              >
                {geoLoading
                  ? <><span style={{ display: "inline-block", width: 13, height: 13, border: "2px solid #475569", borderTopColor: "#94A3B8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Localizando...</>
                  : <>🎯 Mi ubicación</>
                }
              </button>
            </div>
            {geoError && (
              <p style={{ margin: "5px 0 0", color: "#E53E3E", fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
                ⚠️ {geoError}
              </p>
            )}
            {ubicacion && !geoError && !geoLoading && (
              <p style={{ margin: "5px 0 0", color: "#38A169", fontSize: 11 }}>
                ✓ Ubicación detectada — puedes editarla si lo necesitas
              </p>
            )}
          </div>

          {/* ACOPIO DE MATERIALES */}
          <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: "14px 16px", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}` }}>
            <label style={{ ...labelS, marginBottom: 10 }}>📦 Acopio de materiales</label>
            <div style={{ display: "flex", gap: 10, marginBottom: acopio === true ? 12 : 0 }}>
              {[{ val: true, label: "✅ Sí", color: "#38A169" }, { val: false, label: "❌ No", color: "#E53E3E" }].map(({ val, label, color }) => (
                <button key={String(val)} type="button"
                  onClick={() => { setAcopio(val); if (!val) setMateriales(""); }}
                  style={{ fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "8px 22px", borderRadius: 6, border: `2px solid ${acopio === val ? color : darkMode ? "#2E3A55" : "#CBD5E1"}`, cursor: "pointer", background: acopio === val ? color + "22" : darkMode ? "#111827" : "#FFFFFF", color: acopio === val ? color : "#64748B", transition: "all .15s" }}>
                  {label}
                </button>
              ))}
              {acopio === null && <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 12, alignSelf: "center" }}>Selecciona una opción</span>}
            </div>
            {acopio === true && (
              <div>
                <label style={{ ...labelS, marginBottom: 5 }}>Lista de materiales</label>
                <textarea
                  style={{ ...inp, resize: "vertical", minHeight: 80 }}
                  value={materiales}
                  onChange={e => setMateriales(e.target.value)}
                  placeholder="Ej: 10m cable RJ45, 2 conectores, 1 switch 8 puertos..." />
              </div>
            )}
          </div>

          <div>
            <label style={labelS}>Imágenes adjuntas</label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, background: darkMode ? "#1A2235" : "#F8FAFC", border: "2px dashed #2E3A55", borderRadius: 8, padding: "12px 16px", cursor: "pointer" }}>
              <span style={{ fontSize: 20 }}>📎</span>
              <div>
                <p style={{ margin: 0, color: "#CBD5E1", fontSize: 13, fontWeight: 600 }}>Adjuntar imágenes</p>
                <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 11 }}>JPG, PNG, GIF</p>
              </div>
              <input type="file" accept="image/*" multiple onChange={handleImagenes} style={{ display: "none" }} />
            </label>
            {imagenes.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {imagenes.map((img, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}` }}>
                    <img src={img.dataUrl} alt={img.nombre} style={{ width: 72, height: 72, objectFit: "cover", display: "block" }} />
                    <button onClick={() => setImagenes(prev => prev.filter((_, idx) => idx !== i))} style={{ position: "absolute", top: 3, right: 3, background: "#00000099", border: "none", color: "#fff", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {usuarioActual.rol === "director" && (
            <div>
              <label style={labelS}>Empresa origen</label>
              <select style={inp} value={origenId} onChange={e => setOrigenId(Number(e.target.value))}>
                {disponibles.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
          )}

          <div>
            <label style={labelS}>Empresas destino * — selecciona las que necesites</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {disponibles.map(emp => {
                const marcada = empresasDestino.includes(emp.id);
                return (
                  <div key={emp.id}>
                    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: marcada ? emp.color + "18" : darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${marcada ? emp.color + "66" : darkMode ? "#2E3A55" : "#CBD5E1"}`, cursor: "pointer" }}>
                      <input type="checkbox" checked={marcada} onChange={() => toggleEmp(emp.id)} style={{ accentColor: emp.color, width: 15, height: 15, flexShrink: 0 }} />
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: emp.color, flexShrink: 0 }} />
                      <span style={{ color: marcada ? "#E2E8F0" : "#94A3B8", fontSize: 13, fontWeight: marcada ? 700 : 400, flex: 1 }}>{emp.nombre}</span>
                      {emp.id === usuarioActual.empresaId && <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 10 }}>mi empresa</span>}
                      {marcada && emp.id !== 6 && <span style={{ color: emp.color, fontSize: 12 }}>✓</span>}
                      {marcada && emp.id === 6 && <span style={{ color: emp.color, fontSize: 10 }}>{comercialAsignados.length > 0 ? `${comercialAsignados.length} asignada${comercialAsignados.length > 1 ? "s" : ""}` : "elige persona"}</span>}
                    </label>
                    {/* Selector de personas para Comercial */}
                    {marcada && emp.id === 6 && (
                      <div style={{ marginTop: 4, marginLeft: 12, display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px", background: darkMode ? "#0D1424" : "#FFFFFF", borderRadius: 8, border: `1px solid ${emp.color}33` }}>
                        <p style={{ margin: "0 0 6px", color: emp.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                          🎯 Selecciona a quién va dirigido
                        </p>
                        {USUARIOS.filter(u => u.empresaId === 6).map(u => {
                          const sel = comercialAsignados.includes(u.id);
                          return (
                            <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, background: sel ? emp.color + "22" : darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${sel ? emp.color + "66" : darkMode ? "#2E3A55" : "#CBD5E1"}`, cursor: "pointer" }}>
                              <input type="checkbox" checked={sel}
                                onChange={() => setComercialAsignados(prev => sel ? prev.filter(x => x !== u.id) : [...prev, u.id])}
                                style={{ accentColor: emp.color, width: 14, height: 14, flexShrink: 0 }} />
                              <Avatar nombre={u.nombre} color={emp.color} size={22} />
                              <span style={{ color: sel ? "#E2E8F0" : "#94A3B8", fontSize: 12, fontWeight: sel ? 700 : 400, flex: 1 }}>{u.nombre}</span>
                              {sel && <span style={{ color: emp.color, fontSize: 11 }}>✓</span>}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {empresasDestino.length > 0 && (
              <p style={{ margin: "6px 0 0", color: darkMode ? "#64748B" : "#475569", fontSize: 11 }}>
                {empresasDestino.filter(id => id !== 6).length > 0 && "El encargado de cada empresa asignará a sus trabajadores. "}
                {empresasDestino.includes(6) && comercialAsignados.length === 0 && <span style={{ color: "#E53E3E" }}>⚠️ Selecciona al menos una persona de Comercial.</span>}
              </p>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelS}>Prioridad</label>
              <select style={inp} value={prioridad} onChange={e => setPrioridad(e.target.value)}>
                {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelS}>Categoría</label>
              <select style={inp} value={categoria} onChange={e => setCategoria(e.target.value)}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ ...btnS, background: darkMode ? "#1E293B" : "#E2E8F0", color: darkMode ? "#94A3B8" : "#334155" }}>Cancelar</button>
          <button onClick={submit} disabled={!puedeCrear} style={{ ...btnS, background: puedeCrear ? empColor : darkMode ? "#1E293B" : "#E2E8F0", color: puedeCrear ? "#fff" : "#475569", fontWeight: 800 }}>
            Crear Ticket →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL DETALLE ────────────────────────────────────────────────────────────
function ModalDetalle({ ticket, usuarioActual, onClose, onActualizar }) {
  const darkMode = __darkMode;
  const asignacionesIniciales = (ticket.asignacionesPorEmpresa || {})[usuarioActual.empresaId] || [];
  const [comentario, setComentario]   = useState("");
  const [seleccionados, setSelecs]    = useState(asignacionesIniciales);
  const [adjuntos, setAdjuntos]       = useState([]);
  const [editandoFecha, setEditandoFecha] = useState(false);
  const [editFecha,    setEditFecha]  = useState(ticket.fechaInicio || "");
  const [editHora,     setEditHora]   = useState(ticket.horaInicio  || "");
  const [editDuracion, setEditDuracion] = useState(ticket.duracion  || "");
  const [editandoAcopio, setEditandoAcopio] = useState(false);
  const [editAcopio,     setEditAcopio]     = useState(ticket.acopio ?? null);
  const [editMateriales, setEditMateriales] = useState(ticket.materiales || "");

  const empresasDestino   = ticket.empresasDestino || [];
  const asignaciones      = ticket.asignacionesPorEmpresa || {};
  const todosAsignadosIds = Object.values(asignaciones).flat();

  const esDirector         = usuarioActual.rol === "director";
  const esAdmin            = usuarioActual.rol === "administrador";
  const esEncargadoDest    = (usuarioActual.rol === "encargado" || esAdmin) && empresasDestino.includes(usuarioActual.empresaId);
  const esAsignado         = todosAsignadosIds.includes(usuarioActual.id);
  const esCreadoPor        = ticket.creadoPor === usuarioActual.id;
  const puedeAccion        = esDirector || esEncargadoDest || esAsignado || esCreadoPor || esAdmin;

  const creador     = USUARIOS.find(u => u.id === ticket.creadoPor);
  const empOrigen   = EMPRESAS.find(e => e.id === ticket.empresaOrigenId);
  const accentColor = empOrigen?.color || "#3182CE";
  const miEmpresa   = EMPRESAS.find(e => e.id === usuarioActual.empresaId);
  const misTrabs    = USUARIOS.filter(u => u.empresaId === usuarioActual.empresaId && ["trabajador","encargado","administrador"].includes(u.rol));

  const toggleSel = (id) => setSelecs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const guardarFecha = () => {
    onActualizar({
      ...ticket,
      fechaInicio: editFecha || null,
      horaInicio:  editHora  || null,
      duracion:    editDuracion || null,
    });
    setEditandoFecha(false);
  };

  const guardarAcopio = () => {
    onActualizar({
      ...ticket,
      acopio:     editAcopio,
      materiales: editAcopio === true ? editMateriales.trim() : null,
    });
    setEditandoAcopio(false);
  };

  const asignar = () => {
    if (seleccionados.length === 0) return;
    const nuevas = { ...asignaciones, [usuarioActual.empresaId]: seleccionados };
    onActualizar({
      ...ticket,
      asignacionesPorEmpresa: nuevas,
      estado: "Asignado",
      fechaAsignacion: ticket.fechaAsignacion || new Date().toISOString(),
    });
  };

  const cambiarEstado = (estado) => {
    if (estado === "Completado") {
      const ahora    = new Date();
      const fechaFin = ahora.toISOString().split("T")[0];
      const horaFin  = ahora.toTimeString().slice(0, 5);
      // Calcular duración real si hay fecha de inicio
      let duracion = ticket.duracion || null;
      if (ticket.fechaInicio) {
        const inicio = new Date(`${ticket.fechaInicio}T${ticket.horaInicio || "00:00"}`);
        const diff   = ahora - inicio;
        if (diff > 0) {
          const mins  = Math.floor(diff / 60000);
          const dias  = Math.floor(mins / 1440);
          const horas = Math.floor((mins % 1440) / 60);
          const mints = mins % 60;
          let r = "";
          if (dias > 0)  r += `${dias}d `;
          if (horas > 0) r += `${horas}h `;
          if (mints > 0) r += `${mints}min`;
          duracion = r.trim() || duracion;
        }
      }

      // ── Lógica multi-empresa: marcar solo la empresa del usuario actual ──
      const empresasDestino = ticket.empresasDestino || [];
      const miEmpresaId     = usuarioActual.empresaId;
      const completadoPorEmpresa = {
        ...(ticket.completadoPorEmpresa || {}),
        [miEmpresaId]: true,
      };

      // Solo cuentan las empresas que tienen al menos un trabajador asignado
      const asignaciones    = ticket.asignacionesPorEmpresa || {};
      const empresasActivas = empresasDestino.filter(id => (asignaciones[id] || []).length > 0);
      // Si ninguna tiene asignados aún, usamos todas las empresas destino
      const empresasQueCuentan = empresasActivas.length > 0 ? empresasActivas : empresasDestino;
      const todasCompletan     = empresasQueCuentan.every(id => completadoPorEmpresa[id] === true);

      if (todasCompletan) {
        // TODAS las empresas han completado → completar el ticket globalmente
        onActualizar({ ...ticket, estado: "Completado", fechaFin, horaFin, duracion, fechaCompletado: ahora.toISOString(), completadoPorEmpresa });
      } else {
        // Aún quedan empresas pendientes → marcar esta empresa y dejar en "En progreso"
        onActualizar({ ...ticket, estado: "En progreso", completadoPorEmpresa });
      }
    } else {
      onActualizar({ ...ticket, estado });
    }
  };

  const enviarComentario = () => {
    if (!comentario.trim() && adjuntos.length === 0) return;
    onActualizar({
      ...ticket,
      comentarios: [...ticket.comentarios, {
        id: genId(), texto: comentario,
        autorId: usuarioActual.id, fecha: new Date().toISOString(),
        adjuntos: adjuntos,
      }],
    });
    setComentario("");
    setAdjuntos([]);
  };

  const handleAdjuntos = (e) => {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = ev => setAdjuntos(prev => [...prev, { nombre: f.name, dataUrl: ev.target.result, tipo: f.type }]);
      r.readAsDataURL(f);
    });
    e.target.value = "";
  };

  return (
    <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
      <div className="modal-box" style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 14, width: "100%", maxWidth: 660, padding: 28, margin: "auto", boxShadow: "0 24px 80px #0008" }}>

        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ flex: 1, marginRight: 16 }}>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
              <Badge texto={ticket.estado} color={ESTADO_COLORES[ticket.estado]} />
              <Badge texto={ticket.prioridad} color={PRIORIDAD_COLORES[ticket.prioridad]} />
              <Badge texto={ticket.categoria} color="#64748B" />
            </div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: darkMode ? "#E2E8F0" : "#0F172A", lineHeight: 1.3 }}>{ticket.titulo}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: darkMode ? "#64748B" : "#475569", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>

        {/* Info básica */}
        <div className="form-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 7, padding: "10px 12px" }}>
            <p style={{ margin: "0 0 3px", color: darkMode ? "#475569" : "#64748B", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Creado por</p>
            <p style={{ margin: 0, color: "#CBD5E1", fontSize: 13 }}>{creador?.nombre}</p>
          </div>
          <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 7, padding: "10px 12px" }}>
            <p style={{ margin: "0 0 3px", color: darkMode ? "#475569" : "#64748B", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Fecha</p>
            <p style={{ margin: 0, color: "#CBD5E1", fontSize: 13 }}>{fmtFecha(ticket.fecha)}</p>
          </div>
          <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 7, padding: "10px 12px" }}>
            <p style={{ margin: "0 0 3px", color: darkMode ? "#475569" : "#64748B", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Empresa origen</p>
            <EmpresaTag empresaId={ticket.empresaOrigenId} />
          </div>
        </div>

        {/* Fecha, hora, duración, ubicación */}
        {(ticket.fechaInicio || ticket.ubicacion || ticket.duracion) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {ticket.fechaInicio && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 7, padding: "8px 12px", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}` }}>
                <span style={{ fontSize: 14 }}>📅</span>
                <div>
                  <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Fecha inicio</p>
                  <p style={{ margin: 0, color: "#CBD5E1", fontSize: 12, fontWeight: 600 }}>
                    {new Date(ticket.fechaInicio).toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                    {ticket.horaInicio && <span style={{ color: darkMode ? "#94A3B8" : "#334155" }}> · {ticket.horaInicio}</span>}
                  </p>
                </div>
              </div>
            )}
            {ticket.duracion && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 7, padding: "8px 12px", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}` }}>
                <span style={{ fontSize: 14 }}>⏱️</span>
                <div>
                  <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                    {ticket.estado === "Completado" ? "Duración real" : "Duración estimada"}
                  </p>
                  <p style={{ margin: 0, color: ticket.estado === "Completado" ? "#38A169" : "#CBD5E1", fontSize: 12, fontWeight: 600 }}>{ticket.duracion}</p>
                </div>
              </div>
            )}
            {ticket.fechaFin && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: darkMode ? "#1A223522" : "#F0FDF4", borderRadius: 7, padding: "8px 12px", border: `1px solid ${darkMode ? "#38A16944" : "#BBF7D0"}` }}>
                <span style={{ fontSize: 14 }}>🏁</span>
                <div>
                  <p style={{ margin: 0, color: "#38A169", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Completado</p>
                  <p style={{ margin: 0, color: "#38A169", fontSize: 12, fontWeight: 600 }}>
                    {new Date(ticket.fechaFin).toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                    {ticket.horaFin && <span> · {ticket.horaFin}</span>}
                  </p>
                </div>
              </div>
            )}
            {ticket.fechaLimite && (() => {
              const hoyD         = new Date(); hoyD.setHours(0, 0, 0, 0);
              const limD         = new Date(ticket.fechaLimite + "T00:00:00");
              const yaCompletado = ["Completado", "Cancelado"].includes(ticket.estado);
              const estaVencido  = !yaCompletado && limD < hoyD;
              const esHoy        = !yaCompletado && limD.getTime() === hoyD.getTime();
              const color  = yaCompletado ? "#38A169" : estaVencido || esHoy ? "#E53E3E" : "#D4A017";
              const bgCol  = yaCompletado ? (darkMode ? "#38A16922" : "#F0FDF4") : estaVencido || esHoy ? (darkMode ? "#E53E3E22" : "#FFF5F5") : (darkMode ? "#D4A01722" : "#FFFBEB");
              const bdCol  = yaCompletado ? (darkMode ? "#38A16944" : "#BBF7D0") : estaVencido || esHoy ? "#E53E3E55" : "#D4A01755";
              const label  = yaCompletado ? "Fecha límite" : estaVencido ? "⚠️ VENCIDA" : esHoy ? "🔴 VENCE HOY" : "⏰ Fecha límite";
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 7, background: bgCol, borderRadius: 7, padding: "8px 12px", border: `1px solid ${bdCol}` }}>
                  <span style={{ fontSize: 14 }}>🗓️</span>
                  <div>
                    <p style={{ margin: 0, color, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{label}</p>
                    <p style={{ margin: 0, color, fontSize: 12, fontWeight: 600 }}>
                      {limD.toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })()}
            {ticket.ubicacion && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 7, padding: "8px 12px", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, flex: 1, minWidth: 180 }}>
                <span style={{ fontSize: 14 }}>📍</span>
                <div>
                  <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Ubicación</p>
                  <p style={{ margin: 0, color: "#CBD5E1", fontSize: 12, fontWeight: 600 }}>{ticket.ubicacion}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empresas involucradas */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ margin: "0 0 8px", color: darkMode ? "#475569" : "#64748B", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px" }}>
            Empresas involucradas ({empresasDestino.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {empresasDestino.map(empId => {
              const emp = EMPRESAS.find(e => e.id === empId);
              const asignadosEmp = (asignaciones[empId] || []).map(id => USUARIOS.find(u => u.id === id)).filter(Boolean);
              const haCompletado = (ticket.completadoPorEmpresa || {})[empId] === true;
              return (
                <div key={empId} style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: `1px solid ${emp?.color || "#2E3A55"}33` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: asignadosEmp.length > 0 ? 8 : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: emp?.color, flexShrink: 0 }} />
                      <span style={{ color: emp?.color, fontSize: 12, fontWeight: 700 }}>{emp?.nombre}</span>
                      {asignadosEmp.length === 0
                        ? <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 11, fontStyle: "italic" }}>— pendiente de asignación</span>
                        : <span style={{ color: darkMode ? "#64748B" : "#475569", fontSize: 11 }}>{asignadosEmp.length} persona{asignadosEmp.length > 1 ? "s" : ""} asignada{asignadosEmp.length > 1 ? "s" : ""}</span>
                      }
                    </div>
                    {haCompletado
                      ? <span style={{ background: "#38A16922", color: "#38A169", border: "1px solid #38A16955", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>✓ Completado</span>
                      : ticket.estado !== "Pendiente" && <span style={{ background: "#D4A01722", color: "#D4A017", border: "1px solid #D4A01755", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>⏳ En curso</span>
                    }
                  </div>
                  {asignadosEmp.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingLeft: 16 }}>
                      {asignadosEmp.map(u => (
                        <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 5, background: (emp?.color || "#666") + "18", borderRadius: 20, padding: "3px 10px 3px 4px" }}>
                          <Avatar nombre={u.nombre} color={emp?.color || "#666"} size={20} />
                          <span style={{ color: "#CBD5E1", fontSize: 11, fontWeight: 600 }}>{u.nombre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Acopio de materiales */}
        {ticket.acopio !== null && ticket.acopio !== undefined && (
          <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: 14, marginBottom: 14, border: `1px solid ${ticket.acopio ? "#38A16933" : "#E53E3E33"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: ticket.acopio && ticket.materiales ? 10 : 0 }}>
              <span style={{ fontSize: 16 }}>📦</span>
              <span style={{ color: darkMode ? "#64748B" : "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Acopio de materiales</span>
              <span style={{ background: ticket.acopio ? "#38A16922" : "#E53E3E22", color: ticket.acopio ? "#38A169" : "#E53E3E", border: `1px solid ${ticket.acopio ? "#38A16955" : "#E53E3E55"}`, borderRadius: 4, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                {ticket.acopio ? "✅ Sí" : "❌ No"}
              </span>
            </div>
            {ticket.acopio && ticket.materiales && (
              <p style={{ margin: 0, color: darkMode ? "#94A3B8" : "#334155", fontSize: 13, lineHeight: 1.7, paddingLeft: 24 }}>{ticket.materiales}</p>
            )}
            {ticket.acopio && !ticket.materiales && (
              <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 12, fontStyle: "italic", paddingLeft: 24 }}>Sin lista de materiales especificada</p>
            )}
          </div>
        )}

        {/* Descripción */}
        {!!ticket.descripcion && (
          <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: 14, marginBottom: 14 }}>
            <p style={{ margin: 0, color: darkMode ? "#94A3B8" : "#334155", fontSize: 13, lineHeight: 1.7 }}>{ticket.descripcion}</p>
          </div>
        )}

        {/* Imágenes */}
        {ticket.imagenes?.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ margin: "0 0 8px", color: darkMode ? "#64748B" : "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Imágenes ({ticket.imagenes.length})</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ticket.imagenes.map((img, i) => (
                <a key={i} href={img.dataUrl} target="_blank" rel="noreferrer">
                  <img src={img.dataUrl} alt={img.nombre} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 8, border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, cursor: "zoom-in" }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Editar fecha/hora/duración — solo encargados y director */}
        {(esEncargadoDest || esDirector) && !["Cancelado"].includes(ticket.estado) && (
          <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: 14, marginBottom: 14, border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editandoFecha ? 12 : 0 }}>
              <p style={{ margin: 0, color: "#93C5FD", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                📅 Fecha y hora del trabajo
              </p>
              {!editandoFecha
                ? <button onClick={() => setEditandoFecha(true)}
                    style={{ ...btnS, background: darkMode ? "#2E3A55" : "#CBD5E1", color: "#93C5FD", fontSize: 11, padding: "5px 12px" }}>
                    ✏️ Editar
                  </button>
                : <button onClick={() => setEditandoFecha(false)}
                    style={{ ...btnS, background: "transparent", color: darkMode ? "#475569" : "#64748B", fontSize: 11, padding: "5px 12px" }}>
                    Cancelar
                  </button>
              }
            </div>
            {!editandoFecha ? (
              <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ color: darkMode ? "#64748B" : "#475569", fontSize: 12 }}>
                  📅 {ticket.fechaInicio
                    ? new Date(ticket.fechaInicio).toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
                    : <span style={{ color: darkMode ? "#334155" : "#94A3B8" }}>Sin fecha</span>}
                  {ticket.horaInicio && <span style={{ color: darkMode ? "#94A3B8" : "#334155" }}> · {ticket.horaInicio}</span>}
                </span>
                {ticket.duracion && <span style={{ color: darkMode ? "#64748B" : "#475569", fontSize: 12 }}>⏱️ {ticket.duracion}</span>}
                {!ticket.fechaInicio && !ticket.duracion && <span style={{ color: darkMode ? "#334155" : "#94A3B8", fontSize: 12 }}>Sin fecha ni duración definidas</span>}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="form-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", color: darkMode ? "#64748B" : "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Fecha inicio</label>
                    <input type="date" style={{ ...inp, colorScheme: "dark", fontSize: 12 }}
                      value={editFecha} onChange={e => setEditFecha(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: darkMode ? "#64748B" : "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Hora inicio</label>
                    <input type="time" style={{ ...inp, colorScheme: "dark", fontSize: 12 }}
                      value={editHora} onChange={e => setEditHora(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: darkMode ? "#64748B" : "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Duración</label>
                    <select style={{ ...inp, fontSize: 12 }} value={editDuracion} onChange={e => setEditDuracion(e.target.value)}>
                      <option value="">Sin definir</option>
                      <option value="30min">30 minutos</option>
                      <option value="1h">1 hora</option>
                      <option value="2h">2 horas</option>
                      <option value="4h">4 horas</option>
                      <option value="1 día">1 día</option>
                      <option value="2 días">2 días</option>
                      <option value="3 días">3 días</option>
                      <option value="1 semana">1 semana</option>
                      <option value="2 semanas">2 semanas</option>
                      <option value="1 mes">1 mes</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={guardarFecha}
                    style={{ ...btnS, background: "#3182CE", color: "#fff", fontWeight: 800, fontSize: 12 }}>
                    ✓ Guardar cambios
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Editar acopio de materiales — todos los roles */}
        {puedeAccion && !["Cancelado"].includes(ticket.estado) && (
          <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: 14, marginBottom: 14, border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editandoAcopio ? 12 : 0 }}>
              <p style={{ margin: 0, color: "#93C5FD", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>📦 Acopio de materiales</p>
              {!editandoAcopio
                ? <button onClick={() => setEditandoAcopio(true)} style={{ ...btnS, background: darkMode ? "#2E3A55" : "#CBD5E1", color: "#93C5FD", fontSize: 11, padding: "5px 12px" }}>✏️ Editar</button>
                : <button onClick={() => setEditandoAcopio(false)} style={{ ...btnS, background: "transparent", color: darkMode ? "#475569" : "#64748B", fontSize: 11, padding: "5px 12px" }}>Cancelar</button>
              }
            </div>
            {!editandoAcopio ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                {ticket.acopio === null || ticket.acopio === undefined
                  ? <span style={{ color: darkMode ? "#334155" : "#94A3B8", fontSize: 12 }}>Sin definir</span>
                  : <span style={{ background: ticket.acopio ? "#38A16922" : "#E53E3E22", color: ticket.acopio ? "#38A169" : "#E53E3E", border: `1px solid ${ticket.acopio ? "#38A16955" : "#E53E3E55"}`, borderRadius: 4, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                      {ticket.acopio ? "✅ Sí" : "❌ No"}
                    </span>
                }
                {ticket.acopio && ticket.materiales && <span style={{ color: darkMode ? "#64748B" : "#475569", fontSize: 12 }}>· {ticket.materiales}</span>}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {[{ val: true, label: "✅ Sí", color: "#38A169" }, { val: false, label: "❌ No", color: "#E53E3E" }].map(({ val, label, color }) => (
                    <button key={String(val)} type="button"
                      onClick={() => { setEditAcopio(val); if (!val) setEditMateriales(""); }}
                      style={{ fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "8px 22px", borderRadius: 6, border: `2px solid ${editAcopio === val ? color : darkMode ? "#2E3A55" : "#CBD5E1"}`, cursor: "pointer", background: editAcopio === val ? color + "22" : darkMode ? "#0D1424" : "#FFFFFF", color: editAcopio === val ? color : "#64748B" }}>
                      {label}
                    </button>
                  ))}
                </div>
                {editAcopio === true && (
                  <textarea
                    style={{ ...inp, resize: "vertical", minHeight: 70, fontSize: 12 }}
                    value={editMateriales}
                    onChange={e => setEditMateriales(e.target.value)}
                    placeholder="Lista de materiales necesarios..." />
                )}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={guardarAcopio} style={{ ...btnS, background: "#3182CE", color: "#fff", fontWeight: 800, fontSize: 12 }}>✓ Guardar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Asignar — solo encargado de empresa destino */}
        {esEncargadoDest && !["Completado", "Cancelado"].includes(ticket.estado) && (
          <div style={{ background: "#1A2C45", borderRadius: 8, padding: 14, marginBottom: 14, border: "1px solid #2E4A70" }}>
            <p style={{ margin: "0 0 10px", color: "#93C5FD", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
              Asignar trabajadores de {miEmpresa?.nombre}
            </p>
            {misTrabs.length === 0
              ? <p style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 13, margin: "0 0 12px" }}>No hay trabajadores en tu empresa.</p>
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                  {misTrabs.map(u => {
                    const marcado = seleccionados.includes(u.id);
                    const col = miEmpresa?.color || "#3182CE";
                    return (
                      <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 7, background: marcado ? col + "22" : darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${marcado ? col + "66" : darkMode ? "#1E293B" : "#E2E8F0"}`, cursor: "pointer" }}>
                        <input type="checkbox" checked={marcado} onChange={() => toggleSel(u.id)} style={{ accentColor: col, width: 15, height: 15 }} />
                        <Avatar nombre={u.nombre} color={col} size={24} />
                        <span style={{ color: marcado ? "#E2E8F0" : "#94A3B8", fontSize: 13, fontWeight: marcado ? 700 : 400, flex: 1 }}>{u.nombre}</span>
                        {marcado && <span style={{ color: col, fontSize: 12 }}>✓</span>}
                      </label>
                    );
                  })}
                </div>
              )
            }
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: darkMode ? "#64748B" : "#475569", fontSize: 12 }}>{seleccionados.length} seleccionado{seleccionados.length !== 1 ? "s" : ""}</span>
              <button onClick={asignar} disabled={seleccionados.length === 0}
                style={{ ...btnS, background: seleccionados.length > 0 ? "#3182CE" : darkMode ? "#1E293B" : "#E2E8F0", color: seleccionados.length > 0 ? "#fff" : "#475569" }}>
                Confirmar asignación
              </button>
            </div>
          </div>
        )}

        {/* Asignación directa Comercial — solo quien creó el ticket */}
        {empresasDestino.includes(6) && esCreadoPor && !["Completado", "Cancelado"].includes(ticket.estado) && (() => {
          const trabsComercial = USUARIOS.filter(u => u.empresaId === 6);
          const asignadosComercial = asignaciones[6] || [];
          const col = "#E53E3E";
          const asignarComercial = (nuevos) => {
            const nuevasAsig = { ...asignaciones, 6: nuevos };
            onActualizar({
              ...ticket,
              asignacionesPorEmpresa: nuevasAsig,
              estado: nuevos.length > 0 && ticket.estado === "Pendiente" ? "Asignado" : ticket.estado,
              fechaAsignacion: ticket.fechaAsignacion || new Date().toISOString(),
            });
          };
          return (
            <div style={{ background: "#2A1A1A", borderRadius: 8, padding: 14, marginBottom: 14, border: `1px solid ${col}33` }}>
              <p style={{ margin: "0 0 10px", color: col, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                🎯 Asignación directa — Comercial
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                {trabsComercial.map(u => {
                  const marcado = asignadosComercial.includes(u.id);
                  return (
                    <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 7, background: marcado ? col + "22" : darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${marcado ? col + "66" : darkMode ? "#1E293B" : "#E2E8F0"}`, cursor: "pointer" }}>
                      <input type="checkbox" checked={marcado}
                        onChange={() => {
                          const nuevos = marcado
                            ? asignadosComercial.filter(id => id !== u.id)
                            : [...asignadosComercial, u.id];
                          asignarComercial(nuevos);
                        }}
                        style={{ accentColor: col, width: 15, height: 15 }} />
                      <Avatar nombre={u.nombre} color={col} size={24} />
                      <span style={{ color: marcado ? "#E2E8F0" : "#94A3B8", fontSize: 13, fontWeight: marcado ? 700 : 400, flex: 1 }}>{u.nombre}</span>
                      {marcado && <span style={{ color: col, fontSize: 12 }}>✓</span>}
                    </label>
                  );
                })}
              </div>
              <p style={{ margin: 0, color: darkMode ? "#64748B" : "#475569", fontSize: 11 }}>
                {asignadosComercial.length} persona{asignadosComercial.length !== 1 ? "s" : ""} asignada{asignadosComercial.length !== 1 ? "s" : ""} — la asignación se guarda automáticamente
              </p>
            </div>
          );
        })()}

        {/* Cambiar estado — flujo ordenado con permisos */}
        {!["Completado", "Cancelado"].includes(ticket.estado) && (() => {
          const puedeCancelar  = esEncargadoDest || esCreadoPor || esDirector;
          const puedeAvanzar   = esEncargadoDest || esAsignado  || esDirector;
          const estadoActual   = ticket.estado;
          const puedeProgreso  = puedeAvanzar && estadoActual === "Asignado";
          // Trabajador y encargado pueden completar desde Asignado o En progreso
          const puedeCompletar = puedeAvanzar && (estadoActual === "En progreso" || estadoActual === "Asignado");

          // Comprobar si la empresa del usuario ya marcó completado
          const miEmpresaId         = usuarioActual.empresaId;
          const yaCompleteMiEmpresa = (ticket.completadoPorEmpresa || {})[miEmpresaId] === true;
          const hayVariasEmpresas   = (ticket.empresasDestino || []).length > 1;
          const labelCompletar      = hayVariasEmpresas
            ? (yaCompleteMiEmpresa ? "✓ Tu empresa ya completó" : "✓ Completar mi parte")
            : "✓ Completado";

          if (!puedeAvanzar && !puedeCancelar) return null;
          return (
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {puedeProgreso && (
                <button onClick={() => cambiarEstado("En progreso")} style={{ ...btnS, background: "#D4A01722", color: "#D4A017", border: "1px solid #D4A01755" }}>▶ En progreso</button>
              )}
              {puedeCompletar && !yaCompleteMiEmpresa && (
                <button onClick={() => cambiarEstado("Completado")} style={{ ...btnS, background: "#38A16922", color: "#38A169", border: "1px solid #38A16955" }}>{labelCompletar}</button>
              )}
              {puedeCompletar && yaCompleteMiEmpresa && (
                <span style={{ ...btnS, background: "#38A16911", color: "#38A16988", border: "1px solid #38A16933", cursor: "default" }}>{labelCompletar}</span>
              )}
              {puedeCancelar && (
                <button onClick={() => cambiarEstado("Cancelado")} style={{ ...btnS, background: "#E53E3E22", color: "#E53E3E", border: "1px solid #E53E3E55" }}>✕ Cancelar</button>
              )}
            </div>
          );
        })()}

        {/* Comentarios */}
        <div>
          <p style={{ margin: "0 0 10px", color: darkMode ? "#64748B" : "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
            Comentarios ({ticket.comentarios.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12, maxHeight: 200, overflowY: "auto" }}>
            {ticket.comentarios.length === 0
              ? <p style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 13, margin: 0 }}>Sin comentarios aún.</p>
              : ticket.comentarios.map(c => {
                  const autor = USUARIOS.find(u => u.id === c.autorId);
                  const col   = EMPRESAS.find(e => e.id === autor?.empresaId)?.color || "#666";
                  return (
                    <div key={c.id} style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: 10, display: "flex", gap: 10 }}>
                      {autor && <Avatar nombre={autor.nombre} color={col} size={26} />}
                      <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 3 }}>
                          <span style={{ color: "#CBD5E1", fontSize: 12, fontWeight: 700 }}>{autor?.nombre}</span>
                          <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 11 }}>{fmtFecha(c.fecha)}</span>
                        </div>
                        {c.texto && <p style={{ margin: 0, color: darkMode ? "#94A3B8" : "#334155", fontSize: 13, lineHeight: 1.5 }}>{c.texto}</p>}
                        {c.adjuntos?.length > 0 && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                            {c.adjuntos.map((a, ai) => a.tipo?.startsWith("image/")
                              ? <a key={ai} href={a.dataUrl} target="_blank" rel="noreferrer"><img src={a.dataUrl} alt={a.nombre} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 6, border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, cursor: "zoom-in" }} /></a>
                              : <a key={ai} href={a.dataUrl} download={a.nombre} style={{ display: "flex", alignItems: "center", gap: 5, background: darkMode ? "#0D1424" : "#FFFFFF", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 6, padding: "5px 10px", color: "#93C5FD", fontSize: 11, textDecoration: "none" }}>📄 {a.nombre}</a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
            }
          </div>
          {adjuntos.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {adjuntos.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 6, padding: "4px 8px" }}>
                  <span style={{ fontSize: 12 }}>{a.tipo?.startsWith("image/") ? "🖼️" : "📄"}</span>
                  <span style={{ color: darkMode ? "#94A3B8" : "#334155", fontSize: 11 }}>{a.nombre}</span>
                  <button onClick={() => setAdjuntos(p => p.filter((_,idx) => idx !== i))} style={{ background: "none", border: "none", color: darkMode ? "#475569" : "#64748B", cursor: "pointer", fontSize: 13, lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inp, flex: 1 }} value={comentario} onChange={e => setComentario(e.target.value)}
              placeholder="Escribe un comentario..." onKeyDown={e => e.key === "Enter" && enviarComentario()} />
            <label style={{ ...btnS, background: darkMode ? "#1A2235" : "#F8FAFC", color: darkMode ? "#64748B" : "#475569", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }} title="Adjuntar archivo">
              📎
              <input type="file" accept="image/*,.pdf" multiple onChange={handleAdjuntos} style={{ display: "none" }} />
            </label>
            <button onClick={enviarComentario} style={{ ...btnS, background: accentColor, color: "#fff", fontWeight: 800, flexShrink: 0 }}>Enviar</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── TARJETA TICKET ───────────────────────────────────────────────────────────
function TarjetaTicket({ ticket, onClick }) {
  const darkMode = __darkMode;
  const empresasDestino   = ticket.empresasDestino || [];
  const asignaciones      = ticket.asignacionesPorEmpresa || {};
  const todosAsignadosIds = Object.values(asignaciones).flat();
  const asignadosArr      = USUARIOS.filter(u => todosAsignadosIds.includes(u.id));
  const empOrigen         = EMPRESAS.find(e => e.id === ticket.empresaOrigenId);

  // ── Lógica de fecha límite ──
  const completado    = ["Completado", "Cancelado"].includes(ticket.estado);
  const hoy           = new Date(); hoy.setHours(0, 0, 0, 0);
  const limiteDate    = ticket.fechaLimite ? new Date(ticket.fechaLimite + "T00:00:00") : null;
  const vencido       = !completado && limiteDate && limiteDate < hoy;
  const venceHoy      = !completado && limiteDate && limiteDate.getTime() === hoy.getTime();
  const venceProximo  = !completado && limiteDate && limiteDate > hoy && (limiteDate - hoy) <= 2 * 24 * 60 * 60 * 1000;
  const alertaLimite  = vencido || venceHoy;

  return (
    <div onClick={onClick}
      style={{
        background:   darkMode ? "#111827" : "#FFFFFF",
        border:       alertaLimite ? "1px solid #E53E3E" : `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`,
        borderRadius: 10,
        padding:      "16px 18px",
        cursor:       "pointer",
        transition:   alertaLimite ? "none" : "border-color .15s, transform .15s",
        animation:    alertaLimite ? "parpadeo 1.6s ease-in-out infinite" : "none",
      }}
      onMouseEnter={e => { if (!alertaLimite) { e.currentTarget.style.borderColor = (empOrigen?.color || "#3182CE") + "66"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={e => { if (!alertaLimite) { e.currentTarget.style.borderColor = darkMode ? "#1E293B" : "#E2E8F0"; e.currentTarget.style.transform = "none"; } }}>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
          <EmpresaTag empresaId={ticket.empresaOrigenId} />
          <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 12 }}>→</span>
          {empresasDestino.map(id => <EmpresaTag key={id} empresaId={id} />)}
        </div>
        {vencido    && <span style={{ background: "#E53E3E", color: "#fff", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 800, letterSpacing: .4 }}>⚠️ VENCIDO</span>}
        {venceHoy   && !vencido && <span style={{ background: "#E53E3E22", color: "#E53E3E", border: "1px solid #E53E3E88", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 800 }}>🔴 VENCE HOY</span>}
        {venceProximo && !venceHoy && <span style={{ background: "#D4A01722", color: "#D4A017", border: "1px solid #D4A01788", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>⏰ Vence pronto</span>}
      </div>

      <p style={{ margin: "0 0 10px", color: darkMode ? "#E2E8F0" : "#0F172A", fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{ticket.titulo}</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <Badge texto={ticket.estado}    color={ESTADO_COLORES[ticket.estado]}        small />
        <Badge texto={ticket.prioridad} color={PRIORIDAD_COLORES[ticket.prioridad]}  small />
        <Badge texto={ticket.categoria} color="#475569"                               small />
      </div>

      {(ticket.fechaInicio || ticket.ubicacion) && (
        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          {ticket.fechaInicio && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: darkMode ? "#64748B" : "#475569", fontSize: 11 }}>
              <span>📅</span>
              {new Date(ticket.fechaInicio).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
              {ticket.horaInicio && ` · ${ticket.horaInicio}`}
              {ticket.duracion && <span style={{ color: darkMode ? "#475569" : "#64748B" }}> ({ticket.duracion})</span>}
            </span>
          )}
          {ticket.ubicacion && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: darkMode ? "#64748B" : "#475569", fontSize: 11 }}>
              <span>📍</span>
              <span style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ticket.ubicacion}</span>
            </span>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          {asignadosArr.slice(0, 3).map((u, i) => {
            const col = EMPRESAS.find(e => e.id === u.empresaId)?.color || "#666";
            return (
              <div key={u.id} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 3 - i, border: "2px solid #111827", borderRadius: "50%" }}>
                <Avatar nombre={u.nombre} color={col} size={26} />
              </div>
            );
          })}
          {asignadosArr.length > 3 && (
            <div style={{ marginLeft: -8, width: 26, height: 26, borderRadius: "50%", background: darkMode ? "#1E293B" : "#E2E8F0", border: "2px solid #111827", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? "#64748B" : "#475569", fontSize: 10, fontWeight: 700 }}>
              +{asignadosArr.length - 3}
            </div>
          )}
          {asignadosArr.length === 0 && <span style={{ color: darkMode ? "#334155" : "#94A3B8", fontSize: 11 }}>Sin asignar</span>}
        </div>
        <span style={{ color: darkMode ? "#334155" : "#94A3B8", fontSize: 11 }}>{fmtFecha(ticket.fecha)}</span>
      </div>

      {/* Barra de progreso con checks */}
      {(() => {
        const estado = ticket.estado;
        const completado  = estado === "Completado";
        const enProgreso  = estado === "En progreso";
        const asignado    = estado === "Asignado" || enProgreso || completado;
        const colAsignado   = "#3182CE";
        const colProgreso   = "#DD6B20";
        const colCompletado = "#38A169";
        const colActivo     = completado ? colCompletado : enProgreso ? colProgreso : asignado ? colAsignado : "#475569";

        const Check = ({ activo, color }) => (
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: activo ? color + "22" : darkMode ? "#1A2235" : "#F8FAFC",
            border: `2px solid ${activo ? color : darkMode ? "#2E3A55" : "#CBD5E1"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .3s"
          }}>
            {activo && <span style={{ color, fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
          </div>
        );

        const Line = ({ activo, color }) => (
          <div style={{ flex: 1, height: 2, borderRadius: 1, background: activo ? color : darkMode ? "#2E3A55" : "#CBD5E1", transition: "all .3s" }} />
        );

        return (
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #1E293B22" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {/* Check 1: Creado — siempre activo */}
              <Check activo={true} color={colActivo} />
              <Line activo={asignado} color={enProgreso || completado ? (completado ? colCompletado : colProgreso) : colAsignado} />
              {/* Check 2: Asignado */}
              <Check activo={asignado} color={enProgreso || completado ? (completado ? colCompletado : colProgreso) : colAsignado} />
              <Line activo={enProgreso || completado} color={completado ? colCompletado : colProgreso} />
              {/* Check 3: En progreso */}
              <Check activo={enProgreso || completado} color={completado ? colCompletado : colProgreso} />
              <Line activo={completado} color={colCompletado} />
              {/* Check 4: Completado */}
              <Check activo={completado} color={colCompletado} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ color: darkMode ? "#334155" : "#94A3B8", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>Creado</span>
              <span style={{ color: asignado ? (enProgreso || completado ? (completado ? colCompletado : colProgreso) : colAsignado) : darkMode ? "#2E3A55" : "#CBD5E1", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>Asignado</span>
              <span style={{ color: enProgreso || completado ? (completado ? colCompletado : colProgreso) : darkMode ? "#2E3A55" : "#CBD5E1", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>En progreso</span>
              <span style={{ color: completado ? colCompletado : darkMode ? "#2E3A55" : "#CBD5E1", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>Completado</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── CALENDARIO ───────────────────────────────────────────────────────────────
function Calendario({ tickets, ticketsPersonales, usuarioActual, onVerTicket, onVerTicketPersonal }) {
  const darkMode = __darkMode;
  const hoy  = new Date();
  const [mes,  setMes]  = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());

  const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const DIAS  = ["L","M","X","J","V","S","D"];

  // Tickets que aparecen en el calendario:
  // - Deben tener fechaInicio definida
  // - El usuario debe estar asignado (o ser encargado/director)
  const misTickets = tickets.filter(t => {
    if (!t.fechaInicio) return false; // solo tickets con fecha de inicio
    const todosAsignados = Object.values(t.asignacionesPorEmpresa || {}).flat();
    const eds = t.empresasDestino || [];
    return todosAsignados.includes(usuarioActual.id) ||
           (usuarioActual.rol === "encargado" && eds.includes(usuarioActual.empresaId)) ||
           usuarioActual.rol === "director" ||
           t.creadoPor === usuarioActual.id;
  });

  const ticketsPorDia = useMemo(() => {
    const mapa = {};
    misTickets.forEach(t => {
      const d = new Date(t.fechaInicio); // usar fechaInicio
      const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!mapa[k]) mapa[k] = [];
      mapa[k].push({ ...t, _personal: false });
    });
    (ticketsPersonales || []).forEach(t => {
      if (!t.fecha) return;
      const d = new Date(t.fecha);
      const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!mapa[k]) mapa[k] = [];
      mapa[k].push({ ...t, _personal: true });
    });
    return mapa;
  }, [misTickets, ticketsPersonales]);

  const primerDia = new Date(anio, mes, 1);
  const ultimoDia = new Date(anio, mes + 1, 0);
  let inicio = primerDia.getDay() - 1;
  if (inicio < 0) inicio = 6;

  const celdas = [];
  for (let i = 0; i < inicio; i++) celdas.push(null);
  for (let d = 1; d <= ultimoDia.getDate(); d++) celdas.push(d);
  while (celdas.length % 7 !== 0) celdas.push(null);

  const irMes = (dir) => {
    if (dir === -1) { if (mes === 0) { setMes(11); setAnio(a => a-1); } else setMes(m => m-1); }
    else            { if (mes === 11) { setMes(0); setAnio(a => a+1); } else setMes(m => m+1); }
  };

  const esteMes = misTickets.filter(t => {
    const d = new Date(t.fechaInicio);
    return d.getMonth() === mes && d.getFullYear() === anio;
  }).length;

  return (
    <div style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>
        <button onClick={() => irMes(-1)} style={{ background: darkMode ? "#1A2235" : "#F8FAFC", border: "none", color: darkMode ? "#94A3B8" : "#334155", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 18 }}>‹</button>
        <h3 style={{ margin: 0, color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 800, fontSize: 15 }}>{MESES[mes]} {anio}</h3>
        <button onClick={() => irMes(1)}  style={{ background: darkMode ? "#1A2235" : "#F8FAFC", border: "none", color: darkMode ? "#94A3B8" : "#334155", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 18 }}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: darkMode ? "#0D1424" : "#FFFFFF" }}>
        {DIAS.map(d => <div key={d} style={{ textAlign: "center", padding: "8px 0", color: darkMode ? "#475569" : "#64748B", fontSize: 11, fontWeight: 700 }}>{d}</div>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, background: darkMode ? "#1E293B" : "#E2E8F0" }}>
        {celdas.map((dia, i) => {
          if (!dia) return <div key={i} style={{ background: darkMode ? "#0D1424" : "#FFFFFF", minHeight: 80 }} />;
          const k = `${anio}-${mes}-${dia}`;
          const tHoy = ticketsPorDia[k] || [];
          const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear();
          return (
            <div key={i} style={{ background: darkMode ? "#111827" : "#FFFFFF", minHeight: 80, padding: "6px 4px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: esHoy ? "#E53E3E" : "transparent", color: esHoy ? "#fff" : "#64748B", fontSize: 12, fontWeight: esHoy ? 800 : 400, marginBottom: 4 }}>{dia}</span>
              {tHoy.slice(0, 3).map(t => {
                if (t._personal) {
                  const hecho = t.estado === "hecho";
                  return (
                    <div key={t.id} onClick={() => onVerTicketPersonal && onVerTicketPersonal(t)}
                      style={{ background: hecho ? "#FFFFFF18" : "#FFFFFF11", border: `1px solid ${hecho ? "#FFFFFF55" : "#FFFFFF33"}`, borderRadius: 3, padding: "2px 5px", cursor: "pointer", marginBottom: 2 }}
                      title={t.titulo}>
                      <p style={{ margin: 0, color: darkMode ? "#E2E8F0" : "#0F172A", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {hecho ? "✓ " : "📝 "}{t.titulo}
                      </p>
                    </div>
                  );
                }
                const emp = EMPRESAS.find(e => e.id === t.empresaOrigenId);
                const completado = t.estado === "Completado";
                const color = completado ? "#38A169" : (emp?.color || "#3182CE");
                return (
                  <div key={t.id} onClick={() => onVerTicket(t)}
                    style={{ background: color + (completado ? "33" : "22"), border: `1px solid ${color}${completado ? "88" : "44"}`, borderRadius: 3, padding: "2px 5px", cursor: "pointer", marginBottom: 2 }}
                    title={t.titulo}>
                    <p style={{ margin: 0, color, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {completado ? "✓ " : ""}{t.titulo}
                    </p>
                  </div>
                );
              })}
              {tHoy.length > 3 && <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 10 }}>+{tHoy.length - 3} más</p>}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "12px 16px", borderTop: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>
        <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 11 }}>Este mes: <strong style={{ color: darkMode ? "#94A3B8" : "#334155" }}>{esteMes}</strong> ticket{esteMes !== 1 ? "s" : ""} con fecha de inicio</span>
      </div>
    </div>
  );
}


// ─── REPORTES ─────────────────────────────────────────────────────────────────
function Reportes({ tickets, usuarioActual }) {
  const darkMode = __darkMode;
  const [empresaFiltro, setEmpresaFiltro] = useState("todas");
  const [mesFiltro, setMesFiltro]         = useState("todos");

  const completados = tickets.filter(t => t.estado === "Completado");

  // Meses disponibles
  const mesesDisponibles = [...new Set(completados.map(t => {
    const d = new Date(t.fecha);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  }))].sort().reverse();

  const ticketsFiltrados = completados.filter(t => {
    const eds = t.empresasDestino || [];
    if (empresaFiltro !== "todas" && t.empresaOrigenId !== Number(empresaFiltro) && !eds.includes(Number(empresaFiltro))) return false;
    if (mesFiltro !== "todos") {
      const d = new Date(t.fecha);
      const m = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      if (m !== mesFiltro) return false;
    }
    return true;
  });

  const generarPDF = () => {
    if (ticketsFiltrados.length === 0) return;

    // Usamos la API de impresión del navegador con una ventana nueva
    const empFiltroNombre = empresaFiltro === "todas"
      ? "Todas las empresas"
      : EMPRESAS.find(e => e.id === Number(empresaFiltro))?.nombre || "";

    const mesFiltroNombre = mesFiltro === "todos"
      ? "Todos los meses"
      : new Date(mesFiltro + "-01").toLocaleDateString("es-ES", { month: "long", year: "numeric" });

    const ahora = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });

    const filas = ticketsFiltrados.map(t => {
      const origen  = EMPRESAS.find(e => e.id === t.empresaOrigenId)?.nombre || "-";
      const destinos = (t.empresasDestino || []).map(id => EMPRESAS.find(e => e.id === id)?.nombre).filter(Boolean).join(", ") || "-";
      const creador  = USUARIOS.find(u => u.id === t.creadoPor)?.nombre || "-";
      const asignados = Object.values(t.asignacionesPorEmpresa || {}).flat()
        .map(id => USUARIOS.find(u => u.id === id)?.nombre).filter(Boolean).join(", ") || "Sin asignar";
      const fecha = t.fechaInicio
        ? new Date(t.fechaInicio).toLocaleDateString("es-ES") + (t.horaInicio ? " " + t.horaInicio : "")
        : new Date(t.fecha).toLocaleDateString("es-ES");
      const comentariosTexto = (t.comentarios || []).map(c => {
        const autor = USUARIOS.find(u => u.id === c.autorId)?.nombre || "?";
        return `${autor}: ${c.texto}`;
      }).join(" | ") || "-";

      const acopioTexto = t.acopio === true
        ? `<span style="background:#c6f6d5;color:#276749;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">✓ Sí</span>${t.materiales ? `<br><span style="font-size:10px;color:#4a5568;font-style:italic">${t.materiales}</span>` : ""}`
        : t.acopio === false
          ? `<span style="background:#fed7d7;color:#c53030;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">✗ No</span>`
          : `<span style="color:#a0aec0;font-size:11px">-</span>`;

      return `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;font-weight:600;color:#1a202c">${t.titulo}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#4a5568">${origen}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#4a5568">${destinos}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#4a5568">${fecha}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#4a5568">${t.duracion || "-"}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#4a5568">${t.ubicacion || "-"}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#4a5568">${t.categoria}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0"><span style="background:${t.prioridad==="Urgente"?"#fed7d7":t.prioridad==="Alta"?"#feebc8":t.prioridad==="Media"?"#fefcbf":"#c6f6d5"};color:${t.prioridad==="Urgente"?"#c53030":t.prioridad==="Alta"?"#c05621":t.prioridad==="Media"?"#b7791f":"#276749"};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">${t.prioridad}</span></td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#4a5568;font-size:11px">${acopioTexto}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#4a5568;font-size:11px">${asignados}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#718096;font-size:11px;max-width:200px">${comentariosTexto}</td>
        </tr>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Tickets — Grupo</title>
  <style>
    @page { size: A4 landscape; margin: 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a202c; font-size: 12px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px solid #2d3748; }
    .logo { font-size: 22px; font-weight: 900; color: #2d3748; }
    .logo span { color: #e53e3e; }
    .meta { text-align: right; color: #718096; font-size: 11px; }
    .meta strong { display: block; font-size: 14px; color: #2d3748; margin-bottom: 4px; }
    .filtros { background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 16px; margin-bottom: 20px; display: flex; gap: 24px; }
    .filtro-item { font-size: 11px; color: #718096; }
    .filtro-item strong { color: #2d3748; display: block; font-size: 12px; }
    .resumen { display: flex; gap: 12px; margin-bottom: 20px; }
    .stat { background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 16px; flex: 1; text-align: center; }
    .stat .num { font-size: 28px; font-weight: 900; color: #2d3748; }
    .stat .lbl { font-size: 10px; color: #718096; text-transform: uppercase; letter-spacing: .5px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #2d3748; }
    thead th { padding: 10px 8px; color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; text-align: left; white-space: nowrap; }
    tbody tr:nth-child(even) { background: #f7fafc; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; color: #a0aec0; font-size: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">🏢 Grupo<span>Tickets</span></div>
      <div style="color:#718096;font-size:12px;margin-top:4px">Reporte de trabajos completados</div>
    </div>
    <div class="meta">
      <strong>Reporte generado el ${ahora}</strong>
      <span>Por: ${USUARIOS.find(u=>u.id===usuarioActual.id)?.nombre || "Sistema"}</span>
    </div>
  </div>

  <div class="filtros">
    <div class="filtro-item"><strong>Empresa</strong>${empFiltroNombre}</div>
    <div class="filtro-item"><strong>Período</strong>${mesFiltroNombre}</div>
    <div class="filtro-item"><strong>Total tickets</strong>${ticketsFiltrados.length} completados</div>
  </div>

  <div class="resumen">
    <div class="stat"><div class="num">${ticketsFiltrados.length}</div><div class="lbl">Tickets completados</div></div>
    <div class="stat"><div class="num">${[...new Set(ticketsFiltrados.map(t=>t.empresaOrigenId))].length}</div><div class="lbl">Empresas origen</div></div>
    <div class="stat"><div class="num">${[...new Set(ticketsFiltrados.flatMap(t=>t.empresasDestino||[]))].length}</div><div class="lbl">Empresas destino</div></div>
    <div class="stat"><div class="num">${[...new Set(Object.values(ticketsFiltrados.reduce((a,t)=>({...a,...(t.asignacionesPorEmpresa||{})}),{})).flat())].length}</div><div class="lbl">Trabajadores involucrados</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Título</th>
        <th>Origen</th>
        <th>Destino(s)</th>
        <th>Fecha/Hora</th>
        <th>Duración</th>
        <th>Ubicación</th>
        <th>Categoría</th>
        <th>Prioridad</th>
        <th>Acopio</th>
        <th>Trabajadores</th>
        <th>Comentarios</th>
      </tr>
    </thead>
    <tbody>${filas}</tbody>
  </table>

  <div class="footer">
    <span>Grupo Tickets — Documento confidencial</span>
    <span>Total: ${ticketsFiltrados.length} trabajos completados</span>
  </div>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    const ventana = window.open("", "_blank");
    ventana.document.write(html);
    ventana.document.close();
  };

  const empColor = EMPRESAS.find(e => e.id === usuarioActual.empresaId)?.color || "#94A3B8";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 800, fontSize: 18 }}>📄 Reportes de facturación</h2>
          <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 13 }}>Genera PDFs con los tickets completados para facturación</p>
        </div>
        <button onClick={generarPDF} disabled={ticketsFiltrados.length === 0}
          style={{ ...btnS, background: ticketsFiltrados.length > 0 ? "#38A169" : darkMode ? "#1E293B" : "#E2E8F0", color: ticketsFiltrados.length > 0 ? "#fff" : "#475569", fontSize: 13, padding: "10px 20px", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          ⬇ Descargar PDF {ticketsFiltrados.length > 0 ? `(${ticketsFiltrados.length})` : ""}
        </button>
      </div>

      {/* FILTROS */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={labelS}>Filtrar por empresa</label>
          <select style={{ ...inp, background: darkMode ? "#111827" : "#FFFFFF" }} value={empresaFiltro} onChange={e => setEmpresaFiltro(e.target.value)}>
            <option value="todas">Todas las empresas</option>
            {EMPRESAS.filter(e => e.id !== 0).map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={labelS}>Filtrar por mes</label>
          <select style={{ ...inp, background: darkMode ? "#111827" : "#FFFFFF" }} value={mesFiltro} onChange={e => setMesFiltro(e.target.value)}>
            <option value="todos">Todos los meses</option>
            {mesesDisponibles.map(m => {
              const [anio, mes] = m.split("-");
              const nombre = new Date(Number(anio), Number(mes)-1, 1).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
              return <option key={m} value={m}>{nombre.charAt(0).toUpperCase() + nombre.slice(1)}</option>;
            })}
          </select>
        </div>
      </div>

      {/* RESUMEN STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          ["Completados", ticketsFiltrados.length, "#38A169", "✅"],
          ["Empresas origen", [...new Set(ticketsFiltrados.map(t=>t.empresaOrigenId))].length, "#3182CE", "🏢"],
          ["Empresas destino", [...new Set(ticketsFiltrados.flatMap(t=>t.empresasDestino||[]))].length, "#805AD5", "📦"],
          ["Trabajadores", [...new Set(ticketsFiltrados.flatMap(t=>Object.values(t.asignacionesPorEmpresa||{}).flat()))].length, "#D4A017", "👷"],
        ].map(([l,v,c,ic]) => (
          <div key={l} style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: c+"22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{ic}</div>
            <div>
              <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{l}</p>
              <p style={{ margin: "2px 0 0", color: c, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{v}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLA PREVIA */}
      {ticketsFiltrados.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: darkMode ? "#111827" : "#FFFFFF", borderRadius: 12, border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: darkMode ? "#475569" : "#64748B" }}>No hay tickets completados con este filtro</p>
          <p style={{ fontSize: 13, color: darkMode ? "#334155" : "#94A3B8" }}>Completa algún ticket o cambia los filtros</p>
        </div>
      ) : (
        <div style={{ background: darkMode ? "#111827" : "#FFFFFF", borderRadius: 12, border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: darkMode ? "#94A3B8" : "#334155", fontSize: 13, fontWeight: 700 }}>Vista previa del reporte</span>
            <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 12 }}>{ticketsFiltrados.length} ticket{ticketsFiltrados.length !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: darkMode ? "#0D1424" : "#FFFFFF" }}>
                  {["Título","Origen","Destino(s)","Fecha","Duración","Ubicación","Categoría","Prioridad","Trabajadores"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", color: darkMode ? "#64748B" : "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ticketsFiltrados.map((t, idx) => {
                  const origen   = EMPRESAS.find(e => e.id === t.empresaOrigenId);
                  const destinos = (t.empresasDestino||[]).map(id => EMPRESAS.find(e=>e.id===id)).filter(Boolean);
                  const asignados = Object.values(t.asignacionesPorEmpresa||{}).flat()
                    .map(id => USUARIOS.find(u=>u.id===id)?.nombre).filter(Boolean);
                  const fecha = t.fechaInicio
                    ? new Date(t.fechaInicio).toLocaleDateString("es-ES") + (t.horaInicio ? " "+t.horaInicio : "")
                    : new Date(t.fecha).toLocaleDateString("es-ES");
                  return (
                    <tr key={t.id} style={{ borderBottom: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, background: idx % 2 === 0 ? "transparent" : "#0D142488" }}>
                      <td style={{ padding: "10px 12px", color: darkMode ? "#E2E8F0" : "#0F172A", fontSize: 12, fontWeight: 600, maxWidth: 160 }}>{t.titulo}</td>
                      <td style={{ padding: "10px 12px" }}><EmpresaTag empresaId={t.empresaOrigenId} /></td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {destinos.map(e => <EmpresaTag key={e.id} empresaId={e.id} />)}
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px", color: darkMode ? "#94A3B8" : "#334155", fontSize: 12, whiteSpace: "nowrap" }}>{fecha}</td>
                      <td style={{ padding: "10px 12px", color: darkMode ? "#94A3B8" : "#334155", fontSize: 12 }}>{t.duracion || <span style={{color:"#334155"}}>—</span>}</td>
                      <td style={{ padding: "10px 12px", color: darkMode ? "#94A3B8" : "#334155", fontSize: 12, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.ubicacion || <span style={{color:"#334155"}}>—</span>}</td>
                      <td style={{ padding: "10px 12px" }}><Badge texto={t.categoria} color="#475569" small /></td>
                      <td style={{ padding: "10px 12px" }}><Badge texto={t.prioridad} color={PRIORIDAD_COLORES[t.prioridad]} small /></td>
                      <td style={{ padding: "10px 12px", color: darkMode ? "#94A3B8" : "#334155", fontSize: 11, maxWidth: 160 }}>
                        {asignados.length > 0 ? asignados.join(", ") : <span style={{color:"#334155"}}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
// ─── MODAL MIS TICKETS ────────────────────────────────────────────────────────
function ModalMisTickets({ usuarioId, tickets, onClose, onCrear, onVerDetalle }) {
  const darkMode = __darkMode;
  const [creando, setCreando] = useState(false);
  const [titulo, setTitulo]   = useState("");
  const [desc, setDesc]       = useState("");
  const [fecha, setFecha]     = useState("");
  const [hora, setHora]       = useState("");
  const [alerta, setAlerta]   = useState(false);

  const inp2 = { fontFamily: "inherit", fontSize: 13, background: darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 6, padding: "9px 12px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none", width: "100%", boxSizing: "border-box" };

  const pendientes = tickets.filter(t => t.estado !== "hecho");
  const hechos     = tickets.filter(t => t.estado === "hecho");

  const submit = () => {
    if (!titulo.trim()) return;
    const fechaAlerta = fecha && hora ? `${fecha}T${hora}` : fecha ? `${fecha}T09:00` : null;
    onCrear({
      id: genId(),
      titulo: titulo.trim(),
      descripcion: desc,
      fecha: fecha ? new Date(fecha).toISOString() : new Date().toISOString(),
      alerta,
      fechaAlerta,
      estado: "pendiente",
      creadoPor: usuarioId,
    });
    setTitulo(""); setDesc(""); setFecha(""); setHora(""); setAlerta(false); setCreando(false);
  };

  return (
    <div className="modal-overlay" style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" }}>
      <div className="modal-box" style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 14, width: "100%", maxWidth: 520, padding: 28, boxShadow: "0 24px 80px #0008", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: darkMode ? "#E2E8F0" : "#0F172A" }}>📝 Mis Tickets Personales</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: darkMode ? "#64748B" : "#475569", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>

        {/* Formulario nuevo ticket */}
        {creando ? (
          <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 20, border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}` }}>
            <p style={{ margin: "0 0 12px", color: darkMode ? "#94A3B8" : "#334155", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Nuevo ticket personal</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input style={inp2} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título *" />
              <textarea style={{ ...inp2, resize: "vertical", minHeight: 60 }} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción..." />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", color: darkMode ? "#64748B" : "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Fecha</label>
                  <input type="date" style={{ ...inp2, colorScheme: "dark" }} value={fecha} onChange={e => setFecha(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "block", color: darkMode ? "#64748B" : "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Hora alerta</label>
                  <input type="time" style={{ ...inp2, colorScheme: "dark" }} value={hora} onChange={e => setHora(e.target.value)} />
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={alerta} onChange={e => setAlerta(e.target.checked)} style={{ accentColor: "#3182CE", width: 15, height: 15 }} />
                <span style={{ color: darkMode ? "#94A3B8" : "#334155", fontSize: 13 }}>🔔 Activar notificación en el navegador</span>
              </label>
              {alerta && <p style={{ margin: 0, color: darkMode ? "#64748B" : "#475569", fontSize: 11 }}>⚠️ Asegúrate de tener los permisos de notificación activados en el navegador.</p>}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
              <button onClick={() => setCreando(false)} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: darkMode ? "#1E293B" : "#E2E8F0", color: darkMode ? "#94A3B8" : "#334155" }}>Cancelar</button>
              <button onClick={submit} disabled={!titulo.trim()} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: titulo.trim() ? "#3182CE" : darkMode ? "#1E293B" : "#E2E8F0", color: titulo.trim() ? "#fff" : "#475569" }}>Crear</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setCreando(true)} style={{ fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "9px 18px", borderRadius: 8, border: "1px dashed #2E3A55", cursor: "pointer", background: "transparent", color: darkMode ? "#64748B" : "#475569", width: "100%", marginBottom: 20 }}>
            + Nuevo ticket personal
          </button>
        )}

        {/* Lista pendientes */}
        {pendientes.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: "0 0 8px", color: darkMode ? "#64748B" : "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Pendientes ({pendientes.length})</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pendientes.map(t => (
                <div key={t.id} onClick={() => onVerDetalle(t)} style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1E2D45"}
                  onMouseLeave={e => e.currentTarget.style.background = "#1A2235"}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>📝</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, color: darkMode ? "#E2E8F0" : "#0F172A", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.titulo}</p>
                    {t.fecha && <p style={{ margin: "2px 0 0", color: darkMode ? "#475569" : "#64748B", fontSize: 11 }}>{fmtFecha(t.fecha)}{t.alerta ? " 🔔" : ""}</p>}
                  </div>
                  <span style={{ color: "#718096", fontSize: 11, background: darkMode ? "#111827" : "#FFFFFF", borderRadius: 4, padding: "2px 7px", flexShrink: 0 }}>pendiente</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista hechos */}
        {hechos.length > 0 && (
          <div>
            <p style={{ margin: "0 0 8px", color: darkMode ? "#64748B" : "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>Completados ({hechos.length})</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {hechos.map(t => (
                <div key={t.id} onClick={() => onVerDetalle(t)} style={{ background: darkMode ? "#111827" : "#FFFFFF", borderRadius: 8, padding: "10px 14px", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, opacity: 0.6 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>✅</span>
                  <p style={{ margin: 0, color: darkMode ? "#64748B" : "#475569", fontSize: 13, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textDecoration: "line-through" }}>{t.titulo}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tickets.length === 0 && !creando && (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <p style={{ fontSize: 40, marginBottom: 8 }}>📋</p>
            <p style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 13 }}>No tienes tickets personales aún</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODAL DETALLE MI TICKET ──────────────────────────────────────────────────
function ModalDetalleMiTicket({ ticket, onClose, onActualizar }) {
  const darkMode = __darkMode;
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo]     = useState(ticket.titulo);
  const [desc, setDesc]         = useState(ticket.descripcion || "");

  const marcarHecho = () => onActualizar({ ...ticket, estado: "hecho" });
  const marcarPendiente = () => onActualizar({ ...ticket, estado: "pendiente" });
  const guardar = () => { onActualizar({ ...ticket, titulo: titulo.trim(), descripcion: desc }); setEditando(false); };
  const hecho = ticket.estado === "hecho";

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: 20 }}>
      <div className="modal-box" style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 14, width: "100%", maxWidth: 480, padding: 28, boxShadow: "0 24px 80px #0008" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ flex: 1, marginRight: 12 }}>
            <span style={{ background: hecho ? "#38A16922" : "#71809622", color: hecho ? "#38A169" : "#718096", border: `1px solid ${hecho ? "#38A16955" : "#71809655"}`, borderRadius: 4, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>
              {hecho ? "✓ Hecho" : "⏳ Pendiente"}
            </span>
            {!editando
              ? <h2 style={{ margin: "8px 0 0", fontSize: 17, fontWeight: 800, color: darkMode ? "#E2E8F0" : "#0F172A" }}>{ticket.titulo}</h2>
              : <input style={{ fontFamily: "inherit", fontSize: 15, fontWeight: 700, background: darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 6, padding: "7px 10px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none", width: "100%", marginTop: 8, boxSizing: "border-box" }} value={titulo} onChange={e => setTitulo(e.target.value)} />
            }
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: darkMode ? "#64748B" : "#475569", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>

        {ticket.fecha && <p style={{ margin: "0 0 12px", color: darkMode ? "#475569" : "#64748B", fontSize: 12 }}>📅 {fmtFecha(ticket.fecha)}{ticket.alerta ? "  🔔 Con notificación" : ""}</p>}

        {!editando
          ? ticket.descripcion && <div style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: 14, marginBottom: 16 }}><p style={{ margin: 0, color: darkMode ? "#94A3B8" : "#334155", fontSize: 13, lineHeight: 1.7 }}>{ticket.descripcion}</p></div>
          : <textarea style={{ fontFamily: "inherit", fontSize: 13, background: darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 6, padding: "9px 12px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 80, marginBottom: 16 }} value={desc} onChange={e => setDesc(e.target.value)} />
        }

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
          {editando
            ? <><button onClick={() => setEditando(false)} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: darkMode ? "#1E293B" : "#E2E8F0", color: darkMode ? "#94A3B8" : "#334155" }}>Cancelar</button>
                <button onClick={guardar} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "#3182CE", color: "#fff" }}>Guardar</button></>
            : <><button onClick={() => setEditando(true)} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: darkMode ? "#1E293B" : "#E2E8F0", color: darkMode ? "#94A3B8" : "#334155" }}>✏️ Editar</button>
                {hecho
                  ? <button onClick={marcarPendiente} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: darkMode ? "#1E293B" : "#E2E8F0", color: darkMode ? "#94A3B8" : "#334155" }}>↩️ Marcar pendiente</button>
                  : <button onClick={marcarHecho} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: "#38A169", color: "#fff" }}>✅ Marcar como hecho</button>
                }</>
          }
        </div>
      </div>
    </div>
  );
}

// ─── MODAL ADMINISTRACIÓN ─────────────────────────────────────────────────────
function ModalAdministracion({ onClose }) {
  const darkMode = __darkMode;
  const [tab, setTab] = useState("empresas");

  // ── Estado local reactivo ──
  const [empresas,    setEmpresas]    = useState(() => JSON.parse(JSON.stringify(EMPRESAS)));
  const [usuarios,    setUsuarios]    = useState(() => JSON.parse(JSON.stringify(USUARIOS)));
  const [categorias,  setCategorias]  = useState(() => [...CATEGORIAS]);
  const [estados,     setEstados]     = useState(() => [...ESTADOS]);

  // ── Forms ──
  const [formEmp,  setFormEmp]  = useState(null); // null | {id,nombre,color,inicial} | "nueva"
  const [formUser, setFormUser] = useState(null);
  const [formCat,  setFormCat]  = useState(null);
  const [formEst,  setFormEst]  = useState(null);

  const inp2  = { fontFamily:"inherit", fontSize:13, background:"#0D1424", border:"1px solid #2E3A55", borderRadius:6, padding:"8px 11px", color:"#E2E8F0", outline:"none", width:"100%", boxSizing:"border-box" };
  const label2 = { display:"block", color:"#64748B", fontSize:10, fontWeight:700, textTransform:"uppercase", marginBottom:4 };
  const btnPri = { fontFamily:"inherit", fontSize:12, fontWeight:700, padding:"8px 16px", borderRadius:6, border:"none", cursor:"pointer", background:"#3182CE", color:"#fff" };
  const btnSec = { fontFamily:"inherit", fontSize:12, fontWeight:700, padding:"8px 16px", borderRadius:6, border:"none", cursor:"pointer", background:"#1E293B", color:"#94A3B8" };
  const btnDel = { fontFamily:"inherit", fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:5, border:"none", cursor:"pointer", background:"#E53E3E22", color:"#E53E3E" };

  const persistConfig = async (key, value) => {
    try { await setDoc(doc(db, "config", key), { value: JSON.stringify(value) }); } catch {}
  };

  // ════ EMPRESAS ════
  const guardarEmpresa = () => {
    if (!formEmp?.nombre?.trim()) return;
    let nuevas;
    if (formEmp.id === "nueva") {
      const newId = Math.max(...empresas.map(e => e.id)) + 1;
      const nueva = { id: newId, nombre: formEmp.nombre.trim(), color: formEmp.color || "#94A3B8", inicial: formEmp.nombre.trim().slice(0,2).toUpperCase() };
      nuevas = [...empresas, nueva];
      EMPRESAS.push(nueva);
    } else {
      nuevas = empresas.map(e => e.id === formEmp.id ? { ...e, nombre: formEmp.nombre.trim(), color: formEmp.color, inicial: formEmp.nombre.trim().slice(0,2).toUpperCase() } : e);
      const idx = EMPRESAS.findIndex(e => e.id === formEmp.id);
      if (idx >= 0) EMPRESAS[idx] = { ...EMPRESAS[idx], nombre: formEmp.nombre.trim(), color: formEmp.color, inicial: formEmp.nombre.trim().slice(0,2).toUpperCase() };
    }
    setEmpresas(nuevas);
    persistConfig("empresas", nuevas);
    setFormEmp(null);
  };

  const eliminarEmpresa = (id) => {
    if (!window.confirm("¿Eliminar esta empresa? Los tickets existentes no se verán afectados.")) return;
    const nuevas = empresas.filter(e => e.id !== id);
    const idx = EMPRESAS.findIndex(e => e.id === id);
    if (idx >= 0) EMPRESAS.splice(idx, 1);
    setEmpresas(nuevas);
    persistConfig("empresas", nuevas);
  };

  // ════ USUARIOS ════
  const guardarUsuario = () => {
    if (!formUser?.nombre?.trim()) return;
    let nuevos;
    if (formUser.id === "nuevo") {
      const newId = Math.max(...usuarios.map(u => u.id)) + 1;
      const nuevo = { id: newId, nombre: formUser.nombre.trim(), empresaId: Number(formUser.empresaId), rol: formUser.rol || "trabajador", activo: true };
      nuevos = [...usuarios, nuevo];
      USUARIOS.push(nuevo);
      // PIN por defecto
      PINS_DEFAULT[newId] = "1234";
    } else {
      nuevos = usuarios.map(u => u.id === formUser.id ? { ...u, nombre: formUser.nombre.trim(), empresaId: Number(formUser.empresaId), rol: formUser.rol, activo: formUser.activo } : u);
      const idx = USUARIOS.findIndex(u => u.id === formUser.id);
      if (idx >= 0) USUARIOS[idx] = { ...USUARIOS[idx], ...formUser, empresaId: Number(formUser.empresaId) };
    }
    setUsuarios(nuevos);
    persistConfig("usuarios", nuevos);
    setFormUser(null);
  };

  const toggleActivo = (id) => {
    const nuevos = usuarios.map(u => u.id === id ? { ...u, activo: u.activo === false ? true : false } : u);
    const idx = USUARIOS.findIndex(u => u.id === id);
    if (idx >= 0) USUARIOS[idx].activo = USUARIOS[idx].activo === false ? true : false;
    setUsuarios(nuevos);
    persistConfig("usuarios", nuevos);
  };

  const eliminarUsuario = (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    const nuevos = usuarios.filter(u => u.id !== id);
    const idx = USUARIOS.findIndex(u => u.id === id);
    if (idx >= 0) USUARIOS.splice(idx, 1);
    setUsuarios(nuevos);
    persistConfig("usuarios", nuevos);
  };

  // ════ CATEGORÍAS ════
  const guardarCategoria = () => {
    if (!formCat?.valor?.trim()) return;
    let nuevas;
    if (formCat._esNueva) {
      nuevas = [...categorias, formCat.valor.trim()];
      CATEGORIAS.push(formCat.valor.trim());
    } else {
      nuevas = categorias.map(c => c === formCat._original ? formCat.valor : c);
      const idx = CATEGORIAS.indexOf(formCat._original);
      if (idx >= 0) CATEGORIAS[idx] = formCat.valor;
    }
    setCategorias(nuevas);
    persistConfig("categorias", nuevas);
    setFormCat(null);
  };

  const eliminarCategoria = (cat) => {
    if (!window.confirm(`¿Eliminar categoría "${cat}"?`)) return;
    const nuevas = categorias.filter(c => c !== cat);
    const idx = CATEGORIAS.indexOf(cat);
    if (idx >= 0) CATEGORIAS.splice(idx, 1);
    setCategorias(nuevas);
    persistConfig("categorias", nuevas);
  };

  // ════ ESTADOS ════
  const guardarEstado = () => {
    if (!formEst?.valor?.trim()) return;
    let nuevos;
    if (formEst._esNuevo) {
      nuevos = [...estados, formEst.valor.trim()];
      ESTADOS.push(formEst.valor.trim());
    } else {
      nuevos = estados.map(e => e === formEst._original ? formEst.valor.trim() : e);
      const idx = ESTADOS.indexOf(formEst._original);
      if (idx >= 0) ESTADOS[idx] = formEst.valor.trim();
    }
    setEstados(nuevos);
    persistConfig("estados", nuevos);
    setFormEst(null);
  };

  const eliminarEstado = (est) => {
    if (!window.confirm(`¿Eliminar estado "${est}"?`)) return;
    const nuevos = estados.filter(e => e !== est);
    const idx = ESTADOS.indexOf(est);
    if (idx >= 0) ESTADOS.splice(idx, 1);
    setEstados(nuevos);
    persistConfig("estados", nuevos);
  };

  const TABS = [["empresas","🏢 Empresas"],["usuarios","👥 Usuarios"],["categorias","🏷️ Categorías"],["estados","📊 Estados"]];
  const ROLES = ["trabajador","encargado","director","administrador"];
  const COLORES_PRESET = ["#E53E3E","#D4A017","#2B6CB0","#805AD5","#276749","#38A169","#E53E3E","#94A3B8","#DD6B20","#0BC5EA"];

  return (
    <div style={{ position:"fixed", inset:0, background:"#00000099", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:2000, padding:20, overflowY:"auto" }}>
      <div style={{ background:"#0D1424", border:"1px solid #2E3A55", borderRadius:16, width:"100%", maxWidth:720, padding:0, boxShadow:"0 24px 80px #0009", margin:"auto", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 28px", borderBottom:"1px solid #1E293B", background:"#111827" }}>
          <h2 style={{ margin:0, fontSize:18, fontWeight:900, color:"#E2E8F0" }}>⚙️ Administración</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748B", fontSize:24, cursor:"pointer" }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:"1px solid #1E293B", background:"#111827" }}>
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); setFormEmp(null); setFormUser(null); setFormCat(null); setFormEst(null); }}
              style={{ fontFamily:"inherit", flex:1, padding:"12px 0", border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                background: tab === key ? "#0D1424" : "transparent",
                color: tab === key ? "#E2E8F0" : "#475569",
                borderBottom: tab === key ? "2px solid #3182CE" : "2px solid transparent" }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding:24, maxHeight:"70vh", overflowY:"auto" }}>

          {/* ── EMPRESAS ── */}
          {tab === "empresas" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <p style={{ margin:0, color:"#64748B", fontSize:12 }}>{empresas.length} empresa{empresas.length !== 1 ? "s" : ""}</p>
                <button onClick={() => setFormEmp({ id:"nueva", nombre:"", color:"#94A3B8", inicial:"" })} style={{ ...btnPri, fontSize:11 }}>+ Nueva empresa</button>
              </div>

              {formEmp && (
                <div style={{ background:"#111827", borderRadius:10, padding:16, marginBottom:16, border:"1px solid #3182CE55" }}>
                  <p style={{ margin:"0 0 14px", color:"#93C5FD", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{formEmp.id === "nueva" ? "Nueva empresa" : "Editar empresa"}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <div><label style={label2}>Nombre</label><input style={inp2} value={formEmp.nombre} onChange={e => setFormEmp(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre de la empresa" /></div>
                    <div>
                      <label style={label2}>Color</label>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                        {COLORES_PRESET.map(c => (
                          <div key={c} onClick={() => setFormEmp(f => ({ ...f, color: c }))}
                            style={{ width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer", border: formEmp.color === c ? "3px solid #fff" : "2px solid transparent" }} />
                        ))}
                        <input type="color" value={formEmp.color} onChange={e => setFormEmp(f => ({ ...f, color: e.target.value }))}
                          style={{ width:28, height:28, borderRadius:"50%", border:"none", cursor:"pointer", background:"none", padding:0 }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:14 }}>
                    <button onClick={() => setFormEmp(null)} style={btnSec}>Cancelar</button>
                    <button onClick={guardarEmpresa} style={btnPri}>Guardar</button>
                  </div>
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {empresas.map(emp => (
                  <div key={emp.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"#111827", borderRadius:8, border:"1px solid #1E293B" }}>
                    <div style={{ width:14, height:14, borderRadius:"50%", background:emp.color, flexShrink:0 }} />
                    <span style={{ color:"#E2E8F0", fontSize:13, fontWeight:600, flex:1 }}>{emp.nombre}</span>
                    <span style={{ color:"#475569", fontSize:11, background:"#1E293B", borderRadius:4, padding:"2px 7px" }}>{emp.inicial}</span>
                    <button onClick={() => setFormEmp({ ...emp })} style={{ ...btnSec, padding:"5px 10px", fontSize:11 }}>✏️ Editar</button>
                    {emp.id !== 0 && <button onClick={() => eliminarEmpresa(emp.id)} style={btnDel}>🗑️</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USUARIOS ── */}
          {tab === "usuarios" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <p style={{ margin:0, color:"#64748B", fontSize:12 }}>{usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}</p>
                <button onClick={() => setFormUser({ id:"nuevo", nombre:"", empresaId:1, rol:"trabajador", activo:true })} style={{ ...btnPri, fontSize:11 }}>+ Nuevo usuario</button>
              </div>

              {formUser && (
                <div style={{ background:"#111827", borderRadius:10, padding:16, marginBottom:16, border:"1px solid #3182CE55" }}>
                  <p style={{ margin:"0 0 14px", color:"#93C5FD", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{formUser.id === "nuevo" ? "Nuevo usuario" : "Editar usuario"}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <div style={{ gridColumn:"1/-1" }}><label style={label2}>Nombre completo</label><input style={inp2} value={formUser.nombre} onChange={e => setFormUser(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre y apellidos" /></div>
                    <div>
                      <label style={label2}>Empresa</label>
                      <select style={{ ...inp2 }} value={formUser.empresaId} onChange={e => setFormUser(f => ({ ...f, empresaId: e.target.value }))}>
                        {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={label2}>Rol</label>
                      <select style={{ ...inp2 }} value={formUser.rol} onChange={e => setFormUser(f => ({ ...f, rol: e.target.value }))}>
                        {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:14 }}>
                    <button onClick={() => setFormUser(null)} style={btnSec}>Cancelar</button>
                    <button onClick={guardarUsuario} style={btnPri}>Guardar</button>
                  </div>
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {usuarios.map(u => {
                  const emp = empresas.find(e => e.id === u.empresaId);
                  const activo = u.activo !== false;
                  return (
                    <div key={u.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#111827", borderRadius:8, border:"1px solid #1E293B", opacity: activo ? 1 : 0.5 }}>
                      <Avatar nombre={u.nombre} color={emp?.color || "#94A3B8"} size={30} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ margin:0, color: activo ? "#E2E8F0" : "#64748B", fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{u.nombre}</p>
                        <p style={{ margin:0, color:"#475569", fontSize:11 }}>{emp?.nombre} · <span style={{ color: u.rol === "director" ? "#F6AD55" : u.rol === "administrador" ? "#805AD5" : u.rol === "encargado" ? "#3182CE" : "#475569" }}>{u.rol}</span></p>
                      </div>
                      <button onClick={() => toggleActivo(u.id)} style={{ ...btnSec, padding:"4px 9px", fontSize:10 }}>{activo ? "🟢 Activo" : "🔴 Inactivo"}</button>
                      <button onClick={() => setFormUser({ ...u })} style={{ ...btnSec, padding:"5px 10px", fontSize:11 }}>✏️</button>
                      {u.id !== 0 && <button onClick={() => eliminarUsuario(u.id)} style={btnDel}>🗑️</button>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CATEGORÍAS ── */}
          {tab === "categorias" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <p style={{ margin:0, color:"#64748B", fontSize:12 }}>{categorias.length} categoría{categorias.length !== 1 ? "s" : ""}</p>
                <button onClick={() => setFormCat({ _esNueva:true, valor:"" })} style={{ ...btnPri, fontSize:11 }}>+ Nueva categoría</button>
              </div>

              {formCat && (
                <div style={{ background:"#111827", borderRadius:10, padding:16, marginBottom:16, border:"1px solid #3182CE55" }}>
                  <p style={{ margin:"0 0 10px", color:"#93C5FD", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{formCat._esNueva ? "Nueva categoría" : "Editar categoría"}</p>
                  <input style={inp2} value={formCat.valor} onChange={e => setFormCat(f => ({ ...f, valor: e.target.value }))} placeholder="Nombre de la categoría" />
                  <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:12 }}>
                    <button onClick={() => setFormCat(null)} style={btnSec}>Cancelar</button>
                    <button onClick={guardarCategoria} style={btnPri}>Guardar</button>
                  </div>
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {categorias.map((cat, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#111827", borderRadius:8, border:"1px solid #1E293B" }}>
                    <span style={{ fontSize:16 }}>🏷️</span>
                    <span style={{ color:"#E2E8F0", fontSize:13, fontWeight:600, flex:1 }}>{cat}</span>
                    <button onClick={() => setFormCat({ _esNueva:false, _original:cat, valor:cat })} style={{ ...btnSec, padding:"5px 10px", fontSize:11 }}>✏️ Editar</button>
                    <button onClick={() => eliminarCategoria(cat)} style={btnDel}>🗑️</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ESTADOS ── */}
          {tab === "estados" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <p style={{ margin:0, color:"#64748B", fontSize:12 }}>{estados.length} estado{estados.length !== 1 ? "s" : ""}</p>
                <button onClick={() => setFormEst({ _esNuevo:true, valor:"" })} style={{ ...btnPri, fontSize:11 }}>+ Nuevo estado</button>
              </div>

              {formEst && (
                <div style={{ background:"#111827", borderRadius:10, padding:16, marginBottom:16, border:"1px solid #3182CE55" }}>
                  <p style={{ margin:"0 0 10px", color:"#93C5FD", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{formEst._esNuevo ? "Nuevo estado" : "Editar estado"}</p>
                  <input style={inp2} value={formEst.valor} onChange={e => setFormEst(f => ({ ...f, valor: e.target.value }))} placeholder="Nombre del estado" />
                  <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:12 }}>
                    <button onClick={() => setFormEst(null)} style={btnSec}>Cancelar</button>
                    <button onClick={guardarEstado} style={btnPri}>Guardar</button>
                  </div>
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {estados.map((est, i) => {
                  const col = ESTADO_COLORES[est] || "#64748B";
                  return (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#111827", borderRadius:8, border:"1px solid #1E293B" }}>
                      <span style={{ width:10, height:10, borderRadius:"50%", background:col, flexShrink:0 }} />
                      <span style={{ color:"#E2E8F0", fontSize:13, fontWeight:600, flex:1 }}>{est}</span>
                      <Badge texto={est} color={col} small />
                      <button onClick={() => setFormEst({ _esNuevo:false, _original:est, valor:est })} style={{ ...btnSec, padding:"5px 10px", fontSize:11 }}>✏️ Editar</button>
                      <button onClick={() => eliminarEstado(est)} style={btnDel}>🗑️</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ModalComunicado({ darkMode, usuarioId, empresaId, onClose, comunicadoInicial }) {
  const esEdicion = Boolean(comunicadoInicial);

  const [titulo,         setTitulo]         = useState(comunicadoInicial?.titulo        || "");
  const [cuerpo,         setCuerpo]         = useState(comunicadoInicial?.cuerpo        || "");
  const [fechaCaducidad, setFechaCaducidad] = useState(comunicadoInicial?.fechaCaducidad || "");
  const [adjuntoPDF,     setAdjuntoPDF]     = useState(comunicadoInicial?.adjuntoPDF    || null);
  const [cargandoPDF,    setCargandoPDF]    = useState(false);

  // ── Destinatarios ──
  const [tipoDestinatario, setTipoDestinatario] = useState(comunicadoInicial?.destinatarios?.tipo || "todos");
  const [empresasSel,      setEmpresasSel]      = useState(comunicadoInicial?.destinatarios?.empresaIds || []);
  const [usuariosSel,      setUsuariosSel]      = useState(comunicadoInicial?.destinatarios?.usuarioIds || []);
  const [filtroUsuario,    setFiltroUsuario]     = useState("");

  const toggleEmpresa = (id) => setEmpresasSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleUsuario = (id) => setUsuariosSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // Seleccionar todos los usuarios de una empresa de golpe
  const toggleEmpresaUsuarios = (empId) => {
    const idsEmp = USUARIOS.filter(u => u.empresaId === empId).map(u => u.id);
    const todosYa = idsEmp.every(id => usuariosSel.includes(id));
    if (todosYa) setUsuariosSel(prev => prev.filter(id => !idsEmp.includes(id)));
    else         setUsuariosSel(prev => [...new Set([...prev, ...idsEmp])]);
  };

  const handlePDF = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Solo se permiten archivos PDF."); return; }
    if (file.size > 5 * 1024 * 1024)    { alert("El archivo no puede superar los 5 MB."); return; }
    setCargandoPDF(true);
    const r = new FileReader();
    r.onload  = () => { setAdjuntoPDF({ nombre: file.name, dataUrl: r.result }); setCargandoPDF(false); };
    r.onerror = () => { alert("Error al leer el archivo."); setCargandoPDF(false); };
    r.readAsDataURL(file);
  };

  const canPublicar = titulo.trim() && !cargandoPDF &&
    (tipoDestinatario === "todos" ||
    (tipoDestinatario === "empresas" && empresasSel.length > 0) ||
    (tipoDestinatario === "usuarios" && usuariosSel.length > 0));

  const enviar = async () => {
    if (!canPublicar) return;
    const destinatarios = tipoDestinatario === "todos"
      ? { tipo: "todos" }
      : tipoDestinatario === "empresas"
        ? { tipo: "empresas", empresaIds: empresasSel }
        : { tipo: "usuarios", usuarioIds: usuariosSel };

    if (esEdicion) {
      // Editar comunicado existente — preservar id, autor y fecha original
      await setDoc(doc(db, "comunicados", comunicadoInicial.id), {
        ...comunicadoInicial,
        titulo:         titulo.trim(),
        cuerpo:         cuerpo.trim() || null,
        fechaCaducidad: fechaCaducidad || null,
        adjuntoPDF:     adjuntoPDF || null,
        destinatarios,
        fechaEditado:   new Date().toISOString(),
      });
    } else {
      // Crear comunicado nuevo
      const id = String(Date.now());
      await setDoc(doc(db, "comunicados", id), {
        id,
        titulo:         titulo.trim(),
        cuerpo:         cuerpo.trim() || null,
        autorId:        usuarioId,
        empresaId:      empresaId,
        fecha:          new Date().toISOString(),
        fechaCaducidad: fechaCaducidad || null,
        adjuntoPDF:     adjuntoPDF || null,
        destinatarios,
      });
    }
    onClose();
  };

  const overlay = { position:"fixed", inset:0, background:"#00000088", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16 };
  const box     = { background: darkMode ? "#111827" : "#FFFFFF", borderRadius:14, width:"100%", maxWidth:520, padding:24, boxShadow:"0 24px 60px #0008", maxHeight:"90vh", overflowY:"auto" };
  const inp     = { width:"100%", padding:"9px 12px", background: darkMode ? "#1A2235" : "#F8FAFC", border:`1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius:8, color: darkMode ? "#E2E8F0" : "#0F172A", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" };
  const labelS  = { display:"block", color: darkMode ? "#64748B" : "#475569", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:5 };
  const tabBtn  = (activo) => ({ padding:"6px 14px", borderRadius:7, border:`1px solid ${activo ? "#3182CE" : (darkMode ? "#2E3A55" : "#CBD5E1")}`, background: activo ? "#3182CE22" : "transparent", color: activo ? "#3182CE" : (darkMode ? "#64748B" : "#475569"), fontSize:12, fontWeight: activo ? 700 : 400, cursor:"pointer" });

  const usuariosFiltrados = USUARIOS.filter(u =>
    !filtroUsuario || u.nombre.toLowerCase().includes(filtroUsuario.toLowerCase())
  );

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={box}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ margin:0, color: darkMode ? "#E2E8F0" : "#0F172A", fontSize:16, fontWeight:800 }}>{esEdicion ? "✏️ Editar comunicado" : "💬 Nuevo comunicado"}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color: darkMode ? "#475569" : "#64748B", cursor:"pointer", fontSize:20 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Título */}
          <div>
            <label style={labelS}>Título *</label>
            <input style={inp} placeholder="Ej: Reunión el viernes a las 10h" value={titulo} onChange={e => setTitulo(e.target.value)} maxLength={120} />
          </div>

          {/* Mensaje */}
          <div>
            <label style={labelS}>Mensaje (opcional)</label>
            <textarea style={{ ...inp, minHeight:90, resize:"vertical" }} placeholder="Detalle del comunicado..." value={cuerpo} onChange={e => setCuerpo(e.target.value)} maxLength={600} />
          </div>

          {/* ── DESTINATARIOS ── */}
          <div>
            <label style={labelS}>👥 Destinatarios</label>
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              <button style={tabBtn(tipoDestinatario === "todos")}    onClick={() => setTipoDestinatario("todos")}>🌐 Todos</button>
              <button style={tabBtn(tipoDestinatario === "empresas")} onClick={() => setTipoDestinatario("empresas")}>🏢 Por empresa</button>
              <button style={tabBtn(tipoDestinatario === "usuarios")} onClick={() => setTipoDestinatario("usuarios")}>👤 Por usuario</button>
            </div>

            {/* Selector por empresa */}
            {tipoDestinatario === "empresas" && (
              <div style={{ display:"flex", flexDirection:"column", gap:6, background: darkMode ? "#0F172A" : "#F8FAFC", borderRadius:8, padding:10, border:`1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>
                {EMPRESAS.map(emp => (
                  <label key={emp.id} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"4px 6px", borderRadius:6, background: empresasSel.includes(emp.id) ? (darkMode ? "#1A2235" : "#EFF6FF") : "transparent" }}>
                    <input type="checkbox" checked={empresasSel.includes(emp.id)} onChange={() => toggleEmpresa(emp.id)} style={{ accentColor: emp.color }} />
                    <span style={{ width:10, height:10, borderRadius:"50%", background:emp.color, flexShrink:0 }} />
                    <span style={{ color: darkMode ? "#E2E8F0" : "#0F172A", fontSize:13, fontWeight: empresasSel.includes(emp.id) ? 700 : 400 }}>{emp.nombre}</span>
                  </label>
                ))}
                {empresasSel.length === 0 && <p style={{ margin:0, color:"#E53E3E", fontSize:11 }}>Selecciona al menos una empresa.</p>}
              </div>
            )}

            {/* Selector por usuario */}
            {tipoDestinatario === "usuarios" && (
              <div style={{ background: darkMode ? "#0F172A" : "#F8FAFC", borderRadius:8, padding:10, border:`1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>
                {/* Buscador */}
                <input style={{ ...inp, marginBottom:8, fontSize:12, padding:"7px 10px" }} placeholder="🔍 Buscar usuario..." value={filtroUsuario} onChange={e => setFiltroUsuario(e.target.value)} />
                {/* Agrupados por empresa */}
                <div style={{ maxHeight:200, overflowY:"auto", display:"flex", flexDirection:"column", gap:10 }}>
                  {EMPRESAS.map(emp => {
                    const usrsEmp = usuariosFiltrados.filter(u => u.empresaId === emp.id);
                    if (usrsEmp.length === 0) return null;
                    const todosEmpSel = usrsEmp.every(u => usuariosSel.includes(u.id));
                    return (
                      <div key={emp.id}>
                        {/* Cabecera empresa — seleccionar todos */}
                        <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginBottom:4, paddingBottom:4, borderBottom:`1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>
                          <input type="checkbox" checked={todosEmpSel} onChange={() => toggleEmpresaUsuarios(emp.id)} style={{ accentColor: emp.color }} />
                          <span style={{ width:8, height:8, borderRadius:"50%", background:emp.color }} />
                          <span style={{ color: emp.color, fontSize:11, fontWeight:800, textTransform:"uppercase" }}>{emp.nombre}</span>
                          <span style={{ color: darkMode ? "#475569" : "#94A3B8", fontSize:10 }}>({usrsEmp.length})</span>
                        </label>
                        {/* Usuarios de la empresa */}
                        <div style={{ display:"flex", flexDirection:"column", gap:3, paddingLeft:16 }}>
                          {usrsEmp.map(u => (
                            <label key={u.id} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"3px 6px", borderRadius:5, background: usuariosSel.includes(u.id) ? (darkMode ? "#1A2235" : "#EFF6FF") : "transparent" }}>
                              <input type="checkbox" checked={usuariosSel.includes(u.id)} onChange={() => toggleUsuario(u.id)} style={{ accentColor: emp.color }} />
                              <span style={{ color: darkMode ? "#E2E8F0" : "#0F172A", fontSize:12, fontWeight: usuariosSel.includes(u.id) ? 700 : 400 }}>{u.nombre}</span>
                              <span style={{ color: darkMode ? "#475569" : "#94A3B8", fontSize:10, marginLeft:"auto" }}>{u.rol}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {usuariosSel.length > 0 && (
                  <p style={{ margin:"8px 0 0", color:"#38A169", fontSize:11, fontWeight:700 }}>✓ {usuariosSel.length} usuario{usuariosSel.length > 1 ? "s" : ""} seleccionado{usuariosSel.length > 1 ? "s" : ""}</p>
                )}
                {usuariosSel.length === 0 && <p style={{ margin:"8px 0 0", color:"#E53E3E", fontSize:11 }}>Selecciona al menos un usuario.</p>}
              </div>
            )}
          </div>

          {/* Fecha caducidad */}
          <div>
            <label style={labelS}>📅 Fecha de caducidad (opcional)</label>
            <input type="date" style={{ ...inp, colorScheme:"dark" }} value={fechaCaducidad} onChange={e => setFechaCaducidad(e.target.value)} min={new Date().toISOString().split("T")[0]} />
            <p style={{ margin:"4px 0 0", color: darkMode ? "#475569" : "#94A3B8", fontSize:11 }}>Si no indicas fecha, el comunicado permanece hasta que lo elimines manualmente.</p>
          </div>

          {/* Adjunto PDF */}
          <div>
            <label style={labelS}>📎 Adjuntar PDF (opcional, máx. 5 MB)</label>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <label style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", background: darkMode ? "#1A2235" : "#F8FAFC", border:`1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius:8, cursor:"pointer", fontSize:12, color: darkMode ? "#94A3B8" : "#475569" }}>
                {cargandoPDF ? "⏳ Cargando..." : adjuntoPDF ? "🔄 Cambiar PDF" : "📄 Seleccionar PDF"}
                <input type="file" accept="application/pdf" onChange={handlePDF} style={{ display:"none" }} />
              </label>
              {adjuntoPDF && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", background: darkMode ? "#1A223588" : "#EFF6FF", border:`1px solid ${darkMode ? "#2E3A5588" : "#BFDBFE"}`, borderRadius:8, flex:1 }}>
                  <span style={{ fontSize:16 }}>📄</span>
                  <span style={{ color: darkMode ? "#93C5FD" : "#1D4ED8", fontSize:12, fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{adjuntoPDF.nombre}</span>
                  <button onClick={() => setAdjuntoPDF(null)} style={{ background:"none", border:"none", color: darkMode ? "#475569" : "#94A3B8", cursor:"pointer", fontSize:16, lineHeight:1, padding:0, flexShrink:0 }}>×</button>
                </div>
              )}
            </div>
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
            <button onClick={onClose} style={{ padding:"9px 20px", background:"transparent", border:`1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius:8, color: darkMode ? "#64748B" : "#475569", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancelar</button>
            <button onClick={enviar} disabled={!canPublicar} style={{ padding:"9px 20px", background: canPublicar ? "#3182CE" : "#3182CE55", border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:700, cursor: canPublicar ? "pointer" : "default", fontFamily:"inherit" }}>{esEdicion ? "💾 Guardar cambios" : "📤 Publicar"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeccionFichaje({ darkMode, fichajes, fichajeActivo, ficharEntrada, ficharSalida }) {
  const [, forceRender] = useState(0);
  // Re-render every minute to update elapsed time
  useEffect(() => {
    if (!fichajeActivo) return;
    const t = setInterval(() => forceRender(n => n+1), 60000);
    return () => clearInterval(t);
  }, [fichajeActivo]);

  const hoy = new Date().toISOString().split("T")[0];
  const fichajesHoy = fichajes.filter(f => f.fecha === hoy).sort((a,b) => new Date(b.entrada)-new Date(a.entrada));
  const durStr = (ms) => { const h=Math.floor(ms/3600000); const m=Math.floor((ms%3600000)/60000); return h>0?`${h}h ${m}min`:`${m}min`; };
  const duracionMs = fichajeActivo ? Date.now() - new Date(fichajeActivo.entrada).getTime() : 0;

  return (
    <div style={{ maxWidth:640 }}>
      <h2 style={{ margin:"0 0 4px", color: darkMode?"#E2E8F0":"#0F172A", fontWeight:800, fontSize:18 }}>🕐 Fichaje</h2>
      <p style={{ margin:"0 0 24px", color: darkMode?"#475569":"#64748B", fontSize:13 }}>Registra tu entrada y salida del trabajo</p>
      <div style={{ background: darkMode?"#111827":"#FFFFFF", border:`1px solid ${fichajeActivo?"#38A16944":darkMode?"#1E293B":"#E2E8F0"}`, borderRadius:14, padding:24, marginBottom:20, textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:12 }}>{fichajeActivo?"🟢":"🔴"}</div>
        <p style={{ margin:"0 0 6px", color: fichajeActivo?"#38A169":"#E53E3E", fontSize:20, fontWeight:900 }}>
          {fichajeActivo ? "Trabajando" : "Sin fichar"}
        </p>
        {fichajeActivo && (
          <p style={{ margin:"0 0 16px", color: darkMode?"#64748B":"#475569", fontSize:13 }}>
            Desde las {new Date(fichajeActivo.entrada).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})} · {durStr(duracionMs)}
          </p>
        )}
        <button onClick={fichajeActivo ? ficharSalida : ficharEntrada}
          style={{ background: fichajeActivo?"#E53E3E":"#38A169", border:"none", borderRadius:10, padding:"14px 36px", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>
          {fichajeActivo ? "🔴 Registrar salida" : "🟢 Registrar entrada"}
        </button>
      </div>
      <h3 style={{ margin:"0 0 12px", color: darkMode?"#94A3B8":"#475569", fontSize:13, fontWeight:700, textTransform:"uppercase" }}>Registros de hoy</h3>
      {fichajesHoy.length === 0
        ? <p style={{ color: darkMode?"#334155":"#94A3B8", fontSize:13 }}>Sin registros hoy</p>
        : fichajesHoy.map(f => {
            const dur = f.salida ? new Date(f.salida)-new Date(f.entrada) : null;
            return (
              <div key={f.id} style={{ background: darkMode?"#111827":"#FFFFFF", border:`1px solid ${darkMode?"#1E293B":"#E2E8F0"}`, borderRadius:10, padding:"12px 16px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <p style={{ margin:0, color: darkMode?"#E2E8F0":"#0F172A", fontSize:13, fontWeight:700 }}>
                  {new Date(f.entrada).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}
                  {f.salida && <> → {new Date(f.salida).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}</>}
                  {!f.salida && <span style={{ color:"#38A169", marginLeft:8, fontSize:11 }}>● En curso</span>}
                </p>
                {dur && <span style={{ color: darkMode?"#64748B":"#475569", fontSize:12, fontWeight:700 }}>{durStr(dur)}</span>}
              </div>
            );
          })
      }
    </div>
  );
}

function SeccionPerfil({ darkMode, usuarioId, usuario, pins, setPins, empColor, EMPRESAS }) {
  const [pinActual,  setPinActual]  = useState("");
  const [pinNuevo,   setPinNuevo]   = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [msgPin,     setMsgPin]     = useState(null);

  const guardarPin = () => {
    if (pins[usuarioId] !== pinActual)         { setMsgPin({ ok:false, txt:"El PIN actual no es correcto." }); return; }
    if (pinNuevo.length !== 4 || !/^\d+$/.test(pinNuevo)) { setMsgPin({ ok:false, txt:"El nuevo PIN debe tener 4 dígitos." }); return; }
    if (pinNuevo !== pinConfirm)               { setMsgPin({ ok:false, txt:"Los PINs no coinciden." }); return; }
    setPins(p => ({ ...p, [usuarioId]: pinNuevo }));
    setMsgPin({ ok:true, txt:"✅ PIN actualizado correctamente." });
    setPinActual(""); setPinNuevo(""); setPinConfirm("");
  };

  const inp2 = { width:"100%", padding:"9px 12px", background: darkMode?"#1A2235":"#F8FAFC", border:`1px solid ${darkMode?"#2E3A55":"#CBD5E1"}`, borderRadius:8, color: darkMode?"#E2E8F0":"#0F172A", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" };
  const lb   = { display:"block", color: darkMode?"#64748B":"#475569", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:5 };

  return (
    <div style={{ maxWidth:500 }}>
      <h2 style={{ margin:"0 0 4px", color: darkMode?"#E2E8F0":"#0F172A", fontWeight:800, fontSize:18 }}>👤 Mi Perfil</h2>
      <p style={{ margin:"0 0 28px", color: darkMode?"#475569":"#64748B", fontSize:13 }}>Información de tu cuenta</p>
      <div style={{ background: darkMode?"#111827":"#FFFFFF", border:`1px solid ${darkMode?"#1E293B":"#E2E8F0"}`, borderRadius:14, padding:24, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background: empColor+"44", border:`3px solid ${empColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#fff", fontSize:20 }}>
            {usuario?.nombre?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()||"U"}
          </div>
          <div>
            <p style={{ margin:"0 0 4px", color: darkMode?"#E2E8F0":"#0F172A", fontSize:18, fontWeight:800 }}>{usuario?.nombre}</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <span style={{ background: empColor+"33", color: empColor, borderRadius:5, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{usuario?.rol?.toUpperCase()}</span>
              <span style={{ background: darkMode?"#1E293B":"#F1F5F9", color: darkMode?"#94A3B8":"#475569", borderRadius:5, padding:"2px 10px", fontSize:11 }}>{EMPRESAS.find(e=>e.id===usuario?.empresaId)?.nombre}</span>
            </div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[["ID de usuario", usuario?.id],["Empresa", EMPRESAS.find(e=>e.id===usuario?.empresaId)?.nombre],["Rol", usuario?.rol],["Estado","Activo"]].map(([l,v]) => (
            <div key={l} style={{ background: darkMode?"#0F172A":"#F8FAFC", borderRadius:8, padding:"10px 14px" }}>
              <p style={{ margin:"0 0 3px", color: darkMode?"#475569":"#94A3B8", fontSize:10, fontWeight:700, textTransform:"uppercase" }}>{l}</p>
              <p style={{ margin:0, color: darkMode?"#E2E8F0":"#0F172A", fontSize:13, fontWeight:600 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: darkMode?"#111827":"#FFFFFF", border:`1px solid ${darkMode?"#1E293B":"#E2E8F0"}`, borderRadius:14, padding:24 }}>
        <h3 style={{ margin:"0 0 16px", color: darkMode?"#E2E8F0":"#0F172A", fontSize:15, fontWeight:800 }}>🔑 Cambiar PIN</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div><label style={lb}>PIN actual</label><input type="password" maxLength={4} style={inp2} value={pinActual} onChange={e=>setPinActual(e.target.value)} placeholder="••••" /></div>
          <div><label style={lb}>Nuevo PIN (4 dígitos)</label><input type="password" maxLength={4} style={inp2} value={pinNuevo} onChange={e=>setPinNuevo(e.target.value)} placeholder="••••" /></div>
          <div><label style={lb}>Confirmar nuevo PIN</label><input type="password" maxLength={4} style={inp2} value={pinConfirm} onChange={e=>setPinConfirm(e.target.value)} placeholder="••••" /></div>
          {msgPin && <p style={{ margin:0, color: msgPin.ok?"#38A169":"#E53E3E", fontSize:12, fontWeight:700 }}>{msgPin.txt}</p>}
          <button onClick={guardarPin} style={{ background: empColor, border:"none", borderRadius:8, padding:"10px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Guardar PIN</button>
        </div>
      </div>
    </div>
  );
}

function ModalSubirNomina({ darkMode, onClose, onSubir, empColor }) {
  const [usuarioDestId, setUsuarioDestId] = useState(USUARIOS[0]?.id ?? null);
  const [mes,           setMes]           = useState(new Date().getMonth() + 1);
  const [anio,          setAnio]          = useState(new Date().getFullYear());
  const [archivo,       setArchivo]       = useState(null);
  const [cargando,      setCargando]      = useState(false);
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== "application/pdf") { alert("Solo se permiten archivos PDF."); return; }
    if (f.size > 10 * 1024 * 1024)   { alert("El archivo no puede superar los 10 MB."); return; }
    setCargando(true);
    const r = new FileReader();
    r.onload  = () => { setArchivo({ nombre: f.name, dataUrl: r.result }); setCargando(false); };
    r.onerror = () => { alert("Error al leer el archivo."); setCargando(false); };
    r.readAsDataURL(f);
  };

  const subir = async () => {
    if (!archivo || !usuarioDestId) return;
    await onSubir({ usuarioDestinoId: usuarioDestId, mes, anio, nombre: archivo.nombre, dataUrl: archivo.dataUrl });
    onClose();
  };

  const overlay = { position:"fixed", inset:0, background:"#00000088", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16 };
  const box     = { background: darkMode?"#111827":"#FFFFFF", borderRadius:14, width:"100%", maxWidth:460, padding:24, boxShadow:"0 24px 60px #0008" };
  const inp     = { width:"100%", padding:"9px 12px", background: darkMode?"#1A2235":"#F8FAFC", border:`1px solid ${darkMode?"#2E3A55":"#CBD5E1"}`, borderRadius:8, color: darkMode?"#E2E8F0":"#0F172A", fontSize:13, fontFamily:"inherit", boxSizing:"border-box" };
  const lb      = { display:"block", color: darkMode?"#64748B":"#475569", fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:5 };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={box}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ margin:0, color: darkMode?"#E2E8F0":"#0F172A", fontSize:16, fontWeight:800 }}>💰 Subir nómina</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", color: darkMode?"#475569":"#64748B", cursor:"pointer", fontSize:20 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={lb}>Empleado</label>
            <select style={inp} value={usuarioDestId} onChange={e => setUsuarioDestId(Number(e.target.value))}>
              {USUARIOS.map(u => <option key={u.id} value={u.id}>{u.nombre} — {EMPRESAS.find(emp=>emp.id===u.empresaId)?.nombre}</option>)}
            </select>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div>
              <label style={lb}>Mes</label>
              <select style={inp} value={mes} onChange={e => setMes(Number(e.target.value))}>
                {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m,i) => <option key={i} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={lb}>Año</label>
              <input type="number" style={inp} value={anio} onChange={e => setAnio(Number(e.target.value))} min={2020} max={2035} />
            </div>
          </div>
          <div>
            <label style={lb}>📎 Archivo PDF (máx. 10 MB)</label>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <label style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", background: darkMode?"#1A2235":"#F8FAFC", border:`1px solid ${darkMode?"#2E3A55":"#CBD5E1"}`, borderRadius:8, cursor:"pointer", fontSize:12, color: darkMode?"#94A3B8":"#475569" }}>
                {cargando ? "⏳ Cargando..." : archivo ? "🔄 Cambiar PDF" : "📄 Seleccionar PDF"}
                <input type="file" accept="application/pdf" onChange={handleFile} style={{ display:"none" }} />
              </label>
              {archivo && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", background: darkMode?"#1A223588":"#EFF6FF", border:`1px solid ${darkMode?"#2E3A5588":"#BFDBFE"}`, borderRadius:8, flex:1 }}>
                  <span style={{ fontSize:14 }}>📄</span>
                  <span style={{ color: darkMode?"#93C5FD":"#1D4ED8", fontSize:12, fontWeight:600, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{archivo.nombre}</span>
                  <button onClick={() => setArchivo(null)} style={{ background:"none", border:"none", color: darkMode?"#475569":"#94A3B8", cursor:"pointer", fontSize:14, padding:0 }}>×</button>
                </div>
              )}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
            <button onClick={onClose} style={{ padding:"9px 20px", background:"transparent", border:`1px solid ${darkMode?"#2E3A55":"#CBD5E1"}`, borderRadius:8, color: darkMode?"#64748B":"#475569", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancelar</button>
            <button onClick={subir} disabled={!archivo || cargando}
              style={{ padding:"9px 20px", background: archivo&&!cargando ? empColor : empColor+"55", border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:700, cursor: archivo&&!cargando?"pointer":"default", fontFamily:"inherit" }}>
              ⬆️ Subir nómina
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tickets,       setTickets]    = useState([]);
  const [usuarioId,     setUsuarioId]  = useState(() => {
    try { const id = sessionStorage.getItem("grupo_usuario_id"); return id ? Number(id) : null; } catch { return null; }
  });
  const [pins,          setPins]       = useState({...PINS_DEFAULT});
  const [loginUsuarioId, setLoginUsuarioId] = useState("");
  const [loginPin,       setLoginPin]       = useState("");
  const [loginError,     setLoginError]     = useState("");
  const [logueado,       setLogueado]       = useState(() => {
    try { return sessionStorage.getItem("grupo_logueado") === "1"; } catch { return false; }
  });
  const [notifs,        setNotifs]     = useState([]);
  const [verNotifs,     setVerNotifs]  = useState(false);
  const [comunicados,     setComunicados]    = useState([]);
  const [verComunicados,  setVerComunicados]  = useState(false);
  const [modalComun,      setModalComun]      = useState(false);
  const [comunicadoEditar,setComunicadoEditar] = useState(null);
  const [darkMode, setDarkMode] = useState(getDM);
  const toggleTheme = () => setDarkMode(d => {
    const next = !d;
    __darkMode = next;
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
    return next;
  });
  useEffect(() => { __darkMode = darkMode; }, [darkMode]);

  // ── Firebase: config (categorías, estados) en tiempo real ──
  const [, forceUpdate] = useState(0);
  // Callbacks para propagar cambios del admin a toda la app en tiempo real
  const [configVersion, setConfigVersion] = useState(0);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "config"), (snapshot) => {
      let changed = false;
      snapshot.docs.forEach(d => {
        try {
          const val = JSON.parse(d.data().value);
          if (d.id === "categorias" && Array.isArray(val) && val.length > 0) {
            CATEGORIAS.length = 0; val.forEach(v => CATEGORIAS.push(v)); changed = true;
          }
          if (d.id === "estados" && Array.isArray(val) && val.length > 0) {
            ESTADOS.length = 0; val.forEach(v => ESTADOS.push(v)); changed = true;
          }
          if (d.id === "empresas" && Array.isArray(val) && val.length > 0) {
            EMPRESAS.length = 0; val.forEach(v => EMPRESAS.push(v)); changed = true;
          }
          if (d.id === "usuarios" && Array.isArray(val) && val.length > 0) {
            USUARIOS.length = 0; val.forEach(v => USUARIOS.push(v));
            setPins(prev => {
              const updated = { ...prev };
              USUARIOS.forEach(u => { if (!(u.id in updated)) updated[u.id] = "1234"; });
              return updated;
            });
            changed = true;
          }
        } catch {}
      });
      // Incrementar configVersion fuerza re-render en App y re-inicialización del modal
      if (changed) { forceUpdate(n => n + 1); setConfigVersion(v => v + 1); }
    });
    return () => unsub();
  }, []);
  const [modalAdmin,    setModalAdmin] = useState(false);
  const [modalCrear,    setModalCrear] = useState(false);
  const [modalMisTickets, setModalMisTickets] = useState(false);
  const [misTicketsPersonales, setMisTicketsPersonales] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mis_tickets_personales") || "[]"); } catch { return []; }
  });
  const [detalleMiTicket, setDetalleMiTicket] = useState(null);
  const [detalle,       setDetalle]    = useState(null);
  const [filtros,       setFiltros]    = useState({ estado: "todos", empresa: "todas", buscar: "" });
  const [vista,         setVista]      = useState("mis");
  const [seccion,       setSeccion]    = useState("tickets");
  const [sidebarOpen,   setSidebarOpen] = useState(true);   // sidebar visible en escritorio
  const [theme, setTheme]                = useState(() => { try { return localStorage.getItem("app_theme") || "corporativo"; } catch { return "corporativo"; } });
  // ── Fichaje ──
  const [fichajes,      setFichajes]   = useState([]);
  const [fichajeActivo, setFichajeActivo] = useState(null); // { id, entrada }
  // ── Nóminas ──
  const [nominas,       setNominas]    = useState([]);
  const [modalNomina,   setModalNomina] = useState(false);  // solo admin/director
  const [subHistorial,  setSubHistorial] = useState("completados");

  // ── Firebase: tickets en tiempo real ──
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "tickets"),
      (snapshot) => {
        const data = snapshot.docs.map(d => ticketFromFirestore(d.data()));
        setTickets(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
      },
      (err) => console.error("Firebase tickets error:", err)
    );
    return () => unsub();
  }, []);

  // ── Firebase: comunicados en tiempo real ──
  useEffect(() => {
    // Calcular empresaId directamente desde USUARIOS para no depender de 'usuario'
    // que se define más abajo en el componente
    const miEmpId = (USUARIOS.find(u => u.id === usuarioId))?.empresaId ?? null;
    const miId    = usuarioId;

    const unsub = onSnapshot(collection(db, "comunicados"), snap => {
      const ahora   = new Date();
      const activos = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => {
          // Caducidad
          if (c.fechaCaducidad && new Date(c.fechaCaducidad) < ahora) return false;
          // Destinatarios
          const dest = c.destinatarios;
          if (!dest || dest.tipo === "todos") return true;
          if (dest.tipo === "empresas") return (dest.empresaIds || []).includes(miEmpId);
          if (dest.tipo === "usuarios") return (dest.usuarioIds || []).includes(miId);
          return true;
        })
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setComunicados(activos);
    });
    return () => unsub();
  }, [usuarioId]);

  // ── Firebase: fichajes en tiempo real ──
  useEffect(() => {
    if (!usuarioId) return;
    const unsub = onSnapshot(collection(db, "fichajes"), snap => {
      const todos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setFichajes(todos.filter(f => f.usuarioId === usuarioId));
      // detectar si hay un fichaje abierto (sin salida)
      const abierto = todos.find(f => f.usuarioId === usuarioId && !f.salida);
      setFichajeActivo(abierto || null);
    });
    return () => unsub();
  }, [usuarioId]);

  // ── Firebase: nóminas en tiempo real ──
  useEffect(() => {
    if (!usuarioId) return;
    const esAdminDir = ["director","administrador"].includes(usuario?.rol);
    const unsub = onSnapshot(collection(db, "nominas"), snap => {
      const todas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Admin/director ven todas; el resto solo las suyas
      setNominas(esAdminDir ? todas : todas.filter(n => n.usuarioId === usuarioId));
    });
    return () => unsub();
  }, [usuarioId, usuario?.rol]);

  // ── Firebase: notificaciones en tiempo real ──
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "notificaciones"),
      (snapshot) => { setNotifs(snapshot.docs.map(d => d.data())); },
      (err) => console.error("Firebase notifs error:", err)
    );
    return () => unsub();
  }, []);

  const usuario  = USUARIOS.find(u => u.id === usuarioId) || null;
  const empresa  = EMPRESAS.find(e => e.id === usuario?.empresaId);
  const empColor = usuario?.rol === "director" ? "#94A3B8" : (empresa?.color || "#E53E3E");
  const inpF     = { fontFamily: "inherit", fontSize: 12, background: darkMode ? "#0D1424" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 6, padding: "7px 11px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none" };

  // Tickets que "pertenecen" al usuario según su rol
  const ticketsMisRol = tickets.filter(t => {
    if (!usuario || usuario.rol === "director") return true;
    const eds   = t.empresasDestino || [];
    const asigs = Object.values(t.asignacionesPorEmpresa || {}).flat();
    if (usuario.rol === "encargado") {
      // Encargado ve: tickets donde su empresa es destino, o tickets que él creó
      return eds.includes(usuario.empresaId) || t.creadoPor === usuario.id;
    }
    // Trabajador ve: tickets donde está asignado o que él creó
    return asigs.includes(usuario.id) || t.creadoPor === usuario.id;
  });

  const ticketsFiltrados = ticketsMisRol.filter(t => {
    if (vista === "mis" && usuario?.rol !== "director") {
      const eds   = t.empresasDestino || [];
      const asigs = Object.values(t.asignacionesPorEmpresa || {}).flat();
      if (!usuario) return false;
      if (usuario.rol === "encargado") {
        const mio = eds.includes(usuario.empresaId) || t.creadoPor === usuario.id;
        if (!mio) return false;
      } else {
        const mio = asigs.includes(usuario.id) || t.creadoPor === usuario.id;
        if (!mio) return false;
      }
    }
    // Pantalla principal: solo activos
    if (["Completado", "Cancelado"].includes(t.estado)) return false;
    if (filtros.estado !== "todos" && t.estado !== filtros.estado) return false;
    if (filtros.empresa !== "todas") {
      const eds = t.empresasDestino || [];
      if (!eds.includes(Number(filtros.empresa)) && t.empresaOrigenId !== Number(filtros.empresa)) return false;
    }
    if (filtros.buscar && !t.titulo.toLowerCase().includes(filtros.buscar.toLowerCase())) return false;
    return true;
  });

  // Estadísticas basadas en los tickets del rol del usuario
  const ticketsActivos    = ticketsMisRol.filter(t => !["Completado","Cancelado"].includes(t.estado));
  const ticketsCompletados = ticketsMisRol.filter(t => t.estado === "Completado");
  const ticketsCancelados  = ticketsMisRol.filter(t => t.estado === "Cancelado");

  const stats = {
    total:       ticketsActivos.length,
    pendientes:  ticketsActivos.filter(t => t.estado === "Pendiente").length,
    enCurso:     ticketsActivos.filter(t => ["Asignado","En progreso"].includes(t.estado)).length,
    completados: ticketsCompletados.length,
  };

  const guardarNotifs = (nuevas) => {
    setNotifs(nuevas);
  };

  const addNotif = (notif) => {
    const nueva = { id: genId(), fecha: new Date().toISOString(), leida: false, ...notif };
    setDoc(doc(db, "notificaciones", String(nueva.id)), nueva)
      .catch(e => console.error("Error notif:", e));
  };

  const actualizarTicket = (t, ticketAnterior) => {
    const ant = ticketAnterior || tickets.find(x => x.id === t.id);
    // Actualizar UI inmediatamente (optimistic update)
    setTickets(ts => ts.map(x => x.id === t.id ? t : x));
    setDetalle(t);
    // Guardar en Firestore (serializado)
    setDoc(doc(db, "tickets", String(t.id)), ticketToFirestore(t))
      .catch(e => console.error("Error actualizando ticket:", e));
    // Generar notificaciones
    if (ant) {
      // Cambio a completado → notificar al creador
      if (t.estado === "Completado" && ant.estado !== "Completado") {
        if (t.creadoPor !== usuarioId) {
          addNotif({ usuarioDestinoId: t.creadoPor, tipo: "completado", ticketId: t.id, texto: `El ticket "${t.titulo}" ha sido completado.` });
        }
      }
      // Nuevo comentario → notificar a involucrados excepto quien comenta
      if (t.comentarios.length > ant.comentarios.length) {
        const ultimo = t.comentarios[t.comentarios.length - 1];
        const involucrados = [...new Set([t.creadoPor, ...Object.values(t.asignacionesPorEmpresa||{}).flat()])].filter(id => id !== ultimo.autorId);
        involucrados.forEach(id => addNotif({ usuarioDestinoId: id, tipo: "comentario", ticketId: t.id, texto: `Nuevo comentario en "${t.titulo}".` }));
      }
      // Nueva asignación → notificar a asignados nuevos
      const asignadosAnt = Object.values(ant.asignacionesPorEmpresa||{}).flat();
      const asignadosNuev = Object.values(t.asignacionesPorEmpresa||{}).flat();
      asignadosNuev.filter(id => !asignadosAnt.includes(id)).forEach(id => {
        if (id !== usuarioId) addNotif({ usuarioDestinoId: id, tipo: "asignacion", ticketId: t.id, texto: `Has sido asignado al ticket "${t.titulo}".` });
      });
    }
  };

  const crearTicket = (t) => {
    // Actualizar UI inmediatamente
    setTickets(ts => [t, ...ts]);
    // Guardar en Firestore (serializado)
    setDoc(doc(db, "tickets", String(t.id)), ticketToFirestore(t))
      .catch(e => console.error("Error creando ticket:", e));
    // Notificar a encargados de empresas destino
    (t.empresasDestino||[]).forEach(empId => {
      const enc = USUARIOS.find(u => u.empresaId === empId && u.rol === "encargado");
      if (enc && enc.id !== usuarioId) addNotif({ usuarioDestinoId: enc.id, tipo: "nuevo", ticketId: t.id, texto: `Nuevo ticket para tu empresa: "${t.titulo}".` });
    });
  };

  // ── Fichaje ──
  const ficharEntrada = async () => {
    const id  = String(Date.now());
    const now = new Date().toISOString();
    await setDoc(doc(db, "fichajes", id), { id, usuarioId, entrada: now, salida: null, fecha: now.split("T")[0] });
  };
  const ficharSalida = async () => {
    if (!fichajeActivo) return;
    await setDoc(doc(db, "fichajes", fichajeActivo.id), { ...fichajeActivo, salida: new Date().toISOString() });
  };

  // ── Nóminas ──
  const subirNomina = async ({ usuarioDestinoId, mes, anio, nombre, dataUrl }) => {
    const id = String(Date.now());
    await setDoc(doc(db, "nominas", id), { id, usuarioId: usuarioDestinoId, mes, anio, nombre, dataUrl, subidoPor: usuarioId, fecha: new Date().toISOString() });
  };
  const eliminarNomina = async (id) => {
    await deleteDoc(doc(db, "nominas", id));
  };

  const guardarTicketPersonal = (t) => {
    const nuevos = [t, ...misTicketsPersonales];
    setMisTicketsPersonales(nuevos);
    try { localStorage.setItem("mis_tickets_personales", JSON.stringify(nuevos)); } catch {}
    // Programar notificación si tiene alerta
    if (t.alerta && t.fechaAlerta) {
      const ms = new Date(t.fechaAlerta).getTime() - Date.now();
      if (ms > 0) {
        setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("📝 Recordatorio: " + t.titulo, { body: t.descripcion || "Tienes un ticket personal pendiente.", icon: "/favicon.ico" });
          }
        }, ms);
      }
    }
  };

  const actualizarTicketPersonal = (t) => {
    const nuevos = misTicketsPersonales.map(x => x.id === t.id ? t : x);
    setMisTicketsPersonales(nuevos);
    try { localStorage.setItem("mis_tickets_personales", JSON.stringify(nuevos)); } catch {}
    if (detalleMiTicket?.id === t.id) setDetalleMiTicket(t);
  };

  const misNotifs = notifs.filter(n => n.usuarioDestinoId === usuarioId);
  const notifsNoLeidas = misNotifs.filter(n => !n.leida).length;

  const marcarLeidas = () => {
    notifs
      .filter(n => n.usuarioDestinoId === usuarioId && !n.leida)
      .forEach(n => {
        updateDoc(doc(db, "notificaciones", String(n.id)), { leida: true })
          .catch(e => console.error("Error marcando notif:", e));
      });
  };

  const handleLogin = () => {
    const uid = Number(loginUsuarioId);
    const pin = pins[uid];
    if (!pin) { setLoginError("Selecciona un usuario"); return; }
    if (loginPin !== pin) { setLoginError("PIN incorrecto"); return; }
    setUsuarioId(uid);
    try { sessionStorage.setItem("grupo_usuario_id", String(uid)); sessionStorage.setItem("grupo_logueado", "1"); } catch {}
    setLogueado(true);
    setLoginError("");
  };

  const handleLogout = () => {
    setLogueado(false);
    setLoginPin("");
    setUsuarioId(null);
    try { sessionStorage.removeItem("grupo_logueado"); sessionStorage.removeItem("grupo_usuario_id"); } catch {}
  };

  // ── PANTALLA LOGIN ──
  if (!logueado || usuarioId === null || !usuario) {
    return (
      <div style={{ minHeight: "100vh", background: darkMode ? "#0A0F1C" : "#F1F5F9", fontFamily: "'DM Sans','Segoe UI',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <div className="login-box" style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 16, padding: 36, width: "100%", maxWidth: 380, boxShadow: "0 24px 80px #0008" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🏢</div>
            <h1 style={{ margin: "0 0 4px", color: darkMode ? "#E2E8F0" : "#0F172A", fontSize: 22, fontWeight: 900 }}>Tickets</h1>
            <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 13 }}>Sistema de gestión interempresarial</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ color: darkMode ? "#64748B" : "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Usuario</label>
              <select style={{ width: "100%", fontFamily: "inherit", fontSize: 13, background: darkMode ? "#0D1424" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 8, padding: "10px 12px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none" }}
                value={loginUsuarioId} onChange={e => { setLoginUsuarioId(e.target.value); setLoginError(""); }}>
                <option value="">Selecciona tu usuario...</option>
                {EMPRESAS.map(emp => (
                  <optgroup key={emp.id} label={emp.nombre}>
                    {USUARIOS.filter(u => u.empresaId === emp.id).map(u =>
                      <option key={u.id} value={u.id}>{u.nombre}</option>
                    )}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: darkMode ? "#64748B" : "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 6 }}>PIN (4 dígitos)</label>
              <input type="password" maxLength={4} inputMode="numeric"
                style={{ width: "100%", boxSizing: "border-box", fontFamily: "inherit", fontSize: 20, letterSpacing: 8, textAlign: "center", background: darkMode ? "#0D1424" : "#FFFFFF", border: `1px solid ${loginError ? "#E53E3E" : darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 8, padding: "10px 12px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none" }}
                value={loginPin} onChange={e => { setLoginPin(e.target.value.replace(/\D/,"")); setLoginError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="• • • •" />
              {loginError && <p style={{ margin: "6px 0 0", color: "#E53E3E", fontSize: 12 }}>{loginError}</p>}
            </div>
            <button onClick={handleLogin}
              style={{ fontFamily: "inherit", fontWeight: 800, fontSize: 14, background: "#3182CE", color: "#fff", border: "none", borderRadius: 8, padding: "12px", cursor: "pointer", marginTop: 4 }}>
              Entrar
            </button>
          </div>
          <p style={{ textAlign: "center", color: darkMode ? "#334155" : "#94A3B8", fontSize: 11, marginTop: 20, marginBottom: 0 }}>PIN por defecto: 1234</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app${darkMode ? " dark" : ""}${theme === "vibrante" ? " vibrante" : ""}${theme === "minimal" ? " minimal" : ""}`}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        /* ── Sistema de diseño Grupo Laura Otero ── */
        :root {
          --blue:   #1683BE; --blue-d: #0F6798;
          --green:  #5BA31A; --green-d:#478114;
          --yellow: #E7A50C; --yellow-d:#C98A00;
          --red:    #D71F35; --red-d:  #B01629;
          --primary:      #1683BE;
          --primary-d:    #0F6798;
          --primary-ink:  #ffffff;
          --primary-soft: color-mix(in oklab, var(--primary) 12%, #fff);
          --primary-soft2:color-mix(in oklab, var(--primary) 7%, #fff);
          --bg:        #EBEFF3; --surface: #FFFFFF; --surface-2: #F5F8FA; --surface-3: #EEF2F6;
          --border:    #E0E6EC; --border-2: #ECF0F4;
          --ink:       #17252F; --ink-2: #54646F; --ink-3: #8593A0;
          --ok-soft:   color-mix(in oklab, #5BA31A 14%, #fff);
          --warn-soft: color-mix(in oklab, #E7A50C 18%, #fff);
          --danger:    #D71F35;
          --danger-soft:color-mix(in oklab, #D71F35 12%, #fff);
          --info-soft: color-mix(in oklab, #1683BE 12%, #fff);
          --r-xs:4px; --r-sm:8px; --r:12px; --r-lg:16px; --r-xl:20px; --r-pill:999px;
          --sh-sm:0 1px 3px rgba(20,40,55,.06); --sh:0 2px 8px rgba(20,40,55,.08);
          --sh-lg:0 8px 30px rgba(20,40,55,.12); --sh-pop:0 12px 40px rgba(20,40,55,.18);
          --font-head:'Poppins',system-ui,sans-serif;
          --font-body:'Public Sans',system-ui,sans-serif;
          --pad:20px;
          --nav-bg:#FFFFFF; --nav-fg:#54646F;
          --nav-active-bg:color-mix(in oklab, #1683BE 10%, #fff);
          --nav-active-fg:#0F6798; --nav-border:#E0E6EC;
        }
        /* Dark mode */
        .dark {
          --bg:#0D1117; --surface:#111827; --surface-2:#1A2235; --surface-3:#1E293B;
          --border:#1E293B; --border-2:#0D1424;
          --ink:#E2E8F0; --ink-2:#94A3B8; --ink-3:#475569;
          --primary-soft:color-mix(in oklab, #1683BE 18%, #111827);
          --primary-soft2:color-mix(in oklab, #1683BE 10%, #111827);
          --ok-soft:color-mix(in oklab,#5BA31A 18%,#111827);
          --warn-soft:color-mix(in oklab,#E7A50C 18%,#111827);
          --danger-soft:color-mix(in oklab,#D71F35 18%,#111827);
          --info-soft:color-mix(in oklab,#1683BE 18%,#111827);
          --nav-bg:#111827; --nav-fg:#94A3B8;
          --nav-active-bg:rgba(22,131,190,.18);
          --nav-active-fg:#60A5FA; --nav-border:#1E293B;
        }
        /* Vibrante */
        .vibrante {
          --nav-bg:linear-gradient(180deg,#0F6798,#0a3a55);
          --nav-fg:rgba(255,255,255,.82); --nav-active-bg:rgba(255,255,255,.16);
          --nav-active-fg:#ffffff; --nav-border:transparent;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body { margin:0; padding:0; font-family:var(--font-body); color:var(--ink); background:var(--bg);
          -webkit-font-smoothing:antialiased; font-size:15px; line-height:1.45; }
        h1,h2,h3,h4,h5 { font-family:var(--font-head); font-weight:600; margin:0; letter-spacing:-.01em; color:var(--ink); }
        ::-webkit-scrollbar { width:10px; }
        ::-webkit-scrollbar-thumb { background:#cfd8df; border-radius:99px; border:3px solid transparent; background-clip:padding-box; }
        /* App shell */
        .app { display:flex; height:100vh; width:100%; overflow:hidden; background:var(--bg); font-family:var(--font-body); color:var(--ink); }
        .app-sidebar { width:248px; flex:none; display:flex; flex-direction:column; background:var(--nav-bg); border-right:1px solid var(--nav-border); transition:width .2s; overflow:hidden; height:100vh; position:sticky; top:0; }
        .app-sidebar.collapsed { width:64px; }
        .app-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }
        .app-topbar { height:60px; flex:none; background:var(--surface); border-bottom:1px solid var(--border); display:flex; align-items:center; gap:16px; padding:0 24px; }
        .app-content { flex:1; overflow:auto; padding:28px 32px 60px; }
        /* Sidebar head */
        .sidebar-head { padding:18px 16px 10px; border-bottom:1px solid var(--nav-border); display:flex; align-items:center; justify-content:space-between; min-height:64px; }
        .sidebar-logo { display:flex; align-items:center; gap:10px; overflow:hidden; }
        .sidebar-logo-text { line-height:1.1; }
        .sidebar-logo-text b { display:block; font-family:var(--font-head); font-weight:700; font-size:14px; color:var(--green-d); white-space:nowrap; }
        .sidebar-logo-text span { display:block; font-family:var(--font-head); font-weight:700; font-size:14px; color:var(--blue-d); white-space:nowrap; margin-top:-1px; }
        .dark .sidebar-logo-text b, .dark .sidebar-logo-text span { color:#fff; }
        .vibrante .sidebar-logo-text b, .vibrante .sidebar-logo-text span { color:#fff; }
        /* Nav */
        .app-nav { display:flex; flex-direction:column; gap:2px; padding:8px 10px; flex:1; overflow-y:auto; }
        .nav-sec-label { font-size:10.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;
          color:var(--ink-3); padding:12px 8px 4px; white-space:nowrap; overflow:hidden; }
        .nav-btn { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:var(--r-sm);
          color:var(--nav-fg); font-weight:600; font-size:13.5px; cursor:pointer; border:none;
          background:transparent; text-align:left; width:100%; white-space:nowrap; transition:background .12s,color .12s;
          font-family:var(--font-body); position:relative; overflow:hidden; }
        .nav-btn:hover { background:color-mix(in oklab,var(--nav-fg) 9%,transparent); }
        .nav-btn.active { background:var(--nav-active-bg); color:var(--nav-active-fg); font-weight:700; }
        .nav-btn .nav-label { overflow:hidden; white-space:nowrap; transition:opacity .15s,width .15s; }
        .app-sidebar.collapsed .nav-btn { justify-content:center; padding:9px; }
        .app-sidebar.collapsed .nav-label,
        .app-sidebar.collapsed .nav-sec-label { opacity:0; width:0; overflow:hidden; pointer-events:none; }
        .nav-badge { margin-left:auto; min-width:19px; height:19px; padding:0 5px; border-radius:99px;
          background:var(--danger); color:#fff; font-size:10px; font-weight:700; display:grid; place-items:center; flex-shrink:0; }
        .app-sidebar.collapsed .nav-badge { position:absolute; top:4px; right:4px; }
        /* Sidebar footer */
        .sidebar-footer { padding:10px; border-top:1px solid var(--nav-border); }
        .sidebar-user { display:flex; align-items:center; gap:10px; padding:10px 10px; border-radius:var(--r-sm);
          background:var(--surface-2); overflow:hidden; }
        .sidebar-user-info { overflow:hidden; flex:1; min-width:0; }
        .sidebar-user-info strong { display:block; font-size:12px; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .sidebar-user-info span { font-size:11px; color:var(--ink-3); white-space:nowrap; }
        .vibrante .sidebar-user { background:rgba(255,255,255,.1); }
        .vibrante .sidebar-user-info strong, .vibrante .sidebar-user-info span { color:rgba(255,255,255,.85); }
        .dark .sidebar-user { background:var(--surface-2); }
        /* Sidebar actions */
        .sidebar-actions { display:flex; align-items:center; gap:4px; padding:8px 10px; flex-wrap:wrap; }
        .app-sidebar.collapsed .sidebar-actions { flex-direction:column; }
        .sidebar-action-btn { background:transparent; border:1px solid transparent; border-radius:var(--r-xs);
          padding:6px 8px; cursor:pointer; font-size:15px; color:var(--nav-fg); transition:background .12s; position:relative; }
        .sidebar-action-btn:hover { background:color-mix(in oklab,var(--nav-fg) 10%,transparent); }
        .action-badge { position:absolute; top:1px; right:1px; background:var(--primary); color:#fff;
          border-radius:50%; width:13px; height:13px; font-size:8px; font-weight:900;
          display:flex; align-items:center; justify-content:center; }
        .toggle-btn { background:transparent; border:none; cursor:pointer; color:var(--nav-fg);
          padding:4px; line-height:1; font-size:16px; flex-shrink:0; }
        /* Topbar */
        .topbar-title { font-family:var(--font-head); font-weight:700; font-size:15px; color:var(--ink); }
        .topbar-sub { font-size:12px; font-weight:600; color:var(--primary); margin-left:8px; }
        .topbar-right { display:flex; align-items:center; gap:8px; margin-left:auto; }
        /* Cards */
        .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); box-shadow:var(--sh-sm); }
        .card-pad { padding:var(--pad); }
        /* KPI */
        .kpi-row { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:14px; margin-bottom:20px; }
        .kpi-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r); padding:16px 18px; display:flex; flex-direction:column; gap:6px; }
        .kpi-v { font-family:var(--font-head); font-weight:700; font-size:28px; line-height:1; letter-spacing:-.02em; }
        .kpi-l { font-size:12px; color:var(--ink-2); font-weight:600; }
        /* Badges */
        .badge { display:inline-flex; align-items:center; gap:4px; padding:2px 9px; border-radius:var(--r-pill);
          font-size:11px; font-weight:700; letter-spacing:.02em; border:1px solid transparent; }
        .badge-blue   { background:var(--info-soft);   color:var(--blue-d);  border-color:color-mix(in oklab,var(--blue) 25%,transparent); }
        .badge-green  { background:var(--ok-soft);    color:var(--green-d); border-color:color-mix(in oklab,var(--green) 25%,transparent); }
        .badge-yellow { background:var(--warn-soft);  color:var(--yellow-d);border-color:color-mix(in oklab,var(--yellow) 25%,transparent); }
        .badge-red    { background:var(--danger-soft); color:var(--red-d);   border-color:color-mix(in oklab,var(--red) 25%,transparent); }
        .badge-gray   { background:var(--surface-3);  color:var(--ink-2);   border-color:var(--border); }
        .badge-pri    { background:var(--primary-soft); color:var(--primary-d); border-color:color-mix(in oklab,var(--primary) 25%,transparent); }
        /* Buttons */
        .btn { display:inline-flex; align-items:center; justify-content:center; gap:7px; height:38px; padding:0 16px;
          border-radius:var(--r-sm); border:1px solid transparent; background:var(--surface-3); color:var(--ink);
          font-weight:600; font-size:13px; cursor:pointer; white-space:nowrap; font-family:var(--font-body);
          transition:background .12s,box-shadow .12s; }
        .btn-pri { background:var(--primary); color:#fff; border-color:var(--primary-d); }
        .btn-pri:hover { background:var(--primary-d); }
        .btn-outline { background:transparent; border-color:var(--border); color:var(--ink-2); }
        .btn-outline:hover { border-color:var(--primary); color:var(--primary-d); }
        .btn-ghost { background:transparent; border-color:transparent; color:var(--ink-2); }
        .btn-ghost:hover { background:var(--surface-3); }
        .btn-sm { height:32px; padding:0 12px; font-size:12px; }
        .btn-icon { width:38px; padding:0; }
        .btn-danger { background:var(--danger); color:#fff; border-color:var(--red-d); }
        /* Inputs */
        .field { display:flex; flex-direction:column; gap:6px; }
        .field > label { font-size:12px; font-weight:600; color:var(--ink-2); }
        .input,.select,.textarea { width:100%; min-height:40px; padding:9px 12px; background:var(--surface);
          border:1px solid var(--border); border-radius:var(--r-sm); color:var(--ink); outline:none;
          font-family:var(--font-body); font-size:13px; transition:border-color .12s,box-shadow .12s; }
        .input:focus,.select:focus,.textarea:focus { border-color:var(--primary); box-shadow:0 0 0 3px color-mix(in oklab,var(--primary) 14%,transparent); }
        .textarea { min-height:88px; resize:vertical; }
        .select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2354646F' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:32px; }
        /* Modal */
        .modal-overlay { position:fixed; inset:0; background:rgba(15,30,40,.5); backdrop-filter:blur(2px);
          display:grid; place-items:start center; padding:48px 20px 40px; z-index:200; overflow:auto; }
        .modal-card { width:100%; background:var(--surface); border-radius:var(--r-xl); box-shadow:var(--sh-pop); border:1px solid var(--border); }
        .modal-head { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid var(--border); }
        .modal-body { padding:20px; display:flex; flex-direction:column; gap:16px; }
        .modal-foot { display:flex; justify-content:flex-end; gap:10px; padding:14px 20px; border-top:1px solid var(--border); }
        /* Tabs */
        .tabs { display:flex; gap:2px; border-bottom:1px solid var(--border); margin-bottom:18px; }
        .tab { padding:9px 14px; font-weight:600; font-size:13px; color:var(--ink-2); cursor:pointer;
          border:none; background:transparent; border-bottom:2px solid transparent; margin-bottom:-1px;
          transition:color .12s,border-color .12s; font-family:var(--font-body); white-space:nowrap; }
        .tab:hover { color:var(--ink); }
        .tab.active { color:var(--primary-d); border-bottom-color:var(--primary); }
        /* Table */
        .tbl { width:100%; border-collapse:collapse; }
        .tbl th { text-align:left; font-size:11px; font-weight:700; color:var(--ink-3); text-transform:uppercase; letter-spacing:.04em; padding:0 14px 10px; }
        .tbl td { padding:12px 14px; border-top:1px solid var(--border-2); font-size:13px; }
        .tbl tbody tr { cursor:pointer; transition:background .1s; }
        .tbl tbody tr:hover { background:var(--surface-2); }
        /* Chips */
        .chip { display:inline-flex; align-items:center; gap:5px; height:32px; padding:0 13px;
          border-radius:var(--r-pill); border:1px solid var(--border); background:var(--surface);
          font-size:12px; font-weight:600; color:var(--ink-2); cursor:pointer; white-space:nowrap;
          font-family:var(--font-body); transition:all .12s; }
        .chip:hover { border-color:var(--primary); color:var(--primary-d); }
        .chip.active { background:var(--primary); border-color:var(--primary); color:#fff; }
        /* Progress bar */
        .bar { height:7px; border-radius:99px; background:var(--surface-3); overflow:hidden; }
        .bar > i { display:block; height:100%; border-radius:99px; background:var(--primary); }
        /* Seg */
        .seg { display:inline-flex; background:var(--surface-3); border-radius:var(--r-sm); padding:3px; gap:2px; }
        .seg button { border:none; background:transparent; padding:6px 12px; border-radius:var(--r-xs);
          font-weight:600; font-size:12px; color:var(--ink-2); cursor:pointer; font-family:var(--font-body);
          display:inline-flex; align-items:center; gap:5px; }
        .seg button.active { background:var(--surface); color:var(--primary-d); box-shadow:var(--sh-sm); }
        /* Search */
        .search-wrap { position:relative; display:flex; align-items:center; }
        .search-wrap input { padding-left:36px; height:38px; border-radius:var(--r-sm); min-width:220px; }
        .search-icon { position:absolute; left:10px; color:var(--ink-3); pointer-events:none; }
        /* Stripe */
        .stripe4 { display:flex; height:4px; border-radius:99px; overflow:hidden; width:48px; }
        .stripe4 i { flex:1; }
        .stripe4 .sy { background:var(--yellow); } .stripe4 .sr { background:var(--red); }
        .stripe4 .sg { background:var(--green); } .stripe4 .sb { background:var(--blue); }
        /* Utils */
        .row { display:flex; align-items:center; }
        .col { display:flex; flex-direction:column; }
        .gap-1{gap:4px} .gap-2{gap:8px} .gap-3{gap:12px} .gap-4{gap:16px}
        .grow{flex:1} .wrap{flex-wrap:wrap} .muted{color:var(--ink-2)} .faint{color:var(--ink-3)}
        .center{align-items:center} .between{justify-content:space-between}
        .t-xs{font-size:12px} .t-sm{font-size:13px} .b6{font-weight:600} .b7{font-weight:700}
        .nowrap{white-space:nowrap} .mono{font-family:'IBM Plex Mono',monospace}
        /* Page layout */
        .page-head { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:22px; flex-wrap:wrap; }
        .page-title { font-family:var(--font-head); font-size:22px; font-weight:700; letter-spacing:-.02em; color:var(--ink); }
        .page-sub { color:var(--ink-2); font-size:13px; margin-top:2px; }
        /* Animations */
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .fade-up { animation:fadeUp .28s cubic-bezier(.2,.7,.3,1) both; }
        .fade-in { animation:fadeIn .2s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes parpadeo {
          0%,100% { opacity:1; border-color:#D71F35; box-shadow:0 0 0 0px #D71F3544; }
          50%      { opacity:0.72; border-color:#D71F35BB; box-shadow:0 0 0 4px #D71F3522; }
        }
        @keyframes parpadeo {
          0%, 100% { opacity: 1; border-color: #E53E3E; box-shadow: 0 0 0 0px #E53E3E44; }
          50%       { opacity: 0.72; border-color: #E53E3EBB; box-shadow: 0 0 0 4px #E53E3E22; }
        }
        *, *::before, *::after { transition: background-color .15s, border-color .15s, color .1s; }
        html { -webkit-text-size-adjust: 100%; }
        body { margin: 0; padding: 0; }
        @media (max-width: 640px) {
          .nav-logo-subtitle { display: none !important; }
          .nav-user-role { display: none !important; }
          .nav-empresa-name { display: none !important; }
          .nav-user-nombre { display: none !important; }
          .nav-user-tags { display: none !important; }
          /* Sidebar responsive */
          @media (max-width: 768px) {
            .sidebar-aside { position: fixed !important; left: 0; top: 0; height: 100vh !important; z-index: 200 !important; transform: translateX(-100%); transition: transform .25s ease !important; }
            .sidebar-aside.open { transform: translateX(0) !important; }
            .sidebar-overlay { display: block !important; }
          }
          .sidebar-overlay { display: none; position: fixed; inset: 0; background: #00000066; z-index: 199; }
          .nav-tab-btn { padding: 0 14px !important; font-size: 12px !important; white-space: nowrap !important; }
          .nav-user-info { gap: 6px !important; }
          .nav-action-btns { gap: 4px !important; }
          .nav-action-btns button { padding: 5px 7px !important; font-size: 15px !important; }
          .main-content { padding: 14px 10px !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 8px !important; }
          .tickets-grid { grid-template-columns: 1fr !important; }
          .filters-row { flex-direction: column !important; align-items: stretch !important; gap: 8px !important; }
          .filters-row > * { width: 100% !important; min-width: unset !important; box-sizing: border-box; }
          .btn-nuevo { margin-left: 0 !important; width: 100% !important; }
          .btn-mis-tickets { width: 100% !important; }
          .modal-overlay { padding: 0 !important; align-items: flex-end !important; }
          .modal-box { padding: 18px 14px !important; border-radius: 16px 16px 0 0 !important; margin: 0 !important; max-width: 100% !important; width: 100% !important; max-height: 92vh; overflow-y: auto; }
          .form-grid-3 { grid-template-columns: 1fr !important; }
          .form-grid-2 { grid-template-columns: 1fr !important; }
          .login-box { padding: 24px 16px !important; margin: 16px !important; border-radius: 12px !important; }
          .banner-director { flex-direction: column !important; padding: 12px !important; }
          .historial-subtabs { width: 100% !important; }
          .historial-subtabs button { flex: 1 !important; }
        }
        @media (max-width: 380px) {
          .nav-tab-btn { padding: 0 10px !important; font-size: 11px !important; }
          .stats-grid { gap: 6px !important; }
          .nav-action-btns button { padding: 4px 6px !important; }
        }
      `}</style>

      {/* ── LAYOUT PRINCIPAL ── */}
      <div style={{ display:"contents" }}>

        {/* ── SIDEBAR ── */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:109, display:"none" }} className="sidebar-overlay" />}

        <aside className={`app-sidebar${!sidebarOpen ? " collapsed" : ""}${darkMode ? "" : ""}${theme === "vibrante" ? " vibrante" : ""}`}>

          {/* Logo + toggle */}
          <div className="sidebar-head">
            {sidebarOpen && (
              <div className="sidebar-logo">
                <div style={{ width:36, height:36, borderRadius:9, background: empColor, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#fff", fontSize:14, flexShrink:0 }}>
                  {EMPRESAS.find(e=>e.id===usuario?.empresaId)?.inicial || "G"}
                </div>
                <div className="sidebar-logo-text">
                  <b>Grupo</b>
                  <span>Laura Otero</span>
                </div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(v => !v)} className="toggle-btn" title={sidebarOpen ? "Colapsar" : "Expandir"}>
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>

          {/* Navegación */}
          <nav className="app-nav">
            {[
              { id:"tickets",    icon:"🎫", label:"Tickets",              badge: tickets.filter(t=>t.estado==="Pendiente"||t.estado==="Asignado"||t.estado==="En progreso").length || null },
              { id:"historial",  icon:"🗂️",  label:"Historial" },
              { id:"calendario", icon:"📅", label:"Calendario" },
              ...( ["director","encargado","administrador"].includes(usuario?.rol) ? [{ id:"reportes", icon:"📄", label:"Reportes" }] : []),
              { id:"fichaje",    icon:"🕐", label:"Fichaje" },
              { id:"nominas",    icon:"💰", label:"Nóminas" },
              { separator: true, label: "RRHH" },
              { id:"rrhh",       icon:"👔", label:"Gest. Administrativa" },
              { separator: true, label: "Perfil" },
              { id:"perfil",     icon:"👤", label:"Perfil" },
            ].map((item, idx) => {
              if (item.separator) return (
                <div key={idx} className="nav-sec-label">{sidebarOpen ? item.label : ""}</div>
              );
              const activo = seccion === item.id;
              return (
                <button key={item.id} onClick={() => setSeccion(item.id)}
                  title={!sidebarOpen ? item.label : ""}
                  className={`nav-btn${activo ? " active" : ""}`}>
                  <span style={{ fontSize:16, flexShrink:0, lineHeight:1 }}>{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.id === "fichaje" && fichajeActivo && (
                    <span style={{ marginLeft:"auto", width:7, height:7, borderRadius:"50%", background:"#5BA31A", flexShrink:0, animation:"parpadeo 1.6s ease-in-out infinite" }} />
                  )}
                  {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                </button>
              );
            })}
          </nav>

          {/* Acciones inferiores */}
          <div className="sidebar-actions">
            <div style={{ position:"relative" }}>
              <button onClick={() => setVerComunicados(v => !v)} title="Comunicados" className="sidebar-action-btn">
                💬
                {comunicados.length > 0 && <span className="action-badge">{comunicados.length}</span>}
              </button>
            </div>
            <div style={{ position:"relative" }}>
              <button onClick={() => { setVerNotifs(v => !v); marcarLeidas(); }} title="Notificaciones" className="sidebar-action-btn">
                🔔
                {notifsNoLeidas > 0 && <span className="action-badge">{notifsNoLeidas}</span>}
              </button>
            </div>
            <button onClick={toggleTheme} title={darkMode ? "Modo claro" : "Modo oscuro"} className="sidebar-action-btn">
              {darkMode ? "☀️" : "🌙"}
            </button>
            {(usuario?.rol === "director" || usuario?.rol === "administrador") && (
              <button onClick={() => setModalAdmin(true)} title="Administración" className="sidebar-action-btn">⚙️</button>
            )}
            <button onClick={handleLogout} title="Cerrar sesión" className="sidebar-action-btn">🚪</button>
          </div>

          {/* Usuario */}
          {sidebarOpen && (
            <div className="sidebar-footer">
              <div className="sidebar-user">
                <div style={{ width:34, height:34, borderRadius:"50%", background:empColor+"44", border:`2px solid ${empColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:13, flexShrink:0 }}>
                  {usuario?.nombre?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()||"U"}
                </div>
                <div className="sidebar-user-info">
                  <strong>{usuario?.nombre}</strong>
                  <span>{usuario?.rol} · {EMPRESAS.find(e=>e.id===usuario?.empresaId)?.nombre}</span>
                </div>
              </div>
            </div>
          )}

          {/* Paneles flotantes */}
          {verComunicados && (
            <div style={{ position:"fixed", left: sidebarOpen ? 258 : 74, bottom:60, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, width:"min(360px,calc(100vw - 80px))", maxHeight:480, overflowY:"auto", zIndex:200, boxShadow:"var(--sh-pop)" }}>
              <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"var(--surface)", zIndex:1 }}>
                <span style={{ color:"var(--ink)", fontWeight:800, fontSize:13 }}>💬 Comunicados</span>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {(usuario?.rol === "director" || usuario?.rol === "administrador" || usuario?.rol === "encargado") && (
                    <button onClick={() => { setModalComun(true); setVerComunicados(false); }}
                      className="btn btn-sm btn-outline">+ Nuevo</button>
                  )}
                  <button onClick={() => setVerComunicados(false)} className="btn btn-sm btn-ghost" style={{ fontSize:16, padding:"0 8px" }}>×</button>
                </div>
              </div>
              {comunicados.length === 0
                ? <p style={{ padding:20, color:"var(--ink-3)", fontSize:13, margin:0, textAlign:"center" }}>No hay comunicados activos</p>
                : comunicados.map(c => {
                    const autor      = USUARIOS.find(u => u.id === c.autorId);
                    const empresa    = EMPRESAS.find(e => e.id === c.empresaId);
                    const caducaDate = c.fechaCaducidad ? new Date(c.fechaCaducidad) : null;

        {/* ── CONTENIDO PRINCIPAL ── */}
        <div className="app-main">
          <header className="app-topbar">
            <div>
              <span className="topbar-title">
                {{ tickets:"Tickets", historial:"Historial", calendario:"Calendario", reportes:"Reportes", fichaje:"Fichaje", nominas:"Nóminas", perfil:"Perfil", rrhh:"Gestión Administrativa" }[seccion]}
              </span>
              <span className="topbar-sub">· {EMPRESAS.find(e=>e.id===usuario?.empresaId)?.nombre}</span>
            </div>
            <div className="topbar-right">
              {fichajeActivo && (
                <span className="badge badge-green">🟢 Fichado desde {new Date(fichajeActivo.entrada).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}</span>
              )}
              <div style={{ width:34, height:34, borderRadius:"50%", background:empColor+"44", border:`2px solid ${empColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:12, flexShrink:0 }}>
                {usuario?.nombre?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()||"U"}
              </div>
            </div>
          </header>
          <div className="app-content">
{/* BANNER COMUNICADOS ACTIVOS */}
        {comunicados.length > 0 && (() => {
          // Mostrar solo el más reciente como banner
          const c = comunicados[0];
          const empresa = EMPRESAS.find(e => e.id === c.empresaId);
          const autor   = USUARIOS.find(u => u.id === c.autorId);
          return (
            <div style={{ background: darkMode ? "#0F172A" : "#EFF6FF", border: `1px solid ${empresa?.color || "#3182CE"}55`, borderLeft: `4px solid ${empresa?.color || "#3182CE"}`, borderRadius: 10, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>💬</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ color: empresa?.color || "#3182CE", fontSize: 12, fontWeight: 800 }}>{c.titulo}</span>
                  <span style={{ color: darkMode ? "#475569" : "#94A3B8", fontSize: 11 }}>— {autor?.nombre || "Sistema"} · {empresa?.nombre || ""}</span>
                  {comunicados.length > 1 && (
                    <button onClick={() => setVerComunicados(true)} style={{ background: "#3182CE22", border: "1px solid #3182CE44", borderRadius: 5, padding: "1px 8px", color: "#3182CE", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                      +{comunicados.length - 1} más
                    </button>
                  )}
                </div>
                {c.cuerpo && <p style={{ margin: 0, color: darkMode ? "#94A3B8" : "#475569", fontSize: 12, lineHeight: 1.5 }}>{c.cuerpo}</p>}
              </div>
            </div>
          );
        })()}

        {/* BANNER DIRECTOR */}
        {usuario?.rol === "director" && (
          <div className="banner-director" style={{ background: "linear-gradient(135deg, #1A2235, #2D3748)", border: "1px solid #F6AD5533", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#F6AD5522", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👑</div>
            <div>
              <p style={{ margin: 0, color: "#F6AD55", fontWeight: 800, fontSize: 14 }}>Panel de Dirección General — Miguel Manzano</p>
              <p style={{ margin: "2px 0 0", color: darkMode ? "#64748B" : "#475569", fontSize: 12 }}>Tienes acceso completo a todos los tickets de todas las empresas del grupo</p>
            </div>
          </div>
        )}

        {seccion === "reportes" && ["director","encargado","administrador"].includes(usuario?.rol) ? (
          <Reportes tickets={tickets} usuarioActual={usuario} />
        ) : seccion === "historial" ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 4px", color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 800, fontSize: 18 }}>🗂️ Historial</h2>
              <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 13 }}>Tickets finalizados — completados y cancelados</p>
            </div>
            {/* Sub-pestañas */}
            <div className="historial-subtabs" style={{ display: "flex", gap: 2, background: darkMode ? "#111827" : "#FFFFFF", borderRadius: 8, padding: 3, border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, marginBottom: 20, width: "fit-content" }}>
              {[["completados", `✅ Completados (${ticketsCompletados.length})`], ["cancelados", `❌ Cancelados (${ticketsCancelados.length})`]].map(([v, l]) => (
                <button key={v} onClick={() => setSubHistorial(v)}
                  style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "7px 18px", borderRadius: 6, border: "none", cursor: "pointer",
                    background: subHistorial === v ? (v === "completados" ? "#38A169" : "#E53E3E") : "transparent",
                    color: subHistorial === v ? "#fff" : "#64748B" }}>{l}
                </button>
              ))}
            </div>
            {/* Lista */}
            {(subHistorial === "completados" ? ticketsCompletados : ticketsCancelados)
              .filter(t => !filtros.buscar || t.titulo.toLowerCase().includes(filtros.buscar.toLowerCase()))
              .length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px 20px" }}>
                <p style={{ fontSize: 50, marginBottom: 12 }}>{subHistorial === "completados" ? "✅" : "❌"}</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: darkMode ? "#475569" : "#64748B" }}>
                  No hay tickets {subHistorial === "completados" ? "completados" : "cancelados"} aún
                </p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                  <input style={{ ...inpF, minWidth: 220 }} value={filtros.buscar} onChange={e => setFiltros(f => ({ ...f, buscar: e.target.value }))} placeholder="🔍 Buscar..." />
                </div>
                <div className="tickets-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                  {(subHistorial === "completados" ? ticketsCompletados : ticketsCancelados)
                    .filter(t => !filtros.buscar || t.titulo.toLowerCase().includes(filtros.buscar.toLowerCase()))
                    .map(t => <TarjetaTicket key={t.id} ticket={t} onClick={() => setDetalle(t)} />)}
                </div>
              </>
            )}
          </>
        ) : seccion === "calendario" ? (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 4px", color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 800, fontSize: 18 }}>📅 Mi Calendario</h2>
              <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 13 }}>Trabajos asignados — aparecen desde la fecha de asignación</p>
            </div>
            <Calendario tickets={tickets} ticketsPersonales={misTicketsPersonales.filter(t => t.creadoPor === usuarioId)} usuarioActual={usuario} onVerTicket={t => setDetalle(t)} onVerTicketPersonal={t => setDetalleMiTicket(t)} />
          </div>
        ) : (
          <>
            {/* ESTADÍSTICAS — clicables */}
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
              {[
                ["Total",       stats.total,       "#94A3B8", "🎫", "todos"],
                ["Pendientes",  stats.pendientes,   "#718096", "⏳", "Pendiente"],
                ["En curso",    stats.enCurso,      "#D4A017", "⚙️", "en_curso"],
                ["Completados", stats.completados,  "#38A169", "✅", "completados_hist"],
              ].map(([l, v, c, ic, accion]) => {
                const activo =
                  (accion === "todos"           && filtros.estado === "todos") ||
                  (accion === "Pendiente"        && filtros.estado === "Pendiente") ||
                  (accion === "en_curso"         && ["Asignado","En progreso"].includes(filtros.estado)) ||
                  (accion === "completados_hist" && seccion === "historial" && subHistorial === "completados");

                const handleClick = () => {
                  if (accion === "completados_hist") {
                    setSeccion("historial");
                    setSubHistorial("completados");
                  } else if (accion === "en_curso") {
                    setSeccion("tickets");
                    setFiltros(f => ({ ...f, estado: filtros.estado === "Asignado" ? "todos" : "Asignado" }));
                  } else {
                    setSeccion("tickets");
                    setFiltros(f => ({ ...f, estado: activo ? "todos" : accion }));
                  }
                };

                return (
                  <div key={l} onClick={handleClick}
                    style={{ background: activo ? c + "18" : darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${activo ? c + "66" : darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = c + "88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = activo ? c + "66" : darkMode ? "#1E293B" : "#E2E8F0"; e.currentTarget.style.transform = "none"; }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: c + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{ic}</div>
                    <div>
                      <p style={{ margin: 0, color: activo ? c : "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{l}</p>
                      <p style={{ margin: "2px 0 0", color: c, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{v}</p>
                    </div>
                    {activo && <span style={{ marginLeft: "auto", color: c, fontSize: 10, fontWeight: 700 }}>●</span>}
                  </div>
                );
              })}
            </div>

            {/* FILTROS */}
            <div className="filters-row" style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 2, background: darkMode ? "#111827" : "#FFFFFF", borderRadius: 8, padding: 3, border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>
                {(usuario?.rol === "director"
                  ? [["todos", "Todos los tickets"]]
                  : [["mis", "Mis tickets"], ["todos", "Todos"]]
                ).map(([v, l]) => (
                  <button key={v} onClick={() => setVista(v)} style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer", background: vista === v ? empColor : "transparent", color: vista === v ? "#fff" : "#64748B" }}>{l}</button>
                ))}
              </div>
              <input style={{ ...inpF, minWidth: 180 }} value={filtros.buscar} onChange={e => setFiltros(f => ({ ...f, buscar: e.target.value }))} placeholder="🔍 Buscar..." />
              <select style={inpF} value={filtros.estado} onChange={e => setFiltros(f => ({ ...f, estado: e.target.value }))}>
                <option value="todos">Todos los estados</option>
                {ESTADOS.filter(s => !["Completado","Cancelado"].includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select style={inpF} value={filtros.empresa} onChange={e => setFiltros(f => ({ ...f, empresa: e.target.value }))}>
                <option value="todas">Todas las empresas</option>
                {EMPRESAS.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
              <button onClick={() => setModalCrear(true)} className="btn-nuevo" style={{ ...btnS, background: empColor, color: "#fff", fontWeight: 900, marginLeft: "auto", padding: "9px 20px", fontSize: 13 }}>
                + Nuevo Ticket
              </button>
              <button onClick={() => {
                if (Notification.permission === "default") Notification.requestPermission();
                setModalMisTickets(true);
              }} className="btn-mis-tickets" style={{ ...btnS, background: darkMode ? "#1E293B" : "#E2E8F0", color: darkMode ? "#94A3B8" : "#334155", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, fontWeight: 700, padding: "9px 16px", fontSize: 13 }}>
                📝 Mis Tickets {misTicketsPersonales.filter(t => t.creadoPor === usuarioId && t.estado !== "hecho").length > 0 && <span style={{ background: "#E53E3E", color: "#fff", borderRadius: "50%", fontSize: 10, padding: "1px 5px", marginLeft: 4 }}>{misTicketsPersonales.filter(t => t.creadoPor === usuarioId && t.estado !== "hecho").length}</span>}
              </button>
            </div>

            {/* LISTA */}
            {ticketsFiltrados.length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px 20px" }}>
                <p style={{ fontSize: 50, marginBottom: 12 }}>📭</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: darkMode ? "#475569" : "#64748B" }}>No hay tickets todavía</p>
                <p style={{ fontSize: 13, color: darkMode ? "#334155" : "#94A3B8" }}>Pulsa "+ Nuevo Ticket" para crear el primero</p>
              </div>
            ) : (
              <div className="tickets-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                {ticketsFiltrados.map(t => <TarjetaTicket key={t.id} ticket={t} onClick={() => setDetalle(t)} />)}
              </div>
            )}
          </>
        )}

        {/* ── FICHAJE ── */}
        {seccion === "fichaje" && <SeccionFichaje darkMode={darkMode} fichajes={fichajes} fichajeActivo={fichajeActivo} ficharEntrada={ficharEntrada} ficharSalida={ficharSalida} />}

        {/* ── NÓMINAS ── */}
        {seccion === "nominas" && (() => {
          const esAdminDir = ["director","administrador"].includes(usuario?.rol);
          const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
          return (
            <div style={{ maxWidth:800 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
                <div>
                  <h2 style={{ margin:"0 0 4px", color: darkMode?"#E2E8F0":"#0F172A", fontWeight:800, fontSize:18 }}>💰 Nóminas</h2>
                  <p style={{ margin:0, color: darkMode?"#475569":"#64748B", fontSize:13 }}>
                    {esAdminDir ? "Gestiona las nóminas de todos los empleados" : "Tus nóminas disponibles para descargar"}
                  </p>
                </div>
                {esAdminDir && (
                  <button onClick={() => setModalNomina(true)}
                    style={{ background: empColor, border:"none", borderRadius:8, padding:"10px 20px", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                    + Subir nómina
                  </button>
                )}
              </div>
              {nominas.length === 0 ? (
                <div style={{ textAlign:"center", padding:"70px 20px" }}>
                  <p style={{ fontSize:50, marginBottom:12 }}>💰</p>
                  <p style={{ fontSize:15, fontWeight:700, color: darkMode?"#475569":"#64748B" }}>No hay nóminas disponibles</p>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {nominas.sort((a,b)=>b.anio-a.anio||(b.mes-a.mes)).map(n => {
                    const usr = USUARIOS.find(u=>u.id===n.usuarioId);
                    return (
                      <div key={n.id} style={{ background: darkMode?"#111827":"#FFFFFF", border:`1px solid ${darkMode?"#1E293B":"#E2E8F0"}`, borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
                        <div style={{ width:42, height:42, borderRadius:8, background:"#F6AD5522", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>💰</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ margin:"0 0 3px", color: darkMode?"#E2E8F0":"#0F172A", fontSize:14, fontWeight:700 }}>
                            {meses[n.mes-1]} {n.anio}
                          </p>
                          {esAdminDir && <p style={{ margin:0, color: darkMode?"#64748B":"#94A3B8", fontSize:12 }}>{usr?.nombre || "Usuario desconocido"} · {EMPRESAS.find(e=>e.id===usr?.empresaId)?.nombre}</p>}
                          <p style={{ margin:0, color: darkMode?"#334155":"#94A3B8", fontSize:11 }}>{n.nombre}</p>
                        </div>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <a href={n.dataUrl} download={n.nombre}
                            style={{ background:"#3182CE22", border:"1px solid #3182CE44", borderRadius:7, padding:"7px 14px", color:"#3182CE", fontSize:12, fontWeight:700, textDecoration:"none" }}>
                            ⬇️ Descargar
                          </a>
                          {esAdminDir && (
                            <button onClick={() => eliminarNomina(n.id)}
                              style={{ background:"none", border:"none", color: darkMode?"#475569":"#94A3B8", cursor:"pointer", fontSize:16, padding:"4px" }}>🗑️</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* Modal subir nómina */}
              {modalNomina && esAdminDir && <ModalSubirNomina darkMode={darkMode} onClose={() => setModalNomina(false)} onSubir={subirNomina} empColor={empColor} />}
            </div>
          );
        })()}

        {/* ── PERFIL ── */}
        {seccion === "perfil" && <SeccionPerfil darkMode={darkMode} usuarioId={usuarioId} usuario={usuario} pins={pins} setPins={setPins} empColor={empColor} EMPRESAS={EMPRESAS} />}

      </div>
      </div>
      </div>

      {modalCrear && <ModalCrearTicket usuarioActual={usuario} onClose={() => setModalCrear(false)} onCrear={crearTicket} />}
      {detalle    && <ModalDetalle ticket={detalle} usuarioActual={usuario} onClose={() => setDetalle(null)} onActualizar={(t) => actualizarTicket(t)} />}
      {modalMisTickets && <ModalMisTickets usuarioId={usuarioId} tickets={misTicketsPersonales.filter(t => t.creadoPor === usuarioId)} onClose={() => setModalMisTickets(false)} onCrear={guardarTicketPersonal} onVerDetalle={t => { setDetalleMiTicket(t); setModalMisTickets(false); }} />}
      {detalleMiTicket && <ModalDetalleMiTicket ticket={detalleMiTicket} onClose={() => setDetalleMiTicket(null)} onActualizar={actualizarTicketPersonal} />}
      {modalAdmin && <ModalAdministracion key={configVersion} onClose={() => setModalAdmin(false)} />}

      {/* Modal crear comunicado */}
      {modalComun && (
        <ModalComunicado
          darkMode={darkMode}
          usuarioId={usuarioId}
          empresaId={usuario?.empresaId ?? null}
          onClose={() => setModalComun(false)}
        />
      )}
      {comunicadoEditar && (
        <ModalComunicado
          darkMode={darkMode}
          usuarioId={usuarioId}
          empresaId={usuario?.empresaId ?? null}
          onClose={() => setComunicadoEditar(null)}
          comunicadoInicial={comunicadoEditar}
        />
      )}
    </div>
  );
}
// ── Constantes módulo Gestión Administrativa ─────────────────────────────
const DIAS_VACACIONES_ANUALES = 22;
const TIPO_LABELS = {
  vacaciones:  { label: "Vacaciones",   icon: "🏖️",  color: "#3182CE" },
  ausencia:    { label: "Ausencia",     icon: "🤒",  color: "#D4A017" },
  horasExtras: { label: "Horas extras", icon: "⏱️", color: "#805AD5" },
};
const ESTADO_COLORS = {
  pendiente:  { color: "#D4A017", bg: "#D4A01722", label: "Pendiente" },
  aprobada:   { color: "#38A169", bg: "#38A16922", label: "Aprobada"  },
  rechazada:  { color: "#E53E3E", bg: "#E53E3E22", label: "Rechazada" },
};
function genIdRRHH() { return "rrhh_" + Date.now() + "_" + Math.floor(Math.random() * 9999); }
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}
function diffDiasLaborables(inicio, fin) {
  if (!inicio || !fin) return 0;
  let count = 0;
  const d = new Date(inicio);
  const f = new Date(fin);
  while (d <= f) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

function GestionAdministrativa({ darkMode, usuarioActual, db, USUARIOS, EMPRESAS, addNotif, empColor }) {
  const [solicitudes, setSolicitudes]     = useState([]);
  const [vista, setVista]                 = useState("mis");          // mis | equipo | rrhh
  const [modalNueva, setModalNueva]       = useState(false);
  const [detalleSol, setDetalleSol]       = useState(null);
  const [filtroEmpresa, setFiltroEmpresa] = useState("todas");
  const [filtroTipo, setFiltroTipo]       = useState("todos");
  const [filtroEstado, setFiltroEstado]   = useState("todos");
  const [filtroAnio, setFiltroAnio]       = useState(String(new Date().getFullYear()));
  const [filtroPeriodo, setFiltroPeriodo] = useState("anual");        // anual | trimestre | mes
  const [filtroMes, setFiltroMes]         = useState("todos");
  const [filtroTrimestre, setFiltroTrimestre] = useState("todos");

  const esRRHH       = usuarioActual?.rol === "rrhh";
  const esAdmin      = ["director", "administrador", "rrhh"].includes(usuarioActual?.rol);
  const esEncargado  = usuarioActual?.rol === "encargado";

  // ── Firestore: escuchar solicitudes ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "solicitudesRRHH"), (snap) => {
      setSolicitudes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [db]);

  // ── Mis solicitudes ──
  const misSolicitudes = useMemo(() =>
    solicitudes.filter(s => s.usuarioId === usuarioActual?.id)
      .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)),
    [solicitudes, usuarioActual]
  );

  // ── Solicitudes de mi empresa (encargado) ──
  const solicitudesEquipo = useMemo(() => {
    if (!esEncargado && !esAdmin) return [];
    return solicitudes
      .filter(s => {
        const usr = USUARIOS.find(u => u.id === s.usuarioId);
        return usr?.empresaId === usuarioActual?.empresaId;
      })
      .filter(s => s.usuarioId !== usuarioActual?.id)
      .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
  }, [solicitudes, usuarioActual, esEncargado, esAdmin, USUARIOS]);

  // ── Saldo de vacaciones del usuario actual ──
  const saldoVacaciones = useMemo(() => {
    const anioActual = new Date().getFullYear();
    const aprobadas  = misSolicitudes
      .filter(s => s.tipo === "vacaciones" && s.estado === "aprobada")
      .filter(s => {
        const anio = s.fechaInicio ? new Date(s.fechaInicio).getFullYear() : null;
        return anio === anioActual;
      })
      .reduce((acc, s) => acc + (s.diasSolicitados || 0), 0);
    return { total: DIAS_VACACIONES_ANUALES, usados: aprobadas, disponibles: DIAS_VACACIONES_ANUALES - aprobadas };
  }, [misSolicitudes]);

  // ── Crear solicitud ──
  const crearSolicitud = async (data) => {
    const id  = genIdRRHH();
    const sol = {
      id,
      ...data,
      usuarioId:     usuarioActual.id,
      empresaId:     usuarioActual.empresaId,
      estado:        "pendiente",
      fechaCreacion: new Date().toISOString(),
      motivoRechazo: null,
      encargadoId:   null,
    };
    await setDoc(doc(db, "solicitudesRRHH", id), sol);
    // Notificar al encargado de la empresa
    const enc = USUARIOS.find(u => u.empresaId === usuarioActual.empresaId && u.rol === "encargado");
    if (enc) {
      addNotif({
        usuarioDestinoId: enc.id,
        tipo:             "rrhh_nueva",
        texto:            `Nueva solicitud de ${TIPO_LABELS[data.tipo]?.label}: ${usuarioActual.nombre} ha solicitado ${data.tipo === "vacaciones" ? data.diasSolicitados + " días" : data.tipo === "horasExtras" ? data.horasExtra + " horas" : "ausencia"}.`,
        solicitudId:      id,
      });
    }
    // También notificar a RRHH
    const rrhh = USUARIOS.find(u => u.rol === "rrhh");
    if (rrhh) {
      addNotif({
        usuarioDestinoId: rrhh.id,
        tipo:             "rrhh_nueva",
        texto:            `Nueva solicitud de ${TIPO_LABELS[data.tipo]?.label} de ${usuarioActual.nombre} (${EMPRESAS.find(e => e.id === usuarioActual.empresaId)?.nombre}).`,
        solicitudId:      id,
      });
    }
  };

  // ── Aprobar solicitud ──
  const aprobarSolicitud = async (sol) => {
    await updateDoc(doc(db, "solicitudesRRHH", sol.id), {
      estado:      "aprobada",
      encargadoId: usuarioActual.id,
      fechaGestion: new Date().toISOString(),
    });
    addNotif({
      usuarioDestinoId: sol.usuarioId,
      tipo:             "rrhh_aprobada",
      texto:            `Tu solicitud de ${TIPO_LABELS[sol.tipo]?.label} ha sido aprobada ✅`,
      solicitudId:      sol.id,
    });
    setDetalleSol(null);
  };

  // ── Rechazar solicitud ──
  const rechazarSolicitud = async (sol, motivo) => {
    await updateDoc(doc(db, "solicitudesRRHH", sol.id), {
      estado:        "rechazada",
      encargadoId:   usuarioActual.id,
      motivoRechazo: motivo,
      fechaGestion:  new Date().toISOString(),
    });
    addNotif({
      usuarioDestinoId: sol.usuarioId,
      tipo:             "rrhh_rechazada",
      texto:            `Tu solicitud de ${TIPO_LABELS[sol.tipo]?.label} ha sido rechazada. Motivo: ${motivo}`,
      solicitudId:      sol.id,
    });
    setDetalleSol(null);
  };

  // ── Cancelar solicitud (solo si está pendiente) ──
  const cancelarSolicitud = async (sol) => {
    await deleteDoc(doc(db, "solicitudesRRHH", sol.id));
    setDetalleSol(null);
  };

  // ── Vistas disponibles ──
  const vistas = [
    { id: "mis",    label: "Mis solicitudes",   icon: "👤" },
    ...(esEncargado || esAdmin ? [{ id: "equipo", label: "Mi equipo", icon: "👥" }] : []),
    ...(esRRHH || usuarioActual?.rol === "director" ? [{ id: "rrhh", label: "Dashboard RRHH", icon: "📊" }] : []),
  ];

  // ── Estilos comunes ──
  const s = {
    card:   { background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 12, padding: "18px 20px" },
    label:  { display: "block", color: darkMode ? "#64748B" : "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 5 },
    inp:    { fontFamily: "inherit", fontSize: 13, background: darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 6, padding: "9px 12px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none", width: "100%", boxSizing: "border-box" },
    btnPri: { fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "9px 18px", borderRadius: 7, border: "none", cursor: "pointer", background: empColor, color: "#fff" },
    btnOut: { fontFamily: "inherit", fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 7, border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, cursor: "pointer", background: "transparent", color: darkMode ? "#94A3B8" : "#475569" },
    muted:  { color: darkMode ? "#475569" : "#94A3B8", fontSize: 12 },
  };

  return (
    <div style={{ maxWidth: 1100 }}>

      {/* ── Cabecera ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 800, fontSize: 20 }}>
            👔 Gestión Administrativa
          </h2>
          <p style={s.muted}>Vacaciones · Ausencias · Horas extras · {EMPRESAS.find(e => e.id === usuarioActual?.empresaId)?.nombre}</p>
        </div>
        <button onClick={() => setModalNueva(true)} style={s.btnPri}>
          + Nueva solicitud
        </button>
      </div>

      {/* ── Saldo vacaciones (si es trabajador o encargado) ── */}
      {!esRRHH && (
        <SaldoVacaciones saldo={saldoVacaciones} darkMode={darkMode} empColor={empColor} />
      )}

      {/* ── Tabs de vista ── */}
      <div style={{ display: "flex", gap: 2, background: darkMode ? "#111827" : "#FFFFFF", borderRadius: 8, padding: 3, border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, marginBottom: 20, width: "fit-content" }}>
        {vistas.map(v => (
          <button key={v.id} onClick={() => setVista(v.id)}
            style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer",
              background: vista === v.id ? empColor : "transparent",
              color:      vista === v.id ? "#fff"   : (darkMode ? "#64748B" : "#64748B") }}>
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {/* ── Vista: Mis solicitudes ── */}
      {vista === "mis" && (
        <ListaSolicitudes
          solicitudes={misSolicitudes}
          darkMode={darkMode}
          USUARIOS={USUARIOS}
          EMPRESAS={EMPRESAS}
          onVer={setDetalleSol}
          s={s}
          titulo="Mis solicitudes"
          sinResultadosMsg="No tienes solicitudes registradas. Pulsa '+ Nueva solicitud' para comenzar."
        />
      )}

      {/* ── Vista: Equipo (encargado) ── */}
      {vista === "equipo" && (
        <VistaEquipo
          solicitudes={solicitudesEquipo}
          darkMode={darkMode}
          USUARIOS={USUARIOS}
          EMPRESAS={EMPRESAS}
          onVer={setDetalleSol}
          s={s}
          empColor={empColor}
          filtroTipo={filtroTipo}
          setFiltroTipo={setFiltroTipo}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
        />
      )}

      {/* ── Vista: Dashboard RRHH ── */}
      {vista === "rrhh" && (
        <DashboardRRHH
          solicitudes={solicitudes}
          darkMode={darkMode}
          USUARIOS={USUARIOS}
          EMPRESAS={EMPRESAS}
          onVer={setDetalleSol}
          s={s}
          empColor={empColor}
          filtroEmpresa={filtroEmpresa}   setFiltroEmpresa={setFiltroEmpresa}
          filtroTipo={filtroTipo}         setFiltroTipo={setFiltroTipo}
          filtroEstado={filtroEstado}     setFiltroEstado={setFiltroEstado}
          filtroAnio={filtroAnio}         setFiltroAnio={setFiltroAnio}
          filtroPeriodo={filtroPeriodo}   setFiltroPeriodo={setFiltroPeriodo}
          filtroMes={filtroMes}           setFiltroMes={setFiltroMes}
          filtroTrimestre={filtroTrimestre} setFiltroTrimestre={setFiltroTrimestre}
        />
      )}

      {/* ── Modal nueva solicitud ── */}
      {modalNueva && (
        <ModalNuevaSolicitud
          darkMode={darkMode}
          usuario={usuarioActual}
          saldo={saldoVacaciones}
          s={s}
          onClose={() => setModalNueva(false)}
          onCrear={async (data) => { await crearSolicitud(data); setModalNueva(false); }}
        />
      )}

      {/* ── Modal detalle solicitud ── */}
      {detalleSol && (
        <ModalDetalleSolicitud
          sol={detalleSol}
          darkMode={darkMode}
          usuarioActual={usuarioActual}
          USUARIOS={USUARIOS}
          EMPRESAS={EMPRESAS}
          s={s}
          empColor={empColor}
          onClose={() => setDetalleSol(null)}
          onAprobar={aprobarSolicitud}
          onRechazar={rechazarSolicitud}
          onCancelar={cancelarSolicitud}
        />
      )}
    </div>
  );
}

// ── Saldo de vacaciones ─────────────────────────────────────────────────────
function SaldoVacaciones({ saldo, darkMode, empColor }) {
  const pct = Math.round((saldo.usados / saldo.total) * 100);
  return (
    <div style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <div style={{ fontSize: 28 }}>🏖️</div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 700, fontSize: 14 }}>Saldo de vacaciones {new Date().getFullYear()}</span>
          <span style={{ color: darkMode ? "#94A3B8" : "#64748B", fontSize: 13 }}>
            <strong style={{ color: empColor }}>{saldo.disponibles}</strong> disponibles de {saldo.total} días laborables
          </span>
        </div>
        <div style={{ height: 8, background: darkMode ? "#1E293B" : "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", background: pct > 80 ? "#E53E3E" : pct > 50 ? "#D4A017" : empColor, borderRadius: 99, transition: "width .4s" }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
          <span style={{ color: darkMode ? "#475569" : "#94A3B8", fontSize: 11 }}>✅ Usados: {saldo.usados} días</span>
          <span style={{ color: darkMode ? "#475569" : "#94A3B8", fontSize: 11 }}>📅 Disponibles: {saldo.disponibles} días</span>
          <span style={{ color: darkMode ? "#475569" : "#94A3B8", fontSize: 11 }}>📋 Total convenio: {saldo.total} días</span>
        </div>
      </div>
    </div>
  );
}

// ── Lista de solicitudes (reutilizable) ────────────────────────────────────
function ListaSolicitudes({ solicitudes, darkMode, USUARIOS, EMPRESAS, onVer, s, titulo, sinResultadosMsg }) {
  if (solicitudes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "70px 20px" }}>
        <p style={{ fontSize: 46, marginBottom: 10 }}>📋</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: darkMode ? "#475569" : "#64748B" }}>Sin solicitudes</p>
        <p style={{ fontSize: 13, color: darkMode ? "#334155" : "#94A3B8", maxWidth: 360, margin: "4px auto 0" }}>{sinResultadosMsg}</p>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {solicitudes.map(sol => (
        <TarjetaSolicitud key={sol.id} sol={sol} darkMode={darkMode} USUARIOS={USUARIOS} EMPRESAS={EMPRESAS} onVer={onVer} />
      ))}
    </div>
  );
}

// ── Tarjeta de solicitud ────────────────────────────────────────────────────
function TarjetaSolicitud({ sol, darkMode, USUARIOS, EMPRESAS, onVer }) {
  const tipo   = TIPO_LABELS[sol.tipo]   || { label: sol.tipo, icon: "📄", color: "#94A3B8" };
  const estado = ESTADO_COLORS[sol.estado] || ESTADO_COLORS.pendiente;
  const usr    = USUARIOS.find(u => u.id === sol.usuarioId);
  const emp    = EMPRESAS.find(e => e.id === sol.empresaId);

  return (
    <div onClick={() => onVer(sol)}
      style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "border-color .15s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = tipo.color + "88"}
      onMouseLeave={e => e.currentTarget.style.borderColor = darkMode ? "#1E293B" : "#E2E8F0"}
    >
      {/* Icono tipo */}
      <div style={{ width: 44, height: 44, borderRadius: 10, background: tipo.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
        {tipo.icon}
      </div>

      {/* Info principal */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 700, fontSize: 14 }}>{tipo.label}</span>
          {usr && <span style={{ color: darkMode ? "#64748B" : "#94A3B8", fontSize: 12 }}>· {usr.nombre}</span>}
          {emp && <span style={{ background: emp.color + "18", color: emp.color, borderRadius: 4, padding: "1px 7px", fontSize: 10, fontWeight: 700 }}>{emp.nombre}</span>}
        </div>
        <div style={{ color: darkMode ? "#64748B" : "#94A3B8", fontSize: 12 }}>
          {sol.tipo === "vacaciones" && `📅 ${fmtDate(sol.fechaInicio)} → ${fmtDate(sol.fechaFin)} · ${sol.diasSolicitados} días`}
          {sol.tipo === "ausencia"    && `📅 ${fmtDate(sol.fecha)} · ${sol.motivo || "Sin motivo especificado"}`}
          {sol.tipo === "horasExtras" && `📅 ${fmtDate(sol.fecha)} · ${sol.horasExtra}h extra`}
        </div>
        <div style={{ marginTop: 4, color: darkMode ? "#334155" : "#CBD5E1", fontSize: 11 }}>
          Solicitado el {fmtDate(sol.fechaCreacion)}
          {sol.motivoRechazo && <span style={{ color: "#E53E3E", marginLeft: 8 }}>· {sol.motivoRechazo}</span>}
        </div>
      </div>

      {/* Badge estado */}
      <div style={{ flexShrink: 0 }}>
        <span style={{ background: estado.bg, color: estado.color, border: `1px solid ${estado.color}55`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
          {estado.estado === "pendiente" ? "⏳ " : estado.estado === "aprobada" ? "✅ " : "❌ "}
          {estado.label}
        </span>
      </div>
    </div>
  );
}

// ── Vista equipo (encargado) ────────────────────────────────────────────────
function VistaEquipo({ solicitudes, darkMode, USUARIOS, EMPRESAS, onVer, s, empColor, filtroTipo, setFiltroTipo, filtroEstado, setFiltroEstado }) {
  const pendientes = solicitudes.filter(s => s.estado === "pendiente");

  let filtradas = solicitudes;
  if (filtroTipo   !== "todos") filtradas = filtradas.filter(s => s.tipo    === filtroTipo);
  if (filtroEstado !== "todos") filtradas = filtradas.filter(s => s.estado  === filtroEstado);

  return (
    <div>
      {/* Alerta de pendientes */}
      {pendientes.length > 0 && (
        <div style={{ background: "#D4A01722", border: "1px solid #D4A01755", borderRadius: 10, padding: "12px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>⏳</span>
          <span style={{ color: "#D4A017", fontWeight: 700, fontSize: 13 }}>
            {pendientes.length} solicitud{pendientes.length > 1 ? "es" : ""} pendiente{pendientes.length > 1 ? "s" : ""} de aprobación
          </span>
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <select style={{ ...s.inp, width: "auto", minWidth: 140 }} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
          <option value="todos">Todos los tipos</option>
          <option value="vacaciones">Vacaciones</option>
          <option value="ausencia">Ausencias</option>
          <option value="horasExtras">Horas extras</option>
        </select>
        <select style={{ ...s.inp, width: "auto", minWidth: 140 }} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>

      <ListaSolicitudes
        solicitudes={filtradas}
        darkMode={darkMode}
        USUARIOS={USUARIOS}
        EMPRESAS={EMPRESAS}
        onVer={onVer}
        s={s}
        titulo="Solicitudes del equipo"
        sinResultadosMsg="No hay solicitudes de tu equipo para este filtro."
      />
    </div>
  );
}

// ── Dashboard RRHH ──────────────────────────────────────────────────────────
function DashboardRRHH({
  solicitudes, darkMode, USUARIOS, EMPRESAS, onVer, s, empColor,
  filtroEmpresa, setFiltroEmpresa, filtroTipo, setFiltroTipo,
  filtroEstado, setFiltroEstado, filtroAnio, setFiltroAnio,
  filtroPeriodo, setFiltroPeriodo, filtroMes, setFiltroMes,
  filtroTrimestre, setFiltroTrimestre,
}) {
  const [subVista, setSubVista] = useState("resumen"); // resumen | detalle | personas

  const anios = useMemo(() => {
    const set = new Set(solicitudes.map(s => {
      const d = s.fechaInicio || s.fecha || s.fechaCreacion;
      return d ? new Date(d).getFullYear() : null;
    }).filter(Boolean));
    set.add(new Date().getFullYear());
    return [...set].sort((a, b) => b - a);
  }, [solicitudes]);

  const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  // Filtrar solicitudes
  const filtradas = useMemo(() => {
    return solicitudes.filter(s => {
      const d = new Date(s.fechaInicio || s.fecha || s.fechaCreacion);
      const anioSol = d.getFullYear();
      const mesSol  = d.getMonth() + 1;
      const trimSol = Math.ceil(mesSol / 3);

      if (String(anioSol) !== filtroAnio) return false;

      if (filtroPeriodo === "mes" && filtroMes !== "todos" && String(mesSol) !== filtroMes) return false;
      if (filtroPeriodo === "trimestre" && filtroTrimestre !== "todos" && String(trimSol) !== filtroTrimestre) return false;

      if (filtroEmpresa !== "todas") {
        const usr = USUARIOS.find(u => u.id === s.usuarioId);
        if (String(usr?.empresaId) !== filtroEmpresa) return false;
      }
      if (filtroTipo   !== "todos" && s.tipo    !== filtroTipo)   return false;
      if (filtroEstado !== "todos" && s.estado  !== filtroEstado) return false;
      return true;
    });
  }, [solicitudes, filtroAnio, filtroPeriodo, filtroMes, filtroTrimestre, filtroEmpresa, filtroTipo, filtroEstado, USUARIOS]);

  // KPIs globales
  const kpis = useMemo(() => {
    const vacaciones  = filtradas.filter(s => s.tipo === "vacaciones"  && s.estado === "aprobada");
    const ausencias   = filtradas.filter(s => s.tipo === "ausencia"    && s.estado === "aprobada");
    const horasExtras = filtradas.filter(s => s.tipo === "horasExtras" && s.estado === "aprobada");
    const pendientes  = filtradas.filter(s => s.estado === "pendiente");
    return {
      totalDiasVac:  vacaciones.reduce((acc, s)  => acc + (s.diasSolicitados || 0), 0),
      totalAusencias: ausencias.length,
      totalHoras:    horasExtras.reduce((acc, s) => acc + (s.horasExtra || 0), 0),
      pendientes:    pendientes.length,
    };
  }, [filtradas]);

  // Resumen por empresa
  const resumenEmpresas = useMemo(() => {
    return EMPRESAS.map(emp => {
      const sols = filtradas.filter(s => {
        const usr = USUARIOS.find(u => u.id === s.usuarioId);
        return usr?.empresaId === emp.id;
      });
      const empleados = USUARIOS.filter(u => u.empresaId === emp.id && u.rol !== "rrhh").length;
      return {
        empresa: emp,
        empleados,
        vacaciones:  sols.filter(s => s.tipo === "vacaciones"  && s.estado === "aprobada").reduce((a, s) => a + (s.diasSolicitados || 0), 0),
        ausencias:   sols.filter(s => s.tipo === "ausencia"    && s.estado === "aprobada").length,
        horasExtras: sols.filter(s => s.tipo === "horasExtras" && s.estado === "aprobada").reduce((a, s) => a + (s.horasExtra || 0), 0),
        pendientes:  sols.filter(s => s.estado === "pendiente").length,
        total:       sols.length,
      };
    }).filter(r => r.total > 0 || r.empleados > 0);
  }, [filtradas, EMPRESAS, USUARIOS]);

  // Resumen por persona
  const resumenPersonas = useMemo(() => {
    const trabajadores = USUARIOS.filter(u => {
      if (filtroEmpresa !== "todas" && String(u.empresaId) !== filtroEmpresa) return false;
      return u.rol !== "rrhh";
    });
    return trabajadores.map(usr => {
      const sols = filtradas.filter(s => s.usuarioId === usr.id);
      const emp  = EMPRESAS.find(e => e.id === usr.empresaId);
      return {
        usuario:     usr,
        empresa:     emp,
        vacaciones:  sols.filter(s => s.tipo === "vacaciones"  && s.estado === "aprobada").reduce((a, s) => a + (s.diasSolicitados || 0), 0),
        ausencias:   sols.filter(s => s.tipo === "ausencia"    && s.estado === "aprobada").length,
        horasExtras: sols.filter(s => s.tipo === "horasExtras" && s.estado === "aprobada").reduce((a, s) => a + (s.horasExtra || 0), 0),
        pendientes:  sols.filter(s => s.estado === "pendiente").length,
      };
    }).filter(r => r.vacaciones + r.ausencias + r.horasExtras + r.pendientes > 0);
  }, [filtradas, USUARIOS, EMPRESAS, filtroEmpresa]);

  return (
    <div>
      {/* ── Filtros globales ── */}
      <div style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
        <p style={{ margin: "0 0 12px", color: darkMode ? "#94A3B8" : "#64748B", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px" }}>Filtros del informe</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>

          {/* Año */}
          <select style={{ ...s.inp, width: "auto", minWidth: 100 }} value={filtroAnio} onChange={e => setFiltroAnio(e.target.value)}>
            {anios.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* Periodo */}
          <div style={{ display: "flex", gap: 2, background: darkMode ? "#0D1424" : "#F8FAFC", borderRadius: 7, padding: 2, border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>
            {[["anual","Anual"],["trimestre","Trimestral"],["mes","Mensual"]].map(([v, l]) => (
              <button key={v} onClick={() => setFiltroPeriodo(v)}
                style={{ fontFamily: "inherit", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 5, border: "none", cursor: "pointer",
                  background: filtroPeriodo === v ? empColor : "transparent",
                  color:      filtroPeriodo === v ? "#fff"   : (darkMode ? "#64748B" : "#64748B") }}>
                {l}
              </button>
            ))}
          </div>

          {/* Mes (si periodo === mes) */}
          {filtroPeriodo === "mes" && (
            <select style={{ ...s.inp, width: "auto", minWidth: 130 }} value={filtroMes} onChange={e => setFiltroMes(e.target.value)}>
              <option value="todos">Todos los meses</option>
              {MESES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
            </select>
          )}

          {/* Trimestre (si periodo === trimestre) */}
          {filtroPeriodo === "trimestre" && (
            <select style={{ ...s.inp, width: "auto", minWidth: 140 }} value={filtroTrimestre} onChange={e => setFiltroTrimestre(e.target.value)}>
              <option value="todos">Todos los trimestres</option>
              <option value="1">Q1 (Ene–Mar)</option>
              <option value="2">Q2 (Abr–Jun)</option>
              <option value="3">Q3 (Jul–Sep)</option>
              <option value="4">Q4 (Oct–Dic)</option>
            </select>
          )}

          {/* Empresa */}
          <select style={{ ...s.inp, width: "auto", minWidth: 180 }} value={filtroEmpresa} onChange={e => setFiltroEmpresa(e.target.value)}>
            <option value="todas">Todas las empresas</option>
            {EMPRESAS.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>

          {/* Tipo */}
          <select style={{ ...s.inp, width: "auto", minWidth: 140 }} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
            <option value="todos">Todos los tipos</option>
            <option value="vacaciones">Vacaciones</option>
            <option value="ausencia">Ausencias</option>
            <option value="horasExtras">Horas extras</option>
          </select>

          {/* Estado */}
          <select style={{ ...s.inp, width: "auto", minWidth: 140 }} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobada">Aprobadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* ── KPIs globales ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "🏖️", label: "Días de vacaciones",  v: kpis.totalDiasVac,   color: "#3182CE", sub: "días aprobados" },
          { icon: "🤒", label: "Ausencias",            v: kpis.totalAusencias, color: "#D4A017", sub: "aprobadas" },
          { icon: "⏱️", label: "Horas extras",         v: kpis.totalHoras,     color: "#805AD5", sub: "horas registradas" },
          { icon: "⏳", label: "Pendientes de gestión",v: kpis.pendientes,     color: "#E53E3E", sub: "solicitudes" },
        ].map((k, i) => (
          <div key={i} style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: k.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{k.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: darkMode ? "#E2E8F0" : "#0F172A", lineHeight: 1 }}>{k.v}</div>
            <div style={{ color: k.color, fontWeight: 700, fontSize: 12, marginTop: 3 }}>{k.label}</div>
            <div style={{ color: darkMode ? "#334155" : "#94A3B8", fontSize: 11, marginTop: 1 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Sub-vistas ── */}
      <div style={{ display: "flex", gap: 2, background: darkMode ? "#111827" : "#FFFFFF", borderRadius: 8, padding: 3, border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, marginBottom: 20, width: "fit-content" }}>
        {[["resumen","📊 Por empresa"],["personas","👤 Por persona"],["detalle","📋 Detalle"]].map(([v, l]) => (
          <button key={v} onClick={() => setSubVista(v)}
            style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              background: subVista === v ? empColor : "transparent",
              color:      subVista === v ? "#fff"   : (darkMode ? "#64748B" : "#64748B") }}>
            {l}
          </button>
        ))}
      </div>

      {/* ── Resumen por empresa ── */}
      {subVista === "resumen" && (
        <div style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: darkMode ? "#0D1424" : "#F8FAFC" }}>
                {["Empresa","Empleados","Días vacac.","Ausencias","Horas extra","Pendientes"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: darkMode ? "#64748B" : "#94A3B8", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: ".4px", borderBottom: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resumenEmpresas.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "50px 20px", color: darkMode ? "#475569" : "#94A3B8", fontSize: 13 }}>No hay datos para este periodo</td></tr>
              ) : resumenEmpresas.map(r => (
                <tr key={r.empresa.id} style={{ borderBottom: `1px solid ${darkMode ? "#0D1424" : "#F1F5F9"}` }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: r.empresa.color, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, color: darkMode ? "#E2E8F0" : "#0F172A" }}>{r.empresa.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: darkMode ? "#94A3B8" : "#64748B" }}>{r.empleados}</td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#3182CE", fontWeight: 700 }}>{r.vacaciones} días</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#D4A017", fontWeight: 700 }}>{r.ausencias}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#805AD5", fontWeight: 700 }}>{r.horasExtras}h</span></td>
                  <td style={{ padding: "12px 16px" }}>
                    {r.pendientes > 0
                      ? <span style={{ background: "#E53E3E22", color: "#E53E3E", border: "1px solid #E53E3E55", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>⏳ {r.pendientes}</span>
                      : <span style={{ color: "#38A169", fontSize: 12 }}>✅ Al día</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Resumen por persona ── */}
      {subVista === "personas" && (
        <div style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: darkMode ? "#0D1424" : "#F8FAFC" }}>
                {["Empleado","Empresa","Días vacac.","Ausencias","Horas extra","Pendientes"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: darkMode ? "#64748B" : "#94A3B8", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: ".4px", borderBottom: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resumenPersonas.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "50px 20px", color: darkMode ? "#475569" : "#94A3B8", fontSize: 13 }}>No hay datos para este filtro</td></tr>
              ) : resumenPersonas.map(r => (
                <tr key={r.usuario.id} style={{ borderBottom: `1px solid ${darkMode ? "#0D1424" : "#F1F5F9"}` }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: r.empresa?.color + "44", border: `2px solid ${r.empresa?.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                        {r.usuario.nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, color: darkMode ? "#E2E8F0" : "#0F172A", fontSize: 13 }}>{r.usuario.nombre}</p>
                        <p style={{ margin: 0, color: darkMode ? "#475569" : "#94A3B8", fontSize: 11 }}>{r.usuario.rol}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: r.empresa?.color + "18", color: r.empresa?.color, borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{r.empresa?.nombre}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#3182CE", fontWeight: 700 }}>{r.vacaciones} / {DIAS_VACACIONES_ANUALES}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#D4A017", fontWeight: 700 }}>{r.ausencias}</span></td>
                  <td style={{ padding: "12px 16px" }}><span style={{ color: "#805AD5", fontWeight: 700 }}>{r.horasExtras}h</span></td>
                  <td style={{ padding: "12px 16px" }}>
                    {r.pendientes > 0
                      ? <span style={{ background: "#E53E3E22", color: "#E53E3E", border: "1px solid #E53E3E55", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>⏳ {r.pendientes}</span>
                      : <span style={{ color: "#38A169", fontSize: 12 }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Detalle: lista completa ── */}
      {subVista === "detalle" && (
        <ListaSolicitudes
          solicitudes={filtradas.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))}
          darkMode={darkMode}
          USUARIOS={USUARIOS}
          EMPRESAS={EMPRESAS}
          onVer={onVer}
          s={s}
          titulo="Detalle de solicitudes"
          sinResultadosMsg="No hay solicitudes para este filtro."
        />
      )}
    </div>
  );
}

// ── Modal: nueva solicitud ──────────────────────────────────────────────────
function ModalNuevaSolicitud({ darkMode, usuario, saldo, s, onClose, onCrear }) {
  const [tipo, setTipo]               = useState("vacaciones");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin]       = useState("");
  const [fecha, setFecha]             = useState("");
  const [motivo, setMotivo]           = useState("");
  const [descripcion, setDesc]        = useState("");
  const [horasExtra, setHoras]        = useState("");
  const [loading, setLoading]         = useState(false);

  const diasSolicitados = tipo === "vacaciones" ? diffDiasLaborables(fechaInicio, fechaFin) : 0;
  const sinSaldo        = tipo === "vacaciones" && diasSolicitados > saldo.disponibles;
  const canSubmit       = tipo === "vacaciones"
    ? fechaInicio && fechaFin && diasSolicitados > 0 && !sinSaldo
    : tipo === "ausencia"
    ? fecha && motivo
    : fecha && horasExtra && Number(horasExtra) > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    const base = { tipo, descripcion: descripcion.trim() || null };
    if (tipo === "vacaciones") Object.assign(base, { fechaInicio, fechaFin, diasSolicitados });
    if (tipo === "ausencia")   Object.assign(base, { fecha, motivo });
    if (tipo === "horasExtras") Object.assign(base, { fecha, horasExtra: Number(horasExtra) });
    await onCrear(base);
    setLoading(false);
  };

  const overlay = { position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" };
  const box     = { background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 14, width: "100%", maxWidth: 520, padding: 28, boxShadow: "0 24px 80px #0008", margin: "auto" };

  return (
    <div style={overlay} onMouseDown={onClose}>
      <div style={box} onMouseDown={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: darkMode ? "#E2E8F0" : "#0F172A" }}>📋 Nueva solicitud</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>

        {/* Selector tipo */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {Object.entries(TIPO_LABELS).map(([k, v]) => (
            <button key={k} onClick={() => setTipo(k)}
              style={{ flex: 1, fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "10px 6px", borderRadius: 8, border: `2px solid ${tipo === k ? v.color : darkMode ? "#2E3A55" : "#E2E8F0"}`, cursor: "pointer",
                background: tipo === k ? v.color + "22" : darkMode ? "#0D1424" : "#F8FAFC",
                color:      tipo === k ? v.color         : darkMode ? "#64748B" : "#94A3B8" }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Vacaciones */}
          {tipo === "vacaciones" && (
            <>
              <div style={{ background: "#3182CE11", border: "1px solid #3182CE33", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#3182CE" }}>
                🏖️ Tienes <strong>{saldo.disponibles} días disponibles</strong> de {saldo.total} días laborables anuales
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={s.label}>Fecha de inicio *</label>
                  <input type="date" style={{ ...s.inp, colorScheme: "dark" }} value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label style={s.label}>Fecha de fin *</label>
                  <input type="date" style={{ ...s.inp, colorScheme: "dark" }} value={fechaFin} onChange={e => setFechaFin(e.target.value)} min={fechaInicio || new Date().toISOString().split("T")[0]} />
                </div>
              </div>
              {fechaInicio && fechaFin && (
                <div style={{ background: sinSaldo ? "#E53E3E11" : "#38A16911", border: `1px solid ${sinSaldo ? "#E53E3E33" : "#38A16933"}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: sinSaldo ? "#E53E3E" : "#38A169" }}>
                  {sinSaldo
                    ? `⚠️ No tienes suficiente saldo. Estás solicitando ${diasSolicitados} días pero solo tienes ${saldo.disponibles} disponibles.`
                    : `✅ Solicitando ${diasSolicitados} día${diasSolicitados !== 1 ? "s" : ""} laborable${diasSolicitados !== 1 ? "s" : ""}. Te quedarán ${saldo.disponibles - diasSolicitados} días.`
                  }
                </div>
              )}
            </>
          )}

          {/* Ausencia */}
          {tipo === "ausencia" && (
            <>
              <div>
                <label style={s.label}>Fecha *</label>
                <input type="date" style={{ ...s.inp, colorScheme: "dark" }} value={fecha} onChange={e => setFecha(e.target.value)} />
              </div>
              <div>
                <label style={s.label}>Motivo *</label>
                <select style={s.inp} value={motivo} onChange={e => setMotivo(e.target.value)}>
                  <option value="">Selecciona el motivo...</option>
                  <option value="Médico">Médico / Consulta médica</option>
                  <option value="Familiar">Asunto familiar</option>
                  <option value="Personal">Asunto personal</option>
                  <option value="Urgencia">Urgencia</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </>
          )}

          {/* Horas extras */}
          {tipo === "horasExtras" && (
            <>
              <div>
                <label style={s.label}>Fecha *</label>
                <input type="date" style={{ ...s.inp, colorScheme: "dark" }} value={fecha} onChange={e => setFecha(e.target.value)} />
              </div>
              <div>
                <label style={s.label}>Número de horas extras *</label>
                <input type="number" min={0.5} max={12} step={0.5} style={s.inp} value={horasExtra} onChange={e => setHoras(e.target.value)} placeholder="Ej: 2.5" />
              </div>
            </>
          )}

          {/* Descripción opcional siempre */}
          <div>
            <label style={s.label}>Descripción / notas (opcional)</label>
            <textarea style={{ ...s.inp, resize: "vertical", minHeight: 70 }} value={descripcion} onChange={e => setDesc(e.target.value)} placeholder="Información adicional para el encargado..." />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8 }}>
            <button onClick={onClose} style={s.btnOut}>Cancelar</button>
            <button onClick={submit} disabled={!canSubmit || loading}
              style={{ ...s.btnPri, opacity: (!canSubmit || loading) ? 0.5 : 1, cursor: (!canSubmit || loading) ? "not-allowed" : "pointer" }}>
              {loading ? "Enviando..." : "Enviar solicitud →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal: detalle y gestión de solicitud ───────────────────────────────────
function ModalDetalleSolicitud({ sol, darkMode, usuarioActual, USUARIOS, EMPRESAS, s, empColor, onClose, onAprobar, onRechazar, onCancelar }) {
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [rechazando, setRechazando]       = useState(false);
  const [loading, setLoading]             = useState(false);

  const tipo    = TIPO_LABELS[sol.tipo]    || { label: sol.tipo, icon: "📄", color: "#94A3B8" };
  const estado  = ESTADO_COLORS[sol.estado] || ESTADO_COLORS.pendiente;
  const usr     = USUARIOS.find(u => u.id  === sol.usuarioId);
  const emp     = EMPRESAS.find(e => e.id  === sol.empresaId);
  const gestor  = sol.encargadoId ? USUARIOS.find(u => u.id === sol.encargadoId) : null;

  const puedeGestionar = (usuarioActual?.rol === "encargado" && usuarioActual?.empresaId === sol.empresaId)
    || ["director", "administrador", "rrhh"].includes(usuarioActual?.rol);
  const esMia          = sol.usuarioId === usuarioActual?.id;
  const puedeCancelar  = esMia && sol.estado === "pendiente";

  const overlay = { position: "fixed", inset: 0, background: "#00000099", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 1000, padding: 20, overflowY: "auto" };
  const box     = { background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 14, width: "100%", maxWidth: 540, padding: 28, boxShadow: "0 24px 80px #0008", margin: "auto" };

  return (
    <div style={overlay} onMouseDown={onClose}>
      <div style={box} onMouseDown={e => e.stopPropagation()}>
        {/* Cabecera */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: tipo.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{tipo.icon}</div>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: darkMode ? "#E2E8F0" : "#0F172A" }}>{tipo.label}</h2>
              <p style={{ margin: 0, color: darkMode ? "#64748B" : "#94A3B8", fontSize: 12 }}>Solicitado el {fmtDate(sol.fechaCreacion)}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: estado.bg, color: estado.color, border: `1px solid ${estado.color}55`, borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>
              {sol.estado === "pendiente" ? "⏳ " : sol.estado === "aprobada" ? "✅ " : "❌ "}
              {estado.label}
            </span>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748B", fontSize: 22, cursor: "pointer" }}>×</button>
          </div>
        </div>

        {/* Info del solicitante */}
        <div style={{ background: darkMode ? "#0D1424" : "#F8FAFC", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: emp?.color + "44", border: `2px solid ${emp?.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
            {usr?.nombre?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: darkMode ? "#E2E8F0" : "#0F172A", fontSize: 14 }}>{usr?.nombre}</p>
            <p style={{ margin: 0, color: darkMode ? "#475569" : "#94A3B8", fontSize: 12 }}>{usr?.rol} · {emp?.nombre}</p>
          </div>
        </div>

        {/* Datos de la solicitud */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {sol.tipo === "vacaciones" && (
            <>
              <Row label="Fechas" v={`${fmtDate(sol.fechaInicio)} → ${fmtDate(sol.fechaFin)}`} darkMode={darkMode} />
              <Row label="Días laborables" v={`${sol.diasSolicitados} días`} color={tipo.color} darkMode={darkMode} />
            </>
          )}
          {sol.tipo === "ausencia" && (
            <>
              <Row label="Fecha" v={fmtDate(sol.fecha)} darkMode={darkMode} />
              <Row label="Motivo" v={sol.motivo} darkMode={darkMode} />
            </>
          )}
          {sol.tipo === "horasExtras" && (
            <>
              <Row label="Fecha" v={fmtDate(sol.fecha)} darkMode={darkMode} />
              <Row label="Horas extras" v={`${sol.horasExtra}h`} color={tipo.color} darkMode={darkMode} />
            </>
          )}
          {sol.descripcion && <Row label="Notas" v={sol.descripcion} darkMode={darkMode} />}
          {gestor && <Row label="Gestionado por" v={gestor.nombre} darkMode={darkMode} />}
          {sol.motivoRechazo && <Row label="Motivo rechazo" v={sol.motivoRechazo} color="#E53E3E" darkMode={darkMode} />}
        </div>

        {/* Acciones encargado */}
        {puedeGestionar && sol.estado === "pendiente" && (
          <>
            {!rechazando ? (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={async () => { setLoading(true); await onAprobar(sol); }} disabled={loading}
                  style={{ flex: 1, fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "11px", borderRadius: 8, border: "none", cursor: "pointer", background: "#38A169", color: "#fff", opacity: loading ? 0.6 : 1 }}>
                  ✅ Aprobar solicitud
                </button>
                <button onClick={() => setRechazando(true)}
                  style={{ flex: 1, fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "11px", borderRadius: 8, border: "none", cursor: "pointer", background: "#E53E3E", color: "#fff" }}>
                  ❌ Rechazar
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={s.label}>Motivo del rechazo *</label>
                  <textarea style={{ ...s.inp, minHeight: 80, resize: "vertical" }} value={motivoRechazo} onChange={e => setMotivoRechazo(e.target.value)} placeholder="Explica el motivo del rechazo para informar al empleado..." />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setRechazando(false)} style={{ ...s.btnOut, flex: 1 }}>Volver</button>
                  <button onClick={async () => { if (!motivoRechazo.trim()) return; setLoading(true); await onRechazar(sol, motivoRechazo.trim()); }}
                    disabled={!motivoRechazo.trim() || loading}
                    style={{ flex: 1, fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "11px", borderRadius: 8, border: "none", cursor: !motivoRechazo.trim() ? "not-allowed" : "pointer", background: "#E53E3E", color: "#fff", opacity: (!motivoRechazo.trim() || loading) ? 0.5 : 1 }}>
                    {loading ? "Rechazando..." : "Confirmar rechazo"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Cancelar (propio, pendiente) */}
        {puedeCancelar && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}` }}>
            <button onClick={async () => { setLoading(true); await onCancelar(sol); }}
              style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 7, border: `1px solid ${darkMode ? "#2E3A55" : "#E2E8F0"}`, cursor: "pointer", background: "transparent", color: darkMode ? "#475569" : "#94A3B8" }}>
              🗑️ Cancelar solicitud
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helper: fila de detalle ─────────────────────────────────────────────────
function Row({ label, v, color, darkMode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "8px 0", borderBottom: `1px solid ${darkMode ? "#0D1424" : "#F1F5F9"}` }}>
      <span style={{ color: darkMode ? "#475569" : "#94A3B8", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ color: color || (darkMode ? "#E2E8F0" : "#0F172A"), fontSize: 13, fontWeight: color ? 700 : 400, textAlign: "right" }}>{v}</span>
    </div>
  );
}
