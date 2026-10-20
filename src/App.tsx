import { useState } from 'react'
import BoothCover from './components/BoothCover'
import InsideBooth from './components/InsideBooth'
import { Bow, Sparkle } from './components/doodles'

type Stage = 'cover' | 'opening' | 'inside'

export default function App() {
  const [stage, setStage] = useState<Stage>('cover')

  const enter = () => {
    if (stage !== 'cover') return
    setStage('opening')
    window.setTimeout(() => setStage('inside'), 1000)
  }

  if (stage === 'inside') return <InsideBooth onExit={() => setStage('cover')} />

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
