import { useState } from 'react'
import { PLACEHOLDER } from '../data/gallery'

// Lazy image that falls back to the placeholder if the file is missing.
// Use key={src} when the src can change, so the fallback resets.
export default function SafeImage({ src, alt = '', className = '', ...rest }) {
  const [current, setCurrent] = useState(src)
  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => current !== PLACEHOLDER && setCurrent(PLACEHOLDER)}
      className={className}
      {...rest}
    />
  )
}