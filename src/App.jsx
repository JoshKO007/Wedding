import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ParticlesCanvas from './components/ParticlesCanvas.jsx';
import NavBar from './components/NavBar.jsx';
import Polaroid from './components/Polaroid.jsx';
import BurstButton from './components/BurstButton.jsx';

/* ========= Config ========= */
const FECHA_EVENTO_ISO = '2026-05-02T16:00:00-06:00'; // ⬅️ FECHA ACTUALIZADA
const HERO_BG =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&auto=format&fit=crop';

const fechaStr = '2nd May, 2026 · 4:00 PM';
const lugarStr = 'Église orthodoxe d´Antioche de la Vierge Marie';

const fotos = [
  { src: '/img/img1.jpeg', caption: 'Primera cita', rotate: -4 },
  { src: '/img/img2.jpeg', caption: 'Viaje favorito', rotate: 3 },
  { src: '/img/img3.jpeg', caption: 'Nuestra canción', rotate: -2 },
  { src: '/img/img4.jpeg', caption: 'Nuestra canción', rotate: 4 },
  { src: '/img/img5.jpeg', caption: 'Nuestra canción', rotate: -3 },
  { src: '/img/img6.jpeg', caption: 'Nuestra canción', rotate: 2 },
];


/* ========= Countdown inline component ========= */
function useCountdown(targetISO) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(targetISO).getTime() - now);
  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return { days, hours, mins, secs, done: diff === 0 };
}

function Countdown() {
  const { days, hours, mins, secs } = useCountdown(FECHA_EVENTO_ISO);
  const Item = ({ label, value }) => (
    <div className="flex flex-col items-center rounded-2xl border border-white/60 bg-white/70 px-4 py-3 backdrop-blur">
      <span className="font-display text-3xl text-stone-800 tabular-nums">{String(value).padStart(2, '0')}</span>
      <span className="text-xs text-stone-600">{label}</span>
    </div>
  );
  return (
    <div className="mx-auto mt-6 flex items-center justify-center gap-3">
      <Item label="Días" value={days} />
      <Item label="Hrs" value={hours} />
      <Item label="Min" value={mins} />
      <Item label="Seg" value={secs} />
    </div>
  );
}

