import { useState, useMemo, useEffect } from "react";

// Dark/Light mode — módulo nivel para acceso global
const getDM = () => { try { return localStorage.getItem("theme") !== "light"; } catch { return true; } };
let __darkMode = getDM();
let darkMode = __darkMode;
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
  { id: 0, nombre: "Independiente",             color: "#6B7280", inicial: "IN" },
  { id: 1, nombre: "Energía de Miajadas",        color: "#cf142b", inicial: "EM" },
  { id: 2, nombre: "Miajadas Telecom",           color: "#e0ad12", inicial: "MT" },
  { id: 3, nombre: "Laura Otero Instalaciones",  color: "#0077ab", inicial: "LI" },
  { id: 4, nombre: "Zaqaru",                     color: "#af4a85", inicial: "ZQ" },
  { id: 5, nombre: "Laura Otero S.A.",           color: "#4F8C0d", inicial: "LO" },
];

const USUARIOS = [
  // ── Independiente ──────────────────────────────────────────────
  { id: 0,  nombre: "Miguel Manzano Otero",      empresaId: 0, rol: "director"      },  // Director General
  { id: 1,  nombre: "Eugenio Manzano Otero",     empresaId: 0, rol: "ceo"           },  // CEO
  { id: 2,  nombre: "Jesús Salazar Otero",       empresaId: 0, rol: "trabajador"    },
  { id: 3,  nombre: "Iratxe Plaza Castaño",      empresaId: 0, rol: "trabajador"    },
  { id: 4,  nombre: "Yolanda Jiménez Núñez",     empresaId: 0, rol: "trabajador"    },
  { id: 5,  nombre: "Laura Hernández Hoyos",     empresaId: 0, rol: "trabajador"    },
  { id: 6,  nombre: "Rosa Garrido Marroquí",     empresaId: 0, rol: "trabajador"    },
  { id: 7,  nombre: "Fernando Flores Manzano",   empresaId: 0, rol: "trabajador"    },
  // ── Energía de Miajadas ────────────────────────────────────────
  { id: 8,  nombre: "Ángel Fernández Mogollón",  empresaId: 1, rol: "encargado"     },
  { id: 9,  nombre: "Jose Manuel Fuentes Vicente",empresaId: 1, rol: "trabajador"   },
  { id: 10, nombre: "María Manzano Soria",        empresaId: 1, rol: "trabajador"   },
  // ── Miajadas Telecom ───────────────────────────────────────────
  { id: 11, nombre: "Valentín Pérez Sánchez",    empresaId: 2, rol: "encargado"     },
  { id: 12, nombre: "Esther Albalá Fabián",      empresaId: 2, rol: "encargado"     },
  { id: 13, nombre: "Aitor Segador Garrido",     empresaId: 2, rol: "trabajador"    },
  { id: 14, nombre: "Carlos Cintero Díaz",       empresaId: 2, rol: "trabajador"    },
  { id: 15, nombre: "Javier Acedo Iñigo",        empresaId: 2, rol: "trabajador"    },
  { id: 16, nombre: "Sara Márquez Pérez",        empresaId: 2, rol: "administrador" },
  // ── Laura Otero Instalaciones ──────────────────────────────────
  { id: 17, nombre: "Miguel Calvo Calvo",        empresaId: 3, rol: "encargado"     },
  { id: 18, nombre: "Juan Antonio Fuentes Vicente",empresaId: 3, rol: "trabajador"  },
  { id: 19, nombre: "Jaime Naranjo Sanguino",    empresaId: 3, rol: "trabajador"    },
  { id: 20, nombre: "Pepe Saavedra Pizarro",     empresaId: 3, rol: "trabajador"    },
  { id: 21, nombre: "Ekaitz Pereira Grande",     empresaId: 3, rol: "trabajador"    },
  { id: 22, nombre: "Charly Llanos Lorenzo",     empresaId: 3, rol: "trabajador"    },
  { id: 23, nombre: "Borja Llanos López",        empresaId: 3, rol: "trabajador"    },
  { id: 24, nombre: "Oscar García Godino",       empresaId: 3, rol: "trabajador"    },
  { id: 25, nombre: "Carlos Pablo Pajuelo",      empresaId: 3, rol: "trabajador"    },
  { id: 26, nombre: "David López Babiano",       empresaId: 3, rol: "trabajador"    },
  { id: 27, nombre: "Manuel Lobo Meneses",       empresaId: 3, rol: "trabajador"    },
  { id: 28, nombre: "Luis Collado Pizarro",      empresaId: 3, rol: "trabajador"    },
  { id: 29, nombre: "Félix Loro García",         empresaId: 3, rol: "trabajador"    },
  { id: 30, nombre: "Andrés Medina Nieto",       empresaId: 3, rol: "trabajador"    },
  { id: 31, nombre: "Jairo Miguel Masa",         empresaId: 3, rol: "trabajador"    },
  { id: 32, nombre: "Francisco Babiano Ruiz",    empresaId: 3, rol: "trabajador"    },
  { id: 33, nombre: "Antonio Díaz Álvarez",      empresaId: 3, rol: "trabajador"    },
  { id: 34, nombre: "Guillermo Méndez Cortés",   empresaId: 3, rol: "trabajador"    },
  // ── Zaqaru ────────────────────────────────────────────────────
  { id: 35, nombre: "Riánsares Mañoso Blázquez", empresaId: 4, rol: "encargado"     },
  { id: 36, nombre: "Alberto Masa Mayoral",      empresaId: 4, rol: "trabajador"    },
  { id: 37, nombre: "Alberto Solís Loro",        empresaId: 4, rol: "trabajador"    },
  { id: 38, nombre: "Antonio Vellarino Garrido", empresaId: 4, rol: "trabajador"    },
  { id: 39, nombre: "Francisco Sánchez Melero",  empresaId: 4, rol: "trabajador"    },
  { id: 40, nombre: "Jorge Martínez Orellana",   empresaId: 4, rol: "trabajador"    },
  { id: 41, nombre: "Pedro Solís Bernardo",      empresaId: 4, rol: "trabajador"    },
  // ── Laura Otero S.A. ──────────────────────────────────────────
  { id: 42, nombre: "Jose Antonio Viegas Sánchez",empresaId: 5, rol: "encargado"   },
  { id: 43, nombre: "Vicente Manzano Otero",     empresaId: 5, rol: "trabajador"    },
  { id: 44, nombre: "Belén García Bravo",        empresaId: 5, rol: "trabajador"    },
  { id: 45, nombre: "Antonio Vellarino Maeso",   empresaId: 5, rol: "trabajador"    },
  { id: 46, nombre: "Daniel Pizarro Pizarro",    empresaId: 5, rol: "rrhh"          },
];

const PRIORIDADES = ["Baja", "Media", "Alta", "Urgente"];
let PRIORIDAD_COLORES = { Baja: "#38A169", Media: "#D4A017", Alta: "#DD6B20", Urgente: "#E53E3E" };
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
        // EMPRESAS y USUARIOS: siempre usar los del código, no sobreescribir desde Firestore
      } catch {}
    });
  } catch {}
};
loadConfig();
let ESTADO_COLORES = { Pendiente: "#718096", Asignado: "#3182CE", "En progreso": "#D4A017", Completado: "#38A169", Cancelado: "#E53E3E" };

