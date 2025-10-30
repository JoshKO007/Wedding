import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ParticlesCanvas from './components/ParticlesCanvas.jsx';

import emailjs from '@emailjs/browser';
import NavBar from './components/NavBar.jsx';

import BurstButton from './components/BurstButton.jsx';
import Polaroid from './components/Polaroid.jsx';

/* ========= Config ========= */
// ==== EmailJS Config ====
// ==== EmailJS Config ====
const EMAILJS_SERVICE_ID = 'service_px60k0r';
const EMAILJS_TEMPLATE_GUEST = 'template_70yvme4';
const EMAILJS_TEMPLATE_HOST  = 'template_k795krt';
const EMAILJS_PUBLIC_KEY = 'fyc1WTHZg6oSTrUjv';
const FECHA_EVENTO_ISO = '2026-05-02T16:00:00-06:00'; // ⬅️ UPDATED DATE
const HERO_BG =
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=2000&auto=format&fit=crop';
const HERO_VIDEO = '/video/hero.mp4'; // ⬅️ place your MP4 at /public/video/hero.mp4

const fechaStr = '2nd May, 2026 · 4:00 PM';
const lugarStr = 'Église orthodoxe d´Antioche de la Vierge Marie';
// Photos for "Our story"
const fotos = [
  { src: '/img/img1.jpeg', caption: 'First date', rotate: -4 },
  { src: '/img/img2.jpeg', caption: 'Favorite trip', rotate: 3 },
  { src: '/img/img3.jpeg', caption: 'Our song', rotate: -2 },
  { src: '/img/img4.jpeg', caption: 'Unique moments', rotate: 4 },
  { src: '/img/img5.jpeg', caption: 'Always together', rotate: -3 },
  { src: '/img/img6.jpeg', caption: 'The best adventure', rotate: 2 },
];



/* ========= Countdown (inline component) ========= */
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
      <Item label="Days" value={days} />
      <Item label="Hrs" value={hours} />
      <Item label="Min" value={mins} />
      <Item label="Sec" value={secs} />
    </div>
  );
}

/* ========= Hearts background particles ========= */
function HeartsCanvas() {
  const canvasRef = useState(null)[0] ?? { current: null };
  const setCanvasRef = (el) => (canvasRef.current = el);
  const particlesRef = useState([])[0] ?? [];
  const rafRef = useState(null)[0] ?? { current: null };

  // Helpers
  const rand = (a, b) => a + Math.random() * (b - a);

  const drawHeart = (ctx, x, y, size, color, alpha) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    // Heart path (normalized around 0,0)
    ctx.moveTo(0, -0.35);
    ctx.bezierCurveTo(0.35, -0.7, 0.95, -0.2, 0, 0.55);
    ctx.bezierCurveTo(-0.95, -0.2, -0.35, -0.7, 0, -0.35);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    };
    resize();

    const colors = ['#F4A7B9', '#E284A3', '#FFC7D1', '#EAD068']; // rosas suaves + dorado

    const COUNT = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    particlesRef.length = 0;
    for (let i = 0; i < COUNT; i++) {
      particlesRef.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        base: rand(6, 14) * dpr * 0.6,
        phase: rand(0, Math.PI * 2),
        speedY: rand(0.1, 0.4) * dpr, // float upward
        driftX: rand(-0.15, 0.15) * dpr,
        alpha: rand(0.35, 0.7),
        color: colors[Math.floor(rand(0, colors.length))],
      });
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef) {
        // Pulse (grow/shrink)
        p.phase += 0.02 + Math.random() * 0.01;
        const size = p.base * (1 + 0.25 * Math.sin(p.phase));

        // Smooth motion
        p.y -= p.speedY;
        p.x += p.driftX + Math.sin(p.phase * 0.5) * 0.1 * dpr;

        // Wrap
        if (p.y < -20 * dpr) {
          p.y = canvas.height + 20 * dpr;
          p.x = rand(0, canvas.width);
        }
        if (p.x < -20 * dpr) p.x = canvas.width + 20 * dpr;
        if (p.x > canvas.width + 20 * dpr) p.x = -20 * dpr;

        drawHeart(ctx, p.x, p.y, size / 40, p.color, p.alpha);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={setCanvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
      aria-hidden
    />
  );
}

