import { useState } from 'react'
import { Bow, HeartDoodle } from './doodles'
import DraggablePhoto, { type PlacedPhoto } from './DraggablePhoto'
import type { AlbumPhoto } from '../utils/album'

const SPREADS = 3 // 6 pages
const TOTAL_PAGES = SPREADS * 2

const dottedPaper = {
  backgroundImage: 'radial-gradient(#f2c4d8 1px, transparent 1.3px)',
  backgroundSize: '18px 18px',
} as const

let photoUid = 0

/**
 * The scrapbook — an open notebook with spiral rings and a pink dotted border.
 * Tap a page to make it the active one, tap a shelf photo below to stick it
 * on, then drag / resize / tilt it. Removing it here keeps it on the shelf.
 */
export default function Scrapbook({ photos, placed, onPlacedChange, onBack }: {
  photos: AlbumPhoto[]
  placed: Record<number, PlacedPhoto[]>
  onPlacedChange: (next: Record<number, PlacedPhoto[]>) => void
  onBack: () => void
}) {
  const [spread, setSpread] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const setPlaced = (updater: (prev: Record<number, PlacedPhoto[]>) => Record<number, PlacedPhoto[]>) =>
    onPlacedChange(updater(placed))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const leftPage = spread * 2 + 1
  const rightPage = leftPage + 1

  const selected = Object.values(placed).flat().find((p) => p.instanceId === selectedId) ?? null
  const selectedPage = selected
    ? Number(Object.keys(placed).find((page) => placed[Number(page)].some((p) => p.instanceId === selectedId)))
    : null

  const flip = (next: number) => {
    setSpread(next)
    setActivePage(next * 2 + 1)
    setSelectedId(null)
  }
  const addPhoto = (photo: AlbumPhoto) => {
    const item: PlacedPhoto = {
      instanceId: `bp-${++photoUid}`, dataUrl: photo.dataUrl,
      x: 50, y: 46, scale: 1, rotation: Math.round(Math.random() * 10 - 5),
    }
    setPlaced((prev) => ({ ...prev, [activePage]: [...(prev[activePage] ?? []), item] }))
    setSelectedId(item.instanceId)
  }
  const updatePhoto = (page: number, id: string, patch: Partial<PlacedPhoto>) =>
    setPlaced((prev) => ({ ...prev, [page]: prev[page].map((p) => (p.instanceId === id ? { ...p, ...patch } : p)) }))
  const removePhoto = (page: number, id: string) => {
    setPlaced((prev) => ({ ...prev, [page]: prev[page].filter((p) => p.instanceId !== id) }))
    setSelectedId(null)
  }

  const page = (num: number) => {
    const items = placed[num] ?? []
    return (
      <div key={num}
        className="relative min-h-[300px] overflow-hidden sm:min-h-[460px]"
        style={dottedPaper}
        onPointerDown={() => { setActivePage(num); setSelectedId(null) }}>
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div>
              <p className="font-hand text-3xl font-bold text-pink-deep/50">a blank page ♡</p>
              <p className="mt-1 text-sm font-bold text-ink/35">tap this page, then tap a photo below</p>
            </div>
          </div>
        )}
        {items.map((item) => (
          <DraggablePhoto key={item.instanceId} item={item} selected={selectedId === item.instanceId}
            onSelect={() => { setActivePage(num); setSelectedId(item.instanceId) }}
            onUpdate={(patch) => updatePhoto(num, item.instanceId, patch)} />
        ))}
        {activePage === num && (
          <div className="pointer-events-none absolute inset-0 z-30 border-[3px] border-pink-mid/80" />
        )}
        <span className="absolute bottom-3 z-30 text-xs font-bold text-ink/35"
          style={num % 2 === 1 ? { left: 14 } : { right: 14 }}>
          {num}
        </span>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex items-center gap-2">
        <Bow size={30} className="-rotate-12" />
        <h2 className="font-hand text-4xl font-bold">your scrapbook</h2>
        <HeartDoodle size={24} />
      </div>
      <p className="mt-1 max-w-md text-center text-sm opacity-60">
        tap a page to pick it, then tap one of your photos to stick it on ♡
      </p>

      {/* book: pink dotted border, two dotted pages, spiral rings between */}
      <div className="ink ink-shadow mt-6 w-full max-w-[880px] bg-pink-soft p-3 sm:p-4"
        style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2.6px)', backgroundSize: '20px 20px' }}>
        <div className="ink-sm relative grid grid-cols-2 overflow-hidden bg-white">
          {page(leftPage)}
          {page(rightPage)}

          {/* soft spine shading */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-ink/10 to-transparent" />

          {/* spiral rings */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center justify-evenly py-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="block h-[13px] w-11 rounded-full border-[3px] border-[#9aa0aa] bg-white/50 shadow-sm" />
            ))}
          </div>
        </div>
      </div>

      {/* page turning */}
      <div className="mt-5 flex items-center gap-3">
        <button onClick={() => flip(Math.max(0, spread - 1))} disabled={spread === 0}
          className="ink-sm bg-white px-4 py-1.5 font-bold transition hover:-rotate-1 disabled:opacity-40">
          ← earlier pages
        </button>
        <span className="text-sm font-bold opacity-60">pages {leftPage} · {rightPage} of {TOTAL_PAGES}</span>
        <button onClick={() => flip(Math.min(SPREADS - 1, spread + 1))} disabled={spread === SPREADS - 1}
          className="ink-sm bg-white px-4 py-1.5 font-bold transition hover:rotate-1 disabled:opacity-40">
          later pages →
        </button>
      </div>

      {/* selected photo controls */}
      {selected && selectedPage !== null && (
        <div className="ink ink-shadow-soft mt-4 w-full max-w-[340px] bg-white/85 p-4">
          <p className="flex items-center justify-between font-hand text-2xl font-bold">
            photo on page {selectedPage}
            <button onClick={() => removePhoto(selectedPage, selected.instanceId)}
              className="ink-sm bg-[#ffd9d9] px-2.5 py-1 font-doodle text-xs font-bold">take off ×</button>
          </p>
          <label className="mt-2 flex justify-between text-sm font-bold">size <span>{selected.scale.toFixed(2)}×</span></label>
          <input type="range" min={0.35} max={2.2} step={0.05} value={selected.scale}
            onChange={(e) => updatePhoto(selectedPage, selected.instanceId, { scale: +e.target.value })}
            className="w-full accent-[#c2437f]" />
          <label className="mt-1 flex justify-between text-sm font-bold">tilt <span>{selected.rotation}°</span></label>
          <input type="range" min={-30} max={30} step={1} value={selected.rotation}
            onChange={(e) => updatePhoto(selectedPage, selected.instanceId, { rotation: +e.target.value })}
            className="w-full accent-[#c2437f]" />
          <p className="mt-1 text-xs opacity-60">taking it off the page keeps it safe on your photo shelf</p>
        </div>
      )}

      {/* photo tray — the shelf photos you can stick in */}
      <div className="ink ink-shadow-soft mt-5 w-full max-w-[880px] bg-white/85 p-4">
        <p className="font-hand text-2xl font-bold">
          add a photo to page {activePage} <span className="font-doodle text-sm font-bold text-ink/50">(the page with the pink outline)</span>
        </p>
        {photos.length === 0 ? (
          <p className="mt-2 text-sm opacity-60">no photos on your shelf yet — take some in the booth first ♡</p>
        ) : (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {photos.map((photo) => (
              <button key={photo.id} onClick={() => addPhoto(photo)}
                className="ink-sm shrink-0 bg-white p-1 pb-3 transition hover:-rotate-2"
                aria-label="Add this photo to the page">
                <img src={photo.dataUrl} alt="Shelf photo" className="h-16 w-[86px] object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={onBack}
        className="ink-sm mt-6 bg-white px-5 py-2 font-bold transition hover:rotate-1">
        ← back to photo shelf
      </button>
    </div>
  )
}
