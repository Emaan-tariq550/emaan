import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { ArrowUp, Menu, X } from 'lucide-react'
import Magnetic from './Magnetic'
import { siteConfig } from '../data/memories'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'moments', label: 'Moments' },
  { id: 'videos', label: 'Videos' },
  { id: 'world', label: 'My World' },
  { id: 'about', label: 'About' },
  { id: 'memories', label: 'Memories' },
]
const SECTION_IDS = [...LINKS.map((l) => l.id), 'ending']
const pad = (n) => String(n).padStart(2, '0')

export default function Navigation() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const closeRef = useRef(null)

  const { scrollY, scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  useMotionValueEvent(scrollY, 'change', (v) => setShowTop(v > window.innerHeight * 1.2))

  // Which chapter is in the middle of the screen? (scroll based, works everywhere)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const mid = window.innerHeight / 2
      let current = SECTION_IDS[0]
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= mid) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Mobile menu: lock scroll, Esc to close, focus the close button
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const goTo = (id) => {
    const wasOpen = open
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }, wasOpen ? 450 : 0)
  }

  const index = SECTION_IDS.indexOf(active)
  const chapterText = index >= 0 && index < LINKS.length ? `Chapter ${pad(index + 1)}` : 'Epilogue'

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        className="fixed left-0 right-0 top-0 z-[85] h-[2px] origin-left bg-gold"
        style={{ scaleX }}
      />

      {/* Floating header (blend mode keeps it readable on dark AND ivory chapters) */}
      <motion.header
        className="fixed inset-x-0 top-0 z-[80] text-softwhite mix-blend-difference"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
          <div className="flex items-center gap-4">
            <button
              onClick={() => goTo('home')}
              className="cursor-pointer font-serif text-2xl italic leading-none"
              aria-label="Back to the beginning"
            >
              {siteConfig.name}
            </button>
            <span className="hidden h-px w-8 bg-current xl:block" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={chapterText}
                className="label hidden xl:block"
                style={{ fontSize: '0.6rem' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                aria-live="polite"
              >
                {chapterText}
              </motion.span>
            </AnimatePresence>
          </div>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-8" aria-label="Main">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => goTo(l.id)}
                aria-current={active === l.id ? 'true' : undefined}
                className={`label relative cursor-pointer py-1 transition-opacity duration-500 hover:opacity-100 ${
                  active === l.id ? 'opacity-100' : 'opacity-60'
                }`}
                style={{ fontSize: '0.62rem' }}
              >
                {l.label}
                {active === l.id && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-px bg-current" />
                )}
              </button>
            ))}
          </nav>

          <button
            className="cursor-pointer lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[110] flex flex-col bg-midnight px-6 py-6 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <span className="label text-gold">Chapters</span>
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-softwhite/20 text-softwhite"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-5" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  onClick={() => goTo(l.id)}
                  className={`flex cursor-pointer items-baseline gap-4 text-left ${
                    active === l.id ? 'text-gold' : 'text-softwhite'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="label text-muted" style={{ fontSize: '0.6rem' }}>{pad(i + 1)}</span>
                  <span className="display text-5xl italic">{l.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.div
            className="fixed bottom-24 right-4 z-[80] md:bottom-28 md:right-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <Magnetic>
              <button
                onClick={() => goTo('home')}
                aria-label="Back to top"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-gold/40 bg-midnight/70 text-gold backdrop-blur-md transition-colors hover:bg-gold hover:text-midnight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <ArrowUp size={16} />
              </button>
            </Magnetic>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}