// PINs por defecto (4 dígitos) — clave: userId, valor: pin string
const PINS_DEFAULT = {};
for (const u of [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46]) {
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
let inp    = { fontFamily: "inherit", fontSize: 13, background: darkMode ? "#1A2235" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#CBD5E1"}`, borderRadius: 6, padding: "9px 12px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none", width: "100%", boxSizing: "border-box" };
let btnS   = { fontFamily: "inherit", fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer" };
let labelS = { display: "block", color: darkMode ? "#64748B" : "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 5 };

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
  const [asignadosPorEmpresa, setAsignadosPorEmpresa] = useState({}); // para director/ceo
  const esDirCeoCreador = ["director","ceo"].includes(usuarioActual.rol);
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
  const disponibles = EMPRESAS; // incluye Independiente (id:0)
  const puedeCrear  = titulo.trim().length > 0 && empresasDestino.length > 0;

  const toggleEmp = (id) => {
    setEmps(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (id === 0 && !next.includes(0)) setComercialAsignados([]);
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
      empresaOrigenId: ["director","ceo"].includes(usuarioActual.rol) ? origenId : usuarioActual.empresaId,
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

          {["director","ceo"].includes(usuarioActual.rol) && (
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
                      {marcada && emp.id !== 0 && <span style={{ color: emp.color, fontSize: 12 }}>✓</span>}
                      {marcada && emp.id === 0 && <span style={{ color: emp.color, fontSize: 10 }}>{comercialAsignados.length > 0 ? `${comercialAsignados.length} asignada${comercialAsignados.length > 1 ? "s" : ""}` : "elige persona"}</span>}
                    </label>
                    {/* Selector de personas para Comercial */}
                    {marcada && emp.id === 0 && (
                      <div style={{ marginTop: 4, marginLeft: 12, display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px", background: darkMode ? "#0D1424" : "#FFFFFF", borderRadius: 8, border: `1px solid ${emp.color}33` }}>
                        <p style={{ margin: "0 0 6px", color: emp.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
                          🎯 Selecciona a quién va dirigido
                        </p>
                        {USUARIOS.filter(u => u.empresaId === 0).map(u => {
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
                {empresasDestino.filter(id => id !== 0).length > 0 && "El encargado de cada empresa asignará a sus trabajadores. "}
                {empresasDestino.includes(0) && comercialAsignados.length === 0 && <span style={{ color: "#E53E3E" }}>⚠️ Selecciona al menos una persona de Comercial.</span>}
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

  const esDirector         = ["director","ceo"].includes(usuarioActual.rol);
  const esAdmin            = usuarioActual.rol === "administrador";
  const esEncargadoDest    = (["director","ceo"].includes(usuarioActual.rol) || usuarioActual.rol === "encargado" || esAdmin) && (["director","ceo"].includes(usuarioActual.rol) || empresasDestino.includes(usuarioActual.empresaId));
  const esAsignado         = todosAsignadosIds.includes(usuarioActual.id);
  const esCreadoPor        = ticket.creadoPor === usuarioActual.id;
  const puedeAccion        = esDirector || esEncargadoDest || esAsignado || esCreadoPor || esAdmin;

  const creador     = USUARIOS.find(u => u.id === ticket.creadoPor);
  const empOrigen   = EMPRESAS.find(e => e.id === ticket.empresaOrigenId);
  const accentColor = empOrigen?.color || "#3182CE";
  const miEmpresa   = EMPRESAS.find(e => e.id === usuarioActual.empresaId);
  const misTrabs    = esDirector ? USUARIOS.filter(u => u.rol === "trabajador" || u.rol === "encargado") : USUARIOS.filter(u => u.empresaId === usuarioActual.empresaId && ["trabajador","encargado","administrador"].includes(u.rol))

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
    let nuevas = { ...asignaciones };
    if (esDirector) {
      // Director: agrupar seleccionados por su empresa
      seleccionados.forEach(uid => {
        const usr = USUARIOS.find(u => u.id === uid);
        if (!usr) return;
        const empId = usr.empresaId;
        nuevas[empId] = [...(nuevas[empId] || []).filter(x => x !== uid), uid];
      });
    } else {
      nuevas[usuarioActual.empresaId] = seleccionados;
    }
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
                      : ticket.estado !== "Pendiente" && <span style={{ background: "#D4A01722", color: "#D4A017", border: "1px solid #D4A01755", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>⏳ En progreso</span>
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
              {esDirector ? "Asignar trabajadores (todas las empresas)" : `Asignar trabajadores de ${miEmpresa?.nombre}`}
            </p>
            {misTrabs.length === 0
              ? <p style={{ color: darkMode ? "#475569" : "#64748B", fontSize: 13, margin: "0 0 12px" }}>No hay trabajadores en tu empresa.</p>
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                  {esDirector
                    ? EMPRESAS.map(emp => {
                        const trabsEmp = USUARIOS.filter(u => u.empresaId === emp.id && !["director","ceo"].includes(u.rol));
                        if (!trabsEmp.length) return null;
                        return (
                          <div key={emp.id}>
                            <p style={{ margin:"4px 0 6px", color:emp.color, fontSize:10, fontWeight:700, textTransform:"uppercase" }}>{emp.nombre}</p>
                            {trabsEmp.map(u => {
                              const marcado = seleccionados.includes(u.id);
                              const col = emp.color;
                              return (
                                <label key={u.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 12px", borderRadius:8, cursor:"pointer", background: marcado ? col+"18" : "transparent" }}>
                                  <input type="checkbox" checked={marcado} onChange={() => toggleSel(u.id)} style={{ accentColor:col, width:14, height:14 }} />
                                  <Avatar nombre={u.nombre} color={col} size={22} />
                                  <span style={{ color:marcado?"#E2E8F0":"#94A3B8", fontSize:13, fontWeight:marcado?700:400 }}>{u.nombre}</span>
                                  {marcado && <span style={{ color:col, fontSize:12 }}>✓</span>}
                                </label>
                              );
                            })}
                          </div>
                        );
                      })
                    : misTrabs.map(u => {
                        const marcado = seleccionados.includes(u.id);
                        const col = miEmpresa?.color || "#3182CE";
                        return (
                          <label key={u.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:7, background: marcado ? col+"22" : darkMode?"#111827":"#FFFFFF", border:`1px solid ${marcado ? col+"66" : darkMode?"#1E293B":"#E2E8F0"}`, cursor:"pointer" }}>
                            <input type="checkbox" checked={marcado} onChange={() => toggleSel(u.id)} style={{ accentColor:col, width:15, height:15 }} />
                            <Avatar nombre={u.nombre} color={col} size={24} />
                            <span style={{ color:marcado?"#E2E8F0":"#94A3B8", fontSize:13, fontWeight:marcado?700:400, flex:1 }}>{u.nombre}</span>
                            {marcado && <span style={{ color:col, fontSize:12 }}>✓</span>}
                          </label>
                        );
                      })
                  }
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
        {empresasDestino.includes(0) && esCreadoPor && !["Completado", "Cancelado"].includes(ticket.estado) && (() => {
          const trabsComercial = USUARIOS.filter(u => u.empresaId === 0);
          const asignadosComercial = asignaciones[0] || [];
          const col = "#E53E3E";
          const asignarComercial = (nuevos) => {
            const nuevasAsig = { ...asignaciones, 0: nuevos };
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
           (["director","ceo"].includes(usuarioActual.rol)) ||
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
function Reportes({ tickets, usuarioActual, darkMode, EMPRESAS: EMP, USUARIOS: USR }) {
  const _EMPRESAS = EMP || EMPRESAS;
  const _USUARIOS = USR || USUARIOS;
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
      <div style={{ display: "grid", gridTemplateColumns: `repeat(4,1fr)`, gap: 12, marginBottom: 24 }}>
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
                  {!f.salida && <span style={{ color:"#38A169", marginLeft:8, fontSize:11 }}>● En progreso</span>}
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
              <span style={{ background: empColor+"33", color: empColor, borderRadius:5, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{usuario?.rol === "director" ? "DIRECTOR GENERAL" : usuario?.rol === "ceo" ? "CEO" : usuario?.rol?.toUpperCase()}</span>
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
          // EMPRESAS y USUARIOS: siempre usar los del código (no sobrescribir desde Firestore)
          // Solo sincronizamos categorías y estados desde Firestore
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
  const [filtros,       setFiltros]    = useState({ estado: "kpi_total", empresa: "todas", buscar: "" });
  const [vista,         setVista]      = useState("mis");
  const [seccion,       setSeccion]    = useState("tickets");
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // En móvil (< 900px) el sidebar empieza cerrado
    if (typeof window !== 'undefined') return window.innerWidth > 900;
    return true;
  });
  // ── Fichaje ──
  const [fichajes,      setFichajes]   = useState([]);
  const [fichajeActivo, setFichajeActivo] = useState(null); // { id, entrada }
  // ── Nóminas ──
  const [nominas,       setNominas]    = useState([]);
  const [modalNomina,   setModalNomina] = useState(false);  // solo admin/director
  const [subHistorial,  setSubHistorial] = useState("completados");
  const [ticketsExpanded, setTicketsExpanded] = useState(true);
  const [rrhhExpanded,    setRrhhExpanded]    = useState(true);


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

  const usuario  = USUARIOS.find(u => u.id === usuarioId) || null;

  const esEncargado  = usuario?.rol === "encargado";
  const esTrabajador = usuario?.rol === "trabajador";
  const esDirCeo     = ["director","ceo"].includes(usuario?.rol);
  const empresa  = EMPRESAS.find(e => e.id === usuario?.empresaId);
  const empColor = ["director","ceo"].includes(usuario?.rol) ? "#94A3B8" : (empresa?.color || "#E53E3E");
  const inpF     = { fontFamily: "inherit", fontSize: 12, background: darkMode ? "#0D1424" : "#FFFFFF", border: `1px solid ${darkMode ? "#1E293B" : "#E2E8F0"}`, borderRadius: 6, padding: "7px 11px", color: darkMode ? "#E2E8F0" : "#0F172A", outline: "none", width: "100%", boxSizing: "border-box" };

  // ── Firebase: nóminas en tiempo real ──
  useEffect(() => {
    if (!usuarioId) return;
    const esAdminDir = ["director","ceo","administrador","rrhh"].includes(usuario?.rol);
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


  // Tickets que "pertenecen" al usuario según su rol

  const ticketsMisRol = tickets.filter(t => {
    if (!usuario || ["director","ceo"].includes(usuario.rol)) return true;
    const eds   = t.empresasDestino || [];
    const asigs = Object.values(t.asignacionesPorEmpresa || {}).flat();
    if (usuario.rol === "encargado") {
      // Encargado ve: tickets donde su empresa es destino, o tickets que él creó
      return eds.includes(usuario.empresaId) || t.creadoPor === usuario.id;
    }
    // Trabajador ve: tickets donde está asignado o que él creó
    return asigs.includes(usuario.id) || t.creadoPor === usuario.id;
  });

  const ticketsFiltrados = (() => {
    // Base: todos los tickets del rol
    let base = ticketsMisRol;

    const asigsFn = t => Object.values(t.asignacionesPorEmpresa || {}).flat();
    const edsFn   = t => t.empresasDestino || [];

    // ── KPI seleccionado ──
    if (filtros.estado === "kpi_total") {
      base = base.filter(t => {
        if (["Completado","Cancelado"].includes(t.estado)) return false;
        if (!esDirCeo) return asigsFn(t).includes(usuarioId);
        return asigsFn(t).includes(usuarioId); // dir/ceo: sus tickets asignados
      });
    } else if (filtros.estado === "kpi_pendientes") {
      base = base.filter(t => t.estado === "Pendiente" && t.creadoPor === usuarioId);
    } else if (filtros.estado === "kpi_progreso") {
      base = base.filter(t => ["Asignado","En progreso"].includes(t.estado) && asigsFn(t).includes(usuarioId));
    } else if (filtros.estado === "kpi_completados") {
      base = base.filter(t => t.estado === "Completado" && (asigsFn(t).includes(usuarioId) || t.creadoPor === usuarioId));
    } else if (filtros.estado === "kpi_sinasignar") {
      base = base.filter(t => {
        if (t.estado !== "Pendiente") return false;
        if (esDirCeo) return Object.values(t.asignacionesPorEmpresa || {}).every(a => !a.length);
        // Encargado: tickets hacia su empresa sin asignar aún en su empresa
        return edsFn(t).includes(usuario?.empresaId) &&
               !(t.asignacionesPorEmpresa?.[usuario?.empresaId]?.length > 0);
      });
    } else {
      // Vista normal — solo tickets personales (asignados o creados por el usuario)
      base = base.filter(t => !["Completado","Cancelado"].includes(t.estado));
      base = base.filter(t => {
        const asigs = Object.values(t.asignacionesPorEmpresa || {}).flat();
        return asigs.includes(usuarioId) || t.creadoPor === usuarioId;
      });
    }

    // Filtro por empresa (para director/ceo en vista global)
    if (filtros.empresa !== "todas") {
      const empId = Number(filtros.empresa);
      base = base.filter(t => edsFn(t).includes(empId) || t.empresaOrigenId === empId);
    }

    // Buscador
    if (filtros.buscar) {
      base = base.filter(t => t.titulo.toLowerCase().includes(filtros.buscar.toLowerCase()));
    }

    return base;
  })();


  const ticketsActivos     = ticketsMisRol.filter(t => !["Completado","Cancelado"].includes(t.estado));
  const ticketsCompletados = ticketsMisRol.filter(t => t.estado === "Completado");
  const ticketsCancelados  = ticketsMisRol.filter(t => t.estado === "Cancelado");

  // Tickets donde el usuario está asignado (como trabajador)
  const misAsignados = ticketsMisRol.filter(t => {
    const asigs = Object.values(t.asignacionesPorEmpresa || {}).flat();
    return asigs.includes(usuarioId);
  });
  const misPendientes  = ticketsMisRol.filter(t => t.creadoPor === usuarioId && t.estado === "Pendiente");
  const misEnProgreso  = misAsignados.filter(t => ["Asignado","En progreso"].includes(t.estado));
  const misCompletados = ticketsMisRol.filter(t => {
    if (t.estado !== "Completado") return false;
    const asigs = Object.values(t.asignacionesPorEmpresa || {}).flat();
    return asigs.includes(usuarioId) || t.creadoPor === usuarioId;
  });

  // Sin asignar: tickets pendientes hacia mi empresa sin asignar (encargado y dir/ceo)
  const sinAsignar = (esEncargado || esDirCeo) ? ticketsMisRol.filter(t => {
    if (t.estado !== "Pendiente") return false;
    const eds = t.empresasDestino || [];
    if (esDirCeo) return Object.values(t.asignacionesPorEmpresa || {}).every(a => !a.length);
    return eds.includes(usuario.empresaId) && !(t.asignacionesPorEmpresa?.[usuario.empresaId]?.length > 0);
  }) : [];

  const stats = {
    // Total: mis tickets asignados (como trabajador)
    total:       esDirCeo
      ? misAsignados.filter(t => !["Completado","Cancelado"].includes(t.estado)).length
      : esEncargado
      ? ticketsActivos.filter(t => {
          const asigs = Object.values(t.asignacionesPorEmpresa || {}).flat();
          return asigs.includes(usuarioId) || t.creadoPor === usuarioId;
        }).length
      : misAsignados.filter(t => !["Completado","Cancelado"].includes(t.estado)).length,
    pendientes:  misPendientes.length,
    enProgreso:  misEnProgreso.length,
    completados: misCompletados.length,
    sinAsignar:  sinAsignar.length,
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
      // Empresa Independiente (id:0) no tiene encargado — notificar al director y CEO
      if (!enc && empId === 0) {
        USUARIOS.filter(u => ["director","ceo"].includes(u.rol)).forEach(u => {
          if (u.id !== usuarioId) addNotif({ usuarioDestinoId: u.id, tipo: "ticket_nuevo", texto: `Nuevo ticket de empresa Independiente: "${titulo}"`, ticketId: newId });
        });
      }
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
                    {USUARIOS.filter(u => u.empresaId === emp.id && u.activo !== false).map(u => {
                      const rolLabel = u.rol === "director" ? " · Director General" : u.rol === "ceo" ? " · CEO" : u.rol === "encargado" ? " · Encargado" : u.rol === "administrador" ? " · Admin" : u.rol === "rrhh" ? " · RRHH" : "";
                      return <option key={u.id} value={u.id}>{u.nombre}{rolLabel}</option>;
                    })}
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
        @keyframes parpadeo {
          0%, 100% { opacity: 1; border-color: #E53E3E; box-shadow: 0 0 0 0px #E53E3E44; }
          50%       { opacity: 0.72; border-color: #E53E3EBB; box-shadow: 0 0 0 4px #E53E3E22; }
        }
        *, *::before, *::after { transition: background-color .15s, border-color .15s, color .1s; }
        html { -webkit-text-size-adjust: 100%; }
        body { margin: 0; padding: 0; }
        /* ── SIDEBAR OVERLAY (siempre en DOM, visible solo móvil) ── */
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: #00000066; z-index: 199; }

        /* ── TABLET (≤ 900px): sidebar colapsado por defecto ── */
        @media (max-width: 900px) {
          .sidebar-aside {
            position: fixed !important;
            left: 0; top: 0;
            height: 100vh !important;
            z-index: 200 !important;
            transform: translateX(-100%);
            transition: transform .25s ease !important;
            width: 240px !important;
            min-width: 240px !important;
          }
          .sidebar-aside.open {
            transform: translateX(0) !important;
          }
          .sidebar-overlay { display: block; }
          .main-content { padding: 16px 18px !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; }
        }

        /* ── MÓVIL (≤ 640px) ── */
        @media (max-width: 640px) {
          .nav-logo-subtitle { display: none !important; }
          .nav-user-role { display: none !important; }
          .nav-empresa-name { display: none !important; }
          .nav-user-nombre { display: none !important; }
          .nav-user-tags { display: none !important; }
          .main-content { padding: 12px 10px !important; }
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
          .page-header { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .page-header-actions { width: 100% !important; }
          .page-header-actions button { width: 100% !important; }
          .topbar-title { font-size: 14px !important; }
        }

        /* ── MÓVIL PEQUEÑO (≤ 380px) ── */
        @media (max-width: 380px) {
          .stats-grid { gap: 6px !important; }
          .main-content { padding: 10px 8px !important; }
        }
      `}</style>

      {/* NAV */}
      {/* ═══════════════════════════════════════════
          LAYOUT: SIDEBAR + CONTENIDO
      ═══════════════════════════════════════════ */}
      <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>

        {/* ── SIDEBAR ── */}
        {/* Overlay móvil para cerrar sidebar */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        <aside className={`sidebar-aside${sidebarOpen ? " open" : ""}`} style={{
          width:          sidebarOpen ? 220 : 60,
          minWidth:       sidebarOpen ? 220 : 60,
          background:     darkMode ? "#111827" : "#FFFFFF",
          borderRight:   `1px solid ${darkMode ? "#1E293B" : "#E8EDF2"}`,
          display:        "flex",
          flexDirection:  "column",
          position:       "sticky",
          top:            0,
          height:         "100vh",
          overflowY:      "auto",
          overflowX:      "hidden",
          transition:     "width .25s ease",
          zIndex:         110,
          flexShrink:     0,
        }}>
          {/* Logo + toggle */}
          <div style={{ padding: sidebarOpen ? "20px 16px 12px" : "20px 10px 12px", display:"flex", alignItems:"center", justifyContent: sidebarOpen ? "space-between" : "center", borderBottom:`1px solid ${darkMode?"#1E293B":"#F0F2F5"}` }}>
            {sidebarOpen && (
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:8, background: empColor, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#fff", fontSize:15, flexShrink:0 }}>
                  {(EMPRESAS.find(e=>e.id===usuario?.empresaId)?.inicial || "T")}
                </div>
                <div>
                  <p style={{ margin:0, color: darkMode?"#fff":"#1B2559", fontSize:13, fontWeight:800, lineHeight:1.2 }}>Grupo</p>
                  <p style={{ margin:0, color: darkMode?"#94A3B8":"#68769F", fontSize:13, fontWeight:700 }}>Laura Otero</p>
                </div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(v => !v)}
              style={{ background:"none", border:"none", color: darkMode?"#94A3B8":"#A3AED0", cursor:"pointer", fontSize:18, padding:4, lineHeight:1, flexShrink:0 }}>
              {sidebarOpen ? "◀" : "▶"}
            </button>
          </div>

          {/* Avatar usuario */}
          <div style={{ padding: sidebarOpen ? "16px 16px 8px" : "16px 10px 8px", borderBottom:`1px solid ${darkMode?"#1E293B":"#F0F2F5"}` }}>
            {sidebarOpen ? (
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background: empColor + "44", border:`2px solid ${empColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:14, flexShrink:0 }}>
                  {usuario?.nombre?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() || "U"}
                </div>
                <div style={{ overflow:"hidden" }}>
                  <p style={{ margin:0, color: darkMode?"#fff":"#1B2559", fontSize:12, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{usuario?.nombre}</p>
                  <span style={{ background: empColor + "44", color: empColor, borderRadius:4, padding:"1px 7px", fontSize:9, fontWeight:800, textTransform:"uppercase" }}>{usuario?.rol === "director" ? "Director General" : usuario?.rol === "ceo" ? "CEO" : usuario?.rol === "rrhh" ? "RRHH" : usuario?.rol}</span>
                </div>
              </div>
            ) : (
              <div style={{ width:38, height:38, borderRadius:"50%", background: empColor + "44", border:`2px solid ${empColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#fff", fontSize:14, margin:"0 auto" }}>
                {usuario?.nombre?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* Menú de navegación */}
          <nav style={{ flex:1, padding:"8px 8px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>

            {/* ── TICKETS con submenú ── */}
            <button onClick={() => { setTicketsExpanded(v => !v); setSeccion("tickets"); }}
              title={!sidebarOpen ? "Tickets" : ""}
              style={{ display:"flex", alignItems:"center", gap:10, padding:sidebarOpen?"10px 12px":"10px", justifyContent:sidebarOpen?"flex-start":"center", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:["tickets","historial","reportes","equipo"].includes(seccion)?700:500, background:["tickets","historial","reportes","equipo"].includes(seccion)?(darkMode?"#1E293B":"#F4F7FE"):"transparent", color:["tickets","historial","reportes","equipo"].includes(seccion)?empColor:(darkMode?"#94A3B8":"#68769F"), borderLeft:["tickets","historial","reportes","equipo"].includes(seccion)?`3px solid ${empColor}`:"3px solid transparent", transition:"all .15s", width:"100%", whiteSpace:"nowrap" }}
              onMouseEnter={e => { if(!["tickets","historial","reportes","equipo"].includes(seccion)) e.currentTarget.style.background=darkMode?"#1E293B33":"#F4F7FE88"; }}
              onMouseLeave={e => { if(!["tickets","historial","reportes","equipo"].includes(seccion)) e.currentTarget.style.background="transparent"; }}>
              <span style={{ fontSize:16, flexShrink:0 }}>🎫</span>
              {sidebarOpen && <><span style={{ flex:1 }}>Tickets</span><span style={{ fontSize:10 }}>{ticketsExpanded?"▾":"▸"}</span></>}
            </button>

            {/* Submenú Tickets */}
            {ticketsExpanded && sidebarOpen && (
              <div style={{ marginLeft:12, borderLeft:`2px solid ${darkMode?"#1E293B":"#E2E8F0"}`, paddingLeft:8, display:"flex", flexDirection:"column", gap:1 }}>
                {[
                  { id:"historial", icon:"🗂️",  label:"Historial",      show: true },
                  { id:"reportes",  icon:"📄", label:"Reportes",        show: ["director","ceo","encargado","administrador"].includes(usuario?.rol) },
                  { id:"equipo",    icon:"👥", label:"Panel de equipo", show: esEncargado },
                ].filter(i => i.show).map(item => {
                  const activo = seccion === item.id;
                  return (
                    <button key={item.id} onClick={e => { e.stopPropagation(); setSeccion(item.id); }}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:7, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:activo?700:400, background:activo?(darkMode?"#1E293B":"#EEF2FF"):"transparent", color:activo?empColor:(darkMode?"#64748B":"#94A3B8"), transition:"all .15s", width:"100%" }}
                      onMouseEnter={e => { if(!activo) e.currentTarget.style.background=darkMode?"#1E293B33":"#F4F7FE"; }}
                      onMouseLeave={e => { if(!activo) e.currentTarget.style.background="transparent"; }}>
                      <span style={{ fontSize:13 }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── RRHH con submenú (solo rol rrhh) ── */}
            {usuario?.rol === "rrhh" && (
              <>
                <button onClick={() => { setRrhhExpanded(v => !v); setSeccion("gestion_nominas"); }}
                  title={!sidebarOpen ? "RRHH" : ""}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:sidebarOpen?"10px 12px":"10px", justifyContent:sidebarOpen?"flex-start":"center", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:["gestion_nominas","gestion_vacaciones","gestion_fichajes"].includes(seccion)?700:500, background:["gestion_nominas","gestion_vacaciones","gestion_fichajes"].includes(seccion)?(darkMode?"#1E293B":"#F4F7FE"):"transparent", color:["gestion_nominas","gestion_vacaciones","gestion_fichajes"].includes(seccion)?empColor:(darkMode?"#94A3B8":"#68769F"), borderLeft:["gestion_nominas","gestion_vacaciones","gestion_fichajes"].includes(seccion)?`3px solid ${empColor}`:"3px solid transparent", transition:"all .15s", width:"100%", whiteSpace:"nowrap" }}
                  onMouseEnter={e => { if(!["gestion_nominas","gestion_vacaciones","gestion_fichajes"].includes(seccion)) e.currentTarget.style.background=darkMode?"#1E293B33":"#F4F7FE88"; }}
                  onMouseLeave={e => { if(!["gestion_nominas","gestion_vacaciones","gestion_fichajes"].includes(seccion)) e.currentTarget.style.background="transparent"; }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>👔</span>
                  {sidebarOpen && <><span style={{ flex:1 }}>RRHH</span><span style={{ fontSize:10 }}>{rrhhExpanded?"▾":"▸"}</span></>}
                </button>

                {rrhhExpanded && sidebarOpen && (
                  <div style={{ marginLeft:12, borderLeft:`2px solid ${darkMode?"#1E293B":"#E2E8F0"}`, paddingLeft:8, display:"flex", flexDirection:"column", gap:1 }}>
                    {[
                      { id:"gestion_nominas",    icon:"📋", label:"Gestión de Nóminas" },
                      { id:"gestion_vacaciones", icon:"🏖️",  label:"Gestión de Vacaciones" },
                      { id:"gestion_fichajes",   icon:"🕐", label:"Gestión de Fichajes" },
                    ].map(item => {
                      const activo = seccion === item.id;
                      return (
                        <button key={item.id} onClick={e => { e.stopPropagation(); setSeccion(item.id); }}
                          style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:7, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:activo?700:400, background:activo?(darkMode?"#1E293B":"#EEF2FF"):"transparent", color:activo?empColor:(darkMode?"#64748B":"#94A3B8"), transition:"all .15s", width:"100%" }}
                          onMouseEnter={e => { if(!activo) e.currentTarget.style.background=darkMode?"#1E293B33":"#F4F7FE"; }}
                          onMouseLeave={e => { if(!activo) e.currentTarget.style.background="transparent"; }}>
                          <span style={{ fontSize:13 }}>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── RESTO ── */}
            {[
              { id:"comunicacion", icon:"📣", label:"Comunicación" },
              { id:"nominas",      icon:"💰", label:"Nóminas" },
              ...(!["director","ceo"].includes(usuario?.rol) ? [{ id:"fichaje", icon:"🕐", label:"Fichaje", extra:fichajeActivo }] : []),
              { id:"perfil",       icon:"👤", label:"Perfil" },
            ].map(item => {
              const activo = seccion === item.id;
              return (
                <button key={item.id} onClick={() => setSeccion(item.id)}
                  title={!sidebarOpen ? item.label : ""}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:sidebarOpen?"10px 12px":"10px", justifyContent:sidebarOpen?"flex-start":"center", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:activo?700:500, background:activo?(darkMode?"#1E293B":"#F4F7FE"):"transparent", color:activo?empColor:(darkMode?"#94A3B8":"#68769F"), borderLeft:activo?`3px solid ${empColor}`:"3px solid transparent", transition:"all .15s", width:"100%", whiteSpace:"nowrap" }}
                  onMouseEnter={e => { if(!activo) e.currentTarget.style.background=darkMode?"#1E293B33":"#F4F7FE88"; }}
                  onMouseLeave={e => { if(!activo) e.currentTarget.style.background="transparent"; }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
                  {sidebarOpen && <span style={{ flex:1 }}>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Acciones inferiores */}
          <div style={{ padding:"8px", borderTop:`1px solid ${darkMode?"#1E293B":"#F0F2F5"}`, display:"flex", flexDirection: sidebarOpen ? "row" : "column", gap:6, justifyContent:"center", alignItems:"center" }}>

            {/* Notificaciones */}
            <div style={{ position:"relative" }}>
              <button onClick={() => { setVerNotifs(v => !v); marcarLeidas(); }} title="Notificaciones"
                style={{ background: notifsNoLeidas > 0 ? "#1A2235" : "transparent", border: notifsNoLeidas > 0 ? "1px solid #2E3A55" : "1px solid transparent", borderRadius:8, padding:"7px 10px", cursor:"pointer", fontSize:16, position:"relative", color:darkMode?"#94A3B8":"#68769F" }}>
                🔔
                {notifsNoLeidas > 0 && <span style={{ position:"absolute", top:2, right:2, background:"#E53E3E", color:"#fff", borderRadius:"50%", width:14, height:14, fontSize:8, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{notifsNoLeidas}</span>}
              </button>
            </div>
            {/* Tema */}
            <button onClick={toggleTheme} title={darkMode ? "Modo claro" : "Modo oscuro"}
              style={{ background:"transparent", border:"1px solid transparent", borderRadius:8, padding:"7px 10px", cursor:"pointer", fontSize:16, color:darkMode?"#94A3B8":"#68769F" }}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            {/* Admin */}
            {(["director","ceo"].includes(usuario?.rol) || usuario?.rol === "administrador") && (
              <button onClick={() => setModalAdmin(true)} title="Administración"
                style={{ background:"transparent", border:"1px solid transparent", borderRadius:8, padding:"7px 10px", cursor:"pointer", fontSize:14, color:"#F6AD55" }}>⚙️</button>
            )}
            {/* Logout */}
            <button onClick={handleLogout} title="Cerrar sesión"
              style={{ background:"transparent", border:"1px solid transparent", borderRadius:8, padding:"7px 10px", cursor:"pointer", fontSize:14, color:darkMode?"#64748B":"#A3AED0" }}>🚪</button>
          </div>

          {/* Panel de comunicados eliminado — usar sección propia */}
                    {verNotifs && (
            <div style={{ position:"fixed", left: sidebarOpen ? 248 : 72, bottom:60, background: darkMode?"#111827":"#FFFFFF", border:`1px solid ${darkMode?"#1E293B":"#E2E8F0"}`, borderRadius:12, width:"min(320px,calc(100vw-80px))", maxHeight:360, overflowY:"auto", zIndex:200, boxShadow:"0 16px 40px #0008" }}>
              <div style={{ padding:"12px 16px", borderBottom:`1px solid ${darkMode?"#1E293B":"#E2E8F0"}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ color: darkMode?"#E2E8F0":"#0F172A", fontWeight:800, fontSize:13 }}>Notificaciones</span>
                <button onClick={() => setVerNotifs(false)} style={{ background:"none", border:"none", color: darkMode?"#475569":"#64748B", cursor:"pointer", fontSize:18 }}>×</button>
              </div>
              {misNotifs.length === 0
                ? <p style={{ padding:16, color: darkMode?"#475569":"#64748B", fontSize:13, margin:0 }}>Sin notificaciones</p>
                : misNotifs.slice(0,20).map(n => (
                  <div key={n.id} style={{ padding:"10px 16px", borderBottom:"1px solid #0D1424", background: n.leida ? "transparent" : darkMode?"#1A2235":"#F8FAFC" }}>
                    <p style={{ margin:"0 0 3px", color:"#CBD5E1", fontSize:12 }}>{n.texto}</p>
                    <p style={{ margin:0, color: darkMode?"#475569":"#64748B", fontSize:10 }}>{fmtFecha(n.fecha)}</p>
                  </div>
                ))
              }
            </div>
          )}
        </aside>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, background: darkMode?"#0D1424":"#F0F3FA", overflow:"hidden" }}>

          {/* Topbar */}
          <div style={{ background: darkMode?"#111827":"#FFFFFF", borderBottom:`1px solid ${darkMode?"#1E293B":"#E8EDF2"}`, padding:"0 20px", height:60, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
            {/* Hamburguesa móvil */}
            <button onClick={() => setSidebarOpen(v => !v)}
              style={{ background:"none", border:"none", cursor:"pointer", color: darkMode?"#94A3B8":"#A3AED0", fontSize:22, padding:"4px", display:"flex", alignItems:"center", flexShrink:0 }}>
              ☰
            </button>

            {/* Título sección */}
            <span style={{ fontWeight:700, fontSize:14, color:darkMode?"#E2E8F0":"#1B2559", whiteSpace:"nowrap" }}>
              {{"tickets":"🎫 Tickets","historial":"🗂️ Historial","calendario":"📅 Calendario","reportes":"📄 Reportes","fichaje":"🕐 Fichaje","nominas":"💰 Nóminas","perfil":"👤 Perfil","comunicacion":"📣 Comunicación","rrhh":"👔 RRHH"}[seccion] || ""}
            </span>

            {/* Selector empresa */}
            <div style={{ display:"flex", alignItems:"center", gap:8, background: darkMode?"#1E293B":"#F4F7FE", border:`1px solid ${darkMode?"#2E3A55":"#E0E5F2"}`, borderRadius:8, padding:"6px 12px", cursor:"pointer", flexShrink:0 }}>
              <span style={{ fontSize:14 }}>🏢</span>
              <span style={{ color: darkMode?"#E2E8F0":"#1B2559", fontSize:13, fontWeight:600, whiteSpace:"nowrap" }}>
                {EMPRESAS.find(e=>e.id===usuario?.empresaId)?.nombre || "Todas las empresas"}
              </span>
              <span style={{ color: darkMode?"#64748B":"#A3AED0", fontSize:12 }}>▾</span>
            </div>

            {/* Buscador */}
            <div style={{ flex:1, maxWidth:480, position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color: darkMode?"#475569":"#A3AED0", fontSize:15 }}>🔍</span>
              <input
                placeholder="Buscar tickets, proyectos, personas..."
                style={{ width:"100%", height:38, paddingLeft:36, paddingRight:12, background: darkMode?"#1E293B":"#F4F7FE", border:`1px solid ${darkMode?"#2E3A55":"#E0E5F2"}`, borderRadius:8, color: darkMode?"#E2E8F0":"#1B2559", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
              />
            </div>

            {/* Acciones derecha */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:"auto" }}>
              {fichajeActivo && (
                <span style={{ background:"#38A16922", color:"#38A169", border:"1px solid #38A16944", borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
                  🟢 {new Date(fichajeActivo.entrada).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}
                </span>
              )}
              {/* Switch Web */}
              <div style={{ display:"flex", alignItems:"center", gap:4, background: darkMode?"#1E293B":"#F4F7FE", border:`1px solid ${darkMode?"#2E3A55":"#E0E5F2"}`, borderRadius:8, padding:"5px 10px", fontSize:12, fontWeight:600, color: darkMode?"#94A3B8":"#68769F" }}>
                <span>🖥</span>
                <span>Web</span>
              </div>
              {/* Avatar */}
              <div style={{ width:36, height:36, borderRadius:"50%", background: empColor+"33", border:`2px solid ${empColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color: empColor, fontSize:12, flexShrink:0, cursor:"pointer" }} onClick={() => setSeccion("perfil")}>
                {usuario?.nombre?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()||"U"}
              </div>
            </div>
          </div>

          {/* Contenido de cada sección */}
          <div className="main-content" style={{ flex:1, padding:"24px 28px", overflowY:"auto", overflowX:"hidden" }}>
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
                    <button onClick={() => setSeccion("comunicacion")} style={{ background: "#3182CE22", border: "1px solid #3182CE44", borderRadius: 5, padding: "1px 8px", color: "#3182CE", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
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
        {["director","ceo"].includes(usuario?.rol) && (
          <div className="banner-director" style={{ background: "linear-gradient(135deg, #1A2235, #2D3748)", border: "1px solid #F6AD5533", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#F6AD5522", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👑</div>
            <div>
              <p style={{ margin: 0, color: "#F6AD55", fontWeight: 800, fontSize: 14 }}>Panel de Dirección General — Miguel Manzano</p>
              <p style={{ margin: "2px 0 0", color: darkMode ? "#64748B" : "#475569", fontSize: 12 }}>Tienes acceso completo a todos los tickets de todas las empresas del grupo</p>
            </div>
          </div>
        )}

        {seccion === "reportes" && ["director","ceo","encargado","administrador"].includes(usuario?.rol) && (
          <Reportes tickets={tickets} usuarioActual={usuario} darkMode={darkMode} EMPRESAS={EMPRESAS} USUARIOS={USUARIOS} />
        )}

        {seccion === "historial" && (
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
        )}

        {seccion === "calendario" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 4px", color: darkMode ? "#E2E8F0" : "#0F172A", fontWeight: 800, fontSize: 18 }}>📅 Mi Calendario</h2>
              <p style={{ margin: 0, color: darkMode ? "#475569" : "#64748B", fontSize: 13 }}>Trabajos asignados — aparecen desde la fecha de asignación</p>
            </div>
            <Calendario tickets={tickets} ticketsPersonales={misTicketsPersonales.filter(t => t.creadoPor === usuarioId)} usuarioActual={usuario} onVerTicket={t => setDetalle(t)} onVerTicketPersonal={t => setDetalleMiTicket(t)} />
          </div>
        )}

        {seccion === "tickets" && (
          <>
            {/* ESTADÍSTICAS — clicables */}
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: `repeat(4,1fr)`, gap: 12, marginBottom: 24 }}>
              {[
                ["Mis tickets",  stats.total,       "#94A3B8", "🎫", "kpi_total"],
                ["Pendientes",   stats.pendientes,  "#718096", "⏳", "kpi_pendientes"],
                ["En progreso",  stats.enProgreso,  "#D4A017", "⚙️", "kpi_progreso"],
                ["Completados",  stats.completados, "#38A169", "✅", "kpi_completados"],
                ...((esEncargado || esDirCeo) ? [["Sin asignar", stats.sinAsignar, "#E53E3E", "📋", "kpi_sinasignar"]] : []),
              ].map(([l, v, c, ic, accion]) => {
                const activo = filtros.estado === accion;

                const handleClick = () => {
                  setSeccion("tickets");
                  if (activo) {
                    setFiltros(f => ({ ...f, estado: "todos" }));
                    setVista("mis");
                  } else {
                    setFiltros(f => ({ ...f, estado: accion }));
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
            <div className="filters-row" style={{ display: "flex", gap: 8, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>


              {/* Selector empresa — solo para director/ceo en vista todos */}
              {esDirCeo && vista === "todos" && (
                <select
                  value={filtros.empresa || "todas"}
                  onChange={e => setFiltros(f => ({...f, empresa: e.target.value}))}
                  style={{ height:32, paddingLeft:8, paddingRight:24, background: darkMode?"#1E293B":"#F8FAFC", border:`1px solid ${darkMode?"#2E3A55":"#E2E8F0"}`, borderRadius:8, color: darkMode?"#E2E8F0":"#0F172A", fontSize:12, outline:"none", fontFamily:"inherit", cursor:"pointer" }}>
                  <option value="todas">Todas las empresas</option>
                  {EMPRESAS.filter(e => e.id !== 0).map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              )}

              {/* Buscador compacto */}
              <div style={{ position: "relative", minWidth: 140, maxWidth: 220 }}>
                <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: darkMode ? "#475569" : "#94A3B8", pointerEvents: "none" }}>🔍</span>
                <input value={filtros.buscar} onChange={e => setFiltros(f => ({ ...f, buscar: e.target.value }))} placeholder="Buscar..."
                  style={{ width: "100%", height: 32, paddingLeft: 28, paddingRight: 10, background: darkMode ? "#1E293B" : "#F8FAFC", border: `1px solid ${darkMode ? "#2E3A55" : "#E2E8F0"}`, borderRadius: 8, color: darkMode ? "#E2E8F0" : "#0F172A", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>


              {/* Botones acción */}
              <div style={{ display: "flex", gap: 6, marginLeft: "auto", alignItems: "center", flexShrink: 0 }}>
                <button onClick={() => { if (Notification.permission === "default") Notification.requestPermission(); setModalMisTickets(true); }}
                  className="btn-mis-tickets" style={{ ...btnS, background: darkMode ? "#1E293B" : "#F1F5F9", color: darkMode ? "#94A3B8" : "#475569", border: `1px solid ${darkMode ? "#2E3A55" : "#E2E8F0"}`, padding: "7px 14px", fontSize: 12 }}>
                  📝 Mis Tickets {misTicketsPersonales.filter(t => t.creadoPor === usuarioId && t.estado !== "hecho").length > 0 && <span style={{ background: "#E53E3E", color: "#fff", borderRadius: 99, padding: "1px 6px", fontSize: 10, fontWeight: 700, marginLeft: 4 }}>{misTicketsPersonales.filter(t => t.creadoPor === usuarioId && t.estado !== "hecho").length}</span>}
                </button>
                <button onClick={() => setModalCrear(true)} className="btn-nuevo"
                  style={{ ...btnS, background: empColor, color: "#fff", padding: "7px 16px", fontSize: 12, fontWeight: 700 }}>
                  + Nuevo Ticket
                </button>
              </div>
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

        {/* ── PANEL DE EQUIPO (solo encargados) ── */}
        {seccion === "equipo" && esEncargado && (
          <PanelEquipo
            darkMode={darkMode}
            usuario={usuario}
            usuarioId={usuarioId}
            tickets={tickets}
            empColor={empColor}
            USUARIOS={USUARIOS}
            EMPRESAS={EMPRESAS}
            onVerTicket={setDetalle}
            onActualizar={actualizarTicket}
          />
        )}

        {/* ── GESTIÓN RRHH ── */}
        {seccion === "gestion_nominas" && usuario?.rol === "rrhh" && (
          <GestionNominasRRHH
            darkMode={darkMode}
            usuario={usuario}
            db={db}
            USUARIOS={USUARIOS}
            EMPRESAS={EMPRESAS}
            empColor={empColor}
          />
        )}
        {seccion === "gestion_vacaciones" && usuario?.rol === "rrhh" && (
          <GestionVacacionesRRHH
            darkMode={darkMode}
            usuario={usuario}
            db={db}
            USUARIOS={USUARIOS}
            EMPRESAS={EMPRESAS}
            empColor={empColor}
          />
        )}
        {seccion === "gestion_fichajes" && usuario?.rol === "rrhh" && (
          <GestionFichajesRRHH
            darkMode={darkMode}
            usuario={usuario}
            db={db}
            USUARIOS={USUARIOS}
            EMPRESAS={EMPRESAS}
            empColor={empColor}
          />
        )}

        {/* ── COMUNICACIÓN ── */}
        {seccion === "comunicacion" && (
          <SeccionComunicacion
            darkMode={darkMode}
            usuario={usuario}
            usuarioId={usuarioId}
            comunicados={comunicados}
            db={db}
            empColor={empColor}
            USUARIOS={USUARIOS}
            EMPRESAS={EMPRESAS}
          />
        )}

        {/* ── FICHAJE ── */}
        {seccion === "fichaje" && <SeccionFichaje darkMode={darkMode} fichajes={fichajes} fichajeActivo={fichajeActivo} ficharEntrada={ficharEntrada} ficharSalida={ficharSalida} />}

        {/* ── NÓMINAS ── */}
        {seccion === "nominas" && (() => {
          const esAdminDir = ["director","ceo","administrador","rrhh"].includes(usuario?.rol);
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

      </div>{/* /contenido secciones */}
      </div>{/* /contenido principal */}
      </div>{/* /layout sidebar+contenido */}

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

// ═══════════════════════════════════════════════════════════════════
// MÓDULO: Comunicación
// ═══════════════════════════════════════════════════════════════════

const TIPOS_COMUNICADO = [
  { id: "noticia",     label: "Noticia",      icon: "📰", color: "#3182CE", bg: "#3182CE15" },
  { id: "informativo", label: "Informativo",  icon: "ℹ️",  color: "#38A169", bg: "#38A16915" },
  { id: "urgente",     label: "Urgente",      icon: "🚨", color: "#E53E3E", bg: "#E53E3E15" },
  { id: "aviso",       label: "Aviso",        icon: "⚠️",  color: "#D4A017", bg: "#D4A01715" },
  { id: "evento",      label: "Evento",       icon: "🎉", color: "#805AD5", bg: "#805AD515" },
];

function SeccionComunicacion({ darkMode, usuario, usuarioId, comunicados, db, empColor, USUARIOS, EMPRESAS }) {
  const [filtroTipo, setFiltroTipo]   = useState("todos");
  const [buscar, setBuscar]           = useState("");
  const [modalNuevo, setModalNuevo]   = useState(false);
  const [detalle, setDetalle]         = useState(null);
  const [editando, setEditando]       = useState(null);

  const puedeCrear = ["director","ceo","administrador","encargado","rrhh"].includes(usuario?.rol);

  const comunicadosFiltrados = (comunicados || [])
    .filter(c => c && c.titulo) // solo comunicados válidos
    .filter(c => {
      // Filtrar por destinatario
      if (!c.destinatarios || c.destinatarios.tipo === "todos") return true;
      if (c.destinatarios.tipo === "empresas") return (c.destinatarios.empresaIds||[]).includes(usuario?.empresaId);
      if (c.destinatarios.tipo === "usuarios")  return (c.destinatarios.usuarioIds||[]).includes(usuarioId);
      return true;
    })
    .filter(c => filtroTipo === "todos" || c.tipo === filtroTipo)
    .filter(c => !buscar || c.titulo?.toLowerCase().includes(buscar.toLowerCase()) || c.cuerpo?.toLowerCase().includes(buscar.toLowerCase()))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const dm = darkMode;
  const cardBg    = dm ? "#111827" : "#FFFFFF";
  const border    = dm ? "#1E293B" : "#E2E8F0";
  const textPri   = dm ? "#E2E8F0" : "#0F172A";
  const textMuted = dm ? "#64748B" : "#94A3B8";

  return (
    <div style={{ maxWidth: 1100 }}>

      {/* Cabecera */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ margin:"0 0 4px", color:textPri, fontWeight:800, fontSize:20 }}>📣 Comunicación</h2>
          <p style={{ margin:0, color:textMuted, fontSize:13 }}>Canal interno del Grupo Laura Otero</p>
        </div>
        {puedeCrear && (
          <button onClick={() => setModalNuevo(true)}
            style={{ fontFamily:"inherit", fontSize:13, fontWeight:700, padding:"9px 20px", borderRadius:8, border:"none", cursor:"pointer", background:empColor, color:"#fff" }}>
            + Nuevo comunicado
          </button>
        )}
      </div>

      {/* Filtros */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        {/* Buscador */}
        <div style={{ position:"relative", minWidth:180, maxWidth:260 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:13, color:textMuted, pointerEvents:"none" }}>🔍</span>
          <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar comunicado..."
            style={{ width:"100%", height:36, paddingLeft:30, paddingRight:10, background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${border}`, borderRadius:8, color:textPri, fontSize:12, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
        </div>

        {/* Pills de tipo */}
        {[{id:"todos",label:"Todos",icon:"📋",color:empColor}, ...TIPOS_COMUNICADO].map(t => {
          const activo = filtroTipo === t.id;
          return (
            <button key={t.id} onClick={() => setFiltroTipo(t.id)}
              style={{ fontFamily:"inherit", fontSize:11, fontWeight:600, padding:"5px 13px", borderRadius:99, border:`1px solid ${activo ? t.color : border}`, cursor:"pointer", background: activo ? t.color+"22" : "transparent", color: activo ? t.color : textMuted, transition:"all .15s", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
              {t.icon} {t.label}
              {t.id !== "todos" && <span style={{ background:dm?"#1E293B":"#F1F5F9", borderRadius:99, padding:"0 6px", fontSize:10 }}>
                {comunicados.filter(c => c.tipo === t.id).length}
              </span>}
            </button>
          );
        })}
      </div>

      {/* Grid de comunicados */}
      {comunicadosFiltrados.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <p style={{ fontSize:48, marginBottom:12 }}>📭</p>
          <p style={{ fontSize:15, fontWeight:700, color:textMuted }}>Sin comunicados</p>
          <p style={{ fontSize:13, color:textMuted, opacity:.7 }}>No hay comunicados para este filtro.</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
          {comunicadosFiltrados.map(c => {
            const tipo    = TIPOS_COMUNICADO.find(t => t.id === c.tipo) || TIPOS_COMUNICADO[1];
            const autor   = USUARIOS.find(u => u.id === c.autorId);
            const empresa = EMPRESAS.find(e => e.id === c.empresaId);
            const puedeEditar = usuario?.id === c.autorId || ["director","ceo","administrador"].includes(usuario?.rol);
            const caducaDate  = c.fechaCaducidad ? new Date(c.fechaCaducidad) : null;
            const caducada    = caducaDate && caducaDate < new Date();

            return (
              <div key={c.id} onClick={() => setDetalle(c)}
                style={{ background:cardBg, border:`1px solid ${caducada ? border+"88" : tipo.color+"55"}`, borderRadius:12, padding:"16px 18px", cursor:"pointer", opacity: caducada ? .6 : 1, transition:"box-shadow .15s", position:"relative" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow=`0 4px 20px ${tipo.color}22`}
                onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>

                {/* Badge tipo */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <span style={{ background:tipo.bg, color:tipo.color, border:`1px solid ${tipo.color}44`, borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
                    {tipo.icon} {tipo.label}
                  </span>
                  {puedeEditar && (
                    <div style={{ display:"flex", gap:4 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => { setEditando(c); setModalNuevo(true); }}
                        style={{ background:"none", border:"none", cursor:"pointer", color:textMuted, fontSize:14, padding:"2px 5px" }} title="Editar">✏️</button>
                      <button onClick={() => { deleteDoc(doc(db,"comunicados",c.id)); }}
                        style={{ background:"none", border:"none", cursor:"pointer", color:textMuted, fontSize:14, padding:"2px 5px" }} title="Eliminar">🗑️</button>
                    </div>
                  )}
                </div>

                {/* Título y cuerpo */}
                <h3 style={{ margin:"0 0 6px", color:textPri, fontSize:15, fontWeight:700, lineHeight:1.3 }}>{c.titulo}</h3>
                {c.cuerpo && <p style={{ margin:"0 0 12px", color:textMuted, fontSize:13, lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{c.cuerpo}</p>}

                {/* PDF */}
                {c.adjuntoPDF && (
                  <div style={{ background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${border}`, borderRadius:7, padding:"7px 12px", marginBottom:10, display:"flex", alignItems:"center", gap:8 }} onClick={e => e.stopPropagation()}>
                    <span style={{ fontSize:16 }}>📄</span>
                    <a href={c.adjuntoPDF.dataUrl} download={c.adjuntoPDF.nombre} style={{ color:empColor, fontSize:12, fontWeight:600, textDecoration:"none" }}>{c.adjuntoPDF.nombre}</a>
                  </div>
                )}

                {/* Destinatarios */}
                <div style={{ marginBottom:10 }}>
                  {!c.destinatarios || c.destinatarios.tipo === "todos"
                    ? <span style={{ color:textMuted, fontSize:11 }}>🌐 Todos los usuarios</span>
                    : c.destinatarios.tipo === "empresas"
                    ? <span style={{ color:textMuted, fontSize:11 }}>🏢 {(c.destinatarios.empresaIds||[]).map(id => EMPRESAS.find(e=>e.id===id)?.nombre).filter(Boolean).join(", ")}</span>
                    : <span style={{ color:textMuted, fontSize:11 }}>👤 {(c.destinatarios.usuarioIds||[]).length} usuario{(c.destinatarios.usuarioIds||[]).length !== 1 ? "s" : ""}</span>
                  }
                </div>

                {/* Footer */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:`1px solid ${border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:(empresa?.color||empColor)+"33", border:`1.5px solid ${empresa?.color||empColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:empresa?.color||empColor }}>
                      {autor?.nombre?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()||"?"}
                    </div>
                    <span style={{ color:textMuted, fontSize:11 }}>{autor?.nombre?.split(" ").slice(0,2).join(" ")}</span>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ color:textMuted, fontSize:11 }}>{c.fecha ? new Date(c.fecha).toLocaleDateString("es-ES",{day:"2-digit",month:"short"}) : ""}</span>
                    {caducaDate && (
                      <span style={{ display:"block", color: caducada ? "#E53E3E" : "#D4A017", fontSize:10 }}>
                        {caducada ? "⚠️ Caducado" : `⏰ Caduca ${new Date(c.fechaCaducidad).toLocaleDateString("es-ES",{day:"2-digit",month:"short"})}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal nuevo/editar comunicado */}
      {modalNuevo && (
        <ModalNuevoComunicado
          darkMode={dm}
          usuario={usuario}
          usuarioId={usuarioId}
          db={db}
          empColor={empColor}
          USUARIOS={USUARIOS}
          EMPRESAS={EMPRESAS}
          comunicadoInicial={editando}
          onClose={() => { setModalNuevo(false); setEditando(null); }}
        />
      )}

      {/* Modal detalle */}
      {detalle && (
        <DetalleComunicado
          darkMode={dm}
          c={detalle}
          USUARIOS={USUARIOS}
          EMPRESAS={EMPRESAS}
          empColor={empColor}
          onClose={() => setDetalle(null)}
        />
      )}
    </div>
  );
}

function ModalNuevoComunicado({ darkMode, usuario, usuarioId, db, empColor, USUARIOS, EMPRESAS, comunicadoInicial, onClose }) {
  const [tipo, setTipo]               = useState(comunicadoInicial?.tipo || "informativo");
  const [titulo, setTitulo]           = useState(comunicadoInicial?.titulo || "");
  const [cuerpo, setCuerpo]           = useState(comunicadoInicial?.cuerpo || "");
  const [destTipo, setDestTipo]       = useState(comunicadoInicial?.destinatarios?.tipo || "todos");
  const [destEmpresas, setDestEmpresas] = useState(comunicadoInicial?.destinatarios?.empresaIds || []);
  const [destUsuarios, setDestUsuarios] = useState(comunicadoInicial?.destinatarios?.usuarioIds || []);
  const [fechaCad, setFechaCad]       = useState(comunicadoInicial?.fechaCaducidad ? new Date(comunicadoInicial.fechaCaducidad).toISOString().split("T")[0] : "");
  const [adjuntoPDF, setAdjuntoPDF]   = useState(comunicadoInicial?.adjuntoPDF || null);
  const [loading, setLoading]         = useState(false);
  const [buscarUser, setBuscarUser]   = useState("");

  const dm = darkMode;
  const s = {
    inp:   { fontFamily:"inherit", fontSize:13, background:dm?"#1A2235":"#F8FAFC", border:`1px solid ${dm?"#2E3A55":"#CBD5E1"}`, borderRadius:7, padding:"9px 12px", color:dm?"#E2E8F0":"#0F172A", outline:"none", width:"100%", boxSizing:"border-box" },
    label: { display:"block", color:dm?"#64748B":"#475569", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".4px", marginBottom:5 },
  };

  const handlePDF = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5*1024*1024) { alert("El PDF no puede superar 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => setAdjuntoPDF({ nombre: file.name, dataUrl: ev.target.result });
    reader.readAsDataURL(file);
  };

  const guardar = async () => {
    if (!titulo.trim()) return;
    setLoading(true);
    const empresa = EMPRESAS.find(e => e.id === usuario?.empresaId);
    const data = {
      tipo,
      titulo:    titulo.trim(),
      cuerpo:    cuerpo.trim() || null,
      autorId:   usuarioId,
      empresaId: usuario?.empresaId,
      fecha:     comunicadoInicial?.fecha || new Date().toISOString(),
      fechaCaducidad: fechaCad ? new Date(fechaCad).toISOString() : null,
      adjuntoPDF: adjuntoPDF || null,
      destinatarios: {
        tipo: destTipo,
        ...(destTipo === "empresas" && { empresaIds: destEmpresas }),
        ...(destTipo === "usuarios" && { usuarioIds: destUsuarios }),
      },
    };
    if (comunicadoInicial) {
      await updateDoc(doc(db, "comunicados", comunicadoInicial.id), { ...data, fechaEditado: new Date().toISOString() });
    } else {
      const id = "com_" + Date.now();
      await setDoc(doc(db, "comunicados", id), { ...data, id });
    }
    setLoading(false);
    onClose();
  };

  const tipoActual = TIPOS_COMUNICADO.find(t => t.id === tipo);

  return (
    <div style={{ position:"fixed", inset:0, background:"#00000099", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:1000, padding:20, overflowY:"auto" }} onMouseDown={onClose}>
      <div style={{ background:dm?"#111827":"#FFFFFF", border:`1px solid ${dm?"#2E3A55":"#CBD5E1"}`, borderRadius:14, width:"100%", maxWidth:560, padding:28, boxShadow:"0 24px 80px #0008", margin:"auto" }} onMouseDown={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ margin:0, fontSize:17, fontWeight:800, color:dm?"#E2E8F0":"#0F172A" }}>
            {comunicadoInicial ? "✏️ Editar comunicado" : "📣 Nuevo comunicado"}
          </h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748B", fontSize:22, cursor:"pointer" }}>×</button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Selector tipo */}
          <div>
            <label style={s.label}>Tipo de comunicado</label>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {TIPOS_COMUNICADO.map(t => (
                <button key={t.id} onClick={() => setTipo(t.id)}
                  style={{ fontFamily:"inherit", fontSize:11, fontWeight:700, padding:"5px 13px", borderRadius:99, border:`2px solid ${tipo===t.id ? t.color : dm?"#2E3A55":"#E2E8F0"}`, cursor:"pointer", background: tipo===t.id ? t.color+"22" : "transparent", color: tipo===t.id ? t.color : dm?"#64748B":"#94A3B8", transition:"all .15s" }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label style={s.label}>Título *</label>
            <input style={s.inp} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej: Reunión el viernes a las 10h" />
          </div>

          {/* Mensaje */}
          <div>
            <label style={s.label}>Mensaje (opcional)</label>
            <textarea style={{ ...s.inp, minHeight:90, resize:"vertical" }} value={cuerpo} onChange={e => setCuerpo(e.target.value)} placeholder="Detalle del comunicado..." />
          </div>

          {/* Destinatarios */}
          <div>
            <label style={s.label}>👥 Destinatarios</label>
            <div style={{ display:"flex", gap:4, marginBottom:10 }}>
              {[["todos","🌐 Todos"],["empresas","🏢 Por empresa"],["usuarios","👤 Por usuario"]].map(([v,l]) => (
                <button key={v} onClick={() => setDestTipo(v)}
                  style={{ fontFamily:"inherit", fontSize:12, fontWeight:600, padding:"6px 14px", borderRadius:7, border:`1px solid ${destTipo===v ? empColor : dm?"#2E3A55":"#E2E8F0"}`, cursor:"pointer", background: destTipo===v ? empColor+"22" : "transparent", color: destTipo===v ? empColor : dm?"#64748B":"#94A3B8" }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Selector empresas */}
            {destTipo === "empresas" && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {EMPRESAS.map(e => {
                  const sel = destEmpresas.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => setDestEmpresas(prev => sel ? prev.filter(x=>x!==e.id) : [...prev,e.id])}
                      style={{ fontFamily:"inherit", fontSize:11, fontWeight:600, padding:"4px 12px", borderRadius:99, border:`1px solid ${sel?e.color:dm?"#2E3A55":"#E2E8F0"}`, cursor:"pointer", background:sel?e.color+"22":"transparent", color:sel?e.color:dm?"#64748B":"#94A3B8", display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ width:7, height:7, borderRadius:"50%", background:e.color }} />
                      {e.nombre}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selector usuarios */}
            {destTipo === "usuarios" && (
              <div>
                <input value={buscarUser} onChange={e => setBuscarUser(e.target.value)} placeholder="Buscar usuario..."
                  style={{ ...s.inp, marginBottom:8, height:34 }} />
                <div style={{ maxHeight:180, overflowY:"auto", border:`1px solid ${dm?"#2E3A55":"#E2E8F0"}`, borderRadius:8 }}>
                  {EMPRESAS.map(emp => {
                    const usrs = USUARIOS.filter(u => u.empresaId === emp.id && (!buscarUser || u.nombre.toLowerCase().includes(buscarUser.toLowerCase())));
                    if (!usrs.length) return null;
                    return (
                      <div key={emp.id}>
                        <div style={{ padding:"6px 12px", background:dm?"#0D1424":"#F8FAFC", fontSize:10, fontWeight:700, color:emp.color, textTransform:"uppercase", display:"flex", justifyContent:"space-between" }}>
                          {emp.nombre}
                          <button onClick={() => {
                            const ids = usrs.map(u=>u.id);
                            const allSel = ids.every(id => destUsuarios.includes(id));
                            setDestUsuarios(prev => allSel ? prev.filter(x=>!ids.includes(x)) : [...new Set([...prev,...ids])]);
                          }} style={{ background:"none", border:"none", cursor:"pointer", color:emp.color, fontSize:10, fontWeight:700 }}>
                            {usrs.every(u=>destUsuarios.includes(u.id)) ? "✓ Todos" : "+ Todos"}
                          </button>
                        </div>
                        {usrs.map(u => (
                          <div key={u.id} onClick={() => setDestUsuarios(prev => prev.includes(u.id) ? prev.filter(x=>x!==u.id) : [...prev,u.id])}
                            style={{ padding:"7px 12px", display:"flex", alignItems:"center", gap:8, cursor:"pointer", borderBottom:`1px solid ${dm?"#0D1424":"#F1F5F9"}` }}>
                            <span style={{ width:16, height:16, borderRadius:4, border:`2px solid ${destUsuarios.includes(u.id)?empColor:dm?"#2E3A55":"#CBD5E1"}`, background:destUsuarios.includes(u.id)?empColor:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", flexShrink:0 }}>
                              {destUsuarios.includes(u.id)?"✓":""}
                            </span>
                            <span style={{ fontSize:12, color:dm?"#E2E8F0":"#0F172A" }}>{u.nombre}</span>
                            <span style={{ fontSize:10, color:dm?"#475569":"#94A3B8", marginLeft:"auto" }}>{u.rol}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                {destUsuarios.length > 0 && <p style={{ margin:"6px 0 0", color:empColor, fontSize:11, fontWeight:600 }}>{destUsuarios.length} usuario{destUsuarios.length>1?"s":""} seleccionado{destUsuarios.length>1?"s":""}</p>}
              </div>
            )}
          </div>

          {/* Fecha caducidad */}
          <div>
            <label style={s.label}>📅 Fecha de caducidad (opcional)</label>
            <input type="date" style={{ ...s.inp, colorScheme:dm?"dark":"light" }} value={fechaCad} onChange={e => setFechaCad(e.target.value)} />
            <p style={{ margin:"4px 0 0", color:dm?"#334155":"#94A3B8", fontSize:11 }}>Si no indicas fecha, el comunicado permanece hasta que lo elimines.</p>
          </div>

          {/* PDF */}
          <div>
            <label style={s.label}>📎 Adjuntar PDF (opcional, máx. 5 MB)</label>
            {adjuntoPDF ? (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:dm?"#1E293B":"#F8FAFC", borderRadius:7, border:`1px solid ${dm?"#2E3A55":"#E2E8F0"}` }}>
                <span>📄</span>
                <span style={{ fontSize:12, color:dm?"#E2E8F0":"#0F172A", flex:1 }}>{adjuntoPDF.nombre}</span>
                <button onClick={() => setAdjuntoPDF(null)} style={{ background:"none", border:"none", color:"#E53E3E", cursor:"pointer", fontSize:16 }}>×</button>
              </div>
            ) : (
              <label style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${dm?"#2E3A55":"#E2E8F0"}`, borderRadius:7, cursor:"pointer", fontSize:12, color:dm?"#94A3B8":"#64748B" }}>
                📎 Seleccionar PDF
                <input type="file" accept=".pdf" style={{ display:"none" }} onChange={handlePDF} />
              </label>
            )}
          </div>

          {/* Botones */}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:6 }}>
            <button onClick={onClose} style={{ fontFamily:"inherit", fontSize:13, fontWeight:600, padding:"9px 18px", borderRadius:7, border:`1px solid ${dm?"#2E3A55":"#CBD5E1"}`, cursor:"pointer", background:"transparent", color:dm?"#94A3B8":"#475569" }}>Cancelar</button>
            <button onClick={guardar} disabled={!titulo.trim() || loading}
              style={{ fontFamily:"inherit", fontSize:13, fontWeight:700, padding:"9px 20px", borderRadius:7, border:"none", cursor: titulo.trim() ? "pointer" : "not-allowed", background: tipoActual?.color || empColor, color:"#fff", opacity: titulo.trim() ? 1 : 0.5 }}>
              {loading ? "Publicando..." : comunicadoInicial ? "💾 Guardar cambios" : "📣 Publicar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetalleComunicado({ darkMode, c, USUARIOS, EMPRESAS, empColor, onClose }) {
  const tipo    = TIPOS_COMUNICADO.find(t => t.id === c.tipo) || TIPOS_COMUNICADO[1];
  const autor   = USUARIOS.find(u => u.id === c.autorId);
  const empresa = EMPRESAS.find(e => e.id === c.empresaId);
  const dm = darkMode;

  return (
    <div style={{ position:"fixed", inset:0, background:"#00000099", display:"flex", alignItems:"flex-start", justifyContent:"center", zIndex:1000, padding:20, overflowY:"auto" }} onMouseDown={onClose}>
      <div style={{ background:dm?"#111827":"#FFFFFF", border:`1px solid ${dm?"#2E3A55":"#CBD5E1"}`, borderRadius:14, width:"100%", maxWidth:600, padding:28, boxShadow:"0 24px 80px #0008", margin:"auto" }} onMouseDown={e => e.stopPropagation()}>

        {/* Badge tipo */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ background:tipo.bg, color:tipo.color, border:`1px solid ${tipo.color}44`, borderRadius:99, padding:"4px 12px", fontSize:12, fontWeight:700 }}>
            {tipo.icon} {tipo.label}
          </span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748B", fontSize:22, cursor:"pointer" }}>×</button>
        </div>

        <h2 style={{ margin:"0 0 12px", color:dm?"#E2E8F0":"#0F172A", fontSize:20, fontWeight:800, lineHeight:1.3 }}>{c.titulo}</h2>
        {c.cuerpo && <p style={{ margin:"0 0 18px", color:dm?"#94A3B8":"#475569", fontSize:14, lineHeight:1.65 }}>{c.cuerpo}</p>}

        {c.adjuntoPDF && (
          <div style={{ background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${dm?"#2E3A55":"#E2E8F0"}`, borderRadius:9, padding:"10px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>📄</span>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontWeight:700, fontSize:13, color:dm?"#E2E8F0":"#0F172A" }}>{c.adjuntoPDF.nombre}</p>
            </div>
            <a href={c.adjuntoPDF.dataUrl} download={c.adjuntoPDF.nombre}
              style={{ background:empColor, color:"#fff", borderRadius:7, padding:"6px 14px", fontSize:12, fontWeight:700, textDecoration:"none" }}>
              ⬇️ Descargar
            </a>
          </div>
        )}

        <div style={{ paddingTop:14, borderTop:`1px solid ${dm?"#1E293B":"#E2E8F0"}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:(empresa?.color||empColor)+"33", border:`2px solid ${empresa?.color||empColor}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:empresa?.color||empColor }}>
              {autor?.nombre?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()||"?"}
            </div>
            <div>
              <p style={{ margin:0, fontWeight:700, fontSize:13, color:dm?"#E2E8F0":"#0F172A" }}>{autor?.nombre}</p>
              <p style={{ margin:0, fontSize:11, color:dm?"#475569":"#94A3B8" }}>{empresa?.nombre} · {c.fecha ? new Date(c.fecha).toLocaleDateString("es-ES",{day:"2-digit",month:"long",year:"numeric"}) : ""}</p>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            {!c.destinatarios || c.destinatarios.tipo === "todos"
              ? <span style={{ color:dm?"#475569":"#94A3B8", fontSize:12 }}>🌐 Todos los usuarios</span>
              : c.destinatarios.tipo === "empresas"
              ? <span style={{ color:dm?"#475569":"#94A3B8", fontSize:12 }}>🏢 {(c.destinatarios.empresaIds||[]).map(id=>EMPRESAS.find(e=>e.id===id)?.nombre).filter(Boolean).join(", ")}</span>
              : <span style={{ color:dm?"#475569":"#94A3B8", fontSize:12 }}>👤 {(c.destinatarios.usuarioIds||[]).length} usuarios</span>
            }
            {c.fechaEditado && <p style={{ margin:"4px 0 0", fontSize:10, color:dm?"#334155":"#CBD5E1" }}>Editado {new Date(c.fechaEditado).toLocaleDateString("es-ES")}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MÓDULO: Panel de Equipo (solo encargados)
// ═══════════════════════════════════════════════════════════════════

function PanelEquipo({ darkMode, usuario, usuarioId, tickets, empColor, USUARIOS, EMPRESAS, onVerTicket, onActualizar }) {
  const [subVista, setSubVista] = useState("sinAsignar");
  const [buscar, setBuscar]     = useState("");

  const dm       = darkMode;
  const miEmpId  = usuario?.empresaId;
  const miEmpresa = EMPRESAS.find(e => e.id === miEmpId);
  const misTrabs  = USUARIOS.filter(u => u.empresaId === miEmpId && u.id !== usuario?.id); // todos excepto el encargado mismo

  // Tickets de mi empresa (destino o creados por mí)
  const ticketsEmpresa = tickets.filter(t => {
    const eds = t.empresasDestino || [];
    return eds.includes(miEmpId) || t.creadoPor === usuarioId;
  });

  // Sin asignar: pendientes hacia mi empresa sin asignar
  const sinAsignar = ticketsEmpresa.filter(t =>
    t.estado === "Pendiente" &&
    !(t.asignacionesPorEmpresa?.[miEmpId]?.length > 0)
  );

  // En curso: asignados a alguien de mi empresa y activos
  const enCurso = ticketsEmpresa.filter(t =>
    ["Asignado","En progreso"].includes(t.estado) &&
    (t.asignacionesPorEmpresa?.[miEmpId]?.length > 0)
  );

  // Completados de mi empresa
  const completados = ticketsEmpresa.filter(t => t.estado === "Completado");

  const filtrar = (lista) => {
    if (!buscar) return lista;
    return lista.filter(t => t.titulo?.toLowerCase().includes(buscar.toLowerCase()));
  };

  const vistas = [
    { id: "sinAsignar", label: `⏳ Sin asignar`, count: sinAsignar.length, color: "#E53E3E" },
    { id: "enCurso",    label: `⚙️ En curso`,    count: enCurso.length,    color: "#D4A017" },
    { id: "completados",label: `✅ Completados`,  count: completados.length, color: "#38A169" },
  ];

  const listaActual = subVista === "sinAsignar" ? sinAsignar
                    : subVista === "enCurso"    ? enCurso
                    : completados;

  const cardBg  = dm ? "#111827" : "#FFFFFF";
  const border  = dm ? "#1E293B" : "#E2E8F0";
  const textPri = dm ? "#E2E8F0" : "#0F172A";
  const muted   = dm ? "#64748B" : "#94A3B8";

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Cabecera */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: "0 0 4px", color: textPri, fontWeight: 800, fontSize: 20 }}>
          👥 Panel de equipo — {miEmpresa?.nombre}
        </h2>
        <p style={{ margin: 0, color: muted, fontSize: 13 }}>
          Gestión de tickets de tu empresa
        </p>
      </div>

      {/* KPIs resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 22 }}>
        {vistas.map(v => (
          <div key={v.id} onClick={() => setSubVista(v.id)}
            style={{ background: subVista === v.id ? v.color + "18" : cardBg, border: `1px solid ${subVista === v.id ? v.color : border}`, borderRadius: 12, padding: "16px 20px", cursor: "pointer", transition: "all .15s" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: subVista === v.id ? v.color : textPri, lineHeight: 1 }}>{v.count}</div>
            <div style={{ color: subVista === v.id ? v.color : muted, fontSize: 12, fontWeight: 700, marginTop: 4 }}>{v.label}</div>
          </div>
        ))}
      </div>

      {/* Resumen por trabajador */}
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
        <p style={{ margin: "0 0 12px", color: muted, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px" }}>
          Carga por trabajador
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {misTrabs.map(u => {
            const asignados = enCurso.filter(t =>
              (t.asignacionesPorEmpresa?.[miEmpId] || []).includes(u.id)
            ).length;
            return (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 7, background: dm ? "#0D1424" : "#F8FAFC", border: `1px solid ${border}`, borderRadius: 8, padding: "6px 12px" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: empColor + "33", border: `2px solid ${empColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: empColor, fontSize: 10, flexShrink: 0 }}>
                  {u.nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: textPri }}>{u.nombre.split(" ")[0]}</p>
                  <p style={{ margin: 0, fontSize: 10, color: asignados > 0 ? empColor : muted }}>
                    {asignados} ticket{asignados !== 1 ? "s" : ""} activo{asignados !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            );
          })}
          {misTrabs.length === 0 && (
            <p style={{ color: muted, fontSize: 13 }}>No hay trabajadores en tu empresa.</p>
          )}
        </div>
      </div>

      {/* Buscador */}
      <div style={{ position: "relative", maxWidth: 280, marginBottom: 16 }}>
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: muted, fontSize: 13 }}>🔍</span>
        <input value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Buscar ticket..."
          style={{ width: "100%", height: 34, paddingLeft: 30, paddingRight: 10, background: dm ? "#1E293B" : "#F8FAFC", border: `1px solid ${border}`, borderRadius: 8, color: textPri, fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>

      {/* Lista de tickets */}
      {filtrar(listaActual).length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: 40 }}>{subVista === "sinAsignar" ? "✅" : subVista === "enCurso" ? "⚙️" : "📋"}</p>
          <p style={{ color: muted, fontSize: 14, fontWeight: 700 }}>
            {subVista === "sinAsignar" ? "¡Todo asignado!" : subVista === "enCurso" ? "Sin tickets en curso" : "Sin completados"}
          </p>
        </div>
      ) : (
        <div className="tickets-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
          {filtrar(listaActual).map(t => {
            const asignadosEmp = (t.asignacionesPorEmpresa?.[miEmpId] || [])
              .map(id => USUARIOS.find(u => u.id === id))
              .filter(Boolean);
            const origen = EMPRESAS.find(e => e.id === t.empresaOrigenId);
            const vencido = t.fechaLimite && new Date(t.fechaLimite) < new Date() && !["Completado","Cancelado"].includes(t.estado);

            return (
              <div key={t.id} onClick={() => onVerTicket(t)}
                style={{ background: cardBg, border: `2px solid ${vencido ? "#E53E3E" : border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px #0002"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>

                {/* Origen y estado */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {origen && <span style={{ background: origen.color + "22", color: origen.color, borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>● {origen.nombre}</span>}
                    {vencido && <span style={{ background: "#E53E3E22", color: "#E53E3E", borderRadius: 99, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>⚠ VENCIDO</span>}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: t.estado === "Pendiente" ? "#718096" : t.estado === "Asignado" ? "#3182CE" : t.estado === "En progreso" ? "#D4A017" : "#38A169", background: (t.estado === "Pendiente" ? "#71809622" : t.estado === "Asignado" ? "#3182CE22" : t.estado === "En progreso" ? "#D4A01722" : "#38A16922"), borderRadius: 99, padding: "2px 8px" }}>
                    {t.estado}
                  </span>
                </div>

                {/* Título */}
                <p style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 14, color: textPri, lineHeight: 1.3 }}>{t.titulo}</p>

                {/* Asignados */}
                {asignadosEmp.length > 0 ? (
                  <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 8 }}>
                    {asignadosEmp.slice(0, 4).map(u => (
                      <div key={u.id} title={u.nombre}
                        style={{ width: 26, height: 26, borderRadius: "50%", background: empColor + "44", border: `2px solid ${empColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: empColor }}>
                        {u.nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                    ))}
                    {asignadosEmp.length > 4 && <span style={{ color: muted, fontSize: 11 }}>+{asignadosEmp.length - 4}</span>}
                  </div>
                ) : (
                  subVista === "sinAsignar" && (
                    <p style={{ margin: "0 0 8px", color: "#E53E3E", fontSize: 11, fontWeight: 600 }}>⚠ Sin asignar — pulsa para asignar</p>
                  )
                )}

                {/* Fecha límite */}
                {t.fechaLimite && (
                  <p style={{ margin: 0, color: vencido ? "#E53E3E" : muted, fontSize: 11 }}>
                    📅 Límite: {new Date(t.fechaLimite).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════════
// MÓDULOS RRHH — Daniel Pizarro
// ═══════════════════════════════════════════════════════════════════

// ── Gestión de Nóminas ──────────────────────────────────────────────
function GestionNominasRRHH({ darkMode, usuario, db, USUARIOS, EMPRESAS, empColor }) {
  const [nominas,      setNominas]      = useState([]);
  const [modalSubir,   setModalSubir]   = useState(false);
  const [filtroEmp,    setFiltroEmp]    = useState("todas");
  const [filtroUser,   setFiltroUser]   = useState("todos");
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "nominas"), snap => {
      setNominas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [db]);

  const dm = darkMode;
  const cardBg = dm ? "#111827" : "#FFFFFF";
  const border  = dm ? "#1E293B" : "#E2E8F0";
  const textPri = dm ? "#E2E8F0" : "#0F172A";
  const muted   = dm ? "#64748B" : "#94A3B8";

  const nominasFiltradas = nominas
    .filter(n => filtroEmp === "todas" || String(n.empresaId) === filtroEmp)
    .filter(n => filtroUser === "todos" || String(n.usuarioId) === filtroUser)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const usuariosFiltro = USUARIOS.filter(u =>
    filtroEmp === "todas" || String(u.empresaId) === filtroEmp
  );

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ margin:"0 0 4px", color:textPri, fontWeight:800, fontSize:20 }}>📋 Gestión de Nóminas</h2>
          <p style={{ margin:0, color:muted, fontSize:13 }}>Sube y gestiona las nóminas de todos los empleados</p>
        </div>
        <button onClick={() => setModalSubir(true)}
          style={{ fontFamily:"inherit", fontSize:13, fontWeight:700, padding:"9px 20px", borderRadius:8, border:"none", cursor:"pointer", background:empColor, color:"#fff" }}>
          + Subir Nómina
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <select value={filtroEmp} onChange={e => { setFiltroEmp(e.target.value); setFiltroUser("todos"); }}
          style={{ height:34, padding:"0 10px", background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${border}`, borderRadius:8, color:textPri, fontSize:12, fontFamily:"inherit", outline:"none" }}>
          <option value="todas">Todas las empresas</option>
          {EMPRESAS.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={filtroUser} onChange={e => setFiltroUser(e.target.value)}
          style={{ height:34, padding:"0 10px", background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${border}`, borderRadius:8, color:textPri, fontSize:12, fontFamily:"inherit", outline:"none" }}>
          <option value="todos">Todos los empleados</option>
          {usuariosFiltro.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>
      </div>

      {/* Lista nóminas */}
      {loading ? (
        <p style={{ color:muted, textAlign:"center", padding:40 }}>Cargando nóminas...</p>
      ) : nominasFiltradas.length === 0 ? (
        <div style={{ textAlign:"center", padding:"70px 20px" }}>
          <p style={{ fontSize:48, marginBottom:12 }}>💰</p>
          <p style={{ color:muted, fontSize:14, fontWeight:700 }}>No hay nóminas para este filtro</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {nominasFiltradas.map(n => {
            const usr = USUARIOS.find(u => u.id === n.usuarioId);
            const emp = EMPRESAS.find(e => e.id === n.empresaId);
            return (
              <div key={n.id} style={{ background:cardBg, border:`1px solid ${border}`, borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:(emp?.color||empColor)+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>💰</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:14, color:textPri }}>{usr?.nombre || "Usuario"}</span>
                    {emp && <span style={{ background:emp.color+"18", color:emp.color, borderRadius:4, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{emp.nombre}</span>}
                  </div>
                  <span style={{ color:muted, fontSize:12 }}>
                    {n.mes || "—"} · Subida {n.fecha ? new Date(n.fecha).toLocaleDateString("es-ES") : "—"}
                  </span>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {n.url && (
                    <a href={n.url} download={n.nombre || "nomina.pdf"} target="_blank" rel="noreferrer"
                      style={{ fontFamily:"inherit", fontSize:12, fontWeight:700, padding:"7px 14px", borderRadius:7, border:`1px solid ${empColor}`, color:empColor, textDecoration:"none", background:empColor+"11" }}>
                      ⬇ Descargar
                    </a>
                  )}
                  <button onClick={() => deleteDoc(doc(db, "nominas", n.id))}
                    style={{ fontFamily:"inherit", fontSize:12, padding:"7px 12px", borderRadius:7, border:`1px solid ${border}`, cursor:"pointer", background:"transparent", color:"#E53E3E" }}>
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal subir nómina */}
      {modalSubir && (
        <ModalSubirNominaRRHH
          darkMode={dm}
          db={db}
          USUARIOS={USUARIOS}
          EMPRESAS={EMPRESAS}
          empColor={empColor}
          onClose={() => setModalSubir(false)}
        />
      )}
    </div>
  );
}

function ModalSubirNominaRRHH({ darkMode, db, USUARIOS, EMPRESAS, empColor, onClose }) {
  const [empresaId, setEmpresaId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [mes,       setMes]       = useState("");
  const [archivo,   setArchivo]   = useState(null);
  const [loading,   setLoading]   = useState(false);

  const dm = darkMode;
  const inp = { fontFamily:"inherit", fontSize:13, background:dm?"#1A2235":"#F8FAFC", border:`1px solid ${dm?"#2E3A55":"#CBD5E1"}`, borderRadius:7, padding:"9px 12px", color:dm?"#E2E8F0":"#0F172A", outline:"none", width:"100%", boxSizing:"border-box" };
  const label = { display:"block", color:dm?"#64748B":"#475569", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".4px", marginBottom:5 };

  const usuariosEmp = USUARIOS.filter(u => String(u.empresaId) === empresaId);

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setArchivo({ nombre: f.name, url: ev.target.result });
    reader.readAsDataURL(f);
  };

  const subir = async () => {
    if (!empresaId || !usuarioId || !mes || !archivo) return;
    setLoading(true);
    const id = "nom_" + Date.now();
    await setDoc(doc(db, "nominas", id), {
      id, usuarioId: Number(usuarioId), empresaId: Number(empresaId),
      mes, nombre: archivo.nombre, url: archivo.url,
      fecha: new Date().toISOString(), subidoPor: "rrhh",
    });
    setLoading(false);
    onClose();
  };

  const canSubmit = empresaId && usuarioId && mes && archivo;

  return (
    <div style={{ position:"fixed", inset:0, background:"#00000099", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }} onMouseDown={onClose}>
      <div style={{ background:dm?"#111827":"#FFFFFF", border:`1px solid ${dm?"#2E3A55":"#CBD5E1"}`, borderRadius:14, width:"100%", maxWidth:480, padding:28, boxShadow:"0 24px 80px #0008" }} onMouseDown={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h2 style={{ margin:0, fontSize:17, fontWeight:800, color:dm?"#E2E8F0":"#0F172A" }}>💰 Subir Nómina</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748B", fontSize:22, cursor:"pointer" }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={label}>Empresa *</label>
            <select style={inp} value={empresaId} onChange={e => { setEmpresaId(e.target.value); setUsuarioId(""); }}>
              <option value="">Selecciona empresa...</option>
              {EMPRESAS.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Empleado *</label>
            <select style={inp} value={usuarioId} onChange={e => setUsuarioId(e.target.value)} disabled={!empresaId}>
              <option value="">Selecciona empleado...</option>
              {usuariosEmp.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Mes *</label>
            <input type="month" style={{ ...inp, colorScheme:dm?"dark":"light" }} value={mes} onChange={e => setMes(e.target.value)} />
          </div>
          <div>
            <label style={label}>Archivo PDF *</label>
            {archivo ? (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:dm?"#1E293B":"#F8FAFC", borderRadius:7, border:`1px solid ${dm?"#2E3A55":"#E2E8F0"}` }}>
                <span>📄</span>
                <span style={{ fontSize:12, color:dm?"#E2E8F0":"#0F172A", flex:1 }}>{archivo.nombre}</span>
                <button onClick={() => setArchivo(null)} style={{ background:"none", border:"none", color:"#E53E3E", cursor:"pointer", fontSize:16 }}>×</button>
              </div>
            ) : (
              <label style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"8px 14px", background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${dm?"#2E3A55":"#E2E8F0"}`, borderRadius:7, cursor:"pointer", fontSize:12, color:dm?"#94A3B8":"#64748B" }}>
                📎 Seleccionar PDF
                <input type="file" accept=".pdf" style={{ display:"none" }} onChange={handleFile} />
              </label>
            )}
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:6 }}>
            <button onClick={onClose} style={{ fontFamily:"inherit", fontSize:13, fontWeight:600, padding:"9px 18px", borderRadius:7, border:`1px solid ${dm?"#2E3A55":"#CBD5E1"}`, cursor:"pointer", background:"transparent", color:dm?"#94A3B8":"#475569" }}>Cancelar</button>
            <button onClick={subir} disabled={!canSubmit || loading}
              style={{ fontFamily:"inherit", fontSize:13, fontWeight:700, padding:"9px 20px", borderRadius:7, border:"none", cursor:canSubmit?"pointer":"not-allowed", background:empColor, color:"#fff", opacity:canSubmit?1:0.5 }}>
              {loading ? "Subiendo..." : "💰 Subir Nómina"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Gestión de Vacaciones ───────────────────────────────────────────
function GestionVacacionesRRHH({ darkMode, usuario, db, USUARIOS, EMPRESAS, empColor }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtroEmp,   setFiltroEmp]   = useState("todas");
  const [filtroEst,   setFiltroEst]   = useState("todos");
  const [detalle,     setDetalle]     = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "solicitudesRRHH"), snap => {
      setSolicitudes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [db]);

  const dm = darkMode;
  const cardBg = dm ? "#111827" : "#FFFFFF";
  const border  = dm ? "#1E293B" : "#E2E8F0";
  const textPri = dm ? "#E2E8F0" : "#0F172A";
  const muted   = dm ? "#64748B" : "#94A3B8";

  const TIPOS = { vacaciones:"🏖️ Vacaciones", ausencia:"🤒 Ausencia", horasExtras:"⏱️ Horas extras" };
  const ESTADO_COL = { pendiente:"#D4A017", aprobada:"#38A169", rechazada:"#E53E3E" };

  const filtradas = solicitudes
    .filter(s => filtroEmp === "todas" || String(USUARIOS.find(u => u.id === s.usuarioId)?.empresaId) === filtroEmp)
    .filter(s => filtroEst === "todos" || s.estado === filtroEst)
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

  const aprobar = async s => {
    await updateDoc(doc(db, "solicitudesRRHH", s.id), { estado:"aprobada", encargadoId: usuario.id, fechaGestion: new Date().toISOString() });
    setDetalle(null);
  };
  const rechazar = async s => {
    await updateDoc(doc(db, "solicitudesRRHH", s.id), { estado:"rechazada", encargadoId: usuario.id, fechaGestion: new Date().toISOString() });
    setDetalle(null);
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom:22 }}>
        <h2 style={{ margin:"0 0 4px", color:textPri, fontWeight:800, fontSize:20 }}>🏖️ Gestión de Vacaciones</h2>
        <p style={{ margin:0, color:muted, fontSize:13 }}>Solicitudes de vacaciones, ausencias y horas extras</p>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:22 }}>
        {[
          ["⏳ Pendientes", solicitudes.filter(s=>s.estado==="pendiente").length, "#D4A017"],
          ["✅ Aprobadas",  solicitudes.filter(s=>s.estado==="aprobada").length,  "#38A169"],
          ["❌ Rechazadas", solicitudes.filter(s=>s.estado==="rechazada").length, "#E53E3E"],
        ].map(([l,v,c]) => (
          <div key={l} style={{ background:cardBg, border:`1px solid ${border}`, borderRadius:12, padding:"16px 20px" }}>
            <div style={{ fontSize:26, fontWeight:900, color:c, lineHeight:1 }}>{v}</div>
            <div style={{ color:muted, fontSize:12, fontWeight:700, marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:"flex", gap:10, marginBottom:18, flexWrap:"wrap" }}>
        <select value={filtroEmp} onChange={e => setFiltroEmp(e.target.value)}
          style={{ height:34, padding:"0 10px", background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${border}`, borderRadius:8, color:textPri, fontSize:12, fontFamily:"inherit", outline:"none" }}>
          <option value="todas">Todas las empresas</option>
          {EMPRESAS.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={filtroEst} onChange={e => setFiltroEst(e.target.value)}
          style={{ height:34, padding:"0 10px", background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${border}`, borderRadius:8, color:textPri, fontSize:12, fontFamily:"inherit", outline:"none" }}>
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>

      {/* Lista */}
      {filtradas.length === 0 ? (
        <div style={{ textAlign:"center", padding:"70px 20px" }}>
          <p style={{ fontSize:48 }}>📋</p>
          <p style={{ color:muted, fontSize:14, fontWeight:700 }}>Sin solicitudes para este filtro</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtradas.map(s => {
            const usr = USUARIOS.find(u => u.id === s.usuarioId);
            const emp = EMPRESAS.find(e => e.id === usr?.empresaId);
            const col = ESTADO_COL[s.estado] || "#94A3B8";
            return (
              <div key={s.id} onClick={() => setDetalle(s)}
                style={{ background:cardBg, border:`1px solid ${border}`, borderRadius:10, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, cursor:"pointer" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:col+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {s.tipo === "vacaciones" ? "🏖️" : s.tipo === "ausencia" ? "🤒" : "⏱️"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:14, color:textPri }}>{usr?.nombre}</span>
                    {emp && <span style={{ background:emp.color+"18", color:emp.color, borderRadius:4, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{emp.nombre}</span>}
                    <span style={{ color:muted, fontSize:12 }}>{TIPOS[s.tipo]}</span>
                  </div>
                  <span style={{ color:muted, fontSize:12 }}>
                    {s.tipo === "vacaciones" ? `📅 ${s.fechaInicio} → ${s.fechaFin} · ${s.diasSolicitados} días` :
                     s.tipo === "ausencia"    ? `📅 ${s.fecha} · ${s.motivo}` :
                     `📅 ${s.fecha} · ${s.horasExtra}h extra`}
                  </span>
                </div>
                <span style={{ background:col+"22", color:col, border:`1px solid ${col}55`, borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, flexShrink:0 }}>
                  {s.estado === "pendiente" ? "⏳ " : s.estado === "aprobada" ? "✅ " : "❌ "}{s.estado}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal detalle */}
      {detalle && (
        <div style={{ position:"fixed", inset:0, background:"#00000099", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }} onMouseDown={() => setDetalle(null)}>
          <div style={{ background:dm?"#111827":"#FFFFFF", border:`1px solid ${dm?"#2E3A55":"#CBD5E1"}`, borderRadius:14, width:"100%", maxWidth:480, padding:28, boxShadow:"0 24px 80px #0008" }} onMouseDown={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <h3 style={{ margin:0, color:textPri, fontWeight:800 }}>{TIPOS[detalle.tipo]}</h3>
              <button onClick={() => setDetalle(null)} style={{ background:"none", border:"none", color:"#64748B", fontSize:22, cursor:"pointer" }}>×</button>
            </div>
            <p style={{ color:muted, fontSize:13, margin:"0 0 16px" }}>
              {USUARIOS.find(u => u.id === detalle.usuarioId)?.nombre} · {detalle.tipo === "vacaciones" ? `${detalle.fechaInicio} → ${detalle.fechaFin} (${detalle.diasSolicitados} días)` : detalle.tipo === "ausencia" ? `${detalle.fecha} · ${detalle.motivo}` : `${detalle.fecha} · ${detalle.horasExtra}h extra`}
            </p>
            {detalle.descripcion && <p style={{ color:muted, fontSize:13, margin:"0 0 16px" }}>📝 {detalle.descripcion}</p>}
            {detalle.estado === "pendiente" && (
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => aprobar(detalle)} style={{ flex:1, fontFamily:"inherit", fontSize:13, fontWeight:700, padding:11, borderRadius:8, border:"none", cursor:"pointer", background:"#38A169", color:"#fff" }}>✅ Aprobar</button>
                <button onClick={() => rechazar(detalle)} style={{ flex:1, fontFamily:"inherit", fontSize:13, fontWeight:700, padding:11, borderRadius:8, border:"none", cursor:"pointer", background:"#E53E3E", color:"#fff" }}>❌ Rechazar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Gestión de Fichajes ─────────────────────────────────────────────
function GestionFichajesRRHH({ darkMode, usuario, db, USUARIOS, EMPRESAS, empColor }) {
  const [fichajes,   setFichajes]   = useState([]);
  const [periodo,    setPeriodo]    = useState("dia");
  const [filtroEmp,  setFiltroEmp]  = useState("todas");
  const [fechaRef,   setFechaRef]   = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "fichajes"), snap => {
      setFichajes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [db]);

  const dm      = darkMode;
  const border  = dm ? "#1E293B" : "#E2E8F0";
  const textPri = dm ? "#E2E8F0" : "#0F172A";
  const muted   = dm ? "#64748B" : "#94A3B8";
  const cardBg  = dm ? "#111827" : "#FFFFFF";
  const bg      = dm ? "#0D1424" : "#F8FAFC";

  // Calcular rango de fechas según periodo
  const getRango = () => {
    const ref = new Date(fechaRef + "T12:00:00");
    if (periodo === "dia") {
      return { desde: fechaRef, hasta: fechaRef, label: ref.toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"long" }) };
    } else if (periodo === "semana") {
      const dow = ref.getDay();
      const lunes = new Date(ref); lunes.setDate(ref.getDate() - (dow === 0 ? 6 : dow - 1));
      const domingo = new Date(lunes); domingo.setDate(lunes.getDate() + 6);
      return {
        desde: lunes.toISOString().split("T")[0],
        hasta: domingo.toISOString().split("T")[0],
        label: `${lunes.toLocaleDateString("es-ES",{day:"numeric",month:"short"})} — ${domingo.toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"numeric"})}`
      };
    } else if (periodo === "mes") {
      const y = ref.getFullYear(), m = ref.getMonth();
      const desde = `${y}-${String(m+1).padStart(2,"0")}-01`;
      const hasta = new Date(y, m+1, 0).toISOString().split("T")[0];
      return { desde, hasta, label: ref.toLocaleDateString("es-ES",{month:"long",year:"numeric"}) };
    } else {
      const y = ref.getFullYear();
      return { desde:`${y}-01-01`, hasta:`${y}-12-31`, label:`Año ${y}` };
    }
  };

  const rango = getRango();

  const navegar = (dir) => {
    const ref = new Date(fechaRef + "T12:00:00");
    if (periodo === "dia")    ref.setDate(ref.getDate() + dir);
    else if (periodo === "semana") ref.setDate(ref.getDate() + dir*7);
    else if (periodo === "mes")  ref.setMonth(ref.getMonth() + dir);
    else ref.setFullYear(ref.getFullYear() + dir);
    setFechaRef(ref.toISOString().split("T")[0]);
  };

  const calcMins = f => {
    if (!f.salida) return null;
    return Math.max(0, Math.round((new Date(f.salida) - new Date(f.entrada)) / 60000));
  };

  const fmtHoras = mins => {
    if (!mins && mins !== 0) return "—";
    const h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ""}` : `${m}min`;
  };

  const fmtTime = iso => iso ? new Date(iso).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}) : "—";

  // Filtrar fichajes del periodo
  const fichajesPeriodo = fichajes.filter(f => {
    const fecha = f.fecha || f.entrada?.split("T")[0];
    if (!fecha) return false;
    if (fecha < rango.desde || fecha > rango.hasta) return false;
    const usr = USUARIOS.find(u => u.id === f.usuarioId);
    if (filtroEmp !== "todas" && String(usr?.empresaId) !== filtroEmp) return false;
    return true;
  });

  // Empleados activos ahora mismo
  const activosAhora = fichajes.filter(f => !f.salida);

  // Agrupar horas por usuario en el periodo
  const usuariosData = USUARIOS
    .filter(u => !["director","ceo"].includes(u.rol))
    .filter(u => filtroEmp === "todas" || String(u.empresaId) === filtroEmp)
    .map(u => {
      const emp = EMPRESAS.find(e => e.id === u.empresaId);
      const miFichajes = fichajesPeriodo.filter(f => f.usuarioId === u.id);
      const mins = miFichajes.reduce((acc, f) => acc + (calcMins(f) || 0), 0);
      const activoAhora = activosAhora.some(f => f.usuarioId === u.id);
      // Días teóricos en el periodo
      const diasPeriodo = periodo === "dia" ? 1 : periodo === "semana" ? 5 : periodo === "mes" ? 22 : 250;
      const maxMins = diasPeriodo * 8 * 60;
      return { u, emp, mins, activoAhora, miFichajes, maxMins };
    })
    .filter(x => x.miFichajes.length > 0 || x.activoAhora)
    .sort((a, b) => {
      if (a.activoAhora && !b.activoAhora) return -1;
      if (!a.activoAhora && b.activoAhora) return 1;
      return b.mins - a.mins;
    });

  // KPIs globales
  const totalMins  = fichajesPeriodo.reduce((acc, f) => acc + (calcMins(f) || 0), 0);
  const empleadosActivos = USUARIOS.filter(u => !["director","ceo"].includes(u.rol) && (filtroEmp === "todas" || String(u.empresaId) === filtroEmp)).length;
  const diasTrabajados = new Set(fichajesPeriodo.map(f => f.fecha || f.entrada?.split("T")[0])).size;

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Cabecera */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin:"0 0 4px", color:textPri, fontWeight:800, fontSize:20 }}>🕐 Gestión de Fichajes</h2>
        <p style={{ margin:0, color:muted, fontSize:13 }}>Control horario de todos los empleados</p>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
        {[
          { icon:"🟢", label:"Fichados ahora",    v: activosAhora.length,            color:"#38A169" },
          { icon:"👥", label:"Empleados activos",  v: empleadosActivos,               color:"#3182CE" },
          { icon:"⏱️", label:"Horas acumuladas",   v: fmtHoras(totalMins),            color:"#805AD5", str:true },
          { icon:"📅", label:"Días con actividad", v: diasTrabajados,                 color:"#D4A017" },
        ].map((k,i) => (
          <div key={i} style={{ background:cardBg, border:`1px solid ${border}`, borderRadius:12, padding:"16px 18px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:k.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize:k.str?18:26, fontWeight:900, color:k.color, lineHeight:1 }}>{k.v}</div>
              <div style={{ color:muted, fontSize:11, fontWeight:700, marginTop:3 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de periodo */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        {/* Selector periodo */}
        <div style={{ display:"flex", gap:2, background:dm?"#1E293B":"#F1F5F9", borderRadius:8, padding:3, flexShrink:0 }}>
          {[["dia","Día"],["semana","Semana"],["mes","Mes"],["anio","Año"]].map(([v,l]) => (
            <button key={v} onClick={() => setPeriodo(v)}
              style={{ fontFamily:"inherit", fontSize:12, fontWeight:600, padding:"5px 12px", borderRadius:6, border:"none", cursor:"pointer", background:periodo===v?empColor:"transparent", color:periodo===v?"#fff":(dm?"#64748B":"#94A3B8") }}>
              {l}
            </button>
          ))}
        </div>

        {/* Navegación */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => navegar(-1)} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${border}`, background:"transparent", cursor:"pointer", color:textPri, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
          <span style={{ color:textPri, fontSize:13, fontWeight:600, whiteSpace:"nowrap", minWidth:200, textAlign:"center" }}>{rango.label}</span>
          <button onClick={() => navegar(1)} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${border}`, background:"transparent", cursor:"pointer", color:textPri, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
        </div>

        <button onClick={() => setFechaRef(new Date().toISOString().split("T")[0])}
          style={{ height:32, padding:"0 14px", background:empColor+"22", border:`1px solid ${empColor}44`, borderRadius:8, color:empColor, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          Hoy
        </button>

        {/* Filtro empresa */}
        <select value={filtroEmp} onChange={e => setFiltroEmp(e.target.value)}
          style={{ height:32, padding:"0 10px", background:dm?"#1E293B":"#F8FAFC", border:`1px solid ${border}`, borderRadius:8, color:textPri, fontSize:12, fontFamily:"inherit", outline:"none", marginLeft:"auto" }}>
          <option value="todas">Todas las empresas</option>
          {EMPRESAS.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
      </div>

      {/* Layout principal: izquierda tabla + derecha bandeja */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16 }}>

        {/* ── IZQUIERDA: Control por empleado ── */}
        <div style={{ background:cardBg, border:`1px solid ${border}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <p style={{ margin:0, fontWeight:700, color:textPri, fontSize:14 }}>📊 Control de Horas — {rango.label}</p>
              <div style={{ display:"flex", gap:16, marginTop:6 }}>
                {[["#38A169","Horas trabajadas"],["#E53E3E","Sin actividad"]].map(([c,l]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:10, height:10, borderRadius:2, background:c }} />
                    <span style={{ color:muted, fontSize:11 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <span style={{ color:muted, fontSize:12 }}>{usuariosData.length} empleados</span>
          </div>

          {usuariosData.length === 0 ? (
            <div style={{ textAlign:"center", padding:"50px 20px" }}>
              <p style={{ fontSize:40 }}>📭</p>
              <p style={{ color:muted, fontSize:13 }}>Sin actividad en este periodo</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {usuariosData.map(({ u, emp, mins, activoAhora, maxMins }) => {
                const pct = maxMins > 0 ? Math.min(100, (mins / maxMins) * 100) : 0;
                const color = activoAhora ? "#38A169" : pct >= 90 ? "#38A169" : pct >= 50 ? "#D4A017" : "#E53E3E";
                return (
                  <div key={u.id} style={{ display:"grid", gridTemplateColumns:"200px 1fr 80px", gap:12, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${dm?"#0D1424":"#F1F5F9"}` }}>
                    {/* Usuario */}
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ position:"relative", flexShrink:0 }}>
                        <div style={{ width:34, height:34, borderRadius:"50%", background:(emp?.color||"#888")+"33", border:`2px solid ${emp?.color||"#888"}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:emp?.color||"#888", fontSize:11 }}>
                          {u.nombre.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                        {activoAhora && <span style={{ position:"absolute", bottom:0, right:0, width:10, height:10, borderRadius:"50%", background:"#38A169", border:"2px solid "+cardBg }} />}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <p style={{ margin:0, fontSize:12, fontWeight:700, color:textPri, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{u.nombre.split(" ").slice(0,2).join(" ")}</p>
                        <p style={{ margin:0, fontSize:10, color:emp?.color||muted }}>{u.rol} · {emp?.nombre?.split(" ")[0]}</p>
                      </div>
                    </div>

                    {/* Barra */}
                    <div>
                      <div style={{ height:10, background:dm?"#1E293B":"#F1F5F9", borderRadius:99, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:99, transition:"width .4s" }} />
                      </div>
                    </div>

                    {/* Horas */}
                    <div style={{ textAlign:"right" }}>
                      <span style={{ fontSize:13, fontWeight:700, color }}>{fmtHoras(mins)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── DERECHA: Bandeja en tiempo real ── */}
        <div style={{ background:cardBg, border:`1px solid ${border}`, borderRadius:14, padding:"18px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p style={{ margin:0, fontWeight:700, color:textPri, fontSize:14 }}>🟢 Fichados ahora</p>
            <span style={{ background:"#38A16922", color:"#38A169", borderRadius:99, padding:"3px 10px", fontSize:12, fontWeight:700 }}>{activosAhora.length} activos</span>
          </div>

          {activosAhora.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 10px" }}>
              <p style={{ fontSize:36 }}>😴</p>
              <p style={{ color:muted, fontSize:13 }}>Nadie fichado ahora</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {activosAhora
                .filter(f => filtroEmp === "todas" || String(USUARIOS.find(u=>u.id===f.usuarioId)?.empresaId) === filtroEmp)
                .map(f => {
                  const usr = USUARIOS.find(u => u.id === f.usuarioId);
                  const emp = EMPRESAS.find(e => e.id === usr?.empresaId);
                  const minsDesdeFichaje = Math.round((new Date() - new Date(f.entrada)) / 60000);
                  return (
                    <div key={f.id} style={{ background:bg, border:`1px solid ${"#38A169"}33`, borderRadius:10, padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <div style={{ position:"relative" }}>
                          <div style={{ width:36, height:36, borderRadius:"50%", background:(emp?.color||"#888")+"33", border:`2px solid ${emp?.color||"#888"}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:emp?.color||"#888", fontSize:12, flexShrink:0 }}>
                            {usr?.nombre?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()||"?"}
                          </div>
                          <span style={{ position:"absolute", bottom:0, right:0, width:10, height:10, borderRadius:"50%", background:"#38A169", border:"2px solid "+cardBg }} />
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ margin:0, fontWeight:700, fontSize:13, color:textPri, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{usr?.nombre}</p>
                          {emp && <span style={{ fontSize:10, color:emp.color, fontWeight:600 }}>{emp.nombre}</span>}
                        </div>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ color:muted, fontSize:11 }}>↑ Entró a las {fmtTime(f.entrada)}</span>
                        <span style={{ background:"#38A16922", color:"#38A169", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700 }}>
                          {fmtHoras(minsDesdeFichaje)}
                        </span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )}

          {/* Sin fichar hoy */}
          {periodo === "dia" && (() => {
            const idsActivos = new Set(activosAhora.map(f => f.usuarioId));
            const idsConFichaje = new Set(fichajesPeriodo.map(f => f.usuarioId));
            const sinFichar = USUARIOS
              .filter(u => !["director","ceo"].includes(u.rol))
              .filter(u => filtroEmp === "todas" || String(u.empresaId) === filtroEmp)
              .filter(u => !idsConFichaje.has(u.id));
            if (!sinFichar.length) return null;
            return (
              <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${border}` }}>
                <p style={{ margin:"0 0 10px", color:"#E53E3E", fontSize:11, fontWeight:700 }}>😴 Sin fichar hoy ({sinFichar.length})</p>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {sinFichar.map(u => {
                    const emp = EMPRESAS.find(e => e.id === u.empresaId);
                    return (
                      <div key={u.id} style={{ display:"flex", alignItems:"center", gap:8, opacity:.6 }}>
                        <div style={{ width:26, height:26, borderRadius:"50%", background:(emp?.color||"#888")+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:muted, flexShrink:0 }}>
                          {u.nombre.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
                        </div>
                        <div style={{ minWidth:0 }}>
                          <p style={{ margin:0, fontSize:11, color:muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{u.nombre.split(" ").slice(0,2).join(" ")}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
