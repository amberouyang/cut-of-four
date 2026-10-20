import { useRef } from 'react'

export type PlacedPhoto = {
  instanceId: string
  dataUrl: string
  x: number // % across the page
  y: number // % down the page
  scale: number
  rotation: number
}

interface Props {
  item: PlacedPhoto
  selected: boolean
  onSelect: () => void
  onUpdate: (patch: Partial<PlacedPhoto>) => void
}

/** A photo stuck onto a scrapbook page — drag to move, scroll to resize. */
export default function DraggablePhoto({ item, selected, onSelect, onUpdate }: Props) {
  const drag = useRef<{ px: number; py: number; sx: number; sy: number; w: number; h: number } | null>(null)

  return (
    <div
      role="button" aria-label="Photo on page — drag to move"
      className={`absolute z-20 touch-none select-none ${selected ? 'outline-2 outline-dashed outline-pink-deep' : ''}`}
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
          x: Math.min(92, Math.max(8, d.sx + ((e.clientX - d.px) / d.w) * 100)),
          y: Math.min(92, Math.max(8, d.sy + ((e.clientY - d.py) / d.h) * 100)),
        })
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onWheel={(e) => {
        e.stopPropagation()
        onUpdate({ scale: Math.min(2.2, Math.max(0.35, item.scale + (e.deltaY < 0 ? 0.08 : -0.08))) })
      }}
    >
      <div className="w-[120px] bg-white p-1.5 pb-5 shadow-[0_3px_10px_rgba(35,35,35,0.22)] outline outline-1 outline-ink/15 sm:w-[150px]">
        <img src={item.dataUrl} alt="Placed scrapbook photo" draggable={false}
          className="aspect-[4/3] w-full object-cover" />
      </div>
    </div>
  )
}
