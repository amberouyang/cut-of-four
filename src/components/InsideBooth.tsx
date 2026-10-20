import { useEffect } from 'react'
import { useWebcam } from '../hooks/useWebcam'
import { Bow, HeartDoodle } from './doodles'

export default function InsideBooth({ onExit }: { onExit: () => void }) {
  const cam = useWebcam()

  // start the camera as soon as you step inside; stop it when you leave (hook cleanup)
  useEffect(() => { cam.start() }, [cam.start])

  return (
    <div className="paper-bg flex min-h-screen flex-col items-center justify-center px-4 py-8 font-doodle text-ink">
      <div className="flex items-center gap-2">
        <Bow size={30} className="-rotate-12" />
        <h2 className="font-hand text-4xl font-bold">you're inside!</h2>
        <HeartDoodle size={24} />
      </div>

      <div className="ink ink-shadow mt-4 w-full max-w-[560px] bg-white p-3">
        <div className="ink-sm relative aspect-[4/3] overflow-hidden bg-blush">
          <video ref={cam.videoRef} autoPlay playsInline muted
            className="-scale-x-100 h-full w-full object-cover"
            style={{ display: cam.status === 'on' ? 'block' : 'none' }} />
          {cam.status !== 'on' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="max-w-xs text-lg leading-snug">
                {cam.status === 'error'
                  ? `camera didn't start: ${cam.error}`
                  : 'your camera is off — allow access to see yourself ♡'}
              </p>
              <button onClick={cam.start}
                className="ink-sm bg-pink-mid px-5 py-2 font-bold transition hover:-rotate-1">
                turn camera on
              </button>
            </div>
          )}
          {cam.status === 'on' && (
            <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-0.5 text-sm font-bold">
              ● live — mirrored
            </span>
          )}
        </div>
      </div>

      <button onClick={onExit}
        className="ink-sm mt-5 bg-white px-5 py-2 font-bold transition hover:rotate-1">
        ← back outside
      </button>
    </div>
  )
}
