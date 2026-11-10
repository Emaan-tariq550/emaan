import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { siteConfig } from '../data/memories'

// Animated sound-wave bars (animation is defined in index.css)
function SoundWave({ active }) {
  const heights = [60, 100, 70, 90, 50]
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`wave-bar ${active ? 'is-active' : ''}`}
          style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// The <audio> element lives here, but it is ALWAYS mounted (even before the
// visitor enters), so the music never restarts while scrolling.
export default function MusicPlayer({ audioRef, visible }) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.6)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const audio = () => audioRef.current

  const togglePlay = () => {
    const a = audio()
    if (!a || error) return
    if (a.paused) a.play().catch(() => {})
    else a.pause()
  }

  const toggleMute = () => {
    const a = audio()
    if (a) a.muted = !a.muted
  }

  const changeVolume = (e) => {
    const a = audio()
    if (!a) return
    const v = Number(e.target.value)
    a.volume = v
    a.muted = v === 0
  }

  const seek = (e) => {
    const a = audio()
    if (a) a.currentTime = Number(e.target.value)
  }

  const progress = duration ? (time / duration) * 100 : 0

  return (
    <>
      <audio
        ref={audioRef}
        src={siteConfig.music.src}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration)
          setError(false)
        }}
        onVolumeChange={(e) => {
          setVolume(e.currentTarget.volume)
          setMuted(e.currentTarget.muted)
        }}
        onError={() => setError(true)}
      />

      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-4 right-4 z-[90] md:bottom-6 md:right-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
          >
            <div className="relative overflow-hidden rounded-full border border-gold/30 bg-midnight/80 backdrop-blur-md">
              <div className="flex items-center gap-1 px-2 py-2">
                <button
                  onClick={togglePlay}
                  disabled={error}
                  aria-label={playing ? 'Pause music' : 'Play music'}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gold transition-colors hover:bg-gold/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>

                {/* Tap the waves to open/close the sliders (works on touch screens) */}
                <button
                  onClick={() => setExpanded((v) => !v)}
                  aria-label="Toggle music controls"
                  aria-expanded={expanded}
                  className="flex h-9 cursor-pointer items-center px-2"
                >
                  <SoundWave active={playing && !muted} />
                </button>

                <button
                  onClick={toggleMute}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-softwhite/80 transition-colors hover:bg-gold/15 hover:text-gold"
                >
                  {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              {/* Thin progress line */}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-muted/20">
                <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Expanded panel: volume + seek */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  className="absolute bottom-full right-0 mb-3 w-56 rounded-2xl border border-gold/25 bg-midnight/90 p-4 backdrop-blur-md"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  {error ? (
                    <p className="text-xs leading-relaxed text-muted">
                      Music file not found. Add your song as
                      <span className="text-gold"> public/music/background.mp3</span>
                    </p>
                  ) : (
                    <>
                      <p className="label mb-3 truncate text-gold">{siteConfig.music.title}</p>

                      <label className="block">
                        <span className="sr-only">Seek</span>
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          step="0.1"
                          value={time}
                          onChange={seek}
                          className="w-full cursor-pointer accent-gold"
                        />
                      </label>
                      <div className="mb-3 flex justify-between text-[10px] text-muted">
                        <span>{formatTime(time)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>

                      <label className="flex items-center gap-3">
                        <span className="label text-muted">Vol</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={muted ? 0 : volume}
                          onChange={changeVolume}
                          aria-label="Volume"
                          className="w-full cursor-pointer accent-gold"
                        />
                      </label>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}