import { Bow, HeartDoodle, Sparkle, Squiggle, StarDoodle } from './components/doodles'

const SWATCHES = [
  ['cream', 'bg-cream'], ['blush', 'bg-blush'], ['pink soft', 'bg-pink-soft'],
  ['pink mid', 'bg-pink-mid'], ['pink deep', 'bg-pink-deep'], ['ink', 'bg-ink'],
] as const

export default function App() {
  return (
    <div className="paper-bg flex min-h-screen items-center justify-center font-doodle text-ink">
      <div className="ink ink-shadow-soft bg-white/80 px-10 py-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <Bow size={38} className="-rotate-12" />
          <p className="font-hand text-6xl font-bold">cut of four</p>
          <StarDoodle size={30} className="rotate-12" />
        </div>
        <Squiggle className="mx-auto mt-1 w-52 opacity-70" />
        <p className="mt-1 text-xl">a little photobooth, drawn by hand ♡</p>
        <p className="font-romantic mt-1 text-2xl italic">Love is Blooming</p>
        <div className="mt-5 flex justify-center gap-2">
          {SWATCHES.map(([name, bg]) => (
            <div key={name} className="text-center">
              <div className={`ink-sm h-10 w-14 ${bg}`} />
              <p className="mt-1 text-xs">{name}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-end justify-center gap-5">
          <span><Bow size={46} /><br /><span className="text-xs">bow</span></span>
          <span><HeartDoodle size={46} /><br /><span className="text-xs">heart</span></span>
          <span><Sparkle size={46} /><br /><span className="text-xs">sparkle</span></span>
          <span><StarDoodle size={46} /><br /><span className="text-xs">star</span></span>
        </div>
        <button className="ink-sm mt-5 bg-pink-soft px-5 py-2 font-bold transition hover:-rotate-1">
          hover me — pixel hand ♡
        </button>
      </div>
    </div>
  )
}
