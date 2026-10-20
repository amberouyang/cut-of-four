import BoothCover from './components/BoothCover'
import { Bow, HeartDoodle, Sparkle } from './components/doodles'

export default function App() {
  return (
    <div className="paper-bg flex min-h-screen flex-col items-center justify-center px-4 py-10 font-doodle text-ink">
      <div className="flex items-center gap-2">
        <Bow size={34} className="-rotate-12" />
        <h1 className="font-hand text-5xl font-bold">cut of four</h1>
        <Sparkle size={28} className="rotate-12" />
      </div>
      <p className="mt-1 flex items-center gap-1.5 text-lg">
        a little photobooth, drawn by hand <HeartDoodle size={18} />
      </p>
      <div className="relative mt-4">
        <BoothCover />
      </div>
    </div>
  )
}
