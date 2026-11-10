import { motion } from 'framer-motion'
import PhotoGallery from '../components/PhotoGallery'
import { gallery } from '../data/gallery'

const EASE = [0.22, 1, 0.36, 1]

export default function LittleMoments() {
  return (
    <section id="moments" className="relative bg-ivory text-midnight">
      {/* Midnight melts into warm ivory */}
      <div aria-hidden="true" className="h-40 bg-gradient-to-b from-midnight to-ivory md:h-64" />

      <div className="mx-auto max-w-7xl px-5 pb-24 md:px-12 md:pb-36">
        <header className="mb-14 grid gap-8 md:mb-28 md:grid-cols-12">
          <div className="md:col-span-8">
            <motion.p
              className="label flex items-center gap-4 text-brown"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <span className="h-px w-10 bg-rose" aria-hidden="true" />
              CHAPTER 02 — LITTLE MOMENTS
            </motion.p>

            <h2 className="display mt-6" style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}>
              {['Little', 'Moments'].map((word, i) => (
                <span key={word} className="block overflow-hidden pb-2">
                  <motion.span
                    className={`block ${i === 1 ? 'italic text-rose' : ''}`}
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
          </div>

          <motion.p
            className="font-serif text-xl italic leading-relaxed text-brown md:col-span-4 md:self-end md:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
          >
            A few pages from my own photography book. Tap any picture to step inside it.
          </motion.p>
        </header>

        <PhotoGallery images={gallery} />
      </div>

      {/* Ivory slowly darkens into charcoal for the video chapter */}
      <div aria-hidden="true" className="h-48 bg-gradient-to-b from-ivory to-charcoal md:h-72" />
    </section>
  )
}