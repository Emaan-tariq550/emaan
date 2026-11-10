
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { PLACEHOLDER } from '../data/gallery'

const SWIPE_DISTANCE = 80

const slide = {
  enter: (d) => ({ opacity: 0, x: d * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -60 }),
}

const pad = (n) => String(n).padStart(2, '0')

const btn =
  'flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-softwhite/20 bg-midnight/50 text-softwhite/85 transition-colors duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

export default function Lightbox({ images = [], index, onClose, onChange }) {
  const reduce = useReducedMotion()
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  const [dir, setDir] = useState(1)
  const [failed, setFailed] = useState({})

  const count = images.length

  // Prevent errors when no images are available
  if (!count || !images[index]) return null

  const image = images[index]
  const src = failed[image.id] ? PLACEHOLDER : image.src
  const motionDir = reduce ? 0 : dir

  // Navigate between images
  const go = useCallback(
    (delta) => {
      if (count < 2) return

      setDir(delta)
      onChange((index + delta + count) % count)
    },
    [count, index, onChange],
  )

  // Lock scroll and manage focus
  useEffect(() => {
    const opener = document.activeElement
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow

      if (opener && typeof opener.focus === 'function') {
        opener.focus({ preventScroll: true })
      }
    }
  }, [])

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        go(1)
      } else if (e.key === 'ArrowLeft') {
        go(-1)
      } else if (e.key === 'Tab' && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll(
          'button:not(:disabled)',
        )

        if (!items.length) return

        const first = items[0]
        const last = items[items.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  // Preload previous and next images
  useEffect(() => {
    if (count < 2) return

    ;[(index + 1) % count, (index - 1 + count) % count].forEach((i) => {
      const img = new Image()
      img.src = images[i].src
    })
  }, [index, count, images])

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[300] flex flex-col bg-midnight/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <span className="label text-softwhite/70" aria-live="polite">
          {pad(index + 1)}{' '}
          <span className="text-muted">/ {pad(count)}</span>
        </span>

        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close viewer"
          className={btn}
        >
          <X size={18} />
        </button>
      </div>

      {/* Photo stage */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-24"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        {/* Previous button */}
        {count > 1 && (
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className={`${btn} absolute left-2 z-10 md:left-6`}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Animated image */}
        <AnimatePresence mode="wait" custom={motionDir} initial={false}>
          <motion.img
            key={image.id}
            src={src}
            alt={image.alt || ''}
            custom={motionDir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.35, ease: 'easeOut' }}
            drag={count > 1 && !reduce ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_DISTANCE) go(1)
              else if (info.offset.x > SWIPE_DISTANCE) go(-1)
            }}
            onError={() =>
              setFailed((f) => ({ ...f, [image.id]: true }))
            }
            draggable={false}
            className="max-h-[72svh] max-w-full select-none object-contain shadow-2xl md:max-h-[78svh]"
          />
        </AnimatePresence>

        {/* Next button */}
        {count > 1 && (
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className={`${btn} absolute right-2 z-10 md:right-6`}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="min-h-[4.5rem] px-6 pb-6 pt-3 text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={image.id}
            className="display text-xl italic text-ivory md:text-2xl"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {image.caption || image.alt || ''}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
