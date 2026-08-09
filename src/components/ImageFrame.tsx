import type { MouseEventHandler } from 'react'

interface ImageFrameProps {
  src: string
  alt: string
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
}

export function ImageFrame({ src, alt, className = '', onClick }: ImageFrameProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`image-frame ${className}`.trim()}
      style={{ backgroundImage: `url(${JSON.stringify(src)})` }}
      onClick={onClick}
    />
  )
}
