import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import SafeImage from '../components/SafeImage'
import ChapterTransition from '../components/ChapterTransition'
import { siteConfig } from '../data/memories'
import { specialPhotos } from '../data/gallery'

const EASE = [0.22, 1, 0.36, 1]

export default function AboutMe() {
  const reduce = useReducedMotion()
  const frameRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])
  const { about, name } = siteConfig

  return (
    <section id="about" className="relative overflow-hidden bg-ivory text-midnight">
      {/* Giant faint name behind everything */}
      <p
        aria-hidden="true"
        className="display pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-midnight/[0.04]"
        style={{ fontSize: 'clamp(8rem, 30vw, 28rem)' }}
      >
        {name.toUpperCase()}
      </p>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 md:grid-cols-12 md:gap-8 md:px-12 md:py-40">
        {/* Text */}
        <div className="md:col-span-6">
          <motion.p
            className="label flex items-center gap-4 text-brown"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <span className="h-px w-10 bg-rose" aria-hidden="true" />
            CHAPTER 05 — THE PERSON BEHIND THE FRAMES
          </motion.p>

          <h2 className="display mt-6" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 6rem)' }}>
            {['Behind every frame,', 'there’s a person.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-2">
                <motion.span
                  className={`block ${i === 1 ? 'italic text-rose' : ''}`}
                  initial={{ y: '110%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 1.4, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            className="mt-5 font-serif text-xl italic text-brown md:text-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1.2 }}
          >
            This is a little about mine.
          </motion.p>

          <div className="mt-10 space-y-5">
            {about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                className="max-w-lg text-[0.95rem] leading-[1.9] text-midnight/80 md:text-base"
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.1, duration: 1.2, ease: EASE }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.dl
            className="mt-10 grid max-w-lg grid-cols-1 gap-4 border-t border-midnight/15 pt-6 sm:grid-cols-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt className="label text-brown" style={{ fontSize: '0.6rem' }}>{f.label}</dt>
                <dd className="mt-1 font-serif text-lg italic">{f.value}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.p
            className="mt-10 font-serif text-4xl italic text-rose md:text-5xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1.4 }}
          >
            — {name}
          </motion.p>
        </div>

        {/* Portrait */}
        <div className="md:col-span-5 md:col-start-8">
          <div className="relative isolate">
            <div className="absolute -bottom-5 -left-5 -z-10 h-full w-full bg-rose/30 md:-bottom-8 md:-left-8" aria-hidden="true" />
            <motion.div
              ref={frameRef}
              className="relative aspect-[3/4] overflow-hidden bg-brown/20"
              initial={reduce ? false : { clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.6, ease: EASE }}
            >
              <motion.div className="absolute inset-x-0" style={{ top: '-10%', bottom: '-10%', y }}>
                <SafeImage src={specialPhotos.aboutPortrait} alt={`Portrait of ${name}`} className="h-full w-full object-cover" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Ivory, then dusty rose, then back to midnight */}
      <ChapterTransition from="ivory" via="rose" to="midnight" height="h-56 md:h-80" />
    </section>
  )
}