/* ========= App ========= */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const passcode = "1234"; // ⬅️ Cambia esto por tu código de 4 dígitos

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const enteredPasscode = form.passcode.value;
    if (enteredPasscode === passcode) {
      setIsAuthenticated(true);
    } else {
      alert("Código incorrecto. Intenta de nuevo.");
    }
  };
  
  const year = useMemo(() => new Date().getFullYear(), []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const toMaps = () => scrollTo('mapa');


/* =========================
   ENLACES Y HELPER (sin Waze)
   ========================= */

// — Enlaces EXACTOS que ya tienes + coords para deep links (fallback a app)
const CEREMONIA = {
  label: `Église orthodoxe d'Antioche de la Vierge Marie`,
  lat: 45.552677,
  lng: -73.673486,
  apple: 'https://maps.apple.com/place?map=explore&address=10840+Rue+Laverdure%2C+Montreal+QC+H3L+2L9%2C+Canada&coordinate=45.552677%2C-73.673486&name=10840+Rue+Laverdure',
  gmaps: 'https://maps.app.goo.gl/qVWMaJcZeCUaYS8MA?g_st=ipc',
};

const CENA = {
  label: 'Le Mitoyen',
  lat: 45.528607,
  lng: -73.820470,
  apple: 'https://maps.apple.com/place?address=652%20Place%20Publique,%20Laval%20QC%20H7X%201G1,%20Canada&coordinate=45.528607,-73.820470&name=Le%20Mitoyen&place-id=I72AA040D42BCA13&map=explore',
  gmaps: 'https://maps.app.goo.gl/6iSqGKNEW4pNE5LDA?g_st=ipc',
};

// — Abre la app correspondiente: iOS → Apple Maps, Android → Google Maps,
//   Desktop → Google Maps (web). Sin Waze.
const openMapsPreferred = ({ label, lat, lng, apple, gmaps }) => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid =
    /android/i.test(ua) ||
    (navigator.userAgentData && navigator.userAgentData.platform === 'Android');
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const openByAnchor = (url, targetSelf = true) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = targetSelf ? '_self' : '_blank';
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Desktop → Google Maps web
  if (!isAndroid && !isIOS) {
    openByAnchor(gmaps, false);
    return;
  }

  // Detectar si una app se abrió (el navegador pasa a 2º plano)
  let appOpened = false;
  const onVis = () => { if (document.hidden) appOpened = true; };
  document.addEventListener('visibilitychange', onVis, { once: true });

  const encodedName = encodeURIComponent(label || '');

  if (isIOS) {
    // 1) Universal link de Apple Maps (suele abrir la app)
    openByAnchor(apple, true);

    // 2) Fallback a deep link de Apple Maps (app) si no abrió
    setTimeout(() => {
      if (appOpened) return;
      const appleDeep = (lat && lng)
        ? `maps://?daddr=${lat},${lng}&q=${encodedName}`
        : `maps://?q=${encodedName}`;
      openByAnchor(appleDeep, true);
    }, 900);
  } else {
    // ANDROID
    // 1) Universal link de Google Maps (suele abrir la app)
    openByAnchor(gmaps, true);

    // 2) Fallback a deep link de Android (app de mapas por defecto)
    setTimeout(() => {
      if (appOpened) return;
      const geoDeep = (lat && lng)
        ? `geo:${lat},${lng}?q=${lat},${lng}(${encodedName})`
        : `geo:0,0?q=${encodedName}`;
      openByAnchor(geoDeep, true);
    }, 900);
  }
};



  return (
    <div className="min-h-screen text-center">
      {!isAuthenticated ? (
        // Pantalla de login con corazones
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F3EC]">
          {Array.from({ length: 15 }).map((_, i) => (
            <svg
              key={i}
              className="absolute animate-floatUp"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 5}s`,
                width: `${20 + Math.random() * 15}px`,
                height: `${20 + Math.random() * 15}px`,
                bottom: '-40px',
                fill: `rgba(255, 105, 180, ${0.5 + Math.random() * 0.3})`,
                filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))',
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ))}

          <div className="relative z-10 flex flex-col items-center">
            <h1 className="mb-20 font-display text-5xl font-extrabold text-[#8b0000] drop-shadow-md">
              Angeline & Manuel Wedding
            </h1>
            <div className="relative flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform-gpu"
                   style={{ width: '3.5rem', height: '1.5rem', backgroundColor: '#DCDCDC', borderRadius: '0.25rem',
                   boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.5)' }} />
              <h2 className="font-display text-2xl text-stone-800">Ingresa el código</h2>
              <form onSubmit={handlePasscodeSubmit} className="flex flex-col items-center gap-4">
                <input type="password" name="passcode" maxLength="4" required autoFocus
                  className="w-32 rounded-xl border border-stone-200 bg-white/80 px-4 py-2 text-center text-lg tracking-[0.5em] outline-none transition focus:ring-2 focus:ring-[#EAD068]" />
                <button type="submit" className="btn-primary">Entrar</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ParticlesCanvas />
          <NavBar onRSVPClick={() => scrollTo('rsvp')} onMapClick={toMaps} />
          
          {/* HERO limpio sin overlays */}
          <section
            id="inicio"
            className="relative flex min-h-[100svh] items-center justify-center"
            style={{
              backgroundImage: `url(${HERO_BG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="relative z-10 mx-auto mt-20 flex max-w-4xl flex-col items-center px-6">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto font-display text-5xl leading-tight text-stone-900 drop-shadow sm:text-6xl"
              >
                Angeline <span className="text-[#C9A227]">&</span> Manuel
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mt-3 text-lg text-stone-800"
              >
                {fechaStr}
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-stone-700"
              >
                {lugarStr}
              </motion.p>

              <div className="mx-auto mt-6 flex w-full flex-wrap items-center justify-center gap-3">
                <BurstButton className="btn-primary" onClick={() => scrollTo('rsvp')}>
                  Confirmar asistencia
                </BurstButton>
                <BurstButton className="btn-ghost" onClick={toMaps}>
                  Ver ubicación
                </BurstButton>
              </div>

              <Countdown />
            </div>
          </section>

          {/* Historia */}
          <section id="historia" className="scroll-mt-24 bg-white/70 py-16 backdrop-blur">
            <div className="mx-auto max-w-6xl px-6">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="font-display text-3xl text-stone-800"
              >
                Nuestra historia
              </motion.h2>

              {/* Grid centrada */}
              <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                {fotos.map((f, i) => (
                  <Polaroid key={i} src={f.src} caption={f.caption} rotate={f.rotate} />
                ))}
              </div>
            </div>
          </section>

          {/* Detalles + Mapa embebido */}
<section id="detalles" className="scroll-mt-24 bg-gradient-to-b from-white to-[#F7F3EC] py-16">
  <div className="mx-auto max-w-6xl px-6">
    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="font-display text-3xl text-stone-800"
    >
      Detalles del evento
    </motion.h2>

    <div className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
      <div className="card">
        <h3 className="mb-2 font-semibold">Ceremonia</h3>
        <p className="text-sm text-stone-600">5:00 PM · Jardines principales</p>
      </div>
      <div className="card">
        <h3 className="mb-2 font-semibold">Cena</h3>
        <p className="text-sm text-stone-600">6:00 PM · Terraza del lago</p>
      </div>
      <div className="card">
        <h3 className="mb-2 font-semibold">Recepción</h3>
        <p className="text-sm text-stone-600">8:00 PM · Salón principal</p>
      </div>
    </div>

{/* Mapas de ubicaciones (horizontal) */}
<div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">

  {/* Recepción */}
  <div className="flex flex-col items-center overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
    <h4 className="mb-2 font-semibold text-stone-700">Ubicación - Ceremonia</h4>
    <iframe
      title="Ceremonia"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2793.893992708403!2d-73.6729771!3d45.552458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc918a256538a45%3A0xf7df27a273c10ef!2sEglise%20Orthodoxe%20d&#39;Antioche!5e0!3m2!1ses-419!2smx!4v1757627676200!5m2!1ses-419!2smx"
      width="100%"
      height="280"
      style={{ border: 0, maxWidth: '500px' }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>

    {/* Texto debajo del mapa */}
    <p className="mt-3 text-sm text-stone-700">Eglise Orthodoxe d'Antioche</p>

<button
  onClick={() => openLocationStrict(CEREMONIA_LINKS)}
  className="btn-primary mt-3 inline-flex items-center gap-2"
  aria-label="Guardar ubicación de la ceremonia"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 2h12a1 1 0 0 1 1 1v18.382a1 1 0 0 1-1.555.832L12 18.764l-5.445 3.45A1 1 0 0 1 5 21.382V3a1 1 0 0 1 1-1z"/>
  </svg>
  Guardar ubicación
</button>


  </div>
    {/* Comida */}
  <div className="flex flex-col items-center overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
    <h4 className="mb-2 font-semibold text-stone-700">Ubicación - Cena</h4>
    <iframe
      title="Mapa Comida"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.0797094393924!2d-73.82043139999999!3d45.52860149999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc924bc8852494f%3A0x8f7d71a469fb7e9a!2sLe%20Mitoyen!5e0!3m2!1ses-419!2smx!4v1757629190375!5m2!1ses-419!2smx"
      width="100%"
      height="280"
      style={{ border: 0, maxWidth: '500px' }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>

    {/* Texto debajo del mapa */}
    <p className="mt-3 text-sm text-stone-700">Le Mitoyen</p>

{/* Botón Guardar ubicación */}
<button
  onClick={() => openLocationStrict(CENA_LINKS)}
  className="btn-primary mt-3 inline-flex items-center gap-2"
  aria-label="Guardar ubicación de la cena"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 2h12a1 1 0 0 1 1 1v18.382a1 1 0 0 1-1.555.832L12 18.764l-5.445 3.45A1 1 0 0 1 5 21.382V3a1 1 0 0 1 1-1z"/>
  </svg>
  Guardar ubicación
</button>


</div>
</div>


        </div>
      </section>


          {/* Galería (mismo ancho, alto recortado) */}
          <section id="galeria" className="scroll-mt-24 bg-white/70 py-16 backdrop-blur">
            <div className="mx-auto max-w-6xl px-6">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="font-display text-3xl text-stone-800"
              >
                Galería
              </motion.h2>

              <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Polaroid
                    key={i}
                    src={`https://source.unsplash.com/collection/190727/2000x3000?sig=${i}`}
                    caption="Momentos"
                    rotate={i % 2 === 0 ? -2.5 : 2.5}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* RSVP (incluye alergias) */}
          <section id="rsvp" className="scroll-mt-24 bg-gradient-to-t from-white to-[#F7F3EC] py-16">
            <div className="mx-auto max-w-3xl px-6">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="font-display text-3xl text-stone-800"
              >
                Confirma tu asistencia
              </motion.h2>

              <motion.form
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const body = encodeURIComponent(
                    `Nombre: ${data.get('nombre')}
Invitados: ${data.get('invitados')}
Alergias: ${data.get('alergias')}
Mensaje: ${data.get('mensaje')}`
                  );
                  window.location.href = `mailto:angeline.y.manuel@example.com?subject=RSVP&body=${body}`;
                }}
                className="mx-auto mt-6 grid max-w-xl gap-4 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <div className="grid gap-2 text-left">
                  <label className="text-sm text-stone-600">Nombre completo</label>
                  <input
                    name="nombre"
                    required
                    placeholder="Tu nombre"
                    className="rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#EAD068]"
                  />
                </div>
                <div className="grid gap-2 text-left">
                  <label className="text-sm text-stone-600">Número de invitados (incluyéndote)</label>
                  <input
                    name="invitados"
                    type="number"
                    min="1"
                    max="10"
                    defaultValue="1"
                    className="rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#EAD068]"
                  />
                </div>
                <div className="grid gap-2 text-left">
                  <label className="text-sm text-stone-600">Alergias o restricciones alimentarias</label>
                  <input
                    name="alergias"
                    placeholder="Ej. nueces, mariscos, gluten..."
                    className="rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#EAD068]"
                  />
                </div>
                <div className="grid gap-2 text-left">
                  <label className="text-sm text-stone-600">Mensaje para los novios</label>
                  <textarea
                    name="mensaje"
                    rows="3"
                    placeholder="¿Alguna nota especial?"
                    className="rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#EAD068]"
                  />
                </div>
                <div className="mx-auto flex items-center gap-3">
                  <BurstButton type="submit" className="btn-primary">
                    Enviar RSVP
                  </BurstButton>
                  <BurstButton
                    className="btn-ghost"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Subir ↑
                  </BurstButton>
                </div>
                <p className="text-xs text-stone-500">* El formulario abre tu correo para enviar la confirmación.</p>
              </motion.form>
            </div>
          </section>

          <footer className="border-t border-white/60 bg-white/70">
            <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-stone-600">
              Con cariño, Angeline & Manuel · {year}
            </div>
          </footer>
        </>
      )}
    </div>
  );
}