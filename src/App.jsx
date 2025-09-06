import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ParticlesCanvas from './components/ParticlesCanvas.jsx';
import NavBar from './components/NavBar.jsx';
import Polaroid from './components/Polaroid.jsx';
import BurstButton from './components/BurstButton.jsx';

/* ========= Config ========= */
const FECHA_EVENTO_ISO = '2025-11-15T17:00:00-06:00'; // 5:00 PM (America/Mexico_City)
const HERO_BG =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&auto=format&fit=crop';

const fechaStr = '2nd May, 2026 · 4:00 PM';
const ceremonia = 'Ceremony'
const lugarStr = 'Église orthodoxe d´Antioche de la Vierge Marie';
const comida = 'Dinner'
const lugarCena = 'Le Mitoyen'

const fotos = [
  { src: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1600&auto=format&fit=crop', caption: 'Primera cita', rotate: -4 },
  { src: 'https://images.unsplash.com/photo-1521334726092-b509a19597c6?w=1600&auto=format&fit=crop', caption: 'Viaje favorito', rotate: 3 },
  { src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop', caption: 'Nuestra canción', rotate: -2 },
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
  const year = useMemo(() => new Date().getFullYear(), []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const toMaps = () => scrollTo('mapa');

  return (
    <div className="min-h-screen text-center">
      <ParticlesCanvas />
      <NavBar onRSVPClick={() => scrollTo('rsvp')} onMapClick={toMaps} />

      {/* HERO con imagen de fondo + overlay beige/dorado */}
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
        {/* Overlays para legibilidad y look dorado */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0E8D9]/70 via-[#F7F3EC]/40 to-[#F7F3EC]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EAD068]/10 to-transparent" />

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

          {/* Acciones + contador */}
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
              <h3 className="mb-2 font-semibold">Recepción</h3>
              <p className="text-sm text-stone-600">7:00 PM · Salón principal</p>
            </div>
            <div className="card">
              <h3 className="mb-2 font-semibold">Código de vestimenta</h3>
              <p className="text-sm text-stone-600">Formal · Paleta beige y dorado.</p>
            </div>
          </div>

          <div id="mapa" className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-white/60 shadow-sm">
            <iframe
              title="Mapa"
              src="https://www.google.com/maps?q=Hacienda%20Las%20Palmas%20Morelos&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
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
              <label className="text-sm text-stone-600">Mensaje</label>
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
    </div>
  );
}
