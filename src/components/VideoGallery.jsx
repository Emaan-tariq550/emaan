
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import SafeImage from './SafeImage'

const EASE = [0.22, 1, 0.36, 1]
const pad = (n) => String(n).padStart(2, '0')

const fmt = (s) => {
  if (!Number.isFinite(s)) return '0:00'
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

const roundBtn =
  'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-softwhite/20 bg-midnight/50 text-softwhite/85 transition-colors duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold'

/* --------------------------------------------------
   VIDEO CARD
-------------------------------------------------- */

const VideoCard = memo(function VideoCard({
  video,
  number,
  variant,
  playing,
  onRatio,
  onOpen,
  reduce,
  alignRight,
}) {
  const wrapRef = useRef(null)
  const vidRef = useRef(null)

  const [ratio, setRatio] = useState(16 / 9)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  const strip = variant === 'strip'

  // Observe how much of the card is visible
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => onRatio(video.id, entry.intersectionRatio),
      { threshold: [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1] },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      onRatio(video.id, 0)
    }
  }, [video.id, onRatio])

  // Play only the active video
  useEffect(() => {
    const v = vidRef.current
    if (!v || failed) return

    v.muted = true

    if (playing) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [playing, failed])

  const figureClass = strip
    ? 'shrink-0 snap-center'
    : `w-full ${ratio < 1 ? 'max-w-xs md:max-w-sm' : 'md:w-[78%]'} ${alignRight ? 'ml-auto' : ''}`

  const frameClass = strip
    ? 'h-[52svh] w-[72vw] max-w-[82vw] md:h-[62svh] md:w-auto'
    : 'w-full'

  return (
    <motion.figure
      className={figureClass}
      initial={reduce ? false : { y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <div
        ref={wrapRef}
        style={{ aspectRatio: ratio }}
        className={`group relative overflow-hidden bg-midnight ${frameClass}`}
      >
        {/* Poster image */}
        {video.poster && (
          <SafeImage
            src={video.poster}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              ready ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}

        {/* Video */}
        {!failed && (
          <video
            ref={vidRef}
            src={`${video.src}#t=0.1`}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              const { videoWidth, videoHeight } = e.currentTarget

              if (videoWidth && videoHeight) {
                const nextRatio = videoWidth / videoHeight
                setRatio(nextRatio)
                onRatio(video.id, 0)
              }
            }}
            onLoadedData={() => setReady(true)}
            onPlaying={() => setReady(true)}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}

        {/* Failed video */}
        {failed && (
          <div className="absolute inset-0 z-[4] flex items-center justify-center bg-charcoal/75 p-4 text-center">
            <p className="label text-muted" style={{ fontSize: '0.6rem' }}>
              Video unavailable: {video.src}
            </p>
          </div>
        )}

        {/* Bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-midnight/80 to-transparent" />

        {/* Watch indicator */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-[5] flex items-center gap-3 text-softwhite">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-softwhite/40 transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:text-gold">
            <Play size={14} aria-hidden="true" />
          </span>

          <span className="label" style={{ fontSize: '0.6rem' }}>
            Watch
          </span>
        </div>

        {/* Click target */}
        <button
          type="button"
          onClick={() => onOpen(video.id)}
          aria-label={`Open video: ${video.title}`}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-rose"
        />
      </div>

      {/* Caption */}
      <figcaption className={`mt-4 ${strip ? 'w-0 min-w-full' : ''}`}>
        <div className="flex items-baseline gap-4">
          <span className="label text-rose" style={{ fontSize: '0.6rem' }}>
            SCENE {pad(number)}
          </span>

          <span className="font-serif text-lg italic text-softwhite md:text-2xl">
            {video.title}
          </span>
        </div>

        {!strip && video.caption && (
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            {video.caption}
          </p>
        )}
      </figcaption>
    </motion.figure>
  )
})

/* --------------------------------------------------
   FULL SCREEN VIDEO VIEWER
-------------------------------------------------- */

function VideoViewer({ videos, index, onClose, onChange }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const vidRef = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [failed, setFailed] = useState(false)

  const count = videos.length
  const video = videos[index]

  const go = useCallback(
    (d) => {
      if (count > 1) {
        onChange((index + d + count) % count)
      }
    },
    [count, index, onChange],
  )

  const toggle = useCallback(() => {
    const v = vidRef.current
    if (!v) return

    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }, [])

  // Reset viewer when video changes
  useEffect(() => {
    setFailed(false)
    setTime(0)
    setDuration(0)
    setPlaying(false)
  }, [video.id])

  // Lock scroll and manage background music
  useEffect(() => {
    const opener = document.activeElement
    const prevOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const music = document.querySelector('audio')
    let prevVolume = null

    if (music && !music.paused) {
      prevVolume = music.volume
      music.volume = Math.min(prevVolume, 0.08)
    }

    return () => {
      document.body.style.overflow = prevOverflow

      if (music && prevVolume !== null) {
        music.volume = prevVolume
      }

      if (opener && typeof opener.focus === 'function') {
        opener.focus({ preventScroll: true })
      }
    }
  }, [])

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      const onField = e.target.tagName === 'INPUT'

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === ' ' && !e.target.closest('button, input')) {
        e.preventDefault()
        toggle()
      } else if (e.key === 'ArrowRight' && !onField) {
        go(1)
      } else if (e.key === 'ArrowLeft' && !onField) {
        go(-1)
      } else if (e.key === 'Tab' && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll(
          'button, input',
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
  }, [go, onClose, toggle])

  // Video seeking
  const seek = (e) => {
    if (vidRef.current) {
      vidRef.current.currentTime = Number(e.target.value)
    }
  }

  // Volume control
  const changeVolume = (e) => {
    const val = Number(e.target.value)

    setVolume(val)
    setMuted(val === 0)

    if (vidRef.current) {
      vidRef.current.volume = val
      vidRef.current.muted = val === 0
    }
  }

  const toggleMute = () => {
    const next = !muted

    setMuted(next)

    if (vidRef.current) {
      vidRef.current.muted = next
    }
  }

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Video viewer"
      className="fixed inset-0 z-[300] flex flex-col bg-midnight/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div className="min-w-0">
          <p className="label text-rose" style={{ fontSize: '0.6rem' }}>
            SCENE {pad(index + 1)}{' '}
            <span className="text-muted">/ {pad(count)}</span>
          </p>

          <p className="truncate font-serif text-xl italic text-softwhite md:text-2xl">
            {video.title}
          </p>
        </div>

        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close video"
          className={roundBtn}
        >
          <X size={18} />
        </button>
      </div>

      {/* Video stage */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-3 md:px-10">
        <motion.div
          key={video.id}
          className="flex max-h-full max-w-full items-center justify-center"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {failed ? (
            <p className="label max-w-xs text-center text-muted">
              Video not found. Add it as {video.src}
            </p>
          ) : (
            <video
              key={video.id}
              ref={vidRef}
              src={video.src}
              autoPlay
              playsInline
              onClick={toggle}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => {
                const v = e.currentTarget
                setDuration(v.duration)
                v.volume = volume
                v.muted = muted
              }}
              onError={() => setFailed(true)}
              className="max-h-[66svh] max-w-full cursor-pointer bg-black object-contain md:max-h-[72svh]"
            />
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mx-auto flex w-full max-w-4xl items-center gap-2 px-4 pb-6 pt-4 md:gap-4">
        {count > 1 && (
          <button
            onClick={() => go(-1)}
            aria-label="Previous video"
            className={roundBtn}
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <button
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className={roundBtn}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>

        {count > 1 && (
          <button
            onClick={() => go(1)}
            aria-label="Next video"
            className={roundBtn}
          >
            <ChevronRight size={18} />
          </button>
        )}

        <span
          className="label hidden w-10 text-right text-softwhite/70 sm:block"
          style={{ fontSize: '0.6rem' }}
        >
          {fmt(time)}
        </span>

        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={time}
          onChange={seek}
          aria-label="Seek"
          className="h-1 min-w-0 flex-1 cursor-pointer accent-gold"
        />

        <span
          className="label hidden w-10 text-softwhite/70 sm:block"
          style={{ fontSize: '0.6rem' }}
        >
          {fmt(duration)}
        </span>

        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className={roundBtn}
        >
          {muted || volume === 0 ? (
            <VolumeX size={16} />
          ) : (
            <Volume2 size={16} />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={changeVolume}
          aria-label="Volume"
          className="hidden h-1 w-20 cursor-pointer accent-gold sm:block"
        />
      </div>
    </motion.div>
  )
}

/* --------------------------------------------------
   MAIN VIDEO GALLERY
-------------------------------------------------- */

export default function VideoGallery({ videos = [] }) {
  const reduce = useReducedMotion()

  const ratios = useRef({})

  const [activeId, setActiveId] = useState(null)
  const [open, setOpen] = useState(null)
  const [tabHidden, setTabHidden] = useState(false)

  // Select the most visible video
  const onRatio = useCallback((id, ratio) => {
    ratios.current[id] = ratio

    let best = null
    let bestRatio = 0.2

    for (const [key, value] of Object.entries(ratios.current)) {
      if (value >= bestRatio) {
        best = Number(key)
        bestRatio = value
      }
    }

    setActiveId(best)
  }, [])

  // Pause videos when browser tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      setTabHidden(document.hidden)
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // Open viewer
  const handleOpen = useCallback(
    (id) => {
      const index = videos.findIndex((v) => v.id === id)
      if (index !== -1) setOpen(index)
    },
    [videos],
  )

  const handleClose = useCallback(() => {
    setOpen(null)
  }, [])

  // Only one video plays at a time
  const playingId =
    reduce || tabHidden || open !== null ? null : activeId

  const featured = videos.filter((v) => v.featured)
  const strip = videos.filter((v) => !v.featured)

  const numberOf = (video) =>
    videos.findIndex((v) => v.id === video.id) + 1

  if (!videos.length) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl italic text-softwhite">
          No videos added yet.
        </p>
        <p className="mt-3 text-sm text-muted">
          Add your videos in the video data file.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Featured videos */}
      <div className="mx-auto max-w-7xl space-y-20 px-5 md:space-y-32 md:px-12">
        {featured.map((video, i) => (
          <VideoCard
            key={video.id}
            video={video}
            number={numberOf(video)}
            variant="featured"
            alignRight={i % 2 === 1}
            playing={playingId === video.id}
            onRatio={onRatio}
            onOpen={handleOpen}
            reduce={reduce}
          />
        ))}
      </div>

      {/* Horizontal film strip */}
      {strip.length > 0 && (
        <div className="mt-24 md:mt-40">
          <div className="mx-auto mb-8 flex max-w-7xl items-center gap-4 px-5 md:px-12">
            <span className="h-px w-10 bg-rose" aria-hidden="true" />
            <p className="label text-muted">
              THE FILM STRIP — SWIPE OR SCROLL
            </p>
          </div>

          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-6 md:gap-8 md:px-12">
            {strip.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                number={numberOf(video)}
                variant="strip"
                playing={playingId === video.id}
                onRatio={onRatio}
                onOpen={handleOpen}
                reduce={reduce}
              />
            ))}
          </div>
        </div>
      )}

      {/* Full-screen viewer */}
      <AnimatePresence>
        {open !== null && (
          <VideoViewer
            key="viewer"
            videos={videos}
            index={open}
            onClose={handleClose}
            onChange={setOpen}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
