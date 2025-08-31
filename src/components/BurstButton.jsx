import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function BurstButton({ children, className = '', onClick, ...props }) {
  const [bursts, setBursts] = useState([]);

  const handleClick = useCallback((e) => {
    const id = Math.random().toString(36).slice(2);
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = { x: rect.width / 2, y: rect.height / 2 };
    const particles = new Array(14).fill(null).map((_, i) => ({
      id: id + '-' + i,
      angle: (i / 14) * Math.PI * 2 + randomBetween(-0.2, 0.2),
      distance: randomBetween(30, 70),
      scale: randomBetween(0.7, 1.3),
      type: Math.random() < 0.6 ? 'heart' : 'sparkle',
    }));
    setBursts((b) => [...b, { id, origin, particles }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 900);
    onClick?.(e);
  }, [onClick]);

  return (
    <button onClick={handleClick} className={className} {...props}>
      <span className="relative inline-flex items-center">
        {children}
        {/* FX Layer */}
        <AnimatePresence>
          {bursts.map((b) => (
            <div key={b.id} className="pointer-events-none absolute inset-0">
              {b.particles.map((p) => {
                const x = Math.cos(p.angle) * p.distance;
                const y = Math.sin(p.angle) * p.distance;
                return (
                  <motion.span
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
                    animate={{ x, y, opacity: 0, scale: p.scale }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    {p.type === 'heart' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#f43f5e" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21s-7.5-4.35-10-8.5C-0.5 8.5 2.5 5 6 5c2.1 0 3.6 1.2 4 2 0.4-0.8 1.9-2 4-2 3.5 0 6.5 3.5 4 7.5-2.5 4.15-10 8.5-10 8.5z"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round">
                          <path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>
                          <path d="M5 5l3.5 3.5M15.5 15.5L19 19M19 5l-3.5 3.5M5 19l3.5-3.5"/>
                        </g>
                      </svg>
                    )}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </AnimatePresence>
      </span>
    </button>
  );
}
