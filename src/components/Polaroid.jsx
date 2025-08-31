
import { motion } from 'framer-motion';

/* Polaroid centrada:
   - mismo ancho (w-64)
   - alto controlado por aspect ratio (aspect-[3/4])
   - imagen recortada proporcionalmente (object-cover)
*/
export default function Polaroid({ src, caption = '', rotate = 0, className = '' }) {
  return (
    <motion.figure
      initial={{ y: 30, opacity: 0, rotate }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 80, damping: 12 }}
      className={`polaroid ${className} mx-auto`}
      style={{ rotate }}
    >
      <span className="tape" />
      <div className="w-64 rounded-[10px] bg-white/60 p-1 sm:w-64">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-md">
          <img
            src={src}
            alt={caption || 'Foto'}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
      <figcaption className="caption">{caption}</figcaption>
    </motion.figure>
  );
}
