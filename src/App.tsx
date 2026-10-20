const SWATCHES = [
  ['cream', 'bg-cream'], ['blush', 'bg-blush'], ['pink soft', 'bg-pink-soft'],
  ['pink mid', 'bg-pink-mid'], ['pink deep', 'bg-pink-deep'], ['ink', 'bg-ink'],
] as const

export default function App() {
  return (
    <div className="paper-bg flex min-h-screen items-center justify-center font-doodle text-ink">
      <div className="ink ink-shadow-soft bg-white/80 px-10 py-8 text-center">
        <p className="font-hand text-6xl font-bold">cut of four</p>
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
        <button className="ink-sm mt-5 bg-pink-soft px-5 py-2 font-bold transition hover:-rotate-1">
          hover me — pixel hand ♡
        </button>
      </div>
    </div>
  )
}
