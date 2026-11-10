import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import LoadingScreen from './components/LoadingScreen'
import IntroScreen from './components/IntroScreen'
import MusicPlayer from './components/MusicPlayer'
import Navigation from './components/Navigation'
import CustomCursor from './components/CustomCursor'

import Beginning from './sections/Beginning'
import LittleMoments from './sections/LittleMoments'
import MovingMemories from './sections/MovingMemories'
import MyWorld from './sections/MyWorld'
import AboutMe from './sections/AboutMe'
import Achievements from './sections/Achievements'
import FinalChapter from './sections/FinalChapter'

const TARGET_VOLUME = 0.6

// Gently raises the volume from 0 so the music fades in
function fadeInAudio(audio, target = TARGET_VOLUME, duration = 2500) {
  const steps = 25
  let step = 0
  audio.volume = 0
  const id = setInterval(() => {
    step += 1
    audio.volume = Math.min(target, (target * step) / steps)
    if (step >= steps) clearInterval(id)
  }, duration / steps)
}

export default function App() {
  // 'loading' -> 'intro' -> 'main'
  const [phase, setPhase] = useState('loading')
  const audioRef = useRef(null)

  const handleLoaded = useCallback(() => setPhase('intro'), [])

  // Runs inside the visitor's click, so the browser allows the sound.
  const handleEnter = (withMusic) => {
    const audio = audioRef.current
    if (withMusic && audio) {
      fadeInAudio(audio)
      audio.play().catch(() => {})
    }
    setPhase('main')
  }

  return (
    <>
      <CustomCursor />

      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        {phase === 'loading' && <LoadingScreen key="loading" onDone={handleLoaded} />}
        {phase === 'intro' && <IntroScreen key="intro" onEnter={handleEnter} />}
        {phase === 'main' && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          >
            <Beginning />
            <LittleMoments />
            <MovingMemories />
            <MyWorld />
            <AboutMe />
            <Achievements />
            <FinalChapter />
          </motion.main>
        )}
      </AnimatePresence>

      {phase === 'main' && <Navigation />}

      {/* Always mounted so the music never restarts */}
      <MusicPlayer audioRef={audioRef} visible={phase === 'main'} />
    </>
  )
}