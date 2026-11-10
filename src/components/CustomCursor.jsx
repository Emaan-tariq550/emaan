import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 })
  const ry = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 })

  // Only for devices with a real mouse
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    const over = (e) => {
      const t = e.target
      setHovering(Boolean(t && t.closest && t.closest('a, button, input, label, [role="button"]')))
    }
    const leave = () => setVisible(false)

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', over)
    root.addEventListener('mouseleave', leave)

    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      root.removeEventListener('mouseleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      {/* Small dot (follows instantly) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] mix-blend-difference"
        style={{ x, y, opacity: visible ? 1 : 0 }}
      >
        <div className="absolute -left-[3px] -top-[3px] h-[6px] w-[6px] rounded-full bg-softwhite" />
      </motion.div>

      {/* Soft ring (follows with a gentle delay, grows on links and buttons) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] mix-blend-difference"
        style={{ x: rx, y: ry, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="absolute -left-[18px] -top-[18px] h-9 w-9 rounded-full border border-softwhite"
          animate={{ scale: hovering ? 1.8 : 1, opacity: hovering ? 0.9 : 0.6 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </motion.div>
    </>
  )
}