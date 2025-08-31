import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NavBar({ onRSVPClick, onMapClick }) {
  const items = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'historia', label: 'Historia' },
    { id: 'detalles', label: 'Detalles' },
    { id: 'galeria', label: 'Galería' },
    { id: 'rsvp', label: 'RSVP' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-brand-600" />
            <span className="font-display text-lg">Angeline & Manuel</span>
          </div>
          <nav className="hidden gap-2 md:flex">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => scrollTo(it.id)}
                className="btn-ghost text-sm"
              >
                {it.label}
              </button>
            ))}
            <button onClick={onMapClick} className="btn-ghost text-sm">
              Mapa
            </button>
            <button onClick={onRSVPClick} className="btn-primary text-sm">
              Confirmar <Sparkles className="ml-1 h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
