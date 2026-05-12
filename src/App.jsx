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
    imagenes:                  JSON.stringify(t.imagenes || []),
    comentarios:               JSON.stringify(t.comentarios || []),
    pendienteEliminacion:      t.pendienteEliminacion      || false,
    solicitadoPor:             t.solicitadoPor              ?? null,
    fechaSolicitudEliminacion: t.fechaSolicitudEliminacion  ?? null,
  };
}
function ticketFromFirestore(t) {
  return {
    ...t,
    imagenes:                  typeof t.imagenes === "string" ? JSON.parse(t.imagenes) : (t.imagenes || []),
    comentarios:               typeof t.comentarios === "string" ? JSON.parse(t.comentarios) : (t.comentarios || []),
    pendienteEliminacion:      t.pendienteEliminacion      || false,
    solicitadoPor:             t.solicitadoPor              ?? null,
    fechaSolicitudEliminacion: t.fechaSolicitudEliminacion  ?? null,
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
  const [fechaInicio, setFechaInicio] = useState("");
  const [horaInicio, setHoraInicio]   = useState("");
  const [duracion, setDuracion]       = useState("");
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
      horaInicio: horaInicio || null,
      duracion: duracion || null,
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
function ModalDetalle({ ticket, usuarioActual, onClose, onActualizar, onSolicitarEliminacion, onAprobarEliminacion, onRechazarEliminacion }) {
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
      onActualizar({ ...ticket, estado, fechaFin, horaFin, duracion, fechaCompletado: ahora.toISOString() });
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
              return (
                <div key={empId} style={{ background: darkMode ? "#1A2235" : "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: `1px solid ${emp?.color || "#2E3A55"}33` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: asignadosEmp.length > 0 ? 8 : 0 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: emp?.color, flexShrink: 0 }} />
                    <span style={{ color: emp?.color, fontSize: 12, fontWeight: 700 }}>{emp?.nombre}</span>
                    {asignadosEmp.length === 0
                      ? <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 11, fontStyle: "italic" }}>— pendiente de asignación</span>
                      : <span style={{ color: darkMode ? "#64748B" : "#475569", fontSize: 11 }}>{asignadosEmp.length} persona{asignadosEmp.length > 1 ? "s" : ""} asignada{asignadosEmp.length > 1 ? "s" : ""}</span>
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
          const puedeCancelar = esEncargadoDest || esCreadoPor || esDirector;
          const puedeAvanzar  = esEncargadoDest || esAsignado  || esDirector;
          const estadoActual  = ticket.estado;
          // Trabajador solo puede avanzar si ticket está Asignado o En progreso
          const puedeProgreso  = puedeAvanzar && estadoActual === "Asignado";
          const puedeCompletar = puedeAvanzar && (estadoActual === "En progreso" || (esEncargadoDest && estadoActual === "Asignado"));
          if (!puedeAvanzar && !puedeCancelar) return null;
          return (
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {puedeProgreso && (
                <button onClick={() => cambiarEstado("En progreso")} style={{ ...btnS, background: "#D4A01722", color: "#D4A017", border: "1px solid #D4A01755" }}>▶ En progreso</button>
              )}
              {puedeCompletar && (
                <button onClick={() => cambiarEstado("Completado")} style={{ ...btnS, background: "#38A16922", color: "#38A169", border: "1px solid #38A16955" }}>✓ Completado</button>
              )}
              {puedeCancelar && (
                <button onClick={() => cambiarEstado("Cancelado")} style={{ ...btnS, background: "#E53E3E22", color: "#E53E3E", border: "1px solid #E53E3E55" }}>✕ Cancelar</button>
              )}
            </div>
          );
        })()}

        {/* Solicitar / aprobar / rechazar eliminación */}
        {(() => {
          const esEncargado = usuarioActual.rol === "encargado";
          const esAdminODir = esAdmin || esDirector;
          const pendiente   = ticket.pendienteEliminacion === true;

          // Encargado puede solicitar eliminación en cualquier ticket ya creado
          if (esEncargado && !pendiente) {
            return (
              <div style={{ marginBottom: 14 }}>
                <button onClick={() => onSolicitarEliminacion(ticket)}
                  style={{ ...btnS, background: "#E53E3E11", color: "#E53E3E", border: "1px solid #E53E3E44", fontSize: 11 }}>
                  🗑️ Solicitar eliminación
                </button>
              </div>
            );
          }

          // Encargado ve aviso de que su solicitud está pendiente
          if (esEncargado && pendiente) {
            return (
              <div style={{ marginBottom: 14, background: "#D4A01722", border: "1px solid #D4A01755", borderRadius: 8, padding: "10px 14px" }}>
                <p style={{ margin: 0, color: "#D4A017", fontSize: 12, fontWeight: 700 }}>⏳ Solicitud de eliminación pendiente de aprobación por un administrador.</p>
              </div>
            );
          }

          // Admin / director ven los botones de aprobar o rechazar si hay solicitud pendiente
          if (esAdminODir && pendiente) {
            const solicitante = USUARIOS.find(u => u.id === ticket.solicitadoPor);
            return (
              <div style={{ marginBottom: 14, background: "#E53E3E11", border: "1px solid #E53E3E44", borderRadius: 8, padding: "12px 14px" }}>
                <p style={{ margin: "0 0 10px", color: "#E53E3E", fontSize: 12, fontWeight: 700 }}>
                  ⚠️ Solicitud de eliminación{solicitante ? ` por ${solicitante.nombre}` : ""}
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => onAprobarEliminacion(ticket)}
                    style={{ ...btnS, background: "#E53E3E22", color: "#E53E3E", border: "1px solid #E53E3E55" }}>
                    🗑️ Aprobar y eliminar
                  </button>
                  <button onClick={() => onRechazarEliminacion(ticket)}
                    style={{ ...btnS, background: "#1E293B", color: "#94A3B8", border: "1px solid #2E3A55" }}>
                    ↩️ Rechazar
                  </button>
                </div>
              </div>
            );
          }

          return null;
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

  return (
    <div onClick={onClick}
      style={{ background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 10, padding: "16px 18px", cursor: "pointer", transition: "border-color .15s, transform .15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = (empOrigen?.color || "#3182CE") + "66"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.transform = "none"; }}>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
        <EmpresaTag empresaId={ticket.empresaOrigenId} />
        <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 12 }}>→</span>
        {empresasDestino.map(id => <EmpresaTag key={id} empresaId={id} />)}
      </div>

      {ticket.pendienteEliminacion && (
        <div style={{ background: "#E53E3E11", border: "1px solid #E53E3E44", borderRadius: 6, padding: "5px 10px", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11 }}>🗑️</span>
          <span style={{ color: "#E53E3E", fontSize: 10, fontWeight: 700 }}>PENDIENTE DE ELIMINACIÓN</span>
        </div>
      )}
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
        const completado = estado === "Completado";
        const enProgreso = estado === "En progreso" || estado === "Asignado";
        const colProgreso   = "#DD6B20";
        const colCompletado = "#38A169";
        const colActivo     = completado ? colCompletado : enProgreso ? colProgreso : "#475569";

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
              <Line activo={enProgreso || completado} color={completado ? colCompletado : colProgreso} />
              {/* Check 2: En progreso */}
              <Check activo={enProgreso || completado} color={completado ? colCompletado : colProgreso} />
              <Line activo={completado} color={colCompletado} />
              {/* Check 3: Completado */}
              <Check activo={completado} color={colCompletado} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ color: darkMode ? "#334155" : "#94A3B8", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>Creado</span>
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
        } catch {}
      });
      if (changed) forceUpdate(n => n + 1);
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

  // ── Solicitar eliminación de ticket (encargado) ──
  const solicitarEliminacion = (ticket) => {
    if (!window.confirm(`¿Solicitar la eliminación del ticket "${ticket.titulo}"? Un administrador recibirá el aviso y deberá confirmarlo.`)) return;
    const ticketMarcado = { ...ticket, pendienteEliminacion: true, solicitadoPor: usuarioId, fechaSolicitudEliminacion: new Date().toISOString() };
    setTickets(ts => ts.map(x => x.id === ticket.id ? ticketMarcado : x));
    if (detalle?.id === ticket.id) setDetalle(ticketMarcado);
    setDoc(doc(db, "tickets", String(ticket.id)), ticketToFirestore(ticketMarcado))
      .catch(e => console.error("Error marcando eliminación:", e));
    // Notificar a todos los administradores
    USUARIOS.filter(u => u.rol === "administrador" || u.rol === "director").forEach(admin => {
      if (admin.id !== usuarioId) {
        addNotif({
          usuarioDestinoId: admin.id,
          tipo: "eliminacion",
          ticketId: ticket.id,
          texto: `⚠️ Solicitud de eliminación: el ticket "${ticket.titulo}" está pendiente de tu aprobación.`
        });
      }
    });
  };

  // ── Aprobar eliminación (administrador / director) ──
  const aprobarEliminacion = (ticket) => {
    if (!window.confirm(`¿Confirmar la eliminación definitiva del ticket "${ticket.titulo}"? Esta acción no se puede deshacer.`)) return;
    setTickets(ts => ts.filter(x => x.id !== ticket.id));
    if (detalle?.id === ticket.id) setDetalle(null);
    deleteDoc(doc(db, "tickets", String(ticket.id)))
      .catch(e => console.error("Error eliminando ticket:", e));
    // Notificar al encargado que solicitó la eliminación
    if (ticket.solicitadoPor && ticket.solicitadoPor !== usuarioId) {
      addNotif({
        usuarioDestinoId: ticket.solicitadoPor,
        tipo: "eliminacion_aprobada",
        ticketId: ticket.id,
        texto: `✅ El ticket "${ticket.titulo}" ha sido eliminado por un administrador.`
      });
    }
  };

  // ── Rechazar eliminación (administrador / director) ──
  const rechazarEliminacion = (ticket) => {
    if (!window.confirm(`¿Rechazar la solicitud de eliminación del ticket "${ticket.titulo}"?`)) return;
    const ticketRestaurado = { ...ticket, pendienteEliminacion: false, solicitadoPor: null, fechaSolicitudEliminacion: null };
    setTickets(ts => ts.map(x => x.id === ticket.id ? ticketRestaurado : x));
    if (detalle?.id === ticket.id) setDetalle(ticketRestaurado);
    setDoc(doc(db, "tickets", String(ticket.id)), ticketToFirestore(ticketRestaurado))
      .catch(e => console.error("Error rechazando eliminación:", e));
    // Notificar al encargado
    if (ticket.solicitadoPor && ticket.solicitadoPor !== usuarioId) {
      addNotif({
        usuarioDestinoId: ticket.solicitadoPor,
        tipo: "eliminacion_rechazada",
        ticketId: ticket.id,
        texto: `❌ La solicitud de eliminación del ticket "${ticket.titulo}" ha sido rechazada por un administrador.`
      });
    }
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
    <div style={{ minHeight: "100vh", background: darkMode ? "#0A0F1C" : "#F1F5F9", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: darkMode ? "#E2E8F0" : "#0F172A", transition: "background .2s, color .2s" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { transition: background-color .15s, border-color .15s, color .1s; }
        html { -webkit-text-size-adjust: 100%; }
        body { margin: 0; padding: 0; }
        @media (max-width: 640px) {
          .nav-logo-subtitle { display: none !important; }
          .nav-user-role { display: none !important; }
          .nav-empresa-name { display: none !important; }
          .nav-user-nombre { display: none !important; }
          .nav-user-tags { display: none !important; }
          .nav-row1 { padding: 0 8px !important; height: 50px !important; }
          .nav-row2 { padding: 0 !important; height: 44px !important; overflow-x: auto !important; overflow-y: hidden !important; -webkit-overflow-scrolling: touch !important; scrollbar-width: none !important; justify-content: flex-start !important; }
          .nav-row2::-webkit-scrollbar { display: none; }
          .nav-row2-inner { padding: 0 8px !important; min-width: max-content; }
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

      {/* NAV */}
      <nav style={{ background: darkMode ? "#0D1424" : "#FFFFFF", borderBottom: `2px solid ${empColor}33`, position: "sticky", top: 0, zIndex: 100 }}>
        {/* FILA 1: logo + usuario + selector */}
        <div className="nav-row1" style={{ padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, borderBottom: "1px solid #1E293B22" }}>
          {/* Logo */}
          <div className="nav-row1-logo" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <img src="data:image/png;base64,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" alt="Logo" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", background: "#000" }} />
            <div>
              <span style={{ color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 900, fontSize: 16 }}>Tickets</span>
              <span style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 10, display: "block", lineHeight: 1 }}>
                {usuario?.rol === "director" ? "👑 Director General" : "Sistema interempresarial"}
              </span>
            </div>
          </div>

          {/* Usuario actual + selector */}
          <div className="nav-user-info" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, minWidth: 0 }}>
            {usuario && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <Avatar nombre={usuario.nombre} color={empColor} size={30} />
                <div>
                  <p className="nav-user-nombre" style={{ margin: 0, color: darkMode ? "#E2E8F0" : "#0F172A", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{usuario.nombre}</p>
                  <div className="nav-user-tags" style={{ display: "flex", gap: 4 }}>
                    <EmpresaTag empresaId={usuario?.empresaId} />
                    <Badge
                      texto={usuario?.rol === "director" ? "Director" : usuario?.rol === "encargado" ? "Encargado" : usuario?.rol === "administrador" ? "Administrador" : "Trabajador"}
                      color={usuario?.rol === "director" ? "#F6AD55" : usuario?.rol === "encargado" ? empColor : usuario?.rol === "administrador" ? "#805AD5" : "#64748B"}
                      small />
                  </div>
                </div>
              </div>
            )}
            {/* Botones de acción agrupados */}
            <div className="nav-action-btns" style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {/* Campana notificaciones */}
            <div style={{ position: "relative" }}>
              <button onClick={() => { setVerNotifs(v => !v); marcarLeidas(); }}
                style={{ background: notifsNoLeidas > 0 ? "#1A2235" : "transparent", border: notifsNoLeidas > 0 ? "1px solid #2E3A55" : "1px solid transparent", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 18, position: "relative" }}>
                🔔
                {notifsNoLeidas > 0 && (
                  <span style={{ position: "absolute", top: 2, right: 2, background: "#E53E3E", color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{notifsNoLeidas}</span>
                )}
              </button>
              {verNotifs && (
                <div style={{ position: "fixed", right: 10, top: 58, background: darkMode ? "#111827" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 12, width: "min(320px, calc(100vw - 20px))", maxHeight: 360, overflowY: "auto", zIndex: 200, boxShadow: "0 16px 40px #0008" }}>
                  <div style={{ padding: "12px 16px", borderBottom: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 800, fontSize: 13 }}>Notificaciones</span>
                    <button onClick={() => setVerNotifs(false)} style={{ background: "none", border: "none", color: darkMode ? "#475569" : "#64748B", cursor: "pointer", fontSize: 18 }}>×</button>
                  </div>
                  {misNotifs.length === 0
                    ? <p style={{ padding: 16, color: darkMode ? "#475569" : "#64748B", fontSize: 13, margin: 0 }}>Sin notificaciones</p>
                    : misNotifs.slice(0, 20).map(n => (
                      <div key={n.id} style={{ padding: "10px 16px", borderBottom: "1px solid #0D1424", background: n.leida ? "transparent" : darkMode ? "#1A2235" : "#F8FAFC" }}>
                        <p style={{ margin: "0 0 3px", color: "#CBD5E1", fontSize: 12 }}>{n.texto}</p>
                        <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 10 }}>{fmtFecha(n.fecha)}</p>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            <button onClick={toggleTheme} title={darkMode ? "Modo claro" : "Modo oscuro"}
              style={{ background: darkMode ? "#1A2235" : "#F1F5F9", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Botón admin — director y administradores */}
            {(usuario?.rol === "director" || usuario?.rol === "administrador") && (
              <button onClick={() => setModalAdmin(true)} title="Administración"
                style={{ background: darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14, color: "#F6AD55" }}>
                ⚙️
              </button>
            )}
            {/* Cerrar sesión */}
            <button onClick={handleLogout} title="Cerrar sesión"
              style={{ background: darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14, color: darkMode ? "#64748B" : "#475569" }}>
              🚪
            </button>
            </div>{/* /nav-action-btns */}
          </div>
        </div>

        {/* FILA 2: pestañas centradas */}
        <div className="nav-row2" style={{ display: "flex", justifyContent: "center", padding: "0 24px", height: 44 }}>
          <div className="nav-row2-inner" style={{ display: "flex", gap: 2 }}>
            {[["tickets","🎫 Tickets"],["historial","🗂️ Historial"],["calendario","📅 Calendario"],...(["director","encargado","administrador"].includes(usuario?.rol) ? [["reportes","📄 Reportes"]] : [])].map(([s,l]) => (
              <button key={s} onClick={() => setSeccion(s)} className="nav-tab-btn" style={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "0 20px", height: 40, border: "none", cursor: "pointer", background: "transparent", color: seccion === s ? empColor : "#64748B", borderBottom: seccion === s ? `2px solid ${empColor}` : "2px solid transparent", transition: "all .15s", whiteSpace: "nowrap" }}>{l}</button>
            ))}
          </div>
        </div>
      </nav>

      <div className="main-content" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>

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
      </div>

      {modalCrear && <ModalCrearTicket usuarioActual={usuario} onClose={() => setModalCrear(false)} onCrear={crearTicket} />}
      {detalle    && <ModalDetalle ticket={detalle} usuarioActual={usuario} onClose={() => setDetalle(null)} onActualizar={(t) => actualizarTicket(t)} onSolicitarEliminacion={solicitarEliminacion} onAprobarEliminacion={aprobarEliminacion} onRechazarEliminacion={rechazarEliminacion} />}
      {modalMisTickets && <ModalMisTickets usuarioId={usuarioId} tickets={misTicketsPersonales.filter(t => t.creadoPor === usuarioId)} onClose={() => setModalMisTickets(false)} onCrear={guardarTicketPersonal} onVerDetalle={t => { setDetalleMiTicket(t); setModalMisTickets(false); }} />}
      {detalleMiTicket && <ModalDetalleMiTicket ticket={detalleMiTicket} onClose={() => setDetalleMiTicket(null)} onActualizar={actualizarTicketPersonal} />}
      {modalAdmin && <ModalAdministracion onClose={() => setModalAdmin(false)} />}
    </div>
  );
}
