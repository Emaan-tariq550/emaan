import { motion } from 'framer-motion'
import VideoGallery from '../components/VideoGallery'
import ChapterTransition from '../components/ChapterTransition'
import { videos } from '../data/videos'

const EASE = [0.22, 1, 0.36, 1]

export default function MovingMemories() {
  return (
    <section id="videos" className="relative bg-charcoal text-softwhite">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 md:px-12 md:pb-28">
        <motion.p
          className="label flex items-center gap-4 text-rose"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <span className="h-px w-10 bg-rose" aria-hidden="true" />
          CHAPTER 03 — MOVING MEMORIES
        </motion.p>

        <h2 className="display mt-6" style={{ fontSize: 'clamp(3.2rem, 10vw, 9rem)' }}>
          {['Moving', 'Memories'].map((word, i) => (
            <span key={word} className="block overflow-hidden pb-2">
              <motion.span
                className={`block ${i === 1 ? 'italic text-muted' : ''}`}
                initial={{ y: '110%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 1.4, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.p
          className="mt-8 max-w-xl font-serif text-xl italic leading-relaxed text-softwhite/80 md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.2 }}
        >
          Some memories are too beautiful to remain still.
        </motion.p>
      </div>

      <VideoGallery videos={videos} />

      {/* Charcoal deepens into dark olive for the next chapter */}
      <div className="mt-20 md:mt-32">
        <ChapterTransition from="charcoal" to="olive" height="h-48 md:h-72" />
      </div>
    </section>
  )
}