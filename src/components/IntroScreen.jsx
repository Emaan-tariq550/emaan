import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Music, VolumeX } from 'lucide-react'
import { specialPhotos } from '../data/gallery'
import { siteConfig } from '../data/memories'

const POEM = [
  'Some stories are written.',
  'Some are captured.',
  'And some are simply lived.',
]

export default function IntroScreen({ onEnter }) {
  const reduce = useReducedMotion()
  // stage 0 = only the light, 1 = the poem, 2 = title + enter button
  const [stage, setStage] = useState(0)
  const [bgFailed, setBgFailed] = useState(false)

  // Timeline of the introduction
  useEffect(() => {
    const t1 = setTimeout(() => setStage((s) => Math.max(s, 1)), reduce ? 300 : 1800)
    const t2 = setTimeout(() => setStage((s) => Math.max(s, 2)), reduce ? 1800 : 9800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reduce])

  // Lock page scrolling while the intro is open
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const lineGap = reduce ? 0.2 : 1.5
  const letters = siteConfig.name.toUpperCase().split('')

  return (
    <motion.div
      className="fixed inset-0 z-[150] overflow-hidden bg-midnight"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1.4, ease: 'easeInOut' }}
    >
      {/* Personal photograph, revealed slowly behind the title */}
      {!bgFailed && (
        <motion.img
          src={specialPhotos.introBackground}
          alt=""
          aria-hidden="true"
          onError={() => setBgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.15 }}
          animate={stage >= 2 ? { opacity: 0.5, scale: 1 } : { opacity: 0, scale: 1.15 }}
          transition={{ duration: reduce ? 0.5 : 6, ease: 'easeOut' }}
        />
      )}
      {/* Cinematic dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-midnight/30 to-midnight/90" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(11,11,13,0.75) 100%)' }}
      />

      {/* The tiny champagne light */}
      <motion.span
        className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
        style={{ boxShadow: '0 0 24px 6px rgba(198,167,122,0.55)' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={stage >= 2 ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />

      {/* Poem, then title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {stage === 1 && (
            <motion.div
              key="poem"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="space-y-3"
            >
              {POEM.map((line, i) => (
                <motion.p
                  key={line}
                  className="display text-2xl italic text-ivory md:text-4xl"
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ delay: i * lineGap, duration: reduce ? 0.3 : 1.6, ease: 'easeOut' }}
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div key="title" className="flex flex-col items-center">
              <motion.p
                className="label text-gold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1.2 }}
              >
                A LITTLE WORLD CALLED
              </motion.p>

              <h1
                className="display mt-4 flex text-softwhite"
                style={{ fontSize: 'clamp(4.5rem, 20vw, 15rem)' }}
                aria-label={siteConfig.name}
              >
                {letters.map((letter, i) => (
                  <motion.span
                    key={i}
                    aria-hidden="true"
                    initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.5 + i * 0.12, duration: reduce ? 0.3 : 1.4, ease: 'easeOut' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enter buttons */}
      <AnimatePresence>
        {stage >= 2 && (
          <motion.div
            className="absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-5 px-6 md:bottom-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0.2 : 1.8, duration: 1.2 }}
          >
            <button
              onClick={() => onEnter(true)}
              className="inline-flex cursor-pointer items-center gap-3 border border-gold/60 px-8 py-4 label text-softwhite transition-all duration-500 hover:bg-gold hover:text-midnight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <Music size={14} aria-hidden="true" />
              [ Enter My World ]
            </button>

            <button
              onClick={() => onEnter(false)}
              className="inline-flex cursor-pointer items-center gap-2 label text-muted transition-colors hover:text-softwhite focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <VolumeX size={13} aria-hidden="true" />
              Enter without music
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip (only while the intro is still playing) */}
      {stage < 2 && (
        <button
          onClick={() => setStage(2)}
          className="absolute right-6 top-6 z-10 cursor-pointer label text-muted/70 transition-colors hover:text-softwhite"
        >
          Skip
        </button>
      )}
    </motion.div>
  )
}