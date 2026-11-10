import { motion } from 'framer-motion'

const COLORS = {
  midnight: '#0B0B0D',
  charcoal: '#171719',
  ivory: '#F3EEE5',
  olive: '#262A1E',
  rose: '#B88C91',
  beige: '#D9CDB4',
}

// A tall soft gradient that melts one chapter's colour into the next.
export default function ChapterTransition({ from = 'midnight', via, to = 'charcoal', height = 'h-40 md:h-64', label }) {
  const stops = [from, via, to].filter(Boolean).map((c) => COLORS[c]).join(', ')
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center ${height}`}
      style={{ background: `linear-gradient(to bottom, ${stops})` }}
    >
      {label && (
        <motion.span
          className="label text-gold"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.2 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}