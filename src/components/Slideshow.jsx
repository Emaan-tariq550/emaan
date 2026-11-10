import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize, Minimize, Pause, Play } from 'lucide-react'
import { PLACEHOLDER } from '../data/gallery'

const MIN_MS = 4000 // shortest time a photo stays
const MAX_MS = 6000 // longest time a photo stays
const FADE = 1.6 // transition length in seconds
const EASE = [0.22, 1, 0.36, 1]

const SUBTLE = ['fade', 'blur', 'zoom'] // used most of the time
const SPECIAL = ['slide', 'curtain', 'mask'] // used occasionally
const ORIGINS = ['50% 50%', '30% 40%', '70% 40%', '50% 70%']

const randomMs = () => Math.floor(MIN_MS + Math.random() * (MAX_MS - MIN_MS))
const randomOrigin = () => ORIGINS[Math.floor(Math.random() * ORIGINS.length)]

function pickTransition(prevType, reduce, forcedDir) {
  if (reduce) return { type: 'fade', dir: 1 }
  const pool = Math.random() < 0.3 ? SPECIAL : SUBTLE
  const options = pool.filter((t) => t !== prevType)
  const type = options[Math.floor(Math.random() * options.length)]
  const dir = forcedDir ?? (Math.random() < 0.5 ? 1 : -1)
  return { type, dir }
}

// How a NEW slide enters, and how the OLD slide leaves.
// The old slide stays fully visible until the new one covers it,
// so the screen never dips to black during a crossfade.
const variants = {
  enter: ({ type, dir }) => {
    switch (type) {
      case 'slide':
        return { x: `${dir * 100}%` }
      case 'curtain':
        return { clipPath: dir === 1 ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)' }
      case 'mask':
        return { clipPath: 'circle(0% at 50% 50%)' }
      case 'blur':
        return { opacity: 0, filter: 'blur(28px)' }
      case 'zoom':
        return { opacity: 0, scale: 1.2 }
      default:
        return { opacity: 0 }
    }
  },
  center: ({ type }) => {
    const transition = { duration: type === 'slide' ? 1.3 : FADE, ease: EASE }
    switch (type) {
      case 'slide':
        return { x: '0%', transition }
      case 'curtain':
        return { clipPath: 'inset(0% 0% 0% 0%)', transition }
      case 'mask':
        return { clipPath: 'circle(150% at 50% 50%)', transition }
      case 'blur':
        return { opacity: 1, filter: 'blur(0px)', transition }
      case 'zoom':
        return { opacity: 1, scale: 1, transition }
      default:
        return { opacity: 1, transition }
    }
  },
  // opacity 0.999 is a deliberate trick: it keeps the old slide on screen
  // for the full transition time, then AnimatePresence removes it.
  exit: ({ type, dir }) => ({
    opacity: 0.999,
    ...(type === 'slide' ? { x: `${-dir * 25}%` } : {}),
    transition: { duration: type === 'slide' ? 1.3 : FADE, ease: EASE },
  }),
}

function Slide({ image, trans, zoomIn, origin, duration, reduce }) {
  const [src, setSrc] = useState(image.src)
  const [letterbox, setLetterbox] = useState(false)

  return (
    <motion.div
      className="absolute inset-0"
      custom={trans}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      {/* Ken Burns: slow zoom in or out for the whole time the slide is visible */}
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: origin }}
        initial={{ scale: reduce ? 1 : zoomIn ? 1 : 1.15 }}
        animate={{ scale: reduce ? 1 : zoomIn ? 1.15 : 1 }}
        transition={{ duration: duration / 1000 + FADE + 1, ease: 'linear' }}
      >
        {/* Portrait photo on a wide screen: blurred copy behind, full photo in front */}
        {letterbox && (
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
          />
        )}
        <img
          src={src}
          alt={image.alt || ''}
          draggable={false}
          onLoad={(e) => {
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget
            setLetterbox(h > w && window.innerWidth > window.innerHeight)
          }}
          onError={() => setSrc(PLACEHOLDER)}
          className={`absolute inset-0 h-full w-full ${letterbox ? 'object-contain' : 'object-cover'}`}
        />
      </motion.div>
    </motion.div>
  )
}

