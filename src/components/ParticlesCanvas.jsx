import { useEffect, useRef } from 'react';

// Draw a heart (normalized around 0,0). `size` behaves like a radius.
function drawHeart(ctx, x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(0, -0.35);
  ctx.bezierCurveTo(0.35, -0.7, 0.95, -0.2, 0, 0.55);
  ctx.bezierCurveTo(-0.95, -0.2, -0.35, -0.7, 0, -0.35);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

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

        // soft glow (heart halo)
        drawHeart(ctx, p.x, p.y, p.r * 6, 'rgba(244,63,94,1)', a * 0.25);

        // core (corazón principal)
        drawHeart(ctx, p.x, p.y, p.r * 2.2, '#FFFFFF', Math.min(1, a + 0.35));
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
