import { STICKERS, stickerById } from '../data/stickers'
import { Bow, HeartDoodle, Sparkle, StarDoodle } from './doodles'

/** Renders one sticker, whether in the drawer or placed on a frame. */
export function StickerVisual({ stickerId, size = 40 }: { stickerId: string; size?: number }) {
  const d = stickerById(stickerId)
  if (d.kind === 'doodle') {
    if (d.content === 'bow') return <Bow size={size} />
    if (d.content === 'heart') return <HeartDoodle size={size} />
    if (d.content === 'sparkle') return <Sparkle size={size} />
    return <StarDoodle size={size} />
  }
  if (d.kind === 'emoji') return <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>{d.content}</span>
  if (d.kind === 'date')
    return <span className="font-mono font-bold text-[#ffb340]" style={{ fontSize: size * 0.42, textShadow: '0 1px 4px rgba(0,0,0,.55)' }}>{d.content}</span>
  // drawer previews are tiny: let the badge text wrap so its whole border fits the cell
  const small = size < 25
  return (
    <span className={`ink-sm inline-block bg-white font-doodle font-bold ${small ? 'whitespace-normal text-center leading-tight' : 'whitespace-nowrap px-2.5 py-1'}`}
      style={{ fontSize: size * 0.34, ...(small ? { maxWidth: 62, padding: '2px 5px' } : {}) }}>{d.content}</span>
  )
}

export default function StickerDrawer({ onPick }: { onPick: (stickerId: string) => void }) {
  return (
    <div className="ink ink-shadow-soft w-full max-w-[340px] bg-white/85 p-4">
      <p className="font-hand text-2xl font-bold">sticker drawer ♡</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {STICKERS.map((s) => (
          <button key={s.id} onClick={() => onPick(s.id)} title={s.label}
            className="ink-sm flex min-h-[54px] flex-col items-center justify-center gap-0.5 overflow-hidden bg-blush px-1 py-1.5 transition hover:-rotate-2 hover:bg-pink-soft">
            <span className="flex max-w-full items-center justify-center overflow-hidden">
              <StickerVisual stickerId={s.id} size={s.kind === 'badge' ? 17 : s.kind === 'date' ? 20 : 30} />
            </span>
            <span className="text-[10px] font-bold leading-none">{s.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs opacity-60">tap one to stick it on your frame, then drag it around and scroll on it to resize</p>
    </div>
  )
}
