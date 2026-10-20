import { useState } from 'react'
import BoothCover from './components/BoothCover'
import { Bow, Sparkle } from './components/doodles'

type Stage = 'cover' | 'opening' | 'inside'

export default function App() {
  const [stage, setStage] = useState<Stage>('cover')

  const enter = () => {
    if (stage !== 'cover') return
    setStage('opening')
    window.setTimeout(() => setStage('inside'), 1000)
  }

  if (stage === 'inside') {
    return (
      <div className="paper-bg flex min-h-screen flex-col items-center justify-center px-4 font-doodle text-ink">
        <div className="ink ink-shadow-soft bg-white/85 px-10 py-9 text-center">
          <p className="font-hand text-5xl font-bold">you're inside! ♡</p>
          <p className="mt-2 text-lg">the camera comes in the next step…</p>
          <button onClick={() => setStage('cover')}
            className="ink-sm mt-5 bg-pink-soft px-5 py-2 font-bold transition hover:-rotate-1">
            ← back outside
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="paper-bg flex min-h-screen flex-col items-center justify-center px-4 py-10 font-doodle text-ink">
      <div className="flex items-center gap-2">
        <Bow size={34} className="-rotate-12" />
        <h1 className="font-hand text-5xl font-bold">cut of four</h1>
        <Sparkle size={28} className="rotate-12" />
      </div>
      <BoothCover opening={stage === 'opening'} onEnter={enter} />
    </div>
  )
}
