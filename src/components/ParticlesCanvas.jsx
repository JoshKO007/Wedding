import { useEffect, useRef } from 'react';

/** Simple particle background: soft circles that float upward and twinkle */
export default function ParticlesCanvas() {
  const ref = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const createParticles = () => {
      const count = Math.min(120, Math.floor((width * height) / 15000));
      particlesRef.current = new Array(count).fill(null).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2.5,
        vy: 0.2 + Math.random() * 0.6,
        alpha: 0.5 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
        twSpeed: 0.005 + Math.random() * 0.01,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particlesRef.current) {
        p.y -= p.vy;
        p.tw += p.twSpeed;
        const a = p.alpha * (0.5 + Math.sin(p.tw) * 0.5);
        if (p.y + p.r < 0) p.y = height + p.r;

        // soft glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(244,63,94,${a})`);     // brand-500
        g.addColorStop(1, 'rgba(244,63,94,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, a + 0.2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    };

    createParticles();
    draw();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 opacity-90"
    />
  );
}
