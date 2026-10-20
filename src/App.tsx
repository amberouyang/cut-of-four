const SWATCHES = [
  ['cream', 'bg-cream'], ['blush', 'bg-blush'], ['pink soft', 'bg-pink-soft'],
  ['pink mid', 'bg-pink-mid'], ['pink deep', 'bg-pink-deep'], ['ink', 'bg-ink'],
] as const

export default function App() {
  return (
    <div className="paper-bg flex min-h-screen flex-col items-center justify-center gap-2 font-doodle text-ink">
      <p className="font-hand text-6xl font-bold">cut of four</p>
      <p className="text-xl">a little photobooth, drawn by hand ♡</p>
      <p className="font-romantic text-2xl italic">Love is Blooming</p>
      <div className="mt-4 flex gap-2">
        {SWATCHES.map(([name, bg]) => (
          <div key={name} className="text-center">
            <div className={`h-10 w-14 rounded-lg border border-ink/20 ${bg}`} />
            <p className="mt-1 text-xs">{name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
