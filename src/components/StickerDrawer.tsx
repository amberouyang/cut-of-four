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
  return (
    <span className="ink-sm inline-block whitespace-nowrap bg-white px-2.5 py-1 font-doodle font-bold"
      style={{ fontSize: size * 0.34 }}>{d.content}</span>
  )
}

export default function StickerDrawer({ onPick }: { onPick: (stickerId: string) => void }) {
  return (
    <div className="ink ink-shadow-soft w-full max-w-[340px] bg-white/85 p-4">
      <p className="font-hand text-2xl font-bold">sticker drawer ♡</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {STICKERS.map((s) => (
          <button key={s.id} onClick={() => onPick(s.id)} title={s.label}
            className="ink-sm flex min-h-[54px] flex-col items-center justify-center gap-0.5 bg-blush px-1 py-1.5 transition hover:-rotate-2 hover:bg-pink-soft">
            <StickerVisual stickerId={s.id} size={30} />
            <span className="text-[10px] font-bold leading-none">{s.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs opacity-60">tap one to stick it on your frame — tap a placed sticker to peel it off (dragging comes next!)</p>
    </div>
  )
}
