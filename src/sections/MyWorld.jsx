import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import SafeImage from '../components/SafeImage'
import ChapterTransition from '../components/ChapterTransition'
import { worldTopics } from '../data/memories'

const EASE = [0.22, 1, 0.36, 1]
const STATEMENT = 'There’s a whole world beyond what a picture can show.'
const ITALIC = new Set(['whole', 'world'])
const pad = (n) => String(n).padStart(2, '0')

export default function MyWorld() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const topic = worldTopics[active]

  return (
    <section id="world" className="relative bg-olive text-beige">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-10 md:px-12 md:pt-20">
        <motion.p
          className="label flex items-center gap-4 text-gold"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <span className="h-px w-10 bg-gold" aria-hidden="true" />
          CHAPTER 04 — THE WORLD THROUGH MY EYES
        </motion.p>

        {/* Big statement, revealed word by word */}
        <h2
          className="display mt-8 text-softwhite"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 7.5rem)' }}
          aria-label={STATEMENT}
        >
          {STATEMENT.split(' ').map((word, i) => (
            <span key={i} aria-hidden="true" className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className={`inline-block ${ITALIC.has(word) ? 'italic text-gold' : ''}`}
                initial={{ y: '110%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1.2, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        {/* Interactive explorer */}
        <div className="mt-20 grid gap-10 md:mt-36 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div
              role="tablist"
              aria-label="Explore my world"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-col md:gap-2 md:overflow-visible md:px-0"
            >
              {worldTopics.map((t, i) => {
                const on = i === active
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(i)}
                    className={`flex shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap border px-4 py-2 text-left transition-colors duration-500 md:border-0 md:px-0 md:py-1 ${
                      on
                        ? 'border-gold text-gold'
                        : 'border-beige/20 text-beige/55 hover:text-beige'
                    }`}
                  >
                    <span className="hidden w-10 md:block">
                      {on && (
                        <motion.span layoutId="world-line" className="block h-px w-8 bg-gold" />
                      )}
                    </span>
                    <span className="font-sans text-[0.68rem] uppercase tracking-[0.25em] md:hidden">
                      {t.label}
                    </span>
                    <span className="hidden font-serif text-4xl leading-tight md:block">
                      <span className="mr-3 align-top font-sans text-[0.6rem] tracking-[0.3em] opacity-70">
                        {pad(i + 1)}
                      </span>
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={topic.id}
                role="tabpanel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                <motion.div
                  className="relative aspect-[4/5] overflow-hidden bg-charcoal md:aspect-[5/4]"
                  initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ clipPath: 'inset(0 0 0% 0)' }}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  <motion.div
                    className="h-full w-full"
                    initial={reduce ? false : { scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 5, ease: EASE }}
                  >
                    <SafeImage key={topic.image} src={topic.image} alt={topic.label} className="h-full w-full object-cover" />
                  </motion.div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-olive/60 to-transparent" />
                </motion.div>

                <div className="mt-8 grid gap-6 md:grid-cols-5">
                  <div className="md:col-span-3">
                    <p className="label text-gold">{topic.label}</p>
                    <h3 className="display mt-3 text-4xl italic text-softwhite md:text-5xl">{topic.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-beige/80 md:text-base">{topic.text}</p>
                  </div>
                  <ul className="flex flex-wrap content-start gap-2 md:col-span-2">
                    {topic.items.map((item, i) => (
                      <motion.li
                        key={item}
                        className="border border-gold/30 px-3 py-1.5 font-sans text-[0.68rem] uppercase tracking-[0.2em] text-beige"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Olive melts into warm ivory */}
      <div className="mt-20 md:mt-32">
        <ChapterTransition from="olive" to="ivory" height="h-48 md:h-72" />
      </div>
    </section>
  )
}