import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { gallery, specialPhotos } from '../data/gallery'

// The loading screen stays at least this long so it never just flashes.
const MIN_DURATION = 2000
// Safety net: if something hangs, open the site anyway after this long.
const MAX_DURATION = 8000

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [bgFailed, setBgFailed] = useState(false)

  useEffect(() => {
    // Images we wait for before opening the site.
    const urls = [
      specialPhotos.introBackground,
      specialPhotos.heroBackground,
      ...gallery.slice(0, 3).map((p) => p.src),
    ]

    let loaded = 0
    let cancelled = false
    let doneTimer
    const started = performance.now()

    const finish = () => {
      if (cancelled) return
      const wait = Math.max(0, MIN_DURATION - (performance.now() - started))
      doneTimer = setTimeout(() => !cancelled && onDone(), wait)
    }

    // A missing image counts as "finished" so the site never gets stuck.
    const bump = () => {
      loaded += 1
      if (cancelled) return
      setProgress(loaded / urls.length)
      if (loaded === urls.length) finish()
    }

    const images = urls.map((url) => {
      const img = new Image()
      img.onload = bump
      img.onerror = bump
      img.src = url
      return img
    })

    const safety = setTimeout(() => !cancelled && onDone(), MAX_DURATION)

    return () => {
      cancelled = true
      clearTimeout(doneTimer)
      clearTimeout(safety)
      images.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-midnight"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      role="status"
      aria-label="Loading"
    >
      {/* The first photograph slowly appears as loading progresses */}
      {!bgFailed && (
        <motion.img
          src={specialPhotos.introBackground}
          alt=""
          aria-hidden="true"
          onError={() => setBgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'blur(14px) grayscale(0.4)' }}
          animate={{ opacity: progress * 0.35 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/40 to-midnight/80" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          className="label text-gold"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          {`E M A A N`}
        </motion.p>

        {/* Thin gold progress line = real loading progress */}
        <div className="mt-8 h-px w-48 overflow-hidden bg-muted/30 md:w-64">
          <motion.div
            className="h-full w-full origin-left bg-gold"
            animate={{ scaleX: progress }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}