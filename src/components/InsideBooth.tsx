import { useEffect, useState } from 'react'
import { captureFrame, useWebcam } from '../hooks/useWebcam'
import { FILTERS } from '../data/filters'
import { FRAMES, type FrameId } from '../data/frames'
import FramePreview from './FramePreview'
import { Bow, HeartDoodle } from './doodles'

export default function InsideBooth({ onExit }: { onExit: () => void }) {
  const cam = useWebcam()
  const [filter, setFilter] = useState(FILTERS[0])
  const [frame, setFrame] = useState<FrameId>('strip')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [flash, setFlash] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  async function takePhoto() {
    if (cam.status !== 'on' || countdown !== null || !cam.videoRef.current) return
    for (const n of [3, 2, 1]) { setCountdown(n); await sleep(880) }
    setCountdown(null)
    const shot = captureFrame(cam.videoRef.current)
    if (shot) {
      setPhoto(shot)
      setFlash(true); window.setTimeout(() => setFlash(false), 480)
    }
  }

  // start the camera as soon as you step inside; stop it when you leave (hook cleanup)
  useEffect(() => { cam.start() }, [cam.start])

  return (
    <div className="paper-bg flex min-h-screen flex-col items-center px-4 py-8 font-doodle text-ink">
      <div className="flex items-center gap-2">
        <Bow size={30} className="-rotate-12" />
        <h2 className="font-hand text-4xl font-bold">you're inside!</h2>
        <HeartDoodle size={24} />
      </div>

      <div className="mt-4 grid items-start justify-center gap-8 lg:grid-cols-[560px_360px]">
        {/* ── left: camera ── */}
        <div className="flex flex-col items-center">
          <div className="ink ink-shadow w-full bg-white p-3">
            <div className="ink-sm relative aspect-[4/3] overflow-hidden bg-blush">
              <video ref={cam.videoRef} autoPlay playsInline muted
                className="-scale-x-100 h-full w-full object-cover transition-[filter] duration-300"
                style={{ display: cam.status === 'on' ? 'block' : 'none', filter: filter.css }} />
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
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/20">
                  <span key={countdown} className="animate-countpop font-hand text-[110px] font-bold leading-none text-white drop-shadow-[0_4px_0_rgba(194,67,127,.7)]">
                    {countdown}
                  </span>
                </div>
              )}
              {flash && <div className="animate-flash pointer-events-none absolute inset-0 bg-white" />}
            </div>
          </div>

          <button onClick={takePhoto} disabled={cam.status !== 'on' || countdown !== null}
            className="ink ink-shadow mt-5 bg-pink-mid px-8 py-2.5 font-hand text-3xl font-bold transition hover:-rotate-1 disabled:opacity-40">
            {countdown !== null ? 'get ready…' : 'take a photo!'}
          </button>

          {photo && (
            <div className="ink ink-shadow-soft mt-5 w-full max-w-[300px] bg-white p-2.5 text-center">
              <img src={photo} alt="Your shot" className="ink-sm w-full" style={{ filter: filter.css }} />
              <p className="mt-1.5 flex items-center justify-center gap-2 text-sm font-bold">
                your shot ♡
                <button onClick={() => setPhoto(null)} className="ink-sm bg-blush px-2.5 py-0.5 text-xs">retake</button>
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f)}
                className={`ink-sm flex items-center gap-2 px-3 py-1.5 text-sm font-bold transition hover:-rotate-1 ${filter.id === f.id ? 'bg-pink-mid' : 'bg-white'}`}>
                <span className="inline-block h-4 w-6 rounded-sm border border-ink/30" style={{ background: f.swatch }} />
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── right: frame picker ── */}
        <div className="flex flex-col items-center">
          <p className="font-hand text-3xl font-bold">pick a frame ♡</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {FRAMES.map((f) => (
              <button key={f.id} onClick={() => setFrame(f.id)}
                className={`ink-sm px-3 py-2 text-left transition hover:-rotate-1 ${frame === f.id ? 'bg-pink-mid' : 'bg-white'}`}>
                <span className="block text-[15px] font-bold leading-tight">{f.name}</span>
                <span className="block text-xs opacity-60">{f.note} · empty for now</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex w-full justify-center">
            <FramePreview frame={frame} />
          </div>
        </div>
      </div>

      <button onClick={onExit}
        className="ink-sm mt-6 bg-white px-5 py-2 font-bold transition hover:rotate-1">
        ← back outside
      </button>
    </div>
  )
}
