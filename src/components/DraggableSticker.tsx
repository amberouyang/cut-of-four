import { useRef } from 'react'
import type { StickerInstance } from '../data/stickers'
import { StickerVisual } from './StickerDrawer'

interface Props {
  inst: StickerInstance
  selected: boolean
  onSelect: () => void
  onUpdate: (patch: Partial<StickerInstance>) => void
}

/** A placed sticker you can drag (Pointer Events), scroll to scale, and select for the sliders. */
export default function DraggableSticker({ inst, selected, onSelect, onUpdate }: Props) {
  const drag = useRef<{ px: number; py: number; sx: number; sy: number; w: number; h: number } | null>(null)

  return (
    <div
      role="button" aria-label="Sticker — drag to move"
      className={`absolute z-20 touch-none select-none ${selected ? 'rounded outline-2 outline-dashed outline-pink-deep' : ''}`}
      style={{
        left: `${inst.x}%`, top: `${inst.y}%`,
        transform: `translate(-50%,-50%) rotate(${inst.rotation}deg) scale(${inst.scale})`,
      }}
      onPointerDown={(e) => {
        e.stopPropagation(); onSelect()
        const frame = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
        drag.current = { px: e.clientX, py: e.clientY, sx: inst.x, sy: inst.y, w: frame.width, h: frame.height }
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!drag.current) return
        const d = drag.current
        onUpdate({
          x: Math.min(97, Math.max(3, d.sx + ((e.clientX - d.px) / d.w) * 100)),
          y: Math.min(97, Math.max(3, d.sy + ((e.clientY - d.py) / d.h) * 100)),
        })
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onWheel={(e) => {
        e.stopPropagation()
        onUpdate({ scale: Math.min(2.4, Math.max(0.45, inst.scale + (e.deltaY < 0 ? 0.08 : -0.08))) })
      }}
    >
      <StickerVisual stickerId={inst.stickerId} size={44} />
    </div>
  )
}
