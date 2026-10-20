import type { FrameId } from '../data/frames'
import { Bow, HeartDoodle, Sparkle, StarDoodle } from './doodles'

interface SlotProps {
  className?: string
  label?: string
  photo?: string | null
  filterCss?: string
  onClear?: () => void
}

/** A photo slot — empty placeholder, or the captured shot (click a filled slot to clear it). */
function Slot({ className = '', label = '( photo )', photo, filterCss, onClear }: SlotProps) {
  if (photo) {
    return (
      <div className={`group relative overflow-hidden border-2 border-ink ${className}`} onClick={onClear} title="click to clear this slot">
        <img src={photo} alt="Captured" className="h-full w-full object-cover" style={{ filter: filterCss }} />
        <span className="absolute right-1 top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-white/90 text-xs font-bold group-hover:flex">×</span>
      </div>
    )
  }
  return (
    <div className={`flex items-center justify-center border-2 border-ink bg-white ${className}`}>
      <span className="font-hand text-2xl text-ink/50">{label}</span>
    </div>
  )
}

interface PreviewProps {
  frame: FrameId
  photos?: (string | null)[]
  filterCss?: string
  onClearSlot?: (index: number) => void
}

function Strip({ photos = [], filterCss, onClearSlot }: PreviewProps) {
  return (
    <div className="mx-auto w-[240px] bg-[#fff7fa] px-4 pb-5 pt-3 shadow-[0_10px_30px_rgba(35,35,35,.18)] ring-1 ring-ink/20">
      <p className="font-romantic text-center text-[15px] italic leading-tight text-ink/80">
        To be in love<br />To touch with a light hand
      </p>
      <div className="relative mt-2 flex flex-col gap-2.5">
        <HeartDoodle size={26} className="absolute -left-3 -top-3 z-10 -rotate-12" />
        {[0, 1, 2, 3].map((i) => (
          <Slot key={i} className="aspect-[4/3] w-full" label="" photo={photos[i]} filterCss={filterCss} onClear={() => onClearSlot?.(i)} />
        ))}
        <Sparkle size={24} className="absolute -right-2 top-[38%] z-10" />
      </div>
      <p className="font-romantic mt-3 text-center text-[26px] italic leading-none">Love is Blooming</p>
    </div>
  )
}

function StudentId({ photos = [], filterCss, onClearSlot }: PreviewProps) {
  return (
    <div className="ink w-[340px] overflow-hidden bg-pink-soft">
      <div className="flex items-center justify-between border-b-2 border-ink bg-white px-4 py-2">
        <span className="font-doodle text-xl font-bold tracking-wide">STUDENT ID</span>
        <span className="flex items-center gap-1"><Bow size={24} /><StarDoodle size={20} /></span>
      </div>
      <div className="flex gap-4 p-4">
        <Slot className="aspect-[3/4] w-[118px] shrink-0" photo={photos[0]} filterCss={filterCss} onClear={() => onClearSlot?.(0)} />
        <div className="relative flex-1 font-doodle text-[17px] leading-[2.1]">
          <p>Name:</p><p>Class:</p><p>School:</p>
          <HeartDoodle size={18} className="absolute right-2 top-8 opacity-70" fill="#fff" />
          <div className="mt-6 border-t-2 border-ink pt-0.5 text-center text-sm">Sign:</div>
        </div>
      </div>
    </div>
  )
}

function Music({ photos = [], filterCss, onClearSlot }: PreviewProps) {
  return (
    <div className="w-[280px] rounded-[28px] bg-pink-soft p-4 shadow-[0_10px_30px_rgba(35,35,35,.18)]">
      <Slot className="aspect-square w-full rounded-[18px] border-none" label="" photo={photos[0]} filterCss={filterCss} onClear={() => onClearSlot?.(0)} />
      <div className="mt-4 px-1">
        <div className="relative h-[6px] rounded-full bg-white">
          <div className="absolute inset-y-0 left-0 w-[18%] rounded-full bg-[#5b2338]" />
          <span className="absolute left-[18%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5b2338]" />
        </div>
        <div className="mt-1 flex justify-between font-doodle text-sm text-[#5b2338]"><span>0:35</span><span>-2:50</span></div>
        <div className="mt-1 flex items-center justify-between px-2 text-[#5b2338]">
          <span className="text-lg">⤨</span><span className="text-2xl">⏮</span>
          <span className="text-3xl">❚❚</span><span className="text-2xl">⏭</span><span className="text-lg">↻</span>
        </div>
      </div>
    </div>
  )
}

function Instagram({ photos = [], filterCss, onClearSlot }: PreviewProps) {
  return (
    <div className="ink w-[300px] bg-white p-3.5 shadow-[0_10px_30px_rgba(35,35,35,.15)]">
      <div className="flex items-center gap-2 pb-2.5">
        <span className="font-romantic text-lg italic font-semibold">Instagram</span>
        <span className="ml-auto text-ink/70">➤</span>
      </div>
      <div className="flex items-center gap-2 pb-2">
        <span className="h-7 w-7 rounded-full border-2 border-pink-mid bg-blush" />
        <span className="h-2.5 w-20 rounded-full bg-ink/15" />
        <span className="ml-auto font-bold">⋮</span>
      </div>
      <Slot className="aspect-square w-full" label="" photo={photos[0]} filterCss={filterCss} onClear={() => onClearSlot?.(0)} />
      <div className="flex items-center gap-3 pt-2.5 text-xl">
        <HeartDoodle size={24} fill="#e0245e" />
        <span>💬</span><span>➤</span>
        <span className="ml-auto">🔖</span>
      </div>
      <div className="flex items-center justify-between pt-2 text-lg text-ink/80">
        <span>⌂</span><span>⌕</span><span>＋</span><span>♡</span><span>☺</span>
      </div>
    </div>
  )
}

export default function FramePreview(props: PreviewProps) {
  if (props.frame === 'student-id') return <StudentId {...props} />
  if (props.frame === 'music') return <Music {...props} />
  if (props.frame === 'instagram') return <Instagram {...props} />
  return <Strip {...props} />
}
