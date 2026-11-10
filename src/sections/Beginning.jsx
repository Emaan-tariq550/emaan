import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Slideshow from '../components/Slideshow'
import { gallery, slideshowIds, specialPhotos } from '../data/gallery'

// Hero photo first, then the photos chosen in data/gallery.js -> slideshowIds
const slides = [
  { src: specialPhotos.heroBackground, alt: 'Emaan' },
  ...slideshowIds.map((id) => gallery.find((p) => p.id === id)).filter(Boolean),
]

const LINES = ['Every picture has a story.', 'These are a few of mine.']

export default function Beginning() {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.9])

  const scrollDown = () =>
    window.scrollTo({ top: window.innerHeight, behavior: reduce ? 'auto' : 'smooth' })

  return (
    <section id="home" ref={ref} className="relative bg-midnight">
      <Slideshow images={slides}>
        <motion.div
          className="flex h-full flex-col justify-center px-6 md:px-16"
          style={reduce ? undefined : { y: textY, opacity: textOpacity }}
        >
          <motion.p
            className="label flex items-center gap-4 text-gold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 1.2, ease: 'easeOut' }}
          >
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            CHAPTER 01 — THE BEGINNING
          </motion.p>

          <h1
            className="display mt-6 text-softwhite"
            style={{ fontSize: 'clamp(2.8rem, 8.5vw, 8.5rem)' }}
          >
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-2">
                <motion.span
                  className={`block ${i === 1 ? 'italic text-ivory/90' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ delay: 1.8 + i * 0.35, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
        </motion.div>

        {/* Scroll-down indicator */}
        <motion.button
          onClick={scrollDown}
          aria-label="Scroll down"
          className="pointer-events-auto absolute bottom-6 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-softwhite/70 transition-colors hover:text-gold sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1.2 }}
        >
          <span className="label">Scroll</span>
          <motion.span
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={18} />
          </motion.span>
        </motion.button>
      </Slideshow>

      {/* Dark veil that deepens as you scroll away */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 bg-midnight"
        style={{ opacity: veil }}
        aria-hidden="true"
      />
    </section>
  )
}