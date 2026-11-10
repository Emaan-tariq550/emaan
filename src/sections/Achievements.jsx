import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { milestones } from '../data/memories'

const EASE = [0.22, 1, 0.36, 1]

export default function Achievements() {
  const reduce = useReducedMotion()
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="memories" className="relative bg-midnight text-softwhite">
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-10 md:px-12 md:pb-44 md:pt-20">
        <motion.p
          className="label flex items-center gap-4 text-gold"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <span className="h-px w-10 bg-gold" aria-hidden="true" />
          CHAPTER 06 — THINGS I’M PROUD OF
        </motion.p>

        <h2 className="display mt-6" style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}>
          {['Little victories,', 'big chapters.'].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-2">
              <motion.span
                className={`block ${i === 1 ? 'italic text-gold' : ''}`}
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

        {/* Timeline */}
        <div ref={listRef} className="relative mt-20 md:mt-32">
          <div className="absolute bottom-0 left-4 top-0 w-px -translate-x-1/2 bg-softwhite/10 md:left-1/2" aria-hidden="true">
            <motion.div
              className="h-full w-full origin-top bg-gold"
              style={{ scaleY: reduce ? 1 : lineScale }}
            />
          </div>

          <ol className="space-y-16 md:space-y-28">
            {milestones.map((m, i) => {
              const right = i % 2 === 1
              return (
                <li key={`${m.year}-${m.title}`} className="relative pl-12 md:grid md:grid-cols-2 md:gap-24 md:pl-0">
                  <motion.span
                    aria-hidden="true"
                    className="absolute left-4 top-2 h-3 w-3 -translate-x-1/2 rounded-full border border-gold bg-midnight md:left-1/2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />

                  <motion.article
                    className={right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1.2, ease: EASE }}
                  >
                    <p className="label text-gold">
                      {m.year} <span className="text-muted">· {m.category}</span>
                    </p>
                    <h3 className="display mt-3 text-3xl text-softwhite md:text-5xl">{m.title}</h3>
                    <p
                      className={`mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base ${
                        right ? '' : 'md:ml-auto'
                      }`}
                    >
                      {m.text}
                    </p>
                  </motion.article>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}