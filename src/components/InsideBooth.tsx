import { useEffect, useRef, useState } from 'react'
import { captureFrame, useWebcam } from '../hooks/useWebcam'
import { FILTERS } from '../data/filters'
import { FRAMES, type FrameId } from '../data/frames'
import FramePreview, { DEFAULT_TEXTS, type FrameTexts } from './FramePreview'
import StickerDrawer from './StickerDrawer'
import DraggableSticker from './DraggableSticker'
import { stickerById, type StickerInstance } from '../data/stickers'
import { exportNodePng } from '../utils/exportPng'
import PhotoAlbum from './PhotoAlbum'
import Scrapbook from './Scrapbook'
import type { PlacedPhoto } from './DraggablePhoto'
import type { PlacedDecor } from './DraggableDecor'
import { loadAlbum, removeFromAlbum, saveToAlbum, setPhotoFeatured, type AlbumPhoto } from '../utils/album'

let stickerUid = 0
import { Bow, HeartDoodle } from './doodles'

type View = 'shoot' | 'decorate' | 'album' | 'book'

export default function InsideBooth({ onExit }: { onExit: () => void }) {
  const cam = useWebcam()
  const [filter, setFilter] = useState(FILTERS[0])
  const [frame, setFrame] = useState<FrameId>('strip')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [flash, setFlash] = useState(false)
  const [shooting, setShooting] = useState(false)
  const [shotLabel, setShotLabel] = useState('')
  // photos are kept per frame, so switching frames doesn't lose your shots
  const [allPhotos, setAllPhotos] = useState<Record<FrameId, (string | null)[]>>({
    strip: [null, null, null, null], 'student-id': [null], music: [null], instagram: [null],
  })
  const [texts, setTexts] = useState<FrameTexts>(DEFAULT_TEXTS)
  const [allStickers, setAllStickers] = useState<Record<FrameId, StickerInstance[]>>({
    strip: [], 'student-id': [], music: [], instagram: [],
  })
  // two-part flow: shoot your photos first, then decorate the finished frame
  const [view, setView] = useState<View>('shoot')
  // photo shelf: every shot is kept in the browser (see utils/album)
  const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([])
  // scrapbook pages live here so peeking at the shelf doesn't empty the book
  const [bookPlaced, setBookPlaced] = useState<Record<number, PlacedPhoto[]>>({})
  const [bookDecor, setBookDecor] = useState<Record<number, PlacedDecor[]>>({})
  useEffect(() => { loadAlbum().then(setAlbumPhotos).catch(() => {}) }, [])
  const deleteAlbumPhoto = (id: number) => {
    removeFromAlbum(id).catch(() => {})
    setAlbumPhotos((prev) => prev.filter((p) => p.id !== id))
  }
  const toggleFeatured = (photo: AlbumPhoto) => {
    const next = !photo.featured
    setPhotoFeatured(photo.id, next).catch(() => {})
    setAlbumPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, featured: next } : p)))
  }
  const stickers = allStickers[frame]
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null)
  const selectedSticker = stickers.find((s) => s.instanceId === selectedStickerId) ?? null
  const updateSticker = (id: string, patch: Partial<StickerInstance>) =>
    setAllStickers((prev) => ({ ...prev, [frame]: prev[frame].map((s) => (s.instanceId === id ? { ...s, ...patch } : s)) }))
  const addSticker = (stickerId: string) => {
    const inst: StickerInstance = {
      instanceId: `st-${++stickerUid}`, stickerId,
      x: 25 + Math.random() * 45, y: 25 + Math.random() * 40,
      scale: 1, rotation: Math.round(Math.random() * 20 - 10),
    }
    setAllStickers((prev) => ({ ...prev, [frame]: [...prev[frame], inst] }))
    setSelectedStickerId(inst.instanceId)
  }
  const peelSticker = (instanceId: string) => {
    setAllStickers((prev) => ({ ...prev, [frame]: prev[frame].filter((s) => s.instanceId !== instanceId) }))
    setSelectedStickerId(null)
  }
  // undo history for photos you clear (× on a slot) or shoot over
  const [undoStack, setUndoStack] = useState<{ frame: FrameId; index: number; photo: string }[]>([])
  const undoLastPhoto = () => {
    const last = undoStack[undoStack.length - 1]
    if (!last) return
    setAllPhotos((prev) => ({
      ...prev,
      [last.frame]: prev[last.frame].map((p, i) => (i === last.index ? last.photo : p)),
    }))
    setUndoStack((s) => s.slice(0, -1))
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault(); undoLastPhoto()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undoStack])
  // for multi-photo frames: a slot tapped in the strip becomes the single-retake target
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const selectFrame = (id: FrameId) => { setFrame(id); setSelectedSlot(null) }
  const photos = allPhotos[frame]
  const photoCount = FRAMES.find((f) => f.id === frame)!.photoCount
  const filled = photos.filter(Boolean).length

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  async function countdownOnce() {
    for (const n of [3, 2, 1]) { setCountdown(n); await sleep(880) }
    setCountdown(null)
  }
  function snapInto(index: number): boolean {
    if (!cam.videoRef.current) return false
    const shot = captureFrame(cam.videoRef.current)
    if (!shot) return false
    const previous = allPhotos[frame][index]
    if (previous) setUndoStack((s) => [...s, { frame, index, photo: previous }])
    setAllPhotos((prev) => ({
      ...prev,
      [frame]: prev[frame].map((p, i) => (i === index ? shot : p)),
    }))
    // and keep a copy on the photo shelf
    saveToAlbum(shot).then((saved) => setAlbumPhotos((prev) => [saved, ...prev])).catch(() => {})
    setFlash(true); window.setTimeout(() => setFlash(false), 480)
    return true
  }
  async function takePhoto() {
    if (cam.status !== 'on' || shooting) return
    setShooting(true)
    let gotShot = false
    try {
      if (photoCount === 4 && selectedSlot === null) {
        // strip: automated 4-shot burst, countdown before each
        for (let i = 0; i < 4; i++) {
          setShotLabel(`shot ${i + 1} of 4`)
          await countdownOnce(); gotShot = snapInto(i) || gotShot; await sleep(420)
        }
      } else {
        // single shot — into the tapped slot on multi-photo frames, or the only slot
        const target = photoCount === 4 ? (selectedSlot ?? 0) : 0
        setShotLabel(photoCount === 4 ? `retaking photo ${target + 1}` : 'say cheese!')
        await countdownOnce(); gotShot = snapInto(target)
        setSelectedSlot(null)
      }
    } finally { setShooting(false); setShotLabel('') }
    // photos done — off to decorating!
    if (gotShot) setView('decorate')
  }
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [exporting, setExporting] = useState(false)
  async function doExport() {
    if (!frameRef.current || exporting) return
    setSelectedStickerId(null) // keep the selection outline out of the png
    await new Promise((r) => setTimeout(r, 60))
    setExporting(true)
    try { await exportNodePng(frameRef.current, frame) } finally { setExporting(false) }
  }
  const clearSlot = (index: number) => {
    const previous = allPhotos[frame][index]
    if (previous) setUndoStack((s) => [...s, { frame, index, photo: previous }])
    setAllPhotos((prev) => ({ ...prev, [frame]: prev[frame].map((p, i) => (i === index ? null : p)) }))
  }

  // camera only runs while shooting; it rests on the decorate / shelf / book screens
  useEffect(() => {
    if (view === 'shoot') cam.start()
    else cam.stop()
  }, [view, cam.start, cam.stop])

  // clicking anywhere outside a sticker (or its control card) removes the pink outline
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest('[data-sticker], [data-sticker-controls]')) setSelectedStickerId(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  if (view === 'album') {
    return (
      <div className="paper-bg flex min-h-screen flex-col items-center px-4 py-8 font-doodle text-ink">
        <PhotoAlbum photos={albumPhotos} onBack={() => setView('shoot')} onDelete={deleteAlbumPhoto}
          onOpenBook={() => setView('book')} onToggleFeatured={toggleFeatured} />
      </div>
    )
  }

  if (view === 'book') {
    return (
      <div className="paper-bg flex min-h-screen flex-col items-center px-4 py-8 font-doodle text-ink">
        <Scrapbook photos={albumPhotos} placed={bookPlaced} onPlacedChange={setBookPlaced}
          decor={bookDecor} onDecorChange={setBookDecor}
          onBack={() => setView('album')} />
      </div>
    )
  }

  if (view === 'decorate') {
    return (
      <div className="paper-bg flex min-h-screen flex-col items-center px-4 py-8 font-doodle text-ink">
        <div className="flex items-center gap-2">
          <Bow size={30} className="-rotate-12" />
          <h2 className="font-hand text-4xl font-bold">decorate it!</h2>
          <HeartDoodle size={24} />
        </div>
        <p className="mt-1 text-sm opacity-60">your finished frame — make it yours ♡</p>
        <button onClick={() => setView('shoot')}
          className="ink-sm mt-3 bg-pink-mid px-4 py-1.5 font-bold transition hover:-rotate-1">
          ← take more photos
        </button>

        <div className="mt-5 grid items-stretch justify-center gap-8 lg:grid-cols-[auto_360px]">
          {/* ── the finished frame ── */}
          <div className="flex flex-col items-center">
            <div className="relative" ref={frameRef} onPointerDown={() => setSelectedStickerId(null)}>
              <FramePreview frame={frame} photos={photos} filterCss={filter.css} onClearSlot={clearSlot} texts={texts}
                selectedSlot={selectedSlot}
                onSelectSlot={(i) => setSelectedSlot((cur) => (cur === i ? null : i))} />
              {stickers.map((s) => (
                <DraggableSticker key={s.instanceId} inst={s} selected={selectedStickerId === s.instanceId}
                  onSelect={() => setSelectedStickerId(s.instanceId)}
                  onUpdate={(patch) => updateSticker(s.instanceId, patch)} />
              ))}
            </div>
            {photoCount === 4 && (
              <p className="mt-3 max-w-[300px] text-center text-sm opacity-60">
                tap any single photo in the strip to retake just that one
              </p>
            )}
            {selectedSlot !== null && (
              <button onClick={() => setView('shoot')}
                className="ink ink-shadow mt-3 bg-pink-mid px-6 py-2 font-hand text-2xl font-bold transition hover:-rotate-1">
                retake photo {selectedSlot + 1} in the booth →
              </button>
            )}
            {undoStack.length > 0 && (
              <button onClick={undoLastPhoto}
                className="ink-sm mt-3 bg-white px-4 py-1.5 text-sm font-bold transition hover:-rotate-1">
                ↩ undo — bring that photo back ({undoStack.length})
              </button>
            )}

            {/* spacer: pushes "write on it" down so its bottom lines up with the sticker drawer's bottom */}
            <div className="flex-1" />

            {/* text editor — right under the photo it belongs to */}
            <div className="ink ink-shadow-soft mt-4 w-full max-w-[340px] bg-white/85 p-4">
              <p className="font-hand text-2xl font-bold">write on it ✎</p>
              <div className="mt-2 flex flex-col gap-2">
                {({
                  strip: [
                    ['stripHeader', 'top words'], ['stripFooter', 'big words at the bottom'],
                  ],
                  'student-id': [
                    ['idName', 'Name'], ['idClass', 'Class'], ['idSchool', 'School'], ['idSign', 'Sign'],
                  ],
                  music: [
                    ['songTitle', 'song title'], ['songArtist', 'artist'],
                  ],
                  instagram: [
                    ['igUser', 'username'], ['igCaption', 'caption'],
                  ],
                }[frame] as [keyof FrameTexts, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm font-bold">
                    <span className="w-28 shrink-0">{label}</span>
                    <input value={texts[key]} placeholder={label}
                      onChange={(e) => setTexts((t) => ({ ...t, [key]: e.target.value }))}
                      className="ink-sm min-w-0 flex-1 bg-blush px-2.5 py-1.5 font-doodle outline-none placeholder:text-ink/30" />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── decorating tools ── */}
          <div className="flex flex-col items-center">
            <p className="font-hand text-3xl font-bold">try another frame ♡</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {FRAMES.map((f) => (
                <button key={f.id} onClick={() => selectFrame(f.id)}
                  className={`ink-sm px-3 py-2 text-left transition hover:-rotate-1 ${frame === f.id ? 'bg-pink-mid' : 'bg-white'}`}>
                  <span className="block text-[15px] font-bold leading-tight">{f.name}</span>
                  <span className="block text-xs opacity-60">{f.note}</span>
                </button>
              ))}
            </div>

            {/* spacer: pushes the drawer down so its bottom lines up with "write on it" */}
            <div className="flex-1" />

            <div className="mt-4">
              <StickerDrawer onPick={addSticker} />
            </div>
          </div>
        </div>

        {selectedSticker && (
          <div data-sticker-controls="true" className="ink ink-shadow-soft mt-4 w-full max-w-[340px] bg-white/85 p-4">
            <p className="flex items-center justify-between font-hand text-2xl font-bold">
              {stickerById(selectedSticker.stickerId).label} sticker
              <button onClick={() => peelSticker(selectedSticker.instanceId)}
                className="ink-sm bg-[#ffd9d9] px-2.5 py-1 font-doodle text-xs font-bold">peel off ×</button>
            </p>
            <label className="mt-2 flex justify-between text-sm font-bold">size <span>{selectedSticker.scale.toFixed(2)}×</span></label>
            <input type="range" min={0.45} max={2.4} step={0.05} value={selectedSticker.scale}
              onChange={(e) => updateSticker(selectedSticker.instanceId, { scale: +e.target.value })}
              className="w-full accent-[#c2437f]" />
            <label className="mt-1 flex justify-between text-sm font-bold">tilt <span>{selectedSticker.rotation}°</span></label>
            <input type="range" min={-90} max={90} step={1} value={selectedSticker.rotation}
              onChange={(e) => updateSticker(selectedSticker.instanceId, { rotation: +e.target.value })}
              className="w-full accent-[#c2437f]" />
            <p className="mt-1 text-xs opacity-60">or drag it, and scroll on it to resize</p>
          </div>
        )}

        <button onClick={doExport} disabled={exporting}
          className="ink ink-shadow mt-5 bg-ink px-7 py-2.5 font-hand text-3xl font-bold text-white transition hover:-rotate-1 disabled:opacity-50">
          {exporting ? 'making your png…' : 'download this frame ♡'}
        </button>
        <p className="mt-1.5 text-xs opacity-60">photos + filter + stickers + words, at 3× size</p>

        <button onClick={() => setView('album')}
          className="ink-sm mt-4 bg-white px-4 py-1.5 font-bold transition hover:-rotate-1">
          your photo shelf ♡ ({albumPhotos.length})
        </button>

        <button onClick={onExit}
          className="ink-sm mt-6 bg-white px-5 py-2 font-bold transition hover:rotate-1">
          ← back outside
        </button>
      </div>
    )
  }

  // ── shoot screen ──
  return (
    <div className="paper-bg flex min-h-screen flex-col items-center px-4 py-8 font-doodle text-ink">
      <div className="flex items-center gap-2">
        <Bow size={30} className="-rotate-12" />
        <h2 className="font-hand text-4xl font-bold">you're inside!</h2>
        <HeartDoodle size={24} />
      </div>
      <button onClick={() => setView('album')}
        className="ink-sm mt-3 bg-white px-4 py-1.5 font-bold transition hover:-rotate-1">
        your photo shelf ♡ ({albumPhotos.length})
      </button>

      <p className="mt-6 font-hand text-3xl font-bold">pick a frame ♡</p>
      <div className="mt-2 grid w-full max-w-[920px] grid-cols-2 gap-2 sm:grid-cols-4">
        {FRAMES.map((f) => (
          <button key={f.id} onClick={() => selectFrame(f.id)}
            className={`ink-sm px-3 py-2 text-left transition hover:-rotate-1 ${frame === f.id ? 'bg-pink-mid' : 'bg-white'}`}>
            <span className="block text-[15px] font-bold leading-tight">{f.name}</span>
            <span className="block text-xs opacity-60">{f.note}</span>
          </button>
        ))}
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

      <button onClick={takePhoto} disabled={cam.status !== 'on' || shooting}
        className="ink ink-shadow mt-5 bg-pink-mid px-8 py-2.5 font-hand text-3xl font-bold transition hover:-rotate-1 disabled:opacity-40">
        {shooting ? (shotLabel || 'get ready…')
          : selectedSlot !== null ? `retake photo ${selectedSlot + 1}!`
          : photoCount === 4 ? 'start 4-shot burst!' : 'take a photo!'}
      </button>
      <p className="mt-2 max-w-[480px] text-center text-sm opacity-60">
        {selectedSlot !== null
          ? <>photo {selectedSlot + 1} is picked — the shutter replaces <b>only that one</b> (old one goes to undo). <button className="underline" onClick={() => setSelectedSlot(null)}>cancel</button></>
          : photoCount === 4
            ? '4 shots in a row, countdown before each — then off to decorating!'
            : 'one shot into this frame — then off to decorating!'} · {filled}/{photoCount} filled
      </p>
      {undoStack.length > 0 && (
        <button onClick={undoLastPhoto}
          className="ink-sm mt-2 bg-white px-4 py-1.5 text-sm font-bold transition hover:-rotate-1">
          ↩ undo — bring that photo back ({undoStack.length})
        </button>
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

        {/* ── right: live frame preview ── */}
        <div className="flex flex-col items-center">
          <p className="font-hand text-3xl font-bold">your frame so far ♡</p>
          <div className="relative mt-3">
            <FramePreview frame={frame} photos={photos} filterCss={filter.css} onClearSlot={clearSlot} texts={texts}
              selectedSlot={selectedSlot}
              onSelectSlot={(i) => setSelectedSlot((cur) => (cur === i ? null : i))} />
          </div>
          <p className="mt-3 max-w-[300px] text-center text-sm opacity-60">
            {filled}/{photoCount} filled — tap a photo in the frame to retake just that one
          </p>
          {filled > 0 && (
            <button onClick={() => setView('decorate')}
              className="ink ink-shadow mt-4 bg-ink px-7 py-2.5 font-hand text-3xl font-bold text-white transition hover:-rotate-1">
              decorate your photo →
            </button>
          )}
        </div>
      </div>

      <button onClick={onExit}
        className="ink-sm mt-6 bg-white px-5 py-2 font-bold transition hover:rotate-1">
        ← back outside
      </button>
    </div>
  )
}
