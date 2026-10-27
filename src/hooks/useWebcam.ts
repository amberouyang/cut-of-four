import { useCallback, useEffect, useRef, useState } from 'react'

export type WebcamStatus = 'idle' | 'on' | 'error'

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<WebcamStatus>('idle')
  const [error, setError] = useState('')

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      setStatus('on')
      setError('')
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Camera permission denied')
    }
  }, [])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setStatus('idle')
  }, [])

  useEffect(() => () => stop(), [stop])

  return { videoRef, status, error, start, stop }
}

/**
 * Grab one mirrored frame from the live video as a data URL (4:3, like the preview).
 * Pass a CSS filter string to bake that filter into the pixels.
 */
export function captureFrame(video: HTMLVideoElement, filterCss = 'none'): string | null {
  const vw = video.videoWidth, vh = video.videoHeight
  if (!vw || !vh) return null
  const target = 4 / 3
  let sw = vw, sh = vw / target
  if (sh > vh) { sh = vh; sw = vh * target }
  const c = document.createElement('canvas')
  c.width = 960; c.height = 720
  const ctx = c.getContext('2d')!
  ctx.filter = filterCss
  ctx.translate(c.width, 0); ctx.scale(-1, 1) // mirror, same as preview
  ctx.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, c.width, c.height)
  return c.toDataURL('image/jpeg', 0.92)
}
