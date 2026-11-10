import { memo, useCallback, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Lightbox from './Lightbox'
import { PLACEHOLDER } from '../data/gallery'

const EASE = [0.22, 1, 0.36, 1]

// orientation (from data/gallery.js) -> shape of the picture frame.
// Photos are cropped with object-cover, never stretched.
const RATIO = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  tall: 'aspect-[2/3]',
  square: 'aspect-square',
}

// Small vertical offsets make the columns feel hand-placed, not gridded
const OFFSET = ['', 'md:mt-14', 'md:mt-6', 'md:mt-20']

const pad = (n) => String(n).padStart(2, '0')

const Tile = memo(function Tile({ photo, index, onOpen, reduce }) {
  const [src, setSrc] = useState(photo.src)

  return (
    <motion.figure
      className={`mb-3 break-inside-avoid sm:mb-6 md:mb-10 ${OFFSET[index % OFFSET.length]}`}
      initial={reduce ? false : { opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, ease: EASE, delay: (index % 3) * 0.1 }}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Open photo ${index + 1}${photo.caption ? `: ${photo.caption}` : ''}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden bg-brown/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose"
      >
        {/* Reveal: the photo settles from a slight zoom as it scrolls into view */}
        <motion.div
          className={`w-full ${RATIO[photo.orientation] || RATIO.portrait}`}
          initial={reduce ? false : { scale: 1.25 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.8, ease: EASE }}
        >
          <img
            src={src}
            alt={photo.alt || ''}
            loading="lazy"
            decoding="async"
            draggable={false}
            onError={() => src !== PLACEHOLDER && setSrc(PLACEHOLDER)}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
          />
        </motion.div>
        <span
          className="pointer-events-none absolute inset-0 bg-midnight/0 transition-colors duration-700 group-hover:bg-midnight/10"
          aria-hidden="true"
        />
      </button>

      <figcaption className="mt-3 flex items-baseline gap-3">
        <span className="label text-brown" style={{ fontSize: '0.6rem' }}>
          {pad(index + 1)}
        </span>
        {photo.caption && (
          <span className="font-serif text-base italic leading-snug text-midnight/80 md:text-xl">
            {photo.caption}
          </span>
        )}
      </figcaption>
    </motion.figure>
  )
})

export default function PhotoGallery({ images = [] }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(null)

  const handleOpen = useCallback((i) => setOpen(i), [])
  const handleClose = useCallback(() => setOpen(null), [])

  return (
    <>
      <div className="columns-2 gap-3 sm:gap-6 md:gap-10 lg:columns-3">
        {images.map((photo, i) => (
          <Tile key={photo.id} photo={photo} index={i} onOpen={handleOpen} reduce={reduce} />
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox key="lightbox" images={images} index={open} onClose={handleClose} onChange={setOpen} />
        )}
      </AnimatePresence>
    </>
  )
}