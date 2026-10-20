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
