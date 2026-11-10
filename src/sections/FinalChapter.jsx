import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import SafeImage from '../components/SafeImage'
import Magnetic from '../components/Magnetic'
import { specialPhotos } from '../data/gallery'
import { siteConfig } from '../data/memories'

const EASE = [0.22, 1, 0.36, 1]

export default function FinalChapter() {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const timers = useRef([])
  const inView = useInView(ref, { amount: 0.5 })
  const [stage, setStage] = useState(0) // 0 nothing, 1 first line, 2 second text, 3 thank you
  const [fading, setFading] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])

  // The ending plays whenever it comes into view
  useEffect(() => {
    if (!inView) {
      setStage(0)
      return
    }
    const times = reduce ? [200, 900, 1600] : [400, 5200, 11500]
    const ids = times.map((t, i) => setTimeout(() => setStage(i + 1), t))
    return () => ids.forEach(clearTimeout)
  }, [inView, reduce])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Fade to black, jump to the top, fade back in
  const replay = () => {
    setFading(true)
    timers.current.push(
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
        setFading(false)
      }, 900),
    )
  }

  return (
    <section id="ending" ref={ref} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-midnight">
      {/* Background photograph: slow zoom + parallax */}
      <motion.div className="absolute inset-x-0" style={{ top: '-10%', bottom: '-10%', y: bgY }}>
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1 }}
          animate={reduce ? undefined : { scale: 1.12 }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
        >
          <SafeImage src={specialPhotos.finalBackground} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/55 to-midnight/90" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(11,11,13,0.7) 100%)' }}
      />

      <div className="relative z-10 flex min-h-[100svh] w-full flex-col items-center justify-between px-6 py-20 text-center">
        <span aria-hidden="true" />

        <div className="flex min-h-[14rem] items-center justify-center">
          <AnimatePresence mode="wait">
            {stage === 1 && (
              <motion.p
                key="a"
                className="display max-w-4xl text-4xl italic text-softwhite md:text-7xl"
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 2, ease: EASE }}
              >
                And that’s a little piece of my world.
              </motion.p>
            )}
            {stage >= 2 && (
              <motion.div
                key="b"
                className="max-w-3xl space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6 }}
              >
                <p className="display text-3xl text-softwhite md:text-6xl">Not everything needs to be explained.</p>
                <p className="display text-3xl italic text-gold md:text-6xl">Some things are simply meant to be felt.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex min-h-[8rem] flex-col items-center gap-6">
          <AnimatePresence>
            {stage >= 3 && (
              <motion.div
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, ease: EASE }}
              >
                <p className="label text-softwhite/80">THANK YOU FOR BEING HERE.</p>
                <Magnetic>
                  <button
                    onClick={replay}
                    className="inline-flex cursor-pointer items-center gap-3 border border-gold/60 px-7 py-3 label text-softwhite transition-all duration-500 hover:bg-gold hover:text-midnight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    Replay the story
                  </button>
                </Magnetic>
                <p className="label text-muted" style={{ fontSize: '0.6rem' }}>
                  © {new Date().getFullYear()} {siteConfig.name}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Replay fade-out / fade-in */}
      <AnimatePresence>
        {fading && (
          <motion.div
            key="fade"
            className="fixed inset-0 z-[250] bg-midnight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </section>
  )
}