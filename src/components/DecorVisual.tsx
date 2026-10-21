import { decorById } from '../data/decor'
import { StickerVisual } from './StickerDrawer'
import { Bow } from './doodles'

const jaggedEnds = {
  clipPath: 'polygon(4% 0, 96% 6%, 100% 30%, 97% 62%, 100% 88%, 95% 100%, 5% 94%, 0 78%, 3% 45%, 0 18%)',
} as const

/** Renders one scrapbook decoration, in a tray or placed on a page. */
export default function DecorVisual({ decorId, small = false }: { decorId: string; small?: boolean }) {
  const d = decorById(decorId)

  if (d.kind === 'sticker') return <StickerVisual stickerId={d.stickerId!} size={small ? 30 : 52} />
  if (d.kind === 'bow') return <Bow size={small ? 40 : 84} />

  if (d.kind === 'tape') {
    const bg =
      d.variant === 'dot'
        ? { backgroundColor: '#ffeef5', backgroundImage: 'radial-gradient(#f9a8c9 2.4px, transparent 3px)', backgroundSize: '13px 13px' }
        : d.variant === 'picnic'
          ? {
              backgroundColor: '#fdf2f7',
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(249,168,201,.45) 0 7px, transparent 7px 14px), repeating-linear-gradient(90deg, rgba(147,197,253,.4) 0 7px, transparent 7px 14px)',
            }
          : {
              backgroundColor: 'rgba(249,168,201,.55)',
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,.35) 0 6px, transparent 6px 12px)',
            }
    return (
      <div style={{ ...jaggedEnds, ...bg }} className={small ? 'h-[18px] w-[64px]' : 'h-[30px] w-[118px]'} />
    )
  }

  if (d.kind === 'bandaid') {
    return (
      <div className={`relative ${small ? 'h-[22px] w-[68px]' : 'h-[38px] w-[124px]'}`}>
        <div className="absolute inset-0 rounded-full border border-pink-deep/25"
          style={d.variant === 'star'
            ? { backgroundColor: '#fde7f3', backgroundImage: 'radial-gradient(#fff 1.6px, transparent 2.2px)', backgroundSize: '15px 11px' }
            : { backgroundColor: '#ffd6e7', backgroundImage: 'radial-gradient(#fff 1.8px, transparent 2.4px)', backgroundSize: '13px 13px' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[4px] bg-white/55"
          style={{ width: '34%', height: '62%' }} />
      </div>
    )
  }

  // speech bubble — words can go here in a later step; cute empty for now
  return (
    <div className={`relative ${small ? 'h-[36px] w-[56px]' : 'h-[64px] w-[104px]'}`}>
      <div className="absolute inset-0 rounded-[46%] bg-pink-soft shadow-[inset_0_0_0_2px_rgba(194,67,127,.25)]" />
      <div className="absolute -bottom-[7px] left-[22%] h-[16px] w-[16px] rotate-45 bg-pink-soft shadow-[inset_-2px_-2px_0_rgba(194,67,127,.18)]" />
    </div>
  )
}
