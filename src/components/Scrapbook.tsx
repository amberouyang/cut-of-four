import { useState } from 'react'
import { Bow, HeartDoodle } from './doodles'

const SPREADS = 3 // 6 pages for now — photos move in during the next step

const dottedPaper = {
  backgroundImage: 'radial-gradient(#f2c4d8 1px, transparent 1.3px)',
  backgroundSize: '18px 18px',
} as const

/**
 * The scrapbook — an open notebook with spiral rings and a pink dotted
 * border, from the inspiration pictures. Pages are blank in this step;
 * adding shelf photos onto them comes next.
 */
export default function Scrapbook({ onBack }: { onBack: () => void }) {
  const [spread, setSpread] = useState(0)
  const leftPage = spread * 2 + 1
  const rightPage = leftPage + 1

  const page = (num: number) => (
    <div key={num} className="relative flex min-h-[300px] items-center justify-center sm:min-h-[460px]"
      style={dottedPaper}>
      <div className="px-6 text-center">
        <p className="font-hand text-3xl font-bold text-pink-deep/50">a blank page ♡</p>
        <p className="mt-1 text-sm font-bold text-ink/35">your photos will live here soon</p>
      </div>
      <span className="absolute bottom-3 text-xs font-bold text-ink/35"
        style={num % 2 === 1 ? { left: 14 } : { right: 14 }}>
        {num}
      </span>
    </div>
  )

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex items-center gap-2">
        <Bow size={30} className="-rotate-12" />
        <h2 className="font-hand text-4xl font-bold">your scrapbook</h2>
        <HeartDoodle size={24} />
      </div>
      <p className="mt-1 max-w-md text-center text-sm opacity-60">
        a little book for your favorite photos ♡ flip through it
      </p>

      {/* book: pink dotted border, two dotted pages, spiral rings between */}
      <div className="ink ink-shadow mt-6 w-full max-w-[880px] bg-pink-soft p-3 sm:p-4"
        style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2.6px)', backgroundSize: '20px 20px' }}>
        <div className="ink-sm relative grid grid-cols-2 overflow-hidden bg-white">
          {page(leftPage)}
          {page(rightPage)}

          {/* soft spine shading */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-ink/10 to-transparent" />

          {/* spiral rings */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 flex -translate-x-1/2 flex-col items-center justify-evenly py-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="block h-[13px] w-11 rounded-full border-[3px] border-[#9aa0aa] bg-white/50 shadow-sm" />
            ))}
          </div>
        </div>
      </div>

      {/* page turning */}
      <div className="mt-5 flex items-center gap-3">
        <button onClick={() => setSpread((s) => Math.max(0, s - 1))} disabled={spread === 0}
          className="ink-sm bg-white px-4 py-1.5 font-bold transition hover:-rotate-1 disabled:opacity-40">
          ← earlier pages
        </button>
        <span className="text-sm font-bold opacity-60">pages {leftPage} · {rightPage}</span>
        <button onClick={() => setSpread((s) => Math.min(SPREADS - 1, s + 1))} disabled={spread === SPREADS - 1}
          className="ink-sm bg-white px-4 py-1.5 font-bold transition hover:rotate-1 disabled:opacity-40">
          later pages →
        </button>
      </div>

      <button onClick={onBack}
        className="ink-sm mt-6 bg-white px-5 py-2 font-bold transition hover:rotate-1">
        ← back to photo shelf
      </button>
    </div>
  )
}