/* ========= App ========= */
export default function App() {

  useEffect(() => {
    try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (e) {}
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const toMaps = () => scrollTo('detalles');

  // === Toast helper ===
  const showToast = (text = 'Thanks! Your RSVP was sent.') => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    document.body.appendChild(el);
    // trigger enter
    requestAnimationFrame(() => el.classList.add('in'));
    // auto remove
    setTimeout(() => {
      el.classList.remove('in');
      setTimeout(() => el.remove(), 300);
    }, 2200);
  };


/* =========================
   LINKS & HELPERS (links only)
   ========================= */

// Ceremony
const CEREMONIA_LINKS = {
  apple: 'https://maps.apple.com/?q=120%20Boul.%20Gouin%20E,%20Montr%C3%A9al,%20QC%20H3L%201A6',
  gmaps: 'https://www.google.com/maps/search/?api=1&query=120%20Boul.%20Gouin%20E,%20Montr%C3%A9al,%20QC%20H3L%201A6',
  waze: 'https://waze.com/ul?q=120%20Boul.%20Gouin%20E,%20Montr%C3%A9al,%20QC%20H3L%201A6&navigate=yes'
};

// Dinner (Le Mitoyen)
const CENA_LINKS = {
  apple: 'https://maps.apple.com/?q=480%20Blvd.%20Saint-Martin%20O,%20Laval,%20QC%20H7M%203Y2',
  gmaps: 'https://www.google.com/maps/search/?api=1&query=480%20Blvd.%20Saint-Martin%20O,%20Laval,%20QC%20H7M%203Y2',
  waze: 'https://waze.com/ul?q=480%20Blvd.%20Saint-Martin%20O,%20Laval,%20QC%20H7M%203Y2&navigate=yes'
};

// Open only the provided links: iOS → Apple Maps, Android → Google Maps, Desktop → Google Maps (new tab)
const openMapsLinksOnly = ({ apple, gmaps }) => {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid = /android/i.test(ua);
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS

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

  if (isIOS) {
    openByAnchor(apple, true);
  } else if (isAndroid) {
    openByAnchor(gmaps, true);
  } else {
    openByAnchor(gmaps, false);
  }
};

// Helper to open Waze directly (better mobile experience)
const openWaze = (wazeUrl) => {
  const a = document.createElement('a');
  a.href = wazeUrl;
  a.target = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? '_self' : '_blank';
  a.rel = 'noopener noreferrer';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
};

  return (
    <div className="min-h-screen text-center">
        <style>{`
          /* Liquid shimmer border for CTA buttons */
          .btn-shimmer{ position:relative; }
          .btn-shimmer::after{
            content:''; position:absolute; inset:-2px; border-radius: 9999px;
            padding:2px; background: conic-gradient(from 0deg, #FF4F86, #EAD068, #FF4F86);
            -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            -webkit-mask-composite: xor; mask-composite: exclude;
            animation: spin 4s linear infinite; pointer-events:none; opacity:.9;
          }
          @keyframes spin{ to{ transform: rotate(1turn); } }
        `}</style>
      <>
        <HeartsCanvas />
        <ParticlesCanvas />
        <div id="nav-anim" className="relative">
          <NavBar onRSVPClick={() => scrollTo('rsvp')} onMapClick={toMaps} />
          <style>{`
            /* Animations for header links/buttons */
            #nav-anim nav a, #nav-anim nav button {
              position: relative;
              transition: transform .2s ease, box-shadow .2s ease, background-color .2s ease;
              will-change: transform;
            }
            #nav-anim nav a:hover, #nav-anim nav button:hover {
              transform: translateY(-2px) scale(1.04);
              box-shadow: 0 12px 24px rgba(0,0,0,.15);
            }
            /* Animated underline (polaroid vibe, pink→gold gradient) */
            #nav-anim nav a::after, #nav-anim nav button::after {
              content: '';
              position: absolute;
              left: 12px;
              right: 12px;
              bottom: 6px;
              height: 2px;
              background: linear-gradient(90deg, #FF4F86, #EAD068);
              transform: scaleX(0);
              transform-origin: center;
              transition: transform .25s ease;
              border-radius: 1px;
              opacity: .95;
              pointer-events: none;
            }
            #nav-anim nav a:hover::after, #nav-anim nav button:hover::after {
              transform: scaleX(1);
            }
            /* Soft click feedback */
            #nav-anim nav a:active, #nav-anim nav button:active {
              transform: translateY(-1px) scale(0.98);
              box-shadow: 0 8px 16px rgba(0,0,0,.12);
            }
          `}</style>
        </div>
        
        {/* HERO limpio sin overlays */}
        <section
          id="inicio"
          className="relative flex min-h-[100svh] items-center justify-center"
          style={{ backgroundColor: '#111' }}
        >
          {/* Floral corner overlays */}
          <svg className="hero-flora pointer-events-none absolute left-0 top-0 h-40 w-40 opacity-10" viewBox="0 0 100 100" aria-hidden>
            <path d="M5,55 C25,25 45,25 65,5" fill="none" stroke="#EAD068" strokeWidth="2"/>
            <circle cx="20" cy="60" r="6" fill="#FFB6C1"/>
            <circle cx="36" cy="44" r="4" fill="#FF7AAE"/>
          </svg>
          <svg className="hero-flora pointer-events-none absolute bottom-0 right-0 h-40 w-40 opacity-10" viewBox="0 0 100 100" aria-hidden>
            <path d="M95,45 C75,75 55,75 35,95" fill="none" stroke="#EAD068" strokeWidth="2"/>
            <circle cx="80" cy="40" r="6" fill="#FFB6C1"/>
            <circle cx="64" cy="56" r="4" fill="#FF7AAE"/>
          </svg>
          {/* Background video */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO_VIDEO}
            poster={HERO_BG}
            muted
            autoPlay
            playsInline
            loop
            preload="auto"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
          <div className="relative z-10 mx-auto mt-20 flex max-w-4xl flex-col items-center px-6">
            <style>{`
  /* Tagline under the countdown */
  .hero-tagline{ 
    position: relative; display:inline-block; 
    font-weight:500; letter-spacing:.03em; 
    text-shadow: 0 1px 2px rgba(0,0,0,.35);
  }
  .hero-tagline::after{
    content:''; position:absolute; left:0; right:0; bottom:-6px; height:2px;
    background: linear-gradient(90deg, #FF4F86, #EAD068);
    transform: scaleX(0); transform-origin: center;
    border-radius: 2px;
    animation: heroUnderline .8s ease .35s both;
  }
  @keyframes heroUnderline { from { transform: scaleX(0);} to { transform: scaleX(1);} }
  /* Breathing animation for couple name */
  .hero-title {
    display: inline-block;
    animation: breathe 4.5s ease-in-out infinite;
    transform-origin: center;
  }
  @keyframes breathe {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`}</style>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="hero-title mx-auto font-display text-5xl leading-tight text-white drop-shadow-lg sm:text-6xl"
            >
              Angeline <span className="text-[#C9A227]">&</span> Manuel
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-3 text-lg text-white/90"
            >
              {fechaStr}
            </motion.p>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-white/80"
            >
              {lugarStr}
            </motion.p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <BurstButton className="btn-primary btn-anim " onClick={() => scrollTo('rsvp')}>
                Attendance Confirmation
              </BurstButton>
              <BurstButton className="btn-ghost btn-anim " onClick={toMaps}>
                The Celebration
              </BurstButton>
            </div>

            <Countdown />
            <motion.p
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="hero-tagline mt-3 font-display text-lg sm:text-xl text-white/90"
            >
              For the big day!
            </motion.p>
          </div>
        </section>

        {/* Historia */}
        <section id="historia" className="scroll-mt-24 bg-white/10 py-16 supports-[backdrop-filter]:backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6">
            <style>{`
              .polaroid-wrap{ position:relative; }
              .polaroid-wrap::before{
                content:''; position:absolute; left:50%; top:-10px; width:16px; height:16px; border-radius:50%;
                transform:translateX(-50%);
                background: radial-gradient(circle at 35% 35%, #fff 0%, #FF7AAE 60%, #C81E5D 100%);
                box-shadow: 0 2px 6px rgba(0,0,0,.25);
                z-index:10;
              }
              .polaroid-wrap:hover{ filter: saturate(1.05); }
            `}</style>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-3xl text-stone-800"
            >
              Our story
            </motion.h2>

            {/* Grid centrada */}
            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3">
              {fotos.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ rotate: f.rotate, y: 0, scale: 1 }}
                  whileHover={{ rotate: f.rotate * 0.2, y: -10, scale: 1.04, boxShadow: '0 18px 36px rgba(0,0,0,0.25)' }}
                  whileTap={{ scale: 0.98, y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  className="polaroid-wrap origin-top cursor-pointer will-change-transform"
                >
                  <Polaroid src={f.src} caption={f.caption} rotate={0} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Details + Embedded Map */}
<section id="detalles" className="scroll-mt-24 bg-gradient-to-b from-white/10 to-[#F7F3EC]/10 py-16 supports-[backdrop-filter]:backdrop-blur-sm">
  <div className="mx-auto max-w-6xl px-6">
    <style>{`
      /* ==== Animated buttons (Maps/Waze) ==== */
      .btn-anim {
        position: relative;
        transition: transform .2s ease, box-shadow .2s ease, background-color .2s ease, border-color .2s ease;
        will-change: transform;
        overflow: hidden;
      }
      .btn-anim:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 24px rgba(0,0,0,.12); }
      .btn-anim:active { transform: translateY(0); box-shadow: 0 8px 16px rgba(0,0,0,.10); }
      .btn-anim:focus { outline: none; box-shadow: 0 0 0 3px rgba(234,208,104,.35); }
      .btn-anim::before {
        content: '';
        position: absolute; inset: 0 -40%;
        background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.35) 40%, transparent 80%);
        transform: translateX(-120%);
      }
      .btn-anim:hover::before { transform: translateX(120%); transition: transform .6s ease; }

      /* ==== Place name style ==== */
      .place-name { display:inline-flex; align-items:center; gap:.5rem; }
      .place-name__text {
        font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
        font-weight: 600; letter-spacing: .02em; color: #1f2937; /* stone-800 */
        position: relative; padding-bottom: .15rem;
      }
      .place-name__text::after {
        content: '';
        position: absolute; left: 0; right: 0; bottom: -2px; height: 3px;
        background: linear-gradient(90deg, #FF4F86, #EAD068);
        border-radius: 2px; opacity: .9;
      }
      .place-pin {
        width: 18px; height: 18px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fff, #FF4F86 60%, #C81E5D 100%);
        box-shadow: 0 2px 6px rgba(0,0,0,.2);
      }
      /* ==== Emphasized time badge ==== */
      .event-time {
        display: inline-flex; align-items: center; gap: .4rem;
        font-weight: 700; letter-spacing: .02em; font-variant-numeric: tabular-nums;
        color: #1f2937; /* stone-800 */
        background: rgba(234,208,104,.15);
        border: 1px solid rgba(234,208,104,.45);
        padding: .25rem .6rem; border-radius: .65rem;
      }

      /* ==== Event details spacing & hover motion ==== */
      .event-card p { line-height: 1.55; margin: .15rem 0; }
      .event-card p + p { margin-top: .35rem; }

      /* Make the time a bit smaller and add hover animation */
      .event-time {
        font-size: .95rem; /* smaller than body */
        transition: transform .18s ease, box-shadow .25s ease, background-color .25s ease, border-color .25s ease;
      }
      .event-time:hover, .event-time:focus-visible {
        transform: translateY(-1px) scale(1.04);
        background: rgba(234,208,104,.22);
        border-color: rgba(234,208,104,.65);
        box-shadow: 0 8px 16px rgba(234,208,104,.22);
        outline: none;
      }
    `}</style>
    <motion.h2
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="font-display text-3xl text-stone-800"
    >
      Event details
    </motion.h2>

    <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 place-items-center gap-6 md:grid-cols-2">
      <div className="card text-center event-card">
        <h3 className="mb-2 font-semibold">Weedding Ceremony</h3>
        <p className="text-sm text-stone-700">Eglise Orthodox d'Antioche</p>
        <p className="event-time" tabIndex="0">15:30 h</p>
      </div>

      <div className="card text-center event-card">
        <h3 className="mb-2 font-semibold">Weedding Party</h3>
        <p className="text-sm text-stone-700">Salle de réception La Sirène</p>
        <p className="event-time" tabIndex="0">18:00 h</p>
      </div>
    </div>

{/* Location maps (side by side) */}
<div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">

  {/* Reception */}
  <div className="flex flex-col items-center overflow-hidden rounded-2xl border border-white/50 bg-white/50 p-4 shadow-sm supports-[backdrop-filter]:backdrop-blur">
    <h4 className="mb-2 font-semibold text-stone-700"></h4>
    <iframe
      title="Ceremonia"
      src="https://www.google.com/maps?q=120%20Boul.%20Gouin%20E,%20Montr%C3%A9al,%20QC%20H3L%201A6&output=embed"
      width="100%"
      height="280"
      style={{ border: 0, maxWidth: '500px' }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>

    {/* Text below the map */}
    <p className="mt-3 text-sm text-stone-700">
      <span className="place-name">
        <i className="" aria-hidden />
        <span className="place-name__text">Eglise Orthodoxe d'Antioche</span>
      </span>
    </p>

<div className="mt-3 flex gap-3">
  <button
    onClick={() => openMapsLinksOnly(CEREMONIA_LINKS)}
    className="btn-primary btn-anim inline-flex items-center gap-2"
    aria-label="Open in Maps"
  >
    Open in Maps
  </button>
  <button
    onClick={() => openWaze(CEREMONIA_LINKS.waze)}
    className="btn-ghost btn-anim inline-flex items-center gap-2"
    aria-label="Open in Waze"
  >
    Open in Waze
  </button>
</div>
<p className="mt-3 text-xs text-stone-600">120 Boul. Gouin E, Montréal, QC H3L 1A6</p>


  </div>
    {/* Dinner */}
  <div className="flex flex-col items-center overflow-hidden rounded-2xl border border-white/50 bg-white/50 p-4 shadow-sm supports-[backdrop-filter]:backdrop-blur">
    <h4 className="mb-2 font-semibold text-stone-700"></h4>
    <iframe
      title="Mapa Comida"
      src="https://www.google.com/maps?q=480%20Blvd.%20Saint-Martin%20O,%20Laval,%20QC%20H7M%203Y2&output=embed"
      width="100%"
      height="280"
      style={{ border: 0, maxWidth: '500px' }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>

    {/* Text below the map */}
    <p className="mt-3 text-sm text-stone-700">
      <span className="place-name">
        <i className="" aria-hidden />
        <span className="place-name__text">Salle de réception La Sirène</span>
      </span>
    </p>

<div className="mt-3 flex gap-3">
  <button
    onClick={() => openMapsLinksOnly(CENA_LINKS)}
    className="btn-primary btn-anim inline-flex items-center gap-2"
    aria-label="Open in Maps"
  >
    Open in Maps
  </button>
  <button
    onClick={() => openWaze(CENA_LINKS.waze)}
    className="btn-ghost btn-anim inline-flex items-center gap-2"
    aria-label="Open in Waze"
  >
    Open in Waze
  </button>
</div>
<p className="mt-3 text-xs text-stone-600">480 Blvd. Saint-Martin O, Laval, QC H7M 3Y2</p>


</div>
</div>


      </div>
    </section>



        {/* RSVP (includes allergies) */}
        <section id="rsvp" className="scroll-mt-24 bg-gradient-to-t from-white/10 to-[#F7F3EC]/10 py-16 supports-[backdrop-filter]:backdrop-blur-sm">
          <div className="mx-auto max-w-3xl px-6">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="font-display text-3xl text-stone-800"
            >
              Confirm your attendance
            </motion.h2>

<style>{`
  /* ===== Submit button animation ===== */
  .btn-send { position: relative; overflow: hidden; }
  .btn-send.sending { animation: sendPulse .35s ease; }
  .btn-send.sending::after {
    content: '';
    position: absolute; inset: 0 -40%;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.45) 40%, transparent 80%);
    transform: translateX(-120%);
    animation: sendSweep .7s ease forwards;
    pointer-events: none;
  }
  @keyframes sendPulse { 0%{transform:scale(1)} 50%{transform:scale(1.03)} 100%{transform:scale(1)} }
  @keyframes sendSweep { to { transform: translateX(120%); } }

  /* ===== Toast ===== */
  .toast{
    position: fixed; left:50%; bottom:22px; transform: translateX(-50%) translateY(12px);
    background: rgba(255,255,255,.9); color:#1f2937; /* stone-800 */
    border: 1px solid rgba(234,208,104,.55); border-radius: 9999px;
    padding: .6rem 1rem; font-size:.9rem; box-shadow: 0 8px 24px rgba(0,0,0,.15);
    z-index: 70; opacity:0; transition: opacity .25s ease, transform .25s ease;
  }
  .toast.in{ opacity:1; transform: translateX(-50%) translateY(0); }
`}</style>

<motion.form
  initial={{ y: 20, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  viewport={{ once: true }}
  onSubmit={(e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);

    const nombre = (data.get('nombre') || '').toString();
    const correo = (data.get('correo') || '').toString();
    const invitados = (data.get('invitados') || '').toString();
    const mensaje = (data.get('mensaje') || '').toString();

    // Payload for guest email (sent to the invitee)
const payloadGuest = {
  email: correo,            // 👈 clave correcta según tu template
  guest_name: nombre,
  guest_count: invitados,
  reply_to: correo,
  guest_message: mensaje,
};

// Payload for host notification — send `email` in case template uses {{email}} in "To Email"
// Payloads for host notification (send to both hosts)
const payloadHostAngeline = {
  email: 'angelinekharsa@gmail.com', // tu template usa {{email}} en "To Email"
  guest_name: nombre,
  guest_count: invitados,
  reply_to: correo,
  guest_message: mensaje || 'No additional message',
};

const payloadHostManuel = {
  email: 'manuelarias752@gmail.com',
  guest_name: nombre,
  guest_count: invitados,
  reply_to: correo,
  guest_message: mensaje || 'No additional message',
};

    showToast('Sending your RSVP…');

Promise.all([
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_GUEST, payloadGuest,        { publicKey: EMAILJS_PUBLIC_KEY }),
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_HOST,  payloadHostAngeline, { publicKey: EMAILJS_PUBLIC_KEY }),
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_HOST,  payloadHostManuel,   { publicKey: EMAILJS_PUBLIC_KEY }),
])
  .then(() => {
    showToast('Thanks! Your RSVP was sent.');
    formEl.reset();
  })
  .catch((err) => {
    console.error('EmailJS error:', err?.status, err?.text || err);
    showToast(`Oops! ${err?.text || 'We could not send your RSVP. Please try again.'}`);
  });
  }}
  className="mx-auto mt-6 grid max-w-xl gap-4 rounded-3xl border border-white/50 bg-white/50 p-6 shadow-sm supports-[backdrop-filter]:backdrop-blur"
>
  <div className="grid gap-2 text-left">
    <label className="text-sm text-stone-600">Full name</label>
    <input
      name="nombre"
      required
      placeholder="Your name"
      className="rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#EAD068]"
    />
  </div>

  {/* 🔹 New email field */}
  <div className="grid gap-2 text-left">
    <label className="text-sm text-stone-600">Email address</label>
    <input
      name="correo"
      type="email"
      required
      placeholder="you@example.com"
      className="rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#EAD068]"
    />
  </div>

  <div className="grid gap-2 text-left">
    <label className="text-sm text-stone-600">Number of guests (including yourself)</label>
    <input
      name="invitados"
      type="number"
      min="1"
      max="10"
      defaultValue="1"
      className="rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 outline-none transition focus:ring-2 focus:ring-[#EAD068]"
    />
  </div>

  <p className="mt-4 text-center text-stone-700 italic">Looking forward to celebrate our magical day with you!</p>
  <div className="mx-auto flex items-center justify-center">
    <BurstButton
      type="submit"
      className="btn-primary btn-anim btn-send px-8 py-3 text-base text-center"
      onClick={(e) => { e.currentTarget.classList.add('sending'); launchHearts(e); showToast('Thanks! We will contact you by email ✨'); }}
    >
      Send
    </BurstButton>
    <BurstButton
      type="button"
      className="btn-ghost btn-anim btn-send px-8 py-3 text-base text-center ml-3"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      Home
    </BurstButton>
  </div>
</motion.form>
          </div>
        </section>
      </>
    </div>
  );
}