const pad = (n) => String(n).padStart(2, '0')

const btn =
  'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-softwhite/20 text-softwhite/80 transition-colors duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

export default function Slideshow({ images = [], children, controls = true, className = '' }) {
  const reduce = useReducedMotion()
  const rootRef = useRef(null)
  const count = images.length

  const [state, setState] = useState({
    i: 0,
    trans: { type: 'fade', dir: 1 },
    zoomIn: true,
    origin: '50% 50%',
    dur: randomMs(),
  })
  const [playing, setPlaying] = useState(true)
  const [inView, setInView] = useState(true)
  const [isFs, setIsFs] = useState(false)

  const canFullscreen = typeof document !== 'undefined' && document.fullscreenEnabled

  const go = useCallback(
    (delta, manual = false) => {
      if (!count) return
      setState((s) => ({
        i: (s.i + delta + count) % count,
        trans: pickTransition(s.trans.type, reduce, manual ? delta : undefined),
        zoomIn: !s.zoomIn,
        origin: randomOrigin(),
        dur: randomMs(),
      }))
    },
    [count, reduce],
  )

  // Auto-advance (only while playing AND visible)
  useEffect(() => {
    if (!playing || !inView || count < 2) return
    const id = setTimeout(() => go(1), state.dur)
    return () => clearTimeout(id)
  }, [playing, inView, count, state.i, state.dur, go])

  // Pause when the slideshow leaves the screen or the browser tab is hidden
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let onScreen = true
    let tabVisible = !document.hidden
    const update = () => setInView(onScreen && tabVisible)

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        update()
      },
      { threshold: 0.25 },
    )
    observer.observe(el)

    const onVisibility = () => {
      tabVisible = !document.hidden
      update()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // Preload the next photo so the transition never shows a blank frame
  useEffect(() => {
    if (count < 2) return
    const img = new Image()
    img.src = images[(state.i + 1) % count].src
  }, [state.i, count, images])

  // Fullscreen
  useEffect(() => {
    const onChange = () => setIsFs(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    const el = rootRef.current
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.()
  }

  const running = playing && inView && count > 1

  return (
    <div
      ref={rootRef}
      className={`relative h-[100svh] w-full overflow-hidden bg-midnight ${className}`}
    >
      <AnimatePresence custom={state.trans}>
        {count > 0 && (
          <Slide
            key={state.i}
            image={images[state.i]}
            trans={state.trans}
            zoomIn={state.zoomIn}
            origin={state.origin}
            duration={state.dur}
            reduce={reduce}
          />
        )}
      </AnimatePresence>

      {/* Dark cinematic overlays keep text readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/20 to-midnight/85" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(11,11,13,0.6) 100%)' }}
      />

      {/* Content placed on top of the slideshow (titles etc.) */}
      <div className="pointer-events-none absolute inset-0 z-10">{children}</div>

      {controls && count > 0 && (
        <div className="absolute bottom-4 left-4 z-20 md:bottom-6 md:left-6">
          {/* Progress line for the current photo */}
          <div className="mb-3 h-px w-40 overflow-hidden bg-softwhite/15 md:w-56">
            <motion.div
              key={state.i}
              className="h-full origin-left bg-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: running ? 1 : 0 }}
              transition={{ duration: running ? state.dur / 1000 : 0.3, ease: 'linear' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => go(-1, true)} aria-label="Previous photo" className={btn}>
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              className={btn}
            >
              {playing ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button onClick={() => go(1, true)} aria-label="Next photo" className={btn}>
              <ChevronRight size={18} />
            </button>

            <span className="label ml-2 text-softwhite/70" aria-live="polite">
              {pad(state.i + 1)} <span className="text-muted">/ {pad(count)}</span>
            </span>

            {canFullscreen && (
              <button
                onClick={toggleFullscreen}
                aria-label={isFs ? 'Exit fullscreen' : 'View fullscreen'}
                className={`${btn} ml-1`}
              >
                {isFs ? <Minimize size={15} /> : <Maximize size={15} />}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}