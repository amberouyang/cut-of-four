import { useRef } from 'react'
import DecorVisual from './DecorVisual'

export type PlacedDecor = {
  instanceId: string
  decorId: string
  x: number // % across the page
  y: number // % down the page
  scale: number
  rotation: number
}

interface Props {
  item: PlacedDecor
  selected: boolean
  onSelect: () => void
  onUpdate: (patch: Partial<PlacedDecor>) => void
  onRemove: () => void
}

/** A decoration stuck onto a scrapbook page — drag to move, scroll to resize, × takes it off. */
export default function DraggableDecor({ item, selected, onSelect, onUpdate, onRemove }: Props) {
  const drag = useRef<{ px: number; py: number; sx: number; sy: number; w: number; h: number } | null>(null)

  return (
    <div
      role="button" aria-label="Decoration on page — drag to move"
      className={`group absolute z-30 touch-none select-none ${selected ? 'outline-2 outline-dashed outline-pink-deep' : ''}`}
      style={{
        left: `${item.x}%`, top: `${item.y}%`,
        transform: `translate(-50%,-50%) rotate(${item.rotation}deg) scale(${item.scale})`,
      }}
      onPointerDown={(e) => {
        e.stopPropagation(); onSelect()
        const page = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
        drag.current = { px: e.clientX, py: e.clientY, sx: item.x, sy: item.y, w: page.width, h: page.height }
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!drag.current) return
        const d = drag.current
        onUpdate({
          x: Math.min(94, Math.max(6, d.sx + ((e.clientX - d.px) / d.w) * 100)),
          y: Math.min(94, Math.max(6, d.sy + ((e.clientY - d.py) / d.h) * 100)),
        })
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onWheel={(e) => {
        e.stopPropagation()
        onUpdate({ scale: Math.min(2.4, Math.max(0.35, item.scale + (e.deltaY < 0 ? 0.08 : -0.08))) })
      }}
    >
      <DecorVisual decorId={item.decorId} />
      <button type="button" aria-label="Take this decoration off the page"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className={`absolute -right-2.5 -top-2.5 z-30 flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-[#ffd9d9] text-sm font-bold leading-none transition hover:rotate-90 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        ×
      </button>
    </div>
  )